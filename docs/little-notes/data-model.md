# Little notes: data-model review (stack 1/4)

Status: proposal, not approved for merge or production migration. This PR adds only
Django models, schema/taxonomy migrations and tests. No source data is copied. Old
App Ideas and Link Keeper remain unchanged. No UI, API, cron redirect or admin
registration is included. App branding is Little notes; table prefix stays curator_.

## Proposed relational model

- `curator_object_type`: UUID, unique case-insensitive slug, name, description, icon,
  ordering, active flag. Seed Ideas, Bookmarks, News, Daily notes. Not a fixed enum.
- `curator_tag`: UUID, unique case-insensitive slug without `#`, name, color,
  ordering, system marker. Fixed identities: inbox, archive, favorite. Ordinary
  initial tags: promising, to-improve, inspiration.
- `curator_content`: UUID, required Django owner and object type, title, subtitle,
  summary, markdown body, external URL, image URL/alt, source name, author, claim
  status, saved date, publication date, note date, optional original creation
  instant, local creation/update timestamps and JSON extension attributes.
- `curator_content_tag`: explicit UUID join table, unique content/tag pair,
  assignment timestamp and reverse tag/content index. An item supports many tags;
  "set one tag" is a quick action, not a single-tag storage limitation.
- `curator_content_source`: stable source identity (system + namespace + external
  ID), FK to content, source URL/revision/timestamps, original category/rating,
  raw metadata/blocks JSON and import timestamp. This supports later idempotent
  copies without deduplicating unrelated records just because they share a URL.

No standalone rating, archive boolean or inbox boolean duplicates tag state.
No projects, lists, issues, subissues or speculative relationship tables.
No attachment uploads or image copying is implemented. URLs/metadata are preserved;
source-local images will need an explicit later copy strategy if encountered.

## Month browsing

Proposal: `saved_on` is the main calendar date, indexed per owner and per owner/type.
Use half-open date ranges (`>= month start`, `< next month start`) so PostgreSQL can
use indexes without applying EXTRACT to every row. `published_on` and `note_on` stay
separate. All instants are timezone-aware. Imported date-only values stay dates,
not made-up midnight instants. Convert GitHub created instants to Europe/Paris for
saved date; Notion Added date wins, with source creation date as documented fallback.
New content defaults to Django's active local date; later API must activate the
user timezone (currently global settings are UTC). Date defaults do not settle the
UI month policy: Thomas should validate this choice before copy/API work.

## Copy mapping to validate, not implemented

Actual sources inspected: App Ideas markdown `name`, `tagline`, `pitch`, `domains`,
`created`, `rating`, full markdown; Link Keeper backend normalization of Title,
URL, Source, Author, Published, Added, Topics, Why it matters, Archived, Category,
Claim status. Later copy must inspect the live Notion schema and all page blocks,
not just this normalized feed; the feed filters/deduplicates and is not a full export.

Proposed mapping:
- All idea files -> Ideas. Body and metadata retained; domains -> regular tags.
- Idea rating 3 -> #promising; 2 -> #to-improve; 1 -> #archive; unrated -> #inbox.
  No new 30-item cap is enforced in this model. Retiring the old rating-specific
  cap is proposed for review, not silently carried into the new tag system.
- Category News -> News; all other Link Keeper rows -> Bookmarks.
- Preserve original Category verbatim in provenance regardless of new tag mapping.
- Inbox -> #inbox; Favorite -> #favorite; Archived -> #archive, taking precedence
  over #inbox. Topics -> tags; Why it matters -> summary; claim status preserved.
- Inspiration category -> #inspiration is the conservative interpretation. Thomas's
  wording may instead request #inspiration on every Bookmark. Confirm before copy.
- Never infer ratings, verification, publication dates or article content. Keep
  duplicates by source ID until a reviewed deduplication policy exists.
- No daily notes invented by import. `note_on` is available for future creation;
  multiple notes per day are allowed unless Thomas chooses a one-note/day rule.
- Source payload retains frontmatter/Notion metadata and blocks for lossless audit;
  full source markdown can also be retained there. No credentials in JSON.

## Invariants and later implementation boundary

Database enforces FKs, source uniqueness, tag assignment uniqueness, case-insensitive
slug uniqueness and valid original ratings/system-tag classification. Content
owner and referenced types cannot be deleted underneath content. Sources and tag
joins cascade only when content itself is explicitly deleted; tags in use are
protected from deletion. All new PKs are UUIDs, so this schema needs no sequences.

The future API must authorize every content query by owner, protect fixed tag
identities from rename/delete, lock a content row and atomically remove #inbox when
adding #archive (and vice versa), and record timestamps for direct SQL writes.
Those multirow tag rules are NOT enforced by a database trigger in this PR.
A direct data-copy writer must follow the same transaction rules and validate them
before commit. Direct CRUD access is not equivalent to safe arbitrary SQL or API
validation. No owner isolation is enforced with RLS in this proposal; DB role is a
trusted operator and can see all Curator rows. Object types and tag vocabulary are
shared globally; content is owner-scoped. No new sharing permission is implied.

## Review decisions

1. Approve the five-table layout and required owner FK? Shared taxonomy + private
   content is proposed, rather than silently making imported personal data global.
   Copy must resolve Thomas's actual Django user, never select an arbitrary staff user.
2. Confirm saved month vs publication month and multiple daily notes per date.
3. Confirm category/tag mapping, especially #inspiration and old two-star cap.
4. Confirm direct-writer application-level invariants are enough, or request database
   triggers/RLS before granting operational write access.

## Rollout and stack

1. This model PR against master; stop for review. Merging triggers API deployment,
   whose startup runs Django migrate, so review must precede merge.
2. Only after approval: copy PR based on model branch, dry-run inventory/report,
   source hashes, owner selection, transactional idempotent copy and reconciliation.
   New role is data-only; source Notion/GitHub and previous apps remain untouched.
3. API PR based on copy branch: authentication, owner checks, filtering/pagination,
   quick tag/archive transactions, conflict handling, no API via database credentials.
4. UI PR based on API branch: selected IN/OUT design, mobile-first, month browser,
   type sidebar, horizontal tags and accessible quick actions.

No later PR has been started. Do not run a production migration from this branch.
Rolling back the initial migration DROPS new tables and data; after a copy, export
and verify rollback safety first. There is no reverse operation on legacy sources.

## Validation performed

Focused SQLite model suite: 9 passed. Migration drift check and empty-database
forward/reverse/forward cycle passed. Local full dependency installation failed
because the existing `django-unfold==0.110.0` pin is unavailable in the package
mirror. Local PostgreSQL binaries are client-only, so PostgreSQL execution has NOT
been verified locally. Existing PR CI uses PostgreSQL 17 and the full app suite;
its result must be checked separately. No production database was contacted.

Reproduce focused tests from `api/` (Django 5.2, dj-database-url, psycopg):

```sh
python manage.py test apps.curator --settings=apps.curator.test_settings
python manage.py makemigrations --check --dry-run --settings=apps.curator.test_settings
# Set CURATOR_TEST_DATABASE_URL only to a disposable LOCAL/CI database for PG tests.
```
