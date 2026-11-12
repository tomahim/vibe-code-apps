import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).parent / "themes" / "tech-and-ai" / "harness2-self-improving-ai"


def front(path):
    return yaml.safe_load(path.read_text().split("---\n", 2)[1])


class Harness2Tests(unittest.TestCase):
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

    def test_card_length_and_paragraphs(self):
        for card in ROOT.glob("*/cards/*.md"):
            body = card.read_text().split("---\n", 2)[2]
            if "key-learnings" in card.name or "3-key" in card.name:
                continue
            self.assertGreaterEqual(len(body.split()), 100, card)
            paragraphs = [p for p in body.strip().split("\n\n") if p.strip()]
            self.assertEqual(len(paragraphs), 2, card)

    def test_typed_answers_are_distinct_after_normalization(self):
        import importlib.util
        source = Path(__file__).parent.parent / "api/apps/learning/grading.py"
        spec = importlib.util.spec_from_file_location("learning_grading", source)
        grading = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(grading)
        for path in ROOT.glob("*/questions/*.yaml"):
            question = yaml.safe_load(path.read_text())
            if question["type"] == "type_answer_question":
                answers = [grading.normalize_typed_answer(a) for a in question["accepted_answers"]]
                self.assertTrue(all(answers), path)
                self.assertEqual(len(answers), len(set(answers)), path)

    def test_mc_choices_have_comparable_length(self):
        for path in ROOT.glob("*/questions/*.yaml"):
            question = yaml.safe_load(path.read_text())
            if question["type"] != "multiple_choice":
                continue
            lengths = [len(choice["text"].split()) for choice in question["choices"]]
            self.assertLessEqual(max(lengths) / min(lengths), 1.7, path)

    def test_answers_are_not_fixed_in_first_position(self):
        positions = set()
        for path in ROOT.glob("*/questions/*.yaml"):
            question = yaml.safe_load(path.read_text())
            if question["type"] == "multiple_choice":
                positions.add(next(i for i, choice in enumerate(question["choices"])
                                   if choice["id"] in question["correct_choice_ids"]))
        self.assertEqual(positions, {0, 1, 2, 3})

    def test_each_lesson_has_direct_further_reading(self):
        for lesson in (p for p in ROOT.iterdir() if p.is_dir()):
            text = "\n".join(p.read_text() for p in (lesson / "cards").glob("*.md"))
            self.assertIn("[Further reading:", text, lesson)
        self.assertTrue((Path(__file__).parent / "harness2-sources.md").is_file())


if __name__ == "__main__":
    unittest.main()
