# Backfill celebrations for paths finished before per-learner tracking.
#
# The +100 Drops path bonus is derived from reading history (rewards.py):
# a path is finished once every card of every visible lesson is read. Anyone
# who had already finished a path before lg_path_celebration existed has
# therefore already collected that bonus, so their celebration counts as
# shown - otherwise the garden would display "+100 Drops" a second time.
# This mirrors rewards.reward_events exactly, using historical models.

from collections import defaultdict

from django.db import migrations


def backfill(apps, schema_editor):
    LearningPath = apps.get_model("learning", "LearningPath")
    Lesson = apps.get_model("learning", "Lesson")
    Card = apps.get_model("learning", "Card")
    CardProgress = apps.get_model("learning", "CardProgress")
    PathCelebration = apps.get_model("learning", "PathCelebration")

    paths = list(LearningPath.objects.filter(
        published=True, entity__archived=False, theme__published=True, theme__entity__archived=False,
    ).values("pk"))
    lessons = list(Lesson.objects.filter(
        published=True, entity__archived=False,
        learning_path__published=True, learning_path__entity__archived=False,
        learning_path__theme__published=True, learning_path__theme__entity__archived=False,
    ).values("pk", "learning_path_id"))
    cards = list(Card.objects.filter(
        published=True, entity__archived=False,
        lesson__published=True, lesson__entity__archived=False,
        lesson__learning_path__published=True, lesson__learning_path__entity__archived=False,
        lesson__learning_path__theme__published=True, lesson__learning_path__theme__entity__archived=False,
    ).values("pk", "lesson_id"))

    cards_by_lesson = defaultdict(set)
    for card in cards:
        cards_by_lesson[card["lesson_id"]].add(card["pk"])
    lessons_by_path = defaultdict(set)
    for lesson in lessons:
        lessons_by_path[lesson["learning_path_id"]].add(lesson["pk"])

    card_times = defaultdict(dict)
    progress = CardProgress.objects.filter(card_id__in={card["pk"] for card in cards})
    for row in progress.values("user_id", "card_id", "completed_at"):
        card_times[row["user_id"]][row["card_id"]] = row["completed_at"]

    rows = []
    for user_id, times in card_times.items():
        completion = {}
        for lesson in lessons:
            required_cards = cards_by_lesson[lesson["pk"]]
            if not required_cards or not required_cards.issubset(times):
                continue
            completion[lesson["pk"]] = max(times[card_id] for card_id in required_cards)
        for path in paths:
            required_lessons = lessons_by_path[path["pk"]]
            if required_lessons and required_lessons.issubset(completion):
                rows.append(PathCelebration(
                    user_id=user_id,
                    learning_path_id=path["pk"],
                    shown_at=max(completion[lesson_id] for lesson_id in required_lessons),
                ))
    PathCelebration.objects.bulk_create(rows, ignore_conflicts=True)


class Migration(migrations.Migration):

    dependencies = [
        ("learning", "0007_path_celebration"),
    ]

    operations = [
        migrations.RunPython(backfill, migrations.RunPython.noop),
    ]
