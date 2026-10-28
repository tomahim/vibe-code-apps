import json
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
        self.user = get_user_model().objects.create_user("thomas", "thomas@example.com", "test-only-password", is_staff=True)
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


THEME_INDEX = """---
id: 11111111-1111-4111-8111-111111111111
position: 1
title: Language
---
Theme intro.
"""
PATH_INDEX = """---
id: 22222222-2222-4222-8222-222222222222
position: 1
title: Early Childhood English
image: ./cover.png
---
Path intro.
"""
LESSON_INDEX = """---
id: 33333333-3333-4333-8333-333333333333
position: 8
title: Getting dressed
description: Name clothes.
archived: false
---
Learn English expressions step by step.
"""
CARD = """---
id: 44444444-4444-4444-8444-444444444444
position: 1
title: Choose clothes
archived: false
---
**Let's get you dressed.**

> *On va s'habiller.*
"""
QUESTION = """id: 55555555-5555-4555-8555-555555555555
position: 1
type: multiple_choice
after_card_position: 2
prompt: "Complétez : Let''s put this onesie ____."
choices:
- id: aaaa
  text: out
- id: bbbb
  text: "on"
correct_choice_ids:
- bbbb
explanation: On utilise « put on ».
archived: false
"""

TEXTS = {
    "atomic-lessons/themes/language/index.md": THEME_INDEX,
    "atomic-lessons/themes/language/early-childhood-english/index.md": PATH_INDEX,
    "atomic-lessons/themes/language/early-childhood-english/getting-dressed/index.md": LESSON_INDEX,
    "atomic-lessons/themes/language/early-childhood-english/getting-dressed/cards/01_expressions.md": CARD,
    "atomic-lessons/themes/language/early-childhood-english/getting-dressed/questions/01_complete.yaml": QUESTION,
}


