"""Collectible garden badges: evaluated from learner history, then kept.

Each badge (see badge_catalog.py) is a rule over CardProgress and
QuestionAttempt rows, plus the current content tree for the "finish a whole
lesson, path or theme" badges. A rule returns the sorted (time, reference)
events that qualify, so one list gives the progress (how many so far), the
achievement date (the moment the target-th event happened, never "now") and
the evidence (what qualified).

Awards are persisted (BadgeAward) the first time a check sees a badge earned,
so later content changes, archiving or rule tweaks never take one away and
earned_at / evidence stay as first recorded. Checks run only when the client
asks (app load, leaving a lesson or quiz, opening the badges tab), never on
card or answer writes and never in the background.
"""
from collections import defaultdict
from datetime import datetime, timedelta, timezone as dt_timezone
from zoneinfo import ZoneInfo

from django.contrib.auth import get_user_model
from django.db import transaction

from .api import visible
from .badge_catalog import BADGES, MONTH, WEEK, TIERS  # noqa: F401 (re-exported for tests)
from .models import (BadgeAward, Card, CardProgress, ChallengeWeek, LearningPath, Lesson,
                     Question, QuestionAttempt, Theme)

NEW_WINDOW = timedelta(days=7)
PARIS = ZoneInfo("Europe/Paris")


def paris_day(at):
    """The Europe/Paris calendar day of a recorded moment. Streak days follow
    the learner's own day (midnight in Paris, DST-aware), unlike weeks which
    stay Monday to Sunday UTC."""
    return at.astimezone(PARIS).date()
TYPED = Question.Type.TYPE_ANSWER_QUESTION


