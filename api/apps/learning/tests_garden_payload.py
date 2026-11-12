"""Pin the garden's tile contract separately from the full lesson reader."""
from unittest.mock import patch
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from apps.accounts.tokens import issue_token
from .api import described
from .models import Card, CardProgress, ContentEntity, LearningPath, Lesson, Theme


class GardenPayloadTests(TestCase):
    def row(self, model, **fields):
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
            title=model.__name__, position=1, published=True, source_path='example',
            last_changed_commit='a' * 40, **fields,
        )

    def setUp(self):
        self.user = get_user_model().objects.create_user(username='garden-reader')
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {issue_token(self.user)}'
        self.theme = self.row(Theme, description='The visible theme blurb.', introduction_markdown='Theme intro')
        self.path = self.row(LearningPath, theme=self.theme, description='Path description',
                             introduction_markdown='Path intro')
        self.lesson = self.row(Lesson, learning_path=self.path, description='Lesson description',
                               introduction_markdown='Lesson intro')
        self.card = self.row(Card, lesson=self.lesson, body_markdown='Reader card body')
        CardProgress.objects.create(user=self.user, card=self.card, completed_at=timezone.now())

    def garden(self):
        response = self.client.get('/api/learning/garden/')
        self.assertEqual(response.status_code, 200)
        return response

    def test_only_tile_fields_are_sent_and_all_state_is_unchanged(self):
        # Reconstruct the pre-#456 representation with the full serializer.
        with patch('apps.learning.views.garden_tile', side_effect=described):
            old = self.garden().json()
        slim = self.garden().json()
        theme = slim['themes'][0]
        path = theme['learning_paths'][0]
        lesson = path['lessons'][0]
        common = {'id', 'title', 'position', 'image_url', 'progress'}
        self.assertEqual(set(theme), common | {'description', 'learning_paths'})
        self.assertEqual(set(path), common | {'theme_id', 'celebrated', 'catch_up', 'practice', 'lessons'})
        self.assertEqual(set(lesson), common | {'learning_path_id'})
        self.assertEqual(theme['description'], self.theme.description)
        self.assertEqual(lesson['id'], str(self.lesson.pk))
        self.assertEqual(lesson['progress']['cards_completed'], 1)
        self.assertTrue(path['catch_up']['eligible'])
        # Compare every retained scalar and nested value, not just counts.
        def retained_equal(before, after):
            if isinstance(after, dict):
                for key, value in after.items():
                    retained_equal(before[key], value)
            elif isinstance(after, list):
                self.assertEqual(len(before), len(after))
                for a, b in zip(before, after):
                    retained_equal(a, b)
            else:
                self.assertEqual(before, after)
        retained_equal(old, slim)

    def test_reader_text_growth_does_not_grow_garden_and_reader_stays_full(self):
        before = len(self.garden().content)
        for row in (self.theme, self.path, self.lesson):
            row.introduction_markdown = 'Large reader-only introduction. ' * 1000
            if row != self.theme:
                row.description = 'Unused tile description. ' * 1000
            row.save()
        self.assertEqual(len(self.garden().content), before)
        response = self.client.get(f'/api/learning/lessons/{self.lesson.pk}/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        for key, row in (('theme', self.theme), ('learning_path', self.path), ('lesson', self.lesson)):
            self.assertEqual(data[key]['description'], row.description)
            self.assertEqual(data[key]['introduction_markdown'], row.introduction_markdown)
            self.assertIn('image_path', data[key])
            self.assertIn('image_alt', data[key])
        self.assertEqual(data['cards'][0]['body_markdown'], 'Reader card body')

    def test_empty_garden_keeps_its_envelope(self):
        self.theme.published = False
        self.theme.save()
        data = self.garden().json()
        self.assertEqual(data['themes'], [])
        self.assertEqual(data['recent_lessons'], [])
        self.assertEqual(data['rewards'], {'drops': 0, 'carrots': 0})