@override_settings(GITHUB_REVIEW_TOKEN="t", GITHUB_REVIEW_REPO="o/r")
class PullRequestDetailTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user("thomas", "thomas@example.com", "test-only-password", is_staff=True)
        self.token = issue_token(self.user)

    def url(self, number=7):
        return f"/api/apps/content-review/prs/{number}"

    def get(self, number=7):
        return Client().get(self.url(number), HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_requires_a_token(self):
        self.assertEqual(Client().get(self.url()).status_code, 401)

    def test_non_staff_users_cannot_read_detail(self):
        learner = get_user_model().objects.create_user("learner", "l@example.com", "test-only-password")
        response = Client().get(self.url(), HTTP_AUTHORIZATION=f"Bearer {issue_token(learner)}")
        self.assertEqual(response.status_code, 403)

    @override_settings(GITHUB_REVIEW_TOKEN="")
    def test_not_configured(self):
        self.assertEqual(self.get().status_code, 503)

    def change(self, path, status="added", patch="@@ patch"):
        return {"path": path, "status": status, "patch": patch, "previous_path": ""}

    @mock.patch("apps.content_review.views.github.fetch_texts", return_value=TEXTS)
    @mock.patch("apps.content_review.views.github.list_pr_files")
    @mock.patch("apps.content_review.views.github.get_branch_head", return_value="fresh789")
    @mock.patch("apps.content_review.views.github.get_pr", return_value=dict(PR, head_repo="o/r"))
    def test_builds_units_with_breadcrumbs(self, _pr, _head, list_files, fetch_tree):
        list_files.return_value = [
            self.change("atomic-lessons/themes/language/early-childhood-english/getting-dressed/index.md", "modified"),
            self.change("atomic-lessons/themes/language/early-childhood-english/getting-dressed/cards/01_expressions.md"),
            self.change("atomic-lessons/themes/language/early-childhood-english/getting-dressed/questions/01_complete.yaml"),
            self.change("atomic-lessons/themes/language/early-childhood-english/cover.png", patch=""),
            self.change("ui/src/App.jsx"),
        ]
        response = self.get()
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["pr"]["number"], 7)
        self.assertEqual(data["pr"]["head_sha"], "fresh789")  # branch ref, not the lagging PR object
        self.assertEqual(data["summary"], {"added": 2, "modified": 1, "removed": 0})
        units = {u["path"]: u for u in data["units"]}
        self.assertEqual(len(units), 3)

        lesson = units["atomic-lessons/themes/language/early-childhood-english/getting-dressed/index.md"]
        self.assertEqual(lesson["kind"], "lesson")
        self.assertEqual(lesson["change"], "modified")
        self.assertEqual(lesson["title"], "Getting dressed")
        self.assertEqual(lesson["body"], "Learn English expressions step by step.")
        self.assertEqual(lesson["breadcrumbs"], ["Language", "Early Childhood English"])

        card = units["atomic-lessons/themes/language/early-childhood-english/getting-dressed/cards/01_expressions.md"]
        self.assertEqual(card["kind"], "card")
        self.assertEqual(card["breadcrumbs"], ["Language", "Early Childhood English", "Getting dressed"])
        self.assertIn("Let's get you dressed.", card["body"])

        question = units["atomic-lessons/themes/language/early-childhood-english/getting-dressed/questions/01_complete.yaml"]
        self.assertEqual(question["kind"], "question")
        self.assertEqual(question["question"]["answer"], "bbbb")
        self.assertEqual(question["question"]["after_card_position"], 2)
        self.assertEqual(len(question["question"]["options"]), 2)

        # Binary images and non-content files are visible but not units.
        self.assertEqual(
            data["other_changes"],
            [{"path": "atomic-lessons/themes/language/early-childhood-english/cover.png", "change": "added", "patch": ""}],
        )
        fetch_tree.assert_called_once()

    @mock.patch("apps.content_review.views.github.fetch_texts", return_value=TEXTS)
    @mock.patch("apps.content_review.views.github.list_pr_files")
    @mock.patch("apps.content_review.views.github.get_pr", return_value=dict(PR))
    def test_removed_and_broken_files_do_not_crash(self, _pr, list_files, _tree):
        list_files.return_value = [
            self.change("atomic-lessons/themes/language/early-childhood-english/getting-dressed/cards/02_expressions.md", "removed"),
            self.change("atomic-lessons/themes/language/early-childhood-english/getting-dressed/cards/01_expressions.md"),
        ]
        broken = dict(TEXTS)
        broken["atomic-lessons/themes/language/early-childhood-english/getting-dressed/cards/01_expressions.md"] = "no front matter"
        with mock.patch("apps.content_review.views.github.fetch_texts", return_value=broken):
            data = self.get().json()
        units = {u["path"]: u for u in data["units"]}
        removed = units["atomic-lessons/themes/language/early-childhood-english/getting-dressed/cards/02_expressions.md"]
        self.assertEqual(removed["change"], "removed")
        self.assertIsNone(removed["title"])
        broken_card = units["atomic-lessons/themes/language/early-childhood-english/getting-dressed/cards/01_expressions.md"]
        self.assertIsNotNone(broken_card["parse_error"])

    @mock.patch("apps.content_review.views.github.list_pr_files", return_value=[{"path": "ui/src/App.jsx", "status": "modified", "patch": "", "previous_path": ""}])
    @mock.patch("apps.content_review.views.github.get_pr", return_value=dict(PR))
    def test_pr_without_content_changes_skips_tree_fetch(self, _pr, _files):
        with mock.patch("apps.content_review.views.github.fetch_texts") as fetch_tree:
            data = self.get().json()
        self.assertEqual(data["units"], [])
        self.assertEqual(data["other_changes"], [])
        fetch_tree.assert_not_called()

    @mock.patch("apps.content_review.views.github.get_pr", side_effect=github.NotFound("nope"))
    def test_unknown_pr_is_a_404(self, _pr):
        self.assertEqual(self.get(404).status_code, 404)

    @mock.patch("apps.content_review.views.github.fetch_texts", return_value=TEXTS)
    @mock.patch("apps.content_review.views.github.list_pr_files")
    @mock.patch("apps.content_review.views.github.get_pr", return_value=dict(PR))
    def test_changed_file_missing_from_head_tree_is_tolerated(self, _pr, list_files, _tree):
        # Stale diff data: GitHub lists the file but the head tree no longer has it.
        list_files.return_value = [
            self.change("atomic-lessons/themes/language/early-childhood-english/getting-dressed/cards/09_gone.md", "modified"),
        ]
        data = self.get().json()
        unit = data["units"][0]
        self.assertEqual(unit["change"], "modified")
        self.assertIsNone(unit["title"])
        self.assertIsNone(unit["parse_error"])

    @mock.patch("apps.content_review.views.github.list_pr_files", side_effect=github.GitHubError("down"))
    @mock.patch("apps.content_review.views.github.get_pr", return_value=dict(PR))
    def test_github_failure_is_a_502(self, _pr, _files):
        self.assertEqual(self.get().status_code, 502)


