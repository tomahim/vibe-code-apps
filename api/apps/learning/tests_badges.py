from datetime import datetime, timedelta, timezone
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.accounts.tokens import issue_token
from pathlib import Path

from .badge_catalog import BADGES, TIERS
from .badges import MONTH, WEEK, History, check
from .models import BadgeAward
from .models import Card, CardProgress, ContentEntity, LearningPath, Lesson, Question, QuestionAttempt, Theme

def times(events):
    return [at for at, _ in events]


T0 = datetime(2026, 10, 5, 9, 0, tzinfo=timezone.utc)  # a Monday
NOW = datetime(2026, 11, 3, 8, 0, tzinfo=timezone.utc)


class BadgeTests(TestCase):
    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            position=fields.pop("position", 1), published=True, source_path="example", last_changed_commit="a" * 40,
            **({"title": model.__name__} if model != Question else {}), **fields,
        )

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="learner")
        self.other = get_user_model().objects.create_user(username="other")
        self.theme = self.row(Theme)
        self.path = self.row(LearningPath, theme=self.theme)
        self.lesson = self.row(Lesson, learning_path=self.path)

    def cards(self, n, lesson=None, start=T0, step=timedelta(minutes=1), user=None):
        lesson = lesson or self.lesson
        made = [self.row(Card, lesson=lesson, position=i + 1, body_markdown="x") for i in range(n)]
        CardProgress.objects.bulk_create([
            CardProgress(user=user or self.user, card=card, completed_at=start + i * step) for i, card in enumerate(made)])
        return made

    def question(self, position=1, typed=False, lesson=None):
        extra = ({"type": Question.Type.TYPE_ANSWER_QUESTION, "answer": "a", "accepted_answers": ["a"]} if typed
                 else {"options": [{"id": str(i), "text": str(i)} for i in range(4)], "answer": "0"})
        return self.row(Question, lesson=lesson or self.lesson, position=position, after_card_position=1,
                        prompt="?", explanation="e", **extra)

    def attempt(self, question, at, correct=True, kind="initial", user=None):
        QuestionAttempt.objects.create(user=user or self.user, question=question, attempt_type=kind,
                                       submitted_answer="x", correct=correct, answered_at=at)

    def badge(self, slug, user=None):
        return next(b for b in check(user or self.user, NOW)["badges"] if b["slug"] == slug)

    def test_nothing_is_earned_without_history(self):
        result = check(self.user, NOW)
        self.assertEqual(len(result["badges"]), 34)
        self.assertEqual((result["earned_count"], result["new_count"]), (0, 0))
        self.assertFalse(BadgeAward.objects.exists())

    def test_achievement_date_is_the_qualifying_event_not_the_request_time(self):
        self.cards(100)
        self.assertIsNone(self.badge("wise-oak")["earned_at"])
        beetle = self.badge("book-beetle")
        self.assertEqual(beetle["earned_at"], (T0 + timedelta(minutes=99)).isoformat())
        self.assertEqual(self.badge("first-sprout")["earned_at"], T0.isoformat())
        self.assertEqual(self.badge("wise-oak")["progress"], 100)

    def test_new_means_earned_within_the_last_seven_days(self):
        self.cards(1, start=NOW - timedelta(days=6, hours=23))
        self.assertTrue(self.badge("first-sprout")["new"])
        # The same badge seen a day later is no longer new, and keeps its date.
        later = check(self.user, NOW + timedelta(days=1))
        old = next(b for b in later["badges"] if b["slug"] == "first-sprout")
        self.assertTrue(old["earned"])
        self.assertFalse(old["new"])
        self.assertEqual(later["new_count"], 0)

    def test_history_of_other_learners_never_counts(self):
        self.cards(5, user=self.other)
        self.assertEqual(check(self.user, NOW)["earned_count"], 0)

    def test_count_badges_survive_archiving_content(self):
        made = self.cards(1)
        self.assertTrue(self.badge("first-sprout")["earned"])
        made[0].entity.archived = True
        made[0].entity.save()
        self.assertTrue(self.badge("first-sprout")["earned"])

    def test_active_weeks_use_monday_to_sunday_weeks_and_first_activity_date(self):
        card = self.cards(1, start=T0)[0]
        q = self.question()
        # Sunday 23:59 and Monday 00:01 are different weeks; two events in one week count once.
        self.attempt(q, T0 + timedelta(days=6, hours=14, minutes=59), correct=False)
        self.attempt(q, T0 + timedelta(days=7, hours=-9, minutes=1))
        weeks = times(History(self.user).weeks())
        self.assertEqual(weeks, [T0, T0 + timedelta(days=7, hours=-9, minutes=1)])

    def test_recovery_needs_a_later_correct_answer_and_counts_each_question_once(self):
        q1, q2, q3 = self.question(1), self.question(2), self.question(3)
        self.attempt(q1, T0, False)
        self.attempt(q1, T0 + timedelta(hours=1), True)
        self.attempt(q1, T0 + timedelta(hours=2), False)
        self.attempt(q1, T0 + timedelta(hours=3), True)
        self.attempt(q2, T0, True)   # right first: not a recovery
        self.attempt(q3, T0, False)  # never fixed
        self.assertEqual(times(History(self.user).recovered()), [T0 + timedelta(hours=1)])

    def test_typed_and_choice_counts_are_separate(self):
        typed, choice = self.question(1, typed=True), self.question(2)
        self.attempt(typed, T0)
        self.attempt(typed, T0 + timedelta(minutes=1))  # repeat adds nothing
        self.attempt(choice, T0 + timedelta(minutes=2))
        history = History(self.user)
        self.assertEqual(len(times(history.correct())), 2)
        self.assertEqual(times(history.correct(typed=True)), [T0])
        self.assertEqual(times(history.correct(typed=False)), [T0 + timedelta(minutes=2)])

    def test_memory_gap_rules_need_a_review_after_the_gap(self):
        q = self.question()
        self.attempt(q, T0)
        self.attempt(q, T0 + WEEK - timedelta(minutes=1), kind="review")  # just short of 7 days
        self.assertEqual(times(History(self.user).gap(WEEK)), [])
        self.attempt(q, T0 + WEEK, kind="review")
        history = History(self.user)
        self.assertEqual(times(history.gap(WEEK)), [T0 + WEEK])
        self.assertEqual(times(history.gap(MONTH)), [])
        self.assertEqual(times(history.review()), [T0 + WEEK - timedelta(minutes=1)])
        self.attempt(q, T0 + MONTH + timedelta(days=1), kind="review")
        self.assertEqual(times(History(self.user).gap(MONTH)), [T0 + MONTH + timedelta(days=1)])

    def test_triple_bloom_dates_the_third_spaced_correct_answer(self):
        q = self.question()
        for days in (0, 3, 8, 12, 15):
            self.attempt(q, T0 + timedelta(days=days))
        self.assertEqual(times(History(self.user).spaced()), [T0 + timedelta(days=15)])

    def test_clean_patch_is_dated_by_the_last_missing_piece(self):
        card = self.cards(2)
        q = self.question()
        self.attempt(q, T0 + timedelta(hours=5), False)
        self.assertFalse(self.badge("clean-patch")["earned"])
        self.attempt(q, T0 + timedelta(hours=6), True, kind="retry")
        self.assertEqual(self.badge("clean-patch")["earned_at"], (T0 + timedelta(hours=6)).isoformat())
        self.assertEqual(self.badge("first-sprout")["earned_at"], T0.isoformat())

    def test_lesson_without_questions_is_read_not_cleaned(self):
        self.cards(2)
        self.assertFalse(self.badge("clean-patch")["earned"])
        history = History(self.user)
        self.assertEqual(times(history.lessons_read()), [T0 + timedelta(minutes=1)])
        self.assertEqual(times(history.paths_read()), [T0 + timedelta(minutes=1)])
        # Completing a path means answering questions, so a path without any never counts.
        self.assertEqual(times(history.paths_done()), [])

    def test_new_cards_in_a_finished_path_reopen_the_completion_badges(self):
        self.cards(1)
        self.assertEqual(len(times(History(self.user).paths_read())), 1)
        self.row(Card, lesson=self.lesson, position=2, body_markdown="new")
        self.assertEqual(times(History(self.user).paths_read()), [])
        self.assertTrue(self.badge("first-sprout")["earned"])

    def test_straight_arrow_needs_eight_questions_all_right_first_time(self):
        self.cards(1)
        qs = [self.question(i + 1) for i in range(8)]
        for i, q in enumerate(qs):
            self.attempt(q, T0 + timedelta(hours=i + 1))
        self.assertEqual(times(History(self.user).first_try()), [T0 + timedelta(hours=8)])
        self.attempt(qs[0], T0 + timedelta(days=1), False)  # a later miss does not matter
        self.assertEqual(len(times(History(self.user).first_try())), 1)
        slip = self.question(9)
        self.attempt(slip, T0 + timedelta(days=2), False)
        self.attempt(slip, T0 + timedelta(days=2, hours=1))
        self.assertEqual(times(History(self.user).first_try()), [])

    def test_exploring_dates_the_nth_area_reaching_its_card_count(self):
        paths = [self.row(LearningPath, theme=self.theme, position=i + 2) for i in range(3)]
        for i, path in enumerate([self.path] + paths):
            lesson = self.row(Lesson, learning_path=path, position=5 + i)
            self.cards(10, lesson=lesson, start=T0 + timedelta(days=i))
        history = History(self.user)
        self.assertEqual(times(history.area(level="path", cards=10))[2], T0 + timedelta(days=2, minutes=9))
        self.assertEqual(self.badge("branch-hopper")["earned_at"], (T0 + timedelta(days=2, minutes=9)).isoformat())
        self.assertFalse(self.badge("trail-mix")["earned"])

    def test_earned_badges_name_the_content_that_qualified_them(self):
        self.cards(100)
        q = self.question()
        self.attempt(q, T0 + timedelta(hours=5))
        beetle = self.badge("book-beetle")
        self.assertEqual((beetle["evidence"], beetle["evidence_is_last"]), (["Card"], True))
        patch = self.badge("clean-patch")
        self.assertEqual((patch["evidence"], patch["evidence_is_last"]), (["Lesson"], False))
        self.assertEqual(self.badge("garden-keeper")["evidence"], ["LearningPath"])
        self.assertEqual(self.badge("wise-oak")["evidence"], [])  # not earned: nothing to show

    def test_awards_are_saved_once_and_never_change(self):
        self.cards(1)
        q = self.question()
        self.attempt(q, T0 + timedelta(hours=1))
        first = self.badge("clean-patch")
        self.assertEqual(BadgeAward.objects.filter(user=self.user, badge="clean-patch").count(), 1)
        award = BadgeAward.objects.get(user=self.user, badge="clean-patch")
        # Checking again later, even after the content grew, keeps the award as first recorded.
        self.row(Card, lesson=self.lesson, position=2, body_markdown="added later")
        self.row(Question, lesson=self.lesson, position=2, after_card_position=1, prompt="?", explanation="e",
                 options=[{"id": str(i), "text": str(i)} for i in range(4)], answer="0")
        again = self.badge("clean-patch")
        self.assertEqual((again["earned"], again["earned_at"], again["evidence"]),
                         (True, first["earned_at"], first["evidence"]))
        self.assertEqual(BadgeAward.objects.filter(user=self.user, badge="clean-patch").count(), 1)
        self.assertEqual(BadgeAward.objects.get(pk=award.pk).earned_at, award.earned_at)
        # Another learner with the same history on the grown content has not earned it.
        self.assertFalse(self.badge("clean-patch", user=self.other)["earned"])

    def test_awards_survive_archiving_the_content(self):
        self.cards(1)
        q = self.question()
        self.attempt(q, T0)
        self.assertTrue(self.badge("clean-patch")["earned"])
        self.lesson.entity.archived = True
        self.lesson.entity.save()
        self.assertTrue(self.badge("clean-patch")["earned"])

    def test_a_badge_is_awarded_at_the_first_check_with_its_real_date(self):
        self.cards(100)
        self.assertEqual(BadgeAward.objects.count(), 0)  # nothing is written by learning itself
        result = check(self.user, NOW)
        self.assertEqual(BadgeAward.objects.filter(user=self.user).count(), 3)  # first-sprout, book-beetle, full-flower
        beetle = next(b for b in result["badges"] if b["slug"] == "book-beetle")
        self.assertEqual(beetle["earned_at"], (T0 + timedelta(minutes=99)).isoformat())

    def test_endpoint_requires_authentication_and_checks_on_post(self):
        self.assertEqual(self.client.post("/api/learning/badges/check/").status_code, 401)
        self.cards(1, start=datetime.now(timezone.utc) - timedelta(days=1))
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.user)}"
        self.assertEqual(self.client.get("/api/learning/badges/check/").status_code, 405)
        response = self.client.post("/api/learning/badges/check/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual((data["earned_count"], data["new_count"], len(data["badges"])), (2, 2, 34))
        self.assertIn("no-store", response["Cache-Control"])
        self.assertEqual(BadgeAward.objects.filter(user=self.user).count(), 2)


class CatalogueTests(TestCase):
    def test_every_entry_is_wired_and_has_art(self):
        art = Path(__file__).resolve().parents[3] / "ui/src/apps/little-grains/badge-art"
        slugs = [badge.slug for badge in BADGES]
        self.assertEqual(len(slugs), len(set(slugs)))
        for badge in BADGES:
            self.assertIn(badge.tier, TIERS, badge.slug)
            self.assertTrue(callable(getattr(History, badge.kind, None)), f"{badge.slug}: no rule {badge.kind}")
            self.assertGreaterEqual(badge.target, 1, badge.slug)
            self.assertTrue(badge.explanation.strip() and badge.name.strip(), badge.slug)
            self.assertTrue((art / f"{badge.slug}.svg").exists(), f"{badge.slug}: missing art")
        self.assertEqual(sorted(p.stem for p in art.glob("*.svg")), sorted(slugs), "art without a catalogue entry")

    def test_the_designed_mix_of_34_badges(self):
        self.assertEqual(len(BADGES), 34)
        self.assertEqual([sum(b.tier == t for b in BADGES) for t in (1, 2, 3)], [9, 12, 13])
