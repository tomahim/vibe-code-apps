from unittest import mock

from django.test import Client, SimpleTestCase, override_settings

from . import github
from .frontmatter import set_rating

DOC = "---\nname: X\ntagline: Y\ndomains: [PROD]\ncreated: 2026-10-20T07:00:00Z\n---\n\nBody: rating: 3 stays\n"


class SetRatingTests(SimpleTestCase):
    def test_adds_replaces_and_removes(self):
        added = set_rating(DOC, 2)
        self.assertIn("created: 2026-10-20T07:00:00Z\nrating: 2\n---\n\nBody: rating: 3 stays\n", added)
        self.assertEqual(set_rating(added, 3).count("rating: 3"), 2)  # frontmatter + body text untouched
        self.assertEqual(set_rating(added, None), DOC)

    def test_requires_frontmatter(self):
        with self.assertRaises(ValueError):
            set_rating("no frontmatter", 1)


@override_settings(GITHUB_IDEAS_TOKEN="t", GITHUB_IDEAS_REPO="o/r", GITHUB_IDEAS_BRANCH="master", IDEAS_RATE_REQUIRE_STAFF=False)
class RateEndpointTests(SimpleTestCase):
    url = "/api/app-ideas/2026-10-20-demo/rate"

    def post(self, body='{"rating": 3}', **extra):
        return Client().post(self.url, body, content_type="application/json", **extra)

    @override_settings(GITHUB_IDEAS_TOKEN="")
    def test_not_configured(self):
        self.assertEqual(self.post().status_code, 503)

    def test_rejects_bad_input(self):
        for body in ('{"rating": 4}', '{"rating": "3"}', '{"rating": true}', "[]", "nope"):
            self.assertEqual(self.post(body).status_code, 400, body)
        self.assertEqual(Client().post(self.url, "x", content_type="text/plain").status_code, 415)
        self.assertEqual(Client().get(self.url).status_code, 405)

    def test_rejects_cross_origin(self):
        self.assertEqual(self.post(HTTP_ORIGIN="https://evil.example").status_code, 403)

    @override_settings(IDEAS_RATE_REQUIRE_STAFF=True)
    def test_staff_required_when_enabled(self):
        self.assertEqual(self.post().status_code, 403)

    @mock.patch("apps.app_ideas.views.github.write_file")
    @mock.patch("apps.app_ideas.views.github.read_file", return_value=(DOC, "sha1"))
    def test_commits(self, read, write):
        response = self.post(HTTP_ORIGIN="http://testserver")
        self.assertEqual(response.json(), {"slug": "2026-10-20-demo", "rating": 3, "committed": True})
        args = write.call_args.args
        self.assertEqual(args[3], "ui/src/apps/app-ideas/ideas/2026-10-20-demo.md")
        self.assertIn("rating: 3", args[4])
        self.assertEqual(args[5:], ("sha1", "rate 2026-10-20-demo: 3 stars [skip ci]"))

    @mock.patch("apps.app_ideas.views.github.write_file", side_effect=[github.Conflict(), None])
    @mock.patch("apps.app_ideas.views.github.read_file", side_effect=[(DOC, "old"), (DOC, "new")])
    def test_retries_on_conflict_with_fresh_sha(self, read, write):
        self.assertEqual(self.post().status_code, 200)
        self.assertEqual(write.call_args.args[5], "new")

    @mock.patch("apps.app_ideas.views.github.write_file", side_effect=github.Conflict())
    @mock.patch("apps.app_ideas.views.github.read_file", return_value=(DOC, "s"))
    def test_gives_up_after_repeated_conflicts(self, read, write):
        self.assertEqual(self.post().status_code, 409)
        self.assertEqual(write.call_count, 3)

    @mock.patch("apps.app_ideas.views.github.read_file", side_effect=github.NotFound())
    def test_unknown_idea(self, read):
        self.assertEqual(self.post().status_code, 404)

    @mock.patch("apps.app_ideas.views.github.read_file", side_effect=github.GitHubError("x"))
    def test_github_failure(self, read):
        self.assertEqual(self.post().status_code, 502)

    @mock.patch("apps.app_ideas.views.github.write_file")
    @mock.patch("apps.app_ideas.views.github.read_file", return_value=(set_rating(DOC, 3), "s"))
    def test_noop_when_unchanged(self, read, write):
        self.assertFalse(self.post().json()["committed"])
        write.assert_not_called()


@override_settings(GITHUB_IDEAS_TOKEN="t", GITHUB_IDEAS_REPO="o/r", GITHUB_IDEAS_BRANCH="master")
class RatingsEndpointTests(SimpleTestCase):
    url = "/api/app-ideas/ratings"

    @mock.patch("apps.app_ideas.views.github.read_ratings", return_value={"demo": 1, "new": None})
    def test_current_values_are_returned_without_cache(self, read):
        response = Client().get(self.url)
        self.assertEqual(response.json(), {"ratings": {"demo": 1, "new": None}})
        self.assertIn("no-store", response["Cache-Control"])
        read.assert_called_once_with("t", "o/r", "master", "ui/src/apps/app-ideas/ideas")

    @override_settings(GITHUB_IDEAS_TOKEN="")
    def test_configuration_error(self):
        self.assertEqual(Client().get(self.url).status_code, 503)

    @mock.patch("apps.app_ideas.views.github.read_ratings", side_effect=github.GitHubError("unavailable"))
    def test_failure_is_not_an_empty_inbox(self, read):
        self.assertEqual(Client().get(self.url).status_code, 502)

    def test_read_only(self):
        self.assertEqual(Client().post(self.url).status_code, 405)


class ReadRatingsTests(SimpleTestCase):
    @mock.patch("apps.app_ideas.github.requests.post")
    def test_single_snapshot_includes_unrated_and_cleared_ideas(self, post):
        post.return_value.status_code = 200
        post.return_value.json.return_value = {"data": {"repository": {"object": {"entries": [
            {"name": "demo.md", "type": "blob", "object": {"text": set_rating(DOC, 1)}},
            {"name": "clear.md", "type": "blob", "object": {"text": DOC}},
            {"name": "README.txt", "type": "blob", "object": {"text": "ignore"}},
        ]}}}}
        self.assertEqual(github.read_ratings("t", "o/r", "master", "ideas"), {"demo": 1, "clear": None})
        self.assertEqual(post.call_count, 1)
        self.assertEqual(post.call_args.kwargs["json"]["variables"]["expression"], "master:ideas")

    @mock.patch("apps.app_ideas.github.requests.post")
    def test_graphql_errors_and_missing_repository_fail_closed(self, post):
        post.return_value.status_code = 200
        for data in ({"errors": [{"message": "denied"}]}, {"data": {"repository": None}}):
            post.return_value.json.return_value = data
            with self.assertRaises(github.GitHubError):
                github.read_ratings("t", "o/r", "master", "ideas")
