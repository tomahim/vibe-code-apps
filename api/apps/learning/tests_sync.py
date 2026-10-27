"""Tests for the atomic-lessons content synchronization command."""

from __future__ import annotations

import base64
import uuid
from io import StringIO
from pathlib import Path
from tempfile import TemporaryDirectory

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase

from apps.learning.models import (
    Card,
    ContentEntity,
    LearningPath,
    Lesson,
    Question,
    SyncLog,
    Theme,
)

PNG_1X1 = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
)

THEME_ID = str(uuid.uuid4())
PATH_ID = str(uuid.uuid4())
LESSON_ID = str(uuid.uuid4())
CARD_ID = str(uuid.uuid4())
QUESTION_ID = str(uuid.uuid4())
CHOICE_IDS = [str(uuid.uuid4()) for _ in range(4)]


def write_library(root: Path) -> Path:
    path_dir = root / "themes" / "language" / "early-english"
    lesson_dir = path_dir / "greetings"
    (root / "library.yaml").write_text("schema_version: 1\n", encoding="utf-8")
    (root / "themes" / "language").mkdir(parents=True)
    (root / "themes" / "language" / "index.md").write_text(
        f"---\nid: {THEME_ID}\nposition: 1\ntitle: Language\ndescription: Languages.\narchived: false\n---\n",
        encoding="utf-8",
    )
    lesson_dir.mkdir(parents=True)
    (path_dir / "cover.png").write_bytes(PNG_1X1)
    (path_dir / "index.md").write_text(
        f"---\nid: {PATH_ID}\nposition: 1\ntitle: Early English\ndescription: Baby talk.\n"
        f"image: cover.png\nimage_alt: A caregiver and a baby.\narchived: false\n---\n\nIntro body.\n",
        encoding="utf-8",
    )
    (lesson_dir / "index.md").write_text(
        f"---\nid: {LESSON_ID}\nposition: 1\ntitle: Greetings\narchived: false\n---\n\nLesson intro.\n",
        encoding="utf-8",
    )
    (lesson_dir / "cards").mkdir()
    (lesson_dir / "cards" / "01_expressions.md").write_text(
        f"---\nid: {CARD_ID}\nposition: 1\ntitle: Wake up\narchived: false\n---\n\n"
        "**Good morning.**\n\n> *Bonjour.*\n",
        encoding="utf-8",
    )
    (lesson_dir / "questions").mkdir()
    choices = "\n".join(f"- id: {choice}\n  text: Choice {index}" for index, choice in enumerate(CHOICE_IDS))
    (lesson_dir / "questions" / "01_complete.yaml").write_text(
        f"id: {QUESTION_ID}\nposition: 1\ntype: multiple_choice\nselection: single\n"
        f"after_card_position: 1\nprompt: '____ morning.'\nchoices:\n{choices}\n"
        f"correct_choice_ids:\n- {CHOICE_IDS[0]}\nexplanation: Because.\narchived: false\n",
        encoding="utf-8",
    )
    return root


def run_sync(root: Path, commit: str, *extra: str) -> str:
    out = StringIO()
    call_command(
        "sync_atomic_lessons",
        "--content-root",
        str(root),
        "--commit",
        commit,
        *extra,
        stdout=out,
    )
    return out.getvalue()


