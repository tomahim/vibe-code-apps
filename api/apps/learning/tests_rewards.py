"""Personal reward replay stays equivalent without loading other learners (#454)."""
from datetime import datetime, timedelta, timezone
from unittest.mock import patch
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.db import connection
from django.test import TestCase
from django.test.utils import CaptureQueriesContext

from apps.accounts.tokens import issue_token
from .models import Card, CardProgress, ContentEntity, LearningPath, Lesson, Question, QuestionAttempt, Theme
from .rewards import reward_events, reward_events_for, totals
from .snapshot import content_snapshot

T0 = datetime(2026, 10, 31, 23, 59, tzinfo=timezone.utc)


class PersonalRewardTests(TestCase):
    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            position=fields.pop('position', 1), published=True, source_path='example', last_changed_commit='a' * 40,
            **({'title': model.__name__} if model != Question else {}), **fields,
        )

    def setUp(self):
        self.user = get_user_model().objects.create_user(username='learner')
        self.other = get_user_model().objects.create_user(username='other')
        self.empty = get_user_model().objects.create_user(username='empty')
        self.theme = self.row(Theme)
        self.path = self.row(LearningPath, theme=self.theme)
        self.lesson = self.row(Lesson, learning_path=self.path)
        self.cards = [self.row(Card, lesson=self.lesson, position=i + 1, body_markdown='x') for i in range(2)]
        self.question = self.row(Question, lesson=self.lesson, after_card_position=1,
                                 prompt='?', options=[], answer='a', explanation='e')
        for user, cards in ((self.user, self.cards), (self.other, self.cards[:1])):
            CardProgress.objects.bulk_create([
                CardProgress(user=user, card=card, completed_at=T0 + timedelta(minutes=i))
                for i, card in enumerate(cards)
            ])
        # Insert out of chronological order. Only the earliest correct answer
        # earns a carrot, independent of lesson/review/challenge attempt type.
        for kind, correct, minute in [('review', True, 10), ('initial', False, -5),
                                      ('retry', True, 1), ('challenge', True, 1)]:
            self.attempt(self.user, kind, correct, minute)
        self.attempt(self.other, 'initial', True, -10)

    def attempt(self, user, kind, correct, minute):
        return QuestionAttempt.objects.create(user=user, question=self.question, attempt_type=kind,
                                              correct=correct, submitted_answer='a',
                                              answered_at=T0 + timedelta(minutes=minute))

    def assert_parity(self):
        all_events = reward_events()
        for user in (self.user, self.other, self.empty):
            personal = reward_events_for(user)
            self.assertCountEqual(personal, all_events.get(user.pk, []))
            for period in ('overall', 'weekly', 'monthly'):
                for offset in (0, 1):
                    self.assertEqual(totals(personal, period, T0 + timedelta(days=3), offset),
                                     totals(all_events.get(user.pk, []), period, T0 + timedelta(days=3), offset))

    def test_events_timestamps_bonuses_and_period_totals_are_preserved(self):
        done = T0 + timedelta(minutes=1)
        self.assertCountEqual(reward_events_for(self.user), [
            ('drops', 1, T0), ('drops', 1, done), ('carrots', 1, done),
            ('drops', 5, done), ('drops', 100, done),
        ])
        self.assertEqual(totals(reward_events_for(self.user)), {'drops': 107, 'carrots': 1})
        self.assertEqual(totals(reward_events_for(self.other)), {'drops': 1, 'carrots': 1})
        self.assertEqual(reward_events_for(self.empty), [])
        self.assert_parity()

    def test_correct_answer_without_card_reads_still_earns_one_carrot(self):
        self.attempt(self.empty, 'review', True, 0)
        self.assertEqual(reward_events_for(self.empty), [('carrots', 1, T0)])
        self.assert_parity()

    def test_empty_lesson_keeps_path_incomplete(self):
        self.row(Lesson, learning_path=self.path, position=2)
        self.assertEqual(totals(reward_events_for(self.user)), {'drops': 7, 'carrots': 1})
        self.assert_parity()

    def test_unpublished_content_and_hidden_ancestors_keep_current_rules(self):
        for model, record in ((Theme, self.theme), (LearningPath, self.path), (Lesson, self.lesson),
                              (Card, self.cards[0]), (Question, self.question)):
            with self.subTest(model=model.__name__):
                record.published = False
                record.save()
                self.assert_parity()
                # A hidden anchor card also hides its checkpoint question.
                expected = {'drops': 106, 'carrots': 0} if model == Card else (
                    {'drops': 107, 'carrots': 0} if model == Question else {'drops': 0, 'carrots': 0})
                self.assertEqual(totals(reward_events_for(self.user)), expected)
                record.published = True
                record.save()

    def test_archived_content_is_excluded(self):
        self.path.entity.archived = True
        self.path.entity.save()
        self.assertEqual(reward_events_for(self.user), [])
        self.assert_parity()

    def test_history_queries_only_return_the_requested_user(self):
        content_snapshot()  # warm the published-content cache: steady state
        with CaptureQueriesContext(connection) as captured:
            reward_events_for(self.user)
        history = [q['sql'] for q in captured if 'FROM "lg_card_progress"' in q['sql']
                   or 'FROM "lg_question_attempt"' in q['sql']]
        self.assertEqual(len(history), 2)
        for sql in history:
            with self.subTest(sql=sql), connection.cursor() as cursor:
                cursor.execute(sql)
                rows = cursor.fetchall()
                self.assertTrue(rows)
                self.assertEqual({row[0] for row in rows}, {self.user.pk})
        # Content reads come from the warmed snapshot: one SyncLog commit
        # check plus the two history queries, not N+1.
        self.assertEqual(len(captured), 3)

    def test_other_learners_history_does_not_expand_personal_replay(self):
        before = reward_events_for(self.user)
        QuestionAttempt.objects.bulk_create([
            QuestionAttempt(user=self.other, question=self.question, attempt_type='review',
                            correct=True, submitted_answer='a', answered_at=T0 + timedelta(minutes=i))
            for i in range(1000)
        ])
        with CaptureQueriesContext(connection) as captured:
            self.assertEqual(reward_events_for(self.user), before)
        sql = next(q['sql'] for q in captured if 'FROM "lg_question_attempt"' in q['sql'])
        with connection.cursor() as cursor:
            cursor.execute(sql)
            self.assertEqual(len(cursor.fetchall()), 3)  # only this learner's correct attempts
        with CaptureQueriesContext(connection) as all_captured:
            reward_events()
        all_sql = next(q['sql'] for q in all_captured if 'FROM "lg_question_attempt"' in q['sql'])
        with connection.cursor() as cursor:
            cursor.execute(all_sql)
            self.assertEqual(len(cursor.fetchall()), 1004)  # 3 personal + 1001 other
        self.assert_parity()

    def test_garden_uses_personal_rewards_without_all_user_replay(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {issue_token(self.user)}'
        with patch('apps.learning.rewards.reward_events', side_effect=AssertionError('all-user replay')):
            response = self.client.get('/api/learning/garden/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['rewards'], {'drops': 107, 'carrots': 1})
        # The obsolete progress endpoint must not be brought back by this fix.
        self.assertEqual(self.client.get('/api/learning/progress/').status_code, 404)

    def test_unsaved_user_cannot_fall_back_to_all_user_replay(self):
        with self.assertNumQueries(0), self.assertRaisesMessage(ValueError, 'saved user'):
            reward_events_for(get_user_model()())
