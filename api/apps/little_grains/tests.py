import time

import jwt as pyjwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import Client, TestCase, override_settings

from apps.accounts.tokens import issue_token


@override_settings(AUTH_JWT_TTL_SECONDS=3600)
class LessonsEndpointTests(TestCase):
    url = "/api/apps/little-grains/lessons"

    def setUp(self):
        self.user = get_user_model().objects.create_user("thomas", "thomas@example.com", "test-only-password")

    def get(self, token=None):
        headers = {"HTTP_AUTHORIZATION": f"Bearer {token}"} if token else {}
        return Client().get(self.url, **headers)

    def test_requires_a_token(self):
        self.assertEqual(self.get().status_code, 401)
        self.assertEqual(Client().get(self.url, HTTP_AUTHORIZATION="Basic abc").status_code, 401)

    def test_returns_lesson_titles_with_a_valid_token(self):
        response = self.get(issue_token(self.user))
        self.assertEqual(response.status_code, 200)
        lessons = response.json()["lessons"]
        self.assertGreaterEqual(len(lessons), 3)
        self.assertTrue(all(set(lesson) == {"id", "title"} for lesson in lessons))

    def test_rejects_tampered_expired_and_unknown_user_tokens(self):
        token = issue_token(self.user)
        self.assertEqual(self.get(token[:-2] + "aa").status_code, 401)
        expired = pyjwt.encode(
            {"sub": str(self.user.pk), "iat": int(time.time()) - 7200, "exp": int(time.time()) - 3600},
            settings.SECRET_KEY, algorithm="HS256",
        )
        self.assertEqual(self.get(expired).status_code, 401)
        ghost = get_user_model().objects.create_user("ghost", "ghost@example.com", "test-only-password")
        ghost_token = issue_token(ghost)
        ghost.delete()
        self.assertEqual(self.get(ghost_token).status_code, 401)
