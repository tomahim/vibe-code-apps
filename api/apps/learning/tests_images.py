from uuid import uuid4

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings

from apps.accounts.tokens import issue_token
from .models import Card, ContentEntity, LearningPath, Lesson, Theme


@override_settings(MEDIA_URL="/media/")
class LearningImageTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="image-learner")

        def row(model, **fields):
            return model.objects.create(
                entity=ContentEntity.objects.create(id=uuid4(), kind=model.CONTENT_KIND),
                position=1, published=True, title=model.__name__,
                source_path="atomic-lessons/example/index.md", last_changed_commit="a" * 40,
                **fields,
            )

        self.theme = row(Theme, image_path="atomic-lessons/themes/language/cover.png")
        self.path = row(LearningPath, theme=self.theme,
                        image_path="atomic-lessons/themes/language/early-childhood-english/cover.png")
        self.lesson = row(Lesson, learning_path=self.path, image_path="atomic-lessons/example/lesson.png")
        sha = "d" * 64
        self.card = row(
            Card, lesson=self.lesson, body_markdown="Read",
            illustration_path="atomic-lessons/example/cards/reef.png",
            illustration_alt="A coral reef.", illustration_credit="Jane Doe",
            illustration_license="CC BY 4.0", illustration_width=1600, illustration_height=1200,
            illustration_source_hash=sha,
        )
        self.card.illustration_variants = {
            "640": f"learning/{self.card.pk}/{sha}-640.webp",
            "1280": f"learning/{self.card.pk}/{sha}-1280.webp",
        }
        self.card.save()

    def url(self, row, query=""):
        return f"/api/learning/images/{row.CONTENT_KIND}/{row.pk}/{query}"

    def test_card_with_variants_redirects_to_a_fresh_signed_url(self):
        response = self.client.get(self.url(self.card))
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response["Location"].endswith(f"learning/{self.card.pk}/{'d' * 64}-640.webp"))
        self.assertIn("max-age=3000", response["Cache-Control"])
        self.assertNotIn("no-store", response["Cache-Control"])

    def test_width_parameter_selects_the_variant(self):
        response = self.client.get(self.url(self.card, "?w=1280"))
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response["Location"].endswith("-1280.webp"))

    def test_foreign_variant_key_is_never_served(self):
        self.card.illustration_variants = {"640": "learning/other-card/x-640.webp"}
        self.card.save()
        self.assertEqual(self.client.get(self.url(self.card, "?w=640")).status_code, 404)

    def test_card_without_processed_variants_is_not_served(self):
        self.card.illustration_variants = {}
        self.card.save()
        self.assertEqual(self.client.get(self.url(self.card)).status_code, 404)

    def test_only_cards_carry_servable_artwork(self):
        for row in (self.theme, self.path, self.lesson):
            self.assertEqual(self.client.get(self.url(row)).status_code, 404)

    def test_unknown_kind_and_unknown_card_are_not_served(self):
        self.assertEqual(self.client.get(f"/api/learning/images/question/{self.card.pk}/").status_code, 404)
        self.assertEqual(self.client.get(f"/api/learning/images/card/{uuid4()}/").status_code, 404)

    def test_unpublished_or_archived_artwork_is_not_served(self):
        self.assertEqual(self.client.get(self.url(self.card)).status_code, 302)
        for row in (self.theme, self.path, self.lesson, self.card):
            type(row).objects.filter(pk=row.pk).update(published=False)
            self.assertEqual(self.client.get(self.url(self.card)).status_code, 404)
            type(row).objects.filter(pk=row.pk).update(published=True)
            row.entity.archived = True
            row.entity.save()
            self.assertEqual(self.client.get(self.url(self.card)).status_code, 404)
            row.entity.archived = False
            row.entity.save()

    def test_non_card_kinds_have_no_image_url(self):
        from .api import described
        from .images import image_url
        # Stale repository-relative paths on other kinds produce no URL at all.
        self.assertEqual(described(self.path)["image_url"], "")
        self.assertEqual(image_url(self.theme), "")
        self.assertEqual(image_url(self.lesson), "")

    def test_lesson_payload_carries_the_full_illustration(self):
        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(self.user)}"
        payload = self.client.get(f"/api/learning/lessons/{self.lesson.pk}/").json()
        card = payload["cards"][0]
        self.assertEqual(card["illustration_width"], 1600)
        self.assertEqual(card["illustration_credit"], "Jane Doe")
        self.assertEqual(
            card["illustration_srcset"],
            [
                {"url": f"/api/learning/images/card/{self.card.pk}/?w=640", "width": 640},
                {"url": f"/api/learning/images/card/{self.card.pk}/?w=1280", "width": 1280},
            ],
        )
