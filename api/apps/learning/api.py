"""Learner-facing representations. Answer keys and publishing metadata stay private."""
from collections import Counter
from .models import Card, CardProgress, LearningPath, Lesson, Question, QuestionAttempt, Theme
from .images import image_url


PARENTS = {
    Theme: [], LearningPath: ["theme"],
    Lesson: ["learning_path", "learning_path__theme"],
    Card: ["lesson", "lesson__learning_path", "lesson__learning_path__theme"],
    Question: ["lesson", "lesson__learning_path", "lesson__learning_path__theme"],
}


def visible(model):
    filters = {"published": True, "entity__archived": False}
    for parent in PARENTS[model]:
        filters[f"{parent}__published"] = True
        filters[f"{parent}__entity__archived"] = False
    rows = model.objects.filter(**filters)
    if model == Question:
        from django.db.models import Exists, OuterRef
        rows = rows.filter(Exists(visible(Card).filter(
            lesson_id=OuterRef("lesson_id"), position=OuterRef("after_card_position"),
        )))
    return rows


def described(row):
    return {
        "id": str(row.pk), "title": row.title, "description": row.description,
        "position": row.position, "image_path": row.image_path, "image_alt": row.image_alt,
        "image_url": image_url(row),
        "introduction_markdown": row.introduction_markdown,
    }


class LearnerState:
    """One bounded set of queries per request, not one query per card/lesson."""
    def __init__(self, user, lesson=None):
        self.user_id = user.pk
        cards = visible(Card)
        questions = visible(Question)
        if lesson is not None:
            cards = cards.filter(lesson=lesson)
            questions = questions.filter(lesson=lesson)
        self.cards = list(cards)
        self.questions = list(questions)
        self.completed = dict(CardProgress.objects.filter(
            user=user, card__in=self.cards,
        ).values_list("card_id", "completed_at"))
        attempts = list(QuestionAttempt.objects.filter(user=user, question__in=self.questions)
                        .values("question_id", "correct", "attempt_type", "answered_at"))
        questions = {q.pk: q for q in self.questions}
        self.passed = {(questions[a["question_id"]].lesson_id,
                        questions[a["question_id"]].after_card_position)
                       for a in attempts if a["correct"] and a["attempt_type"] != "review"}
        # A question counts as answered once it has one correct attempt of any
        # type, review included: the gauge means "ever answered correctly".
        self.correct_questions = {a["question_id"] for a in attempts if a["correct"]}
        self.wrong_counts = Counter(
            (questions[a["question_id"]].lesson_id, questions[a["question_id"]].after_card_position,
             questions[a["question_id"]].type)
            for a in attempts if not a["correct"]
        )
        self.attempted = {questions[a["question_id"]].lesson_id for a in attempts}
        self.last_attempt = {}
        for a in attempts:  # ordered by answered_at: the last write wins
            self.last_attempt[a["question_id"]] = a["answered_at"]

    def progress(self, lessons):
        ids = {lesson.pk for lesson in lessons}
        cards = [c for c in self.cards if c.lesson_id in ids]
        questions = [q for q in self.questions if q.lesson_id in ids]
        checkpoints = {(q.lesson_id, q.after_card_position) for q in questions}
        done = sum(c.pk in self.completed for c in cards)
        correct = len(checkpoints & self.passed)
        answered = sum(q.pk in self.correct_questions for q in questions)
        # A lesson completes once every card is read and every question has one
        # correct answer: rotation can leave pool alternatives unseen (#204).
        completed_lessons = sum(
            bool(lesson_cards := [c for c in cards if c.lesson_id == lesson.pk])
            and all(c.pk in self.completed for c in lesson_cards)
            and all(q.pk in self.correct_questions for q in questions if q.lesson_id == lesson.pk)
            for lesson in lessons
        )
        return {"lessons_completed": completed_lessons, "lessons_total": len(ids),
                "cards_completed": done, "cards_total": len(cards),
                "checkpoints_correct": correct, "checkpoints_total": len(checkpoints),
                "questions_correct": answered, "questions_total": len(questions),
                "started": bool(done or ids & self.attempted),
                "completed": bool(ids) and completed_lessons == len(ids)}

    def lesson_fully_read(self, lesson_id):
        cards = [c for c in self.cards if c.lesson_id == lesson_id]
        return bool(cards) and all(c.pk in self.completed for c in cards)

    def catch_up_questions(self, lessons):
        """Questions of fully read lessons with no correct answer yet: never
        attempted or only answered wrong. The catch-up quiz closes those gaps."""
        return [q for lesson in lessons if self.lesson_fully_read(lesson.pk)
                for q in self.questions
                if q.lesson_id == lesson.pk and q.pk not in self.correct_questions]


