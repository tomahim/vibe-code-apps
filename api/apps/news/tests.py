from unittest.mock import Mock, patch
import uuid

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase, override_settings

from apps.accounts.tokens import issue_token
from .notion import NewsUnavailable, normalize, read_news, safe_url, set_archived, set_category

SOURCE = "c6ff1ba1-556e-473e-bdae-25df05e4c383"
PAGE = "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa"


def record(index=0):
    return {"id": str(uuid.UUID(int=index + 1)), "properties": {"Title": {"type": "title", "title": [{"plain_text": f"Story {index}"}]}, "URL": {"url": f"https://example.com/{index}"}, "Added": {"date": {"start": "2026-10-26"}}}}


@override_settings(NOTION_NEWS_TOKEN="synthetic-token", NOTION_NEWS_DATA_SOURCE_ID=SOURCE)
class AdapterTests(TestCase):
    def setUp(self):
        cache.clear()

    def test_unknown_fields_and_unsafe_urls(self):
        item = normalize(record())
        self.assertEqual(item["author"], "Unknown author")
        self.assertIsNone(item["published"])
        self.assertIsNone(safe_url("javascript:alert(1)"))
        self.assertIsNone(safe_url("https://user:pass@example.com"))

    @patch("apps.news.notion.requests.post")
    def test_filter_order_and_pagination(self, post):
        post.return_value = Mock(status_code=200, json=lambda: {"results": [record()], "has_more": True, "next_cursor": "next"})
        result = read_news(None, False)
        self.assertEqual(result["next_cursor"], "next")
        kwargs = post.call_args.kwargs
        self.assertEqual(kwargs["json"]["filter"]["and"][0], {"property": "Archived", "checkbox": {"equals": False}})
        self.assertEqual(kwargs["json"]["sorts"], [
            {"property": "Published", "direction": "descending"},
            {"property": "Added", "direction": "descending"},
            {"timestamp": "created_time", "direction": "descending"},
        ])
        self.assertEqual(kwargs["json"]["filter"]["and"][1], {"property": "Published", "date": {"is_not_empty": True}})
        self.assertEqual(kwargs["json"]["page_size"], 20)
        read_news(None, False, page_size=17)
        self.assertEqual(post.call_args.kwargs["json"]["page_size"], 17)
        self.assertEqual(post.call_count, 2)  # never served from a per-worker cache
        read_news("next", True, "Science", "particle")
        self.assertEqual(post.call_args.kwargs["json"]["start_cursor"], "next")
        filters = post.call_args.kwargs["json"]["filter"]["and"]
        self.assertTrue(filters[0]["checkbox"]["equals"])
        self.assertEqual(filters[3], {"property": "Topics", "multi_select": {"contains": "Science"}})
        self.assertEqual(filters[4]["or"][0], {"property": "Title", "title": {"contains": "particle"}})

    @patch("apps.news.notion.requests.patch")
    @patch("apps.news.notion.requests.get")
    @patch("apps.news.notion.requests.post")
    def test_list_after_archive_reflects_notion_immediately(self, post, get, patch_page):
        get.return_value = Mock(status_code=200, json=lambda: {"parent": {"type": "data_source_id", "data_source_id": SOURCE}})
        patch_page.return_value = Mock(status_code=200, json=lambda: {"properties": {"Archived": {"checkbox": True}}})
        post.return_value = Mock(status_code=200, json=lambda: {"results": [record()], "has_more": False})
        self.assertEqual(len(read_news(None, False)["items"]), 1)
        set_archived(PAGE, True)
        post.return_value = Mock(status_code=200, json=lambda: {"results": [], "has_more": False})
        self.assertEqual(read_news(None, False)["items"], [])

    @patch("apps.news.notion.requests.post")
    def test_errors_do_not_return_upstream_secret_body(self, post):
        post.return_value = Mock(status_code=401, text="secret upstream body")
        with self.assertRaises(NewsUnavailable) as error:
            read_news()
        self.assertNotIn("secret", str(error.exception))

    @patch("apps.news.notion.requests.post")
    def test_dedupe_tracking_alias(self, post):
        first, second = record(1), record(2)
        second["properties"]["URL"]["url"] = "https://example.com/1?utm_source=mail"
        post.return_value = Mock(status_code=200, json=lambda: {"results": [first, second], "has_more": False})
        self.assertEqual(len(read_news()["items"]), 1)

    @patch("apps.news.notion.requests.patch")
    @patch("apps.news.notion.requests.get")
    def test_archive_checks_membership_and_changes_only_checkbox(self, get, patch_page):
        get.return_value = Mock(status_code=200, json=lambda: {"parent": {"type": "data_source_id", "data_source_id": SOURCE}})
        patch_page.return_value = Mock(status_code=200, json=lambda: {"properties": {"Archived": {"checkbox": True}}})
        set_archived(PAGE, True)
        self.assertEqual(patch_page.call_args.kwargs["json"], {"properties": {"Archived": {"checkbox": True}}})
        get.return_value = Mock(status_code=200, json=lambda: {"parent": {"type": "data_source_id", "data_source_id": str(uuid.uuid4())}})
        with self.assertRaises(NewsUnavailable):
            set_archived(PAGE, True)
        self.assertEqual(patch_page.call_count, 1)

    @patch("apps.news.notion.requests.patch")
    @patch("apps.news.notion.requests.get")
    def test_category_only_write_keeps_archive_independent(self, get, update):
        get.return_value = Mock(status_code=200, json=lambda: {"parent": {"type": "data_source_id", "data_source_id": SOURCE}})
        update.return_value = Mock(status_code=200, json=lambda: {"properties": {"Category": {"select": {"id": "x", "name": "Favorite", "color": "yellow"}}, "Archived": {"checkbox": True}}})
        set_category(PAGE, "Favorite")
        self.assertEqual(update.call_args.kwargs["json"], {"properties": {"Category": {"select": {"name": "Favorite"}}}})
        with self.assertRaises(NewsUnavailable):
            set_category(PAGE, "Archive")
        self.assertEqual(update.call_count, 1)

    @patch("apps.news.notion.requests.post")
    def test_category_filters_do_not_mix_lists_and_archive_spans_all(self, post):
        post.return_value = Mock(status_code=200, json=lambda: {"results": [], "has_more": False})
        for category in ("Inbox", "News", "Favorite", "Inspiration"):
            read_news(category=category)
            self.assertIn({"property": "Category", "select": {"equals": category}}, post.call_args.kwargs["json"]["filter"]["and"])
        read_news(archived=True, category="")
        self.assertFalse(any(x.get("property") == "Category" for x in post.call_args.kwargs["json"]["filter"]["and"]))


