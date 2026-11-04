"""Deterministic mapping and append-only/idempotent copy, never source mutation."""
import base64
import hashlib
import json
import re
import uuid
from collections import Counter
from datetime import date, datetime
from zoneinfo import ZoneInfo

from django.db import transaction
from django.utils.text import slugify

from .exporting import digest
from .models import Category, Content, ContentCategory, ContentSource, ContentTag, ObjectType, Tag


class CopyError(ValueError):
    pass


def rich(parts):
    return "".join(item.get("plain_text", item.get("text", {}).get("content", "")) for item in parts)


def prop(page, name):
    item = page["properties"].get(name, {})
    kind = item.get("type")
    if kind in {"title", "rich_text"}:
        return rich(item.get(kind, []))
    if kind == "select":
        return (item.get(kind) or {}).get("name", "")
    if kind == "date":
        return (item.get(kind) or {}).get("start")
    return item.get(kind) if kind else None


def day(value, *, instant=False):
    if not value:
        return None
    if isinstance(value, datetime):
        parsed = value
    elif isinstance(value, date):
        return value
    elif instant:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    else:
        return date.fromisoformat(value[:10])
    if not parsed.tzinfo:
        raise CopyError("Source creation instant must include timezone.")
    return parsed.astimezone(ZoneInfo("Europe/Paris")).date()


def json_safe(value):
    return json.loads(json.dumps(value, default=lambda item: item.isoformat()))


def blocks_markdown(blocks):
    """Readable rendering; original rich blocks are ALSO retained losslessly."""
    lines = []
    for block in blocks:
        kind = block["type"]
        data = block.get(kind, {})
        text = rich(data.get("rich_text", []))
        if kind.startswith("heading_"):
            text = "#" * int(kind[-1]) + " " + text
        elif kind == "bulleted_list_item":
            text = "- " + text
        elif kind == "numbered_list_item":
            text = "1. " + text
        elif kind == "to_do":
            text = "- [" + ("x" if data.get("checked") else " ") + "] " + text
        elif kind == "quote":
            text = "> " + text
        elif kind == "code":
            text = "```" + data.get("language", "") + "\n" + text + "\n```"
        elif kind == "divider":
            text = "---"
        elif kind in {"bookmark", "embed", "link_preview"}:
            text = data.get("url", "")
        elif kind == "image":
            text = "[Image retained in source provenance] " + rich(data.get("caption", []))
        elif not text:
            text = "[" + kind + " retained in source provenance]"
        lines.append(text)
        if block.get("exported_children"):
            lines.append(blocks_markdown(block["exported_children"]))
    return "\n\n".join(lines)


def check_files(item):
    for file in item.get("files", []):
        try:
            data = base64.b64decode(file["data"], validate=True)
            if len(data) != file["byte_size"] or hashlib.sha256(data).hexdigest() != file["sha256"]:
                raise CopyError("Attachment checksum mismatch.")
        except (KeyError, ValueError) as exc:
            raise CopyError("Invalid captured attachment.") from exc


def tag_slug(label):
    # Namespace arbitrary source topics/domains to avoid merging distinct labels
    # or colliding with navigation categories. Preserve exact label as name.
    return "topic-" + (slugify(label)[:70] or "tag") + "-" + hashlib.sha256(label.encode()).hexdigest()[:10]


def prepare(bundle):
    data = dict(bundle)
    expected = data.pop("sha256", None)
    if not expected or digest(data) != expected or data.get("version") != 1:
        raise CopyError("Bundle checksum/version mismatch.")
    records = []
    for item in data["ideas"]:
        match = re.match(r"\A---\n(.*?)\n---(?:\n|$)(.*)\Z", item["markdown"], re.S)
        if not match:
            raise CopyError("Idea has invalid frontmatter.")
        # Match the source app's deliberately simple parser, not YAML: pitches
        # contain unquoted colons and are valid in the app's format.
        meta = {}
        for line in match[1].splitlines():
            parsed = re.match(r"^([\w-]+):\s*(.*)$", line)
            if not parsed:
                continue
            key, value = parsed.groups()
            value = value.strip()
            if value.startswith("[") and value.endswith("]"):
                value = [part.strip() for part in value[1:-1].split(",") if part.strip()]
            elif re.fullmatch(r"\d+", value):
                value = int(value)
            meta[key] = value
        rating = meta.get("rating")
        if rating not in [None, 1, 2, 3]:
            raise CopyError("Unknown source rating.")
        fields = {"title": meta["name"], "subtitle": meta.get("tagline", ""), "summary": meta.get("pitch", ""),
                  "body_markdown": match[2], "saved_on": day(meta["created"], instant=True),
                  "original_created_at": meta["created"], "attributes": {"domains": meta.get("domains", [])}}
        topics = meta.get("domains", [])
        records.append({"type": "idea", "fields": fields,
                        "categories": [{None: "inbox", 1: "archive", 2: "to-improve", 3: "promising"}[rating]],
                        "topics": topics, "source": {"system": "github", "namespace": data["github_repository"],
                        "external_id": item["path"], "source_revision": data["github_revision"],
                        "original_rating": rating, "payload": {"markdown": item["markdown"], "frontmatter": json_safe(meta)}}})
    for item in data["notion"]["pages"]:
        check_files(item)
        page = item["page"]
        if page.get("in_trash") or page.get("is_archived") or page.get("archived"):
            raise CopyError("Trashed/archived Notion page must be reviewed separately.")
        category = prop(page, "Category")
        if category not in {"News", "Inbox", "Favorite", "Inspiration"}:
            raise CopyError("Unknown Notion category; do not silently classify.")
        categories = {"News": [], "Inbox": ["inbox"], "Favorite": ["favorite"], "Inspiration": ["inspiration"]}[category]
        if prop(page, "Archived"):
            categories = [c for c in categories if c != "inbox"] + ["archive"]
        fields = {"title": prop(page, "Title"), "external_url": prop(page, "URL") or "",
                  "summary": prop(page, "Why it matters") or "", "body_markdown": blocks_markdown(item["blocks"]),
                  "source_name": prop(page, "Source") or "", "author": prop(page, "Author") or "",
                  "claim_status": prop(page, "Claim status") or "",
                  "saved_on": day(prop(page, "Added")) or day(page["created_time"], instant=True),
                  "published_on": day(prop(page, "Published")), "original_created_at": page["created_time"],
                  "attributes": {"language": prop(page, "Language"), "reading_time": prop(page, "Reading time"),
                                 "wallabag_id": prop(page, "Wallabag ID"), "original_url": prop(page, "Original URL")}}
        records.append({"type": "news" if category == "News" else "bookmark", "fields": fields,
                        "categories": categories, "topics": [x["name"] for x in page["properties"].get("Topics", {}).get("multi_select", [])],
                        "source": {"system": "notion", "namespace": data["notion"]["data_source_id"], "external_id": page["id"],
                        "source_url": page.get("url", ""), "source_revision": page["last_edited_time"],
                        "source_created_at": page["created_time"], "source_updated_at": page["last_edited_time"],
                        "original_category": category, "payload": item}})
    seen = set()
    for record in records:
        source = record["source"]
        key = tuple(source[k] for k in ["system", "namespace", "external_id"])
        if key in seen:
            raise CopyError("Duplicate source identity in bundle.")
        seen.add(key)
        if not isinstance(record["fields"]["title"], str) or not record["fields"]["title"].strip():
            raise CopyError("Missing title: explicit correction required.")
        # Content IDs deterministic across retries and concurrent copy runners.
        record["id"] = uuid.uuid5(uuid.NAMESPACE_URL, json.dumps(key))
        record["source_hash"] = digest(json_safe(record["source"]))
    return records


