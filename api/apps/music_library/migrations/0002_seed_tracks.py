import json
from pathlib import Path

from django.db import migrations


def seed_tracks(apps, schema_editor):
    """Seed the three tracks that ship as JS modules in the UI app.

    Idempotent: existing rows (matched by name) are left untouched so the
    migration is safe to run on a database where tracks were already created.
    """
    Category = apps.get_model("music_library", "Category")
    Track = apps.get_model("music_library", "Track")
    fixture = Path(__file__).resolve().parent.parent / "fixtures" / "seed_tracks.json"
    with open(fixture) as fh:
        entries = json.load(fh)
    categories = {}
    for entry in entries:
        if entry["model"] == "music_library.category":
            fields = entry["fields"]
            category, _ = Category.objects.get_or_create(
                slug=fields["slug"], defaults={"name": fields["name"]}
            )
            categories[fields["slug"]] = category
    for entry in entries:
        if entry["model"] != "music_library.track":
            continue
        fields = entry["fields"]
        if Track.objects.filter(name=fields["name"]).exists():
            continue
        Track.objects.create(
            name=fields["name"],
            description=fields["description"],
            code=fields["code"],
            category=categories.get(fields["category"][0]),
        )


def unseed_tracks(apps, schema_editor):
    Track = apps.get_model("music_library", "Track")
    Track.objects.filter(name__in=["Neon Rain", "First Light", "Night Pursuit"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("music_library", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_tracks, unseed_tracks),
    ]
