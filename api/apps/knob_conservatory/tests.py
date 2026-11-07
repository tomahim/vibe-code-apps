"""Preset shelf endpoints: auth, owner scoping, validation."""

import json

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.accounts.tokens import issue_token

from .models import Preset


class PresetApiTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.owner = User.objects.create_user(username="thomas", email="thomas@example.com", password="x")
        self.other = User.objects.create_user(username="aurore", email="aurore@example.com", password="x")
        self.headers = {"HTTP_AUTHORIZATION": "Bearer " + issue_token(self.owner)}
        self.other_headers = {"HTTP_AUTHORIZATION": "Bearer " + issue_token(self.other)}

    def test_auth_required(self):
        self.assertEqual(self.client.get("/api/apps/knob-conservatory/presets").status_code, 401)
        self.assertEqual(self.client.post("/api/apps/knob-conservatory/presets", "{}", content_type="application/json").status_code, 401)

    def test_create_list_and_delete(self):
        response = self.client.post(
            "/api/apps/knob-conservatory/presets",
            json.dumps({"name": "Velvet bass", "settings": {"cutoff": 800, "resonance": 0.4, "osc1_wave": "sawtooth"}}),
            content_type="application/json",
            **self.headers,
        )
        self.assertEqual(response.status_code, 201)
        preset_id = response.json()["id"]

        listing = self.client.get("/api/apps/knob-conservatory/presets", **self.headers)
        self.assertEqual(listing.status_code, 200)
        presets = listing.json()["presets"]
        self.assertEqual(len(presets), 1)
        self.assertEqual(presets[0]["name"], "Velvet bass")
        self.assertEqual(presets[0]["settings"]["cutoff"], 800)

        self.assertEqual(self.client.delete(f"/api/apps/knob-conservatory/presets/{preset_id}", **self.headers).status_code, 204)
        self.assertEqual(Preset.objects.count(), 0)

    def test_owner_scoping(self):
        Preset.objects.create(owner=self.owner, name="Mine", settings={"cutoff": 500})
        # Other users neither see nor delete someone else's instruments.
        listing = self.client.get("/api/apps/knob-conservatory/presets", **self.other_headers)
        self.assertEqual(listing.json()["presets"], [])
        preset = Preset.objects.get()
        self.assertEqual(self.client.delete(f"/api/apps/knob-conservatory/presets/{preset.id}", **self.other_headers).status_code, 404)
        self.assertEqual(Preset.objects.count(), 1)

    def test_duplicate_name_rejected(self):
        body = json.dumps({"name": "Fog pad", "settings": {"attack": 0.9}})
        first = self.client.post("/api/apps/knob-conservatory/presets", body, content_type="application/json", **self.headers)
        self.assertEqual(first.status_code, 201)
        second = self.client.post("/api/apps/knob-conservatory/presets", body, content_type="application/json", **self.headers)
        self.assertEqual(second.status_code, 409)

    def test_validation(self):
        cases = [
            {"settings": {}},  # missing name
            {"name": "  ", "settings": {}},  # blank name
            {"name": "x" * 81, "settings": {}},  # too long
            {"name": "ok", "settings": "not-a-dict"},
            {"name": "ok", "settings": {"cutoff": [1, 2]}},  # nested value
            {"name": "ok", "settings": {"cutoff": True}},  # bool is not a knob value
        ]
        for payload in cases:
            response = self.client.post(
                "/api/apps/knob-conservatory/presets",
                json.dumps(payload),
                content_type="application/json",
                **self.headers,
            )
            self.assertEqual(response.status_code, 400, payload)
        self.assertEqual(Preset.objects.count(), 0)
