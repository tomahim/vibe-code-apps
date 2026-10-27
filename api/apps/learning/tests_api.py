import json
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.accounts.tokens import issue_token
from .models import Card, CardProgress, ContentEntity, LearningPath, Lesson, Question, QuestionAttempt, Theme


class LearningAPITests(TestCase):
    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            position=1, published=True, source_path="example", last_changed_commit="a" * 40,
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

    def test_themes_and_authentication(self):
        url = "/api/learning/themes/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["themes"][0]["progress"]["cards_total"], 1)
        self.assertIn("no-store", response["Cache-Control"])
        self.assertNotIn("answer", response.content.decode())
        self.client.defaults.clear()
        self.assertEqual(self.client.get(url).status_code, 401)

    def test_hidden_content_is_not_counted(self):
        for model, record in [(Theme, self.theme), (LearningPath, self.path), (Lesson, self.lesson),
                              (Card, self.card), (Question, self.question)]:
            model.objects.filter(pk=record.pk).update(published=False)
            data = self.client.get("/api/learning/themes/").json()["themes"]
            if model == Theme:
                self.assertEqual(data, [])
            elif model == Question:
                self.assertEqual(data[0]["progress"]["checkpoints_total"], 0)
            else:
                self.assertEqual(data[0]["progress"]["cards_total"], 0)
            model.objects.filter(pk=record.pk).update(published=True)
        self.theme.entity.archived = True
        self.theme.entity.save()
        self.assertEqual(self.client.get("/api/learning/themes/").json()["themes"], [])

    def test_theme_detail_paths_and_hidden_ancestors(self):
        url = f"/api/learning/themes/{self.theme.pk}/"
        result = self.client.get(url)
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.json()["learning_paths"][0]["id"], str(self.path.pk))
        self.path.entity.archived = True
        self.path.entity.save()
        self.assertEqual(self.client.get(url).json()["learning_paths"], [])
        self.assertEqual(self.client.get(f"/api/learning/themes/{uuid4()}/").status_code, 404)

    def test_path_detail_and_lesson_order(self):
        url = f"/api/learning/paths/{self.path.pk}/"
        result = self.client.get(url).json()
        self.assertEqual(result["lessons"][0]["id"], str(self.lesson.pk))
        self.assertEqual(result["next_lesson_id"], str(self.lesson.pk))
        self.assertEqual(result["theme"]["id"], str(self.theme.pk))
        Theme.objects.filter(pk=self.theme.pk).update(published=False)
        self.assertEqual(self.client.get(url).status_code, 404)

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
        self.assertEqual(self.post(url, body).status_code, 409)
        self.assertEqual(QuestionAttempt.objects.count(), 2)
        self.assertEqual(QuestionAttempt.objects.filter(user=self.other).count(), 0)
        lesson = self.client.get(f"/api/learning/lessons/{self.lesson.pk}/").json()
        self.assertTrue(lesson["questions"][0]["completed"])
        self.assertNotIn("explanation", lesson["questions"][0])

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
        self.post(f"/api/learning/cards/{self.card.pk}/complete/", {})
        self.assertEqual(self.post("/api/learning/question-attempts/", {
            "question_id": str(other.pk), "answer": other.answer}).status_code, 409)
        chosen = Question.objects.get(pk=selected)
        response = self.post("/api/learning/question-attempts/", {"question_id": selected, "answer": chosen.answer})
        self.assertTrue(response.json()["progress"]["completed"])
        self.assertEqual(response.json()["progress"]["checkpoints_correct"], 1)
