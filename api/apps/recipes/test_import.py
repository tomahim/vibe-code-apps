import csv
import io
import json
import warnings
import zipfile
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest import mock

import boto3
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase, override_settings
from django.urls import reverse
from moto import mock_aws
from PIL import Image

from .importing import CSV_COLUMNS, import_recipes
from .models import Ingredient, Recipe, RecipeIngredient
from .prompts import recipe_import_prompt


def image_bytes(fmt="JPEG"):
    output = io.BytesIO()
    Image.new("RGB", (4, 4), "red").save(output, fmt)
    return output.getvalue()


def recipe_row(**overrides):
    return {
        "title": "Tomato pasta",
        "source_url": "https://example.com/pasta",
        "image": "1.jpg",
        "ingredients": json.dumps([
            {"name": " Tomato ", "quantity": "200 g"},
            {"name": "pasta", "quantity": "150 g"},
        ]),
        **overrides,
    }


def archive_upload(rows=None, *, images=None, csv_text=None, extra_entries=()):
    if csv_text is None:
        output = io.StringIO(newline="")
        writer = csv.DictWriter(output, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        writer.writerows(rows if rows is not None else [recipe_row()])
        csv_text = output.getvalue()
    data = io.BytesIO()
    with zipfile.ZipFile(data, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("data.csv", csv_text)
        for name, content in (images if images is not None else {"1.jpg": image_bytes()}).items():
            archive.writestr(f"images/{name}", content)
        for name, content in extra_entries:
            archive.writestr(name, content)
    return SimpleUploadedFile("recipes.zip", data.getvalue(), "application/zip")


class RecipeImportTests(TestCase):
    def setUp(self):
        self.media = TemporaryDirectory()
        self.addCleanup(self.media.cleanup)
        settings = override_settings(
            MEDIA_ROOT=self.media.name,
            STORAGES={
                "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
                "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
            },
        )
        settings.enable()
        self.addCleanup(settings.disable)

    def media_files(self):
        return [path for path in Path(self.media.name).rglob("*") if path.is_file()]

    def assert_rejected(self, upload, message):
        with self.assertRaisesMessage(ValidationError, message):
            import_recipes(upload)
        self.assertEqual(Recipe.objects.count(), 0)
        self.assertEqual(Ingredient.objects.count(), 0)
        self.assertEqual(RecipeIngredient.objects.count(), 0)
        self.assertEqual(self.media_files(), [])

    def test_imports_recipes_links_ingredients_quantities_and_images(self):
        existing = Ingredient.objects.create(name="tomato")
        rows = [recipe_row(), recipe_row(
            title="Salade, été",
            source_url="",
            image="2.png",
            ingredients=json.dumps([{"name": "TOMATO"}, {"name": "salt", "quantity": " 1 pinch "}]),
        )]
        count = import_recipes(archive_upload(rows, images={"1.jpg": image_bytes(), "2.png": image_bytes("PNG")}))
        self.assertEqual(count, 2)
        self.assertEqual(Recipe.objects.count(), 2)
        self.assertEqual(Ingredient.objects.count(), 3)
        pasta = Recipe.objects.get(title="Tomato pasta")
        salad = Recipe.objects.get(title="Salade, été")
        self.assertEqual(pasta.source_url, rows[0]["source_url"])
        self.assertEqual(salad.source_url, "")
        self.assertEqual(pasta.ingredient_entries.get(ingredient=existing).quantity, "200 g")
        self.assertEqual(salad.ingredient_entries.get(ingredient=existing).quantity, "")
        self.assertEqual(salad.ingredient_entries.get(ingredient__name="salt").quantity, "1 pinch")
        for recipe, extension in ((pasta, "jpg"), (salad, "png")):
            self.assertRegex(recipe.image.name, rf"^recipes/[0-9a-f]{{32}}\.{extension}$")
            with recipe.image.open("rb") as saved:
                self.assertEqual(saved.read(), image_bytes("JPEG" if extension == "jpg" else "PNG"))
        self.assertEqual(len(self.media_files()), 2)

    def test_optional_image_and_link_bom_crlf_and_blank_rows(self):
        text = '\ufefftitle,source_url,image,ingredients\r\n\r\n"Soupe",,,"[{""name"":""sel""}]"\r\n,,,\r\n'
        self.assertEqual(import_recipes(archive_upload(csv_text=text, images={})), 1)
        self.assertFalse(Recipe.objects.get().image)
        self.assertEqual(Recipe.objects.get().source_url, "")

    def test_image_can_be_shared_between_rows_and_extension_comes_from_content(self):
        rows = [recipe_row(image="photo.jpg"), recipe_row(title="Second", image="photo.jpg")]
        import_recipes(archive_upload(rows, images={"photo.jpg": image_bytes("WEBP")}))
        names = [recipe.image.name for recipe in Recipe.objects.all()]
        self.assertEqual(len(set(names)), 2)
        self.assertTrue(all(name.endswith(".webp") for name in names))

    def test_repeated_import_creates_new_recipes_and_reuses_ingredients(self):
        import_recipes(archive_upload())
        import_recipes(archive_upload())
        self.assertEqual(Recipe.objects.count(), 2)
        self.assertEqual(Ingredient.objects.count(), 2)

    def test_downloadable_example_csv_can_be_imported(self):
        text = (Path(__file__).parent / "static/recipes/import-template.csv").read_text()
        upload = archive_upload(csv_text=text, images={"1.jpg": image_bytes(), "2.jpg": image_bytes()})
        self.assertEqual(import_recipes(upload), 2)
        self.assertEqual(set(Recipe.objects.values_list("title", flat=True)), {"Tomato pasta", "Tomato salad"})

    def test_llm_prompt_csv_example_can_be_imported(self):
        prompt = recipe_import_prompt()
        text = prompt.split("VALID CSV EXAMPLE (the example photo must actually be included):\n", 1)[1]
        self.assertEqual(import_recipes(archive_upload(csv_text=text)), 1)
        self.assertEqual(Recipe.objects.get().title, "Tomato pasta")

    def test_validates_later_rows_before_writing_anything(self):
        with mock.patch("django.core.files.storage.FileSystemStorage._save") as save:
            self.assert_rejected(archive_upload([recipe_row(), recipe_row(title="")]), "CSV row 3: title")
        save.assert_not_called()

    def test_rejects_invalid_recipe_fields(self):
        for changes, message in [
            ({"title": " "}, "title"),
            ({"title": "x" * 201}, "title"),
            ({"source_url": "not a url"}, "source_url"),
            ({"ingredients": "not json"}, "valid JSON array"),
            ({"ingredients": "[]"}, "between 1 and 100"),
            ({"ingredients": "{}"}, "between 1 and 100"),
            ({"ingredients": '[{"name":"salt"},{"name":" SALT "}]'}, "Duplicate ingredient"),
            ({"ingredients": '[{"name":""}]'}, "names cannot be empty"),
            ({"ingredients": '[{"name":"salt","quantity":3}]'}, "quantities must be strings"),
        ]:
            with self.subTest(changes=changes):
                self.assert_rejected(archive_upload([recipe_row(**changes)]), message)

    def test_rejects_bad_csv_headers_rows_encoding_and_quoting(self):
        for text, message in [
            ("", "columns"),
            ("title,ingredients\n", "columns"),
            ("title,source_url,image,ingredients,image\n", "columns"),
            ("title,source_url,image,ingredients,unknown\n", "columns"),
            ("title,source_url,image,ingredients\n", "at least one recipe"),
            ("title,source_url,image,ingredients\nSoup,,,[],extra\n", "CSV row 2"),
            ("title,source_url,image,ingredients\nSoup,,\n", "CSV row 2"),
            ('title,source_url,image,ingredients\n"unclosed', "not valid CSV"),
            (b"\xff", "UTF-8"),
        ]:
            with self.subTest(text=text):
                self.assert_rejected(archive_upload(csv_text=text), message)

    def test_rejects_missing_invalid_and_unsupported_images(self):
        self.assert_rejected(archive_upload(images={}), "was not found")
        self.assert_rejected(archive_upload(images={"1.jpg": b"not an image"}), "CSV row 2: image")
        self.assert_rejected(archive_upload(images={"1.jpg": image_bytes("GIF")}), "CSV row 2: image")
        for filename in ("../1.jpg", "images/1.jpg", "/1.jpg", "..\\1.jpg"):
            with self.subTest(filename=filename):
                self.assert_rejected(archive_upload([recipe_row(image=filename)]), "must be a filename")

    def test_rejects_image_over_configured_limit(self):
        with override_settings(MEDIA_UPLOAD_MAX_BYTES=10):
            self.assert_rejected(archive_upload(), "image upload limit")

    def test_rejects_non_zip_and_missing_root_csv(self):
        self.assert_rejected(SimpleUploadedFile("bad.zip", b"bad"), "valid, unencrypted ZIP")
        data = io.BytesIO()
        with zipfile.ZipFile(data, "w") as archive:
            archive.writestr("folder/data.csv", "")
        self.assert_rejected(SimpleUploadedFile("bad.zip", data.getvalue()), "at its root")
        data = io.BytesIO()
        with zipfile.ZipFile(data, "w") as archive:
            archive.writestr("images/", "")
        self.assert_rejected(SimpleUploadedFile("bad.zip", data.getvalue()), "at its root")

    def test_rejects_unsafe_archive_paths_and_symlinks(self):
        for filename in ("../outside.jpg", "/absolute.jpg", "images/../outside.jpg", "images\\1.jpg", "images//1.jpg"):
            with self.subTest(filename=filename):
                self.assert_rejected(archive_upload(extra_entries=[(filename, b"x")]), "Unsafe ZIP path")
        link = zipfile.ZipInfo("images/link.jpg")
        link.create_system = 3
        link.external_attr = 0o120777 << 16
        self.assert_rejected(archive_upload(extra_entries=[(link, "../../outside")]), "symbolic links")

    def test_rejects_duplicate_zip_entries(self):
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", UserWarning)
            upload = archive_upload(extra_entries=[("images/1.jpg", image_bytes())])
        self.assert_rejected(upload, "Duplicate ZIP entry")

    def test_rejects_encrypted_and_corrupted_archive_members(self):
        data = bytearray(archive_upload().read())
        central_header = data.index(b"PK\x01\x02")
        data[central_header + 8] |= 1  # Encryption flag in the central directory.
        self.assert_rejected(SimpleUploadedFile("encrypted.zip", data), "encrypted entries")

        upload = archive_upload()
        with zipfile.ZipFile(upload) as archive:
            entry = archive.getinfo("images/1.jpg")
        data = bytearray(upload.file.getvalue())
        content_offset = entry.header_offset + 30 + len(entry.filename.encode()) + len(entry.extra)
        data[content_offset] ^= 0xFF
        self.assert_rejected(SimpleUploadedFile("corrupt.zip", data), "valid, unencrypted ZIP")

    def test_accepts_explicit_images_directory_and_finder_metadata(self):
        upload = archive_upload(extra_entries=[("images/", ""), (".DS_Store", b"x"), ("__MACOSX/._data.csv", b"x")])
        self.assertEqual(import_recipes(upload), 1)

    def test_rejects_oversized_archives_csv_and_recipe_count(self):
        cases = [
            ("MAX_ARCHIVE_BYTES", 10, "50 MiB"),
            ("MAX_UNCOMPRESSED_BYTES", 10, "100 MiB"),
            ("MAX_CSV_BYTES", 10, "2 MiB"),
            ("MAX_ENTRIES", 1, "too many entries"),
            ("MAX_RECIPES", 1, "at most 1 recipes"),
        ]
        for constant, value, message in cases:
            with self.subTest(constant=constant), mock.patch(f"apps.recipes.importing.{constant}", value):
                self.assert_rejected(archive_upload([recipe_row(), recipe_row(title="Second")]), message)

    def test_storage_failure_rolls_back_whole_batch_and_removes_completed_uploads(self):
        existing = Ingredient.objects.create(name="tomato")
        from django.core.files.storage import default_storage

        original_save = default_storage.save
        calls = 0

        def fail_second_upload(*args, **kwargs):
            nonlocal calls
            calls += 1
            if calls == 2:
                raise OSError("bucket unavailable")
            return original_save(*args, **kwargs)

        with mock.patch.object(default_storage, "save", side_effect=fail_second_upload), self.assertRaises(OSError):
            import_recipes(archive_upload([recipe_row(), recipe_row(title="Second")]))
        self.assertEqual(Recipe.objects.count(), 0)
        self.assertEqual(RecipeIngredient.objects.count(), 0)
        self.assertEqual(list(Ingredient.objects.values_list("pk", flat=True)), [existing.pk])
        self.assertEqual(self.media_files(), [])

    def test_database_failure_removes_image_and_rolls_back_ingredients(self):
        with mock.patch.object(RecipeIngredient.objects, "bulk_create", side_effect=RuntimeError("DB failure")):
            with self.assertRaises(RuntimeError):
                import_recipes(archive_upload())
        self.assertEqual(Recipe.objects.count(), 0)
        self.assertEqual(Ingredient.objects.count(), 0)
        self.assertEqual(self.media_files(), [])

    def test_failed_cleanup_is_logged_and_does_not_hide_original_failure(self):
        with (
            mock.patch.object(RecipeIngredient.objects, "bulk_create", side_effect=RuntimeError("DB failure")),
            mock.patch("django.core.files.storage.FileSystemStorage.delete", side_effect=OSError("cleanup failure")),
            self.assertLogs("apps.recipes.importing", level="ERROR") as logs,
            self.assertRaisesMessage(RuntimeError, "DB failure"),
        ):
            import_recipes(archive_upload())
        self.assertIn("Could not remove image", logs.output[0])
        self.assertEqual(Recipe.objects.count(), 0)
        self.assertEqual(Ingredient.objects.count(), 0)

    @mock_aws
    def test_import_uploads_to_shared_s3_storage(self):
        credentials = {"aws_access_key_id": "test", "aws_secret_access_key": "test", "region_name": "us-east-1"}
        client = boto3.client("s3", **credentials)
        client.create_bucket(Bucket="test-recipes")
        with override_settings(STORAGES={
            "default": {"BACKEND": "storages.backends.s3.S3Storage", "OPTIONS": {
                "bucket_name": "test-recipes", "access_key": "test", "secret_key": "test", "region_name": "us-east-1",
            }},
            "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
        }):
            import_recipes(archive_upload())
            recipe = Recipe.objects.get()
            self.assertEqual(client.get_object(Bucket="test-recipes", Key=recipe.image.name)["Body"].read(), image_bytes())


@override_settings(STORAGES={
    "default": {"BACKEND": "django.core.files.storage.InMemoryStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
})
class RecipeImportAdminTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_superuser("admin", "a@example.com", "pw")
        self.client.force_login(self.user)
        self.url = reverse("admin:recipes_recipe_batch_import")

    def test_button_and_upload_instructions(self):
        response = self.client.get(reverse("admin:recipes_recipe_changelist"))
        self.assertContains(response, self.url)
        self.assertContains(response, "Batch import")
        self.assertContains(response, reverse("admin:recipes_recipe_llm_import_prompt"))
        self.assertContains(response, "Copy LLM prompt")
        response = self.client.get(self.url)
        self.assertFalse(response.context["form"].is_bound)
        self.assertNotContains(response, "This field is required")
        self.assertContains(response, 'enctype="multipart/form-data"')
        self.assertContains(response, "csrfmiddlewaretoken")
        self.assertContains(response, "Download example CSV")
        self.assertContains(response, "source_url")

    @override_settings(MEDIA_UPLOAD_MAX_BYTES=123456)
    def test_llm_prompt_can_be_selected_and_uses_current_image_limit(self):
        response = self.client.get(reverse("admin:recipes_recipe_llm_import_prompt"))
        self.assertContains(response, "Copy prompt")
        self.assertContains(response, "readonly")
        self.assertContains(response, "123456 bytes")
        self.assertContains(response, "source_url")
        self.assertContains(response, "recipe-import-prompt")
        self.assertContains(response, reverse("admin:recipes_recipe_batch_import"))
        self.assertEqual(Recipe.objects.count(), 0)

    def test_llm_prompt_only_accepts_get(self):
        url = reverse("admin:recipes_recipe_llm_import_prompt")
        self.assertEqual(self.client.post(url).status_code, 405)
        self.assertEqual(self.client.delete(url).status_code, 405)

    def test_success_redirect_and_summary(self):
        response = self.client.post(self.url, {"archive": archive_upload()}, follow=True)
        self.assertRedirects(response, reverse("admin:recipes_recipe_changelist"))
        self.assertContains(response, "Imported 1 recipe.")
        self.assertEqual(Recipe.objects.count(), 1)

    def test_validation_error_is_shown_on_form(self):
        response = self.client.post(self.url, {"archive": archive_upload([recipe_row(title="")])})
        self.assertContains(response, "CSV row 2: title")
        self.assertEqual(Recipe.objects.count(), 0)

    def test_missing_file_and_wrong_extension(self):
        self.assertContains(self.client.post(self.url), "This field is required")
        self.assertContains(self.client.post(self.url, {"archive": SimpleUploadedFile("file.txt", b"x")}), "not allowed")
        self.assertEqual(Recipe.objects.count(), 0)

    def test_failures_are_logged_and_safe_error_is_shown(self):
        with (
            mock.patch("apps.recipes.admin.import_recipes", side_effect=OSError("sensitive storage details")),
            self.assertLogs("apps.recipes.admin", level="ERROR"),
        ):
            response = self.client.post(self.url, {"archive": archive_upload()})
        self.assertContains(response, "No recipes were imported")
        self.assertNotContains(response, "sensitive storage details")

    def test_anonymous_and_non_staff_users_cannot_import(self):
        self.client.logout()
        self.assertEqual(self.client.get(self.url).status_code, 302)
        self.assertEqual(self.client.get(reverse("admin:recipes_recipe_llm_import_prompt")).status_code, 302)
        self.user.is_staff = False
        self.user.save()
        self.client.force_login(self.user)
        self.assertEqual(self.client.post(self.url, {"archive": archive_upload()}).status_code, 302)
        self.assertEqual(self.client.get(reverse("admin:recipes_recipe_llm_import_prompt")).status_code, 302)
        self.assertEqual(Recipe.objects.count(), 0)

    def test_staff_needs_add_permission_for_all_three_models(self):
        self.user.is_superuser = False
        self.user.save()
        permissions = Permission.objects.filter(content_type__app_label="recipes", codename__in=[
            "add_recipe", "add_ingredient", "add_recipeingredient", "view_recipe",
        ])
        self.user.user_permissions.set(permissions)
        for missing in ("add_recipe", "add_ingredient", "add_recipeingredient"):
            with self.subTest(missing=missing):
                self.user.user_permissions.set(permissions.exclude(codename=missing))
                self.assertEqual(self.client.get(self.url).status_code, 403)
                self.assertEqual(self.client.post(self.url, {"archive": archive_upload()}).status_code, 403)
                self.assertNotContains(self.client.get(reverse("admin:recipes_recipe_changelist")), self.url)
                prompt_url = reverse("admin:recipes_recipe_llm_import_prompt")
                self.assertEqual(self.client.get(prompt_url).status_code, 403)
                self.assertNotContains(self.client.get(reverse("admin:recipes_recipe_changelist")), prompt_url)
        self.user.user_permissions.set(permissions)
        self.assertEqual(self.client.get(self.url).status_code, 200)
        self.assertEqual(self.client.post(self.url, {"archive": archive_upload()}).status_code, 302)

    def test_post_requires_csrf_token(self):
        client = Client(enforce_csrf_checks=True)
        client.force_login(self.user)
        self.assertEqual(client.post(self.url, {"archive": archive_upload()}).status_code, 403)
        self.assertEqual(Recipe.objects.count(), 0)

    def test_get_is_read_only_and_other_methods_rejected(self):
        self.assertEqual(self.client.get(self.url).status_code, 200)
        self.assertEqual(self.client.delete(self.url).status_code, 405)
        self.assertEqual(Recipe.objects.count(), 0)
