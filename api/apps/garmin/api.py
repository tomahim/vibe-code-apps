"""Bulk-import JSON API for Garmin export datasets.

All endpoints except health require the shared JWT sign-in. Every import is
idempotent (upsert on natural keys).
The loader script (api/scripts/garmin_export_import.py) posts raw export
records; mapping.py owns all field and unit conversion.
"""
import json
from datetime import timedelta

from django.db import transaction
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from apps.accounts.decorators import jwt_required

from . import mapping
from .models import (
    GarminActivity, GarminActivityFile, GarminActivitySplit,
    GarminActivitySplitSummary,
)

MATCH_WINDOW = timedelta(seconds=5)


def err(message, status=400):
    return JsonResponse({"error": message}, status=status)


def health(request):
    return JsonResponse({"ok": True, "app": "garmin"})


def _records(request):
    try:
        body = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return None, err("Invalid JSON body.")
    records = body.get("records") if isinstance(body, dict) else body
    if not isinstance(records, list):
        return None, err('Expected {"records": [...]} or a JSON array.')
    return records, None


def _bulk_upsert(model, objects, unique_fields, update_fields):
    if not objects:
        return 0
    model.objects.bulk_create(
        objects,
        batch_size=500,
        update_conflicts=True,
        unique_fields=unique_fields,
        update_fields=update_fields,
    )
    return len(objects)


def _import_view(dataset):
    def view(request):
        records, error = _records(request)
        if error:
            return error
        written = IMPORTERS[dataset](request.user, records)
        return JsonResponse(
            {"ok": True, "dataset": dataset, "received": len(records),
             "written": written}
        )

    return view


def _import_activities(user, records):
    with transaction.atomic():
        for rec in records:
            activity = mapping.map_activity(rec, user)
            defaults = {
                f.name: getattr(activity, f.name)
                for f in activity._meta.fields
                if f.name not in ("garmin_activity_id", "created_at", "updated_at")
            }
            GarminActivity.objects.update_or_create(
                garmin_activity_id=activity.garmin_activity_id, defaults=defaults
            )
            GarminActivitySplit.objects.filter(activity=activity).delete()
            GarminActivitySplitSummary.objects.filter(activity=activity).delete()
            GarminActivitySplit.objects.bulk_create(
                [mapping.map_split(s, activity) for s in rec.get("splits") or []]
            )
            GarminActivitySplitSummary.objects.bulk_create(
                [mapping.map_split_summary(s, activity) for s in rec.get("splitSummaries") or []]
            )
    return len(records)


def _import_activity_files(user, records):
    """Link original .FIT files to activities by unique start-timestamp match.

    FIT filename ids are not activity ids. A file attaches only when exactly
    one of the owner's activities starts within +/-5s of the FIT session
    start; zero or several candidates -> orphan/ambiguous, never a guess.
    """
    window = {}
    starts = [mapping._any_epoch(r.get("session_start_time_gmt")) for r in records]
    candidates = GarminActivity.objects.filter(owner=user).only(
        "garmin_activity_id", "start_time_gmt"
    )
    for a in candidates:
        window.setdefault(a.start_time_gmt, []).append(a.garmin_activity_id)
    written = 0
    with transaction.atomic():
        for rec, start in zip(records, starts):
            activity_id = None
            status = GarminActivityFile.MATCH_ORPHAN
            if start:
                matches = [
                    aid for ts, ids in window.items() if abs(ts - start) <= MATCH_WINDOW
                    for aid in ids
                ]
                if len(matches) == 1:
                    activity_id, status = matches[0], GarminActivityFile.MATCH_MATCHED
                elif len(matches) > 1:
                    status = GarminActivityFile.MATCH_AMBIGUOUS
            GarminActivityFile.objects.update_or_create(
                file_name=rec["file_name"],
                defaults={
                    "owner": user,
                    "sha256": rec.get("sha256", ""),
                    "size_bytes": rec.get("size_bytes") or 0,
                    "fit_type": rec.get("fit_type") or "",
                    "session_start_time_gmt": start,
                    "sport": rec.get("sport") or "",
                    "activity_id": activity_id,
                    "match_status": status,
                    "storage_ref": rec.get("storage_ref") or "",
                    "fit_messages": rec.get("extra") or {},
                    "record_count": rec.get("record_count"),
                },
            )
            written += 1
    return written


def _simple(model, map_fn, unique_fields, update_fields, needs_activities=False):
    def importer(user, records):
        ctx = {}
        if needs_activities:
            ctx["activities_by_id"] = {
                a.garmin_activity_id: a
                for a in GarminActivity.objects.filter(owner=user)
            }
        objects = [map_fn(rec, user, **ctx) for rec in records]
        return _bulk_upsert(model, objects, unique_fields, update_fields)

    return importer


# update_fields=None means "every mapped field": re-import refreshes all.
def _all_fields(model, exclude=("id", "owner_id")):
    return [f.name for f in model._meta.fields if f.name not in exclude]


IMPORTERS = {
    "activities": _import_activities,
    "activity-files": _import_activity_files,
}


@csrf_exempt
@require_POST
@jwt_required
def import_dataset(request, dataset):
    if dataset not in IMPORTERS:
        return err(f"Unknown dataset '{dataset}'.", 404)
    return _import_view(dataset)(request)
