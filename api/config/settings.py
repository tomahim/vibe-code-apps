import os
from pathlib import Path

from .database import database_config
from .media import build_storages

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "local-development-only-change-me")
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
    "apps.livetrail_scrap",
    "apps.recipes",
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
