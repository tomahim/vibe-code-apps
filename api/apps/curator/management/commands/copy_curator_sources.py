import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from apps.curator.copying import CopyError, copy_bundle, report


class Command(BaseCommand):
    help = "Dry-run a private source bundle; apply requires explicit reviewed hash and owner. Never migrates."

    def add_arguments(self, parser):
        parser.add_argument("--bundle", required=True)
        parser.add_argument("--apply", action="store_true")
        parser.add_argument("--approved-sha256")
        parser.add_argument("--owner-id")

    def handle(self, *args, **options):
        try:
            bundle = json.loads(Path(options["bundle"]).read_text())
            result = report(bundle)
            if options["apply"]:
                if not options["owner_id"] or options["approved_sha256"] != bundle["sha256"]:
                    raise CommandError("Apply requires the reviewed bundle SHA-256 and confirmed owner ID.")
                result["copy"] = copy_bundle(bundle, options["owner_id"])
            self.stdout.write(json.dumps(result, sort_keys=True))
        except (CopyError, OSError, ValueError, KeyError, TypeError) as exc:
            raise CommandError(str(exc)) from exc
