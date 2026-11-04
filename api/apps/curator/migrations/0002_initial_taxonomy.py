from django.db import migrations


TYPES = [("idea", "Ideas"), ("bookmark", "Bookmarks"), ("news", "News"), ("daily-note", "Daily notes")]
TAGS = [("inbox", "Inbox", True), ("archive", "Archive", True), ("favorite", "Favorite", True),
        ("promising", "Promising", False), ("to-improve", "To improve", False),
        ("inspiration", "Inspiration", False)]


def seed(apps, schema_editor):
    alias = schema_editor.connection.alias
    ObjectType = apps.get_model("curator", "ObjectType")
    Tag = apps.get_model("curator", "Tag")
    for position, (slug, name) in enumerate(TYPES):
        ObjectType.objects.using(alias).get_or_create(slug=slug, defaults={"name": name, "position": position})
    for position, (slug, name, system) in enumerate(TAGS):
        Tag.objects.using(alias).get_or_create(slug=slug, defaults={"name": name, "is_system": system, "position": position})


class Migration(migrations.Migration):
    dependencies = [("curator", "0001_initial")]
    # Keep seed records on reverse; reversing 0001 removes the whole schema.
    # Never delete taxonomy that may have acquired user data on rollback.
    operations = [migrations.RunPython(seed, migrations.RunPython.noop)]
