import os
from pathlib import Path

from .database import database_config
from .media import build_storages

BASE_DIR = Path(__file__).resolve().parent.parent
# Local development only; production must set DJANGO_SECRET_KEY (see below).
LOCAL_DEV_SECRET_KEY = "local-development-only-change-me"
# Values that are public knowledge and therefore forgeable: the dev default and
# the Terraform placeholder that lives in this repo (infra/terraform/main.tf).
INSECURE_SECRET_KEYS = {LOCAL_DEV_SECRET_KEY, "managed-in-railway"}
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", LOCAL_DEV_SECRET_KEY)
# Like DATABASE_URL (config/database.py), a real secret is required in production:
# the JWT endpoints refuse to issue or verify tokens signed with the dev default.
SECRET_KEY_REQUIRED = os.environ.get("DJANGO_REQUIRE_SECRET_KEY", "false").lower() in {"true", "1"} or bool(
    os.environ.get("RAILWAY_ENVIRONMENT_ID")
)
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"
ALLOWED_HOSTS = [host for host in os.environ.get("DJANGO_ALLOWED_HOSTS", "*").split(",") if host]

INSTALLED_APPS = [
    "unfold",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "apps.admin_ui",
    "apps.accounts",
    "apps.little_grains",
    "apps.content_review",
    "apps.learning.apps.LearningConfig",
    "apps.livetrail_scrap",
    "apps.recipes",
    "apps.rust_learning_path",
]

UNFOLD = {
    "SITE_TITLE": "Vibe Code Apps admin",
    "SITE_HEADER": "Vibe Code Apps",
    "SITE_SUBHEADER": "User management",
    "SITE_URL": "/",
}
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]
ROOT_URLCONF = "config.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {"default": database_config(os.environ, BASE_DIR)}
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "api-cache",
        "TIMEOUT": 3600,
    }
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
# Shared media storage: S3 compatible bucket when AWS_STORAGE_BUCKET_NAME is
# set, local disk otherwise. See config/media.py and docs/object-storage.md.
STORAGES = build_storages(os.environ)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
MEDIA_UPLOAD_MAX_BYTES = int(os.environ.get("MEDIA_UPLOAD_MAX_BYTES", str(5 * 1024 * 1024)))
# Let uploads up to the limit be parsed in memory; larger ones are rejected by
# the validator before anything is written to storage.
FILE_UPLOAD_MAX_MEMORY_SIZE = MEDIA_UPLOAD_MAX_BYTES
DATA_UPLOAD_MAX_MEMORY_SIZE = MEDIA_UPLOAD_MAX_BYTES + 1024 * 1024
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Public canonical content repository. Images are proxied by the API from the
# latest successful SyncLog commit; clients never need to access GitHub.
LEARNING_CONTENT_REPOSITORY = os.environ.get("LEARNING_CONTENT_REPOSITORY", "tomahim/vibe-code-apps")

# Empty means recipe writes are disabled; separate from the Telegram bot token.
BOT_API_SECRET = os.environ.get("BOT_API_SECRET", "")

# JWT access tokens (see apps/accounts): signed with SECRET_KEY, default 7-day expiry.
AUTH_JWT_TTL_SECONDS = int(os.environ.get("AUTH_JWT_TTL_SECONDS", str(7 * 24 * 3600)))

# App Ideas star ratings: the api commits `rating` into the idea's md frontmatter.
# Fine-grained GitHub token, contents:write on this one repo. Unset disables rating (503).
GITHUB_IDEAS_TOKEN = os.environ.get("GITHUB_IDEAS_TOKEN", "")
GITHUB_IDEAS_REPO = os.environ.get("GITHUB_IDEAS_REPO", "tomahim/vibe-code-apps")
GITHUB_IDEAS_BRANCH = os.environ.get("GITHUB_IDEAS_BRANCH", "master")
# Optional extra guard: require a logged-in Django staff session to rate.
IDEAS_RATE_REQUIRE_STAFF = os.environ.get("IDEAS_RATE_REQUIRE_STAFF", "false").lower() == "true"

# Little Grains content review: read open PRs/content trees and post review
# comments on the one repo and commit quick content edits to PR branches. Fine-grained GitHub token, contents:write (quick edits commit on the PR branch) +
# pull-requests:read + issues:write on this repo. Unset disables the app (503).
GITHUB_REVIEW_TOKEN = os.environ.get("GITHUB_REVIEW_TOKEN", "")
GITHUB_REVIEW_REPO = os.environ.get("GITHUB_REVIEW_REPO", "tomahim/vibe-code-apps")

# Personal Notion news reader: backend-only, narrow archive-checkbox writes. Fail closed.
NOTION_NEWS_TOKEN = os.environ.get("NOTION_NEWS_TOKEN", "")
NOTION_NEWS_DATA_SOURCE_ID = os.environ.get("NOTION_NEWS_DATA_SOURCE_ID", "")
NOTION_NEWS_ALLOWED_USER_IDS = {
    value.strip() for value in os.environ.get("NOTION_NEWS_ALLOWED_USER_IDS", "").split(",") if value.strip()
}

