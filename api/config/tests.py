from pathlib import Path

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.staticfiles.storage import staticfiles_storage
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

    def test_unfold_styles_all_user_management_screens(self):
        self.client.force_login(self.admin)
        group = Group.objects.create(name="Editors")
        for path in (
            "/admin/", "/admin/auth/user/", "/admin/auth/group/",
            "/admin/auth/user/add/", "/admin/auth/group/add/",
            f"/admin/auth/user/{self.user.pk}/change/",
            f"/admin/auth/user/{self.user.pk}/password/",
            f"/admin/auth/group/{group.pk}/change/", "/admin/password_change/",
        ):
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertContains(response, staticfiles_storage.url("unfold/css/styles.css"))
                self.assertContains(response, "Vibe Code Apps")
                self.assertTemplateUsed(response, "unfold/layouts/skeleton.html")

    def test_login_theme_assets_are_served_by_whitenoise(self):
        response = self.client.get("/admin/login/")
        for path, content_type in (
            ("unfold/css/styles.css", "text/css"),
            ("unfold/fonts/inter/styles.css", "text/css"),
            ("unfold/fonts/material-symbols/styles.css", "text/css"),
            ("unfold/js/app.js", "javascript"),
        ):
            with self.subTest(path=path):
                url = staticfiles_storage.url(path)
                self.assertContains(response, url)
                asset = self.client.get(url)
                self.assertEqual(asset.status_code, 200)
                self.assertIn(content_type, asset["Content-Type"])
                # Let the test client's streaming wrapper handle cleanup;
                # closing directly emits request_finished inside the test transaction.
                self.assertTrue(b"".join(asset.streaming_content))

    def test_superuser_can_edit_user_and_change_password(self):
        self.client.force_login(self.admin)
        response = self.client.post(f"/admin/auth/user/{self.user.pk}/change/", {
            "username": "regular", "email": "updated@example.com", "is_active": "on",
            "date_joined_0": "2026-01-01", "date_joined_1": "12:00:00", "_save": "Save",
        })
        self.assertEqual(response.status_code, 302)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, "updated@example.com")
        self.assertTrue(self.user.check_password("test-only-password"))
        response = self.client.post(f"/admin/auth/user/{self.user.pk}/password/", {
            "password1": "changed-test-password", "password2": "changed-test-password",
            "usable_password": "true",
        })
        self.assertEqual(response.status_code, 302)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("changed-test-password"))

    def test_group_management_and_staff_permissions_are_preserved(self):
        self.client.force_login(self.admin)
        permission = Permission.objects.get(content_type__app_label="auth", codename="view_user")
        response = self.client.post("/admin/auth/group/add/", {
            "name": "User viewers", "permissions": [permission.pk], "_save": "Save",
        })
        self.assertEqual(response.status_code, 302)
        group = Group.objects.get(name="User viewers")
        self.assertTrue(group.permissions.filter(pk=permission.pk).exists())
        self.user.is_staff = True
        self.user.save()
        self.client.force_login(self.user)
        self.assertEqual(self.client.get("/admin/auth/user/").status_code, 403)
        self.user.groups.add(group)
        self.assertEqual(self.client.get("/admin/auth/user/").status_code, 200)
        self.assertEqual(self.client.get("/admin/auth/user/add/").status_code, 403)
        self.assertEqual(self.client.get("/admin/auth/group/").status_code, 403)
