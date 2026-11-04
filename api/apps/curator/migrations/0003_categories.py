"""Split navigation tabs (categories) from free-form topic tags.

Thomas's 2026-11-04 review: the six workflow labels imported as tags
(inbox/archive/favorite/promising/to-improve/inspiration) are navigation
categories, not tags. Tags remain for topic filtering. Categories can be
restricted to specific object types: promising and to-improve only apply to
Ideas, inspiration only to Bookmarks; unrestricted categories apply to every
type. Existing assignments move 1:1, preserving assignment timestamps; no
content row is changed.
"""
import uuid

from django.db import migrations, models
from django.db.models import Q
from django.db.models.functions import Lower


CATEGORIES = [("inbox", "Inbox", True), ("archive", "Archive", True), ("favorite", "Favorite", True),
              ("promising", "Promising", False), ("to-improve", "To improve", False),
              ("inspiration", "Inspiration", False)]
# Categories restricted to specific object types; absent slugs apply to all types.
TYPE_LINKS = {"promising": ["idea"], "to-improve": ["idea"], "inspiration": ["bookmark"]}


def move_tabs_to_categories(apps, schema_editor):
    alias = schema_editor.connection.alias
    Category = apps.get_model("curator", "Category")
    CategoryObjectType = apps.get_model("curator", "CategoryObjectType")
    ContentCategory = apps.get_model("curator", "ContentCategory")
    ObjectType = apps.get_model("curator", "ObjectType")
    Tag = apps.get_model("curator", "Tag")
    ContentTag = apps.get_model("curator", "ContentTag")
    categories = {}
    for position, (slug, name, system) in enumerate(CATEGORIES):
        categories[slug], _ = Category.objects.using(alias).get_or_create(
            slug=slug, defaults={"name": name, "is_system": system, "position": position})
    for slug, type_slugs in TYPE_LINKS.items():
        for type_slug in type_slugs:
            CategoryObjectType.objects.using(alias).get_or_create(
                category=categories[slug],
                object_type=ObjectType.objects.using(alias).get(slug=type_slug))
    for slug, category in categories.items():
        tag = Tag.objects.using(alias).filter(slug=slug).first()
        if not tag:
            continue
        links = list(ContentTag.objects.using(alias).filter(tag=tag).values("content_id", "assigned_at"))
        ContentCategory.objects.using(alias).bulk_create(
            [ContentCategory(content_id=link["content_id"], category=category) for link in links],
            ignore_conflicts=True)
        # bulk_create applies auto_now_add; restore the original assignment times.
        for link in links:
            ContentCategory.objects.using(alias).filter(
                content_id=link["content_id"], category=category).update(assigned_at=link["assigned_at"])
        ContentTag.objects.using(alias).filter(tag=tag).delete()
        tag.delete(using=alias)


def move_categories_back_to_tags(apps, schema_editor):
    alias = schema_editor.connection.alias
    Category = apps.get_model("curator", "Category")
    ContentCategory = apps.get_model("curator", "ContentCategory")
    Tag = apps.get_model("curator", "Tag")
    ContentTag = apps.get_model("curator", "ContentTag")
    for position, (slug, name, system) in enumerate(CATEGORIES):
        category = Category.objects.using(alias).filter(slug=slug).first()
        if not category:
            continue
        tag, _ = Tag.objects.using(alias).get_or_create(
            slug=slug, defaults={"name": name, "is_system": system, "position": position})
        for link in ContentCategory.objects.using(alias).filter(category=category):
            ContentTag.objects.using(alias).get_or_create(
                content_id=link.content_id, tag=tag, defaults={"assigned_at": link.assigned_at})


class Migration(migrations.Migration):
    dependencies = [("curator", "0002_initial_taxonomy")]
    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("slug", models.SlugField(max_length=100, unique=True)),
                ("name", models.CharField(max_length=100)),
                ("color", models.CharField(blank=True, max_length=32)),
                ("is_system", models.BooleanField(default=False)),
                ("position", models.PositiveIntegerField(default=0)),
            ],
            options={
                "db_table": "curator_category",
                "ordering": ["position", "slug"],
            },
        ),
        migrations.CreateModel(
            name="CategoryObjectType",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("category", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="type_links", to="curator.category")),
                ("object_type", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="category_links", to="curator.objecttype")),
            ],
            options={
                "db_table": "curator_category_object_type",
            },
        ),
        migrations.CreateModel(
            name="ContentCategory",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("assigned_at", models.DateTimeField(auto_now_add=True)),
                ("category", models.ForeignKey(on_delete=models.deletion.PROTECT, related_name="content_links", to="curator.category")),
                ("content", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="category_links", to="curator.content")),
            ],
            options={
                "db_table": "curator_content_category",
            },
        ),
        migrations.AddConstraint(model_name="category", constraint=models.UniqueConstraint(Lower("slug"), name="curator_category_slug_ci")),
        migrations.AddConstraint(model_name="category", constraint=models.CheckConstraint(
            condition=(Q(is_system=True, slug__in=["inbox", "archive", "favorite"])
                       | (Q(is_system=False) & ~Q(slug__in=["inbox", "archive", "favorite"]))),
            name="curator_reserved_category_kind")),
        migrations.AddConstraint(model_name="categoryobjecttype",
                                 constraint=models.UniqueConstraint(fields=("category", "object_type"), name="curator_unique_category_type")),
        migrations.AddConstraint(model_name="contentcategory",
                                 constraint=models.UniqueConstraint(fields=("content", "category"), name="curator_unique_content_category")),
        migrations.AddIndex(model_name="contentcategory",
                            index=models.Index(fields=["category", "content"], name="curator_category_content_idx")),
        migrations.AddField(
            model_name="category",
            name="object_types",
            field=models.ManyToManyField(blank=True, related_name="categories", through="curator.CategoryObjectType", to="curator.objecttype"),
        ),
        migrations.AddField(
            model_name="content",
            name="categories",
            field=models.ManyToManyField(related_name="content", through="curator.ContentCategory", to="curator.category"),
        ),
        migrations.RunPython(move_tabs_to_categories, move_categories_back_to_tags),
    ]
