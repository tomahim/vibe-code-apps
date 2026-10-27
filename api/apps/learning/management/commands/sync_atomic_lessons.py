"""Synchronize the atomic-lessons content library into the Little Grains tables.

Reads the canonical content tree (atomic-lessons/) and upserts every theme,
learning path, lesson, card and question into the lg_ tables, keyed by the
UUID declared in the content metadata. Content is never deleted: retiring an
element happens through its `archived: true` tombstone.

One successful sync per commit is recorded in SyncLog; re-running the same
commit is a no-op. The whole sync is one transaction, and every row is
validated with full_clean() before it is written.
"""

from __future__ import annotations

import hashlib
import os
import subprocess
import sys
import uuid
from pathlib import Path

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.db import IntegrityError, transaction

from apps.learning.models import (
    Card,
    ContentEntity,
    LearningPath,
    Lesson,
    Question,
    SyncLog,
    Theme,
)

REPO_ROOT = Path(settings.BASE_DIR).resolve().parent
DEFAULT_CONTENT_ROOT = REPO_ROOT / "atomic-lessons"
KINDS = {
    "theme": ContentEntity.Kind.THEME,
    "learning_path": ContentEntity.Kind.LEARNING_PATH,
    "lesson": ContentEntity.Kind.LESSON,
    "card": ContentEntity.Kind.CARD,
    "question": ContentEntity.Kind.QUESTION,
}


