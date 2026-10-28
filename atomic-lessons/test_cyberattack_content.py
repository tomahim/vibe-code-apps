"""Keep the Anatomy of a cyberattack path within its approved lesson format."""

from collections import Counter
from pathlib import Path
import re
import unittest

from check_uuids import load_metadata


PATH = Path(__file__).resolve().parent / "themes/tech-and-ai/anatomy-of-a-cyberattack"


class CyberattackContentTests(unittest.TestCase):
    def test_lesson_card_and_question_contract(self):
        lessons = sorted(path for path in PATH.iterdir() if path.is_dir())
        self.assertEqual(len(lessons), 15)
        positions = sorted(load_metadata(lesson / "index.md")["position"] for lesson in lessons)
        self.assertEqual(positions, list(range(1, 16)))
        for lesson in lessons:
            with self.subTest(lesson=lesson.name):
                cards = sorted((lesson / "cards").glob("*.md"))
                questions = sorted((lesson / "questions").glob("*.yaml"))
                self.assertEqual(len(cards), 7)
                self.assertEqual(len(questions), 6)
                for position, card in enumerate(cards, start=1):
                    self.assertEqual(load_metadata(card)["position"], position)
                    body = card.read_text(encoding="utf-8").split("---", 2)[-1].strip()
                    self.assertIn(len(body.split("\n\n")), (2, 3), card)
                    prose = re.sub(r"https?://\S+", "", body)
                    if position < 7:
                        self.assertGreaterEqual(len(re.findall(r"\b[\w'-]+\b", prose)), 100, card)
                self.assertEqual(load_metadata(cards[-1])["title"], "3 key learnings")
                checkpoints = Counter(load_metadata(question)["after_card_position"] for question in questions)
                self.assertEqual(checkpoints, Counter({3: 3, 7: 3}))

    def test_sources_are_linked(self):
        for lesson in sorted(path for path in PATH.iterdir() if path.is_dir()):
            text = "".join(card.read_text(encoding="utf-8") for card in (lesson / "cards").glob("*.md"))
            self.assertIn("https://", text, lesson.name)


if __name__ == "__main__":
    unittest.main()
