from unittest import mock

from django.contrib.auth import get_user_model
from django.db import DatabaseError
from django.test import Client, TestCase, override_settings

from apps.accounts.tokens import issue_token

from .models import FeatureFlag


@override_settings(AUTH_JWT_TTL_SECONDS=3600)
class MeEndpointTests(TestCase):
    url = "/api/auth/me"

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user("thomas", "thomas@example.com", "test-only-password")
        self.other = User.objects.create_user("other", "other@example.com", "test-only-password")

    def get(self, user=None):
        headers = {"HTTP_AUTHORIZATION": f"Bearer {issue_token(user)}"} if user else {}
        return Client().get(self.url, **headers)

    def test_requires_sign_in(self):
        self.assertEqual(self.get().status_code, 401)

    def test_returns_user_and_no_flags_by_default(self):
        FeatureFlag.objects.create(key="hidden")
        body = self.get(self.user).json()
        self.assertEqual(body["user"]["email"], "thomas@example.com")
        self.assertEqual(body["feature_flags"], [])

    def test_global_and_assigned_flags(self):
        FeatureFlag.objects.create(key="everyone", enabled_for_everyone=True)
        FeatureFlag.objects.create(key="beta").users.add(self.user)
        FeatureFlag.objects.create(key="other-only").users.add(self.other)
        self.assertEqual(self.get(self.user).json()["feature_flags"], ["beta", "everyone"])
        self.assertEqual(self.get(self.other).json()["feature_flags"], ["everyone", "other-only"])

    def test_flag_global_and_assigned_is_listed_once(self):
        FeatureFlag.objects.create(key="both", enabled_for_everyone=True).users.add(self.user)
        self.assertEqual(self.get(self.user).json()["feature_flags"], ["both"])

    def test_post_not_allowed(self):
        response = Client().post(self.url, HTTP_AUTHORIZATION=f"Bearer {issue_token(self.user)}")
        self.assertEqual(response.status_code, 405)
