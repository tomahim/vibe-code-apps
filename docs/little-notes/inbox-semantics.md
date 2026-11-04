# Inbox membership

Inbox is a query/view, not a rewrite of saved categories. An owner's object is visible in Inbox when:

- It explicitly has the Inbox category, or
- It has no categories at all, or
- It is News and has no Archive category.

Archived News is always excluded from Inbox, even if a stale Inbox category is also present. Non-news objects intentionally categorized as Promising, To improve, Inspiration, Favorite or Archive do not become Inbox objects just because they lack Archive. Uncategorized daily notes and other custom types do appear in Inbox.

Existing type, month, topic, search, owner and pagination filters still apply. All and Archive views keep their existing meaning. No data backfill, category reassignment or schema migration is required.

Future news producers should assign Inbox when saving new unprocessed news. The view also supports historical and externally created uncategorized rows.
