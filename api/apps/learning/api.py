"""Learner-facing representations. Answer keys and publishing metadata stay private."""
from .models import Card, CardProgress, LearningPath, Lesson, Question, QuestionAttempt, Theme


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
    return model.objects.filter(**filters)


def described(row):
    return {
        "id": str(row.pk), "title": row.title, "description": row.description,
        "position": row.position, "image_path": row.image_path, "image_alt": row.image_alt,
        "introduction_markdown": row.introduction_markdown,
    }


class LearnerState:
    """One bounded set of queries per request, not one query per card/lesson."""
    def __init__(self, user):
        self.user_id = user.pk
        self.cards = list(visible(Card))
        self.questions = list(visible(Question))
        self.completed = dict(CardProgress.objects.filter(
            user=user, card__in=self.cards,
        ).values_list("card_id", "completed_at"))
        attempts = list(QuestionAttempt.objects.filter(user=user, question__in=self.questions)
                        .values("question_id", "correct", "attempt_type"))
        questions = {q.pk: q for q in self.questions}
        self.passed = {(questions[a["question_id"]].lesson_id,
                        questions[a["question_id"]].after_card_position)
                       for a in attempts if a["correct"] and a["attempt_type"] != "review"}
        self.attempted = {questions[a["question_id"]].lesson_id for a in attempts}

    def progress(self, lessons):
        ids = {lesson.pk for lesson in lessons}
        cards = [c for c in self.cards if c.lesson_id in ids]
        checkpoints = {(q.lesson_id, q.after_card_position) for q in self.questions if q.lesson_id in ids}
        done = sum(c.pk in self.completed for c in cards)
        correct = len(checkpoints & self.passed)
        return {"cards_completed": done, "cards_total": len(cards),
                "checkpoints_correct": correct, "checkpoints_total": len(checkpoints),
                "started": bool(done or ids & self.attempted),
                "completed": bool(cards) and done == len(cards) and correct == len(checkpoints)}


def lesson_summary(lesson, state):
    return {**described(lesson), "learning_path_id": str(lesson.learning_path_id),
            "progress": state.progress([lesson])}


def checkpoint_questions(state, lesson):
    """Stable selection per learner/checkpoint; no answer-key-dependent selection."""
    import hashlib
    pools = {}
    for question in state.questions:
        if question.lesson_id == lesson.pk:
            pools.setdefault(question.after_card_position, []).append(question)
    return [min(pool, key=lambda q: hashlib.sha256(
        f"{state.user_id}:{lesson.pk}:{position}:{q.pk}".encode(),
    ).digest()) for position, pool in sorted(pools.items())]


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
