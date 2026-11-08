"""Weekly Challenge: shared draw, open eligibility, carrots, ranking reveal."""
import json
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase
from django.utils import timezone

from apps.accounts.tokens import issue_token
from apps.learning.challenge import current_week_key
from apps.learning.management.commands.seed_challenge_players import GENERAL_KNOWLEDGE_PATHS
from apps.learning.models import (Card, ChallengePlayer, ChallengeWeek, ContentEntity, LearningPath, Lesson,
                                  Question, QuestionAttempt, Theme)


class ChallengeTests(TestCase):
    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            position=fields.pop("position", 1), published=True, source_path="example", last_changed_commit="a" * 40,
            **({"title": model.__name__} if model != Question else {}), **fields,
        )

    def setUp(self):
        self.thomas = get_user_model().objects.create_user(username="thomas", first_name="Thomas")
        self.aurore = get_user_model().objects.create_user(username="aurore", first_name="Aurore")
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.thomas)}"
        ChallengePlayer.objects.bulk_create([ChallengePlayer(user=self.thomas), ChallengePlayer(user=self.aurore)])
        self.theme = self.row(Theme)
        self.general = self.row(LearningPath, theme=self.theme, general_knowledge=True)
        self.diving = self.row(LearningPath, theme=self.theme, position=2, general_knowledge=False)
        self.lessons = []
        self.questions = []
        for i in range(3):
            lesson = self.row(Lesson, learning_path=self.general, position=i + 1)
            self.row(Card, lesson=lesson, body_markdown="Unread card")
            self.lessons.append(lesson)
            for j in range(5):
                self.questions.append(self.row(
                    Question, lesson=lesson, position=j + 1, after_card_position=1,
                    prompt=f"Q{i}-{j}", options=[{"id": "a", "text": "A"}, {"id": "b", "text": "B"}],
                    answer="a", explanation="Because"))
        specialist_lesson = self.row(Lesson, learning_path=self.diving, position=4)
        self.row(Card, lesson=specialist_lesson, body_markdown="Dive")
        self.specialist = self.row(Question, lesson=specialist_lesson, after_card_position=1,
                                   prompt="Dive", options=[{"id": "a", "text": "A"}], answer="a", explanation="x")

    def post(self, url, body):
        return self.client.post(url, json.dumps(body), content_type="application/json")

    def as_user(self, user):
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(user)}"

    def answer(self, question_id, answer="a"):
        return self.post("/api/learning/challenge/answers/", {"question_id": question_id, "answer": answer})

    def finish_week(self, user):
        self.as_user(user)
        week = ChallengeWeek.objects.get(week_key=current_week_key())
        for qid in week.question_ids:
            self.assertEqual(self.answer(qid).status_code, 201)
        self.as_user(self.thomas)

    def test_same_draw_for_everyone_from_general_knowledge_only(self):
        first = self.client.get("/api/learning/challenge/").json()
        self.assertEqual(first["week_key"], current_week_key())
        self.assertEqual(first["seconds_per_question"], 30)
        self.assertEqual(len(first["questions"]), 10)
        # Every drawn question comes from the general-knowledge path, even
        # though nothing was ever read; the diving path never contributes.
        general_ids = {str(q.pk) for q in self.questions}
        self.assertTrue({q["id"] for q in first["questions"]} <= general_ids)
        self.assertNotIn(str(self.specialist.pk), [q["id"] for q in first["questions"]])
        # The week is frozen: the other learner gets the identical set.
        self.as_user(self.aurore)
        second = self.client.get("/api/learning/challenge/").json()
        self.assertEqual([q["id"] for q in second["questions"]], [q["id"] for q in first["questions"]])
        self.assertEqual(ChallengeWeek.objects.count(), 1)

    def test_answers_need_no_reading_and_first_correct_earns_the_usual_carrot(self):
        week = self.client.get("/api/learning/challenge/").json()
        question_id = week["questions"][0]["id"]
        # A question outside the week's set is refused, even from the path.
        outside = str(self.questions[-1].pk)
        if outside in [q["id"] for q in week["questions"]]:
            outside = str(self.specialist.pk)
        self.assertEqual(self.answer(outside).status_code, 409)
        # Unread lesson, unstarted path: the answer still records.
        response = self.answer(question_id)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json()["correct"])
        self.assertTrue(response.json()["carrot_earned"])
        self.assertEqual(self.client.get("/api/learning/garden/").json()["rewards"]["carrots"], 1)
        # No double answering, and a later first-correct elsewhere is deduped.
        self.assertEqual(self.answer(question_id).status_code, 409)

    def test_carrot_dedupes_across_modes(self):
        question = self.questions[0]
        week = ChallengeWeek.objects.create(week_key=current_week_key(),
                                            question_ids=[str(question.pk)], created_at=timezone.now())
        # Already answered correctly in a lesson: the challenge earns no carrot.
        self.post(f"/api/learning/cards/{self.lessons[0].cards.get().pk}/complete/", {})
        self.post("/api/learning/question-attempts/", {"question_id": str(question.pk), "answer": "a"})
        response = self.answer(str(question.pk))
        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.json()["carrot_earned"])
        self.assertEqual(self.client.get("/api/learning/garden/").json()["rewards"]["carrots"], 1)

    def test_ranking_hidden_until_every_participant_finished(self):
        self.client.get("/api/learning/challenge/")
        week = ChallengeWeek.objects.get(week_key=current_week_key())
        # Thomas plays everything: his own score shows, the ranking does not.
        for qid in week.question_ids:
            self.answer(qid)
        mine = self.client.get("/api/learning/challenge/").json()
        self.assertTrue(mine["me"]["finished"])
        self.assertIsNone(mine["ranking"])
        # Aurore starts: still hidden for both until she finishes.
        self.as_user(self.aurore)
        self.answer(week.question_ids[0], "b")
        self.assertIsNone(self.client.get("/api/learning/challenge/").json()["ranking"])
        for qid in week.question_ids[1:]:
            self.answer(qid, "b")
        revealed = self.client.get("/api/learning/challenge/").json()["ranking"]
        self.assertEqual([(r["name"], r["correct"], r["rank"]) for r in revealed],
                         [("Thomas", 10, 1), ("Aurore", 0, 2)])
        self.assertTrue(revealed[0]["is_self"] is False and revealed[1]["is_self"])

    def test_challenge_wins_badge_rule_counts_strict_wins_only(self):
        from apps.learning.badges import History

        def played_week(key, thomas_correct, aurore_correct, aurore_finished=True):
            week = ChallengeWeek.objects.create(week_key=key, question_ids=[str(q.pk) for q in self.questions[:10]],
                                                created_at=timezone.now())
            for i, q in enumerate(self.questions[:10]):
                if not aurore_finished and i >= 5:
                    break
                QuestionAttempt.objects.create(user=self.thomas, question=q, challenge_week=week,
                                               attempt_type="challenge", submitted_answer="a",
                                               correct=i < thomas_correct, answered_at=timezone.now())
                QuestionAttempt.objects.create(user=self.aurore, question=q, challenge_week=week,
                                               attempt_type="challenge", submitted_answer="a",
                                               correct=i < aurore_correct, answered_at=timezone.now())

        played_week("2026-W40", 8, 5)   # a win
        played_week("2026-W41", 4, 4)   # a tie is not a win
        played_week("2026-W42", 2, 0)   # below the 3/10 minimum
        played_week("2026-W43", 9, 1, aurore_finished=False)  # unrevealed
        events = History(self.thomas).challenge_wins()
        self.assertEqual([ref for _, (_, ref) in events], ["2026-W40"])
        self.assertEqual(History(self.aurore).challenge_wins(), [])

    def test_only_the_configured_duo_can_play_or_be_seen(self):
        outsider = get_user_model().objects.create_user(username="intruder")
        self.as_user(outsider)
        # An outsider cannot see the week, its history, or answer into it.
        self.assertEqual(self.client.get("/api/learning/challenge/").status_code, 404)
        self.assertEqual(self.client.get("/api/learning/challenge/history/").status_code, 404)
        self.assertEqual(self.answer(str(self.questions[0].pk)).status_code, 404)
        # Even an attempt smuggled into the table never affects the duel:
        # it does not reveal the ranking nor appear in it.
        self.as_user(self.thomas)
        self.client.get("/api/learning/challenge/")
        week = ChallengeWeek.objects.get()
        for qid in week.question_ids:
            self.answer(qid)
        QuestionAttempt.objects.create(user=outsider, question_id=week.question_ids[0], challenge_week=week,
                                       attempt_type="challenge", submitted_answer="a", correct=True,
                                       answered_at=timezone.now())
        mine = self.client.get("/api/learning/challenge/").json()
        self.assertIsNone(mine["ranking"])  # Aurore has not finished: hidden
        self.finish_week(self.aurore)
        revealed = self.client.get("/api/learning/challenge/").json()["ranking"]
        self.assertEqual({r["name"] for r in revealed}, {"Thomas", "Aurore"})

    def test_history_lists_finished_weeks_and_my_current_week_once_done(self):
        past = ChallengeWeek.objects.create(week_key="2026-W44", question_ids=[str(self.questions[0].pk)],
                                            created_at=timezone.now())
        QuestionAttempt.objects.create(user=self.thomas, question=self.questions[0], challenge_week=past,
                                       attempt_type="challenge", submitted_answer="a", correct=True,
                                       answered_at=timezone.now())
        # Current week not finished: history shows only the past one.
        self.client.get("/api/learning/challenge/")
        history = self.client.get("/api/learning/challenge/history/").json()["weeks"]
        self.assertEqual([w["week_key"] for w in history], ["2026-W44"])
        # Weeks I never played stay out; finishing the current week adds it.
        self.finish_week(self.thomas)
        weeks = self.client.get("/api/learning/challenge/history/").json()["weeks"]
        self.assertEqual([w["week_key"] for w in weeks], [current_week_key(), "2026-W44"])
        # Reveal gate holds in history too: with Aurore still playing, the
        # finished current week carries no ranking, no other score, no result.
        current = weeks[0]
        self.assertIsNone(current["ranking"])
        self.assertNotIn("won", json.dumps(current))
        self.assertNotIn("aurore", json.dumps(current).lower())
        # Once she finishes, history reveals the same ranking as the week.
        self.finish_week(self.aurore)
        revealed = self.client.get("/api/learning/challenge/history/").json()["weeks"][0]["ranking"]
        self.assertEqual({r["name"] for r in revealed}, {"Thomas", "Aurore"})


