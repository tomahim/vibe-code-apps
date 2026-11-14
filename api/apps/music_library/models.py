from django.db import models
from simple_history.models import HistoricalRecords


class Category(models.Model):
    """Thematic grouping for music tracks (e.g. Ambient, Action)."""

    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Track(models.Model):
    """A music-library track: metadata plus the JS score the browser engine plays."""

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    # The playable score (JavaScript using the m.* engine API), stored as text.
    code = models.TextField()
    category = models.ForeignKey(
        Category, null=True, blank=True, on_delete=models.SET_NULL, related_name="tracks"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # One row per saved version (create, edit, restore). Rows are never edited or deleted
    # by the app: a restore writes a new version on top.
    history = HistoricalRecords()

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
