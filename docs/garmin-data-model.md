# Garmin data model proposal (REVIEW ONLY)

Models + initial migration + bulk-import API + loader script. Nothing here is
merged or run against production without Thomas's explicit OK.

## Scope (user decision, 2026-11-14)

**Sports activity stats only.** Activity-level stats, lap/split details and
sports training metrics are in scope. Excluded by Thomas's explicit choice:
daily fitness summaries, night sleep, continuous wellness monitoring,
per-second GPS/sensor samples, and segment files. There is no high-volume
tier, and no storage decision is needed.

## Source contract

The export root contains `DI_CONNECT/` with these in-scope families:

| Family | Files | Content |
| --- | --- | --- |
| `DI-Connect-Fitness/*_summarizedActivities.json` | paged shards | activity summaries (~93 fields) with nested split arrays |
| `DI-Connect-Uploaded-Files/*.zip` | zip archives | original activity `.FIT` files (session/lap/event/sport/device messages) |
| `DI-Connect-Metrics/*.json` | one series/file | VO2max, race predictions, endurance/hill score, training status, acute load, heat/altitude, MaxMet |
| `DI-Connect-Fitness/*_{gear,personalRecord,workout,weekly_training_report}.json` | one file each | gear + activity links, PRs, workouts, weekly reports |
| `DI-Connect-Routing/*_courses_*.json` | paged | courses |

Out of scope: daily summaries (UDS), sleep, training readiness, hydration,
goals, monitoring/segment/wellness FIT files, and all account/customer data.
These are still listed in the source-file manifest as excluded entries so
coverage is auditable, but they are never parsed or imported.

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
   `device_info`, `activity`, `zones_target`, `hrv` messages and developer
   data (resolved through each file's own field descriptions) value-level
   into `garmin_activity_file.fit_messages`, keyed by FIT field number with
   raw values - no semantic names or unit conversions guessed. Undocumented
   message types are never decoded.

The parser (`apps/garmin/fitdec.py`) is regression-tested against synthetic
files for every FIT base type, endianness, arrays, sentinels, strings,
developer definitions and compressed-timestamp headers, and was
cross-checked against the maintained `fitparse` library on real files.

## Model overview (21 tables)

All tables are owner-scoped (`auth_user` FK), `garmin_` prefixed, and every
row carries a `raw`/`extra` JSONB of the source record so nothing the export
contains is lost even where no typed column exists yet.

Core:
- `garmin_import_batch` — one row per bulk API call (dataset, counts, status)
- `garmin_source_file` — manifest: one row per file found in the export
  (path, size, sha256, class: imported/excluded)
- `garmin_activity` — activity summary + `raw` JSONB
- `garmin_activity_split` — per-lap/km splits, metrics as JSONB
- `garmin_activity_split_summary` — per-activity split-type aggregates
- `garmin_activity_file` — FIT reference (sha256, size, record_count,
  fit_messages, match status, NULLable activity FK)

Sports training metric series (one table each):
- `garmin_vo2max`, `garmin_race_prediction`, `garmin_endurance_score`,
  `garmin_hill_score`, `garmin_training_status`, `garmin_acute_training_load`,
  `garmin_heat_altitude_acclimation`, `garmin_max_met`

Supporting:
- `garmin_gear`, `garmin_gear_activity_link`, `garmin_personal_record`,
  `garmin_workout`, `garmin_workout_schedule`, `garmin_course`,
  `garmin_weekly_report`

## Import flow

`api/scripts/garmin_export_import.py` (stdlib + requests) runs locally against
the extracted ZIP, scans FIT headers with the app's parser, and posts batches
to `POST /api/apps/garmin/import/<dataset>/` (JWT). The API maps and upserts
records keyed by natural IDs and writes a manifest row per source file.
Idempotent: re-running an import updates in place. Out-of-scope export files
are recorded in the manifest as excluded and never read beyond classification.

## Open items

1. Actual free-db size check: the `instinct_readonly` role's login failed at
   proposal time; not blocking (the in-scope tables are small).
2. Merge: Thomas's explicit review only.
