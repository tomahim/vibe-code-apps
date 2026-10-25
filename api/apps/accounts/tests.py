import time
from unittest import mock

import jwt as pyjwt
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import Client, TestCase, override_settings

from .tokens import decode_token, issue_token


class TokenTests(TestCase):
    def test_roundtrip_and_expiry(self):
        user = get_user_model().objects.create_user("thomas", "thomas@example.com", "test-only-password")
        payload = decode_token(issue_token(user))
        self.assertEqual(payload["sub"], str(user.pk))
        self.assertEqual(payload["email"], "thomas@example.com")
        self.assertGreater(payload["exp"], payload["iat"])

    def test_rejects_tampered_and_expired_tokens(self):
        user = get_user_model().objects.create_user("thomas", "thomas@example.com", "test-only-password")
        token = issue_token(user)
        with self.assertRaises(pyjwt.PyJWTError):
            decode_token(token[:-2] + ("aa" if not token.endswith("aa") else "bb"))
        with override_settings(AUTH_JWT_TTL_SECONDS=-10):
            with self.assertRaises(pyjwt.PyJWTError):
                decode_token(issue_token(user))


@override_settings(AUTH_JWT_TTL_SECONDS=3600)
class LoginEndpointTests(TestCase):
    url = "/api/auth/login"

    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user("thomas", "thomas@example.com", "test-only-password")

    def post(self, body, **extra):
        return Client().post(self.url, body, content_type="application/json", **extra)

    def test_success_returns_usable_token(self):
        self.user.first_name = "Thomas"
        self.user.last_name = "Bolt"
        self.user.save()
        response = self.post('{"email": "thomas@example.com", "password": "test-only-password"}')
        self.assertEqual(response.status_code, 200)
        payload = decode_token(response.json()["token"])
        self.assertEqual(payload["sub"], str(self.user.pk))
        self.assertEqual(
            response.json()["user"],
            {"email": "thomas@example.com", "first_name": "Thomas", "last_name": "Bolt"},
        )

    def test_email_is_case_insensitive_and_username_works(self):
        for identifier in ("Thomas@Example.com", "thomas"):
            response = self.post('{"email": "%s", "password": "test-only-password"}' % identifier)
            self.assertEqual(response.status_code, 200, identifier)

    def test_rejects_bad_credentials_and_input(self):
        self.assertEqual(self.post('{"email": "thomas@example.com", "password": "wrong-password"}').status_code, 401)
        self.assertEqual(self.post('{"email": "ghost@example.com", "password": "test-only-password"}').status_code, 401)
        self.assertEqual(self.post('{"email": "thomas@example.com"}').status_code, 400)
        self.assertEqual(self.post('{"email": 3, "password": "test-only-password"}').status_code, 400)
        self.assertEqual(self.post("not json").status_code, 400)
        self.assertEqual(Client().post(self.url, "x", content_type="text/plain").status_code, 415)
        self.assertEqual(Client().get(self.url).status_code, 405)

    def test_rejects_cross_origin(self):
        response = Client().post(
            self.url, '{"email": "a@b.c", "password": "x"}',
            content_type="application/json", HTTP_ORIGIN="https://evil.example.com",
        )
        self.assertEqual(response.status_code, 403)

    def test_rate_limits_repeated_attempts(self):
        for _ in range(5):
            self.post('{"email": "thomas@example.com", "password": "wrong-password"}')
        response = self.post('{"email": "thomas@example.com", "password": "test-only-password"}')
        self.assertEqual(response.status_code, 429)


from config.settings import LOCAL_DEV_SECRET_KEY


@override_settings(SECRET_KEY=LOCAL_DEV_SECRET_KEY, SECRET_KEY_REQUIRED=True, AUTH_JWT_TTL_SECONDS=3600)
class ProductionSecretRefusalTests(TestCase):
    """On the public dev key in production, nothing may be issued or accepted."""

    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user("thomas", "thomas@example.com", "test-only-password")

    def test_login_refuses_to_issue(self):
        response = Client().post(
            "/api/auth/login", '{"email": "thomas@example.com", "password": "test-only-password"}',
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 503)
        self.assertNotIn("token", response.json())

    def test_protected_endpoint_refuses_to_verify(self):
        # Even a structurally valid token signed with the dev key is refused.
        forged = pyjwt.encode(
            {"sub": str(self.user.pk), "iat": int(time.time()), "exp": int(time.time()) + 600},
            LOCAL_DEV_SECRET_KEY, algorithm="HS256",
        )
        response = Client().get("/api/apps/little-grains/lessons", HTTP_AUTHORIZATION=f"Bearer {forged}")
        self.assertEqual(response.status_code, 503)

    def test_system_check_errors(self):
        from .apps import secret_key_guard

        errors = secret_key_guard(None)
        self.assertEqual([error.id for error in errors], ["accounts.E001"])


@override_settings(SECRET_KEY="test-only-signing-key", SECRET_KEY_REQUIRED=True, AUTH_JWT_TTL_SECONDS=3600)
class ProductionConfiguredTests(TestCase):
    """With a real secret configured, production behavior is normal."""

    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user("thomas", "thomas@example.com", "test-only-password")

    def test_login_and_lessons_work(self):
        response = Client().post(
            "/api/auth/login", '{"email": "thomas@example.com", "password": "test-only-password"}',
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        token = response.json()["token"]
        self.assertEqual(Client().get("/api/apps/little-grains/lessons", HTTP_AUTHORIZATION=f"Bearer {token}").status_code, 200)

    def test_system_check_is_silent(self):
        from .apps import secret_key_guard

        self.assertEqual(secret_key_guard(None), [])


class StartupCheckTests(TestCase):
    def test_railway_deploy_with_default_key_fails_check(self):
        from django.core.management import call_command
        from django.core.management.base import SystemCheckError

        with override_settings(SECRET_KEY=LOCAL_DEV_SECRET_KEY, SECRET_KEY_REQUIRED=True):
            with self.assertRaises(SystemCheckError):
                call_command("check")


@override_settings(SECRET_KEY="managed-in-railway", SECRET_KEY_REQUIRED=True, AUTH_JWT_TTL_SECONDS=3600)
class TerraformPlaceholderRefusalTests(TestCase):
    """The public Terraform placeholder is as forgeable as the dev default."""

    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user("thomas", "thomas@example.com", "test-only-password")

    def test_login_and_verify_refuse_and_check_errors(self):
        response = Client().post(
            "/api/auth/login", '{"email": "thomas@example.com", "password": "test-only-password"}',
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 503)
        forged = pyjwt.encode(
            {"sub": str(self.user.pk), "iat": int(time.time()), "exp": int(time.time()) + 600},
            "managed-in-railway", algorithm="HS256",
        )
        self.assertEqual(
            Client().get("/api/apps/little-grains/lessons", HTTP_AUTHORIZATION=f"Bearer {forged}").status_code, 503,
        )
        from .apps import secret_key_guard

        self.assertEqual([error.id for error in secret_key_guard(None)], ["accounts.E001"])
