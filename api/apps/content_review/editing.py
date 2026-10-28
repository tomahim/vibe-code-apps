"""Source-preserving edits of atomic-lessons unit files.

An edit replaces only the scalar values (or the markdown body) it was asked to
change and leaves every other byte of the file alone, so a quick edit yields a
small diff and never reorders, reformats or drops metadata. The result is
re-parsed and checked against the original before anything is committed: ids,
positions, flags and every untouched field must come out identical.
"""

import json

import yaml

from .parsing import UniqueKeyLoader, parse_metadata, parse_unit
from .review import classify

# Editable fields per unit kind. Ids, positions, images and the archive flag
# are never editable here: ids are the stable identity the importer keys on.
EDITABLE = {
    "card": {"title", "body"},
    "lesson": {"title", "description", "body"},
    "learning_path": {"title", "description", "body"},
    "question": {"prompt", "choices", "correct_choice_id", "explanation"},
}
LIMITS = {"title": 200, "description": 1000, "prompt": 2000, "explanation": 4000, "body": 20000, "choice": 500}


class EditError(Exception):
    """The requested edit is invalid; the message is safe to show the reviewer."""


def scalar(value):
    """YAML text for a string value: plain or quoted on one line, else JSON-quoted."""
    if "\n" not in value:
        dumped = yaml.safe_dump(value, width=10**9, allow_unicode=True).rstrip("\n")
        if dumped.endswith("\n..."):
            dumped = dumped[: -len("\n...")]
        if "\n" not in dumped and yaml.safe_load(dumped) == value:
            return dumped
    return json.dumps(value, ensure_ascii=False)


def _mapping_value(node, key):
    for key_node, value_node in node.value:
        if key_node.value == key:
            return value_node
    return None


def _replace(text, node, value):
    """Replacement (start, end, new text) for one scalar node."""
    start, end = node.start_mark.index, node.end_mark.index
    new = scalar(value)
    if node.style in ("|", ">") or text[start:end].endswith("\n"):
        # Block scalars own their trailing newline; keep the line structure.
        new += "\n"
    return start, end, new


def _apply(text, replacements):
    for start, end, new in sorted(replacements, reverse=True):
        text = text[:start] + new + text[end:]
    return text


def _split_front_matter(text):
    """(front matter text, rest starting at the closing --- line)."""
    if not text.startswith("---\n"):
        raise EditError("The file has no YAML front matter.")
    close = text.find("\n---", 3)
    if close == -1:
        raise EditError("The file's YAML front matter is not closed.")
    return text[4 : close + 1], text[close + 1 :]


def _edit_front_matter(front, updates):
    """Set top-level string keys inside front matter, appending absent keys."""
    root = yaml.compose(front, Loader=UniqueKeyLoader)
    replacements = []
    appended = ""
    for key, value in updates.items():
        node = _mapping_value(root, key)
        if node is None:
            appended += f"{key}: {scalar(value)}\n"
        elif not isinstance(node, yaml.ScalarNode):
            raise EditError(f"{key} is not a text value in this file.")
        else:
            replacements.append(_replace(front, node, value))
    return _apply(front, replacements) + appended


def _edit_markdown(text, updates):
    front, rest = _split_front_matter(text)
    meta = {k: v for k, v in updates.items() if k != "body"}
    if meta:
        front = _edit_front_matter(front, meta)
    if "body" in updates:
        closing, _, _old_body = rest.partition("\n")
        rest = closing + "\n" + updates["body"].strip() + ("\n" if text.endswith("\n") else "")
    return "---\n" + front + rest


def _edit_question(text, updates):
    root = yaml.compose(text, Loader=UniqueKeyLoader)
    if not isinstance(root, yaml.MappingNode):
        raise EditError("The question file is not a YAML mapping.")
    replacements = []
    for key in ("prompt", "explanation"):
        if key in updates:
            node = _mapping_value(root, key)
            if not isinstance(node, yaml.ScalarNode):
                raise EditError(f"The question has no {key} to edit.")
            replacements.append(_replace(text, node, updates[key]))
    choices_node = _mapping_value(root, "choices")
    if "choices" in updates:
        if not isinstance(choices_node, yaml.SequenceNode) or len(choices_node.value) != len(updates["choices"]):
            raise EditError("The number of answer choices cannot change.")
        for item, edit in zip(choices_node.value, updates["choices"]):
            id_node = _mapping_value(item, "id")
            text_node = _mapping_value(item, "text")
            if id_node is None or id_node.value != edit["id"] or not isinstance(text_node, yaml.ScalarNode):
                raise EditError("Answer choices must keep their ids and order.")
            replacements.append(_replace(text, text_node, edit["text"]))
    if "correct_choice_id" in updates:
        correct = _mapping_value(root, "correct_choice_ids")
        if not isinstance(correct, yaml.SequenceNode) or len(correct.value) != 1:
            raise EditError("Only questions with a single correct answer can change it here.")
        replacements.append(_replace(text, correct.value[0], updates["correct_choice_id"]))
    return _apply(text, replacements)


