"""Regression cases for the content-ID retirement gate."""

import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest import mock
import uuid

import yaml

from check_retired_ids import check_retirement, resolve_base


class RetiredIDsCheckTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name)
        self.root = self.repo / "atomic-lessons"
        self.git("init", "-q")
        self.git("config", "user.email", "ci@example.invalid")
        self.git("config", "user.name", "CI")
        self.card_id = str(uuid.uuid4())
        self.card = self.root / "themes/language/path/lesson/cards/01.md"
        for file in [
            self.root / "themes/language/index.md",
            self.root / "themes/language/path/index.md",
            self.root / "themes/language/path/lesson/index.md",
            self.card,
        ]:
            self.write(file, {"id": str(uuid.uuid4())} if file != self.card else {"id": self.card_id})
        self.write(
            self.root / "themes/language/path/lesson/questions/01.yaml",
            {"id": str(uuid.uuid4()), "choices": [{"id": str(uuid.uuid4()), "text": "Did"}]},
        )
        self.git("add", ".")
        self.git("commit", "-qm", "base")
        self.base = self.git("rev-parse", "HEAD").stdout.strip()

    def git(self, *args):
        result = subprocess.run(["git", *args], cwd=self.repo, capture_output=True, text=True)
        if result.returncode != 0:
            raise AssertionError(f"git {' '.join(args)} failed: {result.stderr}")
        return result

    def write(self, path, data):
        path.parent.mkdir(parents=True, exist_ok=True)
        content = yaml.safe_dump(data)
        path.write_text(f"---\n{content}---\nBody\n" if path.suffix == ".md" else content)

    def check(self):
        return check_retirement(self.root, self.repo, self.base)

    def test_unchanged_library_passes(self):
        errors, count = self.check()
        self.assertEqual(errors, [])
        self.assertEqual(count, 5)

    def test_new_content_passes(self):
        self.write(self.root / "themes/language/path/lesson/cards/02.md", {"id": str(uuid.uuid4())})
        errors, _ = self.check()
        self.assertEqual(errors, [])

    def test_deleting_a_card_is_rejected(self):
        self.card.unlink()
        errors, _ = self.check()
        self.assertTrue(any(self.card_id in error and "archived: true" in error for error in errors), errors)

    def test_moving_a_card_keeps_its_id_and_passes(self):
        moved = self.root / "themes/language/path/lesson/cards/02_renamed.md"
        self.card.rename(moved)
        errors, _ = self.check()
        self.assertEqual(errors, [])

    def test_explicit_archive_passes(self):
        self.write(self.card, {"id": self.card_id, "archived": True})
        errors, _ = self.check()
        self.assertEqual(errors, [])

    def test_id_cannot_change_kind(self):
        lesson = self.root / "themes/language/path/lesson/index.md"
        original = lesson.read_text()
        self.write(lesson, {"id": self.card_id})
        self.card.unlink()
        errors, _ = self.check()
        self.assertTrue(any("cannot change kind" in error for error in errors), errors)
        lesson.write_text(original)

    def test_unknown_base_revision_is_an_error(self):
        errors, count = check_retirement(self.root, self.repo, "does-not-exist")
        self.assertEqual(count, 0)
        self.assertTrue(any("cannot read the base revision" in error for error in errors), errors)


class ResolveBaseTests(unittest.TestCase):
    """A force push can orphan the push event's before-commit: fall back."""

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name)
        self.git("init", "-q")
        self.git("config", "user.email", "ci@example.invalid")
        self.git("config", "user.name", "CI")
        (self.repo / "file.txt").write_text("content\n")
        self.git("add", ".")
        self.git("commit", "-qm", "base")
        self.master = self.git("rev-parse", "HEAD").stdout.strip()
        self.git("update-ref", "refs/remotes/origin/master", self.master)

    def git(self, *args):
        result = subprocess.run(["git", *args], cwd=self.repo, capture_output=True, text=True)
        if result.returncode != 0:
            raise AssertionError(f"git {' '.join(args)} failed: {result.stderr}")
        return result

    def push_event(self, before):
        event = Path(self.temp.name) / "event.json"
        event.write_text(json.dumps({"before": before}))
        return {
            "GITHUB_BASE_REF": "",
            "GITHUB_EVENT_NAME": "push",
            "GITHUB_EVENT_PATH": str(event),
        }

    def test_readable_push_base_wins(self):
        with mock.patch.dict(os.environ, self.push_event(self.master)):
            self.assertEqual(resolve_base(self.repo, None), self.master)

    def test_unreadable_push_base_falls_back_to_the_master_merge_base(self):
        with mock.patch.dict(os.environ, self.push_event("f" * 40)):
            self.assertEqual(resolve_base(self.repo, None), self.master)


if __name__ == "__main__":
    unittest.main()
