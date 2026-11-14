# Garmin data model proposal (REVIEW ONLY)

Models + initial migration + bulk-import API + loader script. Nothing here is
merged or run against production without Thomas's explicit OK.

## Context

Import a Garmin "Export Your Data" archive (GDPR export) into the app so
activity-level stats and aggregations become possible across all sports. The
source archive stays local; only parsed records travel to the API.

## Source contract

The export root contains `DI_CONNECT/` with these families:

| Family | Files | Content |
| --- | --- | --- |
| `DI-Connect-Fitness/*_summarizedActivities.json` | paged shards | activity summaries (~93 fields) with nested split arrays |
| `DI-Connect-Uploaded-Files/*.zip` | zip archives | original `.FIT` files (activity, monitoring, segments, wellness) |
| `DI-Connect-Aggregator/UDSFile_*.json` | one/day | daily summaries (steps, HR, stress, body battery, floors...) |
| `DI-Connect-Wellness/*_sleepData.json` | one/night | sleep with levels and scores |
| `DI-Connect-Metrics/*.json` | one series/file | readiness, VO2max, race predictions, endurance/hill score, training status, acute load, heat/altitude, MaxMet |
| `DI-Connect-Aggregator/HydrationLogFile_*.json` | logs | hydration entries and activity sweat loss |
| `DI-Connect-Fitness/*_{gear,personalRecord,workout,weekly_training_report}.json` | one file each | gear + activity links, PRs, workouts, weekly reports |
| `DI-Connect-Routing/*_courses_*.json` | paged | courses |
| `DI-Connect-User/UserGoal_*.json` | one file | goals |

Out of scope by design (imported as `excluded` manifest rows only):
`customer_data/`, account/billing files, and `DI-Connect-User/` other than
goals.

### Units (verified against real records, owned by `mapping.py`)

- distances and elevations: centimeters -> meters
- speeds: 0.1 m/s -> m/s
- HR/power zone times and durations: milliseconds -> seconds where noted
- timestamps: epoch ms (activities), epoch s (some metrics), or ISO strings
  (some wellness/goal fields); all normalized to UTC datetimes
- FIT timestamps: seconds since 1989-12-31 UTC

### FIT files

Filename IDs do not match activity IDs. Each activity FIT is linked to its
activity by unique session start timestamp within ±5 s. No silent attachment:
zero matches -> orphan row with NULL activity FK; multiple matches within the
window -> `ambiguous` match status, NULL FK. Multi-sport files keep one file
row per file.

Preservation has two distinct layers:

1. **Raw bytes.** The original FIT bytes (the only truly lossless form)
   stay in the user's own export archive. `garmin_activity_file` keeps
   sha256 + size + `storage_ref` per file - a verifiable reference, NOT a
   copy. No bytes are uploaded anywhere without explicit approval (option D).
2. **Decoded layer.** Typed columns cover known fields. Unknown message
   types and developer fields are not yet semantically decoded: they exist
   only as raw bytes in the user's archive (layer 1), not as queryable
   rows. Real Garmin activity files carry undocumented per-second message
   types (two types, ~60% of all activity-file messages) plus a small
   number of developer-data definitions - dropping raw bytes would lose
   them.

FIT message coverage, from a full message-level census of a real export:

- Decoded by the loader: `file_id` (type) plus value-level decode of
  `session`, `lap`, `event`, `sport`, `device_info`, `activity`,
  `zones_target`, `hrv` and developer data (`developer_data_id`,
  `field_description`, and dev values resolved through the file's own
  definitions) into `garmin_activity_file.fit_messages`, keyed by FIT
  field number with raw FIT-epoch timestamps - no semantic names or unit
  conversions guessed. Per-second `record` messages are always counted
  (`record_count` column) and decoded only with the loader's
  `--decode-records` flag (the gated high-volume tier).
- Known message types present and NOT yet decoded (identified remaining
  work): none beyond the list above; semantic naming/unit mapping of the
  decoded field numbers is the remaining modeling work.
- Undocumented message types present (raw-bytes-only until reverse
  engineered): ~15 types, including the two per-second types above.

## Model overview (29 tables)

All tables are owner-scoped (`auth_user` FK), `garmin_` prefixed, and every
row carries a `raw`/`extra` JSONB of the source record so nothing the export
contains is lost even where no typed column exists yet.

Core:
- `garmin_import_batch` — one row per bulk API call (dataset, counts, status)
- `garmin_source_file` — preservation manifest: one row per file found in the
  export (path, size, sha256, class: imported/deferred/excluded)
