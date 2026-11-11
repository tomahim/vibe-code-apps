"""Pin the product rule: lesson and learning-path completion mean every card
read, independent of question results (Thomas, 2026-11-11; refs #465).

One shared mock exercises every completion compute site in this app. The same
mock drives the frontend checks in ui/tests/little-grains-completion-rule.test.mjs:

    path P
      lesson L1: 3 cards, questions q1a and q1b (a pool of two alternatives at
                 the checkpoint after card 1)
      lesson L2: 2 cards, question q2 (after card 1)

Question pools exist because rotation can leave alternatives unseen (#204);
the reading rule must not depend on how many alternatives were ever answered.

Compute sites covered here:
  - api.LearnerState.lesson_fully_read (canonical reading helper)
  - api.LearnerState.progress()["completed"] (generic API gauge, lesson + path)
  - views.path_detail next_lesson_id (consumes the API gauge)
  - rewards.reward_events (+5 lesson bonus, +100 path bonus)
  - admin.progress_dashboard_context (staff dashboard lessons_read)
  - badges.History read variants vs mastery variants

Sites that still require every pooled question answered correctly contradict
the product rule. Their tests assert the intended rule and FAIL against the
current strict predicate: this PR is intentionally red (Thomas, 2026-11-11).
The fix aligns the strict predicate with the reading rule and turns these
tests green; it must not weaken or delete them.
"""

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.accounts.tokens import issue_token
from .admin import progress_dashboard_context
from .api import LearnerState
from .badges import History
from .models import Card, CardProgress, ContentEntity, LearningPath, Lesson, Question, QuestionAttempt, Theme
from .rewards import reward_events

T0 = datetime(2026, 11, 11, 9, 0, tzinfo=timezone.utc)


class CompletionRuleFixtures(TestCase):
    """The shared mock: same content tree and card reads for every site."""

    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            position=fields.pop("position", 1), published=True, source_path="example", last_changed_commit="a" * 40,
            **({"title": model.__name__} if model != Question else {}), **fields,
        )

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="learner")
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.user)}"
        self.theme = self.row(Theme)
        self.path = self.row(LearningPath, theme=self.theme)
        self.lesson1 = self.row(Lesson, learning_path=self.path, position=1)
        self.cards1 = [self.row(Card, lesson=self.lesson1, position=i + 1, body_markdown="x") for i in range(3)]
        self.question1a = self.question(self.lesson1, position=1)
        self.question1b = self.question(self.lesson1, position=2)  # pooled alternative at the same checkpoint
        self.lesson2 = self.row(Lesson, learning_path=self.path, position=2)
        self.cards2 = [self.row(Card, lesson=self.lesson2, position=i + 1, body_markdown="x") for i in range(2)]
        self.question2 = self.question(self.lesson2, position=1)

    def question(self, lesson, position):
        return self.row(Question, lesson=lesson, position=position, after_card_position=1,
                        prompt="?", options=[{"id": str(i), "text": str(i)} for i in range(4)],
                        answer="0", explanation="e")

    def read(self, cards, user=None):
        user = user or self.user
        CardProgress.objects.bulk_create([
            CardProgress(user=user, card=card, completed_at=T0 + timedelta(minutes=i))
            for i, card in enumerate(cards)
        ])

    def read_all_cards(self):
        self.read(self.cards1 + self.cards2)

    def attempt(self, question, correct=True, user=None):
        QuestionAttempt.objects.create(user=user or self.user, question=question, attempt_type="initial",
                                       submitted_answer="x", correct=correct,
                                       answered_at=T0 + timedelta(minutes=30))

    def state(self, *lessons):
        return LearnerState(self.user, lessons=list(lessons))


