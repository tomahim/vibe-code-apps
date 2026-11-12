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
    "apps.feature_flags",
    "apps.little_grains",
    "apps.content_review",
    "apps.db_dashboard",
    "apps.curator.apps.CuratorConfig",
    "apps.learning.apps.LearningConfig",
    "apps.livetrail_scrap",
    "apps.recipes",
    "apps.rust_learning_path",
    "apps.hockey.apps.HockeyConfig",
    "apps.knob_conservatory.apps.KnobConservatoryConfig",
]

UNFOLD = {
    "SITE_TITLE": "Vibe Code Apps admin",
    "SITE_HEADER": "Vibe Code Apps",
    "SITE_SUBHEADER": "User management",
    "SITE_URL": "/",
    # Default app list plus the learning dashboard link (see apps/admin_ui/sidebar.py).
    "SIDEBAR": {"navigation": "apps.admin_ui.sidebar.navigation"},
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

# The weekly Challenge is a private duel: comma-separated usernames or emails
# of the two allowed players. Empty disables the challenge entirely.

# Empty means recipe writes are disabled; separate from the Telegram bot token.
BOT_API_SECRET = os.environ.get("BOT_API_SECRET", "")

# JWT access tokens (see apps/accounts): signed with SECRET_KEY, default 7-day expiry.
AUTH_JWT_TTL_SECONDS = int(os.environ.get("AUTH_JWT_TTL_SECONDS", str(7 * 24 * 3600)))


# Little Grains content review: read open PRs/content trees and post review
# comments on the one repo and commit quick content edits to PR branches. Fine-grained GitHub token, contents:write (quick edits commit on the PR branch) +
# pull-requests:read + issues:write on this repo. Unset disables the app (503).
GITHUB_REVIEW_TOKEN = os.environ.get("GITHUB_REVIEW_TOKEN", "")
GITHUB_REVIEW_REPO = os.environ.get("GITHUB_REVIEW_REPO", "tomahim/vibe-code-apps")



# Optional plan storage allowance (bytes) shown against the database size in the
# database dashboard. Unset: the dashboard lets staff enter one in the browser.
DB_STORAGE_LIMIT_BYTES = int(os.environ.get("DB_STORAGE_LIMIT_BYTES", "0") or 0)

# Optional Google Identity Services sign-in. Off until explicitly configured.
GOOGLE_SIGN_IN_ENABLED = os.environ.get("GOOGLE_SIGN_IN_ENABLED", "false").lower() in {"true", "1"}
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_ALLOWED_ORIGINS = [origin.strip() for origin in os.environ.get("GOOGLE_ALLOWED_ORIGINS", "").split(",") if origin.strip()]
