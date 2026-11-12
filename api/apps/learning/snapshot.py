"""The published content snapshot: structural rows cached between syncs.

Almost every endpoint used to re-query the whole visible tree on every
request (LearnerState, the reward replay and the badge history each did),
even though the published library only changes when a GitHub sync records a
new SyncLog commit. This module builds the structural rows once - identities,
parent links, positions and question types, never Markdown, prompts, options
or answer keys - and caches them for every reader.

Invalidation and retention:

- The snapshot is tagged with the latest SyncLog commit, re-checked on every
  read. A sync commits content and SyncLog in one transaction, so the next
  read after a sync sees a new commit and rebuilds. The check orders commit
  first, content second: a snapshot tagged with the current commit can only
  have been built from content at least as new as that commit.
- One fixed cache key, overwritten in place. Retention is strictly bounded
  to a single entry - never one copy per commit (a commit-keyed
  ``timeout=None`` entry per sync would pile up unbounded versions).
- In-process writes (Django admin, shell, tests) bypass the commit check, so
  model signals drop the entry on any content or SyncLog save/delete.
- LocMemCache is per gunicorn worker: each worker holds its own single copy
  (a few MB at the current library size, by synthetic estimate; a shared
  cache like Redis can come later if the library or worker count grows).
"""
from collections import namedtuple

from django.core.cache import cache
from django.db.models import Exists, OuterRef

from .models import Card, ContentEntity, LearningPath, Lesson, Question, SyncLog, Theme

PARENTS = {
    Theme: [], LearningPath: ["theme"],
    Lesson: ["learning_path", "learning_path__theme"],
    Card: ["lesson", "lesson__learning_path", "lesson__learning_path__theme"],
    Question: ["lesson", "lesson__learning_path", "lesson__learning_path__theme"],
}


def visible(model):
    filters = {"published": True, "entity__archived": False}
    for parent in PARENTS[model]:
        filters[f"{parent}__published"] = True
        filters[f"{parent}__entity__archived"] = False
    rows = model.objects.filter(**filters)
    if model == Question:
        rows = rows.filter(Exists(visible(Card).filter(
            lesson_id=OuterRef("lesson_id"), position=OuterRef("after_card_position"),
        )))
    return rows


# Lightweight structural rows. LearnerState and its callers read .pk,
# .lesson_id, .position, .after_card_position and .type; the single-lesson
# reader is the only consumer of full content rows and keeps its own query.
CardRow = namedtuple("CardRow", ["pk", "lesson_id", "position"])
QuestionRow = namedtuple("QuestionRow", ["pk", "lesson_id", "position", "after_card_position", "type"])
LessonRow = namedtuple("LessonRow", ["pk", "learning_path_id", "position"])
PathRow = namedtuple("PathRow", ["pk", "theme_id", "position"])
ThemeRow = namedtuple("ThemeRow", ["pk", "position"])

# Visible rows keep model ordering (position, pk); the all-rows maps let
# badge history resolve cards and questions that were since unpublished.
Snapshot = namedtuple("Snapshot", [
    "commit",
    "cards", "questions", "lessons", "paths", "themes",
    "card_lesson", "question_info", "lesson_path", "path_theme",
])

CACHE_KEY = "learning.content-snapshot"

CONTENT_MODELS = (Theme, LearningPath, Lesson, Card, Question, ContentEntity, SyncLog)


def current_commit():
    return SyncLog.objects.values_list("commit_sha", flat=True).first()


def build_snapshot(commit):
    return Snapshot(
        commit=commit,
        cards=tuple(CardRow(*row) for row in visible(Card).values_list("pk", "lesson_id", "position")),
        questions=tuple(QuestionRow(*row) for row in visible(Question).values_list(
            "pk", "lesson_id", "position", "after_card_position", "type")),
        lessons=tuple(LessonRow(*row) for row in visible(Lesson).values_list(
            "pk", "learning_path_id", "position")),
        paths=tuple(PathRow(*row) for row in visible(LearningPath).values_list(
            "pk", "theme_id", "position")),
        themes=tuple(ThemeRow(*row) for row in visible(Theme).values_list("pk", "position")),
        card_lesson=dict(Card.objects.values_list("pk", "lesson_id")),
        question_info={pk: (lesson, qtype) for pk, lesson, qtype in
                       Question.objects.values_list("pk", "lesson_id", "type")},
        lesson_path=dict(Lesson.objects.values_list("pk", "learning_path_id")),
        path_theme=dict(LearningPath.objects.values_list("pk", "theme_id")),
    )


def content_snapshot():
    """The current published snapshot, rebuilding only after a content change."""
    commit = current_commit()
    entry = cache.get(CACHE_KEY)
    if entry is not None and entry.commit == commit:
        return entry
    entry = build_snapshot(commit)
    cache.set(CACHE_KEY, entry, timeout=None)
    return entry


def invalidate(**_kwargs):
    """Signal receiver: drop the snapshot on any in-process content write."""
    cache.delete(CACHE_KEY)
