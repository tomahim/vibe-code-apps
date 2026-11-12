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

from apps.learning import illustrations
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
TEMP_POSITION_OFFSET = 1_000_000_000
SCOPE_FIELDS = {
    "theme": (),
    "learning_path": ("theme",),
    "lesson": ("learning_path",),
    "card": ("lesson",),
    "question": ("lesson",),
}
MODELS = {
    "theme": Theme,
    "learning_path": LearningPath,
    "lesson": Lesson,
    "card": Card,
    "question": Question,
}
BULK_BATCH_SIZE = 500
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
        elements = list(self.scan(content_root, check_uuids))
        # Image processing and bucket uploads happen before the database
        # transaction: no row ever points at an object that is not uploaded,
        # and network calls never hold the transaction open (#195).
        prepared_illustrations = self.prepare_illustrations(elements)
        with transaction.atomic():
            self.sync_library(content_root, commit, stats, elements, prepared_illustrations)
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
                        # Card images sit beside the card file itself (#195).
                        yield self.describe_markdown(content_root, card_file, "card", card_file.parent, lesson_dir)
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

    def last_changed_commits(self, source_paths):
        """Last-changing commit of every file in one `git log` pass.

        Returns {source_path: sha} (files without history are absent), or None
        when the batched pass could not run, so callers fall back to the
        per-file lookup. The newest commit that lists a path is the same commit
        `git log -1 -- path` reports on linear history.
        """
        wanted = set(source_paths)
        roots = sorted({path.split("/", 1)[0] for path in wanted})
        if not roots:
            return {}
        try:
            result = subprocess.run(
                ["git", "--literal-pathspecs", "-c", "core.quotepath=off", "log",
                 "--format=@@%H", "--name-only", "--", *roots],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
                encoding="utf-8",
                timeout=600,
            )
        except (OSError, subprocess.SubprocessError):
            return None
        if result.returncode != 0:
            return None
        found = {}
        sha = ""
        for line in result.stdout.splitlines():
            if line.startswith("@@"):
                sha = line[2:]
            elif sha and line in wanted and line not in found:
                found[line] = sha
                if len(found) == len(wanted):
                    break
        return found

    def fill_provenance(self, elements):
        """Set last_changed_commit on every element (None without git history)."""
        batched = self.last_changed_commits(element["provenance"]["source_path"] for element in elements)
        for element in elements:
            source_path = element["provenance"]["source_path"]
            if batched is None:
                element["provenance"]["last_changed_commit"] = self.last_changed_commit(source_path)
            else:
                element["provenance"]["last_changed_commit"] = batched.get(source_path)

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

    def image_file(self, metadata, directory, location):
        """Resolve the optional sibling image of one content element."""
        image = metadata.get("image")
        if image is None or not str(image).strip():
            return None
        filename = str(image)
        filename = filename[2:] if filename.startswith("./") else filename
        candidate = directory / filename
        try:
            candidate.resolve().relative_to(directory.resolve())
        except ValueError:
            raise CommandError(f"{location}.image: image must stay beside its Markdown file") from None
        if not candidate.is_file():
            raise CommandError(f"{location}.image: image file does not exist: {filename}")
        return candidate

    def image_fields(self, metadata, directory, location, *, path_key, alt_key):
        candidate = self.image_file(metadata, directory, location)
        if candidate is None:
            return {path_key: "", alt_key: ""}
        return {path_key: self.repo_relative(candidate, directory), alt_key: str(metadata.get("image_alt") or "")}

    # --- Card illustrations ------------------------------------------------

    def prepare_illustrations(self, elements):
        """Hash, resize and upload changed card images before the DB transaction.

        A stored source hash that still matches skips every decode, resize and
        object write, so an unchanged re-sync does no image work. Without the
        media bucket (local development, content CI) variant generation is
        skipped and those illustrations are not served until a bucket-enabled
        sync processes them.
        """
        cards = [
            element
            for element in elements
            if element["kind"] == "card" and str(element["metadata"].get("image") or "").strip()
        ]
        if not cards:
            return {}
        if not illustrations.bucket_available():
            self.stdout.write(
                f"{len(cards)} card image(s) present but the media bucket is not configured; "
                "skipping WebP variant processing (they will not be served until a "
                "bucket-enabled sync processes them)."
            )
            return {}
        to_process = []
        unchanged = 0
        non_raster = 0
        stored_cards = Card.objects.in_bulk([element["id"] for element in cards])
        for element in cards:
            candidate = self.image_file(element["metadata"], element["directory"], element["location"])
            if not illustrations.raster_image(candidate):
                non_raster += 1  # SVG and friends cannot become WebP variants
                continue
            sha = illustrations.source_hash(candidate)
            row = stored_cards.get(element["id"])
            if row is not None and row.illustration_source_hash == sha and row.illustration_variants:
                unchanged += 1  # unchanged source: no decode, resize or upload
                continue
            to_process.append((element, candidate))
        if unchanged:
            self.stdout.write(f"Illustrations: {unchanged} unchanged (source hash match), no reprocessing.")
        if non_raster:
            self.stdout.write(f"Illustrations: {non_raster} non-raster image(s) skipped; only raster images can be served.")
        prepared = {}
        # Units are source illustrations; each uploads its 640/1280 WebP
        # variants. The counter advances only after a successful upload, and a
        # failure aborts the sync, so the last line printed is never ahead of
        # what actually reached the bucket.
        total = len(to_process)
        for index, (element, candidate) in enumerate(to_process, start=1):
            result = illustrations.process_card_image(element["id"], candidate)
            if not result or not result.get("illustration_variants"):
                raise CommandError(
                    f"{element['location']}: illustration processing returned no uploaded variants"
                )
            prepared[str(element["id"])] = result
            self.stdout.write(f"Illustrations: uploaded {index}/{total} - {element['location']}")
        if total:
            self.stdout.write(f"Illustrations: all {total} changed source image(s) uploaded successfully.")
        return prepared

    @staticmethod
    def illustration_metadata_fields(metadata):
        return {
            "illustration_caption": str(metadata.get("image_caption") or ""),
            "illustration_credit": str(metadata.get("image_credit") or ""),
            "illustration_license": str(metadata.get("image_license") or ""),
            "illustration_source_url": str(metadata.get("image_source_url") or ""),
        }

    @staticmethod
    def empty_illustration_fields():
        return {
            "illustration_caption": "",
            "illustration_credit": "",
            "illustration_license": "",
            "illustration_source_url": "",
            "illustration_width": None,
            "illustration_height": None,
            "illustration_source_hash": "",
            "illustration_variants": {},
        }

    def question_fields(self, metadata, location):
        question_type = metadata.get("type")
        checkpoint = metadata.get("after_card_position")
        if not isinstance(checkpoint, int) or isinstance(checkpoint, bool) or checkpoint < 1:
            raise CommandError(f"{location}.after_card_position: expected a positive integer, got {checkpoint!r}")
        common = {
            "after_card_position": checkpoint,
            "prompt": str(self.require(metadata, "prompt", location)),
            "explanation": str(self.require(metadata, "explanation", location)),
        }
        if question_type == "type_answer_question":
            if any(key in metadata for key in ("choices", "correct_choice_ids", "selection")):
                raise CommandError(f"{location}: typed-answer questions use accepted_answers, not choices")
            answers = metadata.get("accepted_answers")
            if not isinstance(answers, list) or not answers or any(not isinstance(value, str) for value in answers):
                raise CommandError(f"{location}.accepted_answers: expected a nonempty list of answers")
            return {**common, "type": Question.Type.TYPE_ANSWER_QUESTION, "options": [],
                    "answer": answers[0], "accepted_answers": answers}
        if question_type != "multiple_choice":
            raise CommandError(f"{location}.type: unsupported question type {question_type!r}")
        if "accepted_answers" in metadata:
            raise CommandError(f"{location}.accepted_answers: choice questions do not use typed answers")
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
        return {**common, "type": Question.Type.MULTIPLE_CHOICE, "options": options,
                "answer": str(correct[0]), "accepted_answers": []}

    # --- Writing ----------------------------------------------------------

    def sync_library(self, content_root, commit, stats, elements, prepared_illustrations):
        """Write the library one kind at a time, parents before children.

        Existing rows are read in bulk, diffed in memory and written only when
        changed; new rows are validated one by one (full_clean) and inserted in
        batches. A kind is fully written before the next one starts, so every
        parent row exists when its children are validated.
        """
        records_by_dir = {}
        positions_seen = {}
        seen_ids = {element["id"] for element in elements}
        self.fill_provenance(elements)
        entities = ContentEntity.objects.in_bulk(list(seen_ids))
        # Periodic one-line progress so CI logs show the import advancing
        # through themes, paths, lessons, cards and questions (#195).
        total = len(elements)
        progress_step = max(1, min(100, total // 25)) if total else 1
        processed = 0
        for kind, model in MODELS.items():
            batch = [element for element in elements if element["kind"] == kind]
            if not batch:
                continue
            new_entities = []
            for element in batch:
                self.sync_entity(element, bool(element["metadata"].get("archived", False)), entities, new_entities)
            self.bulk_insert(ContentEntity, new_entities)
            existing = model.objects.in_bulk([element["id"] for element in batch])
            occupancy = self.load_occupancy(model)
            new_records = []
            for element in batch:
                processed += 1
                metadata = element["metadata"]
                location = element["location"]
                archived = bool(metadata.get("archived", False))
                entity = entities[element["id"]]
                parent = records_by_dir.get(element["parent_dir"]) if kind != "theme" else None
                # Retiring a parent makes its whole subtree unavailable: effective
                # publication needs the element's own flag AND the parent's state.
                published = not archived and (parent is None or parent.published)
                desired = {
                    "position": self.position(metadata, location),
                    "published": published,
                    **element["provenance"],
                }
                if kind in ("theme", "learning_path", "lesson"):
                    desired["title"] = str(self.require(metadata, "title", location))
                    desired["description"] = str(metadata.get("description") or "")
                    desired["introduction_markdown"] = element["body"]
                    # Path and lesson covers were removed (#195): illustrations live
                    # on cards only, so stale cover references are cleared on sync.
                    desired["image_path"] = ""
                    desired["image_alt"] = ""
                if kind == "learning_path":
                    desired["theme"] = parent
                    # Front matter opt-in: general-knowledge paths feed the weekly
                    # Challenge; specialist paths (diving certifications) stay out.
                    desired["general_knowledge"] = bool(metadata.get("general_knowledge", False))
                elif kind == "lesson":
                    desired["learning_path"] = parent
                elif kind == "card":
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
                            path_key="illustration_path",
                            alt_key="illustration_alt",
                        )
                    )
                    if desired["illustration_path"]:
                        desired.update(self.illustration_metadata_fields(metadata))
                        # Freshly processed variants; an unchanged source hash keeps
                        # the row's stored variants and dimensions untouched.
                        desired.update(prepared_illustrations.get(str(element["id"]), {}))
                    else:
                        desired.update(self.empty_illustration_fields())
                elif kind == "question":
                    desired["lesson"] = parent
                    desired.update(self.question_fields(metadata, location))
                # Reject duplicate sibling positions in the manifest itself; the
                # two-phase move below handles valid reorders against existing rows.
                scope_key = (kind, None if kind == "theme" else str(element["parent_dir"]))
                siblings = positions_seen.setdefault(scope_key, {})
                if desired["position"] in siblings:
                    raise CommandError(
                        f"{location}: position {desired['position']} is already used by "
                        f"{siblings[desired['position']]} under the same parent"
                    )
                siblings[desired["position"]] = location
                record = self.upsert_record(
                    model, entity, desired, location, stats, kind, commit, seen_ids,
                    existing, occupancy, new_records,
                )
                if kind in ("theme", "learning_path", "lesson"):
                    records_by_dir[element["directory"]] = record
                if processed % progress_step == 0 or processed == total:
                    self.stdout.write(f"Content: {processed}/{total} elements processed.")
            self.bulk_insert(model, new_records)
        self.enforce_retirement(seen_ids)

    def enforce_retirement(self, seen_ids):
        """Block publishing when live database content vanishes from the library.

        Rows and learner history are never repaired or deleted here: retirement
        is an explicit `archived: true` flag in the content. A missing ID whose
        content is still published aborts the sync (the surrounding transaction
        rolls every write back); already-retired or unpublished leftovers are
        only reported.
        """
        unknown = list(ContentEntity.objects.exclude(pk__in=seen_ids))
        if not unknown:
            return
        unknown_ids = [entity.pk for entity in unknown]
        published_ids = set()
        recorded_ids = set()
        for model in (Theme, LearningPath, Lesson, Card, Question):
            published_ids.update(
                model.objects.filter(pk__in=unknown_ids, published=True).values_list("pk", flat=True)
            )
            recorded_ids.update(model.objects.filter(pk__in=unknown_ids).values_list("pk", flat=True))
        live = [
            entity
            for entity in unknown
            if not entity.archived and (entity.pk in published_ids or entity.pk not in recorded_ids)
        ]
        retired = [entity for entity in unknown if entity not in live]
        if retired:
            listing = ", ".join(f"{entity.kind} {entity.pk}" for entity in retired[:10])
            self.stdout.write(
                self.style.WARNING(
                    f"{len(retired)} retired/unpublished database content ID(s) are not in the "
                    f"library and were left untouched (no deletion, no auto-archive): {listing}"
                )
            )
        if live:
            listing = ", ".join(f"{entity.kind} {entity.pk}" for entity in live[:10])
            raise CommandError(
                f"{len(live)} published content ID(s) exist in the database but are missing from "
                f"the library: {listing}. Restore their files or retire them explicitly with "
                "archived: true. The sync was aborted; no rows were changed."
            )

    def sync_entity(self, element, archived, entities, new_entities):
        """Resolve the entity of one element from the preloaded rows.

        New entities are validated here and queued in new_entities for a batch
        insert before the records of this kind are written.
        """
        location = element["location"]
        kind = KINDS[element["kind"]]
        entity = entities.get(element["id"])
        if entity is None:
            entity = ContentEntity(id=element["id"], kind=kind, archived=archived)
            self.validate(entity, location)
            entities[element["id"]] = entity
            new_entities.append((entity, location))
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

    def upsert_record(self, model, entity, desired, location, stats, kind_label, commit, syncing_ids,
                      existing, occupancy, new_records):
        record = existing.get(entity.pk)
        if desired["last_changed_commit"] is None:
            # Without git history, keep the recorded commit for untouched files
            # and fall back to the synced commit only for new/changed content.
            if record is not None and record.content_hash == desired["content_hash"]:
                desired["last_changed_commit"] = record.last_changed_commit
            else:
                desired["last_changed_commit"] = commit
        self.free_position(model, entity.pk, desired, location, syncing_ids, existing, occupancy)
        if record is None:
            record = model(entity=entity, **desired)
            self.validate(record, location)
            new_records.append((record, location))
            occupancy[self.slot(record)] = record.pk
            stats[kind_label]["added"] += 1
            return record
        changed = {name: value for name, value in desired.items() if self.differs(record, name, value)}
        if not changed:
            stats[kind_label]["unchanged"] += 1
            return record
        old_slot = self.slot(record)
        for name, value in changed.items():
            setattr(record, name, value)
        self.validated_save(record, location)
        if occupancy.get(old_slot) == record.pk:
            del occupancy[old_slot]
        occupancy[self.slot(record)] = record.pk
        stats[kind_label]["updated"] += 1
        return record

    @staticmethod
    def differs(record, name, value):
        """Compare one desired field; relations compare by key, without a lookup."""
        field = type(record)._meta.get_field(name)
        if field.is_relation:
            return getattr(record, field.attname) != value.pk
        return getattr(record, name) != value

    @staticmethod
    def scope_attnames(model):
        return [f"{field}_id" for field in SCOPE_FIELDS[Command.kind_label(model)]]

    @staticmethod
    def slot(record):
        """(parent scope, position) key: the unit the position constraint protects."""
        scope = tuple(getattr(record, f"{field}_id") for field in SCOPE_FIELDS[Command.kind_label(type(record))])
        return scope, record.position

    def load_occupancy(self, model):
        """Map every stored (scope, position) slot to its row, in one light query."""
        columns = self.scope_attnames(model)
        return {
            (tuple(row[1:-1]), row[-1]): row[0]
            for row in model.objects.order_by().values_list("pk", *columns, "position")
        }

    def free_position(self, model, own_pk, desired, location, syncing_ids, existing, occupancy):
        """Move a synced sibling out of the target slot so reorders never collide.

        Sibling-position uniqueness is enforced immediately by the database, so
        swapping two rows needs a two-phase move: the occupant parks at a
        temporary position and receives its final slot when its own element is
        processed. Rows outside this sync keep their reserved positions; a
        target slot held by one of them is a real conflict, not a reorder.
        """
        scope = tuple(
            desired[field].pk for field in SCOPE_FIELDS[self.kind_label(model)]
        )
        key = (scope, desired["position"])
        occupant_pk = occupancy.get(key)
        if occupant_pk is None or occupant_pk == own_pk:
            return
        if occupant_pk not in syncing_ids:
            raise CommandError(
                f"{location}: position {desired['position']} is already reserved by "
                f"{occupant_pk}, which is not part of this sync"
            )
        temporary = TEMP_POSITION_OFFSET + desired["position"]
        model.objects.filter(pk=occupant_pk).update(position=temporary)
        parked = existing.get(occupant_pk)
        if parked is not None:
            parked.position = temporary
        del occupancy[key]
        occupancy[(scope, temporary)] = occupant_pk

    @staticmethod
    def kind_label(model):
        return {
            Theme: "theme",
            LearningPath: "learning_path",
            Lesson: "lesson",
            Card: "card",
            Question: "question",
        }.get(model) or {ContentEntity: "entity"}[model]

    @staticmethod
    def validate(instance, location):
        try:
            instance.full_clean()
        except ValidationError as error:
            raise CommandError(f"{location}: {error}") from error

    @classmethod
    def validated_save(cls, instance, location):
        cls.validate(instance, location)
        try:
            instance.save()
        except IntegrityError as error:
            raise CommandError(f"{location}: database rejected the row: {error}") from error

    @classmethod
    def bulk_insert(cls, model, pending):
        """Insert already validated rows in batches.

        If the database rejects a batch (for example a position collision
        with a row outside this sync), the rows are retried one by one so the
        error names the offending file exactly as a row-by-row import would.
        """
        if not pending:
            return
        try:
            with transaction.atomic():
                model.objects.bulk_create([instance for instance, _ in pending], batch_size=BULK_BATCH_SIZE)
        except IntegrityError as error:
            for instance, location in pending:
                cls.validated_save(instance, location)
            raise CommandError(f"database rejected a batch of {model.__name__} rows: {error}") from error
