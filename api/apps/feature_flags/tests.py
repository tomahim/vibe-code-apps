from unittest import mock

from django.contrib.auth import get_user_model
from django.db import DatabaseError
from django.test import Client, TestCase, override_settings

from apps.accounts.tokens import issue_token

from apps.learning.models import ChallengePlayer

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


@override_settings(AUTH_JWT_TTL_SECONDS=3600)
class ReleaseFlagGateTests(TestCase):
    """leaderboard_two_users and challenge_two_users hide their endpoints."""

    leaderboard_urls = ["/api/learning/leaderboard/", "/api/learning/leaderboard/badges/"]
    challenge_gets = ["/api/learning/challenge/", "/api/learning/challenge/history/"]
    challenge_post = "/api/learning/challenge/answers/"

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user("thomas", "thomas@example.com", "test-only-password")
        self.other = User.objects.create_user("other", "other@example.com", "test-only-password")
        # Seated as the two duel players, so only the flag decides the answer.
        ChallengePlayer.objects.create(user=self.user)
        ChallengePlayer.objects.create(user=self.other)

    def call(self, user, url, method="get"):
        headers = {"HTTP_AUTHORIZATION": f"Bearer {issue_token(user)}"}
        return getattr(Client(), method)(url, **headers)

    def statuses(self, user, post=True):
        # The answers write is only called while hidden: with the flag on, an
        # empty body reaches an unrelated existing error path in the view.
        return {
            "leaderboard": [self.call(user, url).status_code for url in self.leaderboard_urls],
            "challenge": [self.call(user, url).status_code for url in self.challenge_gets]
            + ([self.call(user, self.challenge_post, "post").status_code] if post else []),
        }

    def test_everything_is_hidden_when_the_flags_do_not_exist(self):
        self.assertEqual(self.statuses(self.user), {"leaderboard": [404, 404], "challenge": [404, 404, 404]})

    def test_flags_that_are_off_hide_the_endpoints(self):
        FeatureFlag.objects.create(key="leaderboard_two_users")
        FeatureFlag.objects.create(key="challenge_two_users")
        self.assertEqual(self.statuses(self.user), {"leaderboard": [404, 404], "challenge": [404, 404, 404]})

    def test_the_two_flags_are_independent(self):
        FeatureFlag.objects.create(key="leaderboard_two_users").users.add(self.user)
        result = self.statuses(self.user)
        self.assertEqual(result["leaderboard"], [200, 200])
        self.assertEqual(result["challenge"], [404, 404, 404])
        FeatureFlag.objects.all().delete()
        FeatureFlag.objects.create(key="challenge_two_users").users.add(self.user)
        result = self.statuses(self.user, post=False)
        self.assertEqual(result["leaderboard"], [404, 404])
        self.assertNotIn(404, result["challenge"])

    def test_a_flag_assigned_to_one_user_does_not_open_it_for_another(self):
        FeatureFlag.objects.create(key="leaderboard_two_users").users.add(self.user)
        self.assertEqual(self.statuses(self.other)["leaderboard"], [404, 404])

    def test_global_flag_opens_it_for_everyone(self):
        FeatureFlag.objects.create(key="leaderboard_two_users", enabled_for_everyone=True)
        self.assertEqual(self.statuses(self.other)["leaderboard"], [200, 200])

    def test_a_flag_lookup_error_hides_the_endpoint(self):
        FeatureFlag.objects.create(key="leaderboard_two_users", enabled_for_everyone=True)
        with mock.patch("apps.feature_flags.models.active_flag_keys", side_effect=DatabaseError("down")):
            self.assertEqual(self.statuses(self.user)["leaderboard"], [404, 404])

    def test_sign_in_is_still_required_first(self):
        FeatureFlag.objects.create(key="leaderboard_two_users", enabled_for_everyone=True)
        self.assertEqual(Client().get(self.leaderboard_urls[0]).status_code, 401)
