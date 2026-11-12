import json
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from unittest import mock

from django.contrib.auth import get_user_model
from django.db import DatabaseError, connection
from django.test import TestCase
from django.test.utils import CaptureQueriesContext

from apps.accounts.tokens import issue_token
from .api import LearnerState
from .models import Card, CardProgress, ContentEntity, LearningPath, Lesson, LessonOpen, Question, QuestionAttempt, PathCelebration, Theme
from .rewards import chart, period_window, totals


class LearningHealthTests(TestCase):
    """The cold-start loader depends on this probe: it must answer without
    authentication and fail loudly when the database cannot be reached."""

    def test_health_reports_database_roundtrip_without_authentication(self):
        response = self.client.get("/api/learning/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "database": "ok"})
        self.assertIn("no-store", response["Cache-Control"])

    def test_health_returns_503_when_the_database_is_unreachable(self):
        with mock.patch("apps.learning.views.connection") as connection:
            connection.cursor.side_effect = DatabaseError("connection refused")
            response = self.client.get("/api/learning/health/")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json(), {"status": "error", "database": "unreachable"})


class LearningAPITests(TestCase):
    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            position=fields.pop("position", 1), published=True, source_path="example", last_changed_commit="a" * 40,
            **({"title": model.__name__} if model != Question else {}), **fields,
        )

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="learner")
        self.other = get_user_model().objects.create_user(username="other")
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.user)}"
        self.theme = self.row(Theme)
        self.path = self.row(LearningPath, theme=self.theme)
        self.lesson = self.row(Lesson, learning_path=self.path, introduction_markdown="Read this.")
        self.card = self.row(Card, lesson=self.lesson, body_markdown="Hello")
        self.question = self.row(Question, lesson=self.lesson, after_card_position=1,
                                 prompt="Choose", options=[{"id": str(i), "text": str(i)} for i in range(4)],
                                 answer="0", explanation="The explanation")

    def post(self, url, body):
        return self.client.post(url, json.dumps(body), content_type="application/json")

    def test_retired_navigation_endpoints_stay_retired(self):
        # #470: themes/, theme detail, path detail and progress/ had no caller
        # left and were retired. Garden and the lesson reader carry the same
        # data; re-adding one of these routes must fail this test.
        retired = ("/api/learning/themes/", f"/api/learning/themes/{self.theme.pk}/",
                   f"/api/learning/paths/{self.path.pk}/", "/api/learning/progress/")
        for url in retired:
            self.assertEqual(self.client.get(url).status_code, 404, url)
        self.client.defaults.clear()
        for url in retired:
            self.assertEqual(self.client.get(url).status_code, 404, url)

    def test_path_celebration_is_marked_once_per_learner(self):
        url = f"/api/learning/paths/{self.path.pk}/celebrated/"
        garden_url = "/api/learning/garden/"
        self.assertEqual(self.client.get(garden_url).json()["themes"][0]["learning_paths"][0]["celebrated"], False)

        first = self.post(url, {})
        self.assertEqual(first.status_code, 201)
        self.assertEqual(first.json()["celebrated"], True)
        self.assertEqual(self.client.get(garden_url).json()["themes"][0]["learning_paths"][0]["celebrated"], True)

        # A repeat is a quiet 200, never a second row.
        self.assertEqual(self.post(url, {}).status_code, 200)
        self.assertEqual(PathCelebration.objects.count(), 1)

        # Another learner is untouched, and extra fields are rejected.
        self.assertEqual(self.post(url, {"shown_at": "2000-01-01T00:00:00Z"}).status_code, 400)
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.other)}"
        self.assertEqual(self.client.get(garden_url).json()["themes"][0]["learning_paths"][0]["celebrated"], False)

        # Unknown path: 404. No token: 401.
        self.assertEqual(self.post(f"/api/learning/paths/{uuid4()}/celebrated/", {}).status_code, 404)
        self.client.defaults.clear()
        self.assertEqual(self.client.post(url, "{}", content_type="application/json").status_code, 401)

    def test_hidden_content_is_not_counted(self):
        for model, record in [(Theme, self.theme), (LearningPath, self.path), (Lesson, self.lesson),
                              (Card, self.card), (Question, self.question)]:
            model.objects.filter(pk=record.pk).update(published=False)
            data = self.client.get("/api/learning/garden/").json()["themes"]
            if model == Theme:
                self.assertEqual(data, [])
            elif model == Question:
                self.assertEqual(data[0]["progress"]["checkpoints_total"], 0)
            else:
                self.assertEqual(data[0]["progress"]["cards_total"], 0)
            model.objects.filter(pk=record.pk).update(published=True)
        self.theme.entity.archived = True
        self.theme.entity.save()
        self.assertEqual(self.client.get("/api/learning/garden/").json()["themes"], [])

    def test_lesson_content_pool_selection_and_answer_safety(self):
        self.question.options[0]["correct"] = True
        self.question.save()
        url = f"/api/learning/lessons/{self.lesson.pk}/"
        result = self.client.get(url).json()
        self.assertEqual(result["cards"][0]["body_markdown"], "Hello")
        self.assertEqual(len(result["questions"]), 1)
        self.assertNotIn("answer", result["questions"][0])
        self.assertNotIn("explanation", result["questions"][0])
        self.assertNotIn("correct", result["questions"][0]["options"][0])
        self.assertEqual(result["next_step"], {"type": "card", "id": str(self.card.pk)})
        self.assertEqual(result, self.client.get(url).json())
        self.theme.entity.archived = True
        self.theme.entity.save()
        self.assertEqual(self.client.get(url).status_code, 404)

    def test_complete_card_idempotent_and_user_owned(self):
        url = f"/api/learning/cards/{self.card.pk}/complete/"
        response = self.post(url, {})
        self.assertEqual(response.status_code, 201)
        first = response.json()["completed_at"]
        repeat = self.post(url, {})
        self.assertEqual(repeat.status_code, 200)
        self.assertEqual(repeat.json()["completed_at"], first)
        self.assertEqual(CardProgress.objects.count(), 1)
        self.assertEqual(CardProgress.objects.get().user, self.user)
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.other)}"
        self.assertIsNone(self.client.get(f"/api/learning/lessons/{self.lesson.pk}/").json()["cards"][0]["completed_at"])
        self.assertEqual(self.post(url, {}).status_code, 201)

    def test_complete_card_repeat_uses_bounded_lesson_state(self):
        other_lesson = self.row(Lesson, learning_path=self.path, position=2)
        other_card = self.row(Card, lesson=other_lesson, body_markdown="Unrelated")
        other_question = self.row(Question, lesson=other_lesson, after_card_position=1,
                                  prompt="Unrelated", options=[{"id": str(i), "text": str(i)} for i in range(4)],
                                  answer="0", explanation="Unrelated")
        CardProgress.objects.create(user=self.user, card=other_card,
                                    completed_at=datetime.now(timezone.utc))
        QuestionAttempt.objects.create(user=self.user, question=other_question, attempt_type="initial",
                                       submitted_answer="1", correct=False,
                                       answered_at=datetime.now(timezone.utc))

        url = f"/api/learning/cards/{self.card.pk}/complete/"
        with self.assertNumQueries(10):
            first = self.post(url, {})
        self.assertEqual(first.status_code, 201)
        state = LearnerState(self.user, lesson=self.lesson)
        self.assertEqual([card.pk for card in state.cards], [self.card.pk])
        self.assertEqual([question.pk for question in state.questions], [self.question.pk])
        self.assertEqual(set(state.completed), {self.card.pk})
        self.assertFalse(state.attempted)

        with self.assertNumQueries(9):
            repeat = self.post(url, {})
        self.assertEqual(repeat.status_code, 200)

    def test_card_write_validation_and_visibility(self):
        url = f"/api/learning/cards/{self.card.pk}/complete/"
        self.assertEqual(self.post(url, {"user_id": self.other.pk}).status_code, 400)
        self.assertEqual(self.post(url, {"completed_at": "2000-01-01"}).status_code, 400)
        self.assertEqual(self.client.post(url, "bad", content_type="application/json").status_code, 400)
        self.assertEqual(self.client.post(url, "{}", content_type="text/plain").status_code, 415)
        self.assertEqual(self.client.post(url, "{}", content_type="application/json",
                                         HTTP_ORIGIN="https://elsewhere.invalid").status_code, 403)
        self.assertEqual(self.client.get(url).status_code, 405)
        self.theme.entity.archived = True
        self.theme.entity.save()
        self.assertEqual(self.post(url, {}).status_code, 404)
        self.assertEqual(CardProgress.objects.count(), 0)

    def test_answers_grade_server_side_retry_then_complete(self):
        url = "/api/learning/question-attempts/"
        body = {"question_id": str(self.question.pk), "answer": "0"}
        self.assertEqual(self.post(url, body).status_code, 409)
        self.assertEqual(QuestionAttempt.objects.count(), 0)
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        wrong = self.post(url, {**body, "answer": "1"})
        self.assertEqual(wrong.status_code, 201)
        self.assertFalse(wrong.json()["correct"])
        self.assertEqual(wrong.json()["attempt_type"], "initial")
        self.assertEqual(wrong.json()["explanation"], self.question.explanation)
        correct = self.post(url, body)
        self.assertEqual(correct.status_code, 201)
        self.assertTrue(correct.json()["correct"])
        self.assertEqual(correct.json()["attempt_type"], "retry")
        self.assertTrue(correct.json()["progress"]["completed"])
        self.assertIsNone(correct.json()["next_step"])
        review = self.post(url, body)
        self.assertEqual(review.status_code, 201)
        self.assertEqual(review.json()["attempt_type"], "review")
        self.assertTrue(review.json()["progress"]["completed"])
        self.assertIsNone(review.json()["next_step"])
        self.assertEqual(QuestionAttempt.objects.count(), 3)
        self.assertEqual(QuestionAttempt.objects.filter(user=self.other).count(), 0)
        lesson = self.client.get(f"/api/learning/lessons/{self.lesson.pk}/").json()
        self.assertTrue(lesson["questions"][0]["completed"])
        self.assertNotIn("explanation", lesson["questions"][0])

    def test_review_attempts_rotate_questions_and_first_corrects_count_once(self):
        alternative = self.row(Question, lesson=self.lesson, position=2, after_card_position=1,
                               prompt="Alternative", options=self.question.options, answer="1")
        lesson_url = f"/api/learning/lessons/{self.lesson.pk}/"
        attempt_url = "/api/learning/question-attempts/"
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        first_id = self.client.get(lesson_url).json()["questions"][0]["id"]
        first = Question.objects.get(pk=first_id)
        self.assertEqual(self.post(attempt_url, {"question_id": first_id, "answer": first.answer}).json()["attempt_type"], "initial")
        # Every card is read: the lesson is complete under the all-cards-read
        # rule (#465), even with one of two questions answered correctly;
        # question mastery stays a separate gauge.
        before = self.client.get(lesson_url).json()
        self.assertTrue(before["lesson"]["progress"]["completed"])
        self.assertEqual(before["lesson"]["progress"]["questions_correct"], 1)
        self.assertEqual(before["lesson"]["progress"]["questions_total"], 2)
        card_completed_at = before["cards"][0]["completed_at"]
        wrong_choice = next(option["id"] for option in first.options if option["id"] != first.answer)
        wrong = self.post(attempt_url, {"question_id": first_id, "answer": wrong_choice})
        self.assertEqual(wrong.status_code, 201)
        self.assertEqual(wrong.json()["attempt_type"], "review")
        self.assertFalse(wrong.json()["correct"])
        self.assertNotEqual(wrong.json()["next_step"]["id"], first_id)
        # The lesson is fully read: every question stays answerable, and an
        # already-correct one is an ordinary review.
        repeat = self.post(attempt_url, {"question_id": first_id, "answer": first.answer}).json()
        self.assertEqual(repeat["attempt_type"], "review")
        self.assertFalse(repeat["carrot_earned"])
        next_id = wrong.json()["next_step"]["id"]
        self.assertEqual(next_id, str(alternative.pk) if first_id == str(self.question.pk) else str(self.question.pk))
        correct = self.post(attempt_url, {"question_id": next_id,
                                          "answer": Question.objects.get(pk=next_id).answer})
        # The alternative was never answered correctly: its first correct is a
        # first-run retry, even reached through the review rotation.
        self.assertEqual(correct.json()["attempt_type"], "retry")
        self.assertTrue(correct.json()["correct"])
        self.assertTrue(correct.json()["carrot_earned"])
        self.assertIsNone(correct.json()["next_step"])
        # A first correct answer in review closes the mastery gap: the lesson
        # was already complete from reading and earned its drops once, and
        # each of its two questions earned one carrot for its first correct.
        after = self.client.get(lesson_url).json()
        self.assertTrue(after["lesson"]["progress"]["completed"])
        self.assertEqual(after["lesson"]["progress"]["questions_correct"], 2)
        self.assertEqual(after["cards"][0]["completed_at"], card_completed_at)
        completed_rewards = self.client.get("/api/learning/garden/").json()["rewards"]
        self.assertEqual(completed_rewards, {"drops": 106, "carrots": 2})
        # Once every question has a correct answer, review rounds change
        # neither progress nor rewards.
        next_question = Question.objects.get(pk=next_id)
        wrong_again = self.post(attempt_url, {"question_id": next_id, "answer": next(
            option["id"] for option in next_question.options if option["id"] != next_question.answer)})
        self.assertEqual(wrong_again.json()["attempt_type"], "review")
        self.assertFalse(wrong_again.json()["correct"])
        followup_id = wrong_again.json()["next_step"]["id"]
        self.assertEqual(followup_id, first_id)
        followup = self.post(attempt_url, {"question_id": followup_id, "answer": first.answer})
        self.assertEqual(followup.json()["attempt_type"], "review")
        self.assertTrue(followup.json()["correct"])
        self.assertIsNone(followup.json()["next_step"])
        final = self.client.get(lesson_url).json()
        self.assertEqual(final["lesson"]["progress"], after["lesson"]["progress"])
        self.assertEqual(self.client.get("/api/learning/garden/").json()["rewards"], completed_rewards)
        self.assertEqual(list(QuestionAttempt.objects.values_list("attempt_type", flat=True)),
                         ["initial", "review", "review", "retry", "review", "review"])

    def test_completed_lesson_uses_typed_translation_on_review(self):
        translations = [
            self.row(Question, lesson=self.lesson, position=position, after_card_position=1,
                     type=Question.Type.TYPE_ANSWER_QUESTION, prompt=prompt, options=[],
                     answer=answers[0], accepted_answers=answers, explanation="Compare the full sentence.")
            for position, prompt, answers in [
                (2, "Je suis juste ici.", ["I'm right here.", "I am right here."]),
                (3, "Regarde-moi.", ["Look at me.", "Please look at me."]),
            ]
        ]
        lesson_url = f"/api/learning/lessons/{self.lesson.pk}/"
        attempt_url = "/api/learning/question-attempts/"
        self.assertEqual(self.client.get(lesson_url).json()["questions"][0]["type"], "multiple_choice")
        # While the lesson is unread the typed alternatives are not answerable.
        self.assertEqual(self.post(attempt_url, {"question_id": str(translations[0].pk),
                                                 "answer": translations[0].answer}).status_code, 409)
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        self.assertEqual(self.post(attempt_url, {"question_id": str(self.question.pk), "answer": "0"}).status_code, 201)
        # Every card is read: the lesson is complete under the all-cards-read
        # rule (#465), so review already prefers a typed alternative. One of
        # three questions answered correctly: the mastery gap remains, and
        # the catch-up quiz is how the typed alternatives get their first answer.
        before = self.client.get(lesson_url).json()
        self.assertTrue(before["lesson"]["progress"]["completed"])
        self.assertEqual(before["lesson"]["progress"]["questions_correct"], 1)
        self.assertEqual(before["questions"][0]["type"], "type_answer_question")
        pool = self.client.get(f"/api/learning/paths/{self.path.pk}/catch-up/").json()
        self.assertEqual({q["id"] for q in pool["questions"]}, {str(q.pk) for q in translations} | {str(self.question.pk)})
        for typed in translations:
            quiz = self.post(attempt_url, {"question_id": str(typed.pk), "answer": typed.answer})
            self.assertEqual(quiz.status_code, 201)
            # A normal retry: the checkpoint already saw a first attempt.
            self.assertEqual(quiz.json()["attempt_type"], "retry")
        before = self.client.get(lesson_url).json()
        self.assertTrue(before["lesson"]["progress"]["completed"])
        self.assertEqual(before["questions"][0]["type"], "type_answer_question")
        self.assertEqual(before["questions"][0]["options"], [])
        self.assertNotIn("answer", before["questions"][0])
        self.assertNotIn("accepted_answers", before["questions"][0])
        rewards = self.client.get("/api/learning/garden/").json()["rewards"]

        first_id = before["questions"][0]["id"]
        first = Question.objects.get(pk=first_id)
        wrong = self.post(attempt_url, {"question_id": first_id, "answer": "This is not the sentence."})
        self.assertEqual(wrong.status_code, 201)
        self.assertEqual(wrong.json()["attempt_type"], "review")
        self.assertFalse(wrong.json()["correct"])
        self.assertEqual(wrong.json()["correct_answer"], first.answer)
        next_id = wrong.json()["next_step"]["id"]
        self.assertNotEqual(first_id, next_id)
        self.assertIn(next_id, {str(question.pk) for question in translations})
        # The lesson is fully read: every question stays answerable, and an
        # already-correct one is an ordinary review.
        self.assertEqual(self.post(attempt_url, {"question_id": first_id, "answer": first.answer}).json()["attempt_type"], "review")

        next_question = Question.objects.get(pk=next_id)
        variant = next_question.accepted_answers[-1].upper().replace("'", "’") + "  !!"
        correct = self.post(attempt_url, {"question_id": next_id, "answer": variant})
        self.assertEqual(correct.status_code, 201)
        self.assertEqual(correct.json()["attempt_type"], "review")
        self.assertTrue(correct.json()["correct"])
        self.assertIsNone(correct.json()["next_step"])
        self.assertEqual(self.client.get("/api/learning/garden/").json()["rewards"], rewards)
        self.assertEqual(self.client.get(lesson_url).json()["lesson"]["progress"], before["lesson"]["progress"])

    def test_typed_question_waits_until_whole_lesson_is_complete(self):
        self.row(Card, lesson=self.lesson, position=2, body_markdown="Next card")
        self.row(Question, lesson=self.lesson, position=2, after_card_position=1,
                 type=Question.Type.TYPE_ANSWER_QUESTION, prompt="Translate this", options=[],
                 answer="Hello there", accepted_answers=["Hello there"], explanation="Greeting")
        lesson_url = f"/api/learning/lessons/{self.lesson.pk}/"
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        self.post("/api/learning/question-attempts/", {
            "question_id": str(self.question.pk), "answer": self.question.answer,
        })
        lesson = self.client.get(lesson_url).json()
        self.assertFalse(lesson["lesson"]["progress"]["completed"])
        self.assertEqual(lesson["questions"][0]["type"], "multiple_choice")

    def test_typed_only_checkpoint_can_be_completed_on_first_read(self):
        self.question.published = False
        self.question.save()
        typed = self.row(Question, lesson=self.lesson, position=2, after_card_position=1,
                         type=Question.Type.TYPE_ANSWER_QUESTION, prompt="What is a young cat called?", options=[],
                         answer="A kitten", accepted_answers=["A kitten", "Kitten"],
                         explanation="A young cat is a kitten.")
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        response = self.post("/api/learning/question-attempts/", {
            "question_id": str(typed.pk), "answer": "  KITTEN!!  "})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["attempt_type"], "initial")
        self.assertTrue(response.json()["correct"])
        self.assertTrue(response.json()["progress"]["completed"])

    def test_question_request_validation(self):
        url = "/api/learning/question-attempts/"
        for body in ([], {}, {"question_id": "bad", "answer": "0"},
                     {"question_id": str(self.question.pk), "answer": True},
                     {"question_id": str(self.question.pk), "answer": "invalid"},
                     {"question_id": str(self.question.pk), "answer": "0", "correct": True},
                     {"question_id": str(self.question.pk), "answer": "0", "attempt_type": "review"}):
            self.assertEqual(self.post(url, body).status_code, 400)
        self.assertEqual(self.post(url, {"question_id": str(uuid4()), "answer": "0"}).status_code, 404)
        self.assertEqual(QuestionAttempt.objects.count(), 0)

    def test_alternative_pool_is_one_checkpoint_and_unselected_question_is_rejected(self):
        entity = ContentEntity.objects.create(id=uuid4(), kind="question")
        alt = Question.objects.create(entity=entity, position=2, published=True, lesson=self.lesson,
                                     after_card_position=1, prompt="Alt", options=self.question.options,
                                     answer="1", explanation="Other", source_path="alt", last_changed_commit="a" * 40)
        lesson_url = f"/api/learning/lessons/{self.lesson.pk}/"
        data = self.client.get(lesson_url).json()
        selected = data["questions"][0]["id"]
        other = alt if selected == str(self.question.pk) else self.question
        self.assertEqual(len(data["questions"]), 1)
        self.assertEqual(data["lesson"]["progress"]["checkpoints_total"], 1)
        # The unselected alternative is rejected while the lesson is unread;
        # once every card is read it joins the catch-up pool.
        self.assertEqual(self.post("/api/learning/question-attempts/", {
            "question_id": str(other.pk), "answer": other.answer}).status_code, 409)
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        chosen = Question.objects.get(pk=selected)
        response = self.post("/api/learning/question-attempts/", {"question_id": selected, "answer": chosen.answer})
        progress = response.json()["progress"]
        # All cards read: complete under the reading rule (#465); the unseen
        # alternative stays a question-mastery gap, not a completion blocker.
        self.assertTrue(progress["completed"])
        self.assertEqual(progress["checkpoints_correct"], 1)
        self.assertEqual(progress["questions_correct"], 1)
        self.assertEqual(progress["questions_total"], 2)
        # The unselected alternative is exactly what the catch-up quiz serves:
        # a normal retry, the checkpoint already saw the selected attempt.
        quiz = self.post("/api/learning/question-attempts/", {"question_id": str(other.pk),
                                                              "answer": other.answer})
        self.assertEqual(quiz.status_code, 201)
        self.assertEqual(quiz.json()["attempt_type"], "retry")
        self.assertTrue(quiz.json()["progress"]["completed"])

    def test_wrong_answers_rotate_questions_and_resume_the_same_alternative(self):
        for position in (2, 3):
            self.row(Question, lesson=self.lesson, position=position, after_card_position=1,
                     prompt=f"Alternative {position}", options=self.question.options,
                     answer=str(position - 1), explanation="Try another one")
        lesson_url = f"/api/learning/lessons/{self.lesson.pk}/"
        attempt_url = "/api/learning/question-attempts/"
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})

        question_ids = []
        for _ in range(4):
            current = self.client.get(lesson_url).json()
            question_id = current["next_step"]["id"]
            self.assertEqual(current["questions"][0]["id"], question_id)
            question_ids.append(question_id)
            question = Question.objects.get(pk=question_id)
            wrong_answer = next(option["id"] for option in question.options if option["id"] != question.answer)
            wrong = self.post(attempt_url, {"question_id": question_id, "answer": wrong_answer})
            self.assertEqual(wrong.status_code, 201)
            self.assertFalse(wrong.json()["correct"])
            self.assertEqual(wrong.json()["next_step"], self.client.get(lesson_url).json()["next_step"])
            self.assertNotEqual(wrong.json()["next_step"]["id"], question_id)

        self.assertEqual(len(set(question_ids[:3])), 3)
        self.assertEqual(question_ids[3], question_ids[0])
        selected = self.client.get(lesson_url).json()["next_step"]["id"]
        # Fully read lesson: alternatives stay answerable (catch-up pool).
        resumed = Question.objects.get(pk=question_ids[3])
        wrong_resumed = next(option["id"] for option in resumed.options if option["id"] != resumed.answer)
        self.assertEqual(self.post(attempt_url, {"question_id": question_ids[3], "answer": wrong_resumed}).status_code, 201)
        current = Question.objects.get(pk=selected)
        correct = self.post(attempt_url, {"question_id": selected, "answer": current.answer})
        # One of three alternatives answered correctly: the lesson is already
        # complete from reading (#465); the catch-up quiz covers the other
        # two as question-mastery gaps.
        self.assertTrue(correct.json()["progress"]["completed"])
        self.assertIsNone(correct.json()["next_step"])
        pool = self.client.get(f"/api/learning/paths/{self.path.pk}/catch-up/").json()
        self.assertEqual(pool["remaining"], 2)
        self.assertIn(selected, [q["id"] for q in pool["questions"]])
        for item in pool["questions"]:
            question = Question.objects.get(pk=item["id"])
            quiz = self.post(attempt_url, {"question_id": item["id"], "answer": question.answer})
            self.assertEqual(quiz.status_code, 201)
        final = self.client.get(lesson_url).json()
        self.assertTrue(final["lesson"]["progress"]["completed"])
        self.assertEqual(final["lesson"]["progress"]["questions_correct"], 3)

    def test_progress_is_private_persistent_and_has_unique_counts(self):
        garden_url = "/api/learning/garden/"
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        self.post("/api/learning/question-attempts/", {"question_id": str(self.question.pk), "answer": "0"})
        response = self.client.get(garden_url)
        self.assertEqual(response.status_code, 200)
        progress = response.json()["themes"][0]["progress"]
        self.assertEqual(progress["cards_completed"], 1)
        self.assertEqual(progress["checkpoints_correct"], 1)
        self.assertEqual(progress["lessons_completed"], 1)
        self.assertTrue(response.json()["themes"][0]["learning_paths"][0]["progress"]["completed"])
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.other)}"
        other = self.client.get(garden_url).json()["themes"][0]["progress"]
        self.assertEqual(other["cards_completed"], 0)
        self.assertEqual(other["checkpoints_correct"], 0)
        self.assertFalse(other["started"])

    def test_garden_returns_three_recent_unfinished_lessons(self):
        # Two cards per lesson: reading the first keeps the lesson started but
        # unfinished, so it belongs in the shortcut list.
        first_cards = {self.lesson.pk: self.card}
        self.row(Card, lesson=self.lesson, position=2, body_markdown="Second")
        lessons = [self.lesson]
        for position in (2, 3, 4):
            lesson = self.row(Lesson, learning_path=self.path, position=position)
            first_cards[lesson.pk] = self.row(Card, lesson=lesson, body_markdown=f"Card {position}")
            self.row(Card, lesson=lesson, position=2, body_markdown=f"Card {position} again")
            lessons.append(lesson)
        open_url = lambda lesson: f"/api/learning/lessons/{lesson.pk}/open/"
        self.assertEqual(self.client.get("/api/learning/garden/").json()["recent_lessons"], [])
        for lesson in lessons:
            self.assertEqual(self.post(open_url(lesson), {}).status_code, 200)
        # Opened but never read lessons take no slot.
        self.assertEqual(self.client.get("/api/learning/garden/").json()["recent_lessons"], [])
        for lesson in lessons:
            self.post(f"/api/learning/cards/{first_cards[lesson.pk].pk}/complete/", {})
        recent = self.client.get("/api/learning/garden/").json()["recent_lessons"]
        self.assertEqual([row["id"] for row in recent], [str(lesson.pk) for lesson in reversed(lessons[1:])])
        self.assertEqual(recent[0]["next_step"]["type"], "card")
        self.assertEqual(recent[0]["learning_path_title"], self.path.title)

        self.assertEqual(self.post(open_url(self.lesson), {}).status_code, 200)
        self.assertEqual(LessonOpen.objects.filter(user=self.user).count(), 4)
        recent = self.client.get("/api/learning/garden/").json()["recent_lessons"]
        self.assertEqual([row["id"] for row in recent], [str(self.lesson.pk), str(lessons[3].pk), str(lessons[2].pk)])

        last_card = Card.objects.get(lesson=lessons[3], position=2)
        self.post(f"/api/learning/cards/{last_card.pk}/complete/", {})
        recent = self.client.get("/api/learning/garden/").json()["recent_lessons"]
        self.assertEqual([row["id"] for row in recent], [str(self.lesson.pk), str(lessons[2].pk), str(lessons[1].pk)])
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.other)}"
        self.assertEqual(self.client.get("/api/learning/garden/").json()["recent_lessons"], [])

    def test_garden_recent_lessons_excludes_lessons_with_all_cards_read(self):
        # Finished for this list means every card read, even when questions
        # remain open: only still-unread lessons get a shortcut. Opening
        # without reading any card is not progress either.
        self.post(f"/api/learning/lessons/{self.lesson.pk}/open/", {})
        self.assertEqual(self.client.get("/api/learning/garden/").json()["recent_lessons"], [])

        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        self.assertEqual(self.client.get("/api/learning/garden/").json()["recent_lessons"], [])

        # A partially read lesson with an unanswered checkpoint stays listed.
        second = self.row(Lesson, learning_path=self.path, position=2)
        first_card = self.row(Card, lesson=second, body_markdown="First")
        self.row(Question, lesson=second, after_card_position=1)
        self.row(Card, lesson=second, position=2, body_markdown="Second")
        self.post(f"/api/learning/lessons/{second.pk}/open/", {})
        self.post(f"/api/learning/cards/{first_card.pk}/complete/", {})
        recent = self.client.get("/api/learning/garden/").json()["recent_lessons"]
        self.assertEqual([row["id"] for row in recent], [str(second.pk)])
        self.assertEqual(recent[0]["next_step"]["type"], "question")

    def test_garden_recent_lessons_excludes_lessons_with_no_cards_read(self):
        # Thomas 2026-11-03: a lesson opened but with zero cards read must not
        # appear in Last lessons, even as the most recent opening.
        self.row(Card, lesson=self.lesson, position=2, body_markdown="Second")
        second = self.row(Lesson, learning_path=self.path, position=2)
        second_card = self.row(Card, lesson=second, body_markdown="First")
        self.row(Card, lesson=second, position=2, body_markdown="Second")

        # A partially read lesson is listed; a fresh opening on top of it is not.
        self.post(f"/api/learning/lessons/{second.pk}/open/", {})
        self.post(f"/api/learning/cards/{second_card.pk}/complete/", {})
        self.post(f"/api/learning/lessons/{self.lesson.pk}/open/", {})
        recent = self.client.get("/api/learning/garden/").json()["recent_lessons"]
        self.assertEqual([row["id"] for row in recent], [str(second.pk)])

        # Reading one card of the freshly opened lesson lists it in front.
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        recent = self.client.get("/api/learning/garden/").json()["recent_lessons"]
        self.assertEqual([row["id"] for row in recent], [str(self.lesson.pk), str(second.pk)])

    def test_open_lesson_validates_request_and_visibility(self):
        url = f"/api/learning/lessons/{self.lesson.pk}/open/"
        self.assertEqual(self.client.get(url).status_code, 405)
        self.assertEqual(self.post(url, {"user_id": self.other.pk}).status_code, 400)
        self.assertEqual(LessonOpen.objects.count(), 0)
        self.lesson.published = False
        self.lesson.save()
        self.assertEqual(self.post(url, {}).status_code, 404)
        self.assertEqual(LessonOpen.objects.count(), 0)

    def test_garden_rewards_and_separate_rankings_use_saved_progress(self):
        garden_url = "/api/learning/garden/"
        garden = self.client.get(garden_url)
        self.assertEqual(garden.status_code, 200)
        path = garden.json()["themes"][0]["learning_paths"][0]
        self.assertEqual(path["lessons"][0]["id"], str(self.lesson.pk))
        self.assertEqual(garden.json()["rewards"], {"drops": 0, "carrots": 0})
        self.assertNotIn("answer", garden.content.decode())

        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        # Reading every card finishes the lesson and the path: both bonuses
        # follow reading, questions are independent practice.
        self.assertEqual(self.client.get(garden_url).json()["rewards"], {"drops": 106, "carrots": 0})
        self.post("/api/learning/question-attempts/", {"question_id": str(self.question.pk), "answer": "1"})
        self.assertEqual(self.client.get(garden_url).json()["rewards"], {"drops": 106, "carrots": 0})
        self.post("/api/learning/question-attempts/", {"question_id": str(self.question.pk), "answer": "0"})
        # A correct answer adds its carrot; the reading bonuses do not move.
        self.assertEqual(self.client.get(garden_url).json()["rewards"], {"drops": 106, "carrots": 1})
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        self.assertEqual(self.client.get(garden_url).json()["rewards"], {"drops": 106, "carrots": 1})

        drops = self.client.get("/api/learning/leaderboard/?currency=drops&period=overall").json()
        carrots = self.client.get("/api/learning/leaderboard/?currency=carrots&period=overall").json()
        self.assertEqual(drops["rows"][0]["score"], 106)
        self.assertEqual(carrots["rows"][0]["score"], 1)
        self.assertEqual(drops["chart"]["series"][0]["is_self"], True)
        self.assertEqual(drops["chart"]["series"][0]["points"][-1], 106)
        self.assertEqual(carrots["chart"]["series"][0]["points"][-1], 1)
        self.assertTrue(drops["self"]["is_self"])
        self.assertEqual(self.client.get("/api/learning/leaderboard/?currency=invalid").status_code, 400)
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.other)}"
        self.assertEqual(self.client.get(garden_url).json()["rewards"], {"drops": 0, "carrots": 0})

    def test_leaderboard_chart_tracks_cumulative_totals_per_period(self):
        now = datetime(2026, 10, 28, 15, tzinfo=timezone.utc)  # Wednesday of the week of Oct 26
        events = {
            self.user.pk: [("drops", 1, datetime(2026, 10, 26, 10, tzinfo=timezone.utc)),
                           ("drops", 5, datetime(2026, 10, 28, 12, tzinfo=timezone.utc)),
                           ("carrots", 1, datetime(2026, 10, 27, 9, tzinfo=timezone.utc)),
                           ("drops", 100, datetime(2026, 9, 5, 12, tzinfo=timezone.utc))],
            self.other.pk: [("drops", 1, datetime(2026, 10, 27, 10, tzinfo=timezone.utc))],
        }
        rows = [{"user_id": self.user.pk, "name": "learner", "is_self": True},
                {"user_id": self.other.pk, "name": "other", "is_self": False}]

        weekly = chart(events, "drops", "weekly", rows, now)
        # No future days: today is Wednesday, so the week stops there.
        self.assertEqual([bucket["label"] for bucket in weekly["buckets"]], ["Mon", "Tue", "Wed"])
        self.assertEqual(weekly["series"][0]["points"], [1, 1, 6])
        self.assertEqual(weekly["series"][1]["points"], [0, 1, 1])

        monthly = chart(events, "drops", "monthly", rows, now)
        # Weeks run Monday to Sunday clipped to the month: Oct 26 and 28 share
        # the Oct 26-31 week, and empty weeks before the first reward go.
        self.assertEqual([bucket["label"] for bucket in monthly["buckets"]], ["Oct 26\u201331"])
        self.assertEqual(monthly["buckets"][0]["current"], True)
        self.assertEqual(monthly["series"][0]["points"], [6])
        self.assertEqual(monthly["series"][1]["points"], [1])

        overall = chart(events, "drops", "overall", rows, now)
        self.assertEqual([bucket["label"] for bucket in overall["buckets"]], ["Sep", "Oct"])
        self.assertEqual(overall["series"][0]["points"], [100, 106])
        self.assertEqual(overall["series"][1]["points"], [0, 1])

        carrots = chart(events, "carrots", "weekly", rows, now)
        # The first carrot was earned on Tuesday, so Monday is not plotted.
        self.assertEqual([bucket["label"] for bucket in carrots["buckets"]], ["Tue", "Wed"])
        self.assertEqual(carrots["series"][0]["points"], [1, 1])
        self.assertEqual(carrots["series"][1]["points"], [0, 0])

    def test_leaderboard_chart_covers_only_recorded_history(self):
        # Production report: activity started yesterday, today is Thursday.
        now = datetime(2026, 10, 29, 9, tzinfo=timezone.utc)
        events = {
            self.user.pk: [("drops", 20, datetime(2026, 10, 28, 18, tzinfo=timezone.utc)),
                           ("drops", 5, datetime(2026, 10, 29, 8, tzinfo=timezone.utc))],
            self.other.pk: [("drops", 57, datetime(2026, 10, 29, 7, tzinfo=timezone.utc))],
        }
        rows = [{"user_id": self.other.pk, "name": "other", "is_self": False},
                {"user_id": self.user.pk, "name": "learner", "is_self": True}]

        weekly = chart(events, "drops", "weekly", rows, now)
        self.assertEqual([bucket["label"] for bucket in weekly["buckets"]], ["Wed", "Thu"])
        self.assertEqual([bucket["current"] for bucket in weekly["buckets"]], [False, True])
        self.assertEqual(weekly["series"][0]["points"], [0, 57])
        self.assertEqual(weekly["series"][1]["points"], [20, 25])

        monthly = chart(events, "drops", "monthly", rows, now)
        # Wednesday Oct 28 and Thursday Oct 29 fall in the same Monday-Sunday
        # week, so the monthly chart has a single bucket.
        self.assertEqual([bucket["label"] for bucket in monthly["buckets"]], ["Oct 26\u201331"])
        self.assertEqual(monthly["buckets"][0]["current"], True)
        self.assertEqual(monthly["series"][0]["points"], [57])
        self.assertEqual(monthly["series"][1]["points"], [25])

        overall = chart(events, "drops", "overall", rows, now)
        self.assertEqual([bucket["label"] for bucket in overall["buckets"]], ["Oct"])
        self.assertEqual(overall["series"][0]["points"], [57])
        self.assertEqual(overall["series"][1]["points"], [25])

    def test_leaderboard_chart_monthly_weeks_start_monday_at_month_edges(self):
        rows = [{"user_id": self.user.pk, "name": "learner", "is_self": True}]

        # June 2026 starts on a Monday: the first week is the full Jun 1-7.
        now = datetime(2026, 6, 3, 12, tzinfo=timezone.utc)
        events = {self.user.pk: [("drops", 3, datetime(2026, 6, 1, 8, tzinfo=timezone.utc))]}
        monthly = chart(events, "drops", "monthly", rows, now)
        self.assertEqual([bucket["label"] for bucket in monthly["buckets"]], ["Jun 1\u20137"])
        self.assertEqual(monthly["series"][0]["points"], [3])

        # November 2026 starts on a Sunday: the first clipped week is Nov 1
        # alone, and an event on Oct 31 (same Monday-Sunday week) belongs to
        # October, not to this month.
        now = datetime(2026, 11, 1, 9, tzinfo=timezone.utc)
        events = {self.user.pk: [("drops", 5, datetime(2026, 10, 31, 23, tzinfo=timezone.utc))]}
        monthly = chart(events, "drops", "monthly", rows, now)
        self.assertEqual([bucket["label"] for bucket in monthly["buckets"]], ["Nov 1"])
        self.assertEqual(monthly["buckets"][0]["current"], True)
        self.assertEqual(monthly["series"][0]["points"], [0])

    def test_reward_periods_reset_at_utc_boundaries(self):
        now = datetime(2026, 10, 28, 12, tzinfo=timezone.utc)
        events = [
            ("drops", 1, datetime(2026, 10, 26, 0, tzinfo=timezone.utc)),
            ("drops", 5, datetime(2026, 10, 25, 23, 59, tzinfo=timezone.utc)),
            ("carrots", 1, datetime(2026, 9, 30, 23, 59, tzinfo=timezone.utc)),
        ]
        self.assertEqual(totals(events, "weekly", now), {"drops": 1, "carrots": 0})
        self.assertEqual(totals(events, "monthly", now), {"drops": 6, "carrots": 0})
        self.assertEqual(totals(events, "overall", now), {"drops": 6, "carrots": 1})

    def test_leaderboard_offset_reads_past_periods(self):
        # A card read seven days ago always lands in the previous calendar
        # week, and scores there rather than in the current one.
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        earned_at = datetime.now(timezone.utc) - timedelta(days=7)
        CardProgress.objects.filter(user=self.user).update(completed_at=earned_at)

        current = self.client.get("/api/learning/leaderboard/?currency=drops&period=weekly&offset=0").json()
        self.assertEqual(current["offset"], 0)
        self.assertTrue(current["window"]["current"])
        self.assertEqual(current["rows"], [])
        self.assertTrue(current["has_earlier"])

        previous = self.client.get("/api/learning/leaderboard/?currency=drops&period=weekly&offset=1").json()
        self.assertEqual(previous["offset"], 1)
        self.assertFalse(previous["window"]["current"])
        # Adjacent weeks share a boundary, and the reward falls inside it.
        self.assertEqual(previous["window"]["end"], current["window"]["start"])
        self.assertLessEqual(previous["window"]["start"], earned_at.isoformat())
        # The only card read earns 1 drop plus the 5-drop lesson bonus and the
        # 100-drop path bonus: both reading bonuses land in the same window.
        self.assertEqual(previous["rows"][0]["score"], 106)
        self.assertFalse(previous["has_earlier"])

        two_back = self.client.get("/api/learning/leaderboard/?currency=drops&period=weekly&offset=2").json()
        self.assertEqual(two_back["rows"], [])
        self.assertIsNone(two_back["self"])
        self.assertFalse(two_back["has_earlier"])

        # Seven days ago can still be this month: the reward lands in whichever
        # monthly window contains it, and only there.
        monthly = [self.client.get(f"/api/learning/leaderboard/?currency=drops&period=monthly&offset={i}").json()
                   for i in range(3)]
        scored = [payload for payload in monthly if payload["rows"]]
        self.assertEqual(len(scored), 1)
        self.assertEqual(scored[0]["rows"][0]["score"], 106)
        self.assertLessEqual(scored[0]["window"]["start"], earned_at.isoformat())
        self.assertLess(earned_at.isoformat(), scored[0]["window"]["end"])

        overall = self.client.get("/api/learning/leaderboard/?currency=drops&period=overall").json()
        self.assertIsNone(overall["window"])
        self.assertEqual(overall["rows"][0]["score"], 106)

        self.assertEqual(self.client.get("/api/learning/leaderboard/?offset=-1").status_code, 400)
        self.assertEqual(self.client.get("/api/learning/leaderboard/?offset=later").status_code, 400)
        self.assertEqual(self.client.get("/api/learning/leaderboard/?period=overall&offset=1").status_code, 400)

    def test_leaderboard_stats_count_activity_not_reward_points(self):
        # One card read and two attempts (one wrong, one correct) seven days
        # ago: the counts land in last week's window, and Drops bonuses never
        # inflate the card count.
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        self.post("/api/learning/question-attempts/", {"question_id": str(self.question.pk), "answer": "1"})
        self.post("/api/learning/question-attempts/", {"question_id": str(self.question.pk), "answer": "0"})
        earned_at = datetime.now(timezone.utc) - timedelta(days=7)
        CardProgress.objects.filter(user=self.user).update(completed_at=earned_at)
        QuestionAttempt.objects.filter(user=self.user).update(answered_at=earned_at)

        # Another learner's activity in the same window: one card read and one
        # correct attempt, seven days ago as well.
        CardProgress.objects.create(user=self.other, card=self.card, completed_at=earned_at)
        QuestionAttempt.objects.create(user=self.other, question=self.question,
                                       attempt_type="initial", submitted_answer="0",
                                       correct=True, answered_at=earned_at)

        drops = self.client.get("/api/learning/leaderboard/?currency=drops&period=weekly&offset=1").json()
        own = drops["self"]
        # 106 Drops (1 + 5 lesson + 100 path bonus) but exactly one card read.
        self.assertEqual(own["score"], 106)
        self.assertEqual(own["stats"]["cards_read"], 1)
        # Every ranked row carries the same aggregated stats, not only self.
        for row in drops["rows"]:
            self.assertIn("stats", row)
        other_row = next(row for row in drops["rows"] if not row["is_self"])
        self.assertEqual(other_row["stats"]["cards_read"], 1)

        carrots = self.client.get("/api/learning/leaderboard/?currency=carrots&period=weekly&offset=1").json()
        other_carrots = next(row for row in carrots["rows"] if not row["is_self"])
        self.assertEqual(other_carrots["stats"],
                         {"cards_read": 1, "attempts": 1, "correct": 1, "wrong": 0})

        self.assertEqual(carrots["self"]["score"], 1)
        self.assertEqual(carrots["self"]["stats"],
                         {"cards_read": 1, "attempts": 2, "correct": 1, "wrong": 1})

        # The current week shows no activity for these events.
        current = self.client.get("/api/learning/leaderboard/?currency=drops&period=weekly").json()
        self.assertIsNone(current["self"])

        # Overall is unbounded.
        overall = self.client.get("/api/learning/leaderboard/?currency=carrots&period=overall").json()
        self.assertEqual(overall["self"]["stats"]["attempts"], 2)

    def test_period_window_offsets_follow_calendar_boundaries(self):
        now = datetime(2026, 11, 3, 12, tzinfo=timezone.utc)  # Tuesday of the Nov 2-8 week
        self.assertEqual(period_window("weekly", 0, now),
                         (datetime(2026, 11, 2, tzinfo=timezone.utc), datetime(2026, 11, 9, tzinfo=timezone.utc)))
        self.assertEqual(period_window("weekly", 3, now),
                         (datetime(2026, 10, 12, tzinfo=timezone.utc), datetime(2026, 10, 19, tzinfo=timezone.utc)))
        self.assertEqual(period_window("monthly", 1, now),
                         (datetime(2026, 10, 1, tzinfo=timezone.utc), datetime(2026, 11, 1, tzinfo=timezone.utc)))
        # January steps back into December of the previous year.
        jan = datetime(2026, 1, 15, 12, tzinfo=timezone.utc)
        self.assertEqual(period_window("monthly", 1, jan),
                         (datetime(2025, 12, 1, tzinfo=timezone.utc), datetime(2026, 1, 1, tzinfo=timezone.utc)))
        self.assertEqual(period_window("overall", 0, now), (None, None))

    def test_leaderboard_history_scores_come_from_the_period_itself(self):
        now = datetime(2026, 11, 3, 12, tzinfo=timezone.utc)  # Tuesday of the Nov 2-8 week
        events = [
            ("drops", 1, datetime(2026, 11, 2, 10, tzinfo=timezone.utc)),   # this week
            ("drops", 5, datetime(2026, 10, 28, 10, tzinfo=timezone.utc)),  # last week
            ("drops", 100, datetime(2026, 10, 4, 10, tzinfo=timezone.utc)), # two weeks ago, still October
            ("carrots", 1, datetime(2026, 9, 15, 10, tzinfo=timezone.utc)), # September
        ]
        self.assertEqual(totals(events, "weekly", now, offset=1), {"drops": 5, "carrots": 0})
        self.assertEqual(totals(events, "monthly", now, offset=1), {"drops": 105, "carrots": 0})
        self.assertEqual(totals(events, "monthly", now, offset=2), {"drops": 0, "carrots": 1})

        rows = [{"user_id": self.user.pk, "name": "learner", "is_self": True}]
        weekly = chart({self.user.pk: events}, "drops", "weekly", rows, now, offset=1)
        # Past weeks keep the usual trim of leading days with no rewards, and
        # later events stay out of the window.
        self.assertEqual([bucket["label"] for bucket in weekly["buckets"]], ["Wed", "Thu", "Fri", "Sat", "Sun"])
        self.assertEqual(weekly["series"][0]["points"], [5, 5, 5, 5, 5])
        self.assertFalse(any(bucket["current"] for bucket in weekly["buckets"]))

        monthly = chart({self.user.pk: events}, "drops", "monthly", rows, now, offset=1)
        self.assertEqual(monthly["buckets"][-1]["label"], "Oct 26\u201331")
        self.assertEqual(monthly["series"][0]["points"][-1], 105)
        self.assertFalse(any(bucket["current"] for bucket in monthly["buckets"]))

    def test_cannot_skip_cards_or_checkpoints_and_resume_after_pass(self):
        second = self.row(Card, lesson=self.lesson, position=2, body_markdown="Next")
        url = f"/api/learning/cards/{second.pk}/complete/"
        self.assertEqual(self.post(url, {}).status_code, 409)
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        self.assertEqual(self.post(url, {}).status_code, 409)
        self.post("/api/learning/question-attempts/", {"question_id": str(self.question.pk), "answer": "0"})
        self.assertEqual(self.client.get(f"/api/learning/lessons/{self.lesson.pk}/").json()["next_step"],
                         {"type": "card", "id": str(second.pk)})
        self.assertTrue(self.post(url, {}).json()["progress"]["completed"])

    def test_hidden_checkpoint_card_hides_question_and_empty_lessons_do_not_complete(self):
        Card.objects.filter(pk=self.card.pk).update(published=False)
        result = self.client.get(f"/api/learning/lessons/{self.lesson.pk}/").json()
        self.assertEqual(result["cards"], [])
        self.assertEqual(result["questions"], [])
        self.assertFalse(result["lesson"]["progress"]["completed"])
        self.assertEqual(self.post("/api/learning/question-attempts/", {
            "question_id": str(self.question.pk), "answer": "0"}).status_code, 404)

    def test_all_endpoints_require_bearer_not_session_auth(self):
        self.client.defaults.clear()
        self.client.force_login(self.user)
        for url in (f"/api/learning/lessons/{self.lesson.pk}/",
                    "/api/learning/garden/", "/api/learning/leaderboard/",
                    f"/api/learning/paths/{self.path.pk}/catch-up/"):
            self.assertEqual(self.client.get(url).status_code, 401)
        for url in (f"/api/learning/cards/{self.card.pk}/complete/", "/api/learning/question-attempts/"):
            self.assertEqual(self.post(url, {}).status_code, 401)

    def test_ordering_and_query_count_does_not_grow_with_card_count(self):
        garden_url = "/api/learning/garden/"
        with CaptureQueriesContext(connection) as before:
            self.assertEqual(self.client.get(garden_url).status_code, 200)
        second = self.row(Lesson, learning_path=self.path, position=2)
        for position in range(2, 12):
            self.row(Card, lesson=second, position=position, body_markdown="More")
        with CaptureQueriesContext(connection) as after:
            result = self.client.get(garden_url)
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(after.captured_queries), len(before.captured_queries))
        lessons = result.json()["themes"][0]["learning_paths"][0]["lessons"]
        self.assertEqual([l["id"] for l in lessons], [str(self.lesson.pk), str(second.pk)])

    def test_get_methods_reject_writes_and_large_or_cross_origin_answers_fail(self):
        self.assertEqual(self.post("/api/learning/garden/", {}).status_code, 405)
        self.assertEqual(self.client.post("/api/learning/question-attempts/", "{}", content_type="application/json",
                                         HTTP_ORIGIN="https://untrusted.invalid").status_code, 403)
        self.assertEqual(self.client.post("/api/learning/question-attempts/", " " * 4097,
                                         content_type="application/json").status_code, 400)


    def test_empty_lesson_keeps_parent_incomplete(self):
        self.row(Lesson, learning_path=self.path, position=2)
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        self.post("/api/learning/question-attempts/", {"question_id": str(self.question.pk), "answer": "0"})
        data = self.client.get("/api/learning/garden/").json()["themes"][0]["learning_paths"][0]
        self.assertFalse(data["progress"]["completed"])
        self.assertEqual(data["progress"]["lessons_completed"], 1)


    def test_catch_up_pool_and_gauge_track_never_answered_and_wrong_only_questions(self):
        second = self.row(Question, lesson=self.lesson, position=2, after_card_position=1,
                          prompt="Second", options=self.question.options, answer="1")
        third = self.row(Question, lesson=self.lesson, position=3, after_card_position=1,
                         prompt="Third", options=self.question.options, answer="2")
        other_lesson = self.row(Lesson, learning_path=self.path, position=2)
        self.row(Card, lesson=other_lesson, body_markdown="Unread")
        self.row(Question, lesson=other_lesson, after_card_position=1,
                 prompt="Other", options=self.question.options, answer="0")
        catch_up_url = f"/api/learning/paths/{self.path.pk}/catch-up/"
        attempt_url = "/api/learning/question-attempts/"

        # Nothing fully read yet: the quiz stays disabled and the pool empty.
        path = self.client.get("/api/learning/garden/").json()["themes"][0]["learning_paths"][0]
        self.assertEqual(path["catch_up"], {"eligible": False, "remaining": 0})
        self.assertEqual(path["progress"]["questions_correct"], 0)
        self.assertEqual(path["progress"]["questions_total"], 4)
        self.assertEqual(self.client.get(catch_up_url).json(), {
            "learning_path_id": str(self.path.pk), "eligible": False,
            "remaining": 0, "questions": []})
        refused = self.post(attempt_url, {"question_id": str(self.question.pk), "answer": "0"})
        self.assertEqual(refused.status_code, 409)

        # One correct answer, one only ever wrong, one never attempted; the
        # other lesson's question stays out until its cards are read.
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        now = datetime.now(timezone.utc)
        QuestionAttempt.objects.create(user=self.user, question=self.question, attempt_type="initial",
                                       submitted_answer="0", correct=True, answered_at=now)
        QuestionAttempt.objects.create(user=self.user, question=second, attempt_type="initial",
                                       submitted_answer="0", correct=False, answered_at=now)
        pool = self.client.get(catch_up_url).json()
        self.assertTrue(pool["eligible"])
        self.assertEqual(pool["remaining"], 2)
        self.assertEqual({q["id"] for q in pool["questions"]}, {str(self.question.pk), str(second.pk), str(third.pk)})
        path = self.client.get("/api/learning/garden/").json()["themes"][0]["learning_paths"][0]
        self.assertEqual(path["catch_up"], {"eligible": True, "remaining": 2})
        self.assertEqual(path["progress"]["questions_correct"], 1)
        self.assertFalse(path["progress"]["completed"])

        # Answering the pool closes the gaps: ordinary retries, no quiz type.
        for item in pool["questions"]:
            question = Question.objects.get(pk=item["id"])
            response = self.post(attempt_url, {"question_id": item["id"], "answer": question.answer})
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.json()["attempt_type"],
                             "review" if question.pk == self.question.pk else "retry")
            self.assertIsNone(response.json()["next_step"])
        # Gaps closed but the other lesson is still unread: practice stays open.
        waiting = self.client.get(catch_up_url).json()
        self.assertNotIn("mode", waiting)
        self.assertEqual(waiting["remaining"], 0)
        self.assertEqual(len(waiting["questions"]), 3)
        other = Question.objects.get(lesson=other_lesson)
        self.post(f"/api/learning/cards/{other_lesson.cards.get().pk}/complete/", {})
        self.post(attempt_url, {"question_id": str(other.pk), "answer": other.answer})
        # Path complete: review practice over the already-answered questions,
        # and re-answering one records a review.
        done = self.client.get(catch_up_url).json()
        self.assertNotIn("mode", done)
        self.assertEqual(done["remaining"], 0)
        self.assertEqual(len(done["questions"]), 4)
        selected = self.client.get(f"/api/learning/lessons/{self.lesson.pk}/").json()["questions"][0]
        current = Question.objects.get(pk=selected["id"])
        repeated = self.post(attempt_url, {"question_id": selected["id"], "answer": current.answer})
        self.assertEqual(repeated.status_code, 201)
        self.assertEqual(repeated.json()["attempt_type"], "review")
        self.assertFalse(repeated.json()["carrot_earned"])
        progress = self.client.get(f"/api/learning/lessons/{self.lesson.pk}/").json()["lesson"]["progress"]
        self.assertTrue(progress["completed"])
        self.assertEqual(progress["questions_correct"], 3)
        # Every distinct question answered correctly earned one carrot (three
        # here, one in the other lesson); repeats and reviews added none. The
        # other lesson also earned its own drops and the one-time path bonus.
        self.assertEqual(self.client.get("/api/learning/garden/").json()["rewards"],
                         {"drops": 112, "carrots": 4})

    def test_catch_up_lesson_filter_scopes_the_session_to_that_lesson(self):
        """?lesson=<id> serves only that lesson's read questions (Thomas,
        2026-11-08: practising the lesson selected in the garden)."""
        other_lesson = self.row(Lesson, learning_path=self.path, position=2)
        other_card = self.row(Card, lesson=other_lesson, body_markdown="Other")
        other = self.row(Question, lesson=other_lesson, after_card_position=1,
                         prompt="Other", options=self.question.options, answer="0")
        url = f"/api/learning/paths/{self.path.pk}/catch-up/"

        # Unknown lesson for this path: 404.
        self.assertEqual(self.client.get(f"{url}?lesson={uuid4()}").status_code, 404)

        # Nothing read: the filtered lesson is not eligible either.
        unread = self.client.get(f"{url}?lesson={self.lesson.pk}").json()
        self.assertEqual(unread["eligible"], False)
        self.assertEqual(unread["questions"], [])

        # Read both lessons: the filter serves only the chosen lesson's pool.
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        self.post(f"/api/learning/cards/{other_card.pk}/complete/", {})
        mine = self.client.get(f"{url}?lesson={self.lesson.pk}").json()
        self.assertTrue(mine["eligible"])
        self.assertEqual({q["id"] for q in mine["questions"]}, {str(self.question.pk)})
        theirs = self.client.get(f"{url}?lesson={other_lesson.pk}").json()
        self.assertEqual({q["id"] for q in theirs["questions"]}, {str(other.pk)})

    def test_practice_stays_open_at_zero_gaps_with_unread_lessons(self):
        unread = self.row(Lesson, learning_path=self.path, position=2)
        self.row(Card, lesson=unread, body_markdown="Unread")
        self.row(Question, lesson=unread, after_card_position=1,
                 prompt="Other", options=self.question.options, answer="0")
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        self.post("/api/learning/question-attempts/", {"question_id": str(self.question.pk), "answer": "0"})
        # Every question of the read lesson is answered but the path is not
        # complete: practice still serves the read lesson.
        result = self.client.get(f"/api/learning/paths/{self.path.pk}/catch-up/").json()
        self.assertNotIn("mode", result)
        self.assertEqual(result["remaining"], 0)
        self.assertEqual([q["id"] for q in result["questions"]], [str(self.question.pk)])

    def test_catch_up_session_caps_at_ten_questions(self):
        for position in range(2, 14):
            self.row(Question, lesson=self.lesson, position=position, after_card_position=1,
                     prompt=f"Extra {position}", options=self.question.options, answer="1")
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        data = self.client.get(f"/api/learning/lessons/{self.lesson.pk}/").json()
        selected = data["questions"][0]["id"]
        chosen = Question.objects.get(pk=selected)
        self.post("/api/learning/question-attempts/", {"question_id": selected, "answer": chosen.answer})
        result = self.client.get(f"/api/learning/paths/{self.path.pk}/catch-up/").json()
        self.assertNotIn("mode", result)
        self.assertEqual(result["remaining"], 12)
        self.assertEqual(len(result["questions"]), 10)
        pool_ids = {str(q.pk) for q in Question.objects.filter(lesson=self.lesson)} - {selected}
        self.assertLessEqual({q["id"] for q in result["questions"]}, pool_ids)
        # The garden gauge still counts the whole pool, not one session.
        path = self.client.get("/api/learning/garden/").json()["themes"][0]["learning_paths"][0]
        self.assertEqual(path["catch_up"], {"eligible": True, "remaining": 12})

    def test_quiz_session_prioritizes_all_latest_failures_before_unseen(self):
        old = [self.row(Question, lesson=self.lesson, position=position, after_card_position=1,
                        prompt=f"Old {position}", options=self.question.options, answer="1")
               for position in range(2, 10)]
        fresh = [self.row(Question, lesson=self.lesson, position=position, after_card_position=1,
                          prompt=f"Fresh {position}", options=self.question.options, answer="1")
                 for position in range(10, 15)]
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        now = datetime.now(timezone.utc)
        # Eight questions only ever answered wrong; the older the last wrong
        # attempt, the more due the question. Five more were never attempted.
        for days, question in enumerate(old):
            QuestionAttempt.objects.create(user=self.user, question=question, attempt_type="initial",
                                           submitted_answer="0", correct=False,
                                           answered_at=now - timedelta(days=10 - days))
        result = self.client.get(f"/api/learning/paths/{self.path.pk}/catch-up/").json()
        self.assertEqual(result["remaining"], 14)  # self.question is a gap too
        served = [q["id"] for q in result["questions"]]
        self.assertEqual(len(served), 10)
        # Every failed question precedes any never-attempted question.
        self.assertEqual(set(served[:8]), {str(q.pk) for q in old})

    def test_latest_failure_priority_and_later_success_clears_it(self):
        from .views import quiz_session
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        now = datetime.now(timezone.utc)
        for index, correct in enumerate([True, False, True]):
            QuestionAttempt.objects.create(user=self.user, question=self.question,
                attempt_type="review", submitted_answer="0", correct=correct,
                answered_at=now + timedelta(seconds=index))
            state = LearnerState(self.user)
            self.assertEqual(state.last_correct[self.question.pk], correct)
            self.assertEqual(state.last_attempt[self.question.pk], now + timedelta(seconds=index))
            self.assertEqual(state.progress([self.lesson])["questions_correct"], 1)
        # A historical failure is not failed-first after a subsequent success.
        unseen = self.row(Question, lesson=self.lesson, position=2, after_card_position=1,
                          prompt="New", options=self.question.options, answer="1")
        state = LearnerState(self.user)
        self.assertEqual(quiz_session(state, state.questions, limit=1), [unseen])
        QuestionAttempt.objects.create(user=self.user, question=self.question,
            attempt_type="review", submitted_answer="1", correct=False,
            answered_at=now + timedelta(seconds=3))
        state = LearnerState(self.user)
        self.assertEqual(quiz_session(state, state.questions, limit=1), [self.question])