def report(bundle):
    records = prepare(bundle)
    return {"bundle_sha256": bundle["sha256"], "total": len(records),
            "types": dict(Counter(r["type"] for r in records)),
            "categories": dict(Counter(c for r in records for c in r["categories"])),
            "months": dict(sorted(Counter(r["fields"]["saved_on"].strftime("%Y-%m") for r in records).items())),
            "attachments": sum(len(i.get("files", [])) for i in bundle["notion"]["pages"]),
            "attachment_bytes": sum(f["byte_size"] for i in bundle["notion"]["pages"] for f in i.get("files", [])),
            "inspiration_policy": "previous-Inspiration-category-only"}


@transaction.atomic
def copy_bundle(bundle, owner_id):
    """Insert only. Matching reruns skip; changed sources stop the entire transaction."""
    records = prepare(bundle)
    types = {t.slug: t for t in ObjectType.objects.all()}
    tags = {t.slug: t for t in Tag.objects.all()}
    categories = {c.slug: c for c in Category.objects.all()}
    if not {"idea", "news", "bookmark", "daily-note"} <= types.keys():
        raise CopyError("Initial taxonomy migration is missing.")
    if not {"inbox", "archive", "favorite", "promising", "to-improve", "inspiration"} <= categories.keys():
        raise CopyError("Categories migration is missing.")
    existing_sources = {(s.system, s.namespace, s.external_id): s for s in
                        ContentSource.objects.select_related("content").filter(
                            system__in={r["source"]["system"] for r in records})}
    contents, sources, links, category_links = [], [], [], []
    skipped = 0
    for record in records:
        source = record["source"]
        key = tuple(source[k] for k in ["system", "namespace", "external_id"])
        existing = existing_sources.get(key)
        if existing:
            if str(existing.content.owner_id) != str(owner_id):
                raise CopyError("Existing source belongs to another owner.")
            if existing.payload.get("copy_source_sha256") != record["source_hash"]:
                raise CopyError("Existing source changed; refusing to overwrite Curator edits.")
            skipped += 1
            continue
        content = Content(id=record["id"], owner_id=owner_id,
                          object_type=types[record["type"]], **record["fields"])
        contents.append(content)
        for slug in set(record["categories"]):
            if slug not in categories:
                raise CopyError("Required category is missing.")
            category_links.append(ContentCategory(content=content, category=categories[slug]))
        for label in record["topics"]:
            slug = tag_slug(label)
            if slug not in tags:
                tags[slug], _ = Tag.objects.get_or_create(slug=slug, defaults={"name": label})
            if tags[slug].name != label:
                raise CopyError("Topic tag collision; review required.")
            links.append(ContentTag(content=content, tag=tags[slug]))
        values = dict(source)
        values["payload"] = {"copy_source_sha256": record["source_hash"], "original": source["payload"]}
        sources.append(ContentSource(content=content, **values))
    # Bounded batches avoid per-record network round trips. Unique constraints
    # arbitrate concurrent runners; any conflict rolls back the whole copy.
    Content.objects.bulk_create(contents, batch_size=100)
    ContentTag.objects.bulk_create(links, batch_size=250)
    ContentCategory.objects.bulk_create(category_links, batch_size=250)
    ContentSource.objects.bulk_create(sources, batch_size=50)
    if ContentSource.objects.filter(content_id__in=[r["id"] for r in records],
                                    content__owner_id=owner_id).count() != len(records):
        raise CopyError("Owner/source reconciliation failed.")
    return {"created": len(contents), "skipped": skipped, "total": len(records)}