class Command(BaseCommand):
    help = "Upsert the atomic-lessons library into the lg_ content tables."

    def add_arguments(self, parser):
        parser.add_argument(
            "--content-root",
            type=Path,
            default=DEFAULT_CONTENT_ROOT,
            help="Path to the atomic-lessons library (default: %(default)s).",
        )
        parser.add_argument(
            "--commit",
            default="",
            help="Merge commit SHA recorded in SyncLog and used as the provenance "
            "fallback. Defaults to GITHUB_SHA, then the local git HEAD.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Validate and report the full import, then roll the transaction back.",
        )

    def handle(self, *args, **options):
        content_root = options["content_root"].resolve()
        if not (content_root / "library.yaml").is_file():
            raise CommandError(f"{content_root}: not an atomic-lessons library (library.yaml missing)")
        check_uuids, check_images = self.load_checkers()
        commit = self.resolve_commit(options["commit"])
        self.run_content_checks(check_uuids, check_images, content_root)
        if SyncLog.objects.filter(commit_sha=commit).exists():
            self.stdout.write(f"Commit {commit} is already recorded in SyncLog; nothing to do.")
            return

        stats = {kind: {"added": 0, "updated": 0, "unchanged": 0} for kind in KINDS}
        with transaction.atomic():
            self.sync_library(content_root, commit, stats)
            SyncLog.objects.create(commit_sha=commit, changes={"commit": commit, **stats})
            if options["dry_run"]:
                transaction.set_rollback(True)
        for kind, counts in stats.items():
            self.stdout.write(
                f"{kind}: {counts['added']} added, {counts['updated']} updated, "
                f"{counts['unchanged']} unchanged"
            )
        if options["dry_run"]:
            self.stdout.write("Dry run: all content imported cleanly; transaction rolled back, nothing written.")
        else:
            self.stdout.write(self.style.SUCCESS(f"Synced atomic-lessons at commit {commit}."))

    # --- Environment -----------------------------------------------------

    def load_checkers(self):
        """Reuse the content checkers so parsing semantics stay in one place."""
        checkers_dir = DEFAULT_CONTENT_ROOT
        if str(checkers_dir) not in sys.path:
            sys.path.insert(0, str(checkers_dir))
        try:
            import check_images
            import check_uuids
        except ImportError as error:
            raise CommandError(f"Cannot import the atomic-lessons content checkers: {error}") from error
        return check_uuids, check_images

    def resolve_commit(self, supplied):
        commit = supplied.strip() or os.environ.get("GITHUB_SHA", "").strip()
        if not commit:
            try:
                result = subprocess.run(
                    ["git", "rev-parse", "HEAD"],
                    cwd=REPO_ROOT,
                    capture_output=True,
                    text=True,
                    timeout=15,
                )
            except (OSError, subprocess.SubprocessError):
                result = None
            if result is not None and result.returncode == 0:
                commit = result.stdout.strip()
        if not commit:
            raise CommandError("Provide --commit: neither GITHUB_SHA nor a git HEAD is available.")
        if len(commit) > 64:
            raise CommandError(f"Commit reference is too long for SyncLog: {commit!r}")
        return commit

    def run_content_checks(self, check_uuids, check_images, content_root):
        errors, _ = check_uuids.check_library(content_root)
        image_errors, _ = check_images.check_images(content_root)
        errors = errors + image_errors
        if errors:
            listing = "\n".join(f"- {error}" for error in errors)
            raise CommandError(f"Content checks failed; fix the library before syncing:\n{listing}")

    # --- Scanning ---------------------------------------------------------

    def scan(self, content_root, check_uuids):
        """Yield every content element in parent-before-child order."""
        for theme_dir in check_uuids.child_directories(content_root / "themes"):
            yield self.describe_markdown(content_root, theme_dir / "index.md", "theme", theme_dir, theme_dir)
            for path_dir in check_uuids.child_directories(theme_dir):
                yield self.describe_markdown(content_root, path_dir / "index.md", "learning_path", path_dir, theme_dir)
                for lesson_dir in check_uuids.child_directories(path_dir):
                    yield self.describe_markdown(content_root, lesson_dir / "index.md", "lesson", lesson_dir, path_dir)
                    for card_file in sorted((lesson_dir / "cards").glob("*.md")):
                        yield self.describe_markdown(content_root, card_file, "card", lesson_dir, lesson_dir)
                    for pattern in ("*.yaml", "*.yml"):
                        for question_file in sorted((lesson_dir / "questions").glob(pattern)):
                            yield self.describe_question(content_root, question_file, lesson_dir)

    def describe_markdown(self, content_root, file, kind, directory, parent_dir):
        metadata = self.load_metadata(file)
        lines = file.read_text(encoding="utf-8").splitlines()
        end = lines.index("---", 1)
        body = "\n".join(lines[end + 1 :]).strip()
        return self.describe(content_root, file, kind, directory, parent_dir, metadata, body)

    def describe_question(self, content_root, file, directory):
        metadata = self.load_metadata(file)
        return self.describe(content_root, file, "question", directory, directory, metadata, "")

    def describe(self, content_root, file, kind, directory, parent_dir, metadata, body):
        location = file.relative_to(content_root).as_posix()
        raw = file.read_bytes()
        return {
            "kind": kind,
            "id": self.content_id(metadata, location),
            "directory": directory,
            "parent_dir": parent_dir,
            "metadata": metadata,
            "body": body,
            "location": location,
            "provenance": {
                "content_hash": hashlib.sha256(raw).hexdigest(),
                "source_path": self.repo_relative(file, content_root),
                "last_changed_commit": "",  # filled in sync_library once the commit is known
            },
        }

    def load_metadata(self, file):
        check_uuids = sys.modules.get("check_uuids")
        if check_uuids is None:
            raise CommandError("Content checkers are not loaded; cannot parse metadata.")
        try:
            return check_uuids.load_metadata(file)
        except Exception as error:  # ValueError, OSError, yaml.YAMLError
            raise CommandError(f"{file}: cannot parse metadata: {error}") from error

    def content_id(self, metadata, location):
        value = metadata.get("id")
        try:
            return uuid.UUID(str(value))
        except (ValueError, AttributeError, TypeError):
            raise CommandError(f"{location}: invalid content id {value!r}") from None

    def repo_relative(self, file, content_root):
        resolved = file.resolve()
        try:
            return resolved.relative_to(REPO_ROOT).as_posix()
        except ValueError:
            return f"{content_root.name}/{file.relative_to(content_root).as_posix()}"

    def last_changed_commit(self, source_path):
        """Commit that last touched the file, or None without git history."""
        try:
            result = subprocess.run(
                ["git", "log", "-1", "--format=%H", "--", source_path],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
                timeout=15,
            )
        except (OSError, subprocess.SubprocessError):
            return None
        sha = result.stdout.strip() if result.returncode == 0 else ""
        return sha or None

    # --- Field mapping ----------------------------------------------------

    def require(self, metadata, key, location):
        value = metadata.get(key)
        if value is None or (isinstance(value, str) and not value.strip()):
            raise CommandError(f"{location}: missing required metadata '{key}'")
        return value

    def position(self, metadata, location):
        value = metadata.get("position")
        if not isinstance(value, int) or isinstance(value, bool) or value < 1:
            raise CommandError(f"{location}.position: expected a positive integer, got {value!r}")
        return value

    def image_fields(self, metadata, directory, location, *, required, path_key, alt_key):
        image = metadata.get("image")
        if image is None or not str(image).strip():
            if required:
                raise CommandError(f"{location}.image: every learning path needs an image filename")
            return {path_key: "", alt_key: ""}
        filename = str(image)
        filename = filename[2:] if filename.startswith("./") else filename
        candidate = directory / filename
        try:
            candidate.resolve().relative_to(directory.resolve())
        except ValueError:
            raise CommandError(f"{location}.image: image must stay beside its index.md") from None
        if not candidate.is_file():
            raise CommandError(f"{location}.image: image file does not exist: {filename}")
        return {path_key: self.repo_relative(candidate, directory), alt_key: str(metadata.get("image_alt") or "")}

    def question_fields(self, metadata, location):
        question_type = metadata.get("type")
        if question_type != "multiple_choice":
            raise CommandError(f"{location}.type: only multiple_choice is supported, got {question_type!r}")
        selection = metadata.get("selection", "single")
        if selection != "single":
            raise CommandError(f"{location}.selection: only single-answer questions are supported, got {selection!r}")
        correct = metadata.get("correct_choice_ids")
        if not isinstance(correct, list) or len(correct) != 1:
            raise CommandError(f"{location}.correct_choice_ids: expected exactly one correct choice ID")
        choices = metadata.get("choices")
        if not isinstance(choices, list):
            raise CommandError(f"{location}.choices: expected a list of four choices")
        options = []
        for index, choice in enumerate(choices):
            if not isinstance(choice, dict) or "id" not in choice or "text" not in choice:
                raise CommandError(f"{location}.choices[{index}]: each choice needs id and text")
            options.append({"id": str(choice["id"]), "text": str(choice["text"])})
        checkpoint = metadata.get("after_card_position")
        if not isinstance(checkpoint, int) or isinstance(checkpoint, bool) or checkpoint < 1:
            raise CommandError(f"{location}.after_card_position: expected a positive integer, got {checkpoint!r}")
        return {
            "type": Question.Type.MULTIPLE_CHOICE,
            "after_card_position": checkpoint,
            "prompt": str(self.require(metadata, "prompt", location)),
            "options": options,
            "answer": str(correct[0]),
            "explanation": str(self.require(metadata, "explanation", location)),
        }

    # --- Writing ----------------------------------------------------------

    def sync_library(self, content_root, commit, stats):
        records_by_dir = {}
        seen_ids = set()
        check_uuids = sys.modules["check_uuids"]
        for element in self.scan(content_root, check_uuids):
            seen_ids.add(element["id"])
            element["provenance"]["last_changed_commit"] = self.last_changed_commit(
                element["provenance"]["source_path"]
            )
            metadata = element["metadata"]
            location = element["location"]
            archived = bool(metadata.get("archived", False))
            entity = self.sync_entity(element, archived)
            parent = records_by_dir.get(element["parent_dir"]) if element["kind"] != "theme" else None
            # Retiring a parent makes its whole subtree unavailable: effective
            # publication needs the element's own flag AND the parent's state.
            published = not archived and (parent is None or parent.published)
            desired = {
                "position": self.position(metadata, location),
                "published": published,
                **element["provenance"],
            }
            if element["kind"] in ("theme", "learning_path", "lesson"):
                desired["title"] = str(self.require(metadata, "title", location))
                desired["description"] = str(metadata.get("description") or "")
                desired["introduction_markdown"] = element["body"]
                desired.update(
                    self.image_fields(
                        metadata,
                        element["directory"],
                        location,
                        required=element["kind"] == "learning_path",
                        path_key="image_path",
                        alt_key="image_alt",
                    )
                )
            if element["kind"] == "learning_path":
                desired["theme"] = parent
            elif element["kind"] == "lesson":
                desired["learning_path"] = parent
            elif element["kind"] == "card":
                if not element["body"]:
                    raise CommandError(f"{location}: card body is empty")
                desired["lesson"] = parent
                desired["title"] = str(self.require(metadata, "title", location))
                desired["body_markdown"] = element["body"]
                desired.update(
                    self.image_fields(
                        metadata,
                        element["directory"],
                        location,
                        required=False,
                        path_key="illustration_path",
                        alt_key="illustration_alt",
                    )
                )
            elif element["kind"] == "question":
                desired["lesson"] = parent
                desired.update(self.question_fields(metadata, location))
            model = {
                "theme": Theme,
                "learning_path": LearningPath,
                "lesson": Lesson,
                "card": Card,
                "question": Question,
            }[element["kind"]]
            record = self.upsert_record(model, entity, desired, location, stats, element["kind"], commit)
            if element["kind"] in ("theme", "learning_path", "lesson"):
                records_by_dir[element["directory"]] = record
        # Database drift is reported, never repaired here: retirement is an
        # explicit archived: true flag in the content, never an inferred delete.
        unknown = list(ContentEntity.objects.exclude(pk__in=seen_ids))
        if unknown:
            listing = ", ".join(f"{entity.kind} {entity.pk}" for entity in unknown[:10])
            self.stdout.write(
                self.style.WARNING(
                    f"{len(unknown)} database content ID(s) are not in the library and were left "
                    f"untouched (no deletion, no auto-archive): {listing}"
                )
            )

    def sync_entity(self, element, archived):
        location = element["location"]
        kind = KINDS[element["kind"]]
        entity = ContentEntity.objects.filter(pk=element["id"]).first()
        if entity is None:
            entity = ContentEntity(id=element["id"], kind=kind, archived=archived)
            self.validated_save(entity, location)
            return entity
        if entity.kind != kind:
            raise CommandError(
                f"{location}: content UUID {element['id']} is already registered as {entity.kind}; "
                f"it cannot become {kind}. Retire it with archived: true and use a fresh UUID instead."
            )
        if entity.archived != archived:
            entity.archived = archived
            self.validated_save(entity, location)
        return entity

    def upsert_record(self, model, entity, desired, location, stats, kind_label, commit):
        record = model.objects.filter(pk=entity.pk).first()
        if desired["last_changed_commit"] is None:
            # Without git history, keep the recorded commit for untouched files
            # and fall back to the synced commit only for new/changed content.
            if record is not None and record.content_hash == desired["content_hash"]:
                desired["last_changed_commit"] = record.last_changed_commit
            else:
                desired["last_changed_commit"] = commit
        if record is None:
            record = model(entity=entity, **desired)
            self.validated_save(record, location)
            stats[kind_label]["added"] += 1
            return record
        changed = {name: value for name, value in desired.items() if getattr(record, name) != value}
        if not changed:
            stats[kind_label]["unchanged"] += 1
            return record
        for name, value in changed.items():
            setattr(record, name, value)
        self.validated_save(record, location)
        stats[kind_label]["updated"] += 1
        return record

    @staticmethod
    def validated_save(instance, location):
        try:
            instance.full_clean()
            instance.save()
        except ValidationError as error:
            raise CommandError(f"{location}: {error}") from error
        except IntegrityError as error:
            raise CommandError(f"{location}: database rejected the row: {error}") from error
