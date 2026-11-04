import json
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from .models import Category, Content, ContentCategory, ObjectType


@override_settings(ROOT_URLCONF="apps.curator.urls", SECRET_KEY="test-long-enough-secret-key-curator-123456789", AUTH_JWT_TTL_SECONDS=3600)
class CuratorAPITests(TestCase):
    def setUp(self):
        from apps.accounts.tokens import issue_token
        self.owner = get_user_model().objects.create_user(username="owner")
        self.other = get_user_model().objects.create_user(username="other")
        self.item = Content.objects.create(owner=self.owner, object_type=ObjectType.objects.get(slug="idea"), title="Private idea")
        self.foreign = Content.objects.create(owner=self.other, object_type=self.item.object_type, title="Other private idea")
        self.headers = {"HTTP_AUTHORIZATION": "Bearer " + issue_token(self.owner)}

    def send(self, path, data, method="post"):
        return getattr(self.client, method)(path, json.dumps(data), content_type="application/json", **self.headers)

    def test_anonymous_denied_and_owner_filtered(self):
        self.assertEqual(self.client.get('/content/').status_code, 401)
        response = self.client.get('/content/', **self.headers).json()
        self.assertEqual(response['total'], 1)
        self.assertEqual(self.client.get(f'/content/{self.foreign.pk}/', **self.headers).status_code, 404)

    def test_archive_atomic_exclusion_and_conflict(self):
        ContentCategory.objects.create(content=self.item, category=Category.objects.get(slug="inbox"))
        value = self.item.updated_at.isoformat()
        response = self.send(f'/content/{self.item.pk}/categories/', {'category': 'archive', 'enabled': True, 'updated_at': value})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(self.item.categories.values_list('slug', flat=True)), {'archive'})
        self.assertEqual(self.send(f'/content/{self.item.pk}/categories/', {'category': 'favorite', 'enabled': True, 'updated_at': value}).status_code, 409)

    def test_type_linked_categories_only_apply_to_their_types(self):
        value = self.item.updated_at.isoformat()
        ok = self.send(f'/content/{self.item.pk}/categories/', {'category': 'promising', 'enabled': True, 'updated_at': value})
        self.assertEqual(ok.status_code, 200)
        bookmark = Content.objects.create(owner=self.owner, object_type=ObjectType.objects.get(slug="bookmark"), title="A link")
        refused = self.send(f'/content/{bookmark.pk}/categories/', {'category': 'promising', 'enabled': True, 'updated_at': bookmark.updated_at.isoformat()})
        self.assertEqual(refused.status_code, 400)
        allowed = self.send(f'/content/{bookmark.pk}/categories/', {'category': 'inspiration', 'enabled': True, 'updated_at': bookmark.updated_at.isoformat()})
        self.assertEqual(allowed.status_code, 200)
        idea_refused = self.send(f'/content/{self.item.pk}/categories/', {'category': 'inspiration', 'enabled': True, 'updated_at': ok.json()['updated_at']})
        self.assertEqual(idea_refused.status_code, 400)

    def test_category_filter_and_taxonomy_payload(self):
        ContentCategory.objects.create(content=self.item, category=Category.objects.get(slug="inbox"))
        taxonomy = self.client.get('/taxonomy/', **self.headers).json()
        categories = {c['slug']: c for c in taxonomy['categories']}
        self.assertEqual(categories['promising']['types'], ['idea'])
        self.assertEqual(categories['inbox']['types'], [])
        self.assertEqual(self.client.get('/content/?category=inbox', **self.headers).json()['total'], 1)
        self.assertEqual(self.client.get('/content/?category=archive', **self.headers).json()['total'], 0)
        detail = self.client.get(f'/content/{self.item.pk}/', **self.headers).json()
        self.assertEqual([c['slug'] for c in detail['categories']], ['inbox'])

    def test_cannot_tag_other_owner(self):
        self.assertEqual(self.send(f'/content/{self.foreign.pk}/categories/', {'category':'archive','enabled':True}).status_code, 404)

    def test_bad_filters_and_cross_origin(self):
        self.assertEqual(self.client.get('/content/?month=garbage', **self.headers).status_code, 400)
        self.assertEqual(self.client.get('/content/?page=-1', **self.headers).status_code, 400)
        with patch('apps.curator.views.same_origin', return_value=False):
            self.assertEqual(self.send('/content/', {'title':'x','type':'idea'}).status_code, 403)

    def test_create_and_edit_no_import_payload_leak(self):
        result = self.send('/content/', {'title':'New note','type':'daily-note','note_on':'2026-11-04'})
        self.assertEqual(result.status_code, 201)
        data = result.json()
        self.assertEqual(data['categories'][0]['slug'], 'inbox')
        self.assertNotIn('payload', data)
        response = self.send(f"/content/{data['id']}/", {'title':'Edited','updated_at':data['updated_at']}, method='patch')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['title'], 'Edited')

    def test_taxonomy_month_counts_private(self):
        result=self.client.get('/taxonomy/', **self.headers).json()
        self.assertEqual(sum(m['count'] for m in result['months']), 1)
