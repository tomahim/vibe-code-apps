# Little notes: completed copy and API (stage 3/4)

The model PR #305 is merged and its Django migrations are live. Thomas approved a
direct copy instead of a dedicated stage-2 PR, then confirmed owner login `thomas`
and #inspiration only on former Inspiration-category links.

Copy completed: 245 objects (125 Ideas, 65 News, 55 Bookmarks), 245 provenance rows,
35 checksum-verified attachments (1,069,892 bytes). October 207 / November 38.
All mapped fields and source hashes reconciled; rerun creates 0 and skips 245.
Source snapshot SHA256: 1eba28d46ff8394898eab67a164436841d640d810aca8e65e294b987403ac4fd.
Notion/GitHub originals are unchanged. Private source bundles are never committed.
Attachment bytes are base64 inside source provenance JSON, not public storage;
the API deliberately does not expose raw payloads or attachment signed URLs.

Copy commands live in this PR for reproducibility, but never run automatically.
Export requires a private token-file path and captures all pages, recursively
paginated blocks, metadata and hosted file bytes. Dry-run validates checksums and
mapping without database writes. Apply requires reviewed bundle hash + owner ID.
Insert-only source identity protects reruns and refuses changed-source overwrite.
The private local capture used resumable chunks and a final full ID/edit-time
reconciliation. Initial transaction timed out and rolled back; optimized bulk
copy completed only after two live reads confirmed no partial rows.

API base `/api/apps/little-notes/`:
- GET taxonomy/: active types, shared tag vocabulary and owner-scoped month counts.
- GET content/: owner-scoped type/tag/month/q filters, 30-row deterministic pages.
- POST content/: create owner-scoped content, automatically #inbox.
- GET/PATCH content/<uuid>/: detail / edit with updated_at conflict check.
- POST content/<uuid>/tags/: one tag toggle, updated_at conflict check; row lock
  makes #archive/#inbox exclusion atomic. Favorite and topic tags remain independent.
JWT required everywhere, existing same-origin mutation guard and JSON-only writes.
No type/tag admin writes, delete endpoint, model changes, RLS or source mutation.

The dedicated role `instinct_curator_rw` is also intended for future direct RL
saves after Little notes cutover. Current RL stays Notion until readiness is
confirmed. It has only explicit CRUD on the five Curator tables, no DDL/ownership,
TRUNCATE or access to unrelated tables. New direct saves must use explicit owner,
UUIDs/timestamps and transactional tag rules. Runtime/migration identity stays
separate. Do not put passwords in code, issues or source bundles.
