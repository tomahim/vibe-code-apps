import json
from pathlib import Path

from django.db import migrations


def seed_instruments(apps, schema_editor):
    """Seed the built-in instrument catalogue (mirrors the synthdefs vendored
    in the UI app). Idempotent by name."""
    Instrument = apps.get_model("instruments", "Instrument")
    fixture = Path(__file__).resolve().parent.parent / "fixtures" / "seed_instruments.json"
    with open(fixture) as fh:
        entries = json.load(fh)
    for entry in entries:
        fields = entry["fields"]
        if Instrument.objects.filter(name=fields["name"]).exists():
            continue
        Instrument.objects.create(**fields)


def unseed_instruments(apps, schema_editor):
    Instrument = apps.get_model("instruments", "Instrument")
    Instrument.objects.filter(origin="builtin").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("instruments", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_instruments, unseed_instruments),
    ]
