from unittest import mock

from django.contrib.auth import get_user_model
from django.test import Client, TestCase, override_settings

from apps.accounts.tokens import issue_token

from . import github

PR = {
    "number": 7,
    "title": "Add bath time lesson",
    "url": "https://github.com/o/r/pull/7",
    "author": "tomahim",
    "state": "open",
    "head_ref": "feat/bath-time",
    "head_sha": "abc123",
    "updated_at": "2026-10-27T20:00:00Z",
}


@override_settings(GITHUB_REVIEW_TOKEN="t", GITHUB_REVIEW_REPO="o/r")
class PullRequestListTests(TestCase):
    url = "/api/apps/content-review/prs"

    def setUp(self):
        self.user = get_user_model().objects.create_user("thomas", "thomas@example.com", "test-only-password")
        self.token = issue_token(self.user)

    def get(self, token=None):
        headers = {"HTTP_AUTHORIZATION": f"Bearer {token if token is not None else self.token}"}
        return Client().get(self.url, **headers)

    @override_settings(GITHUB_REVIEW_TOKEN="")
    def test_not_configured(self):
        self.assertEqual(self.get().status_code, 503)

    def test_requires_a_token(self):
        self.assertEqual(Client().get(self.url).status_code, 401)

    @mock.patch("apps.content_review.views.github.list_pr_files")
    @mock.patch("apps.content_review.views.github.list_open_prs")
    def test_lists_prs_with_content_counts(self, list_prs, list_files):
        list_prs.return_value = [
            dict(PR),
            dict(PR, number=8, title="Fix deploy", updated_at="2026-10-27T21:00:00Z"),
        ]
        list_files.side_effect = lambda token, repo, number: (
            [
                {"path": "atomic-lessons/themes/language/index.md", "status": "modified", "patch": "", "previous_path": ""},
                {"path": "atomic-lessons/themes/language/x/cards/01.md", "status": "added", "patch": "", "previous_path": ""},
                {"path": "ui/src/App.jsx", "status": "modified", "patch": "", "previous_path": ""},
            ]
            if number == 7
            else [{"path": "ui/src/App.jsx", "status": "modified", "patch": "", "previous_path": ""}]
        )
        response = self.get()
        self.assertEqual(response.status_code, 200)
        prs = response.json()["pull_requests"]
        self.assertEqual([pr["number"] for pr in prs], [7, 8])  # content PR first
        self.assertEqual(
            prs[0]["content_changes"], {"files": 2, "added": 1, "modified": 1, "removed": 0}
        )
        self.assertEqual(
            prs[1]["content_changes"], {"files": 0, "added": 0, "modified": 0, "removed": 0}
        )

    @mock.patch("apps.content_review.views.github.list_open_prs", side_effect=github.GitHubError("down"))
    def test_github_failure_is_a_502(self, _list):
        self.assertEqual(self.get().status_code, 502)
