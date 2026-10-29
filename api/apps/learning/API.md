# Little Grains learner API

All routes live under `/api/learning/`. Learner endpoints require the existing `Authorization: Bearer <token>` from `/api/auth/login` and return private, non-cacheable JSON. Published artwork has a separate public image route, described below. UUIDs are the published content IDs. Only published, unarchived content with a visible ancestry is readable or writable. Publishing provenance, answer keys and pre-answer explanations are not returned. No production DB access is needed to test this API.

Sources read 2026-10-27:
- [Garden design board](https://linear.app/tomahim/document/little-grains-garden-design-board-6dd69300c9a6)
- [Current project context](https://linear.app/tomahim/project/little-grains-atomic-learning-ac2cbdcff98c/overview)

## GET themes/

Returns `{themes: [...]}` ordered by position/UUID, including introductions, image paths/alt text, path totals/started counts and current-user progress. Progress reports `cards_completed`, `cards_total`, `checkpoints_correct`, `checkpoints_total`, `questions_correct`, `questions_total`, `started`, `completed`. `questions_correct` counts distinct questions with at least one correct answer, of any attempt type. A lesson completes once all its visible cards are read and every visible question has been answered correctly at least once; rotation at a checkpoint can leave alternatives unseen on a first pass, and those count too (#204). Empty lessons are not complete. These are completion counts, not spendable rewards or a public ranking.

Theme, path and lesson objects still include `image_url`, but learning path and lesson images were removed (#195), so it is empty for them; only cards carry images, through `illustration_url`. These are root-relative URLs on the app origin, ready for `<img src>`, or an empty string when no image is authored. Existing repository-relative `image_path`/`illustration_path` fields and alt text remain available; use the URL fields for display.

## GET images/<kind>/<uuid>/

Serves only the referenced artwork of a published, unarchived theme, learning path, lesson or card, with the same ancestry checks as content reads. `kind` is `theme`, `learning_path`, `lesson` or `card`. Published artwork is public so a browser image element does not need a Bearer header; this route never exposes learner state, Markdown or question files. Unknown, hidden or missing image references return 404.

The backend fetches bytes from `LEARNING_CONTENT_REPOSITORY` (default `tomahim/vibe-code-apps`, a public GitHub repository), pinned to the latest successful `SyncLog.commit_sha`. This uses the publication snapshot rather than the index file's last-changed commit, so an image-only replacement is picked up. The existing `/api/` UI proxy handles delivery; neither the frontend nor its Docker image needs GitHub access or a copy of the content tree. Private source repositories require a separate delivery implementation.

PNG, JPEG, WebP, GIF and SVG are supported, with a 10 MiB delivery limit. Upstream bytes are cached in the backend for an hour per repository/commit/path; publication visibility is checked on every request before consulting that cache. Browser responses are non-cacheable, use an explicit image MIME type and `nosniff`, and sandbox SVG active content. Missing publication configuration returns 503; upstream failures, empty files or oversized responses return 502. Runtime access to `raw.githubusercontent.com` is required. No production sync or data migration is needed for already-published repository paths.

## GET themes/<uuid>/

Returns `{theme, learning_paths}` in position order, with learner progress per path. Hidden or unknown IDs return 404.

## GET paths/<uuid>/

Returns `{learning_path, theme, lessons, next_lesson_id}`. Lessons are ordered for the trail, include current-user completion, and remain visible even if not yet started. The next lesson is the first incomplete lesson, not a hard path unlock rule.

## GET lessons/<uuid>/

Returns `{lesson, learning_path, theme, cards, questions, next_step}` for introduction, breadcrumbs, reading and resume. Cards include body, artwork and this user's completion timestamp. Questions include `type` and prompt. Multiple-choice questions include four `{id,text}` options; `type_answer_question` has empty `options`. Normal reads never disclose answers, accepted variants or explanations. Exactly one alternative per checkpoint is selected from a deterministic learner-specific ordering. When both types are authored at a checkpoint, multiple choice is used until the whole lesson is complete; later reviews use typed answers. Each wrong attempt advances within the current type's alternatives, wrapping around after the pool is exhausted. Completion is per checkpoint, independent of alternative. `next_step` is `{type: "card"|"question", id}` or null on completion. The frontend should refetch on resume and after writes.

## POST lessons/<uuid>/open/

Send `{}` with `Content-Type: application/json` when the reader opens. This updates the authenticated learner's most recent open time for that lesson without changing card or question progress. The garden uses distinct recent opens to offer up to three unfinished lesson shortcuts. Hidden or unknown lessons return 404; invalid or extra fields return 400.

## POST cards/<uuid>/complete/

Send `{}` with `Content-Type: application/json`. Marks only the authenticated user's card complete at server time. First completion returns 201, repeated completion 200 with the original timestamp and `created:false`. Response includes `card_id`, `completed_at`, `created`, lesson `progress`, and `next_step`. Unknown/hidden cards: 404; attempting to skip a preceding card or unresolved checkpoint: 409. Completion is a self-reported read, not proof of reading time. Learner-supplied identities, timestamps and extra fields are rejected.

All writes are bearer-only, JSON-only, reject mismatching browser Origin, and run atomically. A user-row lock serializes concurrent progress writes across production PostgreSQL workers. No publishing/content data is modified.

## GET paths/<uuid>/catch-up/

Returns `{learning_path_id, eligible, remaining, questions}`: one shared practice quiz of at most 10 unique questions for a learning path. The historical `/catch-up/` route remains, but there is no backend catch-up/review mode or path-completion gate. Only visible questions from lessons whose visible cards have all been read are eligible, even when unread lessons remain elsewhere in the path. Selection priority:

1. Questions whose latest attempt failed, random within this tier. A later correct answer clears this priority.
2. Questions with no stored attempts, random within this tier.
3. Of the slots left after 1 and 2, 60% (nearest whole question, half up) come from the answered questions whose latest attempt is oldest.
4. The remaining slots are random picks from the other eligible answered questions, excluding every question already selected.

The session keeps this priority order and contains fewer than 10 questions only when the eligible pool is smaller. `remaining` still counts all eligible questions never answered correctly, not session size; it can be zero while practice remains available. `eligible` is false until at least one lesson is fully read. Questions are the public question shape plus `lesson_title`; answers and explanations stay server-side.

## POST question-attempts/

Send `{"question_id":"<uuid>","answer":"<choice-id-or-typed-response>"}`. While a lesson is being read, only the current selected checkpoint question is accepted after its card has been completed. Once every card of the lesson is read, any of its questions is accepted: that is how the catch-up and review quizzes answer them. Returns 201 with `attempt_id`, `question_id`, server-inferred `attempt_type` (`initial`, `retry`, or `review`), server-graded `correct`, `explanation`, server `answered_at`, lesson `progress` and `next_step`. A typed-answer response also includes `correct_answer`, the authored canonical response, after submission. The server accepts any authored variant after normalizing case, punctuation, apostrophes, and spacing; typos and unlisted paraphrases remain incorrect. Invalid choices/fields: 400; hidden/unknown question: 404; unselected or premature checkpoint: 409.

**Retry and review behavior:** a wrong answer is recorded, returns its explanation and selects another question at the same checkpoint when the pool has alternatives. The response's `next_step` identifies the newly selected question. The server uses `initial` for the first answer at a checkpoint, `retry` for later answers before the first correct one, and `review` for every answer after that checkpoint was completed. A review answer adds an attempt row; its `next_step` is the next alternative after a wrong answer, or null after a correct one. Review answers never earn carrots, but a first correct answer on a question counts toward question completion in review too, so replaying a lesson can close gauge gaps. Wrong submissions are append-only attempts, so clients should not auto-retry an ambiguous network failure without refetching.

**Catch-up and review quiz answers** use this same endpoint with no extra field: a fully read lesson's question with no correct answer yet records `initial`/`retry` exactly like a first-run answer — same checkpoint passing, same first-correct carrot — and an already-correct question records `review`. The client supplies no `attempt_type`; the server derives it.

## GET progress/

Returns `{progress, learning_paths, lessons}` for the current user only. Aggregates include unique card/checkpoint completion and lesson totals/completed counts. There is no user-ID parameter, raw answer history, leaderboard, or another learner's data. Completion is derived, never separately stored; archived/unpublished content and questions whose checkpoint card is hidden are excluded. History rows are retained across content retirement. A content edit can change derived requirements, consistent with the existing no-revisions schema.

## Garden rewards and rankings

`GET garden/` returns the complete published theme → learning path → lesson hierarchy with the current learner's progress on each level, `rewards: {drops, carrots}`, and `recent_lessons`. Each learning path also carries `catch_up: {eligible, remaining}` for the gauge and quiz button. Recent lessons are the three most recently opened, still unfinished, visible lessons. Each shortcut includes the lesson and path titles, progress and its authoritative `next_step`; completed lessons are omitted. The frontend uses this snapshot to build the 3D scene and refreshes it after opening lessons and recording progress.

`GET leaderboard/?currency=drops|carrots&period=weekly|monthly|overall` returns a ranking for one currency and period, plus the learner's own row. The top 20 and personal rank are computed independently for Drops and Carrots. Only learners with a positive score in the selected currency and period are ranked. Weekly periods start Monday 00:00 UTC; monthly periods start on the 1st at 00:00 UTC; overall is cumulative. Ties are ordered by user ID. This first version uses a global ranking.

Rewards are derived from persisted learner history: 1 Drop for a card's first completion, 1 Carrot for the first correct answer at a checkpoint, 5 Drops when every visible card in a lesson is read (question results do not gate this bonus), and 100 Drops when all visible lessons in a path are complete (every question answered correctly at least once). Bonuses are additive. Wrong attempts and repeated card completion do not add rewards. Completion bonuses belong to the period in which the final required item was completed. No spendable balance or new reward table is created. Since scores are derived from the currently published hierarchy, archive or content edits can change historical totals; pinning an immutable economy would require a reward event ledger.

## Scope and integration

The earlier sample `/api/apps/little-grains/lessons` remains for compatibility; the garden frontend uses the DB-backed API. `today/` and the spaced review ladder remain separate follow-up work.

For this initial library the API returns complete ordered collections. Query count does not grow per card, but collection size is not paginated; add pagination/scoped state loading before scaling far beyond the current small curated library.