class SyncAtomicLessonsTests(TestCase):
    def test_initial_sync_creates_the_full_hierarchy(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            out = run_sync(root, "a" * 40)
        self.assertEqual(ContentEntity.objects.count(), 5)
        theme = Theme.objects.get()
        self.assertEqual(theme.title, "Language")
        self.assertTrue(theme.published)
        learning_path = LearningPath.objects.get()
        self.assertEqual(learning_path.theme, theme)
        self.assertTrue(learning_path.image_path.endswith("cover.png"))
        lesson = Lesson.objects.get()
        self.assertEqual(lesson.learning_path, learning_path)
        self.assertEqual(lesson.introduction_markdown, "Lesson intro.")
        card = Card.objects.get()
        self.assertEqual(card.lesson, lesson)
        self.assertIn("**Good morning.**", card.body_markdown)
        self.assertEqual(len(card.content_hash), 64)
        self.assertTrue(card.source_path.endswith("cards/01_expressions.md"))
        question = Question.objects.get()
        self.assertEqual(question.lesson, lesson)
        self.assertEqual(len(question.options), 4)
        self.assertEqual(question.answer, CHOICE_IDS[0])
        log = SyncLog.objects.get()
        self.assertEqual(log.commit_sha, "a" * 40)
        self.assertEqual(log.changes["card"]["added"], 1)
        self.assertIn("Synced atomic-lessons", out)

    def test_rerun_of_the_same_commit_is_a_noop(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            run_sync(root, "b" * 40)
            out = run_sync(root, "b" * 40)
        self.assertIn("already recorded", out)
        self.assertEqual(SyncLog.objects.count(), 1)
        self.assertEqual(Card.objects.count(), 1)

    def test_second_commit_updates_changed_content(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            run_sync(root, "c" * 40)
            card_file = root / "themes/language/early-english/greetings/cards/01_expressions.md"
            card_file.write_text(card_file.read_text(encoding="utf-8") + "\n**Good night.**\n", encoding="utf-8")
            out = run_sync(root, "d" * 40)
        self.assertIn("card: 0 added, 1 updated, 0 unchanged", out)
        self.assertIn("theme: 0 added, 0 updated, 1 unchanged", out)
        card = Card.objects.get()
        self.assertIn("**Good night.**", card.body_markdown)
        self.assertEqual(card.last_changed_commit, "d" * 40)
        self.assertEqual(SyncLog.objects.count(), 2)

    def test_archived_content_stays_as_a_tombstone(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            run_sync(root, "e" * 40)
            card_file = root / "themes/language/early-english/greetings/cards/01_expressions.md"
            card_file.write_text(
                card_file.read_text(encoding="utf-8").replace("archived: false", "archived: true"),
                encoding="utf-8",
            )
            run_sync(root, "f" * 40)
        entity = ContentEntity.objects.get(pk=CARD_ID)
        self.assertTrue(entity.archived)
        card = Card.objects.get()
        self.assertFalse(card.published)
        # No deletion: the row and its history references survive archival.
        self.assertEqual(Card.objects.count(), 1)

    def test_dry_run_rolls_everything_back(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            out = run_sync(root, "0" * 40, "--dry-run")
        self.assertIn("rolled back", out)
        self.assertEqual(ContentEntity.objects.count(), 0)
        self.assertEqual(SyncLog.objects.count(), 0)

    def test_database_rows_missing_from_the_library_are_reported_not_touched(self):
        orphan_id = uuid.uuid4()
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            run_sync(root, "2" * 40)
            ContentEntity.objects.create(id=orphan_id, kind=ContentEntity.Kind.CARD, archived=False)
            out = run_sync(root, "3" * 40)
        self.assertIn("1 database content ID(s) are not in the library", out)
        self.assertIn("left untouched", out)
        # Still present afterwards: the sync never deletes or auto-archives.
        self.assertTrue(ContentEntity.objects.filter(pk=orphan_id).exists())

    def test_invalid_content_aborts_without_writes(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            question_file = root / "themes/language/early-english/greetings/questions/01_complete.yaml"
            question_file.write_text(
                question_file.read_text(encoding="utf-8").replace(
                    f"correct_choice_ids:\n- {CHOICE_IDS[0]}",
                    f"correct_choice_ids:\n- {uuid.uuid4()}",
                ),
                encoding="utf-8",
            )
            with self.assertRaises(CommandError):
                run_sync(root, "1" * 40)
        self.assertEqual(ContentEntity.objects.count(), 0)
        self.assertEqual(SyncLog.objects.count(), 0)