@override_settings(ROOT_URLCONF="apps.news.urls", NOTION_NEWS_DATA_SOURCE_ID=SOURCE)
class ViewTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="reader", password="synthetic-pass")
        self.token = issue_token(self.user)
        self.auth = {"HTTP_AUTHORIZATION": f"Bearer {self.token}"}
        self.override = override_settings(NOTION_NEWS_ALLOWED_USER_IDS={str(self.user.pk)})
        self.override.enable()
        self.addCleanup(self.override.disable)

    @patch("apps.news.views.read_news")
    def test_auth_and_allowlist_checked_before_notion(self, read):
        self.assertEqual(self.client.get("/").status_code, 401)
        with override_settings(NOTION_NEWS_ALLOWED_USER_IDS=set()):
            self.assertEqual(self.client.get("/", **self.auth).status_code, 403)
        read.assert_not_called()

    @patch("apps.news.views.read_news")
    def test_page_cursor_is_signed_user_and_list_bound(self, read):
        read.return_value = {"items": [], "next_cursor": "opaque", "fetched_at": "2026-10-26T08:00:00Z"}
        first = self.client.get("/", **self.auth).json()["next_cursor"]
        self.assertNotEqual(first, "opaque")
        self.assertEqual(self.client.get("/", {"cursor": first}, **self.auth).status_code, 200)
        read.assert_called_with("opaque", False, "", "", False, "News", page_size=20)
        self.assertEqual(self.client.get("/", {"cursor": first, "view": "archive"}, **self.auth).status_code, 400)
        self.assertEqual(self.client.get("/", {"cursor": "forged"}, **self.auth).status_code, 400)

    @patch("apps.news.views.read_news")
    def test_short_dated_page_fills_from_undated_and_continues(self, read):
        def item(i):
            return {"id": str(i)}
        read.side_effect = [
            {"items": [item(i) for i in range(3)], "next_cursor": None, "fetched_at": "now"},
            {"items": [item(i) for i in range(3, 20)], "next_cursor": "undated-next", "fetched_at": "now"},
            {"items": [item(i) for i in range(20, 25)], "next_cursor": None, "fetched_at": "now"},
        ]
        first = self.client.get("/", {"view": "inbox"}, **self.auth).json()
        self.assertEqual(len(first["items"]), 20)
        self.assertIsNotNone(first["next_cursor"])
        read.assert_called_with(None, False, "", "", True, "Inbox", page_size=17)
        second = self.client.get("/", {"view": "inbox", "cursor": first["next_cursor"]}, **self.auth).json()
        read.assert_called_with("undated-next", False, "", "", True, "Inbox", page_size=20)
        self.assertEqual([x["id"] for x in first["items"] + second["items"]], [str(i) for i in range(25)])
        self.assertIsNone(second["next_cursor"])

    @patch("apps.news.views.read_news")
    def test_exact_full_undated_page_has_no_empty_next(self, read):
        read.side_effect = [
            {"items": [], "next_cursor": None, "fetched_at": "now"},
            {"items": [{"id": str(i)} for i in range(20)], "next_cursor": None, "fetched_at": "now"},
        ]
        result = self.client.get("/", **self.auth).json()
        self.assertEqual(len(result["items"]), 20)
        self.assertIsNone(result["next_cursor"])

    @patch("apps.news.views.read_news")
    def test_full_dated_page_continuation_enters_undated(self, read):
        read.side_effect = [
            {"items": [{"id": str(i)} for i in range(20)], "next_cursor": None, "fetched_at": "now"},
            {"items": [{"id": "unknown"}], "next_cursor": None, "fetched_at": "now"},
            {"items": [{"id": "unknown"}], "next_cursor": None, "fetched_at": "now"},
        ]
        first = self.client.get("/", **self.auth).json()
        second = self.client.get("/", {"cursor": first["next_cursor"]}, **self.auth).json()
        read.assert_called_with(None, False, "", "", True, "News", page_size=20)
        self.assertEqual(second["items"], [{"id": "unknown"}])
        self.assertIsNone(second["next_cursor"])

    @patch("apps.news.views.set_archived")
    def test_archive_guards_and_boolean(self, update):
        url = f"/{PAGE}/archive/"
        self.assertEqual(self.client.post(url, {"archived": True}, content_type="application/json").status_code, 401)
        self.assertEqual(self.client.post(url, {"archived": True}, content_type="application/json", HTTP_ORIGIN="https://other.test", **self.auth).status_code, 403)
        self.assertEqual(self.client.post(url, {"archived": "yes"}, content_type="application/json", **self.auth).status_code, 400)
        response = self.client.post(url, {"archived": True}, content_type="application/json", **self.auth)
        self.assertEqual(response.status_code, 200)
        update.assert_called_once_with(uuid.UUID(PAGE), True)

    @patch("apps.news.views.set_archived", side_effect=NewsUnavailable("Check setup."))
    def test_upstream_update_failure_not_reported_saved(self, update):
        self.assertEqual(self.client.post(f"/{PAGE}/archive/", {"archived": False}, content_type="application/json", **self.auth).status_code, 503)

    @patch("apps.news.views.set_category")
    def test_category_endpoint_validation_and_origin(self, update):
        url = f"/{PAGE}/category/"
        self.assertEqual(self.client.post(url, {"category": "Favorite"}, content_type="application/json").status_code, 401)
        self.assertEqual(self.client.post(url, {"category": "Favorite"}, content_type="application/json", HTTP_ORIGIN="https://other.test", **self.auth).status_code, 403)
        for value in ("Archive", "other", True):
            self.assertEqual(self.client.post(url, {"category": value}, content_type="application/json", **self.auth).status_code, 400)
        self.assertEqual(self.client.post(url, {"category": "Favorite"}, content_type="application/json", **self.auth).status_code, 200)
        update.assert_called_once_with(uuid.UUID(PAGE), "Favorite")