class ChallengeConfigTest(TestCase):
    """Production defaults the accelerated browser fixtures override."""

    def test_timer_defaults_to_thirty_seconds(self):
        from apps.learning.challenge import CHALLENGE_SECONDS, CHALLENGE_SIZE
        self.assertEqual(CHALLENGE_SECONDS, 30)
        self.assertEqual(CHALLENGE_SIZE, 10)


class ChallengePlayersConfigTest(TestCase):
    """The duel is live only while exactly two distinct active players are seated."""

    def setUp(self):
        User = get_user_model()
        self.thomas = User.objects.create_user(username="thomas", email="thomas@example.com", password="x")
        self.aurore = User.objects.create_user(username="aurore", email="aurore@example.com", password="x")

    def seat(self, *users):
        ChallengePlayer.objects.all().delete()
        ChallengePlayer.objects.bulk_create([ChallengePlayer(user=u) for u in users])

    def status(self, user=None):
        user = user or self.thomas
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(user)}"
        return self.client.get("/api/learning/challenge/").status_code

    def test_two_seated_players_unlock_the_duel(self):
        self.seat(self.thomas, self.aurore)
        self.assertEqual(self.status(), 200)
        self.assertEqual(self.status(self.aurore), 200)

    def test_an_empty_table_disables_the_duel(self):
        self.assertEqual(self.status(), 404)

    def test_a_single_seat_disables_the_duel(self):
        self.seat(self.thomas)
        self.assertEqual(self.status(), 404)

    def test_a_third_seat_disables_the_duel(self):
        third = get_user_model().objects.create_user(username="third", password="x")
        self.seat(self.thomas, self.aurore, third)
        self.assertEqual(self.status(), 404)

    def test_a_deactivated_player_disables_the_duel(self):
        self.seat(self.thomas, self.aurore)
        self.aurore.is_active = False
        self.aurore.save(update_fields=["is_active"])
        self.assertEqual(self.status(), 404)

    def test_an_outsider_gets_404_even_with_two_seated(self):
        self.seat(self.thomas, self.aurore)
        outsider = get_user_model().objects.create_user(username="outsider", password="x")
        self.assertEqual(self.status(outsider), 404)


