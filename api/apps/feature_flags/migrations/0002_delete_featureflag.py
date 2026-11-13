"""Drop the feature-flag tables, guarded so only the intended database runs it.

Feature flags are retired from vibe-code-apps: the flag checks gated Little
Grains endpoints, which left with the learning runtime, and nothing else
reads the flags. The app stays installed as an empty shell so the
migration history (0001 creates, 0002 deletes) replays cleanly on every
database instead of orphaning recorded state.

The drop is opt-in and fail-closed: on PostgreSQL it runs only when
FEATURE_FLAGS_CLEANUP_CONFIRM=drop-feature-flag-tables is set and the connected
server proves to be the expected database (Neon identity read from the server
itself, or the explicit expected host on a non-Neon scratch database). Any
mismatch raises before a single statement runs. SQLite test databases skip the
guard.
"""

import os

from django.db import migrations

CONFIRM_ENV = "FEATURE_FLAGS_CLEANUP_CONFIRM"
CONFIRM_VALUE = "drop-feature-flag-tables"
EXPECT_PROJECT_ENV = "FEATURE_FLAGS_CLEANUP_EXPECT_PROJECT_ID"
EXPECT_ENDPOINT_ENV = "FEATURE_FLAGS_CLEANUP_EXPECT_ENDPOINT_ID"
EXPECT_HOST_ENV = "FEATURE_FLAGS_CLEANUP_EXPECT_HOST"

# Child before parent so RESTRICT never trips on the intra-app FK.
FEATURE_FLAG_TABLES = [
    "feature_flag_users",  # -> feature_flag, auth_user
    "feature_flag",
]


class FeatureFlagsCleanupNotConfirmed(RuntimeError):
    pass


class FeatureFlagsCleanupWrongTarget(RuntimeError):
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
            raise FeatureFlagsCleanupWrongTarget(
                f"Refusing to drop the feature-flag tables: the connected "
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
        raise FeatureFlagsCleanupWrongTarget(
            f"Refusing to drop the feature-flag tables: this non-Neon "
            f"connection targets {endpoint_id(actual_host) or '<no host>'}, "
            f"but {EXPECT_HOST_ENV} names {endpoint_id(expected_host) or '<unset>'}. "
            f"No table was touched."
        )


def drop_feature_flag_tables(apps, schema_editor):
    if schema_editor.connection.vendor == "sqlite":
        suffix = ""
    else:
        if os.environ.get(CONFIRM_ENV) != CONFIRM_VALUE:
            raise FeatureFlagsCleanupNotConfirmed(
                f"Refusing to drop the feature-flag tables: set "
                f"{CONFIRM_ENV}={CONFIRM_VALUE} in this service's environment "
                f"to opt in. No table was touched."
            )
        check_target_identity(schema_editor)
        suffix = " RESTRICT"
    for table in FEATURE_FLAG_TABLES:
        schema_editor.execute(f"DROP TABLE IF EXISTS {table}{suffix}")


class Migration(migrations.Migration):

    dependencies = [
        ("feature_flags", "0001_initial"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunPython(
                    drop_feature_flag_tables, reverse_code=migrations.RunPython.noop
                ),
            ],
            state_operations=[
                migrations.DeleteModel(name="FeatureFlag"),
            ],
        ),
    ]
