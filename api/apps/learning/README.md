# Little Grains schema

Source: [current project overview](https://linear.app/tomahim/project/little-grains-atomic-learning-ac2cbdcff98c/overview), read 2026-10-27. This replaces the older TOM-8 model proposal, not its entire feature scope.

This app contains tables and model validation only. It does not add endpoints, admin registration, a publisher, content files, seed data, grading, or review scheduling. The existing `apps.little_grains` sample endpoint is unchanged.

## Tables

| Model | Table |
| --- | --- |
| ContentEntity | `lg_content_entity` |
| Theme | `lg_theme` |
| LearningPath | `lg_learning_path` |
| Lesson | `lg_lesson` |
| Card | `lg_card` |
| Question | `lg_question` |
| SyncLog | `lg_sync_log` |
| CardProgress | `lg_card_progress` |
| QuestionAttempt | `lg_question_attempt` |

Content primary keys are one-to-one references to the UUID registry (`entity`, stored in SQL column `id`). Use `pk` / `entity_id` for ORM lookups; `id` is a read-only UUID convenience property. UUIDs come from content metadata, with no generated fallback. Learner/log rows use the platform's BigAutoField default. User references use `AUTH_USER_MODEL`.

## Schema decisions / assumptions

- Registry rows include `archived` as a permanent tombstone. Archiving is distinct from the `published` flag; archived entities must not be republished. Positions remain reserved even when content is archived.
- Foreign keys use `PROTECT` throughout, including users, so deleting a parent cannot cascade into learner history. Explicit archival, rather than deletion, is the intended workflow. This does not create a database-level append-only or deletion-permission system.
- Theme positions are globally unique. Other positions are unique per parent; card and question sequences are separate. Positivity, sibling uniqueness, completion uniqueness and valid enum values are database constraints.
- Every content row has source path, content hash and last-changed commit, including cards/questions, to honor the overview's general provenance requirement. Lesson introduction is `introduction_markdown`. Images remain repository-relative path strings, not uploaded files.
- Multiple-choice `options` is a list of four `{id, text}` objects. Choice IDs and `answer` are strings; `submitted_answer` stores a choice ID. No question revisions or answer snapshots are added.
- `completed_at` and `answered_at` are explicit timestamps supplied by the future caller. `SyncLog.updated_at` records insertion time; unique `commit_sha` supports one successful log per commit. `changes` is an object for the future publisher's added/updated summary.
- Model `full_clean()` validates registry kind immutability, subtype-kind matching, archive/publication consistency, useful image alt text, and the four-choice/answer shape. Django does **not** call `full_clean()` on `save()`, and bulk writes bypass it. These cross-table/JSON rules are **not database constraints**; the future publisher must validate the complete manifest and call validation inside its transaction. No publishing service or triggers are included in this table-only PR.
- The schema stores completion and answer history only. Lesson completion/review due dates must later be derived as specified; no lesson-progress or review-schedule tables are added.

## Checks

```sh
cd api
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test apps.learning
```

The initial migration depends on the configured user model. It is additive and reversible. No production database is needed to generate/test it. The existing API deployment runs migrations on merge/startup; this PR must remain unmerged until approved.
