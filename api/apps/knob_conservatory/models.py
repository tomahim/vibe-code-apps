"""Knob Conservatory: a player's saved instruments (synth presets).

One table, owner-scoped, no cross-user visibility. Table created only through
this app's migrations, like the other apps' prefixed tables.
"""

import uuid

from django.conf import settings
from django.db import models


class Preset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                              related_name="kc_presets")
    name = models.CharField(max_length=80)
    # The synth panel's parameter values, keyed by control id.
    settings = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "kc_preset"
        ordering = ["name", "id"]
        constraints = [
            models.UniqueConstraint(fields=["owner", "name"], name="kc_preset_unique_name"),
            models.CheckConstraint(condition=~models.Q(name=""), name="kc_preset_name_present"),
        ]

    def __str__(self):
        return f"{self.name} ({self.owner_id})"
