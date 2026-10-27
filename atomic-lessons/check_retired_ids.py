"""Check that no content ID declared on a base revision disappeared.

Thomas's rule: a pull request must not destroy existing IDs; retiring content
goes through `archived: true` on the existing file. Moving or renaming a file
is fine while its ID survives. This gate compares the element IDs declared on
a base git revision (the pull request's merge-base, or the previous push)
against the working tree and rejects disappearances and kind changes. It never
edits anything: retirement is always an explicit, human-authored archive flag.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import subprocess
import sys

import yaml

from check_uuids import UniqueKeyLoader, child_directories


def kind_for(relative: Path) -> str | None:
    """Map a repository-relative content file to its element kind."""
    parts = relative.parts
    if len(parts) < 3 or parts[0] != "themes" or "assets" in parts:
        return None
    if relative.suffix == ".md" and relative.name == "index.md":
        return {3: "theme", 4: "learning path", 5: "lesson"}.get(len(parts))
    if len(parts) == 6 and parts[4] == "cards" and relative.suffix == ".md":
        return "card"
    if len(parts) == 6 and parts[4] == "questions" and relative.suffix in (".yaml", ".yml"):
        return "question"
    return None


def parse_metadata(text: str, suffix: str) -> dict:
    if suffix == ".md":
        lines = text.splitlines()
        if not lines or lines[0] != "---":
            return {}
        try:
            end = lines.index("---", 1)
        except ValueError:
            return {}
        text = "\n".join(lines[1:end])
    data = yaml.load(text, Loader=UniqueKeyLoader)
    return data if isinstance(data, dict) else {}


def base_manifest(root: Path, repo_root: Path, base: str) -> tuple[dict[str, tuple[str, str]], list[str]]:
    """Element IDs declared on the base revision: id -> (kind, base path)."""
    relative_root = root.relative_to(repo_root).as_posix()
    listing = subprocess.run(
        ["git", "ls-tree", "-r", "--name-only", base, "--", relative_root],
        cwd=repo_root,
        capture_output=True,
        text=True,
    )
    if listing.returncode != 0:
        return {}, [f"cannot read the base revision {base!r}: {listing.stderr.strip()}"]
    manifest: dict[str, tuple[str, str]] = {}
    errors: list[str] = []
    for line in listing.stdout.splitlines():
        path_in_repo = Path(line)
        try:
            rel_to_root = path_in_repo.relative_to(relative_root)
        except ValueError:
            continue
        kind = kind_for(rel_to_root)
        if kind is None:
            continue
        blob = subprocess.run(
            ["git", "show", f"{base}:{line}"], cwd=repo_root, capture_output=True, text=True
        )
        if blob.returncode != 0:
            errors.append(f"{line}: cannot read file on {base}: {blob.stderr.strip()}")
            continue
        try:
            metadata = parse_metadata(blob.stdout, path_in_repo.suffix)
        except yaml.YAMLError as error:
            errors.append(f"{line}: cannot parse metadata on {base}: {error}")
            continue
        element_id = metadata.get("id")
        if isinstance(element_id, str) and element_id.strip():
            manifest[element_id] = (kind, path_in_repo.relative_to(relative_root).as_posix())
    return manifest, errors


def candidate_manifest(root: Path) -> dict[str, tuple[str, str]]:
    """Element IDs declared in the working tree: id -> (kind, path)."""
    manifest: dict[str, tuple[str, str]] = {}
    for theme in child_directories(root / "themes"):
        for file, kind in _expected_files(theme):
            if not file.is_file():
                continue
            try:
                metadata = parse_metadata(file.read_text(encoding="utf-8"), file.suffix)
            except (OSError, yaml.YAMLError):
                continue  # malformed files are the UUID/image checkers' job
            element_id = metadata.get("id")
            if isinstance(element_id, str) and element_id.strip():
                manifest[element_id] = (kind, file.relative_to(root).as_posix())
    return manifest


def _expected_files(theme: Path):
    yield theme / "index.md", "theme"
    for learning_path in child_directories(theme):
        yield learning_path / "index.md", "learning path"
        for lesson in child_directories(learning_path):
            yield lesson / "index.md", "lesson"
            for card in sorted((lesson / "cards").glob("*.md")):
                yield card, "card"
            for pattern in ("*.yaml", "*.yml"):
                for question in sorted((lesson / "questions").glob(pattern)):
                    yield question, "question"


def check_retirement(root: Path, repo_root: Path, base: str) -> tuple[list[str], int]:
    base_ids, errors = base_manifest(root, repo_root, base)
    if errors:
        return errors, 0
    candidate = candidate_manifest(root)
    for element_id, (kind, location) in sorted(base_ids.items()):
        current = candidate.get(element_id)
        if current is None:
            errors.append(
                f"{location}: {kind} {element_id} exists on {base} but is gone from this branch. "
                "Never destroy a content ID: keep the file and set archived: true to retire it."
            )
        elif current[0] != kind:
            errors.append(
                f"{location}: {element_id} was a {kind} on {base} but is now a {current[0]} "
                f"at {current[1]}. A content ID cannot change kind; retire it with archived: true "
                "and author a fresh ID."
            )
    return errors, len(base_ids)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument(
        "--base",
        required=True,
        help="Base git revision holding the IDs to protect (merge-base for PRs, previous commit for pushes).",
    )
    arguments = parser.parse_args()
    root = arguments.root.resolve()
    errors, count = check_retirement(root, root.parent, arguments.base)
    if errors:
        print("Atomic lessons content-retirement check failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print(f"Atomic lessons: all {count} content IDs from {arguments.base} are still declared.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
