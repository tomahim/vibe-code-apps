"""Read-only, complete source capture. Private bundles must never be committed."""
import base64
import hashlib
import json
import time
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, build_opener, HTTPRedirectHandler


class ExportError(ValueError):
    pass


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


class NotionReader:
    def __init__(self, token, *, sleep=time.sleep):
        self.token = token.strip()
        self.sleep = sleep
        self.opener = build_opener(NoRedirect)

    def request(self, path, body=None):
        # Only this fixed origin receives authorization; never attachment hosts.
        self.sleep(0.35)
        request = Request("https://api.notion.com/v1/" + path,
                          data=json.dumps(body).encode() if body is not None else None,
                          headers={"Authorization": "Bearer " + self.token,
                                   "Notion-Version": "2026-03-11", "Content-Type": "application/json"})
        try:
            with self.opener.open(request, timeout=30) as response:
                return json.load(response)
        except Exception as exc:
            raise ExportError("Notion read failed; source capture incomplete. Retry the export.") from exc

    def blocks(self, block_id):
        items, cursor = [], None
        while True:
            path = f"blocks/{block_id}/children?page_size=100"
            if cursor:
                from urllib.parse import quote
                path += "&start_cursor=" + quote(cursor)
            result = self.request(path)
            for block in result["results"]:
                if block.get("has_children"):
                    block["exported_children"] = self.blocks(block["id"])
                items.append(block)
            if not result.get("has_more"):
                return items
            cursor = result.get("next_cursor")
            if not cursor:
                raise ExportError("Notion block pagination omitted its cursor.")

    def complete_properties(self, page):
        # Title/rich-text/relation values can be truncated to 25 in page responses.
        from urllib.parse import quote, unquote
        for name, prop in list(page["properties"].items()):
            if prop["type"] not in {"title", "rich_text", "relation", "people"}:
                continue
            if len(prop.get(prop["type"], [])) < 25:
                continue
            items, cursor = [], None
            while True:
                path = f"pages/{page['id']}/properties/{quote(unquote(prop['id']), safe='')}?page_size=100"
                if cursor:
                    path += "&start_cursor=" + quote(cursor)
                result = self.request(path)
                if result.get("object") != "list":
                    raise ExportError("Unexpected Notion property pagination response.")
                items.extend(item[prop["type"]] for item in result["results"])
                if not result.get("has_more"):
                    break
                cursor = result.get("next_cursor")
                if not cursor:
                    raise ExportError("Notion property pagination omitted its cursor.")
            page["properties"][name][prop["type"]] = items

    def attachment(self, url, max_bytes=20 * 1024 * 1024):
        parsed = urlsplit(url)
        host = (parsed.hostname or "").lower()
        if (parsed.scheme != "https" or parsed.username or parsed.password or
                not any(host == suffix or host.endswith("." + suffix)
                        for suffix in ["amazonaws.com", "notion-static.com", "notion.so"])):
            raise ExportError("Unexpected hosted attachment origin; review before downloading.")
        try:
            with self.opener.open(Request(url), timeout=60) as response:
                data = response.read(max_bytes + 1)
        except Exception as exc:
            raise ExportError("Attachment download failed; bundle is incomplete.") from exc
        if len(data) > max_bytes:
            raise ExportError("Attachment exceeds the 20 MiB limit; review before exporting.")
        return {"encoding": "base64", "data": base64.b64encode(data).decode(),
                "byte_size": len(data), "sha256": hashlib.sha256(data).hexdigest()}

    def capture_files(self, value, files, path="page"):
        if isinstance(value, dict):
            # Notion-hosted files in properties, cover/icon and block content.
            if value.get("type") == "file" and isinstance(value.get("file"), dict) and value["file"].get("url"):
                record = self.attachment(value["file"]["url"])
                record.update({"path": path, "name": value.get("name", "")})
                files.append(record)
                if sum(item["byte_size"] for item in files) > 200 * 1024 * 1024:
                    raise ExportError("Page attachment total exceeds 200 MiB.")
            for key, item in value.items():
                self.capture_files(item, files, path + "/" + key)
        elif isinstance(value, list):
            for index, item in enumerate(value):
                self.capture_files(item, files, path + "/" + str(index))

    def export(self, data_source_id):
        schema = self.request("data_sources/" + data_source_id)
        pages, cursor, seen = [], None, set()
        while True:
            body = {"page_size": 100}
            if cursor:
                body["start_cursor"] = cursor
            result = self.request("data_sources/" + data_source_id + "/query", body)
            for page in result["results"]:
                if page["id"] in seen:
                    raise ExportError("Duplicate page during pagination; retry a stable snapshot.")
                seen.add(page["id"])
                self.complete_properties(page)
                blocks = self.blocks(page["id"])
                files = []
                self.capture_files(page, files)
                self.capture_files(blocks, files, "blocks")
                pages.append({"page": page, "blocks": blocks, "files": files})
            if not result.get("has_more"):
                break
            cursor = result.get("next_cursor")
            if not cursor:
                raise ExportError("Notion query omitted its pagination cursor.")
        # Fail if a row changed while its content was being captured.
        for item in pages:
            current = self.request("pages/" + item["page"]["id"])
            if current.get("last_edited_time") != item["page"].get("last_edited_time"):
                raise ExportError("A Notion row changed during export; retry rather than mix revisions.")
        return {"data_source_id": data_source_id, "schema": schema, "pages": pages}


def export_ideas(root):
    root = Path(root)
    records = []
    # Ideas moved to Little notes: when the bundled directory is gone from the
    # repo, export zero ideas instead of failing the whole source capture.
    if not root.is_dir():
        return records
    for path in sorted(root.glob("*.md")):
        records.append({"path": "ui/src/apps/app-ideas/ideas/" + path.name,
                        "markdown": path.read_text(encoding="utf-8")})
    if not records:
        raise ExportError("No idea markdown files found.")
    return records
