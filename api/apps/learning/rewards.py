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
    lessons_by_path = defaultdict(set)
    for card in cards:
        cards_by_lesson[card['lesson_id']].add(card['pk'])
    for lesson in lessons:
        lessons_by_path[lesson['learning_path_id']].add(lesson['pk'])

    questions_by_lesson = defaultdict(set)
    for question in questions:
        questions_by_lesson[question['lesson_id']].add(question['pk'])

    events = defaultdict(list)
    card_times = defaultdict(dict)
    question_times = defaultdict(dict)
    for row in CardProgress.objects.filter(card_id__in=card_by_id).values('user_id', 'card_id', 'completed_at'):
        user_id, card_id, at = row['user_id'], row['card_id'], row['completed_at']
        card_times[user_id][card_id] = at
        events[user_id].append(('drops', 1, at))
    # A question's first correct answer, whatever its attempt type (lesson,
    # Practice quiz or review), earns one carrot and counts toward lesson
    # completion. Repeating a correct answer earns nothing more.
    attempts = QuestionAttempt.objects.filter(question_id__in=question_by_id, correct=True).order_by(
        'answered_at', 'pk',
    ).values('user_id', 'question_id', 'answered_at')
    for row in attempts:
        if row['question_id'] not in question_times[row['user_id']]:
            at = row['answered_at']
            question_times[row['user_id']][row['question_id']] = at
            events[row['user_id']].append(('carrots', 1, at))

    for user_id in set(card_times) | set(question_times):
        completion_times = {}
        for lesson in lessons:
            lesson_id = lesson['pk']
            required_cards = cards_by_lesson[lesson_id]
            required_questions = questions_by_lesson[lesson_id]
            if not required_cards or not required_cards.issubset(card_times[user_id]):
                continue
            # The lesson bonus is earned once every card is read, whatever the
            # question results: question completion drives the gauge and the
            # catch-up quiz (#204), not this reward.
            cards_done_at = max(card_times[user_id][card_id] for card_id in required_cards)
            events[user_id].append(('drops', 5, cards_done_at))
            # The path bonus still needs full lesson completion: every question
            # answered correctly once (#204), not only one per checkpoint.
            if required_questions.issubset(question_times[user_id]):
                completion_times[lesson_id] = max([cards_done_at] + [
                    question_times[user_id][question_id] for question_id in required_questions
                ])
        for path in paths:
            required_lessons = lessons_by_path[path['pk']]
            if required_lessons and required_lessons.issubset(completion_times):
                events[user_id].append(('drops', 100, max(completion_times[lesson_id] for lesson_id in required_lessons)))
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


def chart_buckets(period, now=None, events=None):
    """Calendar buckets for the growth chart: days (weekly), weeks (monthly), months (overall).

    The window never plots the future: it stops at the bucket containing
    ``now``. It also starts at the first bucket holding a reward event, so a
    young history is not padded with empty leading buckets.
    """
    now = now or datetime.now(dt_timezone.utc)
    starts = [at for user_events in (events or {}).values() for _, _, at in user_events]
    if period == 'weekly':
        start = period_start('weekly', now)
        buckets = []
        day = start
        while day <= now:
            buckets.append((day, day + timedelta(days=1), day.strftime('%a')))
            day += timedelta(days=1)
    elif period == 'monthly':
        start = period_start('monthly', now)
        month_end = (start.replace(day=28) + timedelta(days=7)).replace(day=1)
        buckets = []
        # Calendar weeks run Monday to Sunday, clipped to the month.
        monday = start - timedelta(days=start.weekday())
        cursor = monday
        while cursor < month_end and cursor <= now:
            end = min(cursor + timedelta(days=7), month_end)
            begin = max(cursor, start)
            last_day = end - timedelta(days=1)
            label = (f"{begin.strftime('%b')} {begin.day}" if begin == last_day
                     else f"{begin.strftime('%b')} {begin.day}\u2013{last_day.day}")
            buckets.append((begin, end, label))
            cursor += timedelta(days=7)
    else:
        first = min(starts).replace(day=1, hour=0, minute=0, second=0, microsecond=0) if starts else period_start('monthly', now)
        buckets = []
        cursor = first
        current_month = period_start('monthly', now)
        while cursor <= current_month:
            end = (cursor.replace(day=28) + timedelta(days=7)).replace(day=1)
            label = cursor.strftime('%b') if cursor.year == now.year else cursor.strftime("%b '%y")
            buckets.append((cursor, end, label))
            cursor = end
    if period != 'overall' and starts:
        first_in_window = min((at for at in starts if at >= buckets[0][0]), default=None)
        while first_in_window is not None and len(buckets) > 1 and buckets[0][1] <= first_in_window:
            buckets.pop(0)
    return buckets


def chart(events, currency, period, rows, now=None, limit=5):
    """Cumulative growth per bucket for the top rows (self included even below the limit)."""
    now = now or datetime.now(dt_timezone.utc)
    currency_events = {user_id: [event for event in user_events if event[0] == currency]
                       for user_id, user_events in events.items()}
    buckets = chart_buckets(period, now, currency_events)
    series_rows = list(rows[:limit])
    self_row = next((row for row in rows if row['is_self']), None)
    if self_row and self_row not in series_rows:
        series_rows.append(self_row)
    start = buckets[0][0]
    series = []
    for row in series_rows:
        points = []
        total = 0
        ordered = sorted((at, amount) for kind, amount, at in events.get(row['user_id'], []) if kind == currency)
        index = 0
        for _, end, _ in buckets:
            while index < len(ordered) and ordered[index][0] < end:
                at, amount = ordered[index]
                if at >= start:
                    total += amount
                index += 1
            points.append(total)
        series.append({'name': row['name'], 'is_self': row['is_self'], 'points': points})
    return {'period': period,
            'buckets': [{'label': label, 'start': begin.isoformat(), 'end': end.isoformat(),
                         'current': begin <= now < end}
                        for begin, end, label in buckets],
            'series': series}


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
    growth = chart(events, currency, period, rows)
    for row in rows:
        row.pop('user_id')
    return {'currency': currency, 'period': period, 'timezone': 'UTC',
            'rows': rows[:limit], 'self': next((row for row in rows if row['is_self']), None),
            'chart': growth}