def week_start(at):
    return (at - timedelta(days=at.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)


class History:
    """One learner's recorded history, loaded in a handful of queries."""

    def __init__(self, user):
        self.user = user
        lessons = dict(Lesson.objects.values_list("pk", "learning_path_id"))
        paths = dict(LearningPath.objects.values_list("pk", "theme_id"))
        card_lesson = dict(Card.objects.values_list("pk", "lesson_id"))
        questions = {pk: (lesson, typed) for pk, lesson, typed in
                     Question.objects.values_list("pk", "lesson_id", "type")}
        self.lesson_path, self.path_theme = lessons, paths
        self.card_times = {}  # card -> read time
        for card_id, at in CardProgress.objects.filter(user=user).values_list("card_id", "completed_at"):
            if card_id in card_lesson:
                self.card_times[card_id] = at
        self.card_lesson = {card_id: card_lesson[card_id] for card_id in self.card_times}
        self.attempts = defaultdict(list)  # question -> [(time, type, correct)] in order
        for question_id, attempt_type, correct, at in QuestionAttempt.objects.filter(user=user).order_by(
            "answered_at", "pk",
        ).values_list("question_id", "attempt_type", "correct", "answered_at"):
            if question_id in questions:
                self.attempts[question_id].append((at, attempt_type, correct))
        self.question_info = questions
        self.first_correct = {q: next(at for at, _, ok in rows if ok)
                              for q, rows in self.attempts.items() if any(ok for _, _, ok in rows)}
        # A day counts toward a streak with a card read or a correct answer.
        self.active_times = sorted(
            list(self.card_times.values())
            + [at for rows in self.attempts.values() for at, _, ok in rows if ok])
        # Current content tree, for completion rules.
        self.cards_of = defaultdict(set)
        for card_id, lesson_id in visible(Card).values_list("pk", "lesson_id"):
            self.cards_of[lesson_id].add(card_id)
        self.questions_of = defaultdict(set)
        for question_id, lesson_id in visible(Question).values_list("pk", "lesson_id"):
            self.questions_of[lesson_id].add(question_id)
        self.lessons_of = defaultdict(set)
        for lesson_id, path_id in visible(Lesson).values_list("pk", "learning_path_id"):
            self.lessons_of[path_id].add(lesson_id)
        self.paths_of = defaultdict(set)
        for path_id, theme_id in visible(LearningPath).values_list("pk", "theme_id"):
            self.paths_of[theme_id].add(path_id)

    # Qualifying events, each a (time, reference) pair sorted by time. The
    # reference names what qualified, so the badge can show its evidence.
    def cards(self, **_):
        return sorted((at, ("card", pk)) for pk, at in self.card_times.items())

    def weeks(self, **_):
        first = {}
        for at in list(self.card_times.values()) + [row[0] for rows in self.attempts.values() for row in rows]:
            week = week_start(at)
            if week not in first or at < first[week]:
                first[week] = at
        return sorted((at, ("week", week)) for week, at in first.items())

    def day_events(self):
        """The first qualifying activity of each active Paris day, sorted."""
        first = {}
        for at in self.active_times:
            day = paris_day(at)
            if day not in first or at < first[day]:
                first[day] = at
        return [(first[day], day) for day in sorted(first)]

    def streak(self, **_):
        """Days that set a new longest run of consecutive active days.

        Each event is the first activity of a day that grew the all-time
        best run, so the event count is the best streak ever reached and
        the target-th event happened the day the streak first hit the
        target. Streaks read the whole history; a missed day only stops
        new records, it never erases an earned badge."""
        events = []
        best = 0
        run = 0
        previous = None
        for at, day in self.day_events():
            run = run + 1 if previous is not None and (day - previous).days == 1 else 1
            if run > best:
                best = run
                events.append((at, ("day", day)))
            previous = day
        return events

    def current_streak(self, today):
        """(days, lit) for the header: the run ending today once today is
        active, else the frozen run ending yesterday while today still has
        no qualifying activity. (0, False) when the streak is broken."""
        days = {day for _, day in self.day_events()}
        if today in days:
            end, lit = today, True
        elif today - timedelta(days=1) in days:
            end, lit = today - timedelta(days=1), False
        else:
            return 0, False
        count = 0
        day = end
        while day in days:
            count += 1
            day -= timedelta(days=1)
        return count, lit

    def streak_stats(self, today):
        """The streak payload for the header and its panel: the current
        run, whether today already qualifies, the activity during the run
        (distinct cards read and questions answered correctly) and the
        best run ever."""
        days, lit = self.current_streak(today)
        best = len(self.streak())
        if not days:
            return {"days": 0, "lit": False, "cards": 0, "questions": 0, "best": best}
        end = today if lit else today - timedelta(days=1)
        start = end - timedelta(days=days - 1)
        cards = sum(1 for at in self.card_times.values() if start <= paris_day(at) <= end)
        questions = sum(1 for rows in self.attempts.values()
                        if any(ok and start <= paris_day(at) <= end for at, _, ok in rows))
        return {"days": days, "lit": lit, "cards": cards, "questions": questions, "best": best}

    def correct(self, typed=None, **_):
        return sorted((at, ("question", q)) for q, at in self.first_correct.items()
                      if typed is None or (self.question_info[q][1] == TYPED) == typed)

    def recovered(self, **_):
        events = []
        for q, rows in self.attempts.items():
            wrong = next((at for at, _, ok in rows if not ok), None)
            if wrong is not None:
                fixed = next((at for at, _, ok in rows if ok and at > wrong), None)
                if fixed is not None:
                    events.append((fixed, ("question", q)))
        return sorted(events)

    def review(self, **_):
        return sorted((min(at for at, kind, ok in rows if ok and kind == "review"), ("question", q))
                      for q, rows in self.attempts.items()
                      if any(ok and kind == "review" for _, kind, ok in rows))

    def gap(self, gap, **_):
        events = []
        for q, rows in self.attempts.items():
            correct = [(at, kind) for at, kind, ok in rows if ok]
            hit = next((at for at, kind in correct if kind == "review"
                        and any(at - earlier >= gap for earlier, _ in correct)), None)
            if hit is not None:
                events.append((hit, ("question", q)))
        return sorted(events)

    def spaced(self, **_):
        events = []
        for q, rows in self.attempts.items():
            picked = []
            for at, _, ok in rows:
                if ok and (not picked or at - picked[-1] >= WEEK):
                    picked.append(at)
                    if len(picked) == 3:
                        events.append((at, ("question", q)))
                        break
        return sorted(events)

    def challenge_wins(self, **_):
        """Each weekly Challenge won: revealed ranking (every participant
        finished, at least two played), strictly ahead of every other
        participant, with at least the minimum correct. Ties are not wins.
        The event time is the week's reveal moment."""
        from .challenge import CHALLENGE_MIN_WIN, week_scores  # late import: challenge needs no badges
        events = []
        for week in ChallengeWeek.objects.prefetch_related("attempts"):
            scores = week_scores(week)
            mine = scores.get(self.user.pk)
            if not mine or len(scores) < 2 or not all(e["finished"] for e in scores.values()):
                continue
            others = [e["correct"] for uid, e in scores.items() if uid != self.user.pk]
            if mine["correct"] >= CHALLENGE_MIN_WIN and mine["correct"] > max(others):
                revealed_at = max(a.answered_at for a in week.attempts.all())
                events.append((revealed_at, ("challenge", week.week_key)))
        return sorted(events)

    def area(self, level, cards, **_):
        counts = defaultdict(list)
        for card_id, at in self.card_times.items():
            path = self.lesson_path.get(self.card_lesson[card_id])
            area = path if level == "path" else self.path_theme.get(path)
            counts[area].append(at)
        return sorted((sorted(times)[cards - 1], (level, area)) for area, times in counts.items() if len(times) >= cards)

    def lesson_read_at(self, lesson_id):
        cards = self.cards_of[lesson_id]
        if cards and cards.issubset(self.card_times):
            return max(self.card_times[c] for c in cards)

    def lesson_done_at(self, lesson_id):
        read = self.lesson_read_at(lesson_id)
        questions = self.questions_of[lesson_id]
        if read and questions and questions.issubset(self.first_correct):
            return max([read] + [self.first_correct[q] for q in questions])

    def lessons_read(self, **_):
        return sorted((at, ("lesson", lesson)) for lesson in list(self.cards_of) if (at := self.lesson_read_at(lesson)))

    def lessons_done(self, **_):
        return sorted((at, ("lesson", lesson)) for lesson in list(self.questions_of) if (at := self.lesson_done_at(lesson)))

    def first_try(self, **_):
        events = []
        for lesson_id, questions in list(self.questions_of.items()):
            read = self.lesson_read_at(lesson_id)
            if not read or len(questions) < 8:
                continue
            if all(self.attempts.get(q) and self.attempts[q][0][2] for q in questions):
                events.append((max([read] + [self.attempts[q][0][0] for q in questions]), ("lesson", lesson_id)))
        return sorted(events)

    def path_at(self, path_id, with_questions):
        """When a path was fully read (or, with questions, fully completed:
        every lesson done, lessons without questions counting once read)."""
        lessons = self.lessons_of[path_id]
        times = [self.lesson_read_at(lesson) for lesson in lessons]
        if with_questions:
            times = [self.lesson_done_at(lesson) or (None if self.questions_of[lesson] else read)
                     for lesson, read in zip(lessons, times)]
        if with_questions and not any(self.questions_of[lesson] for lesson in lessons):
            return None  # like Clean patch, a path needs questions to be "answered"
        if lessons and all(times):
            return max(times)

    def paths_read(self, **_):
        return sorted((at, ("path", p)) for p in list(self.lessons_of) if (at := self.path_at(p, False)))

    def paths_done(self, **_):
        return sorted((at, ("path", p)) for p in list(self.lessons_of) if (at := self.path_at(p, True)))

    def themes_done(self, **_):
        events = []
        for theme, paths in self.paths_of.items():
            if len(paths) >= 2:
                done = [self.path_at(p, True) for p in paths]
                if all(done):
                    events.append((max(done), ("theme", theme)))
        return sorted(events)

    def labels(self, refs):
        """Human names for the references shown as evidence."""
        wanted = defaultdict(set)
        for kind, key in refs:
            wanted[kind].add(key)
        models = {"card": Card, "lesson": Lesson, "path": LearningPath, "theme": Theme}
        names = {}
        for kind, model in models.items():
            if wanted[kind]:
                names.update({(kind, pk): title for pk, title in
                              model.objects.filter(pk__in=wanted[kind]).values_list("pk", "title")})
        if wanted["question"]:
            names.update({("question", pk): prompt for pk, prompt in
                          Question.objects.filter(pk__in=wanted["question"]).values_list("pk", "prompt")})
        for week in wanted["week"]:
            names[("week", week)] = f"Week of {week.strftime('%b')} {week.day}, {week.year}"
        for day in wanted["day"]:
            names[("day", day)] = f"{day.strftime('%b')} {day.day}, {day.year}"
        return {ref: shorten(names.get(ref, "")) for ref in refs}


def shorten(text, limit=90):
    text = " ".join(text.split())
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "\u2026"


def evaluate(history, badge):
    """(events, earned) for one badge from current history."""
    events = getattr(history, badge.kind)(**badge.params)
    return events, len(events) >= badge.target


def check(user, now=None):
    """Award every newly earned badge (idempotent), then return the collection.

    Existing awards are never touched: earned_at and evidence stay as first
    recorded. A concurrent check can only lose the unique (user, badge)
    insert, which is ignored.
    """
    now = now or datetime.now(dt_timezone.utc)
    stored = {award.badge: award for award in BadgeAward.objects.filter(user=user)}
    history = History(user)
    streak = history.streak_stats(paris_day(now))
    evaluated = {badge.slug: evaluate(history, badge) for badge in BADGES}
    fresh = []
    for badge in BADGES:
        events, earned = evaluated[badge.slug]
        if earned and badge.slug not in stored:
            # Small targets list everything that qualified; big ones name the
            # event that completed the badge.
            shown = events[:badge.target] if badge.target <= 3 else events[badge.target - 1:badge.target]
            fresh.append((badge, events[badge.target - 1][0], shown))
    if fresh:
        names = history.labels({ref for _, _, shown in fresh for _, ref in shown})
        with transaction.atomic():
            BadgeAward.objects.bulk_create([
                BadgeAward(user=user, badge=badge.slug, earned_at=at,
                           evidence=[names[ref] for _, ref in shown if names[ref]])
                for badge, at, shown in fresh], ignore_conflicts=True)
        stored = {award.badge: award for award in BadgeAward.objects.filter(user=user)}
    return present(stored, evaluated, now, streak)


def present(stored, evaluated, now, streak):
    rows = []
    for badge in BADGES:
        events, _ = evaluated[badge.slug]
        award = stored.get(badge.slug)
        rows.append({
            "slug": badge.slug, "name": badge.name, "family": badge.family, "tier": badge.tier,
            "explanation": badge.explanation, "target": badge.target,
            "progress": badge.target if award else min(len(events), badge.target),
            "earned": award is not None,
            "earned_at": award.earned_at.isoformat() if award else None,
            "new": award is not None and now - award.earned_at <= NEW_WINDOW,
            "evidence": list(award.evidence) if award else [],
            "evidence_is_last": badge.target > 3,
        })
    return {
        "badges": rows,
        "earned_count": sum(row["earned"] for row in rows),
        "new_count": sum(row["new"] for row in rows),
        "streak": streak,
    }


def best_run(day_events):
    """(days, start, end) of the longest run of consecutive active days.

    Derived from recorded activity, never stored. Ties go to the most
    recent run."""
    best = (0, None, None)
    run = 0
    run_start = None
    previous = None
    for _, day in day_events:
        if previous is not None and (day - previous).days == 1:
            run += 1
        else:
            run = 1
            run_start = day
        if run >= best[0]:
            best = (run, run_start, day)
        previous = day
    return best


def player_badges(history):
    """Rule-derived earned badges for one learner: [(earned_at, badge)] sorted.

    Nothing is persisted here: this is the same evaluation check() applies,
    so a player who never triggered a check still gets their real count and
    dates from recorded history alone."""
    earned = []
    for badge in BADGES:
        events, has = evaluate(history, badge)
        if has:
            earned.append((events[badge.target - 1][0], badge))
    return sorted(earned, key=lambda item: item[0])


def month_starts(first, now):
    """Month starts from the month of `first` up to now's month, inclusive."""
    cursor = first.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    while cursor <= last:
        yield cursor
        cursor = (cursor.replace(day=28) + timedelta(days=7)).replace(day=1)


def badges_leaderboard(user, limit=20):
    """Aggregate badge and streak fun stats per player, same audience and
    aggregates-only rule as the drops/carrots leaderboard: names, counts and
    dates, never raw history. Everything is derived from existing records;
    no new tables, no writes."""
    now = datetime.now(dt_timezone.utc)
    today = paris_day(now)
    rows = []
    earned_by_user = {}
    for learner in get_user_model().objects.filter(is_active=True).order_by("pk"):
        history = History(learner)
        earned = player_badges(history)
        if not earned and not history.active_times:
            continue  # like a zero score on the other tabs: never played
        length, start, end = best_run(history.day_events())
        days, lit = history.current_streak(today)
        attempts = [(at, ok) for rows_ in history.attempts.values() for at, _, ok in rows_]
        correct = sum(1 for _, ok in attempts if ok)
        name = learner.get_full_name().strip() or getattr(learner, "username", "") or learner.email or "Learner"
        # An account's login identifier is not necessarily a chosen public name.
        if "@" in name:
            name = name.split("@", 1)[0]
        earned_by_user[learner.pk] = earned
        rows.append({
            "user_id": learner.pk,
            "name": name,
            "is_self": learner.pk == user.pk,
            "badges": len(earned),
            "latest_badge": {"name": earned[-1][1].name, "earned_at": earned[-1][0].isoformat()} if earned else None,
            "longest_streak": {"days": length,
                               "start": start.isoformat() if start else None,
                               "end": end.isoformat() if end else None},
            "current_streak": {"days": days, "lit": lit},
            "cards_read": len(history.card_times),
            "correct": correct,
            "attempts": len(attempts),
            "accuracy": round(100 * correct / len(attempts)) if attempts else None,
        })
    rows.sort(key=lambda row: (-row["badges"], -row["longest_streak"]["days"], row["user_id"]))
    for index, row in enumerate(rows):
        row["rank"] = index + 1
    # Badge growth, month by month: cumulative earned badges per player.
    first = min((at for earned in earned_by_user.values() for at, _ in earned), default=None)
    series = []
    buckets = []
    if first is not None:
        months = list(month_starts(first, now))
        buckets = [{"label": m.strftime("%b") if m.year == now.year else m.strftime("%b '%y"),
                    "start": m.isoformat(),
                    "end": (m.replace(day=28) + timedelta(days=7)).replace(day=1).isoformat(),
                    "current": m.year == now.year and m.month == now.month} for m in months]
        for row in rows:
            dates = sorted(at for at, _ in earned_by_user[row["user_id"]])
            points = [sum(1 for at in dates if at < datetime.fromisoformat(bucket["end"])) for bucket in buckets]
            series.append({"name": row["name"], "is_self": row["is_self"], "points": points})
    for row in rows:
        row.pop("user_id")
    return {"timezone": "UTC", "rows": rows[:limit],
            "self": next((row for row in rows if row["is_self"]), None),
            "chart": {"period": "overall", "buckets": buckets, "series": series}}
