# Garmin stats

Two views over the owner's imported Garmin history (`api/apps/garmin`):

- **Overall stats** — every activity type: totals, per-month distance bars,
  per-sport breakdown, records, streaks and a weekday distribution, with a
  year filter.
- **My stats animated** — running + trail running only: a scroll-driven
  chapter where the year ticks forward while cumulative km/hours climb, the
  raw totals, and 20 fun comparisons (Earth, Moon, Everest, croissants…)
  computed from lifetime totals. Comparison constants are rounded public
  facts with sources listed in `comparisons.js`.

Data comes from two aggregated JWT-protected endpoints
(`GET /api/apps/garmin/stats/overview/` and `.../running/`), both a single
GROUP BY round trip, so the app loads fast.

`ui/garmin-visual-check.mjs` captures desktop and mobile screenshots of both
tabs against a locally running API (needs a locally minted token in
`/tmp/garmin-token.txt`); it is a dev aid, not part of CI.
