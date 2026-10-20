# App Ideas (the idea garden)

A static catalog of app ideas, browsable at `/apps/app-ideas`. No API: ideas are
markdown files committed in this folder and bundled by Vite.

## Adding an idea

Drop one markdown file per idea in `./ideas/`:

- Filename: `YYYY-MM-DD-slug.md` for new ideas (e.g. `2026-10-21-draft-deck.md`).
  Ideas migrated from GitHub issues keep `NNN-slug.md` with their issue number.
- Frontmatter:

  ```
  ---
  name: Draft Deck
  tagline: Play Constraint Cards, Ship an Atomic Essay
  domains: [WRITE, GAME]
  created: 2026-10-21T05:00:12Z   # required: ISO datetime in UTC, when the idea was written
  issue: 56            # optional, only for ideas migrated from a GitHub issue
  ---
  ```

  `created` is required and drives the list order (newest first, ties broken by issue number
  then filename). Use the real time you write the file, in UTC with a trailing `Z`; give
  ideas written in the same batch distinct seconds.
  `domains` uses the repo's domain tags: PROD, SPORT, HIST, 3D, GAME, LEARN, WRITE, MEDIA.
- Body: the idea spec in markdown (the 6-section issue template works as-is).

The list, search, domain filters and detail view update automatically at build time.
`npm test` validates that every idea file parses and carries the required fields.
