import json
from unittest import mock

from django.contrib.auth import get_user_model
from django.test import Client, TestCase, override_settings

from apps.accounts.tokens import issue_token

from . import github
from .editing import EditError, apply_edit
from .tests import CARD, LESSON_INDEX, PR, QUESTION

BASE = "atomic-lessons/themes/language/early-childhood-english/getting-dressed/"
CARD_PATH = BASE + "cards/01_expressions.md"
LESSON_PATH = BASE + "index.md"
QUESTION_PATH = BASE + "questions/01_complete.yaml"

QUESTION4 = """id: 55555555-5555-4555-8555-555555555555
position: 1
type: multiple_choice
after_card_position: 2
prompt: |-
  Complétez :

  Put this onesie ____.
choices:
- id: aaaa
  text: out
- id: bbbb
  text: "on"
- id: cccc
  text: up
- id: dddd
  text: off
correct_choice_ids:
- bbbb
explanation: On utilise « put on ».
archived: false
"""


class EditingTests(TestCase):
    def test_card_title_and_body_touch_only_those_lines(self):
        new = apply_edit(CARD_PATH, CARD, {"title": "Pick clothes", "body": "**Hi.**\n\n> *Salut.*"})
        self.assertEqual(
            new,
            CARD.replace("title: Choose clothes", "title: Pick clothes").split("---\n")[0]
            + "---\n"
            + CARD.split("---\n")[1].replace("title: Choose clothes", "title: Pick clothes")
            + "---\n**Hi.**\n\n> *Salut.*\n",
        )

    def test_lesson_description_and_missing_key_is_appended(self):
        new = apply_edit(LESSON_PATH, LESSON_INDEX, {"description": "Name: clothes."})
        self.assertIn("description: 'Name: clothes.'\n", new)
        self.assertIn("archived: false", new)
        bare = LESSON_INDEX.replace("description: Name clothes.\n", "")
        self.assertIn("description: New one\n", apply_edit(LESSON_PATH, bare, {"description": "New one"}))

    def test_theme_description_preserves_every_other_byte(self):
        path = "atomic-lessons/themes/technology/index.md"
        text = "---\nid: theme-uuid\ntitle: Technology\ndescription: Short, sourced lessons about technology and artificial intelligence.\nposition: 3\narchived: false\nimage: tech.webp\n---\nIntro stays.\n"
        new = apply_edit(path, text, {"description": "Technology: explained."})
        self.assertEqual(new, text.replace(
            "description: Short, sourced lessons about technology and artificial intelligence.",
            "description: 'Technology: explained.'"))
        for changes in ({"title": "No"}, {"body": "No"}, {"id": "No"}, {"description": "x" * 1001}):
            with self.assertRaises(EditError):
                apply_edit(path, text, changes)
        self.assertIn("description: ''", apply_edit(path, text, {"description": ""}))
        missing = text.replace("description: Short, sourced lessons about technology and artificial intelligence.\n", "")
        self.assertIn("description: New\n", apply_edit(path, missing, {"description": "New"}))

    def test_question_edit_keeps_ids_and_other_fields(self):
        changes = {
            "prompt": "Put this onesie ____.",
            "choices": [
                {"id": "aaaa", "text": "out"},
                {"id": "bbbb", "text": "on"},
                {"id": "cccc", "text": "over"},
                {"id": "dddd", "text": "off"},
            ],
            "correct_choice_id": "cccc",
        }
        new = apply_edit(QUESTION_PATH, QUESTION4, changes)
        self.assertIn("prompt: Put this onesie ____.\n", new)
        self.assertIn("  text: over\n", new)
        self.assertIn("- cccc\n", new)
        self.assertIn("position: 1\n", new)
        self.assertIn("explanation: On utilise « put on ».\n", new)

    def test_rejections(self):
        bad = [
            (CARD_PATH, CARD, {"id": "x"}),
            (CARD_PATH, CARD, {"title": ""}),
            (CARD_PATH, CARD, {"title": "a\nb"}),
            (CARD_PATH, CARD, {"title": "x" * 500}),
            (CARD_PATH, CARD, {}),
            (CARD_PATH, CARD, {"title": "Choose clothes"}),  # no-op
            (QUESTION_PATH, QUESTION4, {"choices": [{"id": "aaaa", "text": "x"}]}),
            (QUESTION_PATH, QUESTION4, {"correct_choice_id": "zzzz"}),
            (
                QUESTION_PATH,
                QUESTION4,
                {"choices": [{"id": c, "text": "same"} for c in ("aaaa", "bbbb", "cccc", "dddd")]},
            ),
            (
                QUESTION_PATH,
                QUESTION4,
                {"choices": [{"id": c, "text": c} for c in ("bbbb", "aaaa", "cccc", "dddd")]},
            ),
            ("atomic-lessons/themes/language/index.md", CARD, {"title": "x"}),
        ]
        for path, text, changes in bad:
            with self.assertRaises(EditError, msg=str(changes)):
                apply_edit(path, text, changes)

    def test_windows_line_endings_are_refused(self):
        with self.assertRaises(EditError):
            apply_edit(CARD_PATH, CARD.replace("\n", "\r\n"), {"title": "x"})


