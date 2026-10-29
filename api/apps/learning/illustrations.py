"""WebP variant generation and media-bucket upload for card illustrations (#195).

At sync time the importer turns each changed card image into WebP variants
(640 and 1280 px wide) with Pillow and uploads them to the shared media
bucket under content-hashed keys, before any database write. Replacing an
image changes its SHA-256, so old and new objects coexist; objects are never
deleted by the sync.
"""

from __future__ import annotations

import hashlib
from io import BytesIO
from pathlib import Path

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from PIL import Image, UnidentifiedImageError

VARIANT_WIDTHS = (640, 1280)
WEBP_QUALITY = 82
RASTER_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp"}


def source_hash(path: Path) -> str:
    """SHA-256 of the source image bytes, the change key for re-processing."""
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def bucket_available() -> bool:
    """Variant upload needs the S3 media bucket, not the local dev fallback."""
    from storages.backends.s3 import S3Storage

    return isinstance(default_storage, S3Storage)


def build_variants(path: Path) -> tuple[dict[int, bytes], int, int]:
    """Return ({width: webp bytes}, source width, source height).

    Variants are never upscaled: a source narrower than 1280 px gets only the
    widths below its own, and a source at or under 640 px gets a single
    variant at its native width. SVG and other non-raster files cannot be
    resized by Pillow and raise, so callers restrict processing to raster
    suffixes.
    """
    with Image.open(path) as image:
        image.load()
        width, height = image.size
        targets = [target for target in VARIANT_WIDTHS if target < width] or [width]
        variants = {}
        for target in targets:
            if target == width:
                resized = image
            else:
                resized = image.resize((target, round(height * target / width)), Image.LANCZOS)
            buffer = BytesIO()
            resized.save(buffer, "WEBP", quality=WEBP_QUALITY, method=4)
            variants[target] = buffer.getvalue()
        if resized is not image:
            resized.close()
    return variants, width, height


def variant_key(card_id, sha: str, width: int) -> str:
    return f"learning/{card_id}/{sha}-{width}.webp"


def upload_variants(card_id, sha: str, variants: dict[int, bytes]) -> dict[str, str]:
    """Store every variant on the default storage; keys are content-addressed."""
    keys = {}
    for width, data in sorted(variants.items()):
        key = variant_key(card_id, sha, width)
        default_storage.save(key, ContentFile(data))
        keys[str(width)] = key
    return keys


def process_card_image(card_id, path: Path) -> dict:
    """Hash, resize and upload one card image; returns the stored field values."""
    sha = source_hash(path)
    variants, width, height = build_variants(path)
    return {
        "illustration_source_hash": sha,
        "illustration_width": width,
        "illustration_height": height,
        "illustration_variants": upload_variants(card_id, sha, variants),
    }


def raster_image(path: Path) -> bool:
    """Only raster images can become WebP variants."""
    return path.suffix.lower() in RASTER_SUFFIXES
