import json

from django.contrib.auth import get_user_model
from django.test import Client, TestCase

from apps.accounts.tokens import issue_token

from .models import Category, Track

LIST = "/api/apps/music-library/tracks/"
CATEGORIES = "/api/apps/music-library/categories/"


def detail(pk):
    return f"{LIST}{pk}/"


class MusicLibraryAPITests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        user = get_user_model().objects.create_user(username="thomas", password="x")
        self.auth = {"HTTP_AUTHORIZATION": f"Bearer {issue_token(user)}"}
        # The seed migration populates the test database; clear it for isolation.
        Track.objects.all().delete()
        Category.objects.all().delete()
        ambient = Category.objects.create(name="Ambient", slug="ambient")
        Track.objects.create(name="Neon Rain", description="Dark city ambience",
                             code='m.play("prophet")', category=ambient)
        Track.objects.create(name="Night Pursuit", description="Action chase",
                             code='m.play("tb303")')

    def test_list_is_paginated_and_slim(self):
        response = self.client.get(LIST)
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["count"], 2)
        self.assertEqual(body["page"], 1)
        self.assertEqual(len(body["results"]), 2)
        self.assertNotIn("code", body["results"][0])

    def test_search_matches_name_and_description(self):
        body = self.client.get(LIST, {"q": "pursuit"}).json()
        self.assertEqual([t["name"] for t in body["results"]], ["Night Pursuit"])
        body = self.client.get(LIST, {"q": "city"}).json()
        self.assertEqual([t["name"] for t in body["results"]], ["Neon Rain"])

    def test_category_filter(self):
        body = self.client.get(LIST, {"category": "ambient"}).json()
        self.assertEqual([t["name"] for t in body["results"]], ["Neon Rain"])

    def test_retrieve_includes_code(self):
        track = Track.objects.get(name="Neon Rain")
        body = self.client.get(detail(track.pk)).json()
        self.assertEqual(body["code"], 'm.play("prophet")')
        self.assertEqual(body["category"], "Ambient")

    def test_create_requires_sign_in(self):
        response = self.client.post(LIST, {"name": "X", "code": "m.play(1)"},
                                    content_type="application/json")
        self.assertEqual(response.status_code, 401)

    def test_create_with_token(self):
        response = self.client.post(
            LIST, {"name": "New Jam", "code": "m.play(1)", "category": "Lo-fi"},
            content_type="application/json", **self.auth)
        self.assertEqual(response.status_code, 201)
        body = response.json()
        self.assertEqual(body["category"], "Lo-fi")
        self.assertEqual(Category.objects.get(slug="lo-fi").name, "Lo-fi")

    def test_create_rejects_missing_fields(self):
        response = self.client.post(LIST, {"name": "", "code": ""},
                                    content_type="application/json", **self.auth)
        self.assertEqual(response.status_code, 400)

    def test_update_with_token(self):
        track = Track.objects.get(name="Neon Rain")
        response = self.client.patch(detail(track.pk), {"description": "Rainier"},
                                     content_type="application/json", **self.auth)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["description"], "Rainier")
        track.refresh_from_db()
        self.assertEqual(track.description, "Rainier")

    def test_update_requires_sign_in(self):
        track = Track.objects.get(name="Neon Rain")
        response = self.client.patch(detail(track.pk), {"description": "Nope"},
                                     content_type="application/json")
        self.assertEqual(response.status_code, 401)

    def test_update_rejects_empty_code(self):
        track = Track.objects.get(name="Neon Rain")
        response = self.client.patch(detail(track.pk), {"code": "  "},
                                     content_type="application/json", **self.auth)
        self.assertEqual(response.status_code, 400)

    def test_missing_track_404(self):
        self.assertEqual(self.client.get(detail(999)).status_code, 404)

    def test_categories_list_counts(self):
        body = self.client.get(CATEGORIES).json()
        self.assertEqual(body["categories"],
                         [{"name": "Ambient", "slug": "ambient", "track_count": 1}])

    def test_page_size_capped(self):
        response = self.client.get(LIST, {"page_size": 500})
        self.assertEqual(response.json()["page_size"], 100)

    def test_bad_page_params_400(self):
        self.assertEqual(self.client.get(LIST, {"page": "abc"}).status_code, 400)
