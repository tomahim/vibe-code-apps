from datetime import date

from django.contrib.auth import get_user_model
from django.db import IntegrityError, connection, transaction
from django.test import TestCase
from django.db.models.deletion import ProtectedError

from .models import Content, ContentSource, ContentTag, ObjectType, Tag


class CuratorModelTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.owner = get_user_model().objects.create_user(username="little-notes-owner")
        cls.idea = ObjectType.objects.get(slug="idea")

    def content(self, **kwargs):
        return Content.objects.create(owner=self.owner, object_type=self.idea, title="An idea", **kwargs)

    def test_seeded_extensible_types_and_fixed_tags(self):
        self.assertSetEqual(set(ObjectType.objects.values_list("slug", flat=True)),
                            {"idea", "bookmark", "news", "daily-note"})
        self.assertSetEqual(set(Tag.objects.filter(is_system=True).values_list("slug", flat=True)),
                            {"inbox", "archive", "favorite"})
        ObjectType.objects.create(slug="essay", name="Essays")

    def test_all_new_tables_are_prefixed_no_implicit_m2m(self):
        tables = {model._meta.db_table for model in [ObjectType, Tag, Content, ContentTag, ContentSource]}
        self.assertEqual(tables, {"curator_object_type", "curator_tag", "curator_content",
                                  "curator_content_tag", "curator_content_source"})
        self.assertTrue(tables.issubset(set(connection.introspection.table_names())))

    def test_case_insensitive_taxonomy_keys(self):
        for model, slug in [(ObjectType, "IDEA"), (Tag, "PROMISING")]:
            with self.assertRaises(IntegrityError), transaction.atomic():
                model.objects.create(slug=slug, name=slug)

    def test_duplicate_tag_assignment_is_rejected(self):
        content = self.content()
        tag = Tag.objects.get(slug="favorite")
        ContentTag.objects.create(content=content, tag=tag)
        with self.assertRaises(IntegrityError), transaction.atomic():
            ContentTag.objects.create(content=content, tag=tag)

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

    def test_reserved_tags_cannot_be_created_as_regular_tags(self):
        with self.assertRaises(IntegrityError), transaction.atomic():
            Tag.objects.filter(slug="archive").update(is_system=False)
