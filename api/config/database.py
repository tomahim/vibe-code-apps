"""Database configuration shared by the web app and migration commands."""

from urllib.parse import urlsplit

import dj_database_url
from django.core.exceptions import ImproperlyConfigured


def database_config(environ, base_dir, *, direct=False):
    required = environ.get("DJANGO_REQUIRE_DATABASE_URL", "false").lower() in {"true", "1"}
    required = required or bool(environ.get("RAILWAY_ENVIRONMENT_ID"))
    url = environ.get("DATABASE_URL", "").strip()
    if not url:
        if required:
            raise ImproperlyConfigured("DATABASE_URL is required in production.")
        return {"ENGINE": "django.db.backends.sqlite3", "NAME": base_dir / "db.sqlite3"}

    if direct:
        url = environ.get("DATABASE_URL_UNPOOLED", "").strip() or url
    try:
        if urlsplit(url).scheme not in {"postgres", "postgresql"}:
            raise ValueError
        config = dj_database_url.parse(url, conn_max_age=0, conn_health_checks=True)
        if not all(config.get(key) for key in ("HOST", "NAME", "USER")):
            raise ValueError
    except (ValueError, TypeError):
        # Parser errors can include the URL (and password). Never echo it.
        raise ImproperlyConfigured("Provide a valid PostgreSQL DATABASE_URL with a host, database and user.") from None

    host = config["HOST"]
    if direct and host.endswith(".neon.tech"):
        # Neon exposes the same database directly by removing the endpoint's
        # -pooler suffix. Preserve the password, TLS options, and database name.
        endpoint, domain = host.split(".", 1)
        config["HOST"] = f"{endpoint.removesuffix('-pooler')}.{domain}"

    options = config.setdefault("OPTIONS", {})
    options.setdefault("sslmode", "require")
    options.setdefault("connect_timeout", 15)
    if required and options["sslmode"] not in {"require", "verify-ca", "verify-full"}:
        raise ImproperlyConfigured("Production PostgreSQL connections must require TLS.")
    config["DISABLE_SERVER_SIDE_CURSORS"] = True
    return config
