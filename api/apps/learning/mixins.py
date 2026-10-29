"""Reusable model mixins for Little Grains content."""

from django.core.exceptions import ValidationError
from django.db import models


class IllustrationMixin(models.Model):
    """Optional illustration with provenance metadata, for any content model.

    Card illustrations are the first user (#195); other content types can gain
    the same fields by inheriting this mixin. All fields are blank-able so an
    illustration stays optional; clean() only validates when a path is set.
    """

    illustration_path = models.CharField(max_length=1024, blank=True)
    illustration_alt = models.TextField(blank=True)
    illustration_caption = models.TextField(blank=True)
    illustration_credit = models.CharField(max_length=255, blank=True)
    illustration_license = models.CharField(max_length=255, blank=True)
    illustration_source_url = models.URLField(max_length=1024, blank=True)
    illustration_width = models.PositiveIntegerField(null=True, blank=True)
    illustration_height = models.PositiveIntegerField(null=True, blank=True)
    # SHA-256 of the source image last processed into variants; empty until the
    # sync has bucket access and has uploaded the WebP variants.
    illustration_source_hash = models.CharField(max_length=64, blank=True)
    # {"640": "learning/<card-id>/<sha>-640.webp", ...} on the media storage.
    illustration_variants = models.JSONField(default=dict, blank=True)

    class Meta:
        abstract = True

    def clean(self):
        super().clean()
        if not self.illustration_path:
            return
        errors = {}
        if not self.illustration_alt.strip():
            errors["illustration_alt"] = "Illustrations require useful alt text."
        # Real photos need provenance; original artwork is exempt (#195).
        if self.illustration_license.strip() != "original":
            if not self.illustration_credit.strip():
                errors["illustration_credit"] = (
                    "Illustrations require a credit unless the license is 'original'."
                )
            if not self.illustration_license.strip():
                errors["illustration_license"] = (
                    "Illustrations require a license (for example 'CC BY-SA 4.0' or 'original')."
                )
        if errors:
            raise ValidationError(errors)
