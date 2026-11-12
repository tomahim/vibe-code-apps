import json
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core import signing
from django.core.cache import cache
from django.db import IntegrityError, transaction
from django.test import Client, TestCase, override_settings
from google.auth.exceptions import TransportError

from .google import NONCE_COOKIE, NONCE_SALT
from .models import ExternalIdentity
from .tokens import decode_token


@override_settings(GOOGLE_SIGN_IN_ENABLED=True, GOOGLE_CLIENT_ID="client.apps.googleusercontent.com",
                   GOOGLE_ALLOWED_ORIGINS=["https://testserver"],
                   SECRET_KEY="test-only-unpublished-key", SECRET_KEY_REQUIRED=True)
class GoogleSignInTests(TestCase):
    config_url = "/api/auth/google/config"
    login_url = "/api/auth/google/login"

    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user("learner", "local@example.com", "test-password")
        self.client = Client(enforce_csrf_checks=True)
        self.config = self.client.get(self.config_url, secure=True).json()
        self.claims = {"sub": "google-stable-id", "email": "different@example.com",
                       "email_verified": True, "nonce": self.config["nonce"]}
        self.verify = patch("apps.accounts.google.verify_oauth2_token", return_value=self.claims).start()
        self.addCleanup(patch.stopall)

    def post(self, data=None, **kwargs):
        return self.client.post(self.login_url, json.dumps(data or {"credential": "signed-google-token"}),
                                content_type="application/json", secure=True,
                                HTTP_ORIGIN="https://testserver", HTTP_X_CSRFTOKEN=self.config["csrf_token"], **kwargs)

    def test_config_nonce_cookie_and_no_cache(self):
        self.assertTrue(self.config["enabled"])
        cookie = self.client.cookies[NONCE_COOKIE]
        self.assertTrue(cookie["httponly"])
        self.assertTrue(cookie["secure"])
        self.assertEqual(cookie["samesite"], "Strict")
        self.assertIn("no-store", self.client.get(self.config_url, secure=True)["Cache-Control"])

    def test_unknown_subject_does_not_link_or_create_by_email(self):
        self.claims["email"] = self.user.email
        response = self.post()
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["code"], "link_required")
        self.assertEqual(ExternalIdentity.objects.count(), 0)
        self.assertEqual(get_user_model().objects.count(), 1)

    def test_explicit_password_link_then_returning_signin(self):
        response = self.post({"credential": "signed-google-token", "link": True,
                              "email": self.user.email, "password": "test-password"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(decode_token(response.json()["token"])["sub"], str(self.user.pk))
        self.assertEqual(ExternalIdentity.objects.get().subject, self.claims["sub"])
        self.config = self.client.get(self.config_url, secure=True).json()
        self.claims["nonce"] = self.config["nonce"]
        self.assertEqual(self.post().status_code, 200)
        self.verify.assert_called_with("signed-google-token", self.verify.call_args.args[1], "client.apps.googleusercontent.com")

    def test_link_requires_correct_existing_password(self):
        response = self.post({"credential": "signed-google-token", "link": True,
                              "email": self.user.email, "password": "wrong"})
        self.assertEqual(response.status_code, 401)
        self.assertFalse(ExternalIdentity.objects.exists())

    def test_cannot_reassign_subject_or_replace_existing_link(self):
        other = get_user_model().objects.create_user("other", "other@example.com", "test-password")
        ExternalIdentity.objects.create(provider="google", subject=self.claims["sub"], user=other)
        self.assertEqual(self.post({"credential": "token", "link": True,
                                   "email": self.user.email, "password": "test-password"}).status_code, 409)
        self.assertEqual(ExternalIdentity.objects.get().user, other)
        ExternalIdentity.objects.all().delete()
        ExternalIdentity.objects.create(provider="google", subject="other-subject", user=self.user)
        self.assertEqual(self.post({"credential": "token", "link": True,
                                   "email": self.user.email, "password": "test-password"}).status_code, 409)
        self.assertEqual(ExternalIdentity.objects.get().subject, "other-subject")

    def test_inactive_user_cannot_login_or_link(self):
        ExternalIdentity.objects.create(provider="google", subject=self.claims["sub"], user=self.user)
        self.user.is_active = False
        self.user.save()
        self.assertEqual(self.post().status_code, 401)
        self.assertEqual(self.post({"credential": "token", "link": True,
                                   "email": self.user.email, "password": "test-password"}).status_code, 401)

    def test_invalid_signature_audience_expiry_or_issuer_fail(self):
        self.verify.side_effect = ValueError("invalid token")
        self.assertEqual(self.post().status_code, 401)
        self.assertFalse(ExternalIdentity.objects.exists())

    def test_verifier_outage_is_temporary_failure(self):
        self.verify.side_effect = TransportError("offline")
        self.assertEqual(self.post().status_code, 503)

    def test_nonce_unverified_email_and_malformed_subject_fail(self):
        for field, value in [("nonce", "different"), ("email_verified", False), ("sub", ""), ("sub", 123)]:
            with self.subTest(field=field):
                original = self.claims[field]
                self.claims[field] = value
                self.assertEqual(self.post().status_code, 401)
                self.claims[field] = original

    def test_missing_tampered_and_expired_nonce_fail(self):
        for nonce in ("", "tampered"):
            self.client.cookies[NONCE_COOKIE] = nonce
            self.assertEqual(self.post().status_code, 401)
        with patch("django.core.signing.time.time", return_value=1):
            old = signing.dumps("nonce", salt=NONCE_SALT)
        self.client.cookies[NONCE_COOKIE] = old
        self.assertEqual(self.post().status_code, 401)

    def test_csrf_and_cross_origin_rejected_before_verification(self):
        response = self.client.post(self.login_url, '{"credential":"token"}', content_type="application/json", secure=True)
        self.assertEqual(response.status_code, 403)
        response = self.client.post(self.login_url, '{"credential":"token"}', content_type="application/json", secure=True,
                                    HTTP_ORIGIN="https://evil.example", HTTP_X_CSRFTOKEN=self.config["csrf_token"])
        self.assertEqual(response.status_code, 403)
        self.verify.assert_not_called()

    def test_disabled_or_insecure_origin_does_not_expose_configuration(self):
        with override_settings(GOOGLE_SIGN_IN_ENABLED=False):
            self.assertEqual(self.client.get(self.config_url, secure=True).json(), {"enabled": False})
            self.assertEqual(self.post().status_code, 503)
        with override_settings(GOOGLE_ALLOWED_ORIGINS=["http://testserver"]):
            self.assertEqual(self.client.get(self.config_url).json(), {"enabled": False})
        with override_settings(GOOGLE_ALLOWED_ORIGINS=["http://localhost:5173"]):
            response = self.client.get(self.config_url, HTTP_HOST="localhost:5173")
            self.assertTrue(response.json()["enabled"])

    def test_unknown_origin_and_missing_client_id_fail_closed(self):
        for settings in ({"GOOGLE_ALLOWED_ORIGINS": []}, {"GOOGLE_CLIENT_ID": ""}):
            with override_settings(**settings):
                self.assertEqual(self.client.get(self.config_url, secure=True).json(), {"enabled": False})
                self.assertEqual(self.post().status_code, 503)

    def test_known_dev_key_cannot_create_link(self):
        with override_settings(SECRET_KEY="managed-in-railway"):
            self.assertEqual(self.client.get(self.config_url, secure=True).json(), {"enabled": False})
            self.assertEqual(self.post({"credential": "token", "link": True,
                                       "email": self.user.email, "password": "test-password"}).status_code, 503)
        self.assertFalse(ExternalIdentity.objects.exists())

    def test_rate_limit(self):
        with patch("apps.accounts.views.time.time", return_value=1_000_000_020):
            for _ in range(5):
                self.assertEqual(self.post().status_code, 403)
            self.assertEqual(self.post().status_code, 429)

    def test_no_feature_flags_or_profile_mutation(self):
        from apps.feature_flags.models import FeatureFlag
        flag = FeatureFlag.objects.create(key="private-feature")
        flag.users.add(self.user)
        response = self.post({"credential": "token", "link": True,
                              "email": self.user.email, "password": "test-password"})
        me = self.client.get("/api/auth/me", HTTP_AUTHORIZATION="Bearer " + response.json()["token"])
        self.assertEqual(me.json()["feature_flags"], ["private-feature"])
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, "local@example.com")

    def test_unique_constraints(self):
        ExternalIdentity.objects.create(provider="google", subject="one", user=self.user)
        with self.assertRaises(IntegrityError), transaction.atomic():
            ExternalIdentity.objects.create(provider="google", subject="two", user=self.user)


@override_settings(GOOGLE_SIGN_IN_ENABLED=True, GOOGLE_CLIENT_ID="client.apps.googleusercontent.com",
                   GOOGLE_ALLOWED_ORIGINS=["https://testserver"],
                   SECRET_KEY="test-only-unpublished-key-at-least-32-bytes", SECRET_KEY_REQUIRED=True)
class GoogleRealSignatureTests(TestCase):
    """Exercise google-auth's real verifier with local RSA keys, no network.

    Endpoint tests above mock Google's verified claims. These tests leave the
    verifier real and replace only certificate transport with our public key.
    """
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        from cryptography.hazmat.primitives.asymmetric import rsa
        from cryptography.hazmat.primitives import serialization
        cls.private = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        cls.public_pem = cls.private.public_key().public_bytes(
            serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo).decode()

    def setUp(self):
        import time
        cache.clear()
        self.client = Client(enforce_csrf_checks=True)
        self.config = self.client.get("/api/auth/google/config", secure=True).json()
        self.claims = {"sub": "stable-subject", "email_verified": True,
                       "nonce": self.config["nonce"], "aud": "client.apps.googleusercontent.com",
                       "iss": "https://accounts.google.com", "iat": int(time.time()),
                       "exp": int(time.time()) + 300}
        self.user = get_user_model().objects.create_user("signed-learner", "signed@example.com", "password")
        ExternalIdentity.objects.create(provider="google", subject="stable-subject", user=self.user)

    def post(self, claims=None, key=None):
        import jwt
        credential = jwt.encode(claims or self.claims, key or self.private, algorithm="RS256", headers={"kid": "local-test"})
        response = type("CertificateResponse", (), {
            "status": 200, "data": json.dumps({"local-test": self.public_pem}).encode()
        })()
        with patch("google.auth.transport.requests.Request.__call__", return_value=response):
            return self.client.post("/api/auth/google/login", json.dumps({"credential": credential}),
                                    content_type="application/json", secure=True,
                                    HTTP_ORIGIN="https://testserver", HTTP_X_CSRFTOKEN=self.config["csrf_token"])

    def test_correct_signature_is_accepted(self):
        self.assertEqual(self.post().status_code, 200)

    def test_wrong_audience_issuer_and_expired_tokens_are_rejected(self):
        for field, value in [("aud", "wrong-client"), ("iss", "https://evil.example"), ("exp", 1)]:
            with self.subTest(field=field):
                claims = {**self.claims, field: value}
                self.assertEqual(self.post(claims).status_code, 401)

    def test_wrong_signature_is_rejected(self):
        from cryptography.hazmat.primitives.asymmetric import rsa
        self.assertEqual(self.post(key=rsa.generate_private_key(public_exponent=65537, key_size=2048)).status_code, 401)