from concurrent.futures import ThreadPoolExecutor
from unittest import skipUnless
from unittest.mock import patch
from types import SimpleNamespace
from django.test import SimpleTestCase

from django.db import close_old_connections, connection
from django.test import Client, TransactionTestCase


class QuizSelectionTests(SimpleTestCase):
    def session(self, failed=0, unseen=0, answered=0, limit=10):
        from .views import quiz_session
        pool = [SimpleNamespace(pk=i) for i in range(failed + unseen + answered)]
        attempted = list(range(failed)) + list(range(failed + unseen, len(pool)))
        state = SimpleNamespace(last_attempt={i: i for i in attempted},
                                last_correct={i: i >= failed for i in attempted})
        # Reverse random buckets to prove the random tail is not oldest-first.
        with patch("apps.learning.views.random.shuffle", side_effect=lambda rows: rows.reverse()):
            return [q.pk for q in quiz_session(state, pool, limit)]

    def test_one_failed_one_unseen_leaves_five_oldest_and_three_random(self):
        selected = self.session(failed=1, unseen=1, answered=20)
        self.assertEqual(selected, [0, 1, 2, 3, 4, 5, 6, 21, 20, 19])
        self.assertEqual(len(set(selected)), 10)

    def test_failed_tier_fills_session_before_unseen_or_answered(self):
        self.assertEqual(self.session(failed=12, unseen=12, answered=20), list(range(11, 1, -1)))

    def test_unseen_fills_after_failed_before_any_review(self):
        self.assertEqual(self.session(failed=2, unseen=12, answered=20), [1, 0] + list(range(13, 5, -1)))

    def test_no_priority_questions_uses_six_oldest_four_random(self):
        self.assertEqual(self.session(answered=20), list(range(6)) + [19, 18, 17, 16])

    def test_rounding_small_pool_empty_pool_and_no_duplicates(self):
        self.assertEqual(self.session(failed=1, unseen=2, answered=20),
                         [0, 2, 1, 3, 4, 5, 6, 22, 21, 20])
        self.assertEqual(self.session(failed=1, unseen=1, answered=1), [0, 1, 2])
        self.assertEqual(self.session(), [])


