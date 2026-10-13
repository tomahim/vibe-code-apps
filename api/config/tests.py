from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from django.test import Client, SimpleTestCase, TestCase

from .database import database_config


class DatabaseConfigTests(SimpleTestCase):
    url = "postgresql://owner:test-secret@ep-example-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

    def config(self, **env):
        return database_config(env, Path("/app"))

    def test_local_sqlite_fallback(self):
        self.assertEqual(self.config()["ENGINE"], "django.db.backends.sqlite3")

    def test_production_requires_database(self):
        for env in ({"DJANGO_REQUIRE_DATABASE_URL": "true"}, {"RAILWAY_ENVIRONMENT_ID": "production"}):
            with self.subTest(env=env), self.assertRaises(ImproperlyConfigured):
                self.config(**env)

    def test_neon_runtime_options(self):
        config = self.config(DATABASE_URL=self.url)
        self.assertIn("-pooler.", config["HOST"])
        self.assertEqual(config["OPTIONS"]["sslmode"], "require")
        self.assertEqual(config["OPTIONS"]["channel_binding"], "require")
        self.assertEqual(config["CONN_MAX_AGE"], 0)
        self.assertTrue(config["CONN_HEALTH_CHECKS"])
        self.assertTrue(config["DISABLE_SERVER_SIDE_CURSORS"])

    def test_direct_connection_preserves_credentials_and_tls(self):
        config = database_config({"DATABASE_URL": self.url}, Path("/app"), direct=True)
        self.assertEqual(config["HOST"], "ep-example.us-east-2.aws.neon.tech")
        self.assertEqual(config["PASSWORD"], "test-secret")
        self.assertEqual(config["OPTIONS"]["channel_binding"], "require")

    def test_explicit_direct_override(self):
        config = database_config({"DATABASE_URL": self.url, "DATABASE_URL_UNPOOLED": "postgres://owner:secret@direct.example/db"}, Path("/app"), direct=True)
        self.assertEqual(config["HOST"], "direct.example")
        self.assertEqual(config["OPTIONS"]["sslmode"], "require")

    def test_invalid_urls_do_not_leak_credentials(self):
        for url in ("sqlite:///db.sqlite3", "postgres://owner:test-secret@host:bad/db", "postgres:///db"):
            with self.subTest(url=url), self.assertRaises(ImproperlyConfigured) as error:
                self.config(DATABASE_URL=url)
            self.assertNotIn("test-secret", str(error.exception))

    def test_production_rejects_optional_tls(self):
        with self.assertRaises(ImproperlyConfigured):
            self.config(DATABASE_URL="postgres://owner:secret@host/db?sslmode=prefer", DJANGO_REQUIRE_DATABASE_URL="true")


class AdminUserManagementTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.admin = get_user_model().objects.create_superuser("test-admin", "admin@example.com", "test-only-password")
        cls.user = get_user_model().objects.create_user("regular", password="test-only-password")

    def test_admin_login_with_railway_https_forwarding_and_csrf(self):
        client = Client(enforce_csrf_checks=True)
        headers = {"HTTP_HOST": "catalog.example.com", "HTTP_X_FORWARDED_PROTO": "https"}
        response = client.get("/admin/login/", **headers)
        self.assertEqual(response.status_code, 200)
        response = client.post("/admin/login/", {
            "username": "test-admin", "password": "test-only-password",
            "csrfmiddlewaretoken": client.cookies["csrftoken"].value, "next": "/admin/",
        }, HTTP_ORIGIN="https://catalog.example.com", **headers)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(client.get("/admin/auth/user/", **headers).status_code, 200)
        self.assertEqual(client.get("/admin/auth/group/", **headers).status_code, 200)

    def test_superuser_can_add_user_in_admin(self):
        self.client.force_login(self.admin)
        response = self.client.post("/admin/auth/user/add/", {
            "username": "new-user", "password1": "test-only-password",
            "password2": "test-only-password", "usable_password": "true", "_save": "Save",
        })
        self.assertEqual(response.status_code, 302)
        user = get_user_model().objects.get(username="new-user")
        self.assertTrue(user.check_password("test-only-password"))
        self.assertFalse(user.is_superuser)

    def test_regular_user_cannot_access_admin(self):
        self.client.force_login(self.user)
        self.assertEqual(self.client.get("/admin/auth/user/").status_code, 302)

    def test_catalog_api_remains_public(self):
        self.assertEqual(self.client.get("/api/apps/").status_code, 200)
