from django.apps import AppConfig
from django.core.checks import Error, Tags, register


class AccountsConfig(AppConfig):
    name = "apps.accounts"


@register(Tags.security)
def secret_key_guard(app_configs, **kwargs):
    """Deploy must fail loudly rather than run JWT sign-in on the public dev key."""
    from django.conf import settings

    from config.settings import INSECURE_SECRET_KEYS

    if getattr(settings, "SECRET_KEY_REQUIRED", False) and settings.SECRET_KEY in INSECURE_SECRET_KEYS:
        return [
            Error(
                "DJANGO_SECRET_KEY is unset or a publicly known value; JWT sign-in would be forgeable.",
                hint="Set DJANGO_SECRET_KEY to a real secret in production.",
                id="accounts.E001",
            )
        ]
    return []
