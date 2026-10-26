# Link Keeper: a Notion-backed link library

`/apps/news` remains the stable URL, so existing bookmarks and login redirects keep
working. The catalog and reader are named **Link Keeper**.

All saved content, metadata, categories and reading state live in Notion. No new
models, migrations, article snapshots, disk caches or app-database writes exist.
The backend has no feed cache, including across gunicorn workers.

## Lists and edits

- **Inbox**, **News**, **Favorite**, **Inspiration**: `Category` select equals the
  tab name and `Archived = false`.
- **Archive**: `Archived = true`, across every category. Each card shows its
  category. Restore clears only the checkbox, returning the link to its category.
- The category picker writes only `Category`, including on archived cards.
  Changing category never changes archive state. Archive never changes category.
- The app reads directly from Notion after each write. Failed or uncertain writes
  are errors, not success. Refresh before retrying an uncertain write.
- Auth, the explicit user allowlist, same-origin JSON writes, parent-data-source
  membership checks, HTTP(S)-only links and signed pagination remain in place.
- Category writes accept only Inbox, News, Favorite and Inspiration. Archive is
  a separate state, never a category. Invalid list names fail with HTTP 400.

Results are sorted by Published descending, then Added and Notion created time.
Dated results are exhausted before undated ones, which are labeled unknown.
Pagination is bounded to 20 records per page. Cursors are signed and bound to the
user, data source, category/archive state, query and topic. Search and topic
filters query the entire selected list, not just the visible page. Changing
category, filters or archive membership resets pagination.

## Schema and setup

Database: https://app.notion.com/p/7a3681569a5348e1afc793c68ae529b1

Data source: `c6ff1ba1-556e-473e-bdae-25df05e4c383`

Core fields: Title (title), URL (url), Source, Author, Why it matters and Claim
status (rich_text), Published and Added (date), Topics (multi_select), Archived
(checkbox), Category (select: Inbox, News, Favorite, Inspiration).

Import preservation fields: Wallabag ID (number), Original URL (url), Reading
time (number), Language (rich_text), Imported (date), Saved content (files),
Migration backup (files). These are not required for new links.

New RL links use Category=Inbox and Archived=false. Daily news uses
Category=News and Archived=false. Dedupe against all URLs, including archived
records. Existing category is not silently overwritten by later news discovery.
Unknown authors and publication dates stay unknown. Claims remain verbatim,
never inferred into a verified badge.

The existing dedicated application connection needs Read content + Update content
on this database only. Insert content is not needed for the reader. The assistant
connection used for saving links and migration is separate. Server-only settings
remain NOTION_NEWS_TOKEN, NOTION_NEWS_DATA_SOURCE_ID and
NOTION_NEWS_ALLOWED_USER_IDS. Missing configuration fails closed. No frontend
secret, new infrastructure, paid service or deployment variable is needed.

## Wallabag migration (October 26, 2026)

34 source entries were imported into the existing 10-row database. One canonical
URL overlapped: its saved HTML/annotations/metadata were added to the existing
research record, which retained its news description, author and published date.
Its category and archive status follow the explicit Wallabag mapping. This leaves
43 unique URL records, not a duplicate article.

- Starred entries become Favorite, other imported entries Inbox.
- Wallabag archive state is independent and preserved for all 34 entries.
- Original news archive states were preserved; other original rows become News.
- Inspiration starts empty.
- Exact captured HTML is attached per article in Saved content. Readable extracted
  text and all four highlights across two articles are included as page content.
- The whole original Wallabag JSON export, including original title, URLs, tags,
  timestamps, metadata, HTML and annotation ranges, is attached as Migration
  backup to the overlapping BleepingComputer record. No private export is in Git.
- All 34 HTML files and the whole backup were downloaded from Notion and compared
  with the source. IDs, category, tags and archive state were reconciled.
- Notion tags are case-insensitive, so ai/security map to existing AI/Security;
  exact original spelling remains in the JSON backup.
- Eight Wallabag captures already contained extraction failures rather than
  article bodies. Those failures are preserved, not represented as full articles.
  Images/media in captured HTML can still depend on the original host. The app
  opens the source or Notion record; it does not claim a new offline reader.

The source account and articles were not changed or deleted. The saved Wallabag
vault login was removed after migration verification at the user's request.

## Verification

- `python manage.py test apps.news`: adapter, auth, allowlist, parent membership,
  narrow archive/category writes, category filters, signed cursor boundaries.
- `npm --prefix ui test`: model tests.
- `PLAYWRIGHT_CHROME_PATH=/path/to/chrome npm --prefix ui run test:browser -- news.spec.mjs`:
  lists, category changes, independent archive/restore, filters, pagination,
  auth/error states and mobile overflow, using synthetic data only.
- `npm --prefix ui run build`.

Notion errors and throttling are surfaced honestly. There is no polling loop or
automatic write retry. Private responses use never_cache.
