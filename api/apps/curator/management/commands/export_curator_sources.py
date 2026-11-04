import json
import os
from datetime import datetime, timezone
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from apps.curator.exporting import ExportError, NotionReader, digest, export_ideas


class Command(BaseCommand):
    help = "Read-only capture of Little notes sources into a PRIVATE local JSON bundle."

    def add_arguments(self, parser):
        parser.add_argument("--ideas-dir", required=True)
        parser.add_argument("--github-revision", required=True)
        parser.add_argument("--notion-data-source", required=True)
        parser.add_argument("--notion-token-file", required=True)
        parser.add_argument("--output", required=True)

    def handle(self, *args, **options):
        path = Path(options["output"])
        if path.exists():
            raise CommandError("Output exists; choose a new private path.")
        try:
            token = Path(options["notion_token_file"]).read_text().strip()
            bundle = {"version": 1, "captured_at": datetime.now(timezone.utc).isoformat(),
                      "github_repository": "tomahim/vibe-code-apps",
                      "github_revision": options["github_revision"],
                      "ideas": export_ideas(options["ideas_dir"]),
                      "notion": NotionReader(token).export(options["notion_data_source"])}
            bundle["sha256"] = digest(bundle)
            # Exclusive creation and private permissions from the first byte.
            fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(fd, "w") as stream:
                json.dump(bundle, stream, ensure_ascii=False)
        except (ExportError, OSError, ValueError) as exc:
            raise CommandError(str(exc)) from exc
        self.stdout.write(json.dumps({"ideas": len(bundle["ideas"]),
                                     "notion_pages": len(bundle["notion"]["pages"]),
                                     "sha256": bundle["sha256"]}))
