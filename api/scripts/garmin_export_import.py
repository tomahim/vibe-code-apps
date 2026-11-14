#!/usr/bin/env python3
"""Load a Garmin "Export Your Data" archive into the Garmin bulk-import API.

Reads the extracted export (the folder containing DI_CONNECT/) and posts raw
records in batches to the API, which owns all field/unit mapping. Also scans
the uploaded .FIT files (header only, stdlib-only parser) so the API can link
each file to its activity by start timestamp, and writes a source-file
manifest row per export file so coverage is auditable.

Usage:
    python garmin_export_import.py --export-dir /path/to/extracted \
        --api-base http://ui.genious-apps-production-railway.internal:8080 \
        --token <JWT>

Options:
    --datasets       comma list to import only some datasets (default: all)
    --batch-size     records per POST (default 200)
    --dry-run        count records per dataset without posting
    --token          JWT; or set GARMIN_IMPORT_TOKEN (never commit either)

Dependencies: Python 3.10+ standard library + `requests`.
The export stays local: no record content is printed or logged.
"""
import argparse
import glob
import hashlib
import io
import json
import os
import struct
import sys
import zipfile

import requests

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from apps.garmin.fitdec import _fit_scan, _fit_decode, _DECODED_GMN  # noqa: E402

DATASET_FILES = {
    # dataset -> (glob relative to DI_CONNECT, extractor)
    "activities": ("DI-Connect-Fitness/*_summarizedActivities.json", "activities"),
    "daily-summaries": ("DI-Connect-Aggregator/UDSFile_*.json", "uds"),
    "sleep-nights": ("DI-Connect-Wellness/*_sleepData.json", "plain"),
    "training-readiness": ("DI-Connect-Metrics/TrainingReadinessDTO_*.json", "plain"),
    "vo2max": ("DI-Connect-Metrics/ActivityVo2Max_*.json", "plain"),
    "race-predictions": ("DI-Connect-Metrics/RunRacePredictions_*.json", "plain"),
    "endurance-scores": ("DI-Connect-Metrics/EnduranceScore_*.json", "plain"),
    "hill-scores": ("DI-Connect-Metrics/HillScore_*.json", "plain"),
    "training-status": ("DI-Connect-Metrics/TrainingHistory_*.json", "plain"),
    "acute-training-load": ("DI-Connect-Metrics/MetricsAcuteTrainingLoad_*.json", "plain"),
    "heat-altitude": ("DI-Connect-Metrics/MetricsHeatAltitudeAcclimation_*.json", "plain"),
    "max-met": ("DI-Connect-Metrics/MetricsMaxMetData_*.json", "plain"),
    "hydration": ("DI-Connect-Aggregator/HydrationLogFile_*.json", "plain"),
    "gear": ("DI-Connect-Fitness/*_gear.json", "gear"),
    "personal-records": ("DI-Connect-Fitness/*_personalRecord.json", "personal_records"),
    "workouts": ("DI-Connect-Fitness/*_workout.json", "workouts"),
    "courses": ("DI-Connect-Routing/*_courses_*.json", "plain"),
    "goals": ("DI-Connect-User/UserGoal_*.json", "plain"),
    "weekly-reports": ("DI-Connect-Fitness/*_weekly_training_report.json", "weekly_reports"),
}

# Files that carry account/personal data rather than sports data: imported as
# 'excluded' manifest rows only.
EXCLUDED_PREFIXES = ("customer_data/", "DI_CONNECT/DI-Connect-User/", "IT_", "AVC_", "SUBSCRIPTIONS/")


def extract(records, kind):
    """Normalize the export's wrapper shapes to a flat record list."""
    if kind == "activities":
        out = []
        for wrapper in records:
            out.extend(wrapper.get("summarizedActivitiesExport", []))
        return out
    if kind == "gear":
        out = []
        for wrapper in records:
            links = {
                int(pk): [l["activityId"] for l in links]
                for pk, links in (wrapper.get("gearActivityDTOs") or {}).items()
            }
            for g in wrapper.get("gearDTOS", []):
                g = dict(g)
                g["activityIds"] = links.get(g.get("gearPk"), [])
                out.append(g)
        return out
    if kind == "personal_records":
        out = []
        for wrapper in records:
            out.extend(wrapper.get("personalRecords", []))
        return out
    if kind == "workouts":
        out = []
        for wrapper in records:
            out.extend(wrapper.get("workoutList", []))
        return out
    if kind == "weekly_reports":
        out = []
        for wrapper in records:
            out.extend(wrapper.get("weeklyTrainingReportExport", []))
        return out
    return records  # plain list files


