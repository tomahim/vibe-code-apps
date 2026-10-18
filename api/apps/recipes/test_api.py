import json
import tempfile
from pathlib import Path
from unittest import mock

from django.db import IntegrityError, transaction
from django.test import Client, TestCase, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile

from .models import Ingredient, Recipe, RecipeIngredient
from .tests import png

LIST = "/api/apps/recipes/recipes/"
RANDOM = "/api/apps/recipes/random/"


@override_settings(BOT_API_SECRET="test-secret", STORAGES={
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
})
class RecipeAPITests(TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.media = Path(temp.name)
        override = override_settings(MEDIA_ROOT=temp.name)
        override.enable()
        self.addCleanup(override.disable)
        self.client = Client(enforce_csrf_checks=True)
        self.payload = {"title": "Pasta", "ingredients": [
            {"name": " Tomato ", "quantity": "200 g"}, {"name": "pasta"},
        ]}

    def post(self, data=None, **kwargs):
        return self.client.post(LIST, data or self.payload, content_type="application/json",
                                HTTP_X_BOT_TOKEN="test-secret", **kwargs)

    def upload(self, content=None):
        return SimpleUploadedFile("pasta.png", png() if content is None else content, content_type="image/png")

    def post_photo(self, **extra):
        return self.client.post(LIST, {"title": "Pasta", "ingredients": json.dumps(self.payload["ingredients"]),
                                      "image": self.upload(), **extra}, HTTP_X_BOT_TOKEN="test-secret")

    def test_create_normalizes_ingredients_and_serializes_without_photo(self):
        response = self.post()
        self.assertEqual(response.status_code, 201)
        body = response.json()
        self.assertIsNone(body["image_url"])
        self.assertEqual(body["ingredients"], [{"name": "pasta", "quantity": ""}, {"name": "tomato", "quantity": "200 g"}])
        self.assertEqual(self.post().status_code, 201)
        self.assertEqual(Ingredient.objects.count(), 2)

    def test_authentication_checked_before_json_or_upload(self):
        for token in ("", "wrong"):
            response = self.client.post(LIST, b"bad json", content_type="application/json", HTTP_X_BOT_TOKEN=token)
            self.assertEqual(response.status_code, 403)
            response = self.client.post(LIST, {"image": self.upload()}, HTTP_X_BOT_TOKEN=token)
            self.assertEqual(response.status_code, 403)
        self.assertEqual(Recipe.objects.count(), 0)
        self.assertEqual(list(self.media.rglob("*.png")), [])

    @override_settings(BOT_API_SECRET="")
    def test_unconfigured_writes_fail_closed(self):
        self.assertEqual(self.post().status_code, 503)

    def test_invalid_payloads_do_not_write(self):
        invalid = [[], {"title": " "}, {**self.payload, "title": 10},
                   {**self.payload, "source_url": "not a url"},
                   {**self.payload, "ingredients": []},
                   {**self.payload, "ingredients": [{"name": " "}]},
                   {**self.payload, "ingredients": [{"name": "egg"}, {"name": " EGG "}]},
                   {**self.payload, "ingredients": [{"name": "egg", "quantity": 5}]},
                   {**self.payload, "image": "recipes/other.png"}]
        for payload in invalid:
            with self.subTest(payload=payload):
                response = self.client.post(LIST, payload, content_type="application/json", HTTP_X_BOT_TOKEN="test-secret")
                self.assertEqual(response.status_code, 400)
        self.assertEqual(Recipe.objects.count(), 0)
        self.assertEqual(Ingredient.objects.count(), 0)

    def test_bad_json_and_unsupported_content_type(self):
        self.assertEqual(self.client.post(LIST, "{", content_type="application/json", HTTP_X_BOT_TOKEN="test-secret").status_code, 400)
        self.assertEqual(self.client.post(LIST, "text", content_type="text/plain", HTTP_X_BOT_TOKEN="test-secret").status_code, 415)

    def test_multipart_without_photo(self):
        response = self.client.post(LIST, {"title": "Soup", "ingredients": '[{"name":"water"}]'}, HTTP_X_BOT_TOKEN="test-secret")
        self.assertEqual(response.status_code, 201)
        self.assertIsNone(response.json()["image_url"])

    def test_photo_is_stored_and_serialized_in_all_endpoints(self):
        response = self.post_photo()
        self.assertEqual(response.status_code, 201)
        recipe = Recipe.objects.get()
        self.assertRegex(recipe.image.name, r"^recipes/[0-9a-f]{32}\.png$")
        self.assertTrue((self.media / recipe.image.name).exists())
        url = response.json()["image_url"]
        self.assertTrue(url.startswith("http://testserver/media/recipes/"))
        self.assertEqual(self.client.get(LIST).json()["recipes"][0]["image_url"], url)
        self.assertEqual(self.client.get(RANDOM).json()["image_url"], url)

    def test_invalid_photo_and_size_limit(self):
        self.assertEqual(self.post_photo(image=self.upload(b"invalid")).status_code, 400)
        with override_settings(MEDIA_UPLOAD_MAX_BYTES=10):
            self.assertEqual(self.post_photo().status_code, 400)
        self.assertFalse(Recipe.objects.exists())

    def test_storage_failure_rolls_back(self):
        with mock.patch("django.core.files.storage.FileSystemStorage._save", side_effect=OSError("secret details")):
            response = self.post_photo()
        self.assertEqual(response.status_code, 503)
        self.assertNotIn("secret details", response.content.decode())
        self.assertFalse(Recipe.objects.exists())
        self.assertFalse(Ingredient.objects.exists())

    def test_url_failure_rolls_back_and_removes_uploaded_file(self):
        self.client.get("/health/")  # Initialize static middleware before mocking media URLs.
        with mock.patch("django.core.files.storage.FileSystemStorage.url", side_effect=OSError("unavailable")):
            self.assertEqual(self.post_photo().status_code, 503)
        self.assertFalse(Recipe.objects.exists())
        self.assertFalse(Ingredient.objects.exists())
        self.assertEqual(list(self.media.rglob("*.png")), [])

    def test_database_failure_removes_uploaded_file(self):
        with mock.patch.object(RecipeIngredient.objects, "create", side_effect=IntegrityError("failure")):
            with self.assertRaises(IntegrityError):
                self.post_photo()
        self.assertFalse(Recipe.objects.exists())
        self.assertFalse(Ingredient.objects.exists())
        self.assertEqual(list(self.media.rglob("*.png")), [])

    def test_all_ingredient_matching_for_list_and_random(self):
        matching = self.post().json()["id"]
        self.post({"title": "Tomato", "ingredients": [{"name": "tomato"}]})
        self.post({"title": "Rice", "ingredients": [{"name": "rice"}]})
        query = {"ingredients": " Tomato, PASTA, tomato, "}
        self.assertEqual([r["id"] for r in self.client.get(LIST, query).json()["recipes"]], [matching])
        self.assertEqual(self.client.get(RANDOM, query).json()["id"], matching)
        for path in (LIST, RANDOM):
            response = self.client.get(path, {"ingredients": "tomato,missing"})
            self.assertEqual(response.status_code, 200 if path == LIST else 404)
        self.assertEqual(self.client.get(LIST, {"ingredients": "missing"}).json(), {"recipes": []})

    def test_random_without_filter_includes_whole_database(self):
        self.post()
        other = self.post({"title": "Rice", "ingredients": [{"name": "rice"}]}).json()["id"]
        for query in ({}, {"ingredients": ""}, {"ingredients": " , "}):
            self.assertEqual(len(self.client.get(LIST, query).json()["recipes"]), 2)
            # Inspect the candidate set while controlling selection, avoiding flaky frequency tests.
            from django.db.models.query import QuerySet
            original = QuerySet.order_by
            candidates = []
            def choose(queryset, *fields):
                if fields == ("?",):
                    candidates.extend(queryset.values_list("pk", flat=True))
                    return original(queryset, "-pk")
                return original(queryset, *fields)
            with mock.patch.object(QuerySet, "order_by", choose):
                self.assertEqual(self.client.get(RANDOM, query).json()["id"], other)
            self.assertCountEqual(candidates, Recipe.objects.values_list("pk", flat=True))

    def test_empty_database_and_method_restrictions(self):
        self.assertEqual(self.client.get(RANDOM).status_code, 404)
        self.assertEqual(self.client.get(LIST).json(), {"recipes": []})
        self.assertEqual(self.client.post(RANDOM).status_code, 403)  # CSRF protects non-API-write views.
        self.assertEqual(self.client.put(LIST).status_code, 405)

    def test_gallery_contains_etchebest(self):
        apps = self.client.get("/api/apps/").json()["apps"]
        self.assertTrue(any(app["slug"] == "recipes" for app in apps))


class IngredientTests(TestCase):
    def test_normalization_and_unique_recipe_membership(self):
        ingredient = Ingredient.objects.create(name=" Tomato ")
        self.assertEqual(ingredient.name, "tomato")
        recipe = Recipe.objects.create(title="Pasta")
        RecipeIngredient.objects.create(recipe=recipe, ingredient=ingredient)
        with self.assertRaises(IntegrityError), transaction.atomic():
            RecipeIngredient.objects.create(recipe=recipe, ingredient=ingredient)


class RecipeBucketAPITests(TestCase):
    @override_settings(BOT_API_SECRET="test-secret")
    def test_api_upload_uses_private_bucket_and_returns_presigned_url(self):
        import os
        import boto3
        from moto import mock_aws
        from config.media import build_storages
        from config.test_media import S3_ENV

        with mock_aws(), mock.patch.dict(os.environ, S3_ENV):
            s3 = boto3.client("s3", region_name="us-east-1")
            s3.create_bucket(Bucket="genious-media")
            with override_settings(STORAGES=build_storages(S3_ENV)):
                response = self.client.post(LIST, {
                    "title": "Pasta", "ingredients": '[{"name":"pasta"}]',
                    "image": SimpleUploadedFile("pasta.png", png(), content_type="image/png"),
                }, HTTP_X_BOT_TOKEN="test-secret")
                self.assertEqual(response.status_code, 201)
                recipe = Recipe.objects.get()
                self.assertIn("Signature", response.json()["image_url"])
                self.assertIn("Expires", response.json()["image_url"])
                self.assertEqual(s3.get_object(Bucket="genious-media", Key=recipe.image.name)["Body"].read(), png())
                self.assertIn("Signature", self.client.get(RANDOM).json()["image_url"])
