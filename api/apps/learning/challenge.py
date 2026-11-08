"""The weekly Challenge (Thomas, 2026-11-08).

Every UTC ISO week draws 10 random questions from the paths flagged general
knowledge (specialist paths such as diving certifications stay out). The set
is stored on first request and is identical for every learner. Every question
is eligible: unread lessons and unstarted paths included. Each question
allows 30 seconds (enforced by the client; an unanswered question is recorded
wrong on auto-advance).

A challenge answer is an ordinary QuestionAttempt (attempt_type=challenge),
so first-correct carrots stay derived from learner history and dedupe across
modes: answering a question correctly here for the first time ever earns the
usual one carrot, never a second one.

The duel is private to the two configured players (Thomas + Aurore): the
LEARNING_CHALLENGE_PLAYERS setting lists their usernames or emails, and no
other account can play, see the challenge, or count toward a week's reveal.

Ranking is revealed only once BOTH players finished all 10 questions, never
before, and never publicly. Wins count toward the Challenge badges: strictly
beating the other player with at least 3/10 correct (ties are not wins).
"""
import random

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import IntegrityError, models, transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from apps.accounts.decorators import jwt_required

from .api import input_error, json_object, lock_learner, public_question, visible
from .grading import normalize_typed_answer
from .models import ChallengeWeek, Question, QuestionAttempt

CHALLENGE_SIZE = 10
CHALLENGE_SECONDS = 30
CHALLENGE_MIN_WIN = 3


def challenge_players():
    """The duo allowed to play: the accounts named in settings. Empty setting,
    no challenge."""
    handles = [h.strip() for h in getattr(settings, "LEARNING_CHALLENGE_PLAYERS", "").split(",") if h.strip()]
    if not handles:
        return []
    return list(get_user_model().objects.filter(
        models.Q(username__in=handles) | models.Q(email__in=handles)))


def player_or_404(request):
    players = challenge_players()
    if request.user.pk not in {p.pk for p in players}:
        return None, JsonResponse({"error": "Not found."}, status=404)
    return players, None


def current_week_key():
    """UTC ISO week, Monday start (the garden's week rule)."""
    iso = timezone.now().isocalendar()
    return f"{iso.year}-W{iso.week:02d}"


def get_or_create_week():
    """The current week's row, drawing and freezing its questions on first
    request. The unique key makes a simultaneous first draw safe."""
    key = current_week_key()
    week = ChallengeWeek.objects.filter(week_key=key).first()
    if week:
        return week
    pool = list(visible(Question).filter(
        lesson__learning_path__general_knowledge=True).values_list("pk", flat=True))
    drawn = [str(pk) for pk in random.sample(pool, min(CHALLENGE_SIZE, len(pool)))]
    try:
        with transaction.atomic():
            return ChallengeWeek.objects.create(
                week_key=key, question_ids=drawn, created_at=timezone.now())
    except IntegrityError:
        return ChallengeWeek.objects.get(week_key=key)


def week_scores(week, players=None):
    """Per-player attempt counts for one week, over the configured duo only:
    no other account can join, affect the reveal, or appear in a ranking.

    Returns {user_id: {"answered": n, "correct": n, "finished": bool}}."""
    if players is None:
        players = challenge_players()
    player_ids = {p.pk for p in players}
    size = len(week.question_ids)
    scores = {}
    for row in week.attempts.filter(user_id__in=player_ids).values("user_id", "correct"):
        entry = scores.setdefault(row["user_id"], {"answered": 0, "correct": 0})
        entry["answered"] += 1
        entry["correct"] += 1 if row["correct"] else 0
    for entry in scores.values():
        entry["finished"] = entry["answered"] >= size
    return scores


def ranking_rows(user, week, scores):
    """The week's ranking, or None while any participant is still playing.

    Never revealed early: a player sees their own score through `me` once
    they finish, but the comparison stays hidden until BOTH configured
    players are done (Thomas: visible only once both completed, never
    before). A week only one of them played never shows a ranking.
    """
    if len(scores) < 2 or not all(entry["finished"] for entry in scores.values()):
        return None
    users = {u.pk: u for u in get_user_model().objects.filter(pk__in=scores)}
    rows = []
    for user_id, entry in scores.items():
        learner = users.get(user_id)
        name = learner.get_full_name().strip() or getattr(learner, "username", "") or learner.email or "Learner"
        if "@" in name:
            name = name.split("@", 1)[0]
        rows.append({"name": name, "correct": entry["correct"], "is_self": user_id == user.pk})
    rows.sort(key=lambda row: (-row["correct"], row["name"]))
    for index, row in enumerate(rows):
        row["rank"] = index + 1
    return rows