- `garmin_activity` — activity summary + `raw` JSONB
- `garmin_activity_split` — per-lap/km splits, metrics as JSONB
- `garmin_activity_split_summary` — per-activity split-type aggregates
- `garmin_activity_file` — raw FIT reference (sha256, size, storage_ref,
  match status matched/orphan/ambiguous, NULLable activity FK)

Daily / wellness:
- `garmin_daily_summary`, `garmin_sleep_night`

Metric series (one table each):
- `garmin_training_readiness`, `garmin_vo2max`, `garmin_race_prediction`,
  `garmin_endurance_score`, `garmin_hill_score`, `garmin_training_status`,
  `garmin_acute_training_load`, `garmin_heat_altitude_acclimation`,
  `garmin_max_met`

Supporting:
- `garmin_hydration_log`, `garmin_gear`, `garmin_gear_activity_link`,
  `garmin_personal_record`, `garmin_workout`, `garmin_workout_schedule`,
  `garmin_course`, `garmin_user_goal`, `garmin_weekly_report`

High-volume time series (models + migration exist; FIT decoders and import
plumbing not yet implemented; sample import also needs a storage pick):
- `garmin_activity_sample` — per-second activity records (timestamp, position,
  altitude, speed, HR, cadence, power, run dynamics + `extra` JSONB for
  decoded-but-untyped fields).
- `garmin_monitoring_sample` — wellness monitoring FIT records.
- `garmin_segment` — segment-list entries from segment FITs.

## Storage decision (user pick required)

Illustrative multi-year history: ~1k activities, ~3M activity record
messages, ~10M monitoring messages, ~13k segment entries (rounded orders of
magnitude; the loader reports exact counts per import). Size estimates are
derived, not measured on Postgres:

- Row width for `garmin_activity_sample` (~15 numeric/timestamp columns + 2
  FKs + extra JSONB ~50-100 B) is ~230-280 B/row including tuple header.
  Cross-check: the same schema loaded into SQLite measured 228 B/row
  including PK + 2 indexes (200k synthetic rows).
- Full activity samples: 3M rows × ~230-280 B ≈ 0.7-0.85 GB heap +
  ~0.1-0.2 GB indexes. Grows linearly with future activities.
- Downsampled 1 point / 10 s: ~300k rows ≈ 70-85 MB all-in.
- Monitoring samples decoded 1:1: ~10M messages; as rows of similar width
  ≈ 2.3-2.8 GB - above the whole free-tier project allowance.
- Free-tier limit: 1 GB Postgres storage per project, 20 GB per account
  (source: https://neon.com/docs/introduction/plans, fetched 2026-11-14).
  Current project headroom is UNKNOWN: the read-only DB role's login was
  failing at proposal time, so no live size could be measured.

| Option | What is stored | Derived size (illustrative history) | Unresolved constraint |
| --- | --- | --- | --- |
| A | metadata only; FIT stays local | ~0 MB | needs nothing; full detail re-importable later from local bytes |
| B | full typed samples | ~0.8-1.0 GB | actual project headroom unknown (role login failing); close to the 1 GB project limit even if empty today; grows with every activity |
| C | downsampled 1/10 s | ~70-85 MB | loses 1 s detail - conflicts with the maximum-detail request |
| D | raw FIT in the existing media bucket + on-demand sample import | bucket bytes only | incremental bucket cost/egress unknown; needs the provider account to price |

No default is chosen. A maximum-detail goal points at B or D; B is gated on
real headroom, D on verified vendor pricing - and both need explicit
approval before any bytes move.

## Import flow

`api/scripts/garmin_export_import.py` (stdlib + requests) runs locally against
the extracted ZIP, scans FIT headers with a built-in minimal parser, and posts
batches to `POST /api/apps/garmin/import/<dataset>/` (JWT). The API maps and
upserts records keyed by natural IDs and writes a manifest row per source
file. Idempotent: re-running an import updates in place.

## Decision questions

1. Storage option A/B/C/D for per-second activity samples (none chosen).
   Option D would reuse the existing shared Railway bucket (see
   docs/object-storage.md); current vendor pricing and any minimum
   GB-month billing still need verification against Railway's own pricing
   source before any cost claim. FIT byte volume is measured by the loader
   at import time.
2. Actual free-db size: the `instinct_readonly` role's login failed at
   proposal time, so option B's headroom is unverified.

Remaining implementation work (part of the original full-detail scope, not
deferrals awaiting approval):

- FIT decoders for the known message types listed above (lap, event, sport,
  device_info, developer fields, then per-second records).
- Monitoring/segment message decoders and their import plumbing.
- Sample-table import plumbing, enabled once a storage option is picked.
