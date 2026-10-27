"""Regression cases for required learning-path illustrations."""

import base64
from pathlib import Path
import tempfile
import unittest

import yaml

from check_images import check_images


PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jB0cAAAAASUVORK5CYII=")


class LearningPathImageTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.path = self.root / "themes" / "language" / "english"
        self.path.mkdir(parents=True)
        self.index = self.path / "index.md"
        self.metadata = {"image": "cover.png", "image_alt": "A caregiver sharing a book with a baby."}
        (self.path / "cover.png").write_bytes(PNG)
        self.write_index()

    def write_index(self):
        self.index.write_text("---\n" + yaml.safe_dump(self.metadata) + "---\n")

    def assert_failure(self, text):
        errors, _ = check_images(self.root)
        self.assertTrue(any(text in error for error in errors), errors)

    def test_sibling_image_is_valid(self):
        self.assertEqual(check_images(self.root), ([], 1))

    def test_dot_relative_filename_is_valid(self):
        self.metadata["image"] = "./cover.png"
        self.write_index()
        self.assertEqual(check_images(self.root), ([], 1))

    def test_missing_or_invalid_image_field(self):
        for value in (None, "", "  ", 42, []):
            with self.subTest(value=value):
                self.metadata["image"] = value
                self.write_index()
                self.assert_failure("needs an image filename")

    def test_missing_image_file(self):
        (self.path / "cover.png").unlink()
        self.assert_failure("does not exist")

    def test_external_absolute_nested_and_parent_paths_rejected(self):
        for value in ("https://example.org/cover.png", "/tmp/cover.png", "../cover.png", "assets/cover.png", "C:\\cover.png", " cover.png "):
            with self.subTest(value=value):
                self.metadata["image"] = value
                self.write_index()
                self.assert_failure("same folder")

    def test_symlink_outside_learning_path_rejected(self):
        outside = self.root / "outside.png"
        outside.write_bytes(PNG)
        (self.path / "cover.png").unlink()
        (self.path / "cover.png").symlink_to(outside)
        self.assert_failure("same folder")

    def test_text_renamed_as_image_rejected(self):
        (self.path / "cover.png").write_text("This is not an image.")
        self.assert_failure("matching image header")

    def test_unsupported_extension_rejected(self):
        self.metadata["image"] = "cover.txt"
        (self.path / "cover.txt").write_bytes(PNG)
        self.write_index()
        self.assert_failure("unsupported image extension")

    def test_alt_text_required(self):
        for value in (None, "", "   "):
            with self.subTest(value=value):
                self.metadata["image_alt"] = value
                self.write_index()
                self.assert_failure("image_alt")

    def test_all_learning_paths_are_checked(self):
        second = self.root / "themes" / "language" / "spanish"
        second.mkdir()
        (second / "index.md").write_text("---\ntitle: Spanish\n---\n")
        self.assert_failure("spanish/index.md.image")

    def test_svg_is_valid(self):
        self.metadata["image"] = "cover.svg"
        (self.path / "cover.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><circle r="1"/></svg>')
        self.write_index()
        self.assertEqual(check_images(self.root), ([], 1))

    def test_malformed_svg_rejected(self):
        self.metadata["image"] = "cover.svg"
        (self.path / "cover.svg").write_text("<svg>")
        self.write_index()
        self.assert_failure("matching image header")


if __name__ == "__main__":
    unittest.main()