class ReadingRuleTests(CompletionRuleFixtures):
    """Sites that already follow the product rule. These must keep passing."""

    def test_canonical_helper_finishes_a_lesson_once_every_card_is_read(self):
        self.read_all_cards()
        state = self.state(self.lesson1, self.lesson2)
        # No question answered: completion must not wait for practice.
        self.assertTrue(state.lesson_fully_read(self.lesson1.pk))
        self.assertTrue(state.lesson_fully_read(self.lesson2.pk))

    def test_canonical_helper_waits_for_unread_cards(self):
        self.read(self.cards1[:2])
        state = self.state(self.lesson1)
        self.assertFalse(state.lesson_fully_read(self.lesson1.pk))

    def test_rewards_lesson_and_path_bonuses_follow_all_cards_read(self):
        self.read_all_cards()
        # Zero correct answers anywhere: bonuses are reading rewards.
        events = reward_events()[self.user.pk]
        self.assertEqual(sum(1 for kind, amount, _ in events if (kind, amount) == ("drops", 5)), 2)
        self.assertEqual(sum(1 for kind, amount, _ in events if (kind, amount) == ("drops", 100)), 1)
        self.assertEqual(sum(1 for kind, _, _ in events if kind == "carrots"), 0)

    def test_rewards_bonuses_ignore_wrong_answers(self):
        self.read_all_cards()
        self.attempt(self.question1a, correct=False)
        self.attempt(self.question2, correct=False)
        events = reward_events()[self.user.pk]
        self.assertEqual(sum(1 for kind, amount, _ in events if (kind, amount) == ("drops", 5)), 2)
        self.assertEqual(sum(1 for kind, amount, _ in events if (kind, amount) == ("drops", 100)), 1)

    def test_rewards_partial_read_earns_no_completion_bonus(self):
        self.read(self.cards1)
        events = reward_events()[self.user.pk]
        self.assertEqual(sum(1 for kind, amount, _ in events if (kind, amount) == ("drops", 5)), 1)
        self.assertEqual(sum(1 for kind, amount, _ in events if (kind, amount) == ("drops", 100)), 0)

    def test_admin_dashboard_lessons_read_follows_all_cards_read(self):
        self.read_all_cards()
        context = progress_dashboard_context(self.user)
        self.assertEqual(context["totals"]["lessons_read"], 2)
        self.assertEqual(context["totals"]["lessons_total"], 2)
        self.assertEqual(context["totals"]["questions_correct"], 0)

    def test_badge_read_variants_follow_all_cards_read(self):
        self.read_all_cards()
        history = History(self.user)
        self.assertIsNotNone(history.lesson_read_at(self.lesson1.pk))
        self.assertIsNotNone(history.lesson_read_at(self.lesson2.pk))
        self.assertEqual([ref for _, ref in history.paths_read()], [("path", self.path.pk)])

    def test_badge_mastery_variants_deliberately_keep_questions(self):
        """Question-mastery badges are a separate concept from completion and
        stay question-based: they are NOT part of the completion-rule change."""
        self.read_all_cards()
        history = History(self.user)
        self.assertIsNone(history.lesson_done_at(self.lesson1.pk))
        self.assertEqual(history.paths_done(), [])
        for question in (self.question1a, self.question1b, self.question2):
            self.attempt(question)
        history = History(self.user)
        self.assertIsNotNone(history.lesson_done_at(self.lesson1.pk))
        self.assertEqual([ref for _, ref in history.paths_done()], [("path", self.path.pk)])


