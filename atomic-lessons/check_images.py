"""Validate optional card illustrations in the atomic-lessons library.

Learning paths and lessons carry no images (#195): only cards may declare an
optional sibling image with alt text. When a card declares one, the file must
sit beside the card's Markdown file, use an optimized raster format (PNG,
JPEG or WebP, at most 400 KB and 1600 px wide so sync-time WebP variants stay
cheap), and come with useful alt text plus credit and license metadata.
Original artwork is exempt from the credit rule with `image_license: original`.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

import yaml
from PIL import Image, UnidentifiedImageError

from check_uuids import child_directories, load_metadata


# Raster formats only: the sync turns card images into WebP variants with
# Pillow, which cannot rasterize SVG. Sources are optimized before commit.
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
MAX_IMAGE_BYTES = 400 * 1024
MAX_IMAGE_WIDTH = 1600


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


def card_files(root: Path):
    """Yield every card Markdown file in parent-before-child order."""
    for theme in child_directories(root / "themes"):
        for learning_path in child_directories(theme):
            for lesson in child_directories(learning_path):
                yield from sorted((lesson / "cards").glob("*.md"))


def image_dimensions(path: Path) -> tuple[int, int]:
    """Real pixel dimensions; rejects files Pillow cannot decode."""
    with Image.open(path) as image:
        image.verify()
    with Image.open(path) as image:
        return image.size


def check_card_image(root: Path, card: Path, data: dict) -> list[str]:
    """Validate one card's optional image declaration."""
    image = data.get("image")
    if image is None or (isinstance(image, str) and not image.strip()):
        return []
    relative = card.relative_to(root).as_posix()
    if not isinstance(image, str):
        return [f"{relative}.image: expected a sibling image filename, got {image!r}"]
    # Accept a sibling filename, optionally prefixed with './'.
    filename = image[2:] if image.startswith("./") else image
    if (
        not filename
        or image != image.strip()
        or any(c in filename for c in ("/", "\\", ":"))
        or filename in (".", "..")
    ):
        return [f"{relative}.image: use a relative filename in the same folder as the card"]
    candidate = card.parent / filename
    if candidate.resolve().parent != card.parent.resolve():
        return [f"{relative}.image: image must remain in the same folder as the card"]
    if not candidate.is_file():
        return [f"{relative}.image: image file does not exist: {filename}"]
    if candidate.suffix.lower() not in IMAGE_EXTENSIONS:
        return [f"{relative}.image: unsupported image extension: {candidate.suffix}"]
    try:
        valid = has_image_header(candidate)
    except OSError as error:
        return [f"{relative}.image: cannot read image: {error}"]
    if not valid:
        return [f"{relative}.image: file does not have a matching image header: {filename}"]
    if candidate.stat().st_size > MAX_IMAGE_BYTES:
        return [f"{relative}.image: source image exceeds {MAX_IMAGE_BYTES // 1024} KB; optimize it before committing"]
    try:
        width, _ = image_dimensions(candidate)
    except (UnidentifiedImageError, OSError, SyntaxError) as error:
        return [f"{relative}.image: cannot decode image: {error}"]
    if width > MAX_IMAGE_WIDTH:
        return [f"{relative}.image: source image is {width} px wide; keep it at {MAX_IMAGE_WIDTH} px or less"]
    alt = data.get("image_alt")
    if not isinstance(alt, str) or not alt.strip():
        return [f"{relative}.image_alt: provide a nonempty description of the illustration"]
    license_value = str(data.get("image_license") or "").strip()
    if license_value != "original":
        if not str(data.get("image_credit") or "").strip():
            return [f"{relative}.image_credit: credit the author, or use image_license: original for your own artwork"]
        if not license_value:
            return [f"{relative}.image_license: name the license (for example 'CC BY-SA 4.0'), or 'original'"]
    return []


def check_images(root: Path) -> tuple[list[str], int]:
    errors = []
    count = 0
    for card in card_files(root):
        try:
            data = load_metadata(card)
        except (ValueError, OSError, yaml.YAMLError) as error:
            errors.append(f"{card.relative_to(root).as_posix()}: {error}")
            continue
        card_errors = check_card_image(root, card, data)
        errors.extend(card_errors)
        if not card_errors and str(data.get("image") or "").strip():
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
        print("Card image check failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print(f"Atomic lessons: {count} cards declare a valid local illustration and alt text.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
