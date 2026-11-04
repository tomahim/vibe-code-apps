"""Isolated model validation without loading unrelated apps/services.

Production uses config.settings. PostgreSQL CI should use the full application
suite; this module also allows focused verification when optional UI dependencies
cannot be installed locally.
"""
import os
import dj_database_url

SECRET_KEY = "isolated-curator-model-tests-only"
INSTALLED_APPS = ["django.contrib.auth", "django.contrib.contenttypes", "apps.curator.apps.CuratorConfig"]
DATABASES = {"default": dj_database_url.parse(os.environ.get("CURATOR_TEST_DATABASE_URL", "sqlite:///:memory:"))}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
USE_TZ = True
TIME_ZONE = "Europe/Paris"

SECRET_KEY_REQUIRED = False