def clean_changes(kind, changes):
    """Validate the request payload and return normalized updates."""
    if kind not in EDITABLE:
        raise EditError("This kind of file cannot be edited here.")
    if not isinstance(changes, dict) or not changes:
        raise EditError("No changes were given.")
    unknown = set(changes) - EDITABLE[kind]
    if unknown:
        raise EditError(f"Not editable for a {kind}: {', '.join(sorted(unknown))}.")
    updates = {}
    for key, value in changes.items():
        if key == "choices":
            if not isinstance(value, list) or not all(
                isinstance(c, dict) and isinstance(c.get("id"), str) and isinstance(c.get("text"), str) for c in value
            ):
                raise EditError("choices must be a list of {id, text}.")
            updates[key] = [{"id": c["id"], "text": c["text"].strip()} for c in value]
            if any(not c["text"] or len(c["text"]) > LIMITS["choice"] for c in updates[key]):
                raise EditError(f"Each choice needs text of at most {LIMITS['choice']} characters.")
            continue
        if not isinstance(value, str):
            raise EditError(f"{key} must be text.")
        value = value.replace("\r\n", "\n").strip() if key in ("body", "description", "prompt", "explanation") else value.strip()
        limit = LIMITS.get(key, 200)
        if len(value) > limit:
            raise EditError(f"{key} must be at most {limit} characters.")
        if key in ("title", "prompt", "correct_choice_id") and not value:
            raise EditError(f"{key} cannot be empty.")
        if key == "title" and "\n" in value:
            raise EditError("title must be a single line.")
        updates[key] = value
    return updates


def apply_edit(path, text, changes):
    """Return the edited file text, or raise EditError. `text` is the file at the
    reviewed head; nothing here touches GitHub."""
    kind, _groups = classify(path)
    updates = clean_changes(kind, changes)
    if "\r" in text:
        raise EditError("This file uses Windows line endings; edit it on GitHub.")
    try:
        before_meta, before_body = parse_unit(path, text)
    except (ValueError, yaml.YAMLError) as exc:
        raise EditError(f"The file does not parse today: {exc}") from exc
    if kind == "question":
        new_text = _edit_question(text, updates)
    else:
        new_text = _edit_markdown(text, updates)
    if new_text == text:
        raise EditError("Nothing changed.")
    verify(kind, updates, before_meta, before_body, path, new_text)
    return new_text


def verify(kind, updates, before_meta, before_body, path, new_text):
    """Re-parse the result and prove only the requested fields moved."""
    try:
        meta, body = parse_unit(path, new_text)
    except (ValueError, yaml.YAMLError) as exc:
        raise EditError(f"The edit would break the file: {exc}") from exc
    expected = json.loads(json.dumps(before_meta))
    expected_body = before_body
    if kind == "question":
        for key in ("prompt", "explanation"):
            if key in updates:
                expected[key] = updates[key]
        if "choices" in updates:
            for choice, edit in zip(expected["choices"], updates["choices"]):
                choice["text"] = edit["text"]
        if "correct_choice_id" in updates:
            expected["correct_choice_ids"] = [updates["correct_choice_id"]]
        choices = meta.get("choices")
        ids = [c.get("id") for c in choices] if isinstance(choices, list) else []
        if len(ids) != 4 or len(set(ids)) != 4:
            raise EditError("A question needs exactly four distinct answer choices.")
        texts = [str(c.get("text", "")).strip().lower() for c in choices]
        if len(set(texts)) != len(texts):
            raise EditError("Answer choices must be different from each other.")
        correct = meta.get("correct_choice_ids")
        if not isinstance(correct, list) or len(correct) != 1 or correct[0] not in ids:
            raise EditError("The correct answer must be one of the four choices.")
    else:
        for key in ("title", "description"):
            if key in updates:
                expected[key] = updates[key]
        if "body" in updates:
            expected_body = updates["body"]
    if meta != expected or body != expected_body:
        raise EditError("The edit changed more than requested; refusing to save it.")
    if before_meta.get("id") != meta.get("id"):
        raise EditError("Ids cannot change.")
