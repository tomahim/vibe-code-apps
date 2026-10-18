import io
import shutil
import tempfile
from unittest import mock

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from PIL import Image

from .models import Recipe

MEDIA_ROOT = tempfile.mkdtemp()


def png():
    buffer = io.BytesIO()
    Image.new("RGB", (4, 4), "blue").save(buffer, "PNG")
    return buffer.getvalue()


@override_settings(
    MEDIA_ROOT=MEDIA_ROOT,
    STORAGES={
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
    },
)
class RecipeAdminTests(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        user = get_user_model().objects.create_superuser("admin", "a@example.com", "pw")
        self.client.force_login(user)

    def post(self, **extra):
        data = {"title": "Pasta", "source_url": "",
                "ingredient_entries-TOTAL_FORMS": "0", "ingredient_entries-INITIAL_FORMS": "0", **extra}
        return self.client.post(reverse("admin:recipes_recipe_add"), data)

    def test_recipe_without_image(self):
        self.assertEqual(self.post().status_code, 302)
        self.assertFalse(Recipe.objects.get().image)

    def test_upload_image_from_admin_stores_prefixed_random_key(self):
        response = self.post(image=SimpleUploadedFile("pasta.png", png(), content_type="image/png"))
        self.assertEqual(response.status_code, 302)
        recipe = Recipe.objects.get()
        self.assertRegex(recipe.image.name, r"^recipes/[0-9a-f]{32}\.png$")
        page = self.client.get(reverse("admin:recipes_recipe_change", args=[recipe.pk]))
        self.assertContains(page, recipe.image.url)  # preview is rendered

    def test_wrong_type_is_rejected_and_nothing_saved(self):
        response = self.post(image=SimpleUploadedFile("x.png", b"not an image", content_type="image/png"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Recipe.objects.count(), 0)

    @override_settings(MEDIA_UPLOAD_MAX_BYTES=50)
    def test_oversized_is_rejected_and_nothing_saved(self):
        response = self.post(image=SimpleUploadedFile("big.png", png() * 10, content_type="image/png"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Recipe.objects.count(), 0)

    def test_storage_failure_creates_no_row(self):
        self.client.raise_request_exception = False
        upload = SimpleUploadedFile("pasta.png", png(), content_type="image/png")
        with mock.patch(
            "django.core.files.storage.FileSystemStorage._save", side_effect=OSError("unreachable")
        ):
            response = self.post(image=upload)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(Recipe.objects.count(), 0)

    def test_ingredients_can_be_added_inline_and_edited(self):
        from .models import Ingredient, RecipeIngredient
        ingredient = Ingredient.objects.create(name=" Tomato ")
        response = self.post(**{
            "ingredient_entries-TOTAL_FORMS": "1",
            "ingredient_entries-0-ingredient": str(ingredient.pk),
            "ingredient_entries-0-quantity": "200 g",
        })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(RecipeIngredient.objects.get().quantity, "200 g")
        response = self.client.post(reverse("admin:recipes_ingredient_change", args=[ingredient.pk]), {"name": " TOMATOES "})
        self.assertEqual(response.status_code, 302)
        ingredient.refresh_from_db()
        self.assertEqual(ingredient.name, "tomatoes")