def load_json_records(export_dir, pattern):
    records = []
    for path in sorted(glob.glob(os.path.join(export_dir, "DI_CONNECT", pattern))):
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        records.extend(data if isinstance(data, list) else [data])
    return records


FIT_TYPE_NAMES = {4: "activity", 32: "monitoring_b", 35: "segment_list"}

def scan_fit_files(export_dir, hash_all=False, decode_records=False):
    """Yield manifest/activity-file rows for every .FIT in Uploaded-Files zips."""
    rows = []
    pattern = os.path.join(
        export_dir, "DI_CONNECT", "DI-Connect-Uploaded-Files", "*.zip"
    )
    for zip_path in sorted(glob.glob(pattern)):
        with zipfile.ZipFile(zip_path) as z:
            for info in z.infolist():
                if not info.filename.lower().endswith(".fit"):
                    continue
                head = z.read(info)[:8192]
                ftype, start, sport = _fit_scan(head)
                if ftype == 4:
                    full = z.read(info)
                    if start is None:
                        # session messages sit near the end of activity files
                        ftype, start, sport = _fit_scan(full)
                    row_extra, rec_count = _fit_decode(
                        full, _DECODED_GMN, include_records=decode_records)
                    row["record_count"] = rec_count
                else:
                    row_extra = {}
                row = {
                    "file_name": info.filename,
                    "size_bytes": info.file_size,
                    "fit_type": FIT_TYPE_NAMES.get(ftype, str(ftype) if ftype else ""),
                    "session_start_time_gmt": start * 1000 if start else None,
                    "sport": sport if isinstance(sport, str) else (str(sport) if sport else ""),
                    "storage_ref": f"export:{os.path.basename(zip_path)}",
                }
                if row_extra:
                    row["extra"] = row_extra
                if hash_all or ftype == 4:
                    row["sha256"] = hashlib.sha256(z.read(info)).hexdigest()
                rows.append((row, ftype))
    return rows


def post_batch(session, api_base, dataset, records, source_file=""):
    headers = {"X-Source-File": source_file}
    r = session.post(
        f"{api_base}/api/apps/garmin/import/{dataset}/",
        json={"records": records},
        headers=headers,
        timeout=120,
    )
    r.raise_for_status()
    return r.json()


def main():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--export-dir", required=True)
    p.add_argument("--api-base", required=True)
    p.add_argument("--token", default=os.environ.get("GARMIN_IMPORT_TOKEN", ""))
    p.add_argument("--datasets", default="")
    p.add_argument("--batch-size", type=int, default=200)
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--decode-records", action="store_true",
                   help="also decode per-second record messages (high volume; "
                        "off by default until a storage option is picked)")
    args = p.parse_args()
    if not args.token and not args.dry_run:
        sys.exit("Provide --token or GARMIN_IMPORT_TOKEN (or use --dry-run).")

    session = requests.Session()
    session.headers["Authorization"] = f"Bearer {args.token}"

    wanted = set(args.datasets.split(",")) if args.datasets else None
    totals = {}
    for dataset, (pattern, kind) in DATASET_FILES.items():
        if wanted and dataset not in wanted:
            continue
        records = extract(load_json_records(args.export_dir, pattern), kind)
        totals[dataset] = len(records)
        if args.dry_run or not records:
            continue
        for i in range(0, len(records), args.batch_size):
            result = post_batch(
                session, args.api_base, dataset,
                records[i:i + args.batch_size], source_file=pattern,
            )
            print(f"{dataset}: {result['written']} written (batch {i // args.batch_size + 1})")

    # .FIT files: activity files get the timestamp-match import; every file
    # (any type) also lands in the source-file manifest.
    if not wanted or "activity-files" in wanted:
        rows = scan_fit_files(args.export_dir, decode_records=args.decode_records)
        act_rows = [r for r, t in rows if t == 4]
        totals["activity-files"] = len(act_rows)
        if not args.dry_run:
            for i in range(0, len(act_rows), args.batch_size):
                post_batch(session, args.api_base, "activity-files",
                           act_rows[i:i + args.batch_size])
        print(f"activity-files: {len(act_rows)} activity FIT files scanned")

    print(json.dumps({"dry_run": args.dry_run, "records": totals}, indent=2))


if __name__ == "__main__":
    main()
