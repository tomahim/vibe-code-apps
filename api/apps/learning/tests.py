from uuid import uuid4

from django.apps import apps
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError, connection, transaction
from django.db.models.deletion import ProtectedError
from django.test import TestCase
from django.utils import timezone

from .models import (
    Card, CardProgress, ContentEntity, LearningPath, Lesson, Question,
    QuestionAttempt, SyncLog, Theme,
)


class LearningSchemaTests(TestCase):
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
            body_markdown="An atomic card.", source_path="cards/one.md", last_changed_commit="a" * 40,
        )
        self.question = Question.objects.create(
            entity=self.entity(Question.CONTENT_KIND), lesson=self.lesson, position=1,
            source_path="questions/one.yaml", last_changed_commit="a" * 40,
            prompt="Which one?", options=[{"id": str(i), "text": f"Choice {i}"} for i in range(4)],
            answer="0", explanation="Because it is correct.",
        )

    def assert_database_rejects(self, operation):
        with self.assertRaises(IntegrityError), transaction.atomic():
            operation()

    def test_exact_nine_tables_use_lg_prefix_and_no_extra_state_tables(self):
        models = list(apps.get_app_config("learning").get_models())
        self.assertEqual({model._meta.db_table for model in models}, {
            "lg_content_entity", "lg_theme", "lg_learning_path", "lg_lesson", "lg_card",
            "lg_question", "lg_sync_log", "lg_card_progress", "lg_question_attempt",
        })
        tables = set(connection.introspection.table_names())
        self.assertTrue(all(model._meta.db_table in tables for model in models))
        self.assertEqual(len(models), 9)

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
        Card.objects.create(entity=self.entity(Card.CONTENT_KIND), lesson=another_lesson, position=1, body_markdown="More.")
        self.assertEqual(self.card.position, self.question.position)

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
        self.assertEqual(QuestionAttempt.objects.count(), 3)
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
