from django.contrib.auth import get_user_model
from django.test import Client, TestCase

from apps.accounts.tokens import issue_token

from .models import Track

BASE = "/api/apps/music-library/tracks/"


class TrackVersionTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        user = get_user_model().objects.create_user(username="thomas", password="x")
        self.auth = {"HTTP_AUTHORIZATION": f"Bearer {issue_token(user)}"}
        self.track = Track.objects.create(name="Draft", code='m.play("prophet")')

    def edit(self, **fields):
        return self.client.patch(f"{BASE}{self.track.pk}/", data=fields,
                                 content_type="application/json", **self.auth)

    def versions(self):
        return self.client.get(f"{BASE}{self.track.pk}/versions/").json()["versions"]

    def test_create_and_edits_each_make_a_version_newest_first(self):
        self.edit(code='m.play("tb303")')
        self.edit(name="Final")
        versions = self.versions()
        self.assertEqual([v["kind"] for v in versions], ["edited", "edited", "created"])
        self.assertEqual(versions[0]["name"], "Final")
        self.assertNotIn("code", versions[0])

    def test_version_detail_returns_code_for_playback(self):
        self.edit(code='m.play("tb303")')
        oldest = self.versions()[-1]
        body = self.client.get(f"{BASE}{self.track.pk}/versions/{oldest['version_id']}/").json()
        self.assertEqual(body["code"], 'm.play("prophet")')

    def test_restore_requires_sign_in(self):
        vid = self.versions()[0]["version_id"]
        response = self.client.post(f"{BASE}{self.track.pk}/versions/{vid}/restore/")
        self.assertEqual(response.status_code, 401)

    def test_restore_copies_old_content_and_adds_a_new_version(self):
        self.edit(code='m.play("tb303")', name="Changed")
        before = self.versions()
        oldest = before[-1]["version_id"]
        response = self.client.post(f"{BASE}{self.track.pk}/versions/{oldest}/restore/", **self.auth)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["code"], 'm.play("prophet")')
        self.assertEqual(response.json()["name"], "Draft")
        after = self.versions()
        self.assertEqual(len(after), len(before) + 1)
        self.assertTrue(after[0]["reason"].startswith("Restored from version"))
        # The versions that existed before are untouched.
        self.assertEqual([v["version_id"] for v in after[1:]], [v["version_id"] for v in before])

    def test_unknown_or_foreign_version_is_404(self):
        other = Track.objects.create(name="Other", code="x")
        foreign = other.history.first().history_id
        self.assertEqual(
            self.client.get(f"{BASE}{self.track.pk}/versions/{foreign}/").status_code, 404)
        self.assertEqual(self.client.get(f"{BASE}9999/versions/").status_code, 404)

    def test_seeded_tracks_got_a_first_version_from_the_migration(self):
        initial = Track.history.filter(history_change_reason__startswith="Initial version")
        self.assertEqual(initial.count(), 3)
