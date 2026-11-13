"""Guard tests: the drop must fail closed on any real database connection."""

import importlib
from unittest import mock

from django.test import SimpleTestCase

migration = importlib.import_module(
    "apps.feature_flags.migrations.0002_delete_featureflag"
)

FREE_PROJECT = "frosty-moon-05702800"
FREE_ENDPOINT = "ep-fragrant-sea-zafai3y3"
PAID_PROJECT = "wispy-unit-75400790"
PAID_ENDPOINT = "ep-holy-hall-b5rgosv4"


class FakeCursor:
    def __init__(self, identity):
        self.identity = identity

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def execute(self, sql):
        self.last_sql = sql

    def fetchone(self):
        return self.identity


class FakeEditor:
    def __init__(self, vendor, host, identity):
        self.connection = mock.Mock(
            vendor=vendor,
            settings_dict={"HOST": host},
        )
        self.connection.cursor.return_value = FakeCursor(identity)
        self.executed = []

    def execute(self, sql):
        self.executed.append(sql)


def free_editor():
    return FakeEditor(
        "postgresql",
        f"{FREE_ENDPOINT}-pooler.c-2.eu-west-2.aws.neon.tech",
        (FREE_PROJECT, FREE_ENDPOINT),
    )


def env(**overrides):
    base = {
        migration.CONFIRM_ENV: migration.CONFIRM_VALUE,
        migration.EXPECT_PROJECT_ENV: FREE_PROJECT,
        migration.EXPECT_ENDPOINT_ENV: FREE_ENDPOINT,
    }
    base.update(overrides)
    return mock.patch.dict("os.environ", base, clear=True)


class DropGuardTests(SimpleTestCase):
    def test_postgres_without_confirmation_refuses_and_touches_nothing(self):
        editor = free_editor()
        with env(**{migration.CONFIRM_ENV: ""}):
            with self.assertRaises(migration.FeatureFlagsCleanupNotConfirmed):
                migration.drop_feature_flag_tables(None, editor)
        self.assertEqual(editor.executed, [])

    def test_neon_identity_from_server_matching_expectations_proceeds(self):
        editor = free_editor()
        with env():
            migration.drop_feature_flag_tables(None, editor)
        self.assertEqual(len(editor.executed), len(migration.FEATURE_FLAG_TABLES))
        for sql, table in zip(editor.executed, migration.FEATURE_FLAG_TABLES):
            self.assertEqual(sql, f"DROP TABLE IF EXISTS {table} RESTRICT")

    def test_paid_server_identity_refuses_even_with_matching_host_config(self):
        # The server itself reports the paid project/endpoint; configured host
        # alone must not be trusted.
        editor = FakeEditor(
            "postgresql",
            f"{FREE_ENDPOINT}-pooler.c-2.eu-west-2.aws.neon.tech",  # config lies
            (PAID_PROJECT, PAID_ENDPOINT),  # server tells the truth
        )
        with env():
            with self.assertRaises(migration.FeatureFlagsCleanupWrongTarget):
                migration.drop_feature_flag_tables(None, editor)
        self.assertEqual(editor.executed, [])

    def test_missing_expected_identity_refuses(self):
        editor = free_editor()
        for cleared in (migration.EXPECT_PROJECT_ENV, migration.EXPECT_ENDPOINT_ENV):
            with env(**{cleared: ""}):
                with self.assertRaises(migration.FeatureFlagsCleanupWrongTarget):
                    migration.drop_feature_flag_tables(None, editor)
            self.assertEqual(editor.executed, [])

    def test_non_neon_falls_back_to_explicit_host_match(self):
        editor = FakeEditor("postgresql", "localhost", ("", ""))
        with env(**{migration.EXPECT_HOST_ENV: "localhost"}):
            migration.drop_feature_flag_tables(None, editor)
        self.assertEqual(len(editor.executed), len(migration.FEATURE_FLAG_TABLES))

    def test_non_neon_without_expected_host_refuses(self):
        editor = FakeEditor("postgresql", "localhost", ("", ""))
        with env():
            with self.assertRaises(migration.FeatureFlagsCleanupWrongTarget):
                migration.drop_feature_flag_tables(None, editor)
        self.assertEqual(editor.executed, [])

    def test_child_drops_before_parent(self):
        order = migration.FEATURE_FLAG_TABLES
        self.assertLess(order.index("feature_flag_users"), order.index("feature_flag"))
