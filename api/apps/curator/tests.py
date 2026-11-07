from datetime import date

from django.contrib.auth import get_user_model
from django.db import IntegrityError, connection, transaction
from django.test import TestCase
from django.db.models.deletion import ProtectedError

from .models import (Category, CategoryObjectType, Content, ContentCategory, ContentSource,
                     ContentTag, ObjectType, Tag)


class CuratorModelTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.owner = get_user_model().objects.create_user(username="little-notes-owner")
        cls.idea = ObjectType.objects.get(slug="idea")

    def content(self, **kwargs):
        return Content.objects.create(owner=self.owner, object_type=self.idea, title="An idea", **kwargs)

    def test_seeded_types_and_categories(self):
        self.assertSetEqual(set(ObjectType.objects.values_list("slug", flat=True)),
                            {"idea", "bookmark", "news", "daily-note", "video"})
        video = ObjectType.objects.get(slug="video")
        self.assertEqual((video.name, video.icon, video.position), ("Videos", "▶", 4))
        self.assertSetEqual(set(Category.objects.values_list("slug", flat=True)),
                            {"inbox", "archive", "favorite", "promising", "to-improve", "inspiration"})
        self.assertSetEqual(set(Category.objects.filter(is_system=True).values_list("slug", flat=True)),
                            {"inbox", "archive", "favorite"})
        ObjectType.objects.create(slug="essay", name="Essays")

    def test_category_object_type_links(self):
        linked = {c.slug: set(c.object_types.values_list("slug", flat=True))
                  for c in Category.objects.prefetch_related("object_types")}
        self.assertEqual(linked["promising"], {"idea"})
        self.assertEqual(linked["to-improve"], {"idea"})
        self.assertEqual(linked["inspiration"], {"bookmark"})
        for universal in ["inbox", "archive", "favorite"]:
            self.assertEqual(linked[universal], set())

    def test_tabs_moved_out_of_tags(self):
        # The six navigation labels live only as categories; tags hold topics.
        self.assertFalse(Tag.objects.filter(
            slug__in=["inbox", "archive", "favorite", "promising", "to-improve", "inspiration"]).exists())

    def test_all_new_tables_are_prefixed_no_implicit_m2m(self):
        tables = {model._meta.db_table for model in [ObjectType, Tag, Content, ContentTag, ContentSource,
                                                     Category, CategoryObjectType, ContentCategory]}
        self.assertEqual(tables, {"curator_object_type", "curator_tag", "curator_content",
                                  "curator_content_tag", "curator_content_source", "curator_category",
                                  "curator_category_object_type", "curator_content_category"})
        self.assertTrue(tables.issubset(set(connection.introspection.table_names())))

    def test_case_insensitive_taxonomy_keys(self):
        for model, slug in [(ObjectType, "IDEA"), (Category, "PROMISING")]:
            with self.assertRaises(IntegrityError), transaction.atomic():
                model.objects.create(slug=slug, name=slug)

    def test_duplicate_tag_and_category_assignment_is_rejected(self):
        content = self.content()
        tag = Tag.objects.create(slug="topic-test", name="Test topic")
        ContentTag.objects.create(content=content, tag=tag)
        with self.assertRaises(IntegrityError), transaction.atomic():
            ContentTag.objects.create(content=content, tag=tag)
        category = Category.objects.get(slug="favorite")
        ContentCategory.objects.create(content=content, category=category)
        with self.assertRaises(IntegrityError), transaction.atomic():
            ContentCategory.objects.create(content=content, category=category)

    def test_category_in_use_is_protected_from_delete(self):
        content = self.content()
        category = Category.objects.get(slug="promising")
        ContentCategory.objects.create(content=content, category=category)
        with self.assertRaises(ProtectedError):
            category.delete()

    def test_source_identity_supports_idempotent_copy_without_url_dedup(self):
        content = self.content(external_url="https://example.com/story")
        source = dict(system="notion", namespace="source-id", external_id="page-id")
        ContentSource.objects.create(content=content, **source)
        with self.assertRaises(IntegrityError), transaction.atomic():
            ContentSource.objects.create(content=self.content(), **source)
        other = self.content(external_url=content.external_url)
        ContentSource.objects.create(content=other, system="github", namespace="repo", external_id="idea.md")
        self.assertEqual(Content.objects.count(), 2)

    def test_month_boundaries_use_saved_calendar_date(self):
        jan = self.content(saved_on=date(2026, 1, 31))
        self.content(saved_on=date(2026, 2, 1), published_on=date(2026, 1, 31))
        result = Content.objects.filter(owner=self.owner, saved_on__gte=date(2026, 1, 1),
                                        saved_on__lt=date(2026, 2, 1))
        self.assertEqual(list(result), [jan])

    def test_owner_and_type_cannot_be_deleted_under_content(self):
        self.content()
        for obj in [self.owner, self.idea]:
            with self.assertRaises(ProtectedError):
                obj.delete()

    def test_no_rating_column_or_duplicate_archive_flag_on_content(self):
        names = {field.name for field in Content._meta.fields}
        self.assertFalse({"rating", "archived", "inbox", "favorite"} & names)

    def test_reserved_slugs_cannot_be_created_as_regular_tags_or_categories(self):
        with self.assertRaises(IntegrityError), transaction.atomic():
            Tag.objects.create(slug="archive", name="Archive")
        with self.assertRaises(IntegrityError), transaction.atomic():
            Category.objects.create(slug="inbox", name="Inbox 2")
        with self.assertRaises(IntegrityError), transaction.atomic():
            Category.objects.create(slug="custom", name="Custom", is_system=True)
