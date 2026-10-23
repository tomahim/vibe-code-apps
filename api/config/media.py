"""Shared media storage for every app (issue #28).

With ``AWS_STORAGE_BUCKET_NAME`` set, the default storage is an S3 compatible
bucket (Railway Bucket). Without it, files go to ``MEDIA_ROOT`` on local disk,
so local development and tests need no network and no credentials.

To give another app a file field on the shared storage::

    from config.media import app_upload_to, validate_image_upload

    class Thing(models.Model):
        photo = models.ImageField(
            upload_to=app_upload_to("things"),  # keys: things/<uuid>.<ext>
            validators=[validate_image_upload],
            blank=True,
        )
"""

import uuid
from pathlib import PurePosixPath

from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible
from PIL import Image, UnidentifiedImageError

# Pillow format name -> (content type, file extension)
IMAGE_FORMATS = {
    "JPEG": ("image/jpeg", "jpg"),
    "PNG": ("image/png", "png"),
    "WEBP": ("image/webp", "webp"),
}


def build_storages(environ):
    """Return the ``STORAGES`` setting for the given environment."""
    storages = {
        "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    }
    bucket = environ.get("AWS_STORAGE_BUCKET_NAME", "").strip()
    if bucket:
        options = {
            "bucket_name": bucket,
            "region_name": environ.get("AWS_S3_REGION_NAME", "auto"),
            "addressing_style": environ.get("AWS_S3_ADDRESSING_STYLE", "virtual"),
            "querystring_auth": True,  # private bucket: reads use presigned URLs
            "querystring_expire": int(environ.get("AWS_QUERYSTRING_EXPIRE", "3600")),
            "default_acl": None,
            # AppUploadTo gives every upload a fresh UUID key. Skip the
            # redundant HeadObject existence check before each S3 upload.
            "file_overwrite": True,
        }
        endpoint = environ.get("AWS_S3_ENDPOINT_URL", "").strip()
        if endpoint:
            options["endpoint_url"] = endpoint
        # AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY are read by boto3 itself.
        storages["default"] = {"BACKEND": "storages.backends.s3.S3Storage", "OPTIONS": options}
    return storages


@deconstructible
class AppUploadTo:
    """``upload_to`` that stores files as ``<prefix>/<uuid>.<ext>``.

    The name is random and never contains user supplied path segments. The
    extension comes from the content sniffed by Pillow when possible.
    """

    def __init__(self, prefix):
        self.prefix = prefix.strip("/")

    def __call__(self, instance, filename):
        extension = PurePosixPath(filename).suffix.lower().lstrip(".")
        if extension not in {ext for _, ext in IMAGE_FORMATS.values()}:
            extension = "bin"
        return f"{self.prefix}/{uuid.uuid4().hex}.{extension}"

    def __eq__(self, other):
        return isinstance(other, AppUploadTo) and other.prefix == self.prefix


def app_upload_to(prefix):
    return AppUploadTo(prefix)


def validate_image_upload(file):
    """Reject files that are too large or not a real jpeg, png or webp."""
    max_bytes = settings.MEDIA_UPLOAD_MAX_BYTES
    if file.size > max_bytes:
        raise ValidationError(
            f"File too large ({file.size} bytes). The limit is {max_bytes // (1024 * 1024)} MB.",
            code="file_too_large",
        )
    position = file.tell() if hasattr(file, "tell") else 0
    try:
        file.seek(0)
        with Image.open(file) as image:
            image.verify()
            detected = image.format
    except (UnidentifiedImageError, OSError, SyntaxError):
        raise ValidationError("Upload a valid jpeg, png or webp image.", code="invalid_image") from None
    finally:
        file.seek(position)
    if detected not in IMAGE_FORMATS:
        raise ValidationError("Only jpeg, png and webp images are allowed.", code="invalid_image_type")
