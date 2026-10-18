from django.db import models

from config.media import app_upload_to, validate_image_upload


class Recipe(models.Model):
    """Etchebest recipe (issue #25). Ingredients and the API come later."""

    title = models.CharField(max_length=200)
    source_url = models.URLField(blank=True)
    # Only the storage key is stored (recipes/<uuid>.<ext>), never image bytes.
    image = models.ImageField(
        upload_to=app_upload_to("recipes"),
        validators=[validate_image_upload],
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
