"""The published content snapshot: reuse, invalidation and bounded retention."""
from uuid import uuid4

from django.core.cache import cache
from django.test import TestCase

from .api import LearnerState
from .models import Card, ContentEntity, LearningPath, Lesson, Question, SyncLog, Theme
from .snapshot import CACHE_KEY, content_snapshot


class ContentSnapshotTests(TestCase):
    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            published=True, position=fields.pop('position', 1), source_path='test',
            last_changed_commit='a' * 40,
            **({'title': model.__name__} if model != Question else {}), **fields,
        )

    def setUp(self):
        self.theme = self.row(Theme)
        self.path = self.row(LearningPath, theme=self.theme)
        self.lesson = self.row(Lesson, learning_path=self.path)
        self.card = self.row(Card, lesson=self.lesson, body_markdown='body')
        self.question = self.row(Question, lesson=self.lesson, after_card_position=1,
                                 prompt='?', options=[{'id': 'a', 'text': 'A'}],
                                 answer='a', explanation='e')

    def test_snapshot_rows_cover_the_visible_tree_in_model_order(self):
        snapshot = content_snapshot()
        self.assertEqual([(row.pk, row.lesson_id, row.position) for row in snapshot.cards],
                         [(self.card.pk, self.lesson.pk, 1)])
        self.assertEqual([(row.pk, row.type) for row in snapshot.questions],
                         [(self.question.pk, Question.Type.MULTIPLE_CHOICE)])
        self.assertEqual([row.pk for row in snapshot.lessons], [self.lesson.pk])
        self.assertEqual([row.pk for row in snapshot.paths], [self.path.pk])
        self.assertEqual([row.pk for row in snapshot.themes], [self.theme.pk])
        # The all-rows maps resolve history against since-unpublished content.
        self.assertEqual(snapshot.card_lesson, {self.card.pk: self.lesson.pk})
        self.assertEqual(snapshot.question_info[self.question.pk],
                         (self.lesson.pk, Question.Type.MULTIPLE_CHOICE))

    def test_rows_carry_no_content_fields(self):
        snapshot = content_snapshot()
        for field in ('body_markdown', 'prompt', 'options', 'answer', 'accepted_answers',
                      'explanation', 'title', 'description', 'introduction_markdown'):
            for rows in (snapshot.cards, snapshot.questions, snapshot.lessons,
                         snapshot.paths, snapshot.themes):
                self.assertFalse(any(hasattr(row, field) for row in rows), field)

    def test_warm_snapshot_is_reused_with_only_the_commit_check(self):
        first = content_snapshot()
        with self.assertNumQueries(1):  # the SyncLog commit check
            again = content_snapshot()
        self.assertEqual(again, first)

    def test_new_synclog_commit_rebuilds_even_without_a_signal(self):
        # The GitHub sync runs in another process: its SyncLog row arrives
        # without any in-process signal, so the commit check must catch it.
        first = content_snapshot()
        self.assertIsNone(first.commit)
        SyncLog.objects.bulk_create([SyncLog(commit_sha='b' * 40, changes={})])
        rebuilt = content_snapshot()
        self.assertIsNot(rebuilt, first)
        self.assertEqual(rebuilt.commit, 'b' * 40)

    def test_orm_writes_invalidate_without_a_synclog(self):
        first = content_snapshot()
        other = self.row(Card, lesson=self.lesson, position=2, body_markdown='new')
        rebuilt = content_snapshot()
        self.assertIsNot(rebuilt, first)
        self.assertEqual([row.pk for row in rebuilt.cards], [self.card.pk, other.pk])
        # Unpublishing through the ORM is reflected on the next read too.
        other.published = False
        other.save()
        self.assertEqual([row.pk for row in content_snapshot().cards], [self.card.pk])

    def test_retention_stays_bounded_to_one_fixed_key(self):
        content_snapshot()
        SyncLog.objects.bulk_create([SyncLog(commit_sha='c' * 40, changes={})])
        content_snapshot()
        SyncLog.objects.bulk_create([SyncLog(commit_sha='d' * 40, changes={})])
        content_snapshot()
        keys = [key for key in cache._cache if 'snapshot' in key]
        self.assertEqual(keys, [f':1:{CACHE_KEY}'])

    def test_learner_state_reads_the_snapshot_with_three_queries(self):
        from django.contrib.auth import get_user_model
        user = get_user_model().objects.create_user(username='reader')
        content_snapshot()  # warm
        with self.assertNumQueries(3):  # commit check + card reads + question attempts
            state = LearnerState(user)
        self.assertEqual([card.pk for card in state.cards], [self.card.pk])
        self.assertEqual([q.pk for q in state.questions], [self.question.pk])
