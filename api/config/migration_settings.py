"""Use a direct Neon connection for migrations and database maintenance."""

from .settings import *  # noqa: F403

DATABASES = {"default": database_config(os.environ, BASE_DIR, direct=True)}  # noqa: F405
