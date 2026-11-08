"""Weekly Challenge: shared draw, open eligibility, carrots, ranking reveal."""
import json
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.utils import timezone

from apps.accounts.tokens import issue_token
from apps.learning.challenge import current_week_key
from apps.learning.models import (Card, ChallengeWeek, ContentEntity, LearningPath, Lesson,
                                  Question, QuestionAttempt, Theme)


@override_settings(LEARNING_CHALLENGE_PLAYERS="thomas,aurore")
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
        keys = [w["week_key"] for w in self.client.get("/api/learning/challenge/history/").json()["weeks"]]
        self.assertEqual(keys, [current_week_key(), "2026-W44"])
