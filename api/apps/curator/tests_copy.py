import base64
import copy
import hashlib
from datetime import date
from io import StringIO
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase

from .copying import CopyError, copy_bundle, prepare, report, tag_slug
from .exporting import NotionReader, digest
from .models import Content, ContentSource


def bundle():
    pages = []
    for index, category in enumerate(["News", "Inbox", "Favorite", "Inspiration"]):
        props = {"Category": {"type": "select", "select": {"name": category}},
                 "Title": {"type": "title", "title": [{"plain_text": category}]},
                 "Archived": {"type": "checkbox", "checkbox": category == "Inbox"},
                 "Added": {"type": "date", "date": {"start": "2026-01-31"}},
                 "Topics": {"type": "multi_select", "multi_select": [{"name": "Coding agents"}]}}
        pages.append({"page": {"id": f"page-{index}", "properties": props,
                               "created_time": "2026-01-01T23:30:00Z", "last_edited_time": "2026-01-31T12:00:00Z"},
                      "blocks": [], "files": []})
    b = {"version": 1, "github_repository": "tomahim/vibe-code-apps", "github_revision": "abc123",
         "ideas": [{"path": f"idea-{rating}.md", "markdown": f'---\nname: Idea {rating}\ncreated: 2026-01-31T23:30:00Z\nrating: {rating}\ndomains: [LEARN]\n---\nFull body\n'} for rating in [1, 2, 3]],
         "notion": {"data_source_id": "notion-source", "pages": pages}}
    b["sha256"] = digest(b)
    return b


class CuratorCopyTests(TestCase):
    def setUp(self):
        self.owner = get_user_model().objects.create_user(username="copy-owner")

    def test_dry_run_has_zero_writes_and_preserves_dates_and_mapping(self):
        b = bundle()
        result = report(b)
        self.assertEqual(Content.objects.count(), 0)
        self.assertEqual(result["types"], {"idea": 3, "news": 1, "bookmark": 3})
        self.assertEqual(result["tags"]["inspiration"], 1)
        self.assertNotIn("inbox", result["tags"])  # archived Inbox loses inbox
        self.assertEqual(prepare(b)[0]["fields"]["saved_on"], date(2026, 2, 1))

    def test_copy_and_rerun_are_idempotent_and_do_not_overwrite_user_edits(self):
        b = bundle()
        self.assertEqual(copy_bundle(b, self.owner.pk)["created"], 7)
        content = Content.objects.first()
        content.title = "My edited title"
        content.save()
        self.assertEqual(copy_bundle(b, self.owner.pk)["skipped"], 7)
        content.refresh_from_db()
        self.assertEqual(content.title, "My edited title")
        self.assertEqual(ContentSource.objects.count(), 7)

    def test_changed_source_rolls_back_entire_copy(self):
        b = bundle()
        copy_bundle(b, self.owner.pk)
        changed = copy.deepcopy(b)
        changed.pop("sha256")
        changed["ideas"][0]["markdown"] += "Changed"
        changed["sha256"] = digest(changed)
        with self.assertRaises(CopyError):
            copy_bundle(changed, self.owner.pk)
        self.assertEqual(Content.objects.count(), 7)

    def test_invalid_attachment_checksum_blocks_dry_run(self):
        b = bundle(); b.pop("sha256")
        b["notion"]["pages"][0]["files"] = [{"data": base64.b64encode(b'hello').decode(), "byte_size": 5, "sha256": "wrong"}]
        b["sha256"] = digest(b)
        with self.assertRaises(CopyError): report(b)

    def test_corrupt_bundle_rejected(self):
        b = bundle(); b["ideas"][0]["markdown"] += "x"
        with self.assertRaises(CopyError): report(b)

    def test_duplicate_identity_rejected(self):
        b = bundle(); b.pop("sha256"); b["ideas"].append(b["ideas"][0]); b["sha256"] = digest(b)
        with self.assertRaises(CopyError): report(b)

    def test_wrong_owner_rejected(self):
        b = bundle(); copy_bundle(b, self.owner.pk)
        other = get_user_model().objects.create_user(username="other")
        with self.assertRaises(CopyError): copy_bundle(b, other.pk)

    def test_reserved_topic_names_cannot_become_system_tags(self):
        self.assertNotEqual(tag_slug("archive"), "archive")
        self.assertNotEqual(tag_slug("Coding agents"), tag_slug("coding-agents"))

    def test_empty_tables_on_unresolved_semantic_tag(self):
        b = bundle()
        from .models import Tag
        Tag.objects.filter(slug="promising").delete()
        with self.assertRaises(CopyError): copy_bundle(b, self.owner.pk)
        self.assertEqual(Content.objects.count(), 0)

    def test_export_blocks_follows_pagination_and_children(self):
        reader = NotionReader("not-logged", sleep=lambda _: None)
        reader.request = lambda path: ({"results": [{"id": "nested", "has_children": True, "type": "paragraph"}], "has_more": True, "next_cursor": "next"} if path == "blocks/root/children?page_size=100" else {"results": [], "has_more": False})
        self.assertEqual(reader.blocks("root")[0]["exported_children"], [])

    def test_attachment_unknown_origin_rejected_without_network(self):
        reader = NotionReader("not-logged")
        for url in ["http://127.0.0.1/a", "https://evil.test/a", "https://notion.so.evil.test/a"]:
            with self.assertRaises(ValueError): reader.attachment(url)
