"""Aggregated read APIs for the Garmin stats app.

Two endpoints, both owner-scoped and JWT-protected like the hockey app:

- GET stats/overview/  - all activity types, monthly and yearly aggregates
  for the dashboard tab, plus a few "advanced" records and distributions.
- GET stats/running/   - running + trail running only: lifetime totals,
  the per-year progression for the animated story tab and running records.

Everything is computed with GROUP BY queries over garmin_activity (a few
thousand rows at most), so both endpoints answer in one round trip without
any caching layer.
"""
from datetime import timedelta

from django.db.models import Count, Max, Min, Sum
from django.db.models.functions import ExtractWeekDay, TruncMonth, TruncYear
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from apps.accounts.decorators import jwt_required

from .models import GarminActivity

# The export distinguishes flat/road "running" from "trail_running"; the
# story tab treats both as running (Thomas is a trail runner).
RUNNING_TYPES = ("running", "trail_running")

MARATHON_KM = 42.195

# Friendly labels for the activity types seen in the export; unknown types
# fall back to a title-cased version of the raw key.
TYPE_LABELS = {
    "running": "Running",
    "trail_running": "Trail running",
    "cycling": "Cycling",
    "virtual_ride": "Virtual ride",
    "road_biking": "Road biking",
    "cyclocross": "Cyclocross",
    "walking": "Walking",
    "hiking": "Hiking",
    "lap_swimming": "Swimming",
    "snorkeling": "Snorkeling",
    "resort_skiing": "Skiing",
    "snow_shoe_ws": "Snowshoeing",
    "hiit": "HIIT",
}


def _round(value, digits=1):
    if value is None:
        return 0
    return round(value, digits)


def _totals(qs):
    agg = qs.aggregate(
        count=Count("garmin_activity_id"),
        distance_m=Sum("distance_m"),
        duration_ms=Sum("duration_ms"),
        elevation_m=Sum("elevation_gain_m"),
        calories=Sum("calories"),
        steps=Sum("steps"),
    )
    return {
        "count": agg["count"] or 0,
        "km": _round((agg["distance_m"] or 0) / 1000),
        "hours": _round((agg["duration_ms"] or 0) / 3_600_000),
        "elevation_m": _round(agg["elevation_m"], 0),
        "kcal": _round(agg["calories"], 0),
        "steps": agg["steps"] or 0,
    }


def _type_label(raw):
    return TYPE_LABELS.get(raw, (raw or "other").replace("_", " ").title())


def _serialize_activity(activity, value_key):
    return {
        "garmin_activity_id": activity.garmin_activity_id,
        "name": activity.name,
        "activity_type": activity.activity_type,
        "type_label": _type_label(activity.activity_type),
        "date": activity.start_time_gmt.date().isoformat(),
        "km": _round((activity.distance_m or 0) / 1000, 2),
        "hours": _round((activity.duration_ms or 0) / 3_600_000, 2),
        "elevation_m": _round(activity.elevation_gain_m, 0),
        "highlight": {value_key: True},
    }


def _day_streaks(days):
    """Longest and current streaks of consecutive days with an activity."""
    if not days:
        return {"longest_days": 0, "current_days": 0}
    longest = run = 1
    for previous, current in zip(days, days[1:]):
        if (current - previous).days == 1:
            run += 1
            longest = max(longest, run)
        elif current != previous:
            run = 1
    from django.utils import timezone

    today = timezone.localdate()
    last = days[-1]
    current = 0
    if (today - last).days <= 1:
        current = 1
        cursor = last
        for day in reversed(days[:-1]):
            if day == cursor:
                continue
            if (cursor - day).days == 1:
                current += 1
                cursor = day
            else:
                break
    return {"longest_days": longest, "current_days": current}