def week_payload(user, week, *, include_questions, players=None):
    scores = week_scores(week, players)
    mine = scores.get(user.pk, {"answered": 0, "correct": 0, "finished": False})
    payload = {
        "week_key": week.week_key,
        "size": len(week.question_ids),
        "seconds_per_question": CHALLENGE_SECONDS,
        "me": mine,
        "ranking": ranking_rows(user, week, scores),
    }
    if include_questions:
        questions = {str(q.pk): q for q in visible(Question).filter(pk__in=week.question_ids)
                     .select_related("lesson__learning_path")}
        attempted = set(week.attempts.filter(user=user).values_list("question_id", flat=True))
        payload["questions"] = [
            {**public_question(questions[qid]),
             "lesson_title": questions[qid].lesson.title,
             "learning_path_title": questions[qid].lesson.learning_path.title,
             "answered": questions[qid].pk in attempted}
            for qid in week.question_ids if qid in questions]
    return payload


@never_cache
@require_GET
@jwt_required
def challenge(request):
    """The current week: its questions, my progress, the ranking if revealed."""
    players, denied = player_or_404(request)
    if denied:
        return denied
    return JsonResponse(week_payload(request.user, get_or_create_week(), include_questions=True, players=players))


@never_cache
@require_GET
@jwt_required
def challenge_history(request):
    """Past weekly results, plus the current week once I finished it."""
    players, denied = player_or_404(request)
    if denied:
        return denied
    current = get_or_create_week()
    weeks = list(ChallengeWeek.objects.order_by("-week_key"))
    out = []
    for week in weeks:
        scores = week_scores(week, players)
        mine = scores.get(request.user.pk)
        if not mine:
            continue  # weeks I never played stay out of my history
        if week.pk == current.pk and not mine["finished"]:
            continue  # the current week joins the history once finished
        out.append({
            "week_key": week.week_key,
            "size": len(week.question_ids),
            "me": mine,
            "ranking": ranking_rows(request.user, week, scores),
        })
    return JsonResponse({"weeks": out})


@never_cache
@csrf_exempt  # Bearer-only auth; Django session cookies cannot authorize this write.
@require_POST
@jwt_required
def challenge_answer(request):
    """One challenge answer. The question must be in the current week's set
    and unanswered by me; nothing else gates it (no read requirement)."""
    try:
        data = json_object(request, ["question_id", "answer"])
        if not isinstance(data.get("question_id"), str) or not isinstance(data.get("answer"), str):
            raise ValidationError("Provide question_id and answer as strings.")
    except ValidationError as exc:
        return input_error(exc)
    players, denied = player_or_404(request)
    if denied:
        return denied
    with transaction.atomic():
        lock_learner(request.user)
        week = get_or_create_week()
        if data["question_id"] not in week.question_ids:
            return JsonResponse({"error": "This question is not part of this week's challenge."}, status=409)
        question = get_object_or_404(visible(Question).select_related("lesson"), pk=data["question_id"])
        if week.attempts.filter(user=request.user, question=question).exists():
            return JsonResponse({"error": "This week's question is already answered."}, status=409)
        answer = data["answer"][:255]
        correct = bool(answer) and (
            answer == question.answer if question.type == Question.Type.MULTIPLE_CHOICE
            else normalize_typed_answer(answer) in {
                normalize_typed_answer(a) for a in question.accepted_answers})
        first_correct = correct and not QuestionAttempt.objects.filter(
            user=request.user, question=question, correct=True).exists()
        QuestionAttempt.objects.create(
            user=request.user, question=question, challenge_week=week,
            attempt_type=QuestionAttempt.AttemptType.CHALLENGE,
            submitted_answer=answer, correct=correct, answered_at=timezone.now())
        scores = week_scores(week, players)
        return JsonResponse({
            "question_id": str(question.pk),
            "correct": correct,
            "carrot_earned": first_correct,
            "explanation": question.explanation,
            "correct_answer": question.answer if not correct else None,
            "me": scores.get(request.user.pk),
            "ranking": ranking_rows(request.user, week, scores),
        }, status=201)
