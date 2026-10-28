"""Deterministic comparison for authored typed answers."""

import re
import unicodedata


def normalize_typed_answer(value):
    text = unicodedata.normalize("NFKC", value).casefold()
    text = text.replace("’", "'").replace("‘", "'").replace("ʼ", "'")
    text = text.replace("'", "")
    text = re.sub(r"[\W_]+", " ", text, flags=re.UNICODE)
    return " ".join(text.split())
