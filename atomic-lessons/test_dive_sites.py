import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).parent / "themes" / "ocean" / "legendary-dive-sites"


def front(path):
    return yaml.safe_load(path.read_text().split("---\n", 2)[1])


class DiveSitesTests(unittest.TestCase):
    def test_structure(self):
        lessons = sorted(p for p in ROOT.iterdir() if p.is_dir())
        self.assertEqual(len(lessons), 10)
        self.assertEqual(sorted(front(p / "index.md")["position"] for p in lessons), list(range(1, 11)))
        for lesson in lessons:
            cards = sorted((lesson / "cards").glob("*.md"))
            questions = sorted((lesson / "questions").glob("*.yaml"))
            self.assertEqual(len(cards), 8, lesson.name)
            self.assertEqual(len(questions), 16, lesson.name)
            data = [yaml.safe_load(q.read_text()) for q in questions]
            typed = [q for q in data if q["type"] == "type_answer_question"]
            self.assertEqual(len(typed), 4, lesson.name)
            for pool in (2, 4, 6, 8):
                self.assertEqual(len([q for q in data if q["after_card_position"] == pool]), 4, lesson.name)
            for q in data:
                if q["type"] == "multiple_choice":
                    ids = [c["id"] for c in q["choices"]]
                    self.assertEqual(len(ids), 4)
                    self.assertEqual(len(q["correct_choice_ids"]), 1)
                    self.assertIn(q["correct_choice_ids"][0], ids)
                else:
                    self.assertTrue(q["accepted_answers"])

    def test_card_length(self):
        for card in ROOT.glob("*/cards/*.md"):
            if "key-learnings" in card.name or "3-key" in card.name:
                continue
            body = card.read_text().split("---\n", 2)[2]
            self.assertGreaterEqual(len(body.split()), 100, card)


if __name__ == "__main__":
    unittest.main()
