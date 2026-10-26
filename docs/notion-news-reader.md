# Daily Five: Notion news reader

`/apps/news` is a private, mobile-first reader for the dedicated Notion news database.
**All article content and archive state stay in Notion.** There are no new models,
migrations, article snapshots, disk caches or app-database writes. The backend
briefly holds query results in Django's existing in-memory cache.

## Data flow

Browser → existing Django API → Notion API (`Notion-Version: 2026-03-11`).

- Inbox filters `Archived = false`; Archived filters `Archived = true`.
- Both lists query Notion by `Published` descending, then `Added` and Notion
  `created_time` descending as deterministic fallback/tie-breakers. Unknown
  publication dates remain labeled rather than invented. Dated entries are
  explicitly queried first (`Published is_not_empty`), then undated entries
  (`Published is_empty`), so null placement does not depend on undocumented
  Notion sort behavior. A last dated page probes the cached undated page before
  offering Next; one request makes at most two bounded Notion reads.
- Notion cursor pagination, up to 20 records per page. The API wraps cursors in
  expiring signatures bound to the account, data source and list. Previous/Next
  navigation works for both lists. Concurrent edits can shift a page; Refresh
  resets to page one.
- Search and topics filter the **entire selected list in Notion**, with pagination
  reset on changes. Search covers title, why-it-matters, author and source.
- Archive/unarchive updates only the `Archived` checkbox. This is shared state
  for the database, not per-reader state, as requested. It never sets Notion's
  page-level `archived`/`in_trash` flag and never deletes news.
- Before writing, the API retrieves the page and verifies its parent data source
  matches the configured source. Client-supplied page IDs cannot target other
  accessible pages. Writes are idempotent and require same-origin JSON plus JWT.
- Claim notes are shown verbatim. Prose is never guessed into a "confirmed" badge.
  Unknown authors/dates remain unknown; all external links allow HTTP(S) only.

## Notion setup

Create a dedicated internal connection with **Read content + Update content**.
It does not need Insert content, user information or commenting capabilities.
Share only this database with it through **••• → Add connections**. Do not publish
it or share the whole Home page. The existing assistant connection is separate;
its credential is not copied into this application.

The dedicated database:
https://app.notion.com/p/7a3681569a5348e1afc793c68ae529b1

The schema was inspected before implementation. It has `Title` (title), `URL`
(url), `Source`, `Author`, `Why it matters`, `Claim status` (rich_text), `Published`
and `Added` (date), `Topics` (multi_select). An **Archived** checkbox was added for
this feature. New and existing unchecked entries appear in Inbox. Normal daily
news creation can omit the checkbox; it defaults unchecked.

Set on the existing Railway **api** service only:

| Variable | Value |
| --- | --- |
| `NOTION_NEWS_TOKEN` | Dedicated connection secret, collected securely, never in source/chat |
| `NOTION_NEWS_DATA_SOURCE_ID` | `c6ff1ba1-556e-473e-bdae-25df05e4c383` |
| `NOTION_NEWS_ALLOWED_USER_IDS` | Comma-separated IDs of explicitly authorized existing Django users |

The data-source ID is not the database ID. With no allowlist the endpoint denies
all readers, even signed-in accounts. Use the existing admin to identify Thomas's
account, and authorize that ID only unless he chooses a broader audience. There
is no default/admin bypass and no public data endpoint. Existing JWT login is
reused; signing in from this app returns to it. Expired JWTs prompt sign-in again.

No frontend `VITE_*` secret, new resource, paid service or Terraform change is
needed. This PR does not set deployment variables or deploy/merge anything.
Secrets can be entered directly in Railway or through the agreed secure vault
flow. Never commit `.env` values or log the token/Notion response bodies.

## Cache and failures

Read pages are cached in process memory for up to two minutes. Successful writes
invalidate this process's feed cache. Another API worker, or direct Notion edits,
can take up to two minutes to appear. Browser responses use `never_cache` so private
stories are not stored in shared HTTP caches. Notion errors, missing schema or
permissions return an honest unavailable/setup state, not invented sample news.
Write timeouts can mean the write landed; refresh before retrying. No automatic
write retries. Connect/read timeouts bound every upstream request. Notion 429s are
surfaced as unavailable; no background polling loop runs.

## Verification

- Backend: `python manage.py test apps.news`
- UI unit tests: `npm --prefix ui test`
- Browser: `PLAYWRIGHT_CHROME_PATH=/path/to/chrome npm --prefix ui run test:browser -- news.spec.mjs`
- Build: `npm --prefix ui run build`

Browser tests use **synthetic** route fixtures, not a checked-in copy of private
Notion rows. They cover Inbox/Archived, archive/restore, pagination on both lists,
filters, missing config, sign-in states and mobile overflow. Backend tests cover
Notion query filters/sorts/cursors, auth and allowlist, signed-cursor boundaries,
unsafe links, missing provenance and write membership/permission failures.

Live deployed reading/writing still requires the separate connection secret and
allowed account setup. No existing article was archived during implementation.

References:
- https://developers.notion.com/docs/authorization
- https://developers.notion.com/reference/query-a-data-source
