"""Little notes proposal: content, extensible taxonomy and copy provenance.

This layer intentionally exposes no API, admin or source synchronisation.
"""
import uuid

from django.conf import settings
from django.db import models
from django.db.models import Q
from django.db.models.functions import Lower
from django.utils import timezone


class ObjectType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=64, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=64, blank=True)
    position = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "curator_object_type"
        ordering = ["position", "slug"]
        constraints = [models.UniqueConstraint(Lower("slug"), name="curator_type_slug_ci")]


class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Stored without the display-only # prefix.
    slug = models.SlugField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=32, blank=True)
    is_system = models.BooleanField(default=False)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "curator_tag"
        ordering = ["position", "slug"]
        constraints = [
            models.UniqueConstraint(Lower("slug"), name="curator_tag_slug_ci"),
            models.CheckConstraint(
                condition=(Q(is_system=True, slug__in=["inbox", "archive", "favorite"])
                           | (Q(is_system=False) & ~Q(slug__in=["inbox", "archive", "favorite"]))),
                name="curator_reserved_tag_kind",
            ),
        ]


class Content(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                              related_name="curator_content")
    object_type = models.ForeignKey(ObjectType, on_delete=models.PROTECT,
                                    related_name="content")
    title = models.CharField(max_length=500)
    subtitle = models.TextField(blank=True)  # Idea tagline, if present.
    summary = models.TextField(blank=True)  # Idea pitch / article summary.
    body_markdown = models.TextField(blank=True)
    external_url = models.URLField(max_length=4096, blank=True)
    image_url = models.URLField(max_length=4096, blank=True)
    image_alt = models.TextField(blank=True)
    source_name = models.CharField(max_length=500, blank=True)
    author = models.CharField(max_length=500, blank=True)
    claim_status = models.TextField(blank=True)  # Preserve, never infer verification.
    # User/source calendar date used for month browsing, NOT import time.
    saved_on = models.DateField(default=timezone.localdate, db_index=True)
    published_on = models.DateField(null=True, blank=True)
    note_on = models.DateField(null=True, blank=True)
    # Source creation instant, when known; don't invent midnight for date-only data.
    original_created_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Extension data, not a replacement for searchable common fields or tags.
    attributes = models.JSONField(default=dict, blank=True)
    tags = models.ManyToManyField(Tag, through="ContentTag", related_name="content")

    class Meta:
        db_table = "curator_content"
        ordering = ["-saved_on", "-created_at", "id"]
        constraints = [models.CheckConstraint(condition=~Q(title=""), name="curator_content_title_present")]
        indexes = [
            models.Index(fields=["owner", "-saved_on", "id"], name="curator_owner_month_idx"),
            models.Index(fields=["owner", "object_type", "-saved_on"], name="curator_type_month_idx"),
        ]


class ContentTag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name="tag_links")
    tag = models.ForeignKey(Tag, on_delete=models.PROTECT, related_name="content_links")
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "curator_content_tag"
        constraints = [models.UniqueConstraint(fields=["content", "tag"], name="curator_unique_content_tag")]
        indexes = [models.Index(fields=["tag", "content"], name="curator_tag_content_idx")]


class ContentSource(models.Model):
    """Stable copy identity. URL alone is deliberately not unique."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name="sources")
    system = models.CharField(max_length=32)  # github / notion; future sources allowed.
    namespace = models.CharField(max_length=255)  # repo / Notion data-source UUID.
    external_id = models.CharField(max_length=1024)  # repo path / Notion page UUID.
    source_url = models.URLField(max_length=4096, blank=True)
    source_revision = models.CharField(max_length=255, blank=True)
    source_created_at = models.DateTimeField(null=True, blank=True)
    source_updated_at = models.DateTimeField(null=True, blank=True)
    original_category = models.CharField(max_length=100, blank=True)
    original_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    payload = models.JSONField(default=dict, blank=True)  # Original metadata/blocks; no secrets.
    imported_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "curator_content_source"
        constraints = [
            models.UniqueConstraint(fields=["system", "namespace", "external_id"], name="curator_source_identity"),
            models.CheckConstraint(condition=Q(original_rating__isnull=True) | Q(original_rating__in=[1, 2, 3]),
                                   name="curator_source_valid_rating"),
        ]
