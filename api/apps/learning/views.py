from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET

from apps.accounts.decorators import jwt_required

from .api import LearnerState, described, visible
from .models import LearningPath, Lesson, Theme


@never_cache
@require_GET
@jwt_required
def themes(request):
    state = LearnerState(request.user)
    lessons = list(visible(Lesson).select_related("learning_path"))
    paths = list(visible(LearningPath))
    return JsonResponse({"themes": [
        {**described(theme), "learning_paths_total": sum(p.theme_id == theme.pk for p in paths),
         "learning_paths_started": sum(state.progress([l for l in lessons if l.learning_path_id == p.pk])["started"]
                                       for p in paths if p.theme_id == theme.pk),
         "progress": state.progress([l for l in lessons if l.learning_path.theme_id == theme.pk])}
        for theme in visible(Theme)
    ]})


@never_cache
@require_GET
@jwt_required
def theme_detail(request, theme_id):
    from django.shortcuts import get_object_or_404
    theme = get_object_or_404(visible(Theme), pk=theme_id)
    state = LearnerState(request.user)
    lessons = list(visible(Lesson))
    return JsonResponse({"theme": described(theme), "learning_paths": [
        {**described(path), "theme_id": str(theme.pk),
         "progress": state.progress([l for l in lessons if l.learning_path_id == path.pk])}
        for path in visible(LearningPath).filter(theme=theme)
    ]})


@never_cache
@require_GET
@jwt_required
def path_detail(request, path_id):
    from django.shortcuts import get_object_or_404
    from .api import lesson_summary
    path = get_object_or_404(visible(LearningPath).select_related("theme"), pk=path_id)
    state = LearnerState(request.user)
    lessons = list(visible(Lesson).filter(learning_path=path))
    return JsonResponse({"learning_path": {**described(path), "theme_id": str(path.theme_id),
                                          "progress": state.progress(lessons)},
                         "theme": described(path.theme),
                         "lessons": [lesson_summary(l, state) for l in lessons],
                         "next_lesson_id": next((str(l.pk) for l in lessons
                                                 if not state.progress([l])["completed"]), None)})


@never_cache
@require_GET
@jwt_required
def lesson_detail(request, lesson_id):
    from django.shortcuts import get_object_or_404
    from .api import checkpoint_questions, lesson_summary, next_step, public_question
    lesson = get_object_or_404(visible(Lesson).select_related("learning_path__theme"), pk=lesson_id)
    state = LearnerState(request.user)
    return JsonResponse({"lesson": lesson_summary(lesson, state),
                         "learning_path": described(lesson.learning_path),
                         "theme": described(lesson.learning_path.theme),
                         "cards": [{"id": str(c.pk), "position": c.position, "title": c.title,
                                    "body_markdown": c.body_markdown,
                                    "illustration_path": c.illustration_path,
                                    "illustration_alt": c.illustration_alt,
                                    "completed_at": state.completed[c.pk].isoformat()
                                    if c.pk in state.completed else None}
                                   for c in state.cards if c.lesson_id == lesson.pk],
                         "questions": [{**public_question(q),
                                        "completed": (lesson.pk, q.after_card_position) in state.passed}
                                       for q in checkpoint_questions(state, lesson)],
                         "next_step": next_step(state, lesson)})
