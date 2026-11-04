# Little notes: categories vs tags (stack 5)

Status: proposal, not approved for merge or production migration. Thomas's
2026-11-04 review: the six workflow labels imported as tags are navigation
categories, not tags; tags stay for topic filtering; some categories apply only
to specific object types, and the tab row must follow the selected type.

## Model

- `curator_category`: UUID, unique case-insensitive slug, name, color, ordering,
  system marker. System identities: inbox, archive, favorite (same reservation
  rule as before, now enforced on categories). Ordinary categories: promising,
  to-improve, inspiration.
- `curator_category_object_type`: explicit UUID join. A category with no linked
  types applies to every object type. Seeded links: promising and to-improve ->
  Ideas; inspiration -> Bookmarks.
- `curator_content_category`: explicit UUID join, unique content/category pair,
  assignment timestamp, same protection rules as tag joins.
- `curator_tag` is unchanged and now holds only free-form topic tags. The
  reserved-slug constraint stays, so the six category slugs can never come back
  as tags.

## Data move (migration 0003)

For each of the six tab labels, every existing content-tag assignment becomes a
content-category assignment 1:1, keeping the original assignment timestamp. The
six tag rows are then deleted. No content row is edited; topic tags (topic-*)
and their assignments are untouched. News items had no tab label before and
keep no category after (they appear under All), matching current behavior.

## API

- GET taxonomy/ adds `categories` with their linked type slugs (empty = all).
- GET content/ accepts `category=` alongside `tag=`; both filters combine.
- POST content/ puts new items in the Inbox category.
- POST content/<uuid>/categories/: category toggle with updated_at conflict
  check; archive/inbox exclusion stays atomic; a type-linked category is
  refused (400) for content of another type.
- POST content/<uuid>/tags/: topic tag toggles, unchanged semantics.

## UI

The tab row shows All plus categories relevant to the selected object type
(universal + linked); Everything shows all categories. Topic tags move behind
"More tags" and filter independently. Quick actions split into "+ Set a
category" (only categories valid for the open item's type) and "+ Set a tag".
Category chips and #tag chips render distinctly on the card.

## Direct-write compatibility

The dedicated curator role writes must move with the migration: RL/FAV, news
and daily-idea writers stop inserting curator_content_tag rows for the six tab
slugs (those tag rows will no longer exist) and instead insert
curator_content_category rows resolved by category slug, in the same
transaction, with archive removing inbox atomically. Topic tag writes are
unchanged. Coordinate the switch with the merge so no writer fails mid-flight.
