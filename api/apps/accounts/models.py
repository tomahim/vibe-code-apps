"""External identities are explicit bindings, never inferred from email."""
from django.conf import settings
from django.db import models


class ExternalIdentity(models.Model):
    provider = models.CharField(max_length=32, choices=[("google", "Google")])
    subject = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["provider", "subject"], name="accounts_unique_provider_subject"),
            models.UniqueConstraint(fields=["provider", "user"], name="accounts_unique_provider_user"),
        ]
