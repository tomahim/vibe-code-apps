import json
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from .models import Category, Content, ObjectType, Tag


@override_settings(ROOT_URLCONF="apps.curator.urls", SECRET_KEY="test-long-enough-secret-taxonomy-admin-123456789", AUTH_JWT_TTL_SECONDS=3600)
class TaxonomyAdminTests(TestCase):
    def setUp(self):
        from apps.accounts.tokens import issue_token
        self.staff = get_user_model().objects.create_user(username="staff", is_staff=True)
        self.user = get_user_model().objects.create_user(username="reader")
        self.headers = {"HTTP_AUTHORIZATION": "Bearer " + issue_token(self.staff)}
        self.user_headers = {"HTTP_AUTHORIZATION": "Bearer " + issue_token(self.user)}

    def create(self, kind, data, **headers):
        return self.client.post(f"/taxonomy/{kind}/", json.dumps(data), content_type="application/json", **(headers or self.headers))

    def test_staff_capability_and_permission_checked_server_side(self):
        self.assertTrue(self.client.get("/taxonomy/", **self.headers).json()["can_manage_taxonomy"])
        self.assertFalse(self.client.get("/taxonomy/", **self.user_headers).json()["can_manage_taxonomy"])
        for kind in ["categories", "tags", "types"]:
            self.assertEqual(self.client.post(f"/taxonomy/{kind}/", "{}", content_type="application/json").status_code, 401)
            self.assertEqual(self.create(kind, {"name": "Test"}, **self.user_headers).status_code, 403)
            self.assertEqual(self.client.delete(f"/taxonomy/{kind}/", **self.headers).status_code, 405)

    def test_create_category_with_multiple_types_and_universal(self):
        result = self.create("categories", {"name": "Worth exploring", "types": ["idea", "bookmark"]})
        self.assertEqual(result.status_code, 201)
        category = Category.objects.get(slug="worth-exploring")
        self.assertFalse(category.is_system)
        self.assertEqual(set(category.object_types.values_list("slug", flat=True)), {"idea", "bookmark"})
        self.assertEqual(self.create("categories", {"name": "Weekend"}).status_code, 201)
        self.assertFalse(Category.objects.get(slug="weekend").object_types.exists())
        taxonomy = self.client.get("/taxonomy/", **self.headers).json()
        self.assertEqual(next(c for c in taxonomy["categories"] if c["slug"] == "worth-exploring")["types"], ["bookmark", "idea"])

    def test_new_type_available_to_capture_and_universal_categories(self):
        self.assertEqual(self.create("types", {"name": "Research notes", "description": "Collected research"}).status_code, 201)
        result = self.client.post("/content/", json.dumps({"title": "A research note", "type": "research-notes"}), content_type="application/json", **self.headers)
        self.assertEqual(result.status_code, 201)
        self.assertEqual(result.json()["categories"][0]["slug"], "inbox")
        self.assertTrue(ObjectType.objects.get(slug="research-notes").is_active)
        self.assertIn("research-notes", [t["slug"] for t in self.client.get("/taxonomy/", **self.headers).json()["types"]])

    def test_new_topic_tag_and_custom_key(self):
        self.assertEqual(self.create("tags", {"name": "Cartographie", "slug": "maps"}).status_code, 201)
        self.assertFalse(Tag.objects.get(slug="maps").is_system)
        self.assertEqual(self.create("tags", {"name": "Another name", "slug": "maps"}).status_code, 409)
        self.assertEqual(Tag.objects.get(slug="maps").name, "Cartographie")

    def test_invalid_input_never_partially_creates(self):
        inactive = ObjectType.objects.create(slug="inactive", name="Inactive", is_active=False)
        invalid = [
            ("categories", {"name": "Bad scope", "types": ["idea", "missing"]}),
            ("categories", {"name": "Bad scope", "types": [inactive.slug]}),
            ("categories", {"name": "Bad scope", "types": "idea"}),
            ("categories", {"name": "Bad scope", "types": [None]}),
            ("tags", {"name": " "}), ("tags", {"name": 7}),
            ("types", {"name": "Test", "slug": "x" * 65}),
            ("types", {"name": "Test", "description": []}),
            ("types", {"name": "Test", "icon": "x" * 65}),
            ("tags", {"name": "X" * 101}),
            ("tags", {"name": "Test", "slug": "UPPER"}),
            ("tags", {"name": "Test", "slug": "bad--key"}),
            ("tags", {"name": "Test", "slug": "bad_key"}),
            ("tags", {"name": "Test", "slug": ""}),
            ("tags", {"name": "Test", "is_system": True}),
        ]
        counts = (Category.objects.count(), Tag.objects.count(), ObjectType.objects.count())
        for kind, data in invalid:
            with self.subTest(kind=kind, data=data):
                self.assertEqual(self.create(kind, data).status_code, 400)
        self.assertEqual(counts, (Category.objects.count(), Tag.objects.count(), ObjectType.objects.count()))

    def test_reserved_and_existing_keys_protected(self):
        for slug in ["inbox", "archive", "favorite", "promising", "to-improve", "inspiration"]:
            self.assertEqual(self.create("tags", {"name": "Forbidden", "slug": slug}).status_code, 400)
        for slug in ["inbox", "archive", "favorite"]:
            self.assertEqual(self.create("categories", {"name": "Forbidden", "slug": slug}).status_code, 400)
        before = list(Category.objects.values("id", "slug", "name", "is_system", "position"))
        self.assertEqual(self.create("categories", {"name": "Changed", "slug": "promising", "types": []}).status_code, 409)
        self.assertEqual(list(Category.objects.values("id", "slug", "name", "is_system", "position")), before)
        self.assertEqual(list(Category.objects.get(slug="promising").object_types.values_list("slug", flat=True)), ["idea"])
        self.assertFalse(Content.objects.exists())

    def test_malformed_cross_origin_and_unsupported_methods(self):
        self.assertEqual(self.client.post("/taxonomy/tags/", "{", content_type="application/json", **self.headers).status_code, 400)
        self.assertEqual(self.client.post("/taxonomy/tags/", "[]", content_type="application/json", **self.headers).status_code, 400)
        self.assertEqual(self.client.post("/taxonomy/tags/", "name=Test", **self.headers, content_type="text/plain").status_code, 400)
        with patch("apps.curator.views.same_origin", return_value=False):
            self.assertEqual(self.create("tags", {"name": "Test"}).status_code, 403)
        self.assertEqual(self.create("unknown", {"name": "Test"}).status_code, 404)
        self.assertEqual(self.client.patch("/taxonomy/categories/", "{}", content_type="application/json", **self.headers).status_code, 405)
