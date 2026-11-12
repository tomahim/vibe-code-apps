from .models import FeatureFlag

RELEASE_FLAGS = ("leaderboard_two_users", "challenge_two_users")


def enable_flags(*keys):
    """Turn flags on for everyone in a test (global release)."""
    for key in keys or RELEASE_FLAGS:
        FeatureFlag.objects.update_or_create(key=key, defaults={"enabled_for_everyone": True})
