from django.test import SimpleTestCase

from .review import build_review

BASE = "atomic-lessons/themes/t/p"


def change(path):
    return {"path": path, "status": "added", "previous_path": None, "patch": ""}


def front(**fields):
    lines = "\n".join(f"{k}: {v}" for k, v in fields.items())
    return f"---\n{lines}\n---\nbody\n"


class ReviewOrderingTests(SimpleTestCase):
    def test_lessons_follow_position_with_cards_and_questions_beneath(self):
        texts = {
            "atomic-lessons/themes/t/index.md": front(id="t", title="T", position=1),
            f"{BASE}/index.md": front(id="p", title="P", position=1),
            f"{BASE}/aaa/index.md": front(id="l2", title="Second", position=2),
            f"{BASE}/zzz/index.md": front(id="l1", title="First", position=1),
            f"{BASE}/aaa/cards/01.md": front(id="c2", position=1),
            f"{BASE}/zzz/cards/01.md": front(id="c1", position=1),
            f"{BASE}/zzz/cards/02.md": front(id="c1b", position=2),
            f"{BASE}/zzz/questions/q.yml": (
                "id: q1\nprompt: Q\nafter_card_position: 1\nposition: 1\n"
                "choices: []\ncorrect_choice_ids: []\n"
            ),
        }
        files = [change(path) for path in [
            f"{BASE}/aaa/cards/01.md",
            f"{BASE}/zzz/questions/q.yml",
            f"{BASE}/zzz/cards/02.md",
            f"{BASE}/zzz/cards/01.md",
            f"{BASE}/zzz/index.md",
            f"{BASE}/aaa/index.md",
        ]]
        order = [u["path"] for u in build_review(texts, files)["units"]]
        self.assertEqual(order, [
            f"{BASE}/zzz/index.md",
            f"{BASE}/zzz/cards/01.md",
            f"{BASE}/zzz/questions/q.yml",
            f"{BASE}/zzz/cards/02.md",
            f"{BASE}/aaa/index.md",
            f"{BASE}/aaa/cards/01.md",
        ])
