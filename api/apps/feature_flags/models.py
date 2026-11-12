"""Feature flags to try a feature before a global release.

A flag is on for a user when it is enabled globally, or when the user is
listed on it. Flags are managed in the Django admin; the UI reads the result
from GET /api/auth/me.
"""

from django.conf import settings
from django.core.validators import RegexValidator
from django.db import DatabaseError, models

key_validator = RegexValidator(
    r"^[a-z0-9][a-z0-9_-]*$",
    "Use lowercase letters, digits, hyphens and underscores.",
)


class FeatureFlag(models.Model):
    key = models.CharField(
        max_length=64, unique=True, validators=[key_validator],
        help_text="Stable identifier the UI checks, e.g. new-reader.",
    )
    description = models.CharField(max_length=255, blank=True)
    enabled_for_everyone = models.BooleanField(
        default=False, help_text="On for all users (global release).",
    )
    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name="feature_flags",
        help_text="Users who get the flag while it is not enabled for everyone.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "feature_flag"
        ordering = ["key"]

    def __str__(self):
        return self.key


def active_flag_keys(user):
    """Sorted keys of the flags on for this user (global, or assigned to them)."""
    flags = FeatureFlag.objects.filter(
        models.Q(enabled_for_everyone=True) | models.Q(users=user)
    )
    return sorted(set(flags.values_list("key", flat=True)))


def flag_enabled(user, key):
    """True only when the flag is on for this user. Fails closed: a missing
    flag or a database error never turns a feature on."""
    try:
        return key in active_flag_keys(user)
    except DatabaseError:
        return False
