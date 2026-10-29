import random
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
from .models import Card, CardProgress, LearningPath, Lesson, LessonOpen, Question, QuestionAttempt, Theme
from .images import illustration_srcset, image_url
from .grading import normalize_typed_answer
from .rewards import leaderboard as ranking, reward_events, totals as reward_totals


def catch_up_payload(state, path_lessons):
    """Gauge context for the path panel: is the quiz unlocked, and how big is the pool."""
    return {"eligible": any(state.lesson_fully_read(lesson.pk) for lesson in path_lessons),
            "remaining": len(state.catch_up_questions(path_lessons))}


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
                                          "progress": state.progress(lessons),
                                          "catch_up": catch_up_payload(state, lessons)},
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
                                    "illustration_srcset": illustration_srcset(c),
                                    "illustration_width": c.illustration_width,
                                    "illustration_height": c.illustration_height,
                                    "illustration_caption": c.illustration_caption,
                                    "illustration_credit": c.illustration_credit,
                                    "illustration_license": c.illustration_license,
                                    "illustration_source_url": c.illustration_source_url,
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
def open_lesson(request, lesson_id):
    try:
        json_object(request, [])
    except ValidationError as exc:
        return input_error(exc)
    with transaction.atomic():
        lock_learner(request.user)
        lesson = get_object_or_404(visible(Lesson), pk=lesson_id)
        opened_at = timezone.now()
        LessonOpen.objects.update_or_create(
            user=request.user, lesson=lesson, defaults={"opened_at": opened_at},
        )
    return JsonResponse({"lesson_id": str(lesson.pk), "opened_at": opened_at.isoformat()})


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
        state = LearnerState(request.user, lesson=card.lesson)
        if card.pk not in state.completed and next_step(state, card.lesson) != {"type": "card", "id": str(card.pk)}:
            return JsonResponse({"error": "Complete the preceding cards and checkpoint first."}, status=409)
        created = card.pk not in state.completed
        if created:
            completed_at = timezone.now()
            CardProgress.objects.create(user=request.user, card=card, completed_at=completed_at)
        else:
            completed_at = state.completed[card.pk]
        # The row lock serializes this learner, so the state we already loaded
        # plus this write is the post-write state. Avoid reloading every card,
        # question, progress row and attempt a second time on each completion.
        state.completed[card.pk] = completed_at
        return JsonResponse({"card_id": str(card.pk), "completed_at": completed_at.isoformat(),
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
            raise ValidationError("Provide question_id and answer as strings.")
        try:
            question_id = UUID(data["question_id"])
        except ValueError:
            raise ValidationError("Invalid question UUID.") from None
        if not data["answer"].strip() or len(data["answer"]) > 255:
            raise ValidationError("Answer must be between 1 and 255 characters.")
    except ValidationError as exc:
        return input_error(exc)
    with transaction.atomic():
        lock_learner(request.user)
        question = get_object_or_404(visible(Question).select_related("lesson"), pk=question_id)
        if question.type == Question.Type.MULTIPLE_CHOICE and data["answer"] not in {o["id"] for o in question.options}:
            return JsonResponse({"error": "Answer must be one of this question's choice IDs."}, status=400)
        state = LearnerState(request.user)
        checkpoint = (question.lesson_id, question.after_card_position)
        fully_read = state.lesson_fully_read(question.lesson_id)
        catch_up = fully_read and question.pk not in state.correct_questions
        review = checkpoint in state.passed and not catch_up
        if fully_read:
            # Once the cards are read every question is answerable (#204): a
            # gap behaves like a first-run attempt (initial/retry), an
            # already-correct question is ordinary review practice.
            current = True
        elif review:
            selected = next((q for q in checkpoint_questions(state, question.lesson)
                             if q.after_card_position == question.after_card_position), None)
            current = selected is not None and selected.pk == question.pk and any(
                card.lesson_id == question.lesson_id and card.position == question.after_card_position
                and card.pk in state.completed for card in state.cards)
        else:
            current = next_step(state, question.lesson) == {"type": "question", "id": str(question.pk)}
        if not current:
            return JsonResponse({"error": "This question is not the current checkpoint."}, status=409)
        checkpoint_ids = [q.pk for q in state.questions if q.lesson_id == question.lesson_id
                          and q.after_card_position == question.after_card_position]
        retry = QuestionAttempt.objects.filter(
            user=request.user, question_id__in=checkpoint_ids,
            attempt_type__in=["initial", "retry"]).exists()
        correct = (data["answer"] == question.answer if question.type == Question.Type.MULTIPLE_CHOICE
                   else normalize_typed_answer(data["answer"]) in {
                       normalize_typed_answer(answer) for answer in question.accepted_answers
                   })
        first_correct = correct and not QuestionAttempt.objects.filter(
            user=request.user, question=question, correct=True).exists()
        attempt = QuestionAttempt.objects.create(
            user=request.user, question=question,
            attempt_type=("review" if review else "retry" if retry else "initial"),
            submitted_answer=data["answer"],
            correct=correct, answered_at=timezone.now(),
        )
        state = LearnerState(request.user)
        if review:
            following = None
            if not attempt.correct:
                selected = next(q for q in checkpoint_questions(state, question.lesson)
                                if q.after_card_position == question.after_card_position)
                following = {"type": "question", "id": str(selected.pk)}
        else:
            following = next_step(state, question.lesson)
        return JsonResponse({"attempt_id": attempt.pk, "question_id": str(question.pk),
                             "attempt_type": attempt.attempt_type, "correct": attempt.correct,
                             "carrot_earned": first_correct,
                             "explanation": question.explanation, "answered_at": attempt.answered_at.isoformat(),
                             "correct_answer": question.answer if question.type == Question.Type.TYPE_ANSWER_QUESTION else None,
                             "progress": state.progress([question.lesson]),
                             "next_step": following}, status=201)


@never_cache
@require_GET
@jwt_required
def catch_up(request, path_id):
    """One shared quiz over visible questions of fully read lessons.

    Keep the historical endpoint name; there is no catch-up/review mode gate.
    The gauge's remaining count is independent of session selection.
    """
    path = get_object_or_404(visible(LearningPath), pk=path_id)
    state = LearnerState(request.user)
    lessons = list(visible(Lesson).filter(learning_path=path))
    titles = {lesson.pk: lesson.title for lesson in lessons}
    read_ids = {lesson.pk for lesson in lessons if state.lesson_fully_read(lesson.pk)}
    pool = [q for q in state.questions if q.lesson_id in read_ids]
    session = quiz_session(state, pool)
    return JsonResponse({"learning_path_id": str(path.pk),
                         "eligible": bool(read_ids),
                         "remaining": len(state.catch_up_questions(lessons)),
                         "questions": [{**public_question(q), "lesson_title": titles[q.lesson_id]}
                                       for q in session]})


def quiz_session(state, pool, limit=10):
    """Failed latest answers, unseen questions, then 60% oldest / 40% random.

    Each question appears once. Priority buckets are random within their tier;
    oldest means time of the latest answer. Round 60% to the nearest whole
    question (half up); the random tail fills every remaining available slot.
    """
    failed = [q for q in pool if state.last_correct.get(q.pk) is False]
    unseen = [q for q in pool if q.pk not in state.last_attempt]
    random.shuffle(failed)
    random.shuffle(unseen)
    session = (failed + unseen)[:limit]
    selected = {q.pk for q in session}
    slots = limit - len(session)
    if not slots:
        return session
    answered = [q for q in pool if q.pk not in selected and q.pk in state.last_attempt]
    answered.sort(key=lambda q: (state.last_attempt[q.pk], str(q.pk)))
    oldest_count = (slots * 6 + 5) // 10
    old = answered[:oldest_count]
    session.extend(old)
    selected.update(q.pk for q in old)
    rest = [q for q in answered if q.pk not in selected]
    random.shuffle(rest)
    session.extend(rest[:limit - len(session)])
    return session


@never_cache
@require_GET
@jwt_required
def progress(request):
    state = LearnerState(request.user)
    lessons = list(visible(Lesson))
    return JsonResponse({"progress": state.progress(lessons),
                         "rewards": reward_totals(reward_events().get(request.user.pk, [])),
                         "learning_paths": [
                             {"id": str(path.pk), "theme_id": str(path.theme_id),
                              "progress": state.progress([l for l in lessons if l.learning_path_id == path.pk])}
                             for path in visible(LearningPath)],
                         "lessons": [lesson_summary(lesson, state) for lesson in lessons]})


@never_cache
@require_GET
@jwt_required
def garden(request):
    """One snapshot for the garden scene, with published hierarchy and real progress."""
    state = LearnerState(request.user)
    themes_list = list(visible(Theme))
    paths = list(visible(LearningPath))
    lessons = list(visible(Lesson))
    events = reward_events().get(request.user.pk, [])
    recent_lessons = []
    for opened in LessonOpen.objects.filter(user=request.user, lesson__in=lessons).select_related(
        "lesson__learning_path__theme",
    ).order_by("-opened_at", "-pk"):
        lesson = opened.lesson
        step = next_step(state, lesson)
        if step is None:
            continue
        recent_lessons.append({
            "id": str(lesson.pk), "title": lesson.title,
            "learning_path_title": lesson.learning_path.title,
            "theme_title": lesson.learning_path.theme.title,
            "next_step": step, "progress": state.progress([lesson]),
        })
        if len(recent_lessons) == 3:
            break
    return JsonResponse({
        "themes": [{
            **described(theme),
            "progress": state.progress([lesson for lesson in lessons if
                                        any(path.pk == lesson.learning_path_id and path.theme_id == theme.pk for path in paths)]),
            "learning_paths": [{
                **described(path), "theme_id": str(theme.pk),
                "progress": state.progress([lesson for lesson in lessons if lesson.learning_path_id == path.pk]),
                "catch_up": catch_up_payload(state, [lesson for lesson in lessons
                                                     if lesson.learning_path_id == path.pk]),
                "lessons": [lesson_summary(lesson, state) for lesson in lessons if lesson.learning_path_id == path.pk],
            } for path in paths if path.theme_id == theme.pk],
        } for theme in themes_list],
        "rewards": reward_totals(events),
        "recent_lessons": recent_lessons,
    })


@never_cache
@require_GET
@jwt_required
def leaderboard(request):
    currency = request.GET.get('currency', 'drops')
    period = request.GET.get('period', 'weekly')
    if currency not in ('drops', 'carrots') or period not in ('weekly', 'monthly', 'overall'):
        return JsonResponse({"error": "Choose drops or carrots and weekly, monthly or overall."}, status=400)
    return JsonResponse(ranking(request.user, currency, period))

