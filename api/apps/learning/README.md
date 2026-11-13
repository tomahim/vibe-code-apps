# Little Grains publisher package

This package is now the **content publisher** half of Little Grains. Cultive
(repo `tomahim/cultive`) owns the learner runtime and serves the lg_* tables
on the paid Cultive database; the experimentation API in this repo no longer
installs this app (see `config/settings.py` and `apps/learning_cleanup/`).

What stays here, because the GitHub content sync still needs it:

- `models.py`, `mixins.py`, `migrations/` — the lg_* schema the publisher
  migrates on the paid Cultive database.
- `management/commands/sync_atomic_lessons.py` — the content sync.
- `management/commands/seed_challenge_players.py` — manual challenge seeding.
- `illustrations.py` — card image variant processing at sync time.
- `grading.py` — typed-answer normalization, also loaded directly by the
  atomic-lessons content checks.
- `tests.py`, `tests_sync.py` — publisher-side tests.

The learner API, dashboard, badges, rewards, challenge and image serving moved
to the Cultive repo with the runtime.

Publisher commands run with `config.publisher_settings`, which installs only
the shared apps plus this one, so `migrate` cannot recreate experimentation
tables (curator, hockey, recipes, ...) on the paid database:

```sh
cd api
python manage.py migrate --settings=config.publisher_settings --noinput
python manage.py sync_atomic_lessons --settings=config.publisher_settings --commit <sha>
python manage.py test apps.learning --settings=config.publisher_settings
```

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
| LessonOpen | `lg_lesson_open` |
| BadgeAward | `lg_badge_award` |
| ChallengePlayer | `lg_challenge_player` |
| ChallengeWeek | `lg_challenge_week` |
| PathCelebration | `lg_path_celebration` |

Content primary keys are one-to-one references to the UUID registry (`entity`,
stored in SQL column `id`). Use `pk` / `entity_id` for ORM lookups; `id` is a
read-only UUID convenience property. UUIDs come from content metadata, with no
generated fallback. Learner/log rows use the platform's BigAutoField default.
User references use `AUTH_USER_MODEL`.

## Schema decisions / assumptions

- Registry rows include `archived` as a permanent tombstone. Archiving is
  distinct from the `published` flag; archived entities must not be
  republished. Positions remain reserved even when content is archived.
- Foreign keys use `PROTECT` throughout, including users, so deleting a parent
  cannot cascade into learner history. Explicit archival, rather than
  deletion, is the intended workflow. This does not create a database-level
  append-only or deletion-permission system.
- Theme positions are globally unique. Other positions are unique per parent;
  card and question sequences are separate. Positivity, sibling uniqueness,
  completion uniqueness and valid enum values are database constraints.
- Every content row has source path, content hash and last-changed commit,
  including cards/questions, to honor the overview's general provenance
  requirement. Lesson introduction is `introduction_markdown`. Images remain
  repository-relative path strings, not uploaded files.
- Theme, learning path, and lesson Markdown introductions use
  `introduction_markdown`; the field is optional. Cards have a required
  `title` (up to 255 characters) alongside `body_markdown`.
- Questions have a required positive `after_card_position`, copied from GitHub
  metadata. `full_clean()` checks that the card position exists in the same
  lesson. Several questions can share this checkpoint to form an alternative
  pool; their own `position` remains unique within the lesson. An index on
  `(lesson, after_card_position)` supports fetching a pool. The same-lesson
  reference is model validation, not a database foreign key; bulk writes must
  perform that validation too.
- Multiple-choice `options` is a list of four `{id, text}` objects and
  `answer` stores one choice ID. `type_answer_question` has no options;
  `answer` stores the canonical response and `accepted_answers` stores
  authored valid variants. `submitted_answer` stores the learner's choice ID
  or typed response. No question revisions or answer snapshots are added.
- `completed_at` and `answered_at` are explicit timestamps; learner API writes
  always supply server time. `SyncLog.updated_at` records insertion time;
  unique `commit_sha` supports one successful log per commit. `changes` is an
  object for the publisher's added/updated summary.
- Model `full_clean()` validates registry kind immutability, subtype-kind
  matching, archive/publication consistency, useful image alt text,
  same-lesson question checkpoints, and the question-type-specific answer
  shape. Django does **not** call `full_clean()` on `save()`, and bulk writes
  bypass it. These cross-table/JSON rules are **not database constraints**;
  the content sync validates rows inside its transaction.
- The schema stores completion and answer history plus the last time each
  learner opened a lesson.

## Content synchronization

`python manage.py sync_atomic_lessons` upserts the `atomic-lessons/` library
into these tables. It reuses the content checkers, validates every row with
`full_clean()` inside one transaction, keys rows by the metadata UUIDs,
records provenance (source path, SHA-256, last-changed commit) and writes one
`SyncLog` row per synced commit. Re-running the same commit is a no-op;
`--dry-run` validates and rolls back. The `Sync atomic lessons to the
database` workflow dry-runs the import on pull requests and publishes to the
paid Cultive database on merges to `master` using the `DATABASE_URL` Actions
secret. Retired content keeps its row with `archived: true`; nothing is
deleted. Publication is effective down the hierarchy: an element is
`published` only when neither it nor its parent is archived, so retiring a
path or lesson makes its whole subtree unavailable while children keep their
own archive flags. If database content that is still published disappears from
the library without an archive record, the sync aborts with no writes;
already-retired leftovers are only reported.

All authored metadata is imported: card `title`, theme/path/lesson
introductions, question checkpoints (`after_card_position`), and accepted
typed answers. Multiple-choice `selection` must be `single` (the schema
stores one answer per question) and is not stored.