@override_settings(GITHUB_REVIEW_TOKEN="t", GITHUB_REVIEW_REPO="o/r")
class EditEndpointTests(TestCase):
    url = "/api/apps/content-review/prs/7/edits"

    def setUp(self):
        self.user = get_user_model().objects.create_user("thomas", "t@example.com", "test-only-password", is_staff=True)
        self.token = issue_token(self.user)
        pr = dict(PR, head_repo="o/r", base_ref="master")
        patches = {
            "get_pr": mock.patch("apps.content_review.views.github.get_pr", return_value=pr),
            "get_branch_head": mock.patch("apps.content_review.views.github.get_branch_head", return_value="abc123"),
            "get_file": mock.patch("apps.content_review.views.github.get_file", return_value=(CARD, "blob1")),
            "put_file": mock.patch(
                "apps.content_review.views.github.put_file",
                return_value={"sha": "new456", "url": "https://github.com/o/r/commit/new456"},
            ),
        }
        self.mocks = {}
        for name, patcher in patches.items():
            self.mocks[name] = patcher.start()
            self.addCleanup(patcher.stop)
        self.pr = pr

    def post(self, body=None, token=None, **extra):
        payload = {"path": CARD_PATH, "head_sha": "abc123", "changes": {"title": "Pick clothes"}}
        payload.update(body or {})
        return Client().post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token or self.token}",
            **extra,
        )

    def test_commits_the_edit_on_the_pr_branch(self):
        response = self.post()
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["head_sha"], "new456")
        self.assertEqual(data["unit"]["title"], "Pick clothes")
        args = self.mocks["put_file"].call_args.args
        self.assertEqual(args[1:4], ("o/r", CARD_PATH, "feat/bath-time"))
        self.assertIn("title: Pick clothes", args[4])
        self.assertEqual(args[5], "blob1")  # blob sha guards concurrent file edits
        self.assertIn("Pull request #7", args[6])
        self.mocks["get_file"].assert_called_once_with("t", "o/r", CARD_PATH, "abc123")

    def test_theme_description_commits_to_pr_branch(self):
        path = "atomic-lessons/themes/technology/index.md"
        self.mocks["get_file"].return_value = (LESSON_INDEX, "theme-blob")
        response = self.post({"path": path, "changes": {"description": "Technology: explained."}})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["unit"]["description"], "Technology: explained.")
        args = self.mocks["put_file"].call_args.args
        self.assertEqual(args[2:4], (path, "feat/bath-time"))
        self.assertEqual(args[5], "theme-blob")

    def test_access_and_origin(self):
        self.assertEqual(Client().post(self.url, data="{}", content_type="application/json").status_code, 401)
        learner = get_user_model().objects.create_user("l", "l@example.com", "test-only-password")
        self.assertEqual(self.post(token=issue_token(learner)).status_code, 403)
        self.assertEqual(self.post(HTTP_ORIGIN="https://evil.example").status_code, 403)
        self.mocks["put_file"].assert_not_called()

    @override_settings(GITHUB_REVIEW_TOKEN="")
    def test_not_configured(self):
        self.assertEqual(self.post().status_code, 503)

    def test_bad_input(self):
        for body in (
            {"path": "ui/src/App.jsx"},
            {"path": "atomic-lessons/../ui/x.md"},
            {"head_sha": ""},
            {"changes": {"id": "x"}},
            {"changes": {}},
        ):
            self.assertEqual(self.post(body).status_code, 400, body)
        self.mocks["put_file"].assert_not_called()

    def test_stale_head_is_refused(self):
        self.mocks["get_branch_head"].return_value = "zzz999"
        self.assertEqual(self.post().status_code, 409)
        self.mocks["put_file"].assert_not_called()

    def test_file_changed_concurrently(self):
        self.mocks["put_file"].side_effect = github.Conflict("p")
        self.assertEqual(self.post().status_code, 409)

    def test_closed_fork_and_protected_branches_are_refused(self):
        for patch, status in (
            ({"state": "closed"}, 409),
            ({"head_repo": "someone/fork"}, 403),
            ({"head_ref": "master"}, 403),
            ({"head_ref": "release", "base_ref": "release"}, 403),
        ):
            self.mocks["get_pr"].return_value = dict(self.pr, **patch)
            self.assertEqual(self.post().status_code, status, patch)
        self.mocks["put_file"].assert_not_called()

    def test_invalid_edit_never_commits(self):
        self.assertEqual(self.post({"changes": {"title": "Choose clothes"}}).status_code, 400)
        self.mocks["put_file"].assert_not_called()

    def test_missing_write_permission_is_explained(self):
        self.mocks["put_file"].side_effect = github.GitHubError("GitHub refused the commit: the review token needs Contents: write.")
        response = self.post()
        self.assertEqual(response.status_code, 502)
        self.assertIn("Contents: write", response.json()["error"])
