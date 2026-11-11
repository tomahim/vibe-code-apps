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


def cards_all_read(card_ids, read_ids):
    """The one lesson-completion rule (#465): a lesson completes once every
    one of its cards is read - a card-less lesson never completes, and
    question results never gate completion (they are separate mastery
    practice). Every backend completion site delegates here: the API gauge
    via LearnerState, the rewards, the read badges and the admin dashboard.
    """
    card_ids = list(card_ids)
    return bool(card_ids) and all(card_id in read_ids for card_id in card_ids)


class LearnerState:
    """One bounded set of queries per request, not one query per card/lesson."""
    def __init__(self, user, lesson=None, *, lessons=None, card_content=False):
        self.user_id = user.pk
        cards = visible(Card)
        questions = visible(Question)
        if lesson is not None:
            cards = cards.filter(lesson=lesson)
            questions = questions.filter(lesson=lesson)
        if lessons is not None:
            lesson_ids = [row.pk for row in lessons]
            cards = cards.filter(lesson_id__in=lesson_ids)
            questions = questions.filter(lesson_id__in=lesson_ids)
        # Summary/progression code needs identities and ordering, not the
        # library's Markdown, illustrations, prompts or answer keys. Keep the
        # full card payload opt-in for the single-lesson reader only.
        if not card_content:
            cards = cards.only("entity", "lesson", "position")
        self.cards = list(cards)
        self.questions = list(questions.only(
            "entity", "lesson", "position", "after_card_position", "type",
        ))
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
        self.last_correct = {}
        for a in attempts:  # ordered by answered_at: the last write wins
            self.last_attempt[a["question_id"]] = a["answered_at"]
            self.last_correct[a["question_id"]] = a["correct"]

    def progress(self, lessons):
        ids = {lesson.pk for lesson in lessons}
        cards = [c for c in self.cards if c.lesson_id in ids]
        questions = [q for q in self.questions if q.lesson_id in ids]
        checkpoints = {(q.lesson_id, q.after_card_position) for q in questions}
        done = sum(c.pk in self.completed for c in cards)
        correct = len(checkpoints & self.passed)
        answered = sum(q.pk in self.correct_questions for q in questions)
        # Single source of truth (#465): a lesson completes once every card is
        # read, independent of question results - lesson_fully_read owns the
        # predicate, and path completion is every lesson completed. Rotation
        # can leave pool alternatives unseen (#204), so questions never gate
        # completion. The question counts stay a separate mastery signal.
        completed_lessons = sum(self.lesson_fully_read(lesson.pk) for lesson in lessons)
        return {"lessons_completed": completed_lessons, "lessons_total": len(ids),
                "cards_completed": done, "cards_total": len(cards),
                "checkpoints_correct": correct, "checkpoints_total": len(checkpoints),
                "questions_correct": answered, "questions_total": len(questions),
                "started": bool(done or ids & self.attempted),
                "completed": bool(ids) and completed_lessons == len(ids)}

    def lesson_fully_read(self, lesson_id):
        return cards_all_read([c.pk for c in self.cards if c.lesson_id == lesson_id], self.completed)

    def lesson_started(self, lesson_id):
        return any(c.pk in self.completed
                   for c in self.cards if c.lesson_id == lesson_id)

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


def public_questions(questions):
    """Hydrate only the selected quiz/checkpoint questions, in one query.

    Selection and progress use lightweight rows. Do not let deferred prompt
    access turn rendering a quiz into one query per field per question.
    Answer keys/explanations stay in the server-side grading lookup.
    """
    questions = list(questions)
    if not questions:
        return []
    rows = {row.pk: row for row in visible(Question).filter(
        pk__in=[q.pk for q in questions],
    ).only("entity", "lesson", "position", "after_card_position", "type", "prompt", "options")}
    return [public_question(rows[q.pk]) for q in questions if q.pk in rows]


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

