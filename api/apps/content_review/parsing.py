"""Parse atomic-lessons unit files from in-memory text.

Mirrors atomic-lessons/check_uuids.py load_metadata: the api image ships only
api/, so the content checkers are not importable here; keep the two in sync.
.md files carry YAML front matter between --- lines followed by the body;
question files are plain YAML mappings. Duplicate metadata keys are rejected,
like the checker's UniqueKeyLoader.
"""

import yaml


class UniqueKeyLoader(yaml.SafeLoader):
    """Reject duplicate keys so a later id cannot silently replace an earlier id."""


def _unique_mapping(loader, node, deep=False):
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if not isinstance(key, str):
            raise yaml.constructor.ConstructorError(
                None, None, "metadata keys must be strings", key_node.start_mark
            )
        if key in result:
            raise yaml.constructor.ConstructorError(
                None, None, f"duplicate YAML key: {key}", key_node.start_mark
            )
        result[key] = loader.construct_object(value_node, deep=deep)
    return result


UniqueKeyLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, _unique_mapping)


def parse_metadata(path, text):
    """Return the metadata mapping of one content file."""
    if path.endswith(".md"):
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


def parse_unit(path, text):
    """Return (metadata, body): body is the markdown below the front matter."""
    if path.endswith(".md"):
        lines = text.splitlines()
        end = lines.index("---", 1) if lines and lines[0] == "---" else None
        if end is None:
            raise ValueError("missing YAML front matter at the start of the file")
        return parse_metadata(path, text), "\n".join(lines[end + 1 :]).strip()
    return parse_metadata(path, text), ""
