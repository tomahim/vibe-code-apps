import random
from uuid import UUID

from django.core.exceptions import ValidationError
from django.db import DatabaseError, connection, transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET, require_POST

from apps.accounts.decorators import jwt_required

from .api import (
    LearnerState, checkpoint_questions, described, input_error, json_object,
    lesson_summary, lock_learner, next_step, public_questions, visible,
)
from .models import (Card, CardProgress, LearningPath, Lesson, LessonOpen, PathCelebration,
                     Question, QuestionAttempt, Theme)
from .images import illustration_srcset, image_url
from .grading import normalize_typed_answer
from .badges import badges_leaderboard, check as check_badges
from .rewards import leaderboard as ranking, reward_events, totals as reward_totals


@never_cache
@require_GET
def health(request):
    """Cold-start probe for the Little Grains loader.

    Deliberately unauthenticated: the app polls this before it knows whether
    the API is awake, and it must answer even before a learner signs in. A
    real database round-trip is what "ready" means here - a plain 200 from
    Django would not prove the API can serve garden data yet.
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except DatabaseError:
        return JsonResponse({"status": "error", "database": "unreachable"}, status=503)
    return JsonResponse({"status": "ok", "database": "ok"})


def catch_up_payload(state, path_lessons):
    """Gauge context for the path panel: is the quiz unlocked, and how big is the pool."""
    return {"eligible": any(state.lesson_fully_read(lesson.pk) for lesson in path_lessons),
            "remaining": len(state.catch_up_questions(path_lessons))}


# A path's practice ages when it has not been revisited for a while: autumn
# from 10 days, winter from 20 (Thomas, 2026-11-08). The age anchor is the
# latest learner activity on the path - a question attempt, or a card read
# when its questions were never practised - so a path read long ago but never
# quizzed still ages from real elapsed time, not an assumed season.
PRACTICE_AUTUMN_DAYS = 10
PRACTICE_WINTER_DAYS = 20


def path_recency(state, lessons):
    """Latest question attempt or card read per learning path, from the
    already-loaded learner state (no extra queries)."""
    lesson_path = {lesson.pk: lesson.learning_path_id for lesson in lessons}
    recency = {}

    def touch(path_id, at):
        if path_id is not None and at is not None and (path_id not in recency or at > recency[path_id]):
            recency[path_id] = at

    for question in state.questions:
        touch(lesson_path.get(question.lesson_id), state.last_attempt.get(question.pk))
    for card in state.cards:
        touch(lesson_path.get(card.lesson_id), state.completed.get(card.pk))
    return recency


def practice_age(anchor, now):
    """Seasonal aging of one path's practice, for the garden scenery."""
    if anchor is None:
        return {"last_activity_at": None, "days_since": None, "state": "fresh"}
    days = (now - anchor).days
    season = "winter" if days >= PRACTICE_WINTER_DAYS else "autumn" if days >= PRACTICE_AUTUMN_DAYS else "fresh"
    return {"last_activity_at": anchor.isoformat(), "days_since": days, "state": season}


def practice_payload(state, path_lessons, recency, now):
    """Aging is only shown once the path has something to review: at least one
    fully read lesson. Before that the path is still growing, never wilting."""
    if not path_lessons or not any(state.lesson_fully_read(lesson.pk) for lesson in path_lessons):
        return {"last_activity_at": None, "days_since": None, "state": "fresh"}
    return practice_age(recency.get(path_lessons[0].learning_path_id), now)


@never_cache
@csrf_exempt  # Bearer-only auth; Django session cookies cannot authorize this write.
@require_POST
@jwt_required
def celebrate_path(request, path_id):
    """Mark a finished path's celebration as shown: the +100 Drops displays
    once per learner, on any device. Rewards stay derived from history; this
    row only hides the bonus line on later replays."""
    try:
        json_object(request, [])
    except ValidationError as exc:
        return input_error(exc)
    with transaction.atomic():
        lock_learner(request.user)
        path = get_object_or_404(visible(LearningPath), pk=path_id)
        _, created = PathCelebration.objects.get_or_create(
            user=request.user, learning_path=path, defaults={"shown_at": timezone.now()},
        )
    return JsonResponse({"learning_path_id": str(path.pk), "celebrated": True},
                        status=201 if created else 200)


