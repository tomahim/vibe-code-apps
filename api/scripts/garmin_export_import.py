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


# --- Minimal FIT header reader (file_id + session start) -------------------
# Enough to fingerprint a file without a FIT library. Unknown messages are
# skipped by size; nothing is decoded beyond what the API needs for matching.

def _fit_scan(data):
    """Return (file_type, session_start_epoch_s, sport) or (None, None, None)."""
    defs = {}

    def read_def(pos, local, data, dev_flag):
        arch = data[pos + 1]
        fmt = ">" if arch else "<"
        gmn = struct.unpack_from(fmt + "H", data, pos + 2)[0]
        nf = data[pos + 4]
        fields = []
        p = pos + 5
        for _ in range(nf):
            fields.append((data[p], data[p + 1]))
            p += 3
        dev_sizes = []
        if dev_flag:  # developer data definitions add (num, size, dev_idx)
            ndf = data[p]
            p += 1
            for _ in range(ndf):
                dev_sizes.append(data[p + 1])
                p += 3
        defs[local] = (gmn, fields, fmt, dev_sizes)
        return p

    ftype = start = sport = None
    try:
        pos = data[0]  # header size
        data_end = pos + struct.unpack_from("<I", data, 4)[0]
        while pos < data_end and (ftype is None or start is None):
            rh = data[pos]
            pos += 1
            if rh & 0x80:
                local = (rh >> 5) & 0x03
            elif rh & 0x40:
                pos = read_def(pos, rh & 0x0F, data, bool(rh & 0x20))
                continue
            else:
                local = rh & 0x0F
            if local not in defs:
                break
            gmn, fields, fmt, dev_sizes = defs[local]
            values = {}
            for num, size in fields:
                values[num] = (pos, size)
                pos += size
            pos += sum(dev_sizes)  # developer data fields trail every data message
            if gmn == 0 and 0 in values:  # file_id.type
                off, _ = values[0]
                ftype = data[off]
            if gmn == 18 and ftype == 4:  # session of an activity file
                for num, size in fields:
                    off, sz = values[num]
                    if num == 2 and sz == 4:  # start_time (FIT epoch 1989)
                        start = struct.unpack_from(fmt + "I", data, off)[0] + 631065600
                    if num == 5 and sz == 1:  # sport
                        sport = data[off]
    except (IndexError, struct.error):
        pass
    return ftype, start, sport


FIT_TYPE_NAMES = {4: "activity", 32: "monitoring_b", 35: "segment_list"}

# FIT base types: number -> (struct char, size). String and byte handled apart.
# enum=0 sint8=1 uint8=2 sint16=3 uint16=4 sint32=5 uint32=6 string=7
# float32=8 float64=9 uint8z=10 uint16z=11 uint32z=12 byte=13
# sint64=14 uint64=15 uint64z=16
_BASE = {
    0: ("B", 1), 1: ("b", 1), 2: ("B", 1), 3: ("h", 2), 4: ("H", 2),
    5: ("i", 4), 6: ("I", 4), 8: ("f", 4), 9: ("d", 8), 10: ("B", 1),
    11: ("H", 2), 12: ("I", 4), 13: ("B", 1), 14: ("q", 8), 15: ("Q", 8),
    16: ("Q", 8),
}
# Known message types decoded into extra payload, keyed by field number.
_DECODED_GMN = {18: "sessions", 19: "laps", 21: "events", 12: "sport",
                23: "device_info", 34: "activity", 7: "zones_target", 78: "hrv"}
_RECORD_GMN = 20
_DEV_DEF_GMN = 206   # field_description
_DEV_ID_GMN = 207    # developer_data_id


def _decode_value(data, pos, size, btype, fmt):
    bt = btype & 0x1F
    if bt == 7:  # string
        return data[pos:pos + size].split(b"\x00")[0].decode("utf-8", "replace")
    if bt == 13:  # byte blob
        return data[pos:pos + size].hex()
    if bt in _BASE and size >= _BASE[bt][1]:
        ch, sz = _BASE[bt]
        vals = struct.unpack_from(fmt + ch * (size // sz), data, pos)
        return vals[0] if len(vals) == 1 else list(vals)
    return data[pos:pos + size].hex()


def _fit_decode(data, gmn_wanted, include_records=False):
    """Generic walk: decode wanted message types into {field_num: value} dicts.

    Values keep field numbers (no semantic names, no unit conversion) so
    nothing is guessed. Developer fields are decoded using the file's own
    field_description messages and keyed "dev:<index>:<field>" (with the
    declared name attached in dev_field_defs). FIT epoch fields stay raw
    ints (seconds since 1989-12-31 UTC). Per-second record messages are
    counted always and decoded only when include_records is set.
    """
    defs = {}
    dev_defs = {}  # (dev_data_index, field_def_num) -> {"name":, "btype":}
    out = {}
    record_count = 0
    try:
        pos = data[0]
        data_end = pos + struct.unpack_from("<I", data, 4)[0]
        while pos < data_end:
            rh = data[pos]
            pos += 1
            if rh & 0x80:
                local = (rh >> 5) & 3
            elif rh & 0x40:
                local = rh & 0x0F
                dev = bool(rh & 0x20)
                fmt = ">" if data[pos + 1] else "<"
                gmn = struct.unpack_from(fmt + "H", data, pos + 2)[0]
                nf = data[pos + 4]
                fields = []
                p2 = pos + 5
                for _ in range(nf):
                    fields.append((data[p2], data[p2 + 1], data[p2 + 2]))
                    p2 += 3
                dev_fields = []
                if dev:
                    ndf = data[p2]
                    p2 += 1
                    for _ in range(ndf):
                        # (field_def_num, size, dev_data_index)
                        dev_fields.append((data[p2], data[p2 + 1], data[p2 + 2]))
                        p2 += 3
                defs[local] = (gmn, fields, fmt, dev_fields)
                pos = p2
                continue
            else:
                local = rh & 15
            if local not in defs:
                break
            gmn, fields, fmt, dev_fields = defs[local]
            if gmn == _RECORD_GMN:
                record_count += 1
                if not include_records:
                    pos += sum(sz for _, sz, _ in fields) + sum(s for _, s, _ in dev_fields)
                    continue
            if gmn in gmn_wanted or (gmn == _RECORD_GMN and include_records) or gmn in (_DEV_DEF_GMN, _DEV_ID_GMN):
                rec = {}
                for num, size, btype in fields:
                    rec[num] = _decode_value(data, pos, size, btype, fmt)
                    pos += size
                for fnum, size, didx in dev_fields:
                    dd = dev_defs.get((didx, fnum), {})
                    rec["dev:%d:%d" % (didx, fnum)] = _decode_value(
                        data, pos, size, dd.get("btype", 13), fmt)
                    pos += size
                if gmn == _DEV_DEF_GMN:
                    key = (rec.get(0), rec.get(1))  # dev index, field num
                    dev_defs[key] = {"name": rec.get(3), "btype": rec.get(2)}
                    out.setdefault("dev_field_defs", []).append(rec)
                elif gmn == _DEV_ID_GMN:
                    out.setdefault("developer_data_ids", []).append(rec)
                elif gmn == _RECORD_GMN:
                    out.setdefault("records", []).append(rec)
                else:
                    out.setdefault(gmn_wanted[gmn], []).append(rec)
            else:
                pos += sum(sz for _, sz, _ in fields) + sum(s for _, s, _ in dev_fields)
    except (IndexError, struct.error):
        pass
    return out, record_count


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
