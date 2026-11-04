# Little notes (IN / OUT)

New app at `/apps/little-notes`. Previous apps remain available. Owner-scoped JWT
API, not Notion or GitHub in the browser. The interface keeps one object on stage,
a next-up queue, object-type sidebar (drawer on phone), horizontally scrollable tag
tabs, month selector, search and 30-object pagination. Any object on the page can
be selected with the jump control, not only the six preview cards.

Actions: capture Ideas/Bookmarks/News/Daily notes into #inbox, read sanitized
markdown, open a validated external URL, edit with conflict detection, favorite,
assign/remove one tag, archive or restore. Skip changes no data. No projects,
issues or lists. Type/tag administration writes are intentionally not implemented.

Source files and Notion blocks/attachments are preserved in Postgres provenance;
this UI renders the readable markdown and source links, not raw JSON/HTML backups.
Old apps retain original source data. RL direct-to-Curator cutover is separate
from making the app available; current RL remains Notion until confirmed ready.

Checks: `npm test`, `npm run build`; `node curator-visual-check.mjs` uses Chrome at
`/usr/bin/google-chrome` and mocked nonprivate records, writes screenshots to
`/tmp/little-notes-screenshots` or CURATOR_SCREENSHOTS. It exercises 320/390/1280,
no-overflow, type drawer, capture/Escape, search/empty/reset and archive.
This is not a claim of actual Android Firefox device testing.
