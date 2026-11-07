"""Add the Work ideas object type.

Thomas, 2026-11-07: "Do a new object type work ideas". Seeded like the Videos
type (0005); get_or_create keeps in-app taxonomy edits. The type row and the
first work idea (Sentry dedup with Claude) were saved directly in production
through the scoped curator role; fresh environments get the type here.
"""
from django.db import migrations


WORK_IDEA_TYPE = ("work-idea", "Work ideas", "⚒", 5)


def seed(apps, schema_editor):
    alias = schema_editor.connection.alias
    ObjectType = apps.get_model("curator", "ObjectType")
    slug, name, icon, position = WORK_IDEA_TYPE
    ObjectType.objects.using(alias).get_or_create(
        slug=slug, defaults={"name": name, "icon": icon, "position": position})


class Migration(migrations.Migration):
    dependencies = [("curator", "0005_video_object_type")]
    # Keep the type on reverse; it may have acquired content by then.
    operations = [migrations.RunPython(seed, migrations.RunPython.noop)]
