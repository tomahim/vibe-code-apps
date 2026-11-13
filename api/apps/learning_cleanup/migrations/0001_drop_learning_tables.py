"""Drop the orphaned Little Grains learning tables from this database.

The experimentation API no longer installs apps.learning: Cultive (repo
tomahim/cultive) owns the learning runtime, its lg_* tables on the paid
Cultive database, the atomic-lessons content library and the content
publisher (cultive#35). This app is installed only in the experimentation
runtime settings (config.settings).

Settings separation alone is NOT the safety guarantee: a service's
DATABASE_URL can be pointed at the wrong database (it already happened once
during this split). So on a real database this migration FAILS CLOSED. Before
any destructive SQL it requires:

1. LEARNING_CLEANUP_CONFIRM=drop-lg-tables - the explicit operator opt-in; and
2. proof of the connected server's identity, queried from the live connection
   (read-only): on Neon, current_setting('neon.project_id') and
   current_setting('neon.endpoint_id') must exactly match
   LEARNING_CLEANUP_EXPECT_PROJECT_ID and LEARNING_CLEANUP_EXPECT_ENDPOINT_ID
   from the service environment. The verified experimentation (Free) identity
   is project frosty-moon-05702800 / endpoint ep-fragrant-sea-zafai3y3; the
   paid Cultive database reports wispy-unit-75400790 / ep-holy-hall-b5rgosv4
   and is refused. On a non-Neon server (CI's scratch PostgreSQL), where those
   settings are empty, LEARNING_CLEANUP_EXPECT_HOST must match the connected
   host instead - still an explicit operator-set value, never a silent bypass.

Any missing or mismatched value raises before any SQL runs, so the deploy's
migrate step fails, the migration is never recorded as applied, and no table
is touched. SQLite (tests, local dev) is exempt; production requires
PostgreSQL by config (see config/database.py), so the exemption cannot
silently bypass a real service.

Drops use IF EXISTS and RESTRICT, children before parents, no CASCADE. The
lg_* foreign keys to auth_user point outward only, so shared accounts data is
untouched. If anything outside this list still references one of these tables,
RESTRICT makes the deploy fail loudly instead of dropping shared data.

There is no reverse: rolling back means restoring a backup, not unapplying.
"""

import os

from django.db import migrations

CONFIRM_ENV = "LEARNING_CLEANUP_CONFIRM"
CONFIRM_VALUE = "drop-lg-tables"
EXPECT_PROJECT_ENV = "LEARNING_CLEANUP_EXPECT_PROJECT_ID"
EXPECT_ENDPOINT_ENV = "LEARNING_CLEANUP_EXPECT_ENDPOINT_ID"
EXPECT_HOST_ENV = "LEARNING_CLEANUP_EXPECT_HOST"

# Children before parents so RESTRICT never trips on intra-learning FKs.
LEARNING_TABLES = [
    "lg_question_attempt",  # -> lg_question, lg_challenge_week, auth_user
    "lg_card_progress",  # -> lg_card, auth_user
    "lg_lesson_open",  # -> lg_lesson, auth_user
    "lg_path_celebration",  # -> lg_learning_path, auth_user
    "lg_badge_award",  # -> auth_user
    "lg_challenge_player",
    "lg_challenge_week",
    "lg_sync_log",
    "lg_question",  # -> lg_lesson
    "lg_card",  # -> lg_lesson
    "lg_lesson",  # -> lg_learning_path
    "lg_learning_path",  # -> lg_theme
    "lg_theme",
    "lg_content_entity",
]


class LearningCleanupNotConfirmed(RuntimeError):
    pass


class LearningCleanupWrongTarget(RuntimeError):
    pass


def server_identity(schema_editor):
    """Read-only Neon identity of the connected server: (project_id, endpoint_id).

    Both empty on a non-Neon PostgreSQL.
    """
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(
            "SELECT current_setting('neon.project_id', true), "
            "current_setting('neon.endpoint_id', true)"
        )
        project_id, endpoint_id = cursor.fetchone()
    return (project_id or "").strip(), (endpoint_id or "").strip()


def endpoint_id(host):
    """Stable Neon endpoint identity: first host label, minus -pooler."""
    return (host or "").strip().split(".")[0].removesuffix("-pooler").lower()


def same_database_host(actual, expected):
    actual, expected = (actual or "").strip(), (expected or "").strip()
    if not actual or not expected:
        return False
    if actual.lower() == expected.lower():
        return True
    return endpoint_id(actual) == endpoint_id(expected)


def check_target_identity(schema_editor):
    """Raise unless the connected server proves to be the expected database."""
    project_id, endpoint = server_identity(schema_editor)
    if project_id or endpoint:
        # Neon server: identity comes from the server itself, not from config.
        expected_project = os.environ.get(EXPECT_PROJECT_ENV, "").strip()
        expected_endpoint = os.environ.get(EXPECT_ENDPOINT_ENV, "").strip()
        if (
            not expected_project
            or not expected_endpoint
            or project_id != expected_project
            or endpoint != expected_endpoint
        ):
            raise LearningCleanupWrongTarget(
                f"Refusing to drop the lg_* learning tables: the connected "
                f"server reports Neon project {project_id or '?'} / endpoint "
                f"{endpoint or '?'}, but {EXPECT_PROJECT_ENV} / "
                f"{EXPECT_ENDPOINT_ENV} name {expected_project or '<unset>'} / "
                f"{expected_endpoint or '<unset>'}. Set them to the verified "
                f"experimentation database identity. No table was touched."
            )
        return
    # Non-Neon PostgreSQL (CI scratch): fall back to the explicit host check.
    expected_host = os.environ.get(EXPECT_HOST_ENV, "")
    actual_host = schema_editor.connection.settings_dict.get("HOST")
    if not same_database_host(actual_host, expected_host):
        raise LearningCleanupWrongTarget(
            f"Refusing to drop the lg_* learning tables: this non-Neon "
            f"connection targets {endpoint_id(actual_host) or '<no host>'}, "
            f"but {EXPECT_HOST_ENV} names {endpoint_id(expected_host) or '<unset>'}. "
            f"No table was touched."
        )


def drop_learning_tables(apps, schema_editor):
    if schema_editor.connection.vendor == "sqlite":
        suffix = ""
    else:
        if os.environ.get(CONFIRM_ENV) != CONFIRM_VALUE:
            raise LearningCleanupNotConfirmed(
                f"Refusing to drop the lg_* learning tables: set "
                f"{CONFIRM_ENV}={CONFIRM_VALUE} in this service's environment "
                f"to opt in. No table was touched."
            )
        check_target_identity(schema_editor)
        suffix = " RESTRICT"
    for table in LEARNING_TABLES:
        schema_editor.execute(f"DROP TABLE IF EXISTS {table}{suffix}")


class Migration(migrations.Migration):

    dependencies = []

    operations = [
        migrations.RunPython(drop_learning_tables, reverse_code=migrations.RunPython.noop),
    ]
