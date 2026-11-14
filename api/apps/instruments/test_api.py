from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase

from apps.accounts.tokens import issue_token

from .models import Instrument

LIST = "/api/apps/instruments/instruments/"

# Minimal .scsyndef container: SCgf magic + version + one (empty-ish) def.
FAKE_DEF = b"SCgf" + b"\x00\x00\x00\x02" + b"\x01" + b"\x04test" + b"\x00" * 16


class InstrumentAPITests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        Instrument.objects.all().delete()  # seeded by migration; isolate
        user = get_user_model().objects.create_user(username="thomas", password="x")
        self.auth = {"HTTP_AUTHORIZATION": f"Bearer {issue_token(user)}"}
        Instrument.objects.create(name="prophet", type="Synth", blurb="warm poly",
                                  origin=Instrument.ORIGIN_BUILTIN, ready=True)
        Instrument.objects.create(name="kalimba", type="Keys", blurb="thumb piano",
                                  origin=Instrument.ORIGIN_BUILTIN, ready=False)

    def test_list_all(self):
        body = self.client.get(LIST).json()
        self.assertEqual(len(body["instruments"]), 2)
        self.assertEqual(body["instruments"][0]["origin"], "builtin")

    def test_search(self):
        body = self.client.get(LIST, {"q": "kalim"}).json()
        self.assertEqual([i["name"] for i in body["instruments"]], ["kalimba"])

    def test_origin_filter(self):
        body = self.client.get(LIST, {"origin": "imported"}).json()
        self.assertEqual(body["instruments"], [])

    def test_import_requires_sign_in(self):
        response = self.client.post(LIST, {"name": "x", "definition": SimpleUploadedFile("x.scsyndef", FAKE_DEF)})
        self.assertEqual(response.status_code, 401)

    def test_import_with_token(self):
        response = self.client.post(
            LIST,
            {"name": "my_synth", "type": "Synth", "license": "MIT",
             "source_url": "https://example.com/synth",
             "definition": SimpleUploadedFile("my_synth.scsyndef", FAKE_DEF)},
            **self.auth)
        self.assertEqual(response.status_code, 201)
        body = response.json()
        self.assertEqual(body["origin"], "imported")
        self.assertFalse(body["ready"])
        self.assertIn("/media/instruments/", body["definition_url"])
        self.assertTrue(Instrument.objects.filter(name="my_synth").exists())

    def test_import_rejects_wrong_extension(self):
        response = self.client.post(
            LIST, {"name": "bad", "definition": SimpleUploadedFile("bad.exe", FAKE_DEF)}, **self.auth)
        self.assertEqual(response.status_code, 400)

    def test_import_rejects_duplicate_name(self):
        response = self.client.post(
            LIST, {"name": "prophet", "definition": SimpleUploadedFile("p.scsyndef", FAKE_DEF)}, **self.auth)
        self.assertEqual(response.status_code, 409)

    def test_import_requires_name(self):
        response = self.client.post(
            LIST, {"definition": SimpleUploadedFile("x.scsyndef", FAKE_DEF)}, **self.auth)
        self.assertEqual(response.status_code, 400)