@skipUnless(connection.vendor == "postgresql", "Production row-lock concurrency requires PostgreSQL")
class LearningConcurrencyTests(TransactionTestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="concurrent")
        self.token = issue_token(self.user)
        def row(model, **fields):
            return model.objects.create(
                entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
                position=1, published=True, source_path="example", last_changed_commit="a" * 40,
                **({"title": model.__name__} if model != Question else {}), **fields,
            )
        theme = row(Theme)
        path = row(LearningPath, theme=theme)
        lesson = row(Lesson, learning_path=path)
        self.card = row(Card, lesson=lesson, body_markdown="Read")
        self.question = row(Question, lesson=lesson, after_card_position=1,
                            prompt="Choose", options=[{"id": str(i), "text": str(i)} for i in range(4)],
                            answer="0", explanation="Yes")

    def parallel_posts(self, url, body):
        from threading import Barrier
        barrier = Barrier(2)
        def post(_):
            close_old_connections()
            try:
                client = Client(HTTP_AUTHORIZATION=f"Bearer {self.token}")
                barrier.wait(timeout=10)
                return client.post(url, json.dumps(body), content_type="application/json").status_code
            finally:
                close_old_connections()
        with ThreadPoolExecutor(max_workers=2) as pool:
            return sorted(pool.map(post, range(2)))

    def test_concurrent_completions_and_correct_attempts_reward_once(self):
        self.assertEqual(self.parallel_posts(f"/api/learning/cards/{self.card.pk}/complete/", {}), [200, 201])
        self.assertEqual(CardProgress.objects.filter(user=self.user).count(), 1)
        self.assertEqual(self.parallel_posts("/api/learning/question-attempts/", {
            "question_id": str(self.question.pk), "answer": "0"}), [201, 201])
        self.assertEqual(list(QuestionAttempt.objects.filter(user=self.user)
                              .values_list("attempt_type", flat=True)), ["initial", "review"])
        garden = Client(HTTP_AUTHORIZATION=f"Bearer {self.token}").get("/api/learning/garden/").json()
        self.assertEqual(garden["rewards"], {"drops": 106, "carrots": 1})