@override_settings(GITHUB_REVIEW_TOKEN="t", GITHUB_REVIEW_REPO="o/r")
class PostCommentTests(TestCase):
    url = "/api/apps/content-review/prs/7/comments"

    def setUp(self):
        self.user = get_user_model().objects.create_user("thomas", "thomas@example.com", "test-only-password", is_staff=True)
        self.token = issue_token(self.user)

    def post(self, data, token=None, **extra):
        headers = {"HTTP_AUTHORIZATION": f"Bearer {token if token is not None else self.token}"}
        return Client().post(self.url, json.dumps(data), content_type="application/json", **headers, **extra)

    def test_requires_a_token(self):
        response = Client().post(self.url, '{"text": "hi"}', content_type="application/json")
        self.assertEqual(response.status_code, 401)

    def test_non_staff_users_cannot_comment(self):
        learner = get_user_model().objects.create_user("learner", "l@example.com", "test-only-password")
        response = Client().post(
            self.url, '{"text": "hi"}', content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {issue_token(learner)}",
        )
        self.assertEqual(response.status_code, 403)

    @override_settings(GITHUB_REVIEW_TOKEN="")
    def test_not_configured(self):
        self.assertEqual(self.post({"text": "hi"}).status_code, 503)

    def test_rejects_bad_input(self):
        self.assertEqual(self.post({"text": ""}).status_code, 400)
        self.assertEqual(self.post({"text": "   "}).status_code, 400)
        self.assertEqual(self.post({"text": 3}).status_code, 400)
        self.assertEqual(self.post({}).status_code, 400)
        self.assertEqual(self.post({"text": "x" * 5001}).status_code, 400)
        self.assertEqual(self.post({"text": "ok", "path": "ui/src/App.jsx"}).status_code, 400)
        self.assertEqual(self.post({"text": "ok", "path": "atomic-lessons/../api/config/settings.py"}).status_code, 400)
        self.assertEqual(self.post({"text": "ok", "path": "atomic-lessons/"}).status_code, 400)
        response = Client().post(
            self.url, "x", content_type="text/plain",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
        )
        self.assertEqual(response.status_code, 415)

    def test_rejects_cross_origin(self):
        self.assertEqual(self.post({"text": "hi"}, HTTP_ORIGIN="https://evil.example").status_code, 403)

    @mock.patch("apps.content_review.views.github.post_pr_comment")
    def test_posts_unit_comment_with_context(self, post_comment):
        post_comment.return_value = {"id": 42, "url": "https://github.com/o/r/pull/7#issuecomment-42"}
        response = self.post(
            {
                "text": "Typo in the French translation.",
                "kind": "card",
                "title": "Choose clothes",
                "path": "atomic-lessons/themes/language/early-childhood-english/getting-dressed/cards/01_expressions.md",
            },
            HTTP_ORIGIN="http://testserver",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["comment"]["url"], "https://github.com/o/r/pull/7#issuecomment-42")
        body = post_comment.call_args.args[3]
        self.assertIn('card "Choose clothes"', body)
        self.assertIn("atomic-lessons/themes/language/early-childhood-english/getting-dressed/cards/01_expressions.md", body)
        self.assertIn("Typo in the French translation.", body)

    @mock.patch("apps.content_review.views.github.post_pr_comment")
    def test_posts_general_comment_without_unit(self, post_comment):
        post_comment.return_value = {"id": 43, "url": "https://github.com/o/r/pull/7#issuecomment-43"}
        response = self.post({"text": "Looks good overall."}, HTTP_ORIGIN="http://testserver")
        self.assertEqual(response.status_code, 201)
        body = post_comment.call_args.args[3]
        self.assertEqual(body, "**Content review** - Pull request\n\nLooks good overall.")

    @mock.patch("apps.content_review.views.github.post_pr_comment", side_effect=github.NotFound("nope"))
    def test_unknown_pr_is_a_404(self, _post):
        self.assertEqual(self.post({"text": "hi"}, HTTP_ORIGIN="http://testserver").status_code, 404)

    @mock.patch("apps.content_review.views.github.post_pr_comment", side_effect=github.GitHubError("down"))
    def test_github_failure_is_a_502(self, _post):
        self.assertEqual(self.post({"text": "hi"}, HTTP_ORIGIN="http://testserver").status_code, 502)


class FetchTextsTests(TestCase):
    def test_requests_only_needed_paths_in_batches(self):
        from .review import needed_paths

        base = "atomic-lessons/themes/t/p/l"
        files = [
            {"path": f"{base}/cards/{i:02d}.md", "status": "added", "patch": "", "previous_path": ""}
            for i in range(50)
        ] + [
            {"path": f"{base}/cards/gone.md", "status": "removed", "patch": "", "previous_path": ""},
            {"path": "atomic-lessons/themes/t/p/cover.png", "status": "added", "patch": "", "previous_path": ""},
        ]
        paths = needed_paths(files)
        self.assertIn("atomic-lessons/themes/t/index.md", paths)
        self.assertIn("atomic-lessons/themes/t/p/index.md", paths)
        self.assertIn(f"{base}/index.md", paths)
        self.assertNotIn(f"{base}/cards/gone.md", paths)
        self.assertEqual(len(paths), 53)

        def fake_post(url, **kwargs):
            query = kwargs["json"]["query"]
            count = query.count("object(expression")
            self.assertLessEqual(count, github.TEXT_BATCH)
            body = {"data": {"repository": {f"f{i}": {"text": f"t{i}"} for i in range(count)}}}
            return mock.Mock(status_code=200, json=lambda: body)

        with mock.patch("apps.content_review.github.requests.post", side_effect=fake_post) as post:
            texts = github.fetch_texts("tok", "o/r", "abc", paths)
        self.assertEqual(post.call_count, 2)
        self.assertTrue(texts)
