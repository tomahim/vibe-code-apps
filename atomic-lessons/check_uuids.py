"""Check identity declarations across the complete atomic-lessons library."""

from __future__ import annotations

import argparse
from pathlib import Path
import re
import sys
from typing import Any

import yaml


UUID4 = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")


class UniqueKeyLoader(yaml.SafeLoader):
    """Reject duplicate keys so a later id cannot silently replace an earlier id."""


def unique_mapping(loader: UniqueKeyLoader, node: yaml.MappingNode, deep: bool = False) -> dict:
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if not isinstance(key, str):
            raise yaml.constructor.ConstructorError(None, None, "metadata keys must be strings", key_node.start_mark)
        if key in result:
            raise yaml.constructor.ConstructorError(None, None, f"duplicate YAML key: {key}", key_node.start_mark)
        result[key] = loader.construct_object(value_node, deep=deep)
    return result


UniqueKeyLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping)


def load_metadata(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if path.suffix == ".md":
        lines = text.splitlines()
        if not lines or lines[0] != "---":
            raise ValueError("missing YAML front matter at the start of the file")
        try:
            end = lines.index("---", 1)
        except ValueError as error:
            raise ValueError("unclosed YAML front matter") from error
        text = "\n".join(lines[1:end])
    data = yaml.load(text, Loader=UniqueKeyLoader)
    if not isinstance(data, dict):
        raise ValueError("metadata must be a mapping")
    return data


def child_directories(path: Path) -> list[Path]:
    if not path.is_dir():
        return []
    return sorted(p for p in path.iterdir() if p.is_dir() and p.name != "assets")


def check_library(root: Path) -> tuple[list[str], int]:
    errors: list[str] = []
    declarations: dict[str, str] = {}
    expected: dict[Path, str] = {}
    themes = root / "themes"
    if not child_directories(themes):
        return ["themes/: no theme folders found"], 0

    for theme in child_directories(themes):
        expected[theme / "index.md"] = "theme"
        for learning_path in child_directories(theme):
            expected[learning_path / "index.md"] = "learning path"
            for lesson in child_directories(learning_path):
                expected[lesson / "index.md"] = "lesson"
                for card in sorted((lesson / "cards").glob("*.md")):
                    expected[card] = "card"
                for pattern in ("*.yaml", "*.yml"):
                    for question in sorted((lesson / "questions").glob(pattern)):
                        expected[question] = "question"

    def validate_id(value: Any, location: str, declaration: bool = True) -> None:
        if not isinstance(value, str) or not UUID4.fullmatch(value):
            errors.append(f"{location}: expected a canonical lowercase UUIDv4, got {value!r}")
            return
        if declaration:
            if value in declarations:
                errors.append(f"{location}: duplicate UUID {value}; first declared at {declarations[value]}")
            else:
                declarations[value] = location

    def walk(value: Any, location: str) -> None:
        if isinstance(value, dict):
            for key, child in value.items():
                child_location = f"{location}.{key}"
                if key == "id":
                    validate_id(child, child_location)
                else:
                    walk(child, child_location)
        elif isinstance(value, list):
            for index, child in enumerate(value):
                walk(child, f"{location}[{index}]")

    for file, kind in sorted(expected.items()):
        relative = file.relative_to(root).as_posix()
        if not file.is_file():
            errors.append(f"{relative}: missing {kind} index.md with an id")
            continue
        try:
            data = load_metadata(file)
        except (ValueError, OSError, yaml.YAMLError) as error:
            errors.append(f"{relative}: {error}")
            continue
        if "id" not in data:
            errors.append(f"{relative}: {kind} is missing id")
        walk(data, relative)
        if kind == "question":
            choices = data.get("choices")
            if not isinstance(choices, list) or len(choices) != 4:
                errors.append(f"{relative}.choices: expected exactly four answer choices")
                continue
            choice_ids = set()
            for index, choice in enumerate(choices):
                if not isinstance(choice, dict) or "id" not in choice:
                    errors.append(f"{relative}.choices[{index}]: answer choice is missing id")
                elif isinstance(choice["id"], str):
                    choice_ids.add(choice["id"])
            references = data.get("correct_choice_ids")
            if not isinstance(references, list) or not references:
                errors.append(f"{relative}.correct_choice_ids: expected a nonempty choice-ID list")
                continue
            for index, reference in enumerate(references):
                location = f"{relative}.correct_choice_ids[{index}]"
                validate_id(reference, location, declaration=False)
                if not isinstance(reference, str) or reference not in choice_ids:
                    errors.append(f"{location}: reference must resolve to a choice in the same question")

    # Do not silently skip a card/question misplaced outside the prescribed layout.
    for file in sorted(themes.rglob("*")):
        if file.is_file() and file.suffix in (".md", ".yaml", ".yml") and "assets" not in file.relative_to(themes).parts:
            if file not in expected:
                errors.append(f"{file.relative_to(root).as_posix()}: unexpected content location; cannot determine element kind")
    return errors, len(declarations)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent)
    arguments = parser.parse_args()
    errors, count = check_library(arguments.root.resolve())
    if errors:
        print("Atomic lessons UUID check failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print(f"Atomic lessons: {count} unique UUIDv4 declarations; all content elements and choices have IDs.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