class SeedChallengePlayersTest(TestCase):
    """The seed command seats the duo and flags exactly the 3 named paths."""

    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            position=fields.pop("position", 1), published=True, source_path=fields.pop("source_path", "example"), last_changed_commit="a" * 40,
            **({"title": model.__name__} if model != Question else {}), **fields,
        )

    def setUp(self):
        User = get_user_model()
        self.thomas = User.objects.create_user(username="thomas", email="thomas@example.com", password="x")
        self.aurore = User.objects.create_user(username="aurore", email="aurore@example.com", password="x")
        self.theme = self.row(Theme)
        self.paths = {}
        for i, slug in enumerate(GENERAL_KNOWLEDGE_PATHS):
            self.paths[slug] = self.row(LearningPath, theme=self.theme, position=i + 1, source_path=f"themes/{slug}/index.md", general_knowledge=False)
        self.diving = self.row(LearningPath, theme=self.theme, position=4, source_path="themes/plongee-niveau-4-partie-1/index.md", general_knowledge=False)

    def test_seed_seats_the_duo_and_flags_only_the_three_paths(self):
        call_command("seed_challenge_players", "thomas", "aurore@example.com")
        self.assertEqual({seat.user for seat in ChallengePlayer.objects.all()}, {self.thomas, self.aurore})
        for slug, path in self.paths.items():
            path.refresh_from_db()
            self.assertTrue(path.general_knowledge, slug)
        self.diving.refresh_from_db()
        self.assertFalse(self.diving.general_knowledge)
        # Idempotent: a second run changes nothing.
        call_command("seed_challenge_players", "thomas", "aurore")
        self.assertEqual(ChallengePlayer.objects.count(), 2)

    def test_seed_replaces_a_previous_seating(self):
        third = get_user_model().objects.create_user(username="third", password="x")
        ChallengePlayer.objects.create(user=third)
        call_command("seed_challenge_players", "thomas", "aurore")
        self.assertEqual({seat.user for seat in ChallengePlayer.objects.all()}, {self.thomas, self.aurore})

    def test_an_unknown_handle_writes_nothing(self):
        with self.assertRaises(CommandError):
            call_command("seed_challenge_players", "thomas", "nobody")
        self.assertEqual(ChallengePlayer.objects.count(), 0)

    def test_the_same_account_twice_writes_nothing(self):
        with self.assertRaises(CommandError):
            call_command("seed_challenge_players", "thomas", "thomas@example.com")
        self.assertEqual(ChallengePlayer.objects.count(), 0)