class StrictGaugeGapTests(CompletionRuleFixtures):
    """Sites that still require every pooled question answered correctly.

    Each test asserts the product rule and FAILS against the current strict
    predicate. That red is the point of this PR: CI stays red until a fix
    aligns these sites with the all-cards-read rule (#465).
    """

    # fails today: strict api.progress requires all questions correct (#465)
    def test_api_lesson_completed_matches_all_cards_read(self):
        self.read_all_cards()
        progress = self.state(self.lesson1, self.lesson2).progress([self.lesson1])
        self.assertTrue(progress["completed"])
        self.assertEqual(progress["lessons_completed"], 1)

    # fails today: strict api.progress requires all questions correct (#465)
    def test_api_path_completed_matches_all_cards_read(self):
        self.read_all_cards()
        progress = self.state(self.lesson1, self.lesson2).progress([self.lesson1, self.lesson2])
        self.assertTrue(progress["completed"])
        self.assertEqual(progress["lessons_completed"], 2)

    # fails today: strict api.progress requires EVERY pooled alternative correct (#465, #204)
    def test_api_completion_ignores_unseen_pool_alternatives(self):
        self.read_all_cards()
        # One correct answer per checkpoint, but the pooled alternative q1b
        # was never rotated in, so it has no correct attempt.
        self.attempt(self.question1a)
        self.attempt(self.question2)
        progress = self.state(self.lesson1, self.lesson2).progress([self.lesson1, self.lesson2])
        self.assertTrue(progress["completed"])

    def test_garden_lesson_and_path_flags_follow_all_cards_read(self):
        # Garden is the surviving navigation contract (#470): it must expose
        # the same rule used to select unfinished lessons, without a second
        # client-side definition. Keep the original red checkpoint in history.
        def garden_path():
            response = self.client.get('/api/learning/garden/')
            self.assertEqual(response.status_code, 200)
            return response.json()['themes'][0]['learning_paths'][0]

        self.read(self.cards1)
        path = garden_path()
        self.assertEqual([lesson['progress']['completed'] for lesson in path['lessons']], [True, False])
        self.assertFalse(path['progress']['completed'])
        self.read(self.cards2)
        path = garden_path()
        self.assertTrue(all(lesson['progress']['completed'] for lesson in path['lessons']))
        self.assertTrue(path['progress']['completed'])


class EmptyLessonCharacterizationTests(TestCase):
    """A path whose visible lessons include a zero-card lesson. The intended
    empty-lesson rule is UNRESOLVED (#465): the backend treats a zero-card
    lesson as never fully read, so the gauge and rewards say the path is not
    finished - and the frontend now shows the server flag rather than its own
    aggregate, so the old celebration split is gone. This pins current
    behavior only - it does not endorse it. Whichever rule the policy chooses
    updates these tests; the mirrored frontend characterization lives in
    little-grains-completion-rule.test.mjs."""

    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            position=fields.pop("position", 1), published=True, source_path="example", last_changed_commit="a" * 40,
            **({"title": model.__name__} if model != Question else {}), **fields,
        )

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="learner")
        self.theme = self.row(Theme)
        self.path = self.row(LearningPath, theme=self.theme)
        self.lesson = self.row(Lesson, learning_path=self.path, position=1)
        self.cards = [self.row(Card, lesson=self.lesson, position=i + 1, body_markdown="x") for i in range(3)]
        self.empty_lesson = self.row(Lesson, learning_path=self.path, position=2)
        CardProgress.objects.bulk_create([
            CardProgress(user=self.user, card=card, completed_at=T0 + timedelta(minutes=i))
            for i, card in enumerate(self.cards)
        ])

    def test_empty_lesson_current_behavior_characterization(self):
        lessons = [self.lesson, self.empty_lesson]
        state = LearnerState(self.user, lessons=lessons)
        # Current rule: an empty lesson is never "fully read"...
        self.assertFalse(state.lesson_fully_read(self.empty_lesson.pk))
        # ... the aggregate gauge never completes ...
        self.assertFalse(state.progress(lessons)["completed"])
        # ... and rewards never grant the +100 path bonus ...
        events = reward_events()[self.user.pk]
        self.assertEqual(sum(1 for kind, amount, _ in events if (kind, amount) == ("drops", 5)), 1)
        self.assertEqual(sum(1 for kind, amount, _ in events if (kind, amount) == ("drops", 100)), 0)
        # The frontend celebration follows the same server flag, so it no
        # longer celebrates this path either (mirrored frontend test).
