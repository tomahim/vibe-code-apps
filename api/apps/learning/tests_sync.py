"""Tests for the atomic-lessons content synchronization command."""

from __future__ import annotations

import uuid
from unittest import mock
from io import StringIO
from pathlib import Path
from tempfile import TemporaryDirectory

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase
from django.utils import timezone

from apps.learning.models import (
    Card,
    CardProgress,
    ContentEntity,
    LearningPath,
    Lesson,
    Question,
    SyncLog,
    Theme,
)

def make_png(width=800, height=600) -> bytes:
    from io import BytesIO

    from PIL import Image

    buffer = BytesIO()
    Image.new("RGB", (width, height), "white").save(buffer, "PNG")
    return buffer.getvalue()

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
    (path_dir / "index.md").write_text(
        f"---\nid: {PATH_ID}\nposition: 1\ntitle: Early English\ndescription: Baby talk.\n"
        f"archived: false\n---\n\nIntro body.\n",
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
        self.assertEqual(learning_path.image_path, "")
        self.assertEqual(learning_path.image_alt, "")
        lesson = Lesson.objects.get()
        self.assertEqual(lesson.learning_path, learning_path)
        self.assertEqual(lesson.introduction_markdown, "Lesson intro.")
        card = Card.objects.get()
        self.assertEqual(card.lesson, lesson)
        self.assertEqual(card.title, "Wake up")
        self.assertIn("**Good morning.**", card.body_markdown)
        self.assertEqual(len(card.content_hash), 64)
        self.assertTrue(card.source_path.endswith("cards/01_expressions.md"))
        self.assertEqual(learning_path.introduction_markdown, "Intro body.")
        question = Question.objects.get()
        self.assertEqual(question.lesson, lesson)
        self.assertEqual(question.after_card_position, 1)
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

    def test_translation_question_imports_without_choices(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            question_file = root / "themes/language/early-english/greetings/questions/02_translate.yaml"
            translation_id = uuid.uuid4()
            question_file.write_text(
                f"id: {translation_id}\nposition: 2\ntype: type_answer_question\n"
                "after_card_position: 1\nprompt: Bonjour.\n"
                "accepted_answers:\n- Good morning.\n- Hello.\n"
                "explanation: Both are natural greetings.\narchived: false\n",
                encoding="utf-8",
            )
            run_sync(root, "7" * 40)
        question = Question.objects.get(pk=translation_id)
        self.assertEqual(question.type, Question.Type.TYPE_ANSWER_QUESTION)
        self.assertEqual(question.options, [])
        self.assertEqual(question.answer, "Good morning.")
        self.assertEqual(question.accepted_answers, ["Good morning.", "Hello."])

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

    def test_archiving_a_parent_unpublishes_the_whole_subtree(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            run_sync(root, "4" * 40)
            path_index = root / "themes/language/early-english/index.md"
            original = path_index.read_text(encoding="utf-8")
            path_index.write_text(original.replace("archived: false", "archived: true"), encoding="utf-8")
            run_sync(root, "5" * 40)
            self.assertFalse(LearningPath.objects.get().published)
            self.assertFalse(Lesson.objects.get().published)
            self.assertFalse(Card.objects.get().published)
            self.assertFalse(Question.objects.get().published)
            # The children keep their own archive flags; only publication propagates.
            self.assertFalse(ContentEntity.objects.get(pk=CARD_ID).archived)
            self.assertFalse(ContentEntity.objects.get(pk=LESSON_ID).archived)
            # Un-archiving the parent republishes the subtree.
            path_index.write_text(original, encoding="utf-8")
            run_sync(root, "6" * 40)
        self.assertTrue(LearningPath.objects.get().published)
        self.assertTrue(Card.objects.get().published)
        self.assertTrue(Question.objects.get().published)

    def test_archived_card_stays_unpublished_under_a_live_parent(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            card_file = root / "themes/language/early-english/greetings/cards/01_expressions.md"
            card_file.write_text(
                card_file.read_text(encoding="utf-8").replace("archived: false", "archived: true"),
                encoding="utf-8",
            )
            run_sync(root, "7" * 40)
        self.assertTrue(LearningPath.objects.get().published)
        self.assertFalse(Card.objects.get().published)

    def test_question_checkpoint_must_reference_a_card_in_the_lesson(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            question_file = root / "themes/language/early-english/greetings/questions/01_complete.yaml"
            question_file.write_text(
                question_file.read_text(encoding="utf-8").replace("after_card_position: 1", "after_card_position: 5"),
                encoding="utf-8",
            )
            with self.assertRaises(CommandError):
                run_sync(root, "8" * 40)
        self.assertEqual(Question.objects.count(), 0)
        self.assertEqual(SyncLog.objects.count(), 0)

    def test_position_swaps_apply_and_preserve_identity_and_progress(self):
        second_card_id = str(uuid.uuid4())
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            cards = root / "themes/language/early-english/greetings/cards"
            (cards / "02_expressions.md").write_text(
                f"---\nid: {second_card_id}\nposition: 2\ntitle: Evening\narchived: false\n---\n\n**Good night.**\n",
                encoding="utf-8",
            )
            run_sync(root, "9" * 40)
            user = get_user_model().objects.create(username="learner")
            CardProgress.objects.create(user=user, card_id=CARD_ID, completed_at=timezone.now())
            first = cards / "01_expressions.md"
            first.write_text(
                first.read_text(encoding="utf-8").replace("position: 1", "position: 2"), encoding="utf-8"
            )
            second = cards / "02_expressions.md"
            second.write_text(
                second.read_text(encoding="utf-8").replace("position: 2", "position: 1"), encoding="utf-8"
            )
            run_sync(root, "8" * 40)
        self.assertEqual(Card.objects.get(pk=CARD_ID).position, 2)
        self.assertEqual(Card.objects.get(pk=second_card_id).position, 1)
        # Identity and learner progress survive the reorder.
        progress = CardProgress.objects.get()
        self.assertEqual(str(progress.card_id), CARD_ID)
        self.assertEqual(Card.objects.count(), 2)

    def test_duplicate_sibling_positions_in_the_manifest_abort(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            cards = root / "themes/language/early-english/greetings/cards"
            (cards / "02_expressions.md").write_text(
                f"---\nid: {uuid.uuid4()}\nposition: 1\ntitle: Duplicate\narchived: false\n---\n\n**Oops.**\n",
                encoding="utf-8",
            )
            with self.assertRaises(CommandError) as caught:
                run_sync(root, "7" * 40)
        self.assertIn("position 1 is already used", str(caught.exception))
        self.assertEqual(SyncLog.objects.count(), 0)

    def test_disappearing_published_content_aborts_the_sync(self):
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            run_sync(root, "2" * 40)
            (root / "themes/language/early-english/greetings/cards/01_expressions.md").unlink()
            with self.assertRaises(CommandError) as caught:
                run_sync(root, "3" * 40)
        message = str(caught.exception)
        self.assertIn("1 published content ID(s)", message)
        self.assertIn(CARD_ID, message)
        self.assertIn("archived: true", message)
        # The abort preserved everything: the row is still published, no new SyncLog.
        self.assertTrue(Card.objects.get(pk=CARD_ID).published)
        self.assertEqual(SyncLog.objects.count(), 1)

    def test_missing_but_already_retired_rows_only_warn(self):
        orphan_id = uuid.uuid4()
        with TemporaryDirectory() as tmp:
            root = write_library(Path(tmp))
            run_sync(root, "4" * 40)
            ContentEntity.objects.create(id=orphan_id, kind=ContentEntity.Kind.CARD, archived=True)
            out = run_sync(root, "5" * 40)
        self.assertIn("left untouched", out)
        self.assertTrue(ContentEntity.objects.filter(pk=orphan_id).exists())
        self.assertEqual(SyncLog.objects.count(), 2)

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


def illustrate_card(root: Path, extra: str = "") -> Path:
    """Give the library's card a sibling image with credit metadata."""
    card = root / "themes/language/early-english/greetings/cards/01_expressions.md"
    text = card.read_text(encoding="utf-8")
    text = text.replace(
        "archived: false\n---",
        "image: reef.png\nimage_alt: A coral reef seen from above.\n" + extra + "archived: false\n---",
    )
    card.write_text(text, encoding="utf-8")
    (card.parent / "reef.png").write_bytes(make_png())
    return root


class CardIllustrationSyncTests(TestCase):
    def test_card_image_metadata_synced_without_bucket(self):
        with TemporaryDirectory() as tmp:
            root = illustrate_card(
                write_library(Path(tmp)),
                "image_caption: Reef scene.\nimage_credit: Jane Doe\nimage_license: CC BY 4.0\n"
                "image_source_url: https://commons.example.org/reef\n",
            )
            out = run_sync(root, "1" * 40)
        self.assertIn("media bucket is not configured", out)
        card = Card.objects.get()
        self.assertTrue(card.illustration_path.endswith("reef.png"))
        self.assertEqual(card.illustration_alt, "A coral reef seen from above.")
        self.assertEqual(card.illustration_caption, "Reef scene.")
        self.assertEqual(card.illustration_credit, "Jane Doe")
        self.assertEqual(card.illustration_license, "CC BY 4.0")
        self.assertEqual(card.illustration_source_url, "https://commons.example.org/reef")
        # No bucket: no variants, no hash, delivery stays on the repository fallback.
        self.assertEqual(card.illustration_variants, {})
        self.assertEqual(card.illustration_source_hash, "")

    def test_card_image_requires_credit_and_license_unless_original(self):
        with TemporaryDirectory() as tmp:
            root = illustrate_card(write_library(Path(tmp)))
            with self.assertRaises(CommandError) as raised:
                run_sync(root, "2" * 40)
        self.assertIn("image_credit", str(raised.exception))

    def test_original_artwork_needs_no_credit(self):
        with TemporaryDirectory() as tmp:
            root = illustrate_card(write_library(Path(tmp)), "image_license: original\n")
            run_sync(root, "3" * 40)
        card = Card.objects.get()
        self.assertEqual(card.illustration_license, "original")
        self.assertEqual(card.illustration_credit, "")

    def test_bucket_processing_and_unchanged_hash_gate(self):
        uploads = []

        def fake_upload(card_id, sha, variants):
            uploads.append((card_id, sha, sorted(variants)))
            return {str(width): f"learning/{card_id}/{sha}-{width}.webp" for width in variants}

        with TemporaryDirectory() as tmp:
            root = illustrate_card(write_library(Path(tmp)), "image_license: original\n")
            with mock.patch("apps.learning.illustrations.bucket_available", return_value=True), mock.patch(
                "apps.learning.illustrations.upload_variants", side_effect=fake_upload
            ):
                run_sync(root, "8" * 40)
                card = Card.objects.get()
                self.assertEqual(len(uploads), 1)
                self.assertEqual(card.illustration_width, 800)
                self.assertEqual(card.illustration_height, 600)
                self.assertEqual(len(card.illustration_source_hash), 64)
                self.assertEqual(
                    card.illustration_variants,
                    {"640": f"learning/{card.pk}/{card.illustration_source_hash}-640.webp"},
                )
                # Re-sync of the unchanged image does no decode, resize or upload.
                run_sync(root, "9" * 40)
                self.assertEqual(len(uploads), 1)
                # Replacing the source image processes and uploads again.
                (root / "themes/language/early-english/greetings/cards/reef.png").write_bytes(
                    make_png(1600, 1200)
                )
                run_sync(root, "a" * 40)
                self.assertEqual(len(uploads), 2)
                card.refresh_from_db()
                self.assertEqual(card.illustration_width, 1600)
                self.assertEqual(
                    set(card.illustration_variants),
                    {"640", "1280"},
                )

    def test_removing_the_image_blanks_every_illustration_field(self):
        with TemporaryDirectory() as tmp:
            root = illustrate_card(write_library(Path(tmp)), "image_license: original\n")
            run_sync(root, "b" * 40)
            card_file = root / "themes/language/early-english/greetings/cards/01_expressions.md"
            text = card_file.read_text(encoding="utf-8")
            for line in ("image: reef.png\n", "image_alt: A coral reef seen from above.\n", "image_license: original\n"):
                text = text.replace(line, "")
            card_file.write_text(text, encoding="utf-8")
            run_sync(root, "c" * 40)
        card = Card.objects.get()
        self.assertEqual(card.illustration_path, "")
        self.assertEqual(card.illustration_variants, {})
        self.assertIsNone(card.illustration_width)
