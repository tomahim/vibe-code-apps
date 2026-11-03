"""Derived garden rewards from durable learner history.

A card, checkpoint, lesson and path can earn their reward once. Completion
bonuses are additive, and period membership uses the UTC completion instant.
"""
from collections import defaultdict
from datetime import datetime, timedelta, timezone as dt_timezone

from django.contrib.auth import get_user_model
from django.db.models import Count

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


def activity_stats(window_start, window_end):
    """Per-user activity counts inside [window_start, window_end).

    Counted from the recorded history itself: Cards read are CardProgress
    rows (never derived from Drops, which include lesson/path bonuses) and
    question figures count every QuestionAttempt (Carrots only count the
    first correct answer, so they cannot stand in for attempts).
    """
    card_ids = [card['pk'] for card in visible(Card).values('pk')]
    question_ids = [question['pk'] for question in visible(Question).values('pk')]
    progress = CardProgress.objects.filter(card_id__in=card_ids)
    attempts = QuestionAttempt.objects.filter(question_id__in=question_ids)
    if window_start is not None:
        progress = progress.filter(completed_at__gte=window_start, completed_at__lt=window_end)
        attempts = attempts.filter(answered_at__gte=window_start, answered_at__lt=window_end)
    stats = defaultdict(lambda: {'cards_read': 0, 'attempts': 0, 'correct': 0, 'wrong': 0})
    for row in progress.values('user_id').annotate(n=Count('pk')):
        stats[row['user_id']]['cards_read'] = row['n']
    for row in attempts.values('user_id', 'correct').annotate(n=Count('pk')):
        stats[row['user_id']]['attempts'] += row['n']
        stats[row['user_id']]['correct' if row['correct'] else 'wrong'] += row['n']
    return stats


def period_start(period, now=None):
    now = now or datetime.now(dt_timezone.utc)
    if period == 'weekly':
        return now.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=now.weekday())
    if period == 'monthly':
        return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return None


def period_window(period, offset=0, now=None):
    """[start, end) of the weekly or monthly period `offset` steps back.

    Offset 0 is the current period; overall covers all time and returns
    open bounds. Windows follow the same UTC calendar rules as period_start.
    """
    now = now or datetime.now(dt_timezone.utc)
    if period == 'weekly':
        start = period_start('weekly', now) - timedelta(weeks=offset)
        return start, start + timedelta(weeks=1)
    if period == 'monthly':
        month_index = now.year * 12 + now.month - 1 - offset
        start = datetime(month_index // 12, month_index % 12 + 1, 1, tzinfo=dt_timezone.utc)
        return start, (start.replace(day=28) + timedelta(days=7)).replace(day=1)
    return None, None


def window_label(period, window_start, window_end):
    if period == 'monthly':
        return window_start.strftime('%B %Y')
    last = window_end - timedelta(days=1)
    if last.month == window_start.month:
        return f"{window_start.strftime('%b')} {window_start.day}\u2013{last.day}"
    return f"{window_start.strftime('%b')} {window_start.day} \u2013 {last.strftime('%b')} {last.day}"


def totals(events, period='overall', now=None, offset=0):
    start, end = period_window(period, offset, now)
    result = {'drops': 0, 'carrots': 0}
    for kind, amount, at in events:
        if (start is None or at >= start) and (end is None or at < end):
            result[kind] += amount
    return result


def chart_buckets(period, now=None, events=None, offset=0):
    """Calendar buckets for the growth chart: days (weekly), weeks (monthly), months (overall).

    The window never plots the future: it stops at the bucket containing
    ``now``. Past windows (offset > 0) are fully in the past, so every bucket
    is plotted. The window also starts at the first bucket holding a reward
    event, so a young history is not padded with empty leading buckets.
    """
    now = now or datetime.now(dt_timezone.utc)
    starts = [at for user_events in (events or {}).values() for _, _, at in user_events]
    if period == 'weekly':
        start, window_end = period_window('weekly', offset, now)
        buckets = []
        day = start
        while day < window_end and day <= now:
            buckets.append((day, day + timedelta(days=1), day.strftime('%a')))
            day += timedelta(days=1)
    elif period == 'monthly':
        start, month_end = period_window('monthly', offset, now)
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


def chart(events, currency, period, rows, now=None, limit=5, offset=0):
    """Cumulative growth per bucket for the top rows (self included even below the limit)."""
    now = now or datetime.now(dt_timezone.utc)
    currency_events = {user_id: [event for event in user_events if event[0] == currency]
                       for user_id, user_events in events.items()}
    buckets = chart_buckets(period, now, currency_events, offset)
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


def leaderboard(user, currency, period, limit=20, offset=0):
    now = datetime.now(dt_timezone.utc)
    events = reward_events()
    users = list(get_user_model().objects.filter(is_active=True).order_by('pk'))
    rows = []
    for learner in users:
        score = totals(events.get(learner.pk, []), period, offset=offset)[currency]
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
    growth = chart(events, currency, period, rows, offset=offset)
    window_start, window_end = period_window(period, offset, now)
    # Every ranked row carries the same aggregated activity detail for the
    # selected window: Thomas asked to see the stats of all players, not only
    # his own. These are aggregates only; raw attempt history stays private.
    stats_by_user = activity_stats(window_start, window_end)
    for row in rows:
        row['stats'] = stats_by_user.get(
            row['user_id'], {'cards_read': 0, 'attempts': 0, 'correct': 0, 'wrong': 0})
        row.pop('user_id')
    window = None
    if window_start is not None:
        window = {'start': window_start.isoformat(), 'end': window_end.isoformat(),
                  'label': window_label(period, window_start, window_end),
                  'current': window_start <= now < window_end}
    # Whether any reward exists before this window, so the client can disable
    # the "older" arrow instead of paging into empty history.
    has_earlier = window_start is not None and any(
        at < window_start for user_events in events.values() for _, _, at in user_events)
    return {'currency': currency, 'period': period, 'timezone': 'UTC', 'offset': offset,
            'window': window, 'has_earlier': has_earlier,
            'rows': rows[:limit], 'self': next((row for row in rows if row['is_self']), None),
            'chart': growth}
