import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).parent / "themes" / "sport" / "cycling-legends"


def front(path):
    return yaml.safe_load(path.read_text().split("---\n", 2)[1])


class CyclingLegendsTests(unittest.TestCase):
    def test_structure(self):
        lessons = sorted(p for p in ROOT.iterdir() if p.is_dir())
        self.assertEqual(len(lessons), 20)
        self.assertEqual(sorted(front(p / "index.md")["position"] for p in lessons), list(range(1, 21)))
        for lesson in lessons:
            cards = sorted((lesson / "cards").glob("*.md"))
            questions = sorted((lesson / "questions").glob("*.yaml"))
            self.assertEqual(len(cards), 8, lesson.name)
            data = [yaml.safe_load(q.read_text()) for q in questions]
            # Merckx and Coppi use the older 16-question pool, the rest use 12.
            self.assertIn(len(questions), (12, 16), lesson.name)
            per_pool = len(questions) // 4
            typed = [q for q in data if q["type"] == "type_answer_question"]
            self.assertEqual(len(typed), 4, lesson.name)
            for pool in (2, 4, 6, 8):
                self.assertEqual(len([q for q in data if q["after_card_position"] == pool]), per_pool, lesson.name)
            for q in data:
                if q["type"] == "multiple_choice":
                    ids = [c["id"] for c in q["choices"]]
                    self.assertEqual(len(ids), 4)
                    self.assertEqual(len(set(c["text"] for c in q["choices"])), 4, q["prompt"])
                    self.assertEqual(len(q["correct_choice_ids"]), 1)
                    self.assertIn(q["correct_choice_ids"][0], ids)
                else:
                    self.assertTrue(q["accepted_answers"])

    def test_card_length(self):
        for card in ROOT.glob("*/cards/*.md"):
            if "3-key" in card.name:
                continue
            body = card.read_text().split("---\n", 2)[2]
            self.assertGreaterEqual(len(body.split()), 100, card)

    def test_each_lesson_links_a_source(self):
        for lesson in ROOT.iterdir():
            if lesson.is_dir():
                last = sorted((lesson / "cards").glob("*.md"))[6].read_text()
                self.assertIn("Source: [", last, lesson.name)

    def test_each_lesson_has_one_illustrated_card(self):
        for lesson in ROOT.iterdir():
            if not lesson.is_dir():
                continue
            illustrated = [c for c in (lesson / "cards").glob("*.md") if front(c).get("image")]
            self.assertEqual(len(illustrated), 1, lesson.name)
            for card in illustrated:
                meta = front(card)
                for field in ("image_alt", "image_credit", "image_license", "image_source_url"):
                    self.assertTrue(str(meta.get(field) or "").strip(), f"{card}: {field}")
                self.assertTrue((card.parent / meta["image"]).is_file(), card)


if __name__ == "__main__":
    unittest.main()
