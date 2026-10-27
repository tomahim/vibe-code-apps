"""Require a sibling illustration for every learning path."""

from __future__ import annotations

import argparse
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

import yaml

from check_uuids import child_directories, load_metadata


IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}


def has_image_header(path: Path) -> bool:
    """Reject text and empty files renamed with an image extension."""
    with path.open("rb") as handle:
        header = handle.read(16)
    suffix = path.suffix.lower()
    if suffix == ".png":
        return header.startswith(b"\x89PNG\r\n\x1a\n")
    if suffix in (".jpg", ".jpeg"):
        return header.startswith(b"\xff\xd8\xff")
    if suffix == ".webp":
        return header[:4] == b"RIFF" and header[8:12] == b"WEBP"
    if suffix == ".gif":
        return header.startswith((b"GIF87a", b"GIF89a"))
    if suffix == ".svg":
        try:
            return ET.parse(path).getroot().tag in ("svg", "{http://www.w3.org/2000/svg}svg")
        except ET.ParseError:
            return False
    return False


def check_images(root: Path) -> tuple[list[str], int]:
    errors = []
    count = 0
    for theme in child_directories(root / "themes"):
        for learning_path in child_directories(theme):
            index = learning_path / "index.md"
            relative = index.relative_to(root).as_posix()
            try:
                data = load_metadata(index)
            except (ValueError, OSError, yaml.YAMLError) as error:
                errors.append(f"{relative}: {error}")
                continue
            image = data.get("image")
            if not isinstance(image, str) or not image.strip():
                errors.append(f"{relative}.image: every learning path needs an image filename")
                continue
            # Accept a sibling filename, optionally prefixed with './'.
            filename = image[2:] if image.startswith("./") else image
            if (
                not filename
                or image != image.strip()
                or any(c in filename for c in ("/", "\\", ":"))
                or filename in (".", "..")
            ):
                errors.append(f"{relative}.image: use a relative filename in the same folder as index.md")
                continue
            candidate = learning_path / filename
            if candidate.resolve().parent != learning_path.resolve():
                errors.append(f"{relative}.image: image must remain in the same folder as index.md")
                continue
            if not candidate.is_file():
                errors.append(f"{relative}.image: image file does not exist: {filename}")
                continue
            if candidate.suffix.lower() not in IMAGE_EXTENSIONS:
                errors.append(f"{relative}.image: unsupported image extension: {candidate.suffix}")
                continue
            try:
                valid = has_image_header(candidate)
            except OSError as error:
                errors.append(f"{relative}.image: cannot read image: {error}")
                continue
            if not valid:
                errors.append(f"{relative}.image: file does not have a matching image header: {filename}")
                continue
            alt = data.get("image_alt")
            if not isinstance(alt, str) or not alt.strip():
                errors.append(f"{relative}.image_alt: provide a nonempty description of the illustration")
                continue
            count += 1
    if not child_directories(root / "themes"):
        errors.append("themes/: no theme folders found")
    return errors, count


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent)
    arguments = parser.parse_args()
    errors, count = check_images(arguments.root.resolve())
    if errors:
        print("Learning path image check failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print(f"Atomic lessons: {count} learning paths have a local illustration and alt text.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
