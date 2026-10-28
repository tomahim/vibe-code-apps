from uuid import UUID

from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET, require_POST

from apps.accounts.decorators import jwt_required

from .api import (
    LearnerState, checkpoint_questions, described, input_error, json_object,
    lesson_summary, lock_learner, next_step, public_question, visible,
)
from .models import Card, CardProgress, LearningPath, Lesson, Question, QuestionAttempt, Theme
from .images import image_url


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
    lesson = get_object_or_404(visible(Lesson).select_related("learning_path__theme"), pk=lesson_id)
    state = LearnerState(request.user)
    return JsonResponse({"lesson": lesson_summary(lesson, state),
                         "learning_path": described(lesson.learning_path),
                         "theme": described(lesson.learning_path.theme),
                         "cards": [{"id": str(c.pk), "position": c.position, "title": c.title,
                                    "body_markdown": c.body_markdown,
                                    "illustration_path": c.illustration_path,
                                    "illustration_url": image_url(c),
                                    "illustration_alt": c.illustration_alt,
                                    "completed_at": state.completed[c.pk].isoformat()
                                    if c.pk in state.completed else None}
                                   for c in state.cards if c.lesson_id == lesson.pk],
                         "questions": [{**public_question(q),
                                        "completed": (lesson.pk, q.after_card_position) in state.passed}
                                       for q in checkpoint_questions(state, lesson)],
                         "next_step": next_step(state, lesson)})


@never_cache
@csrf_exempt  # Bearer-only auth; Django session cookies cannot authorize this write.
@require_POST
@jwt_required
def complete_card(request, card_id):
    try:
        json_object(request, [])
    except ValidationError as exc:
        return input_error(exc)
    with transaction.atomic():
        lock_learner(request.user)
        card = get_object_or_404(visible(Card).select_related("lesson"), pk=card_id)
        state = LearnerState(request.user)
        if card.pk not in state.completed and next_step(state, card.lesson) != {"type": "card", "id": str(card.pk)}:
            return JsonResponse({"error": "Complete the preceding cards and checkpoint first."}, status=409)
        progress, created = CardProgress.objects.get_or_create(
            user=request.user, card=card, defaults={"completed_at": timezone.now()},
        )
        state = LearnerState(request.user)
        return JsonResponse({"card_id": str(card.pk), "completed_at": progress.completed_at.isoformat(),
                             "created": created, "progress": state.progress([card.lesson]),
                             "next_step": next_step(state, card.lesson)}, status=201 if created else 200)


@never_cache
@csrf_exempt  # Only the existing verified Bearer token sets the learner identity.
@require_POST
@jwt_required
def question_attempts(request):
    try:
        data = json_object(request, ["question_id", "answer"])
        if not isinstance(data.get("question_id"), str) or not isinstance(data.get("answer"), str):
            raise ValidationError("Provide question_id and answer choice ID as strings.")
        try:
            question_id = UUID(data["question_id"])
        except ValueError:
            raise ValidationError("Invalid question UUID.") from None
        if not data["answer"] or len(data["answer"]) > 255:
            raise ValidationError("Invalid answer choice ID.")
    except ValidationError as exc:
        return input_error(exc)
    with transaction.atomic():
        lock_learner(request.user)
        question = get_object_or_404(visible(Question).select_related("lesson"), pk=question_id)
        if data["answer"] not in {o["id"] for o in question.options}:
            return JsonResponse({"error": "Answer must be one of this question's choice IDs."}, status=400)
        state = LearnerState(request.user)
        if next_step(state, question.lesson) != {"type": "question", "id": str(question.pk)}:
            return JsonResponse({"error": "This question is not the current checkpoint."}, status=409)
        checkpoint_ids = [q.pk for q in state.questions if q.lesson_id == question.lesson_id
                          and q.after_card_position == question.after_card_position]
        retry = QuestionAttempt.objects.filter(user=request.user, question_id__in=checkpoint_ids,
                                               attempt_type__in=["initial", "retry"]).exists()
        attempt = QuestionAttempt.objects.create(
            user=request.user, question=question,
            attempt_type="retry" if retry else "initial", submitted_answer=data["answer"],
            correct=data["answer"] == question.answer, answered_at=timezone.now(),
        )
        state = LearnerState(request.user)
        return JsonResponse({"attempt_id": attempt.pk, "question_id": str(question.pk),
                             "attempt_type": attempt.attempt_type, "correct": attempt.correct,
                             "explanation": question.explanation, "answered_at": attempt.answered_at.isoformat(),
                             "progress": state.progress([question.lesson]),
                             "next_step": next_step(state, question.lesson)}, status=201)


@never_cache
@require_GET
@jwt_required
def progress(request):
    state = LearnerState(request.user)
    lessons = list(visible(Lesson))
    return JsonResponse({"progress": state.progress(lessons),
                         "learning_paths": [
                             {"id": str(path.pk), "theme_id": str(path.theme_id),
                              "progress": state.progress([l for l in lessons if l.learning_path_id == path.pk])}
                             for path in visible(LearningPath)],
                         "lessons": [lesson_summary(lesson, state) for lesson in lessons]})

