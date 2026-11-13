"""Settings for the atomic-lessons content publisher (GitHub Actions sync).

Cultive owns the Little Grains learning runtime (repo tomahim/cultive), but
this repository still owns the source content (atomic-lessons/) and the
publisher that migrates the learning tables and syncs content into them on the
paid Cultive database.

Only the apps whose tables belong to that database are installed here, so the
publisher's ``migrate`` cannot recreate experimentation tables (curator,
hockey, recipes, knob_conservatory, ...) there. The experimentation runtime
(config.settings) no longer installs apps.learning and never loads this
module.

Never add apps.learning_cleanup to this list: its migration drops the lg_*
tables and is meant for the experimentation database only.
"""

from .settings import *  # noqa: F401,F403

INSTALLED_APPS = [
    "unfold",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "apps.accounts",
    "apps.feature_flags",
    "apps.learning.apps.LearningConfig",
]

# The publisher serves no HTTP; the default URLconf imports experimentation
# apps that are not installed here.
ROOT_URLCONF = "config.publisher_urls"
