"""Regression cases for the full-library UUID gate."""

from pathlib import Path
import tempfile
import unittest
import uuid

import yaml

from check_uuids import check_library


class UUIDCheckTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.theme = self.root / "themes" / "language"
        self.path = self.theme / "early-childhood-english"
        self.lesson = self.path / "greetings"
        self.files = [self.theme / "index.md", self.path / "index.md", self.lesson / "index.md", self.lesson / "cards" / "01.md"]
        for file in self.files:
            self.write(file, {"id": str(uuid.uuid4())})
        self.question = self.lesson / "questions" / "01.yaml"
        self.choices = [{"id": str(uuid.uuid4()), "text": text} for text in ["Did", "Do", "Does", "Are"]]
        self.question_data = {"id": str(uuid.uuid4()), "choices": self.choices, "correct_choice_ids": [self.choices[0]["id"]]}
        self.write(self.question, self.question_data)

    def write(self, path, data):
        path.parent.mkdir(parents=True, exist_ok=True)
        content = yaml.safe_dump(data)
        path.write_text(f"---\n{content}---\nBody\n" if path.suffix == ".md" else content)

    def assert_failure(self, message):
        errors, _ = check_library(self.root)
        self.assertTrue(any(message in error for error in errors), errors)

    def test_valid_ids_and_references(self):
        # Correct-choice references repeat a declared ID without declaring it again.
        self.assertEqual(check_library(self.root), ([], 9))

    def test_missing_id_on_each_content_kind(self):
        for file in self.files + [self.question]:
            with self.subTest(file=file):
                original = file.read_text()
                self.write(file, {"title": "Missing ID"})
                self.assert_failure("missing id")
                file.write_text(original)

    def test_missing_choice_id(self):
        del self.question_data["choices"][1]["id"]
        self.write(self.question, self.question_data)
        self.assert_failure("answer choice is missing id")

    def test_bad_format_and_non_v4_uuids(self):
        for value in ["not-a-uuid", str(uuid.uuid1()), str(uuid.uuid5(uuid.NAMESPACE_DNS, "example.org")), str(uuid.uuid4()).upper(), 42]:
            with self.subTest(value=value):
                self.write(self.files[0], {"id": value})
                self.assert_failure("expected a canonical lowercase UUIDv4")

    def test_duplicate_across_entity_types_reports_both_paths(self):
        duplicate = str(uuid.uuid4())
        self.write(self.files[0], {"id": duplicate})
        self.write(self.files[3], {"id": duplicate})
        errors, _ = check_library(self.root)
        duplicates = [error for error in errors if "duplicate UUID" in error]
        self.assertEqual(len(duplicates), 1)
        self.assertIn("language/index.md", duplicates[0])
        self.assertIn("cards/01.md", duplicates[0])

    def test_duplicate_choice_id(self):
        self.question_data["choices"][1]["id"] = self.choices[0]["id"]
        self.write(self.question, self.question_data)
        self.assert_failure("duplicate UUID")

    def test_duplicate_yaml_key_is_not_silently_overwritten(self):
        self.question.write_text(f"id: {uuid.uuid4()}\nid: {uuid.uuid4()}\n")
        self.assert_failure("duplicate YAML key")

    def test_missing_parent_index(self):
        for file in self.files[:3]:
            with self.subTest(file=file):
                original = file.read_text()
                file.unlink()
                self.assert_failure("missing")
                file.write_text(original)

    def test_unresolved_choice_reference(self):
        self.question_data["correct_choice_ids"] = [str(uuid.uuid4())]
        self.write(self.question, self.question_data)
        self.assert_failure("must resolve to a choice")

    def test_translation_has_no_choice_ids_and_requires_accepted_sentences(self):
        self.question_data = {"id": str(uuid.uuid4()), "type": "type_answer_question",
                              "accepted_answers": ["Good morning.", "Hello."]}
        self.write(self.question, self.question_data)
        self.assertEqual(check_library(self.root), ([], 5))
        self.question_data["accepted_answers"] = []
        self.write(self.question, self.question_data)
        self.assert_failure("expected nonempty answers")

    def test_misplaced_content_is_not_skipped(self):
        self.write(self.lesson / "misplaced.md", {"id": str(uuid.uuid4())})
        self.assert_failure("unexpected content location")


if __name__ == "__main__":
    unittest.main()
