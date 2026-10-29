"""Staff-only learning-progress dashboard, registered as a read-only admin entry.

The changelist of this view-only LearningPath admin renders the dashboard, so
the page sits in the regular admin navigation without enabling content edits
(content stays synced from GitHub).
"""
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.shortcuts import render

from unfold.admin import ModelAdmin

from .api import LearnerState, visible
from .models import LearningPath, LearningProgress, Lesson
from .rewards import reward_events, totals


def progress_dashboard_context(user):
    """Per-user stats over visible content, from a bounded set of queries.

    Cards read and questions answered correctly stay distinct: reading every
    card finishes a lesson (learner UI), correct answers are practice mastery.
    """
    state = LearnerState(user)
    lessons = list(visible(Lesson).select_related("learning_path__theme"))
    paths = list(visible(LearningPath).select_related("theme"))

    cards_by_lesson = {}
    for card in state.cards:
        cards_by_lesson.setdefault(card.lesson_id, []).append(card)
    questions_by_lesson = {}
    for question in state.questions:
        questions_by_lesson.setdefault(question.lesson_id, []).append(question)
    lessons_by_path = {}
    for lesson in lessons:
        lessons_by_path.setdefault(lesson.learning_path_id, []).append(lesson)

    def percent(done, total):
        return round(done * 100 / total) if total else 0

    path_rows = []
    for path in paths:
        path_lessons = lessons_by_path.get(path.pk, [])
        cards = [c for lesson in path_lessons for c in cards_by_lesson.get(lesson.pk, [])]
        questions = [q for lesson in path_lessons for q in questions_by_lesson.get(lesson.pk, [])]
        cards_read = sum(c.pk in state.completed for c in cards)
        questions_correct = sum(q.pk in state.correct_questions for q in questions)
        lessons_read = sum(
            bool(cards_by_lesson.get(lesson.pk))
            and all(c.pk in state.completed for c in cards_by_lesson[lesson.pk])
            for lesson in path_lessons
        )
        path_rows.append({
            "path": path,
            "cards_read": cards_read, "cards_total": len(cards),
            "cards_pct": percent(cards_read, len(cards)),
            "questions_correct": questions_correct, "questions_total": len(questions),
            "questions_pct": percent(questions_correct, len(questions)),
            "lessons_read": lessons_read, "lessons_total": len(path_lessons),
            "started": bool(cards_read or questions_correct),
        })

    themes = []
    for theme in sorted({p.theme for p in paths}, key=lambda t: (t.position, str(t.pk))):
        theme_paths = [row for row in path_rows if row["path"].theme_id == theme.pk]
        themes.append({"theme": theme, "paths": theme_paths})

    events = reward_events().get(user.pk, [])
    rewards = totals(events)
    activity = list(state.completed.values()) + list(state.last_attempt.values())
    totals_row = {
        "cards_read": sum(row["cards_read"] for row in path_rows),
        "cards_total": sum(row["cards_total"] for row in path_rows),
        "questions_correct": sum(row["questions_correct"] for row in path_rows),
        "questions_total": sum(row["questions_total"] for row in path_rows),
        "lessons_read": sum(row["lessons_read"] for row in path_rows),
        "lessons_total": sum(row["lessons_total"] for row in path_rows),
    }
    totals_row["cards_pct"] = percent(totals_row["cards_read"], totals_row["cards_total"])
    totals_row["questions_pct"] = percent(totals_row["questions_correct"], totals_row["questions_total"])

    return {
        "themes": themes,
        "totals": totals_row,
        "rewards": rewards,
        "last_activity": max(activity) if activity else None,
    }


@admin.register(LearningProgress)
class LearningProgressAdmin(ModelAdmin):
    """Read-only entry: the changelist renders the per-user progress dashboard."""

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        users = list(get_user_model().objects.filter(is_active=True).order_by("username"))
        selected = request.user
        user_param = request.GET.get("user", "")
        if user_param.isdigit() and int(user_param) != request.user.pk:
            selected = next((u for u in users if u.pk == int(user_param)), request.user)
        context = {
            **self.admin_site.each_context(request),
            "title": "Learning progress",
            "users": users,
            "selected_user": selected,
            **progress_dashboard_context(selected),
        }
        return render(request, "admin/learning/progress.html", context)
