from uuid import uuid4

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from .models import Card, CardProgress, ContentEntity, LearningPath, Lesson, Question, QuestionAttempt, Theme


def entity(kind):
    return ContentEntity.objects.create(id=uuid4(), kind=kind)


def described(model, position=1, published=True, **fields):
    return model.objects.create(
        entity=entity(model.CONTENT_KIND), title=model.__name__, position=position,
        source_path="themes/example/index.md", last_changed_commit="a" * 40,
        published=published, **fields,
    )


class LearningProgressDashboardTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.staff = User.objects.create_superuser(username="admin", password="pw", email="a@b.c")
        self.learner = User.objects.create_user(username="learner", password="pw")
        self.other = User.objects.create_user(username="other", password="pw")

        self.theme = described(Theme)
        self.path = described(LearningPath, theme=self.theme)
        self.lesson = described(Lesson, learning_path=self.path)
        self.cards = [
            Card.objects.create(
                entity=entity(Card.CONTENT_KIND), lesson=self.lesson, position=i + 1,
                title=f"Card {i + 1}", body_markdown="Body.", published=True,
                source_path=f"cards/{i}.md", last_changed_commit="a" * 40,
            )
            for i in range(2)
        ]
        self.question = Question.objects.create(
            entity=entity(Question.CONTENT_KIND), lesson=self.lesson, position=1,
            after_card_position=1, published=True,
            source_path="questions/one.yaml", last_changed_commit="a" * 40,
            prompt="Which one?", options=[{"id": str(i), "text": f"Choice {i}"} for i in range(4)],
            answer="0", explanation="Because it is correct.",
        )
        # Unpublished content must stay out of the dashboard totals.
        described(Lesson, learning_path=self.path, position=2, published=False)

        # learner: 1/2 cards read, 1/1 question correct (once wrong, then right).
        CardProgress.objects.create(user=self.learner, card=self.cards[0], completed_at=timezone.now())
        QuestionAttempt.objects.create(
            user=self.learner, question=self.question, attempt_type="initial",
            submitted_answer="1", correct=False, answered_at=timezone.now(),
        )
        QuestionAttempt.objects.create(
            user=self.learner, question=self.question, attempt_type="retry",
            submitted_answer="0", correct=True, answered_at=timezone.now(),
        )
        # other: no progress.
        self.url = reverse("admin-learning-progress")

    def test_anonymous_is_redirected_to_login(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 302)
        self.assertIn("/admin/login/", response["Location"])

    def test_non_staff_is_redirected(self):
        self.client.force_login(self.learner)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 302)
        self.assertIn("/admin/login/", response["Location"])

    def test_staff_without_learning_permission_is_forbidden(self):
        staff = get_user_model().objects.create_user(username="staffer", password="pw", is_staff=True)
        self.client.force_login(staff)
        self.assertEqual(self.client.get(self.url).status_code, 403)

    def test_staff_with_learning_permission_can_view(self):
        from django.contrib.auth.models import Permission
        staff = get_user_model().objects.create_user(username="staffer", password="pw", is_staff=True)
        staff.user_permissions.add(Permission.objects.get(codename="view_learningpath"))
        self.client.force_login(staff)
        self.assertEqual(self.client.get(self.url).status_code, 200)

    def test_sidebar_links_to_dashboard(self):
        self.client.force_login(self.staff)
        response = self.client.get("/admin/")
        self.assertContains(response, 'href="/admin/learning/progress/"')

    def test_dashboard_renders_selected_learner_stats(self):
        self.client.force_login(self.staff)
        response = self.client.get(self.url, {"user": str(self.learner.pk)})
        self.assertEqual(response.status_code, 200)
        content = response.content.decode()
        self.assertIn("Cards read", content)
        self.assertIn("1 / 2 cards", content)      # unpublished lesson adds no cards
        self.assertIn("1 / 1 questions", content)  # one distinct question ever correct
        self.assertIn("0/1 lessons finished", content)

    def test_dashboard_defaults_to_current_user(self):
        self.client.force_login(self.staff)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        content = response.content.decode()
        self.assertIn("0 / 2 cards", content)
        self.assertIn("No activity yet", content)

    def test_user_switcher_lists_active_users(self):
        self.client.force_login(self.staff)
        response = self.client.get(self.url)
        content = response.content.decode()
        self.assertIn('name="user"', content)
        self.assertIn("learner", content)
        self.assertIn("other", content)

    def test_no_published_content_shows_empty_state(self):
        LearningPath.objects.all().update(published=False)
        self.client.force_login(self.staff)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("No published learning paths yet.", response.content.decode())
