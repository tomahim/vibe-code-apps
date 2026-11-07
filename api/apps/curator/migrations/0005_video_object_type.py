"""Add the Videos object type for saved video links.

Thomas, 2026-11-07: "I want you to put all videos on a new object type in
little notes called Videos obviously". Seeded like the initial taxonomy
(0002); get_or_create keeps in-app taxonomy edits. The nine existing YouTube
bookmarks were re-typed directly in production through the scoped curator
role (data move verified by readback); fresh environments hold no content to
move, so no data migration is needed here.
"""
from django.db import migrations


VIDEO_TYPE = ("video", "Videos", "▶", 4)


def seed(apps, schema_editor):
    alias = schema_editor.connection.alias
    ObjectType = apps.get_model("curator", "ObjectType")
    slug, name, icon, position = VIDEO_TYPE
    ObjectType.objects.using(alias).get_or_create(
        slug=slug, defaults={"name": name, "icon": icon, "position": position})


class Migration(migrations.Migration):
    dependencies = [("curator", "0004_viewpreference")]
    # Keep the type on reverse; it may have acquired content by then.
    operations = [migrations.RunPython(seed, migrations.RunPython.noop)]