@require_GET
@jwt_required
def overview(request):
    """All sports: totals, per-type, per-year, per-month and records."""
    qs = GarminActivity.objects.filter(owner=request.user)

    by_type = [
        {"type": row["activity_type"], "type_label": _type_label(row["activity_type"]),
         "count": row["count"], "km": _round((row["distance_m"] or 0) / 1000),
         "hours": _round((row["duration_ms"] or 0) / 3_600_000),
         "elevation_m": _round(row["elevation_m"], 0),
         "kcal": _round(row["calories"], 0)}
        for row in qs.values("activity_type").annotate(
            count=Count("garmin_activity_id"),
            distance_m=Sum("distance_m"),
            duration_ms=Sum("duration_ms"),
            elevation_m=Sum("elevation_gain_m"),
            calories=Sum("calories"),
        ).order_by("-count")
    ]

    by_year = [
        {"year": row["period"].year, "count": row["count"],
         "km": _round((row["distance_m"] or 0) / 1000),
         "hours": _round((row["duration_ms"] or 0) / 3_600_000),
         "elevation_m": _round(row["elevation_m"], 0),
         "kcal": _round(row["calories"], 0)}
        for row in qs.annotate(period=TruncYear("start_time_gmt")).values("period").annotate(
            count=Count("garmin_activity_id"),
            distance_m=Sum("distance_m"),
            duration_ms=Sum("duration_ms"),
            elevation_m=Sum("elevation_gain_m"),
            calories=Sum("calories"),
        ).order_by("period")
    ]

    by_year_type = [
        {"year": row["period"].year, "type": row["activity_type"],
         "count": row["count"], "km": _round((row["distance_m"] or 0) / 1000),
         "hours": _round((row["duration_ms"] or 0) / 3_600_000)}
        for row in qs.annotate(period=TruncYear("start_time_gmt"))
        .values("period", "activity_type").annotate(
            count=Count("garmin_activity_id"),
            distance_m=Sum("distance_m"),
            duration_ms=Sum("duration_ms"),
        ).order_by("period", "activity_type")
    ]

    by_month = [
        {"month": row["period"].strftime("%Y-%m"), "count": row["count"],
         "km": _round((row["distance_m"] or 0) / 1000),
         "hours": _round((row["duration_ms"] or 0) / 3_600_000),
         "elevation_m": _round(row["elevation_m"], 0)}
        for row in qs.annotate(period=TruncMonth("start_time_gmt")).values("period").annotate(
            count=Count("garmin_activity_id"),
            distance_m=Sum("distance_m"),
            duration_ms=Sum("duration_ms"),
            elevation_m=Sum("elevation_gain_m"),
        ).order_by("period")
    ]

    bounds = qs.aggregate(first=Min("start_time_gmt"), last=Max("start_time_gmt"))

    longest_distance = qs.filter(distance_m__isnull=False).order_by("-distance_m").first()
    longest_duration = qs.filter(duration_ms__isnull=False).order_by("-duration_ms").first()
    most_elevation = qs.filter(elevation_gain_m__isnull=False).order_by("-elevation_gain_m").first()
    records = {
        "longest_distance": _serialize_activity(longest_distance, "km") if longest_distance else None,
        "longest_duration": _serialize_activity(longest_duration, "hours") if longest_duration else None,
        "most_elevation": _serialize_activity(most_elevation, "elevation_m") if most_elevation else None,
    }

    best_month = None
    if by_month:
        best_month = max(by_month, key=lambda row: row["km"])

    weekday_rows = qs.annotate(weekday=ExtractWeekDay("start_time_gmt")).values("weekday").annotate(
        count=Count("garmin_activity_id")
    )
    # ExtractWeekDay: 1 = Sunday ... 7 = Saturday; re-order Monday first.
    weekday_counts = {row["weekday"]: row["count"] for row in weekday_rows}
    weekday_order = [2, 3, 4, 5, 6, 7, 1]
    weekday_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    weekdays = [
        {"weekday": name, "count": weekday_counts.get(num, 0)}
        for name, num in zip(weekday_names, weekday_order)
    ]

    days = list(
        qs.values_list("start_time_gmt__date", flat=True).distinct().order_by("start_time_gmt__date")
    )

    return JsonResponse({
        "totals": _totals(qs),
        "first_activity": bounds["first"].date().isoformat() if bounds["first"] else None,
        "last_activity": bounds["last"].date().isoformat() if bounds["last"] else None,
        "by_type": by_type,
        "by_year": by_year,
        "by_year_type": by_year_type,
        "by_month": by_month,
        "records": records,
        "best_month": best_month,
        "weekdays": weekdays,
        "streaks": _day_streaks(days),
    })


