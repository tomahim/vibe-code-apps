"""Derived garden rewards from durable learner history.

A card, checkpoint, lesson and path can earn their reward once. Completion
bonuses are additive, and period membership uses the UTC completion instant.
"""
from collections import defaultdict
from datetime import datetime, timedelta, timezone as dt_timezone

from django.contrib.auth import get_user_model

from .api import visible
from .models import Card, CardProgress, LearningPath, Lesson, Question, QuestionAttempt


def reward_events():
    cards = list(visible(Card).values('pk', 'lesson_id'))
    questions = list(visible(Question).values('pk', 'lesson_id', 'after_card_position'))
    lessons = list(visible(Lesson).values('pk', 'learning_path_id'))
    paths = list(visible(LearningPath).values('pk'))
    card_by_id = {card['pk']: card for card in cards}
    question_by_id = {question['pk']: question for question in questions}
    cards_by_lesson = defaultdict(set)
    checkpoints_by_lesson = defaultdict(set)
    lessons_by_path = defaultdict(set)
    for card in cards:
        cards_by_lesson[card['lesson_id']].add(card['pk'])
    for question in questions:
        checkpoints_by_lesson[question['lesson_id']].add(question['after_card_position'])
    for lesson in lessons:
        lessons_by_path[lesson['learning_path_id']].add(lesson['pk'])

    events = defaultdict(list)
    card_times = defaultdict(dict)
    checkpoint_times = defaultdict(dict)
    for row in CardProgress.objects.filter(card_id__in=card_by_id).values('user_id', 'card_id', 'completed_at'):
        user_id, card_id, at = row['user_id'], row['card_id'], row['completed_at']
        card_times[user_id][card_id] = at
        events[user_id].append(('drops', 1, at))
    attempts = QuestionAttempt.objects.filter(question_id__in=question_by_id, correct=True).exclude(
        attempt_type=QuestionAttempt.AttemptType.REVIEW,
    ).order_by('answered_at', 'pk').values('user_id', 'question_id', 'answered_at')
    for row in attempts:
        question = question_by_id[row['question_id']]
        key = (question['lesson_id'], question['after_card_position'])
        if key not in checkpoint_times[row['user_id']]:
            at = row['answered_at']
            checkpoint_times[row['user_id']][key] = at
            events[row['user_id']].append(('carrots', 1, at))

    for user_id in set(card_times) | set(checkpoint_times):
        lesson_times = {}
        for lesson in lessons:
            lesson_id = lesson['pk']
            required_cards = cards_by_lesson[lesson_id]
            required_checkpoints = checkpoints_by_lesson[lesson_id]
            if not required_cards or not required_cards.issubset(card_times[user_id]):
                continue
            if not all((lesson_id, position) in checkpoint_times[user_id] for position in required_checkpoints):
                continue
            at = max([card_times[user_id][card_id] for card_id in required_cards] + [
                checkpoint_times[user_id][(lesson_id, position)] for position in required_checkpoints
            ])
            lesson_times[lesson_id] = at
            events[user_id].append(('drops', 5, at))
        for path in paths:
            required_lessons = lessons_by_path[path['pk']]
            if required_lessons and required_lessons.issubset(lesson_times):
                events[user_id].append(('drops', 100, max(lesson_times[lesson_id] for lesson_id in required_lessons)))
    return events


def period_start(period, now=None):
    now = now or datetime.now(dt_timezone.utc)
    if period == 'weekly':
        return now.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=now.weekday())
    if period == 'monthly':
        return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return None


def totals(events, period='overall', now=None):
    start = period_start(period, now)
    result = {'drops': 0, 'carrots': 0}
    for kind, amount, at in events:
        if start is None or at >= start:
            result[kind] += amount
    return result


def leaderboard(user, currency, period, limit=20):
    events = reward_events()
    users = list(get_user_model().objects.filter(is_active=True).order_by('pk'))
    rows = []
    for learner in users:
        score = totals(events.get(learner.pk, []), period)[currency]
        if score == 0:
            continue
        name = learner.get_full_name().strip() or getattr(learner, 'username', '') or learner.email or 'Learner'
        # An account's login identifier is not necessarily a chosen public name.
        if '@' in name:
            name = name.split('@', 1)[0]
        rows.append({'user_id': learner.pk, 'name': name, 'score': score, 'is_self': learner.pk == user.pk})
    rows.sort(key=lambda row: (-row['score'], row['user_id']))
    for index, row in enumerate(rows):
        row['rank'] = index + 1
        row.pop('user_id')
    return {'currency': currency, 'period': period, 'timezone': 'UTC',
            'rows': rows[:limit], 'self': next((row for row in rows if row['is_self']), None)}
