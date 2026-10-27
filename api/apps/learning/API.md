# Little Grains learner API

All routes live under `/api/learning/`, require the existing `Authorization: Bearer <token>` from `/api/auth/login`, and return private, non-cacheable JSON. UUIDs are the published content IDs. Only published, unarchived content with a visible ancestry is readable or writable. Publishing provenance, answer keys and pre-answer explanations are not returned. No production DB access is needed to test this API.

Sources read 2026-10-27:
- [Garden design board](https://linear.app/tomahim/document/little-grains-garden-design-board-6dd69300c9a6)
- [Current project context](https://linear.app/tomahim/project/little-grains-atomic-learning-ac2cbdcff98c/overview)

## GET themes/

Returns `{themes: [...]}` ordered by position/UUID, including introductions, image paths/alt text, path totals/started counts and current-user progress. Progress reports `cards_completed`, `cards_total`, `checkpoints_correct`, `checkpoints_total`, `started`, `completed`. All correct alternatives at one checkpoint count once, never as separate required questions. A lesson requires all its visible cards and successful checkpoints; empty lessons are not complete. These are completion counts, not spendable rewards or a public ranking.

Images remain canonical repository-relative paths, as in the models. Hosting/resolving them is a frontend/content-delivery concern, not a fabricated asset URL.

## GET themes/<uuid>/

Returns `{theme, learning_paths}` in position order, with learner progress per path. Hidden or unknown IDs return 404.

## GET paths/<uuid>/

Returns `{learning_path, theme, lessons, next_lesson_id}`. Lessons are ordered for the trail, include current-user completion, and remain visible even if not yet started. The next lesson is the first incomplete lesson, not a hard path unlock rule.

## GET lessons/<uuid>/

Returns `{lesson, learning_path, theme, cards, questions, next_step}` for introduction, breadcrumbs, reading and resume. Cards include body, artwork and this user's completion timestamp. Questions include prompt and four `{id,text}` options, never answers or explanations. Exactly one alternative per checkpoint is selected deterministically from a hash of learner/lesson/checkpoint/question IDs. This stays stable across resume, while changes to pool membership may change selection. Completion is per checkpoint, independent of alternative. `next_step` is `{type: "card"|"question", id}` or null on completion. The frontend should refetch on resume and after writes.
