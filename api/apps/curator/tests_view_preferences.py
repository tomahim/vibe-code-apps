import json
from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from .models import ObjectType, ViewPreference


@override_settings(ROOT_URLCONF="apps.curator.urls", SECRET_KEY="test-private-curator-preferences-secret-123456789", AUTH_JWT_TTL_SECONDS=3600)
class ViewPreferenceTests(TestCase):
    def setUp(self):
        from apps.accounts.tokens import issue_token
        self.owner = get_user_model().objects.create_user(username="viewer")
        self.other = get_user_model().objects.create_user(username="other-viewer")
        self.headers = {"HTTP_AUTHORIZATION": "Bearer " + issue_token(self.owner)}
        self.other_headers = {"HTTP_AUTHORIZATION": "Bearer " + issue_token(self.other)}

    def put(self, slug, data, headers=None):
        return self.client.put(f"/preferences/{slug}/", json.dumps(data), content_type="application/json", **(headers or self.headers))

    def test_absent_defaults_and_all_choices_persist_per_type(self):
        self.assertEqual(self.client.get('/taxonomy/', **self.headers).json()['view_preferences'], {})
        for view in ['default', 'database', 'table', 'cards', 'calendar']:
            self.assertEqual(self.put('idea', {'view': view}).status_code, 200)
            self.assertEqual(self.client.get('/taxonomy/', **self.headers).json()['view_preferences'], {'idea': view})
        self.assertEqual(self.put('bookmark', {'view': 'cards'}).status_code, 200)
        self.assertEqual(ViewPreference.objects.filter(owner=self.owner).count(), 2)
        self.assertEqual(self.client.get('/taxonomy/', **self.headers).json()['view_preferences'], {'idea': 'calendar', 'bookmark': 'cards'})

    def test_preferences_are_private_and_not_staff_only(self):
        self.put('idea', {'view': 'calendar'})
        self.assertEqual(self.client.get('/taxonomy/', **self.other_headers).json()['view_preferences'], {})
        self.put('idea', {'view': 'table'}, headers=self.other_headers)
        self.assertEqual(self.client.get('/taxonomy/', **self.headers).json()['view_preferences'], {'idea': 'calendar'})
        self.assertEqual(self.client.get('/taxonomy/', **self.other_headers).json()['view_preferences'], {'idea': 'table'})
        self.assertEqual(self.client.put('/preferences/idea/', '{}', content_type='application/json').status_code, 401)

    def test_validation_and_cross_origin(self):
        for value in ['bad', None, [], {}, 1]:
            self.assertEqual(self.put('idea', {'view': value}).status_code, 400)
        self.assertEqual(self.put('idea', {'view': 'cards', 'owner': self.other.pk}).status_code, 400)
        self.assertEqual(self.put('missing', {'view': 'cards'}).status_code, 404)
        self.assertEqual(self.put('everything', {'view': 'cards'}).status_code, 404)
        ObjectType.objects.create(slug='inactive', name='Inactive', is_active=False)
        self.assertEqual(self.put('inactive', {'view': 'cards'}).status_code, 404)
        self.assertEqual(self.client.put('/preferences/idea/', '{', content_type='application/json', **self.headers).status_code, 400)
        self.assertEqual(self.client.put('/preferences/idea/', '{"view":"cards"}', content_type='application/json', HTTP_ORIGIN='https://elsewhere.invalid', **self.headers).status_code, 403)
        self.assertFalse(ViewPreference.objects.exists())

    def test_database_constraints(self):
        kind = ObjectType.objects.get(slug='idea')
        ViewPreference.objects.create(owner=self.owner, object_type=kind, view='cards')
        with self.assertRaises(IntegrityError), transaction.atomic():
            ViewPreference.objects.create(owner=self.owner, object_type=kind, view='calendar')
        with self.assertRaises(IntegrityError), transaction.atomic():
            ViewPreference.objects.create(owner=self.other, object_type=kind, view='wrong')
