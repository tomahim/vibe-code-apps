"""Check coverage and lesson structure for the workbook vocabulary path."""

from collections import Counter
import csv
from pathlib import Path
import re
import unittest

from check_uuids import load_metadata


ROOT = Path(__file__).parent / "themes/language/600-words-for-little-english-talkers"


class LittleEnglishTalkersTests(unittest.TestCase):
    def test_workbook_coverage_and_sound_colocation(self):
        with (ROOT / "source-map.csv").open(newline="") as handle:
            rows = list(csv.DictReader(handle))
        self.assertEqual(len(rows), 671)
        self.assertEqual(Counter(row["kind"] for row in rows), {"word": 630, "sound": 41})
        self.assertEqual(len({int(row["workbook_row"]) for row in rows}), 671)
        for category in {row["category"] for row in rows}:
            words = [row for row in rows if row["category"] == category and row["kind"] == "word"]
            self.assertEqual(len(words), 30, category)
            self.assertEqual({int(row["item_number"]) for row in words}, set(range(1, 31)))
        lookup = {(row["category"], re.match(r"\d+", row["item_number"]).group()): row
                  for row in rows if row["kind"] == "word"}
        for sound in (row for row in rows if row["kind"] == "sound"):
            key = (sound["category"], re.match(r"\d+", sound["item_number"]).group())
            word = lookup[key]
            self.assertEqual((sound["lesson_slug"], sound["card_position"]),
                             (word["lesson_slug"], word["card_position"]))

    def test_cards_and_typed_checkpoints(self):
        lessons = sorted(path for path in ROOT.iterdir() if path.is_dir())
        self.assertEqual(len(lessons), 21)
        for lesson in lessons:
            with self.subTest(lesson=lesson.name):
                cards = sorted((lesson / "cards").glob("*.md"))
                questions = sorted((lesson / "questions").glob("*.yaml"))
                self.assertEqual((len(cards), len(questions)), (8, 16))
                for position, card in enumerate(cards, 1):
                    self.assertEqual(load_metadata(card)["position"], position)
                    body = card.read_text().split("---", 2)[2]
                    self.assertEqual(len(re.findall(r"^\*\*[^*\n]+\*\*$", body, re.M)), 4)
                    if position == 8:
                        self.assertEqual(body.count("(review)"), 2)
                checkpoints = Counter()
                for position, question in enumerate(questions, 1):
                    data = load_metadata(question)
                    self.assertEqual(data["position"], position)
                    self.assertEqual(data["type"], "type_answer_question")
                    checkpoint = data["after_card_position"]
                    checkpoints[checkpoint] += 1
                    self.assertTrue(data["accepted_answers"])
                    self.assertTrue(any(data["accepted_answers"][0] in cards[index].read_text()
                                        for index in range(checkpoint - 2, checkpoint)))
                self.assertEqual(checkpoints, {position: 4 for position in (2, 4, 6, 8)})


if __name__ == "__main__":
    unittest.main()