def lesson_summary(lesson, state):
    return {**described(lesson), "learning_path_id": str(lesson.learning_path_id),
            "progress": state.progress([lesson])}


def checkpoint_questions(state, lesson):
    """Rotate alternatives after wrong attempts, stably across requests."""
    import hashlib
    lesson_completed = state.progress([lesson])["completed"]
    pools = {}
    for question in state.questions:
        if question.lesson_id == lesson.pk:
            pools.setdefault(question.after_card_position, []).append(question)
    selected = []
    for position, pool in sorted(pools.items()):
        types = {question.type for question in pool}
        preferred = (Question.Type.TYPE_ANSWER_QUESTION
                     if lesson_completed and Question.Type.TYPE_ANSWER_QUESTION in types
                     else Question.Type.MULTIPLE_CHOICE if Question.Type.MULTIPLE_CHOICE in types
                     else Question.Type.TYPE_ANSWER_QUESTION)
        pool = [question for question in pool if question.type == preferred]
        ranked = sorted(pool, key=lambda q: hashlib.sha256(
            f"{state.user_id}:{lesson.pk}:{position}:{q.pk}".encode(),
        ).digest())
        selected.append(ranked[state.wrong_counts[lesson.pk, position, preferred] % len(ranked)])
    return selected


def public_question(question):
    return {"id": str(question.pk), "lesson_id": str(question.lesson_id),
            "position": question.position, "after_card_position": question.after_card_position,
            "type": question.type, "prompt": question.prompt,
            "options": [{"id": o["id"], "text": o["text"]} for o in question.options]}


def next_step(state, lesson):
    questions = {q.after_card_position: q for q in checkpoint_questions(state, lesson)}
    for card in (c for c in state.cards if c.lesson_id == lesson.pk):
        if card.pk not in state.completed:
            return {"type": "card", "id": str(card.pk)}
        if card.position in questions and (lesson.pk, card.position) not in state.passed:
            return {"type": "question", "id": str(questions[card.position].pk)}
    return None


def json_object(request, allowed):
    import json
    from django.core.exceptions import RequestDataTooBig, ValidationError
    from apps.accounts.views import same_origin
    if not same_origin(request):
        raise ValidationError("Cross-origin request refused.", code="origin")
    if request.content_type != "application/json":
        raise ValidationError("Use application/json.", code="media")
    try:
        body = request.body
        if len(body) > 4096:
            raise ValidationError("Request body is too large.")
        data = json.loads(body)
    except (ValueError, UnicodeDecodeError, RequestDataTooBig):
        raise ValidationError("Invalid JSON.") from None
    if not isinstance(data, dict) or set(data) - set(allowed):
        raise ValidationError("Provide a JSON object with only the documented fields.")
    return data


def input_error(exc):
    from django.http import JsonResponse
    return JsonResponse({"error": exc.messages[0]}, status={"origin": 403, "media": 415}.get(exc.code, 400))


def lock_learner(user):
    # Serialize writes by learner, including first attempts with no existing rows.
    # PostgreSQL row locks, unlike process-local locks, work across API workers.
    type(user).objects.select_for_update().get(pk=user.pk)

