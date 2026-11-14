# Garmin data model proposal (REVIEW ONLY)

Models + initial migration + bulk-import API + loader script. Nothing here is
merged or run against production without Thomas's explicit OK.

## Scope (user decision, 2026-11-14)

**Sports activities only.** The activity summaries and their lap/split
details, plus a traceable reference to each original FIT file, are in scope.
Excluded by Thomas's explicit choice: daily fitness summaries, night sleep,
continuous wellness monitoring, per-second GPS/sensor samples, segment
files, all gear/equipment data (gear lists, gear-activity links, and device
metadata inside activity records and FIT files), the standalone training
metric series (VO2max, race predictions, endurance/hill score, training
status, acute load, heat/altitude acclimation, MaxMet), personal records,
workouts, courses and weekly reports. There is no high-volume tier, and no
storage decision is needed.

## Source contract

The export root contains `DI_CONNECT/` with these in-scope families:

| Family | Files | Content |
| --- | --- | --- |
| `DI-Connect-Fitness/*_summarizedActivities.json` | paged shards | activity summaries (~93 fields) with nested split arrays |
| `DI-Connect-Uploaded-Files/*.zip` | zip archives | original activity `.FIT` files (session/lap/event/sport messages) |

Everything else in the export is out of scope: those files are never parsed
or imported.

### Units (verified against real records, owned by `mapping.py`)

- distances and elevations: centimeters -> meters
- speeds: 0.1 m/s -> m/s
- HR/power zone times and durations: milliseconds -> seconds where noted
- timestamps: epoch ms (activities), epoch s (some metrics), or ISO strings;
  all normalized to UTC datetimes
- FIT timestamps: seconds since 1989-12-31 UTC (kept raw in `fit_messages`)

### FIT files

Filename IDs do not match activity IDs. Each activity FIT is linked to its
activity by unique session start timestamp within ±5 s. No silent attachment:
zero matches -> orphan row with NULL activity FK; multiple matches within the
window -> `ambiguous` match status, NULL FK.

Preservation has two distinct layers:

1. **Raw bytes.** The original FIT bytes (the only truly lossless form) stay
   in the user's own export archive. `garmin_activity_file` keeps sha256 +
   size + `record_count` + `storage_ref` per file - a verifiable reference,
   NOT a copy. No bytes are uploaded anywhere.
2. **Decoded layer.** The loader decodes `session`, `lap`, `event`, `sport`,
   `activity`, `zones_target`, `hrv` messages and developer
   data (resolved through each file's own field descriptions) value-level
   into `garmin_activity_file.fit_messages`, keyed by FIT field number with
   raw values - no semantic names or unit conversions guessed. Undocumented
   message types are never decoded.

The parser (`apps/garmin/fitdec.py`) is regression-tested against synthetic
files for every FIT base type, endianness, arrays, sentinels, strings,
developer definitions and compressed-timestamp headers, and was
cross-checked against the maintained `fitparse` library on real files.

## Model overview (4 tables)

All tables are owner-scoped (`auth_user` FK), `garmin_` prefixed, and the
activity table carries a `raw` JSONB of the source record (with gear/device
keys stripped per the scope exclusion) so no in-scope field is lost even
where no typed column exists yet.

Domain (sports activities):
- `garmin_activity` — activity summary + `raw` JSONB
- `garmin_activity_split` — per-lap/km splits, metrics as JSONB (N:1 activity)
- `garmin_activity_split_summary` — per-activity split-type aggregates (N:1 activity)
- `garmin_activity_file` — FIT reference: sha256, size, record_count,
  fit_messages, match status, NULLable activity FK (N:1 activity)

No ingest bookkeeping tables: import progress, counts and errors are the
loader script's console output, not database rows.

## Import flow

`api/scripts/garmin_export_import.py` (stdlib + requests) runs locally against
the extracted ZIP, scans FIT headers with the app's parser, and posts batches
to `POST /api/apps/garmin/import/<dataset>/` (JWT). The API maps and upserts
records keyed by natural IDs. Idempotent: re-running an import updates in
place.

## Open items

1. Actual free-db size check: the `instinct_readonly` role's login failed at
   proposal time; not blocking (the in-scope tables are small).
2. Merge: Thomas's explicit review only.
