# App Ideas (the idea garden)

A catalog of app ideas, browsable at `/apps/app-ideas`. Ideas are markdown files
committed in this folder and bundled by Vite. The only API call is saving a star
rating (see Ratings).

## Adding an idea

Drop one markdown file per idea in `./ideas/`:

- Filename: `YYYY-MM-DD-slug.md` for new ideas (e.g. `2026-10-21-draft-deck.md`).
  Ideas migrated from GitHub issues keep `NNN-slug.md` with their issue number.
- Frontmatter:

  ```
  ---
  name: Draft Deck
  tagline: Play Constraint Cards, Ship an Atomic Essay
  pitch: Get dealt constraint cards, ante into a 100-word atomic essay, and bank points when you ship it.
  domains: [WRITE, GAME]
  created: 2026-10-21T05:00:12Z   # required: ISO datetime in UTC, when the idea was written
  issue: 56            # optional, only for ideas migrated from a GitHub issue
  rating: 2            # optional, 1-3 stars; leave it out for a new idea
  ---
  ```

  `pitch` is required: one line, 1-2 plain sentences summarising what the app does
  (this is what the Inbox swipe card shows).
  `created` is required and drives the list order (newest first, ties broken by issue number
  then filename). Use the real time you write the file, in UTC with a trailing `Z`; give
  ideas written in the same batch distinct seconds.
  `domains` uses the repo's domain tags: PROD, SPORT, HIST, 3D, GAME, LEARN, WRITE, MEDIA.
- Body: the idea spec in markdown (the 6-section issue template works as-is).

The list, search, domain filters and detail view update automatically at build time.
`npm test` validates that every idea file parses and carries the required fields.

## Inbox swipe deck

The Inbox defaults to a swipe deck: one card at a time showing only the pitch, with
a Details button that expands the full spec (Back returns to the card). Swipe to
rate: **up = 3 stars, left or right = 2 stars, down = 1 star**; on-screen buttons
and arrow keys do the same. A rated idea leaves the Inbox, so the deck advances.
A Swipe/List toggle restores the grid. Promising and Archive stay grid views.

## Ratings (Inbox / Promising / Archive)

Thomas rates each idea 1 to 3 stars. The `rating` frontmatter line is the only
state; nothing is stored in the browser.

- No `rating` (or an invalid value): **Inbox** (unvoted). New ideas must not set it.
- `rating: 2` or `3`: **Promising**, sorted 3 stars first, then 2, then newest `created`.
- `rating: 1`: **Archive**.

A rated idea shows a small "x" button (or tap the current star again): it sends `rating: null`, which removes the `rating` line.

Inbox and Archive are sorted newest first. There is no separate archived flag.

Saving a star tap: the UI calls `POST /api/app-ideas/<slug>/rate` with
`{"rating": 1|2|3}` (`null` clears it). The Django api reads the idea file through
the GitHub Contents API, sets the `rating` line and commits to `master` with the
message `rate <slug>: N stars`. A sha conflict (for example with the daily ideas
PR) is retried up to 3 times with a fresh read. The UI shows the vote at once in
memory; the commit triggers the normal ui redeploy and the static list catches up
a minute or two later. If the api has no token, the UI shows "Vote failed" and
reverts.

Api configuration (Railway `api` service):

- `GITHUB_IDEAS_TOKEN`: fine-grained token, repository `tomahim/vibe-code-apps` only,
  permission Contents: read and write. Unset disables rating (503).
- `GITHUB_IDEAS_REPO` (default `tomahim/vibe-code-apps`), `GITHUB_IDEAS_BRANCH` (default `master`).
- `IDEAS_RATE_REQUIRE_STAFF=true` (optional): also require a logged-in Django admin
  staff session.

Protection: the app is only reachable over Tailscale. The endpoint also refuses a
mismatching `Origin`, non-JSON bodies, and writes only under
`ui/src/apps/app-ideas/ideas/<slug>.md`. Broader auth is tracked in #16.