@require_GET
@jwt_required
def running(request):
    """Running only (running + trail_running): story totals and progression."""
    qs = GarminActivity.objects.filter(owner=request.user, activity_type__in=RUNNING_TYPES)

    agg = qs.aggregate(
        count=Count("garmin_activity_id"),
        distance_m=Sum("distance_m"),
        duration_ms=Sum("duration_ms"),
        elapsed_ms=Sum("elapsed_duration_ms"),
        elevation_m=Sum("elevation_gain_m"),
        calories=Sum("calories"),
        steps=Sum("steps"),
    )
    totals = {
        "runs": agg["count"] or 0,
        "km": _round((agg["distance_m"] or 0) / 1000),
        "hours": _round((agg["duration_ms"] or 0) / 3_600_000),
        "elapsed_hours": _round((agg["elapsed_ms"] or 0) / 3_600_000),
        "elevation_m": _round(agg["elevation_m"], 0),
        "kcal": _round(agg["calories"], 0),
        "steps": agg["steps"] or 0,
    }

    cumulative_km = 0.0
    cumulative_hours = 0.0
    by_year = []
    for row in qs.annotate(period=TruncYear("start_time_gmt")).values("period").annotate(
        count=Count("garmin_activity_id"),
        distance_m=Sum("distance_m"),
        duration_ms=Sum("duration_ms"),
        elevation_m=Sum("elevation_gain_m"),
    ).order_by("period"):
        km = (row["distance_m"] or 0) / 1000
        hours = (row["duration_ms"] or 0) / 3_600_000
        cumulative_km += km
        cumulative_hours += hours
        by_year.append({
            "year": row["period"].year,
            "runs": row["count"],
            "km": _round(km),
            "hours": _round(hours),
            "elevation_m": _round(row["elevation_m"], 0),
            "cumulative_km": _round(cumulative_km),
            "cumulative_hours": _round(cumulative_hours),
        })

    longest_distance = qs.filter(distance_m__isnull=False).order_by("-distance_m").first()
    longest_duration = qs.filter(duration_ms__isnull=False).order_by("-duration_ms").first()
    most_elevation = qs.filter(elevation_gain_m__isnull=False).order_by("-elevation_gain_m").first()

    marathon_plus = qs.filter(distance_m__gte=MARATHON_KM * 1000).count()

    # Best average pace over runs of at least 10 km (moving time vs distance).
    best_pace = None
    for row in qs.filter(distance_m__gte=10_000, duration_ms__gt=0).values("distance_m", "duration_ms"):
        pace = (row["duration_ms"] / 1000) / (row["distance_m"] / 1000)  # s per km
        if best_pace is None or pace < best_pace:
            best_pace = pace

    bounds = qs.aggregate(first=Min("start_time_gmt"), last=Max("start_time_gmt"))
    span_days = (bounds["last"].date() - bounds["first"].date()).days if bounds["first"] and bounds["last"] else 0

    return JsonResponse({
        "running_types": list(RUNNING_TYPES),
        "totals": totals,
        "by_year": by_year,
        "records": {
            "longest_distance": _serialize_activity(longest_distance, "km") if longest_distance else None,
            "longest_duration": _serialize_activity(longest_duration, "hours") if longest_duration else None,
            "most_elevation": _serialize_activity(most_elevation, "elevation_m") if most_elevation else None,
            "marathon_plus_count": marathon_plus,
            "best_pace_seconds_per_km": _round(best_pace, 0) if best_pace else None,
        },
        "first_run": bounds["first"].date().isoformat() if bounds["first"] else None,
        "last_run": bounds["last"].date().isoformat() if bounds["last"] else None,
        "span_days": span_days,
    })
