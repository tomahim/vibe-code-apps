# Little notes (IN / OUT)

New app at `/apps/little-notes`. Previous apps remain available. Owner-scoped JWT
API, not Notion or GitHub in the browser. The interface keeps one object on stage,
a next-up queue, object-type sidebar (drawer on phone), horizontally scrollable
category tabs that follow the selected object type (Promising/To improve only on
Ideas, Inspiration only on Bookmarks), topic tags behind "More tags", month
selector, search and 30-object pagination. Any object on the page can
be selected with the jump control, not only the six preview cards.

Actions: capture Ideas/Bookmarks/News/Videos/Work ideas/Daily notes into the Inbox category, read
sanitized markdown, open a validated external URL, edit with conflict detection,
favorite, assign/remove one category (type-linked categories refused for other
types) or one topic tag, archive or restore. Skip changes no data. Archiving
from the Inbox (or restoring from the Archive view) moves the stage to the next
object in line. Adding a category (Favorite, Promising, ...) from the Inbox view
also moves the stage to the next object, but the object stays in the Inbox:
only Archive removes it. No projects,
issues or lists. In the cards view each card carries the same archive/restore
and category actions, and opening an object from the cards, table or database
view scrolls the detail into view. Type/category/tag administration writes are
intentionally not implemented.

Source files and Notion blocks/attachments are preserved in Postgres provenance;
this UI renders the readable markdown and source links, not raw JSON/HTML backups.
Old apps retain original source data. RL direct-to-Curator cutover is separate
from making the app available; current RL remains Notion until confirmed ready.

Checks: `npm test`, `npm run build`; `node curator-visual-check.mjs` uses Chrome at
`/usr/bin/google-chrome` and mocked nonprivate records, writes screenshots to
`/tmp/little-notes-screenshots` or CURATOR_SCREENSHOTS. It exercises 320/390/1280,
no-overflow, type-linked category tabs (Ideas vs Bookmarks), type drawer,
capture/Escape, search/empty/reset, archive and skip/archive/restore triage
advance.
This is not a claim of actual Android Firefox device testing.
