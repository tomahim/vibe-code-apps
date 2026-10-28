"""Bounded Notion reader and narrow archive-checkbox writer. No disk persistence and no cache (gunicorn runs several workers with per-process memory, so an archive could not invalidate every worker)."""
import uuid
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import requests
from django.conf import settings
from django.utils import timezone


class NewsUnavailable(Exception):
    pass


def safe_url(value):
    try:
        parsed = urlsplit(value or "")
        if parsed.scheme not in {"https", "http"} or not parsed.hostname or parsed.username or parsed.password:
            return None
        return value
    except (ValueError, TypeError):
        return None


def canonical_url(value):
    parsed = urlsplit(value)
    query = [(k, v) for k, v in parse_qsl(parsed.query) if not k.lower().startswith("utm_") and k not in {"fbclid", "gclid"}]
    return urlunsplit((parsed.scheme, parsed.netloc.lower(), parsed.path.rstrip("/"), urlencode(query), ""))


def text(prop):
    kind = prop.get("type", "rich_text")
    if kind in {"title", "rich_text"}:
        return "".join(part.get("plain_text", part.get("text", {}).get("content", "")) for part in prop.get(kind, []))
    if kind in {"select", "status"}:
        return (prop.get(kind) or {}).get("name", "")
    return ""


def normalize(page):
    props = page.get("properties", {})
    def value(name):
        return text(props.get(name, {})).strip()
    def date(name):
        raw = (props.get(name, {}).get("date") or {}).get("start")
        try:
            # Added is an edition date, not the article's publication date.
            from datetime import date as date_type
            return date_type.fromisoformat(raw[:10]).isoformat() if raw else None
        except (ValueError, TypeError):
            return None
    return {
        "id": page.get("id"), "title": value("Title") or "Untitled story",
        "url": safe_url(props.get("URL", {}).get("url")),
        "notion_url": safe_url(page.get("url")),
        "source": value("Source") or "Unknown source",
        "author": value("Author") or "Unknown author",
        "published": date("Published"), "added": date("Added"),
        "topics": [tag["name"] for tag in props.get("Topics", {}).get("multi_select", []) if tag.get("name")],
        "why_it_matters": value("Why it matters"),
        # Preserve provenance verbatim. Do not infer a confirmed badge from prose.
        "archived": props.get("Archived", {}).get("checkbox", False),
        "category": value("Category") or "News",
        "claim_status": value("Claim status") or "Verification status not provided",
    }


def read_news(cursor=None, archived=False, topic="", query="", undated=False, category="News", page_size=20):
    try:
        source = str(uuid.UUID(settings.NOTION_NEWS_DATA_SOURCE_ID))
    except (ValueError, AttributeError):
        raise NewsUnavailable("News is not configured on the server.") from None
    if not settings.NOTION_NEWS_TOKEN:
        raise NewsUnavailable("News is not configured on the server.")
    filters = [{"property": "Archived", "checkbox": {"equals": archived}}]
    filters.append({"property": "Published", "date": {"is_empty" if undated else "is_not_empty": True}})
    if category:
        filters.append({"property": "Category", "select": {"equals": category}})
    if topic:
        filters.append({"property": "Topics", "multi_select": {"contains": topic}})
    if query:
        filters.append({"or": [
            {"property": "Title", "title": {"contains": query}},
            *[{"property": name, "rich_text": {"contains": query}} for name in ("Why it matters", "Author", "Source")],
        ]})
    body = {"page_size": page_size, "filter": {"and": filters}, "sorts": [
        {"property": "Published", "direction": "descending"},
        {"property": "Added", "direction": "descending"},
        {"timestamp": "created_time", "direction": "descending"},
    ]}
    if cursor:
        body["start_cursor"] = cursor
    try:
        response = requests.post(
            f"https://api.notion.com/v1/data_sources/{source}/query",
            headers={"Authorization": f"Bearer {settings.NOTION_NEWS_TOKEN}",
                     "Notion-Version": "2026-03-11", "Content-Type": "application/json"},
            json=body, timeout=(3, 12), allow_redirects=False,
        )
        if response.status_code != 200:
            raise NewsUnavailable("Notion is unavailable or the connection lacks database access. Try again later or check setup.")
        payload = response.json()
        if not isinstance(payload.get("results"), list):
            raise ValueError("Invalid results")
        items, seen = [], set()
        for page in payload["results"]:
            if page.get("archived") or page.get("in_trash"):
                continue
            item = normalize(page)
            dedupe = canonical_url(item["url"]) if item["url"] else item["id"]
            if dedupe in seen:
                continue
            seen.add(dedupe)
            items.append(item)
        next_cursor = payload.get("next_cursor") if payload.get("has_more") else None
        if payload.get("has_more") and not isinstance(next_cursor, str):
            raise ValueError("Missing pagination cursor")
    except (requests.RequestException, ValueError, KeyError, TypeError, AttributeError):
        raise NewsUnavailable("Could not read the Notion news feed. Try again later.") from None
    result = {"items": items, "next_cursor": next_cursor, "fetched_at": timezone.now().isoformat()}
    return result


def set_property(page_id, name, value):
    """Check membership before a narrow update; never trash the Notion page."""
    if not settings.NOTION_NEWS_TOKEN or not settings.NOTION_NEWS_DATA_SOURCE_ID:
        raise NewsUnavailable("News is not configured on the server.")
    headers = {"Authorization": f"Bearer {settings.NOTION_NEWS_TOKEN}", "Notion-Version": "2026-03-11", "Content-Type": "application/json"}
    try:
        page_url = f"https://api.notion.com/v1/pages/{uuid.UUID(str(page_id))}"
        response = requests.get(page_url, headers=headers, timeout=(3, 12), allow_redirects=False)
        if response.status_code != 200:
            raise NewsUnavailable("Could not verify this news record.")
        parent = response.json().get("parent", {})
        if parent.get("type") != "data_source_id" or uuid.UUID(parent.get("data_source_id", "")) != uuid.UUID(settings.NOTION_NEWS_DATA_SOURCE_ID):
            raise NewsUnavailable("This record is not in the news data source.")
        response = requests.patch(page_url, headers=headers, json={"properties": {name: value}}, timeout=(3, 12), allow_redirects=False)
        if response.status_code != 200:
            raise NewsUnavailable("Could not save reading state. Check Update content permission.")
        saved = response.json().get("properties", {}).get(name, {})
        matches = ((saved.get("select") or {}).get("name") == value["select"]["name"]
                   if name == "Category" else saved.get("checkbox") is value["checkbox"])
        if not matches:
            raise NewsUnavailable("Notion did not confirm the saved state. Refresh before retrying.")
    except (requests.RequestException, ValueError, TypeError, AttributeError):
        raise NewsUnavailable("Could not save reading state in Notion. Refresh to check before retrying.") from None


def set_archived(page_id, archived):
    set_property(page_id, "Archived", {"checkbox": archived})


def set_category(page_id, category):
    if category not in {"Inbox", "News", "Favorite", "Inspiration"}:
        raise NewsUnavailable("Unknown category.")
    set_property(page_id, "Category", {"select": {"name": category}})
