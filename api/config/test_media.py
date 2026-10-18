import io
import os
from unittest import mock

import boto3
from django.core.exceptions import ValidationError
from django.db import transaction
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase, TestCase, override_settings
from moto import mock_aws
from PIL import Image

from .media import app_upload_to, build_storages, validate_image_upload


def image_bytes(fmt="PNG", size=(4, 4)):
    buffer = io.BytesIO()
    Image.new("RGB", size, "red").save(buffer, fmt)
    return buffer.getvalue()


class StorageSelectionTests(SimpleTestCase):
    def test_local_disk_without_bucket(self):
        default = build_storages({})["default"]
        self.assertEqual(default["BACKEND"], "django.core.files.storage.FileSystemStorage")

    def test_bucket_env_selects_s3(self):
        env = {
            "AWS_STORAGE_BUCKET_NAME": "genious-media",
            "AWS_S3_ENDPOINT_URL": "https://storage.railway.app",
            "AWS_QUERYSTRING_EXPIRE": "600",
        }
        default = build_storages(env)["default"]
        self.assertEqual(default["BACKEND"], "storages.backends.s3.S3Storage")
        options = default["OPTIONS"]
        self.assertEqual(options["bucket_name"], "genious-media")
        self.assertEqual(options["endpoint_url"], "https://storage.railway.app")
        self.assertEqual(options["addressing_style"], "virtual")
        self.assertEqual(options["querystring_expire"], 600)
        self.assertTrue(options["querystring_auth"])
        self.assertFalse(options["file_overwrite"])
        self.assertIsNone(options["default_acl"])

    def test_addressing_style_is_switchable(self):
        env = {"AWS_STORAGE_BUCKET_NAME": "b", "AWS_S3_ADDRESSING_STYLE": "path"}
        self.assertEqual(build_storages(env)["default"]["OPTIONS"]["addressing_style"], "path")

    def test_static_files_unchanged(self):
        backend = build_storages({})["staticfiles"]["BACKEND"]
        self.assertEqual(backend, "whitenoise.storage.CompressedManifestStaticFilesStorage")


class UploadNamingTests(SimpleTestCase):
    def test_prefix_and_random_name(self):
        upload_to = app_upload_to("recipes")
        first = upload_to(None, "My Photo.PNG")
        second = upload_to(None, "My Photo.PNG")
        self.assertRegex(first, r"^recipes/[0-9a-f]{32}\.png$")
        self.assertNotEqual(first, second)

    def test_user_supplied_path_is_ignored(self):
        name = app_upload_to("recipes")(None, "../../other/secret.jpg")
        self.assertRegex(name, r"^recipes/[0-9a-f]{32}\.jpg$")

    def test_unknown_extension(self):
        self.assertTrue(app_upload_to("recipes")(None, "x.exe").endswith(".bin"))


class ImageValidationTests(SimpleTestCase):
    def upload(self, content, name="a.png"):
        return SimpleUploadedFile(name, content)

    def test_accepts_png_jpeg_webp(self):
        for fmt in ("PNG", "JPEG", "WEBP"):
            with self.subTest(fmt=fmt):
                validate_image_upload(self.upload(image_bytes(fmt)))

    def test_rejects_non_image_with_image_extension(self):
        with self.assertRaises(ValidationError):
            validate_image_upload(self.upload(b"not an image at all", "evil.png"))

    def test_rejects_other_image_types(self):
        with self.assertRaises(ValidationError) as caught:
            validate_image_upload(self.upload(image_bytes("GIF"), "a.gif"))
        self.assertEqual(caught.exception.code, "invalid_image_type")

    @override_settings(MEDIA_UPLOAD_MAX_BYTES=100)
    def test_rejects_oversized(self):
        with self.assertRaises(ValidationError) as caught:
            validate_image_upload(self.upload(image_bytes("PNG", (64, 64))))
        self.assertEqual(caught.exception.code, "file_too_large")


S3_ENV = {
    "AWS_ACCESS_KEY_ID": "test",
    "AWS_SECRET_ACCESS_KEY": "test",
    "AWS_STORAGE_BUCKET_NAME": "genious-media",
    "AWS_S3_REGION_NAME": "us-east-1",
    "AWS_QUERYSTRING_EXPIRE": "120",
}


@mock_aws
class S3StorageTests(TestCase):
    def setUp(self):
        patcher = mock.patch.dict(os.environ, S3_ENV)
        patcher.start()
        self.addCleanup(patcher.stop)
        boto3.client("s3", region_name="us-east-1").create_bucket(Bucket="genious-media")
        self.storages = build_storages(S3_ENV)
        self.settings_override = override_settings(STORAGES=self.storages)
        self.settings_override.enable()
        self.addCleanup(self.settings_override.disable)

    def storage(self):
        from django.core.files.storage import storages

        storages._storages = {}  # drop instances cached for other settings
        return storages["default"]

    def test_file_lands_in_bucket_under_prefix_and_url_is_presigned(self):
        from apps.recipes.models import Recipe

        recipe = Recipe(title="Pasta")
        recipe.image.save("pasta.png", ContentFile(image_bytes()), save=False)
        recipe.save()
        self.assertRegex(recipe.image.name, r"^recipes/[0-9a-f]{32}\.png$")
        keys = [
            item["Key"]
            for item in boto3.client("s3", region_name="us-east-1")
            .list_objects_v2(Bucket="genious-media")
            .get("Contents", [])
        ]
        self.assertEqual(keys, [recipe.image.name])
        url = recipe.image.url
        self.assertIn("Signature", url)
        self.assertIn("Expires", url)

    def test_storage_failure_leaves_no_row(self):
        from apps.recipes.models import Recipe

        recipe = Recipe(title="Broken")
        recipe.image = ContentFile(image_bytes(), name="a.png")
        with mock.patch(
            "storages.backends.s3.S3Storage._save", side_effect=OSError("bucket unreachable")
        ), self.assertRaises(OSError), transaction.atomic():
            recipe.save()
        self.assertEqual(Recipe.objects.count(), 0)