@never_cache
@require_GET
@jwt_required
def lesson_detail(request, lesson_id):
    lesson = get_object_or_404(visible(Lesson).select_related("learning_path__theme"), pk=lesson_id)
    state = LearnerState(request.user, lesson=lesson, card_content=True)
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
                         "questions": [{**q,
                                        "completed": (lesson.pk, q["after_card_position"]) in state.passed}
                                       for q in public_questions(checkpoint_questions(state, lesson))],
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
        state = LearnerState(request.user, lesson=question.lesson)
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
        # retry and first_correct come from the loaded state, not extra
        # queries: any earlier initial/retry attempt on this checkpoint makes
        # this one a retry, and a question with no earlier correct answer
        # earns its carrot on this first one.
        retry = (question.lesson_id, question.after_card_position) in state.first_run_checkpoints
        correct = (data["answer"] == question.answer if question.type == Question.Type.MULTIPLE_CHOICE
                   else normalize_typed_answer(data["answer"]) in {
                       normalize_typed_answer(answer) for answer in question.accepted_answers
                   })
        first_correct = correct and question.pk not in state.correct_questions
        attempt = QuestionAttempt.objects.create(
            user=request.user, question=question,
            attempt_type=("review" if review else "retry" if retry else "initial"),
            submitted_answer=data["answer"],
            correct=correct, answered_at=timezone.now(),
        )
        # The row lock serializes this learner, so the state we already loaded
        # plus this write is the post-write state (same pattern as
        # complete_card): apply the attempt instead of reloading LearnerState.
        state.attempted.add(question.lesson_id)
        if attempt.attempt_type in ("initial", "retry"):
            state.first_run_checkpoints.add((question.lesson_id, question.after_card_position))
        state.last_attempt[question.pk] = attempt.answered_at
        state.last_correct[question.pk] = correct
        if correct:
            state.correct_questions.add(question.pk)
            if attempt.attempt_type != "review":
                state.passed.add((question.lesson_id, question.after_card_position))
        else:
            state.wrong_counts[question.lesson_id, question.after_card_position, question.type] += 1
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
    With ?lesson=<id> the session draws only from that lesson, provided its
    cards are read (Thomas, 2026-11-08: practising a selected lesson).
    """
    path = get_object_or_404(visible(LearningPath), pk=path_id)
    lessons = list(visible(Lesson).filter(learning_path=path))
    lesson_id = request.GET.get("lesson")
    if lesson_id:
        lessons = [lesson for lesson in lessons if str(lesson.pk) == lesson_id]
        if not lessons:
            return JsonResponse({"error": "Unknown lesson for this path."}, status=404)
    state = LearnerState(request.user, lessons=lessons)
    titles = {lesson.pk: lesson.title for lesson in lessons}
    read_ids = {lesson.pk for lesson in lessons if state.lesson_fully_read(lesson.pk)}
    pool = [q for q in state.questions if q.lesson_id in read_ids]
    session = quiz_session(state, pool)
    return JsonResponse({"learning_path_id": str(path.pk),
                         "eligible": bool(read_ids),
                         "remaining": len(state.catch_up_questions(lessons)),
                         "questions": [{**q, "lesson_title": titles[UUID(q["lesson_id"])]}
                                       for q in public_questions(session)]})


# Review session sizes: the learner says how much time they have, and that
# sets both the number of paths revisited and the question count (Thomas,
# 2026-11-08): 5 min -> 1 path / 10 questions, 10 -> 2 / 20, 15 -> 3 / 30.
REVIEW_MODES = {5: 1, 10: 2, 15: 3}


@never_cache
@require_GET
@jwt_required
def review(request):
    """Cross-theme review: questions from the paths practised least recently.

    Same mechanics as the path practice quiz (same selection priorities, same
    attempt route), but the pool spans the 1-3 stalest paths across every
    theme. Only questions of fully read lessons are reviewable.
    """
    try:
        minutes = int(request.GET.get("minutes", ""))
    except (TypeError, ValueError):
        minutes = 0
    if minutes not in REVIEW_MODES:
        return JsonResponse({"error": "minutes must be one of 5, 10 or 15."}, status=400)
    state = LearnerState(request.user)
    lessons = list(visible(Lesson).select_related("learning_path__theme"))
    read_ids = {lesson.pk for lesson in lessons if state.lesson_fully_read(lesson.pk)}
    eligible = {}
    for lesson in lessons:
        if lesson.pk in read_ids:
            eligible.setdefault(lesson.learning_path_id, lesson.learning_path)
    # Every eligible path has an anchor (a fully read lesson implies card
    # reads), so the stalest-first ordering never has to break a None tie.
    recency = path_recency(state, lessons)
    ordered = sorted(eligible, key=lambda pid: (recency.get(pid) or timezone.now(), str(pid)))
    selected = ordered[:REVIEW_MODES[minutes]]
    lesson_path = {lesson.pk: lesson.learning_path_id for lesson in lessons}
    titles = {lesson.pk: lesson.title for lesson in lessons}
    pool = [q for q in state.questions
            if q.lesson_id in read_ids and lesson_path.get(q.lesson_id) in selected]
    session = quiz_session(state, pool, limit=minutes * 2)
    return JsonResponse({
        "minutes": minutes,
        "eligible": bool(selected),
        "learning_paths": [{"id": str(pid), "title": eligible[pid].title,
                            "theme_title": eligible[pid].theme.title,
                            "last_activity_at": (recency[pid].isoformat() if pid in recency else None)}
                           for pid in selected],
        "questions": [{**q, "lesson_title": titles[UUID(q["lesson_id"])],
                       "learning_path_title": eligible[lesson_path[UUID(q["lesson_id"])]].title}
                      for q in public_questions(session)],
    })


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
def garden(request):
    """One snapshot for the garden scene, with published hierarchy and real progress."""
    state = LearnerState(request.user)
    themes_list = list(visible(Theme))
    paths = list(visible(LearningPath))
    lessons = list(visible(Lesson))
    recency = path_recency(state, lessons)
    now = timezone.now()
    events = reward_events().get(request.user.pk, [])
    celebrated_paths = set(PathCelebration.objects.filter(
        user=request.user, learning_path__in=paths,
    ).values_list("learning_path_id", flat=True))
    recent_lessons = []
    for opened in LessonOpen.objects.filter(user=request.user, lesson__in=lessons).select_related(
        "lesson__learning_path__theme",
    ).order_by("-opened_at", "-pk"):
        lesson = opened.lesson
        # Finished for this shortcut list means every card read, even when
        # questions are still open: those stay available through the quiz.
        if state.lesson_fully_read(lesson.pk):
            continue
        # Opening alone is not progress: with no card read yet the lesson
        # stays reachable from its tile instead of taking a shortcut slot.
        if not state.lesson_started(lesson.pk):
            continue
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
                "celebrated": path.pk in celebrated_paths,
                "progress": state.progress([lesson for lesson in lessons if lesson.learning_path_id == path.pk]),
                "catch_up": catch_up_payload(state, [lesson for lesson in lessons
                                                     if lesson.learning_path_id == path.pk]),
                "practice": practice_payload(state, [lesson for lesson in lessons
                                                     if lesson.learning_path_id == path.pk], recency, now),
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
    try:
        offset = int(request.GET.get('offset', '0'))
    except ValueError:
        return JsonResponse({"error": "Offset must be a whole number of past periods."}, status=400)
    if offset < 0 or offset > 520 or (period == 'overall' and offset):
        return JsonResponse({"error": "Offset goes 0-520 periods back; overall is all time and takes no offset."}, status=400)
    return JsonResponse(ranking(request.user, currency, period, offset=offset))


@never_cache
@require_GET
@jwt_required
def badges_leaderboard_view(request):
    """Per-player badge and streak fun stats for the Badges & streak tab.
    Same audience as the drops/carrots leaderboard, aggregates only, and
    everything derived from existing records: no writes, no new tables."""
    return JsonResponse(badges_leaderboard(request.user))


@never_cache
@csrf_exempt  # Bearer-only auth; Django session cookies cannot authorize this write.
@require_POST
@jwt_required
def badges_check(request):
    """Award what the learner has newly earned and return their collection.
    The client calls this on app load, after leaving a lesson or quiz and when
    opening the badges tab; nothing runs on card or answer writes."""
    # No learner lock: the evaluation only reads, and the award insert is
    # idempotent (unique user+badge), so a check never makes card or answer
    # saves wait while it evaluates.
    return JsonResponse(check_badges(request.user))
