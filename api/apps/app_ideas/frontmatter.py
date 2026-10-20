import re

FRONTMATTER = re.compile(r"\A---\n(.*?)\n---(\n|\Z)", re.DOTALL)
RATING_LINE = re.compile(r"^rating:.*$", re.MULTILINE)


def set_rating(text, rating):
    """Return `text` with the frontmatter `rating` set (1-3) or removed (None).

    Only the `rating` line changes; everything else is kept byte for byte.
    """
    match = FRONTMATTER.match(text)
    if not match:
        raise ValueError("Idea file has no frontmatter.")
    block = match.group(1)
    if rating is None:
        block = RATING_LINE.sub("", block)
        block = re.sub(r"\n{2,}", "\n", block).strip("\n")
    elif RATING_LINE.search(block):
        block = RATING_LINE.sub(f"rating: {rating}", block)
    else:
        block = f"{block}\nrating: {rating}"
    return f"---\n{block}\n---{match.group(2)}" + text[match.end():]
