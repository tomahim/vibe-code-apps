from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from config.media import app_upload_to


def validate_synthdef(upload):
    """Container-level validation only: extension and size. Real compatibility
    is decided by the engine when it loads and previews the definition."""
    if not upload.name.lower().endswith(".scsyndef"):
        raise ValidationError("Only .scsyndef files are accepted.")
    if upload.size > 512 * 1024:
        raise ValidationError("Synthdef files must be under 512 KB.")


class Instrument(models.Model):
    """A playable instrument (SuperCollider synthdef) for the music library.

    builtin rows mirror the synthdefs vendored in the UI app (seeded by a data
    migration; the engine's actual files remain the source of truth for what
    can play). imported rows carry their own uploaded definition file.
    """

    ORIGIN_BUILTIN = "builtin"
    ORIGIN_IMPORTED = "imported"

    name = models.CharField(max_length=120, unique=True)
    type = models.CharField(max_length=40, blank=True)
    blurb = models.CharField(max_length=200, blank=True)
    origin = models.CharField(
        max_length=10,
        choices=[(ORIGIN_BUILTIN, "Built in"), (ORIGIN_IMPORTED, "Imported")],
        default=ORIGIN_IMPORTED,
    )
    # True when the engine preloads it at boot; false means it loads on demand.
    ready = models.BooleanField(default=False)
    definition = models.FileField(
        upload_to=app_upload_to("instruments"),
        validators=[validate_synthdef],
        blank=True,
    )
    source_url = models.URLField(blank=True)
    license = models.CharField(max_length=120, blank=True)
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["type", "name"]

    def __str__(self):
        return self.name
