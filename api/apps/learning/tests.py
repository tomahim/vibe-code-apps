from uuid import uuid4

from django.apps import apps
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError, connection, transaction
from django.db.models.deletion import ProtectedError
from django.test import TestCase
from django.utils import timezone

from .grading import normalize_typed_answer
from .models import (
    Card, CardProgress, ContentEntity, LearningPath, Lesson, Question,
    QuestionAttempt, SyncLog, Theme,
)


class LearningSchemaTests(TestCase):
    def test_typed_answer_normalizes_case_punctuation_spacing_and_apostrophes(self):
        self.assertEqual(normalize_typed_answer("  I’M  RIGHT_here!! "), "im right here")
        self.assertEqual(normalize_typed_answer("I'm right here."), "im right here")

    def entity(self, kind):
        return ContentEntity.objects.create(id=uuid4(), kind=kind)

    def described(self, model, **fields):
        return model.objects.create(
            entity=self.entity(model.CONTENT_KIND), title=model.__name__, position=1,
            source_path="themes/example/index.md", last_changed_commit="a" * 40,
            **fields,
        )

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="learner")
        self.theme = self.described(Theme)
        self.path = self.described(LearningPath, theme=self.theme)
        self.lesson = self.described(Lesson, learning_path=self.path, introduction_markdown="An introduction.")
        self.card = Card.objects.create(
            entity=self.entity(Card.CONTENT_KIND), lesson=self.lesson, position=1,
            title="First expressions",
            body_markdown="An atomic card.", source_path="cards/one.md", last_changed_commit="a" * 40,
        )
        self.question = Question.objects.create(
            entity=self.entity(Question.CONTENT_KIND), lesson=self.lesson, position=1,
            after_card_position=1,
            source_path="questions/one.yaml", last_changed_commit="a" * 40,
            prompt="Which one?", options=[{"id": str(i), "text": f"Choice {i}"} for i in range(4)],
            answer="0", explanation="Because it is correct.",
        )

    def assert_database_rejects(self, operation):
        with self.assertRaises(IntegrityError), transaction.atomic():
            operation()

    def test_learning_tables_use_lg_prefix(self):
        models = list(apps.get_app_config("learning").get_models())
        self.assertEqual({model._meta.db_table for model in models}, {
            "lg_content_entity", "lg_theme", "lg_learning_path", "lg_lesson", "lg_card",
            "lg_question", "lg_sync_log", "lg_card_progress", "lg_question_attempt", "lg_lesson_open",
        })
        tables = set(connection.introspection.table_names())
        self.assertTrue(all(model._meta.db_table in tables for model in models))
        self.assertEqual(len(models), 10)

    def test_content_uuid_is_both_registry_id_and_content_primary_key(self):
        for record in (self.theme, self.path, self.lesson, self.card, self.question):
            self.assertEqual(record.id, record.entity_id)
            self.assertEqual(record.pk, record.entity.pk)
            record.full_clean()
        self.assert_database_rejects(lambda: ContentEntity.objects.create(id=self.card.pk, kind="theme"))

    def test_registry_validates_immutable_kind_and_cross_kind_reuse(self):
        entity = self.card.entity
        entity.kind = ContentEntity.Kind.QUESTION
        with self.assertRaises(ValidationError):
            entity.full_clean()
        other = Theme(entity=self.card.entity, position=2, title="Wrong kind", source_path="x", last_changed_commit="a")
        with self.assertRaises(ValidationError):
            other.full_clean()
        self.assert_database_rejects(lambda: ContentEntity.objects.create(id=uuid4(), kind="unknown"))

    def test_archived_entities_cannot_validate_as_published(self):
        self.card.entity.archived = True
        self.card.entity.save()
        self.card.published = True
        with self.assertRaises(ValidationError):
            self.card.full_clean()
        self.card.published = False
        self.card.full_clean()

    def test_positive_positions_and_unique_siblings_enforced_in_database(self):
        for model, parent in (
            (Theme, {}), (LearningPath, {"theme": self.theme}),
            (Lesson, {"learning_path": self.path}), (Card, {"lesson": self.lesson}),
            (Question, {"lesson": self.lesson}),
        ):
            with self.subTest(model=model.__name__):
                self.assert_database_rejects(lambda: model.objects.filter(pk={
                    Theme: self.theme.pk, LearningPath: self.path.pk, Lesson: self.lesson.pk,
                    Card: self.card.pk, Question: self.question.pk,
                }[model]).update(position=0))
                # Copy a complete row but assign a fresh UUID with the same parent/position.
                original = model.objects.filter(**parent).first()
                original.entity = self.entity(model.CONTENT_KIND)
                self.assert_database_rejects(lambda: original.save(force_insert=True))

    def test_positions_are_scoped_to_parent_and_cards_questions_are_separate(self):
        another_lesson = Lesson.objects.create(
            entity=self.entity(Lesson.CONTENT_KIND), learning_path=self.path, position=2,
            title="Second", source_path="second/index.md", last_changed_commit="b" * 40,
        )
        Card.objects.create(entity=self.entity(Card.CONTENT_KIND), lesson=another_lesson, position=1,
                            title="More expressions", body_markdown="More.")
        self.assertEqual(self.card.position, self.question.position)

    def test_authored_titles_and_introductions_roundtrip(self):
        self.theme.introduction_markdown = "# Language\n\nPractical language learning."
        self.path.introduction_markdown = "Learn everyday American English."
        self.card.title = "Wake up gently"
        for record in (self.theme, self.path, self.card):
            record.full_clean()
            record.save()
            record.refresh_from_db()
        self.assertEqual(self.theme.introduction_markdown, "# Language\n\nPractical language learning.")
        self.assertEqual(self.path.introduction_markdown, "Learn everyday American English.")
        self.assertEqual(self.card.title, "Wake up gently")
        self.assertEqual(self.lesson.introduction_markdown, "An introduction.")

    def test_card_title_is_required_and_limited_to_255_characters(self):
        for title in ("", "x" * 256):
            with self.subTest(title=title), self.assertRaises(ValidationError) as error:
                self.card.title = title
                self.card.full_clean()
            self.assertIn("title", error.exception.message_dict)

    def test_question_checkpoint_is_required_and_positive(self):
        for position in (None, 0, -1):
            with self.subTest(position=position), self.assertRaises(ValidationError) as error:
                self.question.after_card_position = position
                self.question.full_clean()
            self.assertIn("after_card_position", error.exception.message_dict)
            self.assert_database_rejects(
                lambda: Question.objects.filter(pk=self.question.pk).update(after_card_position=position)
            )

    def test_question_checkpoint_must_reference_a_card_in_its_own_lesson(self):
        self.question.after_card_position = 2
        with self.assertRaises(ValidationError) as error:
            self.question.full_clean()
        self.assertIn("after_card_position", error.exception.message_dict)
        other_lesson = Lesson.objects.create(
            entity=self.entity(Lesson.CONTENT_KIND), learning_path=self.path, position=2,
            title="Another lesson", source_path="other/index.md", last_changed_commit="b" * 40,
        )
        Card.objects.create(
            entity=self.entity(Card.CONTENT_KIND), lesson=other_lesson, position=2,
            title="Other lesson card", body_markdown="Other content.",
            source_path="other/cards/two.md", last_changed_commit="b" * 40,
        )
        with self.assertRaises(ValidationError):
            self.question.full_clean()
        Card.objects.create(
            entity=self.entity(Card.CONTENT_KIND), lesson=self.lesson, position=2,
            title="This lesson card", body_markdown="More content.",
            source_path="cards/two.md", last_changed_commit="b" * 40,
        )
        self.question.full_clean()

    def test_question_pool_can_share_a_checkpoint_with_unique_question_positions(self):
        for position in (2, 3):
            question = Question(
                entity=self.entity(Question.CONTENT_KIND), lesson=self.lesson,
                position=position, after_card_position=1,
                source_path=f"questions/{position}.yaml", last_changed_commit="b" * 40,
                prompt="Another question?", options=self.question.options,
                answer=self.question.answer, explanation="Another explanation.",
            )
            question.full_clean()
            question.save()
        self.assertEqual(
            list(Question.objects.filter(lesson=self.lesson, after_card_position=1).values_list("position", flat=True)),
            [1, 2, 3],
        )

    def test_missing_parents_are_rejected(self):
        def orphan_card():
            Card.objects.filter(pk=self.card.pk).update(lesson_id=uuid4())
            connection.check_constraints()
        self.assert_database_rejects(orphan_card)

    def test_completion_is_unique_per_user_card(self):
        CardProgress.objects.create(user=self.user, card=self.card, completed_at=timezone.now())
        self.assert_database_rejects(lambda: CardProgress.objects.create(user=self.user, card=self.card, completed_at=timezone.now()))
        second = get_user_model().objects.create_user(username="second")
        CardProgress.objects.create(user=second, card=self.card, completed_at=timezone.now())

    def test_history_survives_archiving_and_is_not_cascade_deleted(self):
        progress = CardProgress.objects.create(user=self.user, card=self.card, completed_at=timezone.now())
        for kind in QuestionAttempt.AttemptType.values:
            QuestionAttempt.objects.create(user=self.user, question=self.question, attempt_type=kind,
                                          submitted_answer="0", correct=True, answered_at=timezone.now())
        for obj in (self.theme, self.path, self.lesson, self.card, self.question, self.user, self.card.entity):
            with self.subTest(model=type(obj).__name__), self.assertRaises(ProtectedError):
                obj.delete()
        self.card.entity.archived = True
        self.card.entity.save()
        self.assertTrue(CardProgress.objects.filter(pk=progress.pk).exists())
        self.assertEqual(QuestionAttempt.objects.count(), 4)
        self.assert_database_rejects(lambda: QuestionAttempt.objects.all().update(attempt_type="invalid"))

    def test_multiple_choice_validation(self):
        for options, answer in (
            ([], "0"), ([{"id": str(i), "text": "Choice"} for i in range(3)], "0"),
            ([{"id": "same", "text": "Choice"}] * 4, "same"),
            ([{"id": str(i), "text": ""} for i in range(4)], "0"),
            ([{"id": str(i), "text": "Choice"} for i in range(4)], "missing"),
            ([None] * 4, "0"),
        ):
            with self.subTest(options=options), self.assertRaises(ValidationError):
                self.question.options, self.question.answer = options, answer
                self.question.full_clean()
        self.assert_database_rejects(lambda: Question.objects.filter(pk=self.question.pk).update(type="unknown"))

    def test_translation_question_validation(self):
        self.question.type = Question.Type.TYPE_ANSWER_QUESTION
        self.question.options = []
        self.question.answer = "I'm right here."
        self.question.accepted_answers = ["I'm right here.", "I am right here."]
        self.question.full_clean()
        for answers in ([], [""], ["I'm right here.", "i’m right here!"], [123]):
            with self.subTest(answers=answers), self.assertRaises(ValidationError):
                self.question.accepted_answers = answers
                self.question.full_clean()
        self.question.accepted_answers = ["I'm right here."]
        self.question.options = [{"id": "x", "text": "Wrong"}]
        with self.assertRaises(ValidationError):
            self.question.full_clean()

    def test_images_need_alt_text(self):
        self.lesson.image_path = "assets/example.webp"
        with self.assertRaises(ValidationError):
            self.lesson.full_clean()
        self.lesson.image_alt = "An example illustration"
        self.lesson.full_clean()
        self.card.illustration_path = "assets/card.webp"
        with self.assertRaises(ValidationError):
            self.card.full_clean()

    def test_successful_sync_commit_is_unique_and_summary_roundtrips(self):
        log = SyncLog.objects.create(commit_sha="a" * 40, changes={"added": [str(self.card.pk)], "updated": []})
        self.assertIsNotNone(log.updated_at)
        self.assertEqual(SyncLog.objects.get(pk=log.pk).changes["added"], [str(self.card.pk)])
        self.assert_database_rejects(lambda: SyncLog.objects.create(commit_sha=log.commit_sha))

