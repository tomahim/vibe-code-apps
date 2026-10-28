"""Build the review model for one pull request: every changed atomic-lessons
unit (theme, learning path, lesson, card, question) with its parsed content,
plus any other changed library files the reviewer should still see.
"""

import re

import yaml

from .parsing import parse_unit

CONTENT_ROOT = "atomic-lessons"

# Order matters: cards/questions are matched before their lesson's index.md.
KIND_PATTERNS = [
    ("card", re.compile(r"^atomic-lessons/themes/(?P<theme>[^/]+)/(?P<path>[^/]+)/(?P<lesson>[^/]+)/cards/[^/]+\.md$")),
    ("question", re.compile(r"^atomic-lessons/themes/(?P<theme>[^/]+)/(?P<path>[^/]+)/(?P<lesson>[^/]+)/questions/[^/]+\.ya?ml$")),
    ("lesson", re.compile(r"^atomic-lessons/themes/(?P<theme>[^/]+)/(?P<path>[^/]+)/(?P<lesson>[^/]+)/index\.md$")),
    ("learning_path", re.compile(r"^atomic-lessons/themes/(?P<theme>[^/]+)/(?P<path>[^/]+)/index\.md$")),
    ("theme", re.compile(r"^atomic-lessons/themes/(?P<theme>[^/]+)/index\.md$")),
]
KIND_ORDER = {kind: rank for rank, kind in enumerate(["theme", "learning_path", "lesson", "card", "question"])}


def classify(path):
    for kind, pattern in KIND_PATTERNS:
        match = pattern.match(path)
        if match:
            return kind, match.groupdict()
    return None, {}


def title_of(texts, path):
    """Title declared by an index.md in the tree, or None when unavailable."""
    text = texts.get(path)
    if text is None:
        return None
    try:
        metadata, _ = parse_unit(path, text)
    except (ValueError, yaml.YAMLError):
        return None
    title = metadata.get("title")
    return str(title) if title else None


def question_fields(metadata):
    options = metadata.get("choices") if isinstance(metadata.get("choices"), list) else []
    return {
        "prompt": str(metadata.get("prompt") or ""),
        "after_card_position": metadata.get("after_card_position"),
        "options": [
            {"id": str(choice.get("id", "")), "text": str(choice.get("text", ""))}
            for choice in options
            if isinstance(choice, dict)
        ],
        "answer": str((metadata.get("correct_choice_ids") or [None])[0] or ""),
        "explanation": str(metadata.get("explanation") or ""),
    }


def needed_paths(files):
    """Files whose text the review reads: each changed unit plus the index.md
    of every ancestor, which supply the breadcrumb titles."""
    paths = set()
    for change in files:
        kind, groups = classify(change["path"])
        if kind is None:
            continue
        if change["status"] != "removed":
            paths.add(change["path"])
        base = f"{CONTENT_ROOT}/themes/{groups['theme']}"
        paths.add(f"{base}/index.md")
        if groups.get("path"):
            paths.add(f"{base}/{groups['path']}/index.md")
            if groups.get("lesson"):
                paths.add(f"{base}/{groups['path']}/{groups['lesson']}/index.md")
    return paths


def build_unit(change, texts):
    path = change["path"]
    kind, groups = classify(path)
    unit = {
        "key": path,
        "kind": kind,
        "change": change["status"],
        "path": path,
        "previous_path": change["previous_path"],
        "patch": change["patch"],
        "id": None,
        "title": None,
        "description": "",
        "position": None,
        "archived": False,
        "body": "",
        "question": None,
        "parse_error": None,
        "breadcrumbs": [],
        "slugs": groups,
    }
    text = texts.get(path)
    if change["status"] != "removed" and text is not None:
        try:
            metadata, body = parse_unit(path, text)
            unit["id"] = str(metadata.get("id") or "") or None
            unit["title"] = str(metadata.get("title") or "") or None
            unit["description"] = str(metadata.get("description") or "")
            unit["position"] = metadata.get("position")
            unit["archived"] = bool(metadata.get("archived", False))
            if kind == "question":
                unit["question"] = question_fields(metadata)
                unit["title"] = unit["title"] or unit["question"]["prompt"][:80] or None
            else:
                unit["body"] = body
        except (ValueError, yaml.YAMLError) as exc:
            unit["parse_error"] = f"{path}: {exc}"
    theme_title = title_of(texts, f"{CONTENT_ROOT}/themes/{groups['theme']}/index.md")
    breadcrumbs = [theme_title or groups["theme"]]
    if groups.get("path"):
        path_title = title_of(texts, f"{CONTENT_ROOT}/themes/{groups['theme']}/{groups['path']}/index.md")
        breadcrumbs.append(path_title or groups["path"])
    if groups.get("lesson") and kind != "lesson":
        lesson_title = title_of(
            texts, f"{CONTENT_ROOT}/themes/{groups['theme']}/{groups['path']}/{groups['lesson']}/index.md"
        )
        breadcrumbs.append(lesson_title or groups["lesson"])
    unit["breadcrumbs"] = breadcrumbs
    return unit


def build_review(texts, files):
    """Split changed files into reviewable content units and other changes."""
    units = []
    other = []
    for change in files:
        path = change["path"]
        if not path.startswith(f"{CONTENT_ROOT}/"):
            continue
        kind, _groups = classify(path)
        if kind is None:
            # Images, library.yaml, checkers: not units, but the reviewer
            # still needs to see that they changed.
            other.append({"path": path, "change": change["status"], "patch": change["patch"]})
            continue
        units.append(build_unit(change, texts))
    units.sort(
        key=lambda u: (
            u["slugs"].get("theme", ""),
            u["slugs"].get("path") or "",
            u["slugs"].get("lesson") or "",
            KIND_ORDER[u["kind"]],
            u["position"] if isinstance(u["position"], int) else 0,
            u["path"],
        )
    )
    for unit in units:
        unit.pop("slugs", None)
    return {
        "units": units,
        "other_changes": other,
        "summary": {
            "added": sum(1 for u in units if u["change"] == "added"),
            "modified": sum(1 for u in units if u["change"] == "modified"),
            "removed": sum(1 for u in units if u["change"] == "removed"),
        },
    }
