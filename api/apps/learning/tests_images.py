from unittest.mock import MagicMock, patch
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase, override_settings
import requests

from apps.accounts.tokens import issue_token
from .models import Card, ContentEntity, LearningPath, Lesson, SyncLog, Theme


@override_settings(LEARNING_CONTENT_REPOSITORY="tomahim/vibe-code-apps")
class LearningImageTests(TestCase):
    def setUp(self):
        cache.clear()
        self.addCleanup(cache.clear)
        self.user = get_user_model().objects.create_user(username="image-learner")

        def row(model, **fields):
            return model.objects.create(
                entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
                position=1, published=True, title=model.__name__,
                source_path="atomic-lessons/example/index.md", last_changed_commit="a" * 40,
                **fields,
            )

        self.path_image = "atomic-lessons/themes/language/early-childhood-english/cover.png"
        self.theme = row(Theme, image_path="atomic-lessons/themes/language/cover.png")
        self.path = row(LearningPath, theme=self.theme, image_path=self.path_image)
        self.lesson = row(Lesson, learning_path=self.path, image_path="atomic-lessons/example/lesson.png")
        self.card = row(Card, lesson=self.lesson, body_markdown="Read",
                        illustration_path="atomic-lessons/example/card.png")
        SyncLog.objects.create(commit_sha="b" * 40)

    def url(self, row):
        return f"/api/learning/images/{row.CONTENT_KIND}/{row.pk}/"

    def upstream(self, status=200, data=b"\x89PNG\r\n\x1a\nexample"):
        response = MagicMock()
        response.__enter__.return_value = response
        response.status_code = status
        response.iter_content.return_value = [data]
        return response

    @patch("apps.learning.images.requests.get")
    def test_serialized_urls_load_on_the_app_origin_without_bearer_headers(self, get):
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.user)}"
        themes = self.client.get("/api/learning/themes/").json()
        theme = self.client.get(f"/api/learning/themes/{self.theme.pk}/").json()
        lesson = self.client.get(f"/api/learning/lessons/{self.lesson.pk}/").json()
        urls = [themes["themes"][0]["image_url"], theme["learning_paths"][0]["image_url"],
                lesson["lesson"]["image_url"], lesson["cards"][0]["illustration_url"]]
        self.assertEqual(urls, [self.url(row) for row in (self.theme, self.path, self.lesson, self.card)])
        self.assertEqual(theme["learning_paths"][0]["image_path"], self.path_image)
        self.client.defaults.clear()
        get.return_value = self.upstream()
        for url in urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response["Content-Type"], "image/png")
            self.assertEqual(response.content, b"\x89PNG\r\n\x1a\nexample")
            self.assertIn("no-store", response["Cache-Control"])
        self.assertEqual(get.call_count, 4)
        self.assertEqual(get.call_args_list[1].args[0],
                         f"https://raw.githubusercontent.com/tomahim/vibe-code-apps/{'b' * 40}/{self.path_image}")

    @patch("apps.learning.images.requests.get")
    def test_cache_uses_publication_snapshot_even_when_index_commit_is_unchanged(self, get):
        get.return_value = self.upstream(data=b"old")
        self.assertEqual(self.client.get(self.url(self.path)).content, b"old")
        self.assertEqual(self.client.get(self.url(self.path)).content, b"old")
        self.assertEqual(get.call_count, 1)
        SyncLog.objects.create(commit_sha="c" * 40)
        get.return_value = self.upstream(data=b"new")
        self.assertEqual(self.client.get(self.url(self.path)).content, b"new")
        self.assertEqual(get.call_count, 2)
        self.assertIn("/" + "c" * 40 + "/", get.call_args.args[0])

    @patch("apps.learning.images.requests.get")
    def test_cached_images_cannot_bypass_publication_or_ancestor_visibility(self, get):
        get.return_value = self.upstream()
        self.assertEqual(self.client.get(self.url(self.card)).status_code, 200)
        for row in (self.theme, self.path, self.lesson, self.card):
            type(row).objects.filter(pk=row.pk).update(published=False)
            self.assertEqual(self.client.get(self.url(self.card)).status_code, 404)
            type(row).objects.filter(pk=row.pk).update(published=True)
            row.entity.archived = True
            row.entity.save()
            self.assertEqual(self.client.get(self.url(self.card)).status_code, 404)
            row.entity.archived = False
            row.entity.save()
        self.assertEqual(get.call_count, 1)

    @patch("apps.learning.images.requests.get")
    def test_only_known_published_image_references_are_served(self, get):
        self.assertEqual(self.client.get(f"/api/learning/images/question/{self.path.pk}/").status_code, 404)
        self.assertEqual(self.client.get(f"/api/learning/images/learning_path/{uuid4()}/").status_code, 404)
        for path in ("", "../private.png", "/etc/private.png", "a/../private.png",
                     "a\\private.png", "atomic-lessons/questions/answer.yaml"):
            LearningPath.objects.filter(pk=self.path.pk).update(image_path=path)
            self.assertEqual(self.client.get(self.url(self.path)).status_code, 404)
        get.assert_not_called()

    def test_missing_artwork_has_no_url(self):
        from .api import described
        self.path.image_path = ""
        self.assertEqual(described(self.path)["image_url"], "")

    @patch("apps.learning.images.requests.get")
    def test_unpublished_source_is_a_controlled_error(self, get):
        SyncLog.objects.all().delete()
        self.assertEqual(self.client.get(self.url(self.path)).status_code, 503)
        SyncLog.objects.create(commit_sha="master")
        self.assertEqual(self.client.get(self.url(self.path)).status_code, 503)
        get.assert_not_called()

    @patch("apps.learning.images.requests.get")
    def test_upstream_failures_and_redirects_are_not_cached(self, get):
        for status, expected in ((404, 404), (500, 502), (302, 502)):
            get.return_value = self.upstream(status=status)
            self.assertEqual(self.client.get(self.url(self.path)).status_code, expected)
        get.side_effect = requests.Timeout()
        self.assertEqual(self.client.get(self.url(self.path)).status_code, 502)
        self.assertEqual(get.call_count, 4)
        self.assertFalse(get.call_args.kwargs["allow_redirects"])

    @patch("apps.learning.images.MAX_IMAGE_BYTES", 3)
    @patch("apps.learning.images.requests.get")
    def test_oversize_and_empty_images_fail_without_being_cached(self, get):
        for data in (b"large", b""):
            get.return_value = self.upstream(data=data)
            self.assertEqual(self.client.get(self.url(self.path)).status_code, 502)
        self.assertEqual(get.call_count, 2)

    @patch("apps.learning.images.requests.get")
    def test_svg_is_served_as_a_sandboxed_image(self, get):
        LearningPath.objects.filter(pk=self.path.pk).update(image_path="atomic-lessons/example/cover.svg")
        get.return_value = self.upstream(data=b'<svg xmlns="http://www.w3.org/2000/svg"/>')
        response = self.client.get(self.url(self.path))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "image/svg+xml")
        self.assertEqual(response["X-Content-Type-Options"], "nosniff")
        self.assertIn("sandbox", response["Content-Security-Policy"])
