"""Validate and import recipe archives without extracting user-supplied paths."""

import csv
import io
import json
import logging
import stat
import zipfile
import zlib
from pathlib import PurePosixPath

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.db import transaction

from config.media import IMAGE_FORMATS

from .forms import RecipeForm, clean_ingredients
from .models import Ingredient, RecipeIngredient

logger = logging.getLogger(__name__)

MAX_ARCHIVE_BYTES = 50 * 1024 * 1024
MAX_UNCOMPRESSED_BYTES = 100 * 1024 * 1024
MAX_CSV_BYTES = 2 * 1024 * 1024
MAX_RECIPES = 500
MAX_ENTRIES = 1002
CSV_COLUMNS = ("title", "source_url", "image", "ingredients")


def _archive_files(archive):
    entries = archive.infolist()
    if len(entries) > MAX_ENTRIES:
        raise ValidationError(f"ZIP contains too many entries (maximum {MAX_ENTRIES}).")
    if sum(entry.file_size for entry in entries) > MAX_UNCOMPRESSED_BYTES:
        raise ValidationError("ZIP contents exceed the 100 MiB uncompressed limit.")
    files = {}
    seen = set()
    for entry in entries:
        name = entry.filename
        parts = name.removesuffix("/").split("/")
        if "\\" in name or any(part in {"", ".", ".."} for part in parts):
            raise ValidationError(f"Unsafe ZIP path: {name}.")
        if name in seen:
            raise ValidationError(f"Duplicate ZIP entry: {name}.")
        seen.add(name)
        if stat.S_ISLNK(entry.external_attr >> 16) or entry.flag_bits & 1:
            raise ValidationError("ZIP must not contain symbolic links or encrypted entries.")
        # Finder adds these when compressing a folder on macOS.
        if parts[0] == "__MACOSX" or parts[-1] == ".DS_Store":
            continue
        if entry.is_dir() and name == "images/":
            continue
        if name == "data.csv" and not entry.is_dir():
            if entry.file_size > MAX_CSV_BYTES:
                raise ValidationError("data.csv exceeds the 2 MiB limit.")
        elif len(parts) == 2 and parts[0] == "images" and not entry.is_dir():
            if entry.file_size > settings.MEDIA_UPLOAD_MAX_BYTES:
                raise ValidationError(f"Image {name} exceeds the configured image upload limit.")
        else:
            raise ValidationError("ZIP must contain data.csv at its root and image files directly in images/.")
        files[name] = entry
    if "data.csv" not in files:
        raise ValidationError("ZIP must contain data.csv at its root.")
    return files


def _prepare_recipes(archive, files):
    csv_text = archive.read(files["data.csv"]).decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(csv_text, newline=""), strict=True)
    if reader.fieldnames is None or sorted(reader.fieldnames) != sorted(CSV_COLUMNS):
        raise ValidationError(f"data.csv must have exactly these columns: {', '.join(CSV_COLUMNS)}.")
    prepared = []
    images = {}
    for row_number, row in enumerate(reader, start=2):
        if None in row or None in row.values():
            raise ValidationError(f"CSV row {row_number}: expected {len(CSV_COLUMNS)} values.")
        if not any(value.strip() for value in row.values()):
            continue
        if len(prepared) >= MAX_RECIPES:
            raise ValidationError(f"A batch may contain at most {MAX_RECIPES} recipes.")
        try:
            ingredients = clean_ingredients(json.loads(row["ingredients"]))
            image_name = row["image"].strip()
            uploaded = {}
            if image_name:
                if PurePosixPath(image_name).name != image_name or "\\" in image_name:
                    raise ValidationError("image must be a filename from images/, such as 1.jpg.")
                path = f"images/{image_name}"
                if path not in files:
                    raise ValidationError(f"Image {path} was not found in the ZIP.")
                if path not in images:
                    images[path] = ContentFile(archive.read(files[path]), name=image_name)
                uploaded["image"] = images[path]
            form = RecipeForm(row, uploaded)
            if not form.is_valid():
                raise ValidationError(
                    [f"{field}: {message}" for field, errors in form.errors.items() for message in errors]
                )
            recipe = form.save(commit=False)
            if recipe.image:
                # Use the detected format, rather than trusting the filename suffix.
                extension = IMAGE_FORMATS[form.cleaned_data["image"].image.format][1]
                recipe.image.name = f"image.{extension}"
            prepared.append((recipe, ingredients))
        except json.JSONDecodeError:
            raise ValidationError(f"CSV row {row_number}: ingredients must be a valid JSON array.") from None
        except ValidationError as exc:
            raise ValidationError([f"CSV row {row_number}: {message}" for message in exc.messages]) from None
    if not prepared:
        raise ValidationError("data.csv must contain at least one recipe.")
    return prepared


def prepare_archive(upload):
    """Validate every row and referenced image before writing to DB or storage."""
    if upload.size > MAX_ARCHIVE_BYTES:
        raise ValidationError("ZIP exceeds the 50 MiB upload limit.")
    upload.seek(0)
    try:
        with zipfile.ZipFile(upload) as archive:
            return _prepare_recipes(archive, _archive_files(archive))
    except UnicodeDecodeError:
        raise ValidationError("data.csv must use UTF-8 encoding.") from None
    except csv.Error:
        raise ValidationError("data.csv is not valid CSV; check its quoting and column values.") from None
    except (
        zipfile.BadZipFile, zipfile.LargeZipFile, OSError, EOFError,
        RuntimeError, NotImplementedError, zlib.error,
    ):
        raise ValidationError("Upload a valid, unencrypted ZIP archive with supported compression.") from None


def import_recipes(upload):
    """Create a whole batch, compensating completed uploads if saving fails."""
    prepared = prepare_archive(upload)
    saved_images = []
    ingredient_cache = {}
    try:
        with transaction.atomic():
            for recipe, ingredients in prepared:
                if recipe.image:
                    recipe.image.save(recipe.image.name, recipe.image.file, save=False)
                    saved_images.append((recipe.image.storage, recipe.image.name))
                recipe.save()
                entries = []
                for name, quantity in ingredients:
                    if name not in ingredient_cache:
                        ingredient_cache[name], _ = Ingredient.objects.get_or_create(name=name)
                    entries.append(RecipeIngredient(
                        recipe=recipe, ingredient=ingredient_cache[name], quantity=quantity,
                    ))
                RecipeIngredient.objects.bulk_create(entries)
    except Exception:
        # Object storage does not participate in database transactions.
        for storage, name in saved_images:
            try:
                storage.delete(name)
            except Exception:
                logger.exception("Could not remove image after failed recipe batch import")
        raise
    return len(prepared)