class ReviewSessionTests(TestCase):
    """Cross-theme Review sessions and the garden's seasonal practice aging.

    Thomas, 2026-11-08: 5/10/15 minutes -> 1/2/3 stalest paths and 10/20/30
    questions, read lessons only, same selection priorities as Practice.
    """

    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            position=fields.pop("position", 1), published=True, source_path="example", last_changed_commit="a" * 40,
            **({} if model == Question or "title" in fields else {"title": model.__name__}), **fields)

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="learner")
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.user)}"
        self.now = datetime.now(timezone.utc)
        # Three paths with one fully read lesson each, last touched 25, 3 and
        # 12 days ago: winter, fresh and autumn anchors.
        self.paths = []
        for i, days in enumerate((25, 3, 12)):
            theme = self.row(Theme, title=f"Theme{i}", position=i + 1)
            path = self.row(LearningPath, theme=theme, title=f"Path{i}", position=i + 1)
            lesson = self.row(Lesson, learning_path=path, title=f"Lesson{i}", position=1)
            card = self.row(Card, lesson=lesson, position=1, body_markdown="Body")
            question = self.row(Question, lesson=lesson, after_card_position=1, prompt=f"Prompt{i}",
                                options=[{"id": "a", "text": "A"}, {"id": "b", "text": "B"}],
                                answer="a", explanation="Why")
            CardProgress.objects.create(user=self.user, card=card,
                                        completed_at=self.now - timedelta(days=days))
            self.paths.append({"path": path, "lesson": lesson, "question": question, "days": days})
        # A second, unread lesson on the stalest path: its question is never reviewable.
        unread = self.row(Lesson, learning_path=self.paths[0]["path"], title="Unread", position=2)
        self.row(Card, lesson=unread, position=1, body_markdown="Body")
        self.unread_question = self.row(Question, lesson=unread, after_card_position=1, prompt="Unread prompt",
                                        options=[{"id": "a", "text": "A"}], answer="a", explanation="Why")

    def review(self, minutes=None):
        url = "/api/learning/review/" + ("" if minutes is None else f"?minutes={minutes}")
        return self.client.get(url)

    def test_review_minutes_validation_and_auth(self):
        self.assertEqual(self.review().status_code, 400)
        self.assertEqual(self.review(7).status_code, 400)
        self.assertEqual(self.review("abc").status_code, 400)
        self.assertEqual(self.review(5).status_code, 200)
        self.client.defaults.clear()
        self.assertEqual(self.review(5).status_code, 401)

    def test_review_picks_stalest_paths_first(self):
        body = self.review(5).json()
        self.assertEqual(body["minutes"], 5)
        self.assertEqual([p["title"] for p in body["learning_paths"]], ["Path0"])
        self.assertEqual(body["learning_paths"][0]["theme_title"], "Theme0")
        self.assertTrue(body["eligible"])
        body = self.review(15).json()
        self.assertEqual([p["title"] for p in body["learning_paths"]], ["Path0", "Path2", "Path1"])

    def test_review_questions_come_from_read_lessons_of_selected_paths_only(self):
        body = self.review(15).json()
        ids = {q["id"] for q in body["questions"]}
        self.assertNotIn(str(self.unread_question.pk), ids)
        self.assertEqual(ids, {str(p["question"].pk) for p in self.paths})
        for question in body["questions"]:
            self.assertIn("learning_path_title", question)
            self.assertIn("lesson_title", question)
            self.assertNotIn("answer", question)
        # 5 minutes: only the stalest path's questions, below the 10 target
        # because the pool is smaller - sessions shrink honestly, never top up.
        body = self.review(5).json()
        self.assertEqual(len(body["questions"]), 1)
        self.assertEqual(body["questions"][0]["learning_path_title"], "Path0")

    def test_review_session_keeps_practice_priorities(self):
        # On the stalest path, a second question whose latest attempt failed
        # leads the session; the never-answered one follows.
        failed = self.row(Question, lesson=self.paths[0]["lesson"], after_card_position=1, position=2, prompt="Failed",
                          options=[{"id": "a", "text": "A"}], answer="a", explanation="Why")
        QuestionAttempt.objects.create(user=self.user, question=failed, attempt_type="review",
                                       submitted_answer="b", correct=False,
                                       answered_at=self.now - timedelta(days=20))
        body = self.review(5).json()
        self.assertEqual(body["questions"][0]["id"], str(failed.pk))
        self.assertEqual(len(body["questions"]), 2)

    def test_review_anchor_uses_latest_of_attempts_and_reads(self):
        # Path1 was read 3 days ago; an older attempt must not make it stale.
        QuestionAttempt.objects.create(user=self.user, question=self.paths[1]["question"],
                                       attempt_type="initial", submitted_answer="a", correct=True,
                                       answered_at=self.now - timedelta(days=20))
        body = self.review(15).json()
        self.assertEqual([p["title"] for p in body["learning_paths"]], ["Path0", "Path2", "Path1"])
        # A fresh attempt on the stalest path moves it out of first place.
        QuestionAttempt.objects.create(user=self.user, question=self.paths[0]["question"],
                                       attempt_type="review", submitted_answer="a", correct=True,
                                       answered_at=self.now - timedelta(days=1))
        body = self.review(5).json()
        self.assertEqual([p["title"] for p in body["learning_paths"]], ["Path2"])

    def test_garden_reports_seasonal_practice_aging(self):
        garden = self.client.get("/api/learning/garden/").json()
        practice = {p["title"]: p["practice"] for theme in garden["themes"] for p in theme["learning_paths"]}
        self.assertEqual(practice["Path0"]["state"], "winter")
        self.assertEqual(practice["Path0"]["days_since"], 25)
        self.assertEqual(practice["Path1"]["state"], "fresh")
        self.assertEqual(practice["Path1"]["days_since"], 3)
        self.assertEqual(practice["Path2"]["state"], "autumn")
        self.assertEqual(practice["Path2"]["days_since"], 12)
        self.assertTrue(practice["Path2"]["last_activity_at"])
        # A path with nothing fully read is still growing: no aging.
        theme = self.row(Theme, title="New", position=9)
        path = self.row(LearningPath, theme=theme, title="Unstarted", position=9)
        lesson = self.row(Lesson, learning_path=path, position=1)
        self.row(Card, lesson=lesson, position=1, body_markdown="Body")
        garden = self.client.get("/api/learning/garden/").json()
        practice = {p["title"]: p["practice"] for theme in garden["themes"] for p in theme["learning_paths"]}
        self.assertEqual(practice["Unstarted"], {"last_activity_at": None, "days_since": None, "state": "fresh"})
