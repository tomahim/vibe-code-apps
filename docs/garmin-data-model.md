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
row per file; unknown FIT messages and developer fields are preserved
losslessly in the file's `extra` JSONB, never dropped.

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

High-volume time series (designed, gated on the storage decision below —
models exist, import only when the chosen option allows):
- `garmin_activity_sample` — per-second activity records (timestamp, position,
  altitude, speed, HR, cadence, power, run dynamics + `extra` JSONB for
  unknown/developer fields)
- `garmin_monitoring_sample` — wellness monitoring FIT records
- `garmin_segment` — segment-list entries from segment FITs

## Storage decision (user pick required)

Sizes scale with history length H (hours of recorded activity). Illustrative
figure for H = 1,300 h at ~1 sample/s and ~27 fields/sample:

| Option | What is stored | Estimated size | Notes |
| --- | --- | --- | --- |
| A | metadata only, FIT stays in the local export | ~0 MB | tracks re-importable later |
| B | full typed samples (~27 fields) | ~0.6–0.8 GB | near the 1 GB free-tier project limit (source: https://neon.com/docs/introduction/plans); grows with every future activity |
| C | downsampled (1 point / 10 s) | ~60–80 MB | keeps map/pace shape, loses 1 s detail |
| D | raw FIT bytes in the existing media bucket + per-activity on-demand sample import | bucket bytes only | needs incremental bucket cost check before adoption |

Monitoring samples (24/7 wrist data) are an order of magnitude larger than
activity samples and are not viable on the free tier under any variant of B;
they stay as deferred manifest entries + raw files until a paid tier or
downsampling is approved.

## Import flow

`api/scripts/garmin_export_import.py` (stdlib + requests) runs locally against
the extracted ZIP, scans FIT headers with a built-in minimal parser, and posts
batches to `POST /api/apps/garmin/import/<dataset>/` (JWT). The API maps and
upserts records keyed by natural IDs and writes a manifest row per source
file. Idempotent: re-running an import updates in place.

## Decision questions

1. Storage option A/B/C/D for per-second activity samples (default: none
   chosen; import of sample tables is gated until picked).
2. Monitoring/segment FITs: confirm deferred (manifest + raw preserved) or
   schedule downsampling work.
3. Bucket (option D): approve incremental-cost check on the existing media
   bucket before any bytes move.
