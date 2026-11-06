from unittest import mock

from django.contrib.auth import get_user_model
from django.db import DatabaseError
from django.test import Client, TestCase

from apps.accounts.tokens import issue_token

from . import stats

URL = "/api/apps/db-dashboard/overview"

PAYLOAD = {"database": {"name": "neondb", "size_bytes": 1000}, "tables": [], "indexes": [], "groups": [], "totals": {}}


def client_for(user):
    client = Client()
    client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(user)}"
    return client


class OverviewAccessTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.staff = User.objects.create_user("thomas", "t@example.com", "test-only-password", is_staff=True)
        self.member = User.objects.create_user("aurore", "a@example.com", "test-only-password")

    def test_requires_sign_in(self):
        self.assertEqual(Client().get(URL).status_code, 401)

    def test_rejects_non_staff(self):
        self.assertEqual(client_for(self.member).get(URL).status_code, 403)

    def test_post_not_allowed(self):
        self.assertEqual(client_for(self.staff).post(URL).status_code, 405)

    @mock.patch("apps.db_dashboard.views.connection")
    def test_non_postgres_is_explained_not_crashed(self, connection):
        connection.vendor = "sqlite"
        response = client_for(self.staff).get(URL)
        self.assertEqual(response.status_code, 503)
        self.assertIn("PostgreSQL", response.json()["error"])

    @mock.patch("apps.db_dashboard.views.connection")
    @mock.patch("apps.db_dashboard.views.stats.collect", return_value=dict(PAYLOAD))
    def test_staff_gets_payload_and_limit(self, collect, connection):
        connection.vendor = "postgresql"
        with self.settings(DB_STORAGE_LIMIT_BYTES=500_000_000):
            response = client_for(self.staff).get(URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["storage_limit_bytes"], 500_000_000)
        self.assertEqual(response["Cache-Control"].split(",")[0].strip(), "max-age=0")

    @mock.patch("apps.db_dashboard.views.connection")
    @mock.patch("apps.db_dashboard.views.stats.collect", return_value=dict(PAYLOAD))
    def test_limit_is_null_when_unset(self, collect, connection):
        connection.vendor = "postgresql"
        self.assertIsNone(client_for(self.staff).get(URL).json()["storage_limit_bytes"])

    @mock.patch("apps.db_dashboard.views.connection")
    @mock.patch("apps.db_dashboard.views.stats.collect", side_effect=DatabaseError("secret host"))
    def test_database_errors_do_not_leak(self, collect, connection):
        connection.vendor = "postgresql"
        response = client_for(self.staff).get(URL)
        self.assertEqual(response.status_code, 502)
        self.assertNotIn("secret", response.content.decode())


class StatsHelperTests(TestCase):
    def test_groups_use_the_model_registry(self):
        groups = stats.table_groups()
        self.assertEqual(groups["auth_user"], "Accounts")
        self.assertEqual(groups["django_session"], "Django core")

    def test_summarise_groups_orders_by_size(self):
        tables = [
            {"group": "A", "rows": 1, "total_bytes": 10},
            {"group": "B", "rows": 5, "total_bytes": 90},
            {"group": "A", "rows": 2, "total_bytes": 20},
        ]
        result = stats.summarise_groups(tables)
        self.assertEqual([g["name"] for g in result], ["B", "A"])
        self.assertEqual(result[1]["tables"], 2)
        self.assertEqual(result[1]["rows"], 3)
        self.assertEqual(result[1]["bytes"], 30)

    def test_summarise_groups_adds_composition(self):
        tables = [
            {"group": "A", "rows": 1, "total_bytes": 10, "table_bytes": 4, "index_bytes": 5, "toast_bytes": 1},
            {"group": "A", "rows": 1, "total_bytes": 20, "table_bytes": 10, "index_bytes": 6, "toast_bytes": 4},
        ]
        group = stats.summarise_groups(tables)[0]
        self.assertEqual((group["table_bytes"], group["index_bytes"], group["toast_bytes"]), (14, 11, 5))
