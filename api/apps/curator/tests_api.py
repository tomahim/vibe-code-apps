import json
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from .models import Category, Content, ContentCategory, ContentTag, ObjectType, Tag


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

    def test_choosing_a_category_clears_inbox_keeps_lanes_and_tags(self):
        for slug in ["inbox", "favorite"]:
            ContentCategory.objects.create(content=self.item, category=Category.objects.get(slug=slug))
        tag = Tag.objects.create(slug="topic-hiking", name="Hiking")
        ContentTag.objects.create(content=self.item, tag=tag)
        value = self.item.updated_at.isoformat()
        response = self.send(f'/content/{self.item.pk}/categories/', {'category': 'promising', 'enabled': True, 'updated_at': value})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(self.item.categories.values_list('slug', flat=True)), {'favorite', 'promising'})
        self.assertEqual([t['slug'] for t in response.json()['tags']], ['topic-hiking'])
        self.assertEqual(self.client.get('/content/?category=inbox', **self.headers).json()['total'], 0)
        self.assertEqual(self.client.get('/content/?category=promising', **self.headers).json()['total'], 1)
        # Removing a category never restores the Inbox.
        removed = self.send(f'/content/{self.item.pk}/categories/', {'category': 'promising', 'enabled': False, 'updated_at': response.json()['updated_at']})
        self.assertEqual(removed.status_code, 200)
        self.assertEqual(set(self.item.categories.values_list('slug', flat=True)), {'favorite'})
        # Choosing Inbox itself only clears Archive; other categories stay.
        ContentCategory.objects.create(content=self.item, category=Category.objects.get(slug="archive"))
        restored = self.send(f'/content/{self.item.pk}/categories/', {'category': 'inbox', 'enabled': True, 'updated_at': removed.json()['updated_at']})
        self.assertEqual(restored.status_code, 200)
        self.assertEqual(set(self.item.categories.values_list('slug', flat=True)), {'inbox', 'favorite'})

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
        self.assertIn('video', {t['slug'] for t in taxonomy['types']})
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


    def test_inbox_includes_uncategorized_objects_without_backfill(self):
        note = Content.objects.create(owner=self.owner, object_type=ObjectType.objects.get(slug="daily-note"), title="Unprocessed note")
        self.assertFalse(note.categories.exists())
        result = self.client.get('/content/?category=inbox', **self.headers).json()
        self.assertEqual({item['id'] for item in result['items']}, {str(self.item.pk), str(note.pk)})
        self.assertFalse(note.categories.exists())
        self.assertEqual(self.client.get('/content/?category=inbox&type=daily-note', **self.headers).json()['total'], 1)

    def test_inbox_news_includes_all_non_archived_even_other_categories(self):
        news_type = ObjectType.objects.get(slug="news")
        expected = []
        for index, slugs in enumerate([[], ["inbox"], ["favorite"], ["favorite", "inbox"]]):
            news = Content.objects.create(owner=self.owner, object_type=news_type, title=f"News {index}")
            for slug in slugs:
                ContentCategory.objects.create(content=news, category=Category.objects.get(slug=slug))
            expected.append(str(news.pk))
        result = self.client.get('/content/?category=inbox&type=news', **self.headers).json()
        self.assertEqual(result['total'], 4)
        self.assertEqual({item['id'] for item in result['items']}, set(expected))

    def test_archived_news_stays_out_even_with_another_category(self):
        for index, slugs in enumerate([["archive"], ["archive", "favorite"], ["archive", "inbox"]]):
            news = Content.objects.create(owner=self.owner, object_type=ObjectType.objects.get(slug="news"), title=f"Archived {index}")
            for slug in slugs:
                ContentCategory.objects.create(content=news, category=Category.objects.get(slug=slug))
        self.assertEqual(self.client.get('/content/?category=inbox&type=news', **self.headers).json()['total'], 0)
        self.assertEqual(self.client.get('/content/?category=archive&type=news', **self.headers).json()['total'], 3)
        self.assertEqual(self.client.get('/content/?type=news', **self.headers).json()['total'], 3)

    def test_inbox_preserves_other_type_lanes_and_owner_search_filters(self):
        ContentCategory.objects.create(content=self.item, category=Category.objects.get(slug="promising"))
        bookmark = Content.objects.create(owner=self.owner, object_type=ObjectType.objects.get(slug="bookmark"), title="Inspiration only")
        ContentCategory.objects.create(content=bookmark, category=Category.objects.get(slug="inspiration"))
        self.assertEqual(self.client.get('/content/?category=inbox', **self.headers).json()['total'], 0)
        news = Content.objects.create(owner=self.owner, object_type=ObjectType.objects.get(slug="news"), title="Maps today")
        Content.objects.create(owner=self.other, object_type=news.object_type, title="Foreign maps")
        result = self.client.get('/content/?category=inbox&q=maps', **self.headers).json()
        self.assertEqual([item['id'] for item in result['items']], [str(news.pk)])
        self.assertEqual(self.client.get('/content/?category=promising', **self.headers).json()['total'], 1)
        self.assertEqual(self.client.get('/content/?category=inspiration', **self.headers).json()['total'], 1)
