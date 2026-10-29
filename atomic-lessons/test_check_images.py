"""Regression cases for optional card illustrations."""

import base64
from pathlib import Path
import tempfile
import unittest

import yaml

from check_images import check_images


PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jB0cAAAAASUVORK5CYII=")


class CardImageTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        lesson = self.root / "themes" / "language" / "english" / "greetings"
        self.cards = lesson / "cards"
        self.cards.mkdir(parents=True)
        self.card = self.cards / "01_hello.md"
        self.metadata = {"image": "hello.png", "image_alt": "A child waving hello."}
        (self.cards / "hello.png").write_bytes(PNG)
        self.write_card()

    def write_card(self):
        self.card.write_text("---\n" + yaml.safe_dump(self.metadata) + "---\n\nBody.\n")

    def assert_failure(self, text):
        errors, _ = check_images(self.root)
        self.assertTrue(any(text in error for error in errors), errors)

    def test_card_without_image_is_valid(self):
        del self.metadata["image"]
        del self.metadata["image_alt"]
        self.write_card()
        self.assertEqual(check_images(self.root), ([], 0))

    def test_sibling_image_is_valid(self):
        self.assertEqual(check_images(self.root), ([], 1))

    def test_dot_relative_filename_is_valid(self):
        self.metadata["image"] = "./hello.png"
        self.write_card()
        self.assertEqual(check_images(self.root), ([], 1))

    def test_non_string_image_rejected(self):
        for value in (42, []):
            with self.subTest(value=value):
                self.metadata["image"] = value
                self.write_card()
                self.assert_failure("expected a sibling image filename")

    def test_missing_image_file(self):
        (self.cards / "hello.png").unlink()
        self.assert_failure("does not exist")

    def test_external_absolute_nested_and_parent_paths_rejected(self):
        for value in ("https://example.org/hello.png", "/tmp/hello.png", "../hello.png", "assets/hello.png", "C:\\hello.png", " hello.png "):
            with self.subTest(value=value):
                self.metadata["image"] = value
                self.write_card()
                self.assert_failure("same folder")

    def test_symlink_outside_card_folder_rejected(self):
        outside = self.root / "outside.png"
        outside.write_bytes(PNG)
        (self.cards / "hello.png").unlink()
        (self.cards / "hello.png").symlink_to(outside)
        self.assert_failure("same folder")

    def test_text_renamed_as_image_rejected(self):
        (self.cards / "hello.png").write_text("This is not an image.")
        self.assert_failure("matching image header")

    def test_unsupported_extension_rejected(self):
        self.metadata["image"] = "hello.txt"
        (self.cards / "hello.txt").write_bytes(PNG)
        self.write_card()
        self.assert_failure("unsupported image extension")

    def test_alt_text_required(self):
        for value in (None, "", "   "):
            with self.subTest(value=value):
                self.metadata["image_alt"] = value
                self.write_card()
                self.assert_failure("image_alt")

    def test_all_cards_are_checked(self):
        other = self.root / "themes" / "language" / "english" / "animals" / "cards"
        other.mkdir(parents=True)
        (other / "01_dog.md").write_text("---\nimage: missing.png\n---\n")
        self.assert_failure("01_dog.md.image")

    def test_svg_is_valid(self):
        self.metadata["image"] = "hello.svg"
        (self.cards / "hello.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><circle r="1"/></svg>')
        self.write_card()
        self.assertEqual(check_images(self.root), ([], 1))

    def test_malformed_svg_rejected(self):
        self.metadata["image"] = "hello.svg"
        (self.cards / "hello.svg").write_text("<svg>")
        self.write_card()
        self.assert_failure("matching image header")


if __name__ == "__main__":
    unittest.main()
