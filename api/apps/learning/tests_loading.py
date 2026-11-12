"""Guard the DB-to-API boundary, not just the browser JSON size."""
import json
from uuid import uuid4
from unittest.mock import patch

from django.utils import timezone

from django.contrib.auth import get_user_model
from django.db import connection
from django.test import TestCase
from django.test.utils import CaptureQueriesContext

from apps.accounts.tokens import issue_token
from .api import LearnerState, next_step, public_questions
from .models import Card, CardProgress, ContentEntity, LearningPath, Lesson, Question, Theme
from .snapshot import content_snapshot


class BoundedLearningReadsTests(TestCase):
    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            published=True, position=fields.pop('position', 1), source_path='test',
            last_changed_commit='a' * 40,
            **({'title': model.__name__} if model != Question else {}), **fields,
        )

    def setUp(self):
        self.user = get_user_model().objects.create_user(username='reader')
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {issue_token(self.user)}'
        self.theme = self.row(Theme)
        self.path = self.row(LearningPath, theme=self.theme)
        self.lesson = self.row(Lesson, learning_path=self.path)
        self.other = self.row(Lesson, learning_path=self.path, position=2)
        for lesson in (self.lesson, self.other):
            self.row(Card, lesson=lesson, body_markdown='large body' * 1000)
            self.row(Question, lesson=lesson, after_card_position=1, prompt='large prompt' * 1000,
                     options=[{'id': 'a', 'text': 'A'}], answer='a', explanation='private explanation')
        # Warm the published-content cache, the steady state in production.
        content_snapshot()

    def test_metadata_supports_progress_and_next_step_without_deferred_reads(self):
        with self.assertNumQueries(3):
            state = LearnerState(self.user)
        # Structural rows carry no content fields at all (not even deferred).
        self.assertFalse(hasattr(state.cards[0], 'body_markdown'))
        self.assertFalse(hasattr(state.questions[0], 'prompt'))
        with self.assertNumQueries(0):
            self.assertEqual(state.progress([self.lesson])['cards_total'], 1)
            self.assertIsNotNone(next_step(state, self.lesson))
            self.assertEqual(state.catch_up_questions([self.lesson]), [])

    def test_explicit_scope_excludes_other_lessons_and_empty_scope_is_empty(self):
        state = LearnerState(self.user, lessons=[self.lesson])
        self.assertEqual({c.lesson_id for c in state.cards}, {self.lesson.pk})
        self.assertEqual({q.lesson_id for q in state.questions}, {self.lesson.pk})
        self.assertEqual(LearnerState(self.user, lessons=[]).cards, [])

    def test_summary_endpoints_do_not_select_card_or_question_content(self):
        for url in ('garden/',):
            with self.subTest(url=url), CaptureQueriesContext(connection) as queries:
                self.assertEqual(self.client.get('/api/learning/' + url).status_code, 200)
            projections = [q['sql'].split(' FROM ')[0] for q in queries
                           if q['sql'].startswith('SELECT')]
            for projection in projections:
                self.assertNotIn('"body_markdown"', projection)
                self.assertNotIn('"prompt"', projection)
                self.assertNotIn('"options"', projection)
                self.assertNotIn('"accepted_answers"', projection)
                self.assertNotIn('"explanation"', projection)

    def test_reader_loads_only_its_lesson_and_preserves_content(self):
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(f'/api/learning/lessons/{self.lesson.pk}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['cards']), 1)
        self.assertEqual(response.json()['cards'][0]['body_markdown'], 'large body' * 1000)
        content_reads = [q['sql'] for q in queries if '"body_markdown"' in q['sql'].split(' FROM ')[0]]
        self.assertEqual(len(content_reads), 1)
        self.assertIn('"lg_card"."lesson_id" =', content_reads[0])
        self.assertNotIn('private explanation', response.content.decode())

    def test_public_question_batch_is_one_query_and_keeps_selection_order(self):
        questions = list(reversed(LearnerState(self.user).questions))
        with self.assertNumQueries(1):
            payload = public_questions(questions)
        self.assertEqual([q['id'] for q in payload], [str(q.pk) for q in questions])
        self.assertTrue(all(q['prompt'] == 'large prompt' * 1000 for q in payload))
        self.assertTrue(all('answer' not in q and 'explanation' not in q for q in payload))
        with self.assertNumQueries(0):
            self.assertEqual(public_questions([]), [])

    def test_answer_submission_loads_state_once_bounded_to_the_question_lesson(self):
        card = Card.objects.get(lesson=self.lesson)
        question = Question.objects.get(lesson=self.lesson)
        CardProgress.objects.create(user=self.user, card=card, completed_at=timezone.now())
        with patch('apps.learning.views.LearnerState', wraps=LearnerState) as states:
            response = self.client.post('/api/learning/question-attempts/',
                                        {'question_id': str(question.pk), 'answer': 'a'},
                                        content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['progress']['cards_total'], 1)
        # One load per write (#457): the locked row makes the loaded state
        # plus the new attempt the post-write state, no reload needed.
        self.assertEqual(states.call_count, 1)
        for call in states.call_args_list:
            self.assertEqual(call.kwargs['lesson'].pk, self.lesson.pk)

    def test_answer_submission_query_count_stays_flat(self):
        # Pin the whole write's query set (#457): one LearnerState load, no
        # per-answer EXISTS probes, no reload. Was 16 before the fix.
        card = Card.objects.get(lesson=self.lesson)
        question = Question.objects.get(lesson=self.lesson)
        CardProgress.objects.create(user=self.user, card=card, completed_at=timezone.now())
        with self.assertNumQueries(9):
            response = self.client.post('/api/learning/question-attempts/',
                                        json.dumps({'question_id': str(question.pk), 'answer': 'a'}),
                                        content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_in_memory_answer_state_matches_fresh_state_after_each_attempt(self):
        card = Card.objects.get(lesson=self.lesson)
        question = Question.objects.get(lesson=self.lesson)
        question.options = [{'id': 'a', 'text': 'A'}, {'id': 'b', 'text': 'B'}]
        question.save()
        CardProgress.objects.create(user=self.user, card=card, completed_at=timezone.now())
        loaded = []

        def capture(*args, **kwargs):
            state = LearnerState(*args, **kwargs)
            loaded.append(state)
            return state

        for answer in ['b', 'a', 'b', 'a']:
            with patch('apps.learning.views.LearnerState', side_effect=capture) as builds:
                response = self.client.post('/api/learning/question-attempts/',
                                            json.dumps({'question_id': str(question.pk), 'answer': answer}),
                                            content_type='application/json')
            self.assertEqual(response.status_code, 201)
            self.assertEqual(builds.call_count, 1)
            fresh = LearnerState(self.user, lesson=self.lesson)
            for field in ['attempted', 'first_run_checkpoints', 'last_attempt', 'last_correct',
                          'correct_questions', 'passed', 'wrong_counts']:
                self.assertEqual(getattr(loaded[-1], field), getattr(fresh, field), (answer, field))
            self.assertEqual(response.json()['progress'], fresh.progress([self.lesson]))
