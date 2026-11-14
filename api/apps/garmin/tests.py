"""Tests with fully synthetic fixtures: invented ids, timestamps, places and
values. No real export data ever enters this file."""
import json
from datetime import datetime, timezone

from django.contrib.auth import get_user_model
from django.test import Client, TestCase

from apps.accounts.tokens import issue_token

from .models import (
    GarminActivity, GarminActivityFile, GarminActivitySplit,
    GarminImportBatch,
)

User = get_user_model()

# Synthetic run: 10.0 km (distance in cm in the export), 1 h, invented place.
SYNTH_ACTIVITY = {
    "activityId": 90000000001,
    "uuidMsb": 123456789,
    "uuidLsb": -987654321,
    "activityType": "running",
    "sportType": "RUNNING",
    "name": "Synthetic Morning Run",
    "locationName": "Testville",
    "beginTimestamp": 1760000000000,
    "startTimeGmt": 1760000000000,
    "startTimeLocal": 1760000000000,
    "duration": 3600000.0,
    "elapsedDuration": 3660000.0,
    "movingDuration": 3500000.0,
    "distance": 1000000.0,  # cm -> 10000 m
    "elevationGain": 50000.0,  # cm -> 500 m
    "elevationLoss": 48000.0,
    "avgSpeed": 0.278,  # 0.1 m/s -> 2.78 m/s
    "maxSpeed": 0.4,
    "avgHr": 150.0,
    "maxHr": 175.0,
    "hrTimeInZone_0": 1000,
    "hrTimeInZone_1": 2000,
    "calories": 700.0,
    "steps": 9000.0,
    "lapCount": 10,
    "aerobicTrainingEffect": 3.2,
    "activityTrainingLoad": 120.0,
    "vO2MaxValue": 50.0,
    "startLatitude": 45.0,
    "startLongitude": 5.0,
    "deviceId": 123456,
    "manufacturer": "GARMIN",
    "userProfileId": 111,
    "splits": [
        {
            "type": 3,
            "messageIndex": 0,
            "startIndex": 0,
            "endIndex": 100,
            "startTimeGMT": 1760000000000,
            "endTimeGMT": 1760000600000,
            "startLatitude": 45.0,
            "startLongitude": 5.0,
            "endLatitude": 45.001,
            "endLongitude": 5.001,
            "totalExerciseReps": 0,
            "measurements": [
                {"value": 150.0, "unitEnum": "BPM",
                 "fieldEnum": "WEIGHTED_MEAN_HEART_RATE", "valid": True}
            ],
        }
    ],
    "splitSummaries": [
        {"type": 3, "noOfSplits": 10, "distance": 1000000.0,
         "duration": 3600000.0, "averageSpeed": 0.278, "maxSpeed": 0.4}
    ],
}


def auth_client(user):
    c = Client()
    c.defaults["HTTP_AUTHORIZATION"] = f"Bearer {issue_token(user)}"
    return c


class GarminBase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="synthetic", password="x")

    def post(self, dataset, records):
        return auth_client(self.user).post(
            f"/api/apps/garmin/import/{dataset}/",
            data=json.dumps({"records": records}),
            content_type="application/json",
        )


class ActivityImportTests(GarminBase):
    def test_health_open(self):
        self.assertEqual(Client().get("/api/apps/garmin/health/").status_code, 200)

    def test_import_requires_auth(self):
        r = Client().post(
            "/api/apps/garmin/import/activities/",
            data="[]", content_type="application/json")
        self.assertEqual(r.status_code, 401)

    def test_unknown_dataset_404(self):
        self.assertEqual(self.post("nope", []).status_code, 404)

    def test_import_activity_with_unit_conversions_and_children(self):
        r = self.post("activities", [SYNTH_ACTIVITY])
        self.assertEqual(r.status_code, 200, r.content)
        self.assertEqual(r.json()["written"], 1)
        a = GarminActivity.objects.get(pk=90000000001)
        self.assertEqual(a.owner, self.user)
        self.assertEqual(a.distance_m, 10000.0)
        self.assertEqual(a.elevation_gain_m, 500.0)
        self.assertAlmostEqual(a.avg_speed_mps, 2.78)
        self.assertEqual(a.avg_hr, 150)
        self.assertEqual(a.hr_time_in_zone_1_ms, 2000)
        self.assertEqual(a.raw["locationName"], "Testville")
        self.assertEqual(a.splits.count(), 1)
        split = a.splits.get()
        self.assertEqual(split.measurements[0]["fieldEnum"], "WEIGHTED_MEAN_HEART_RATE")
        self.assertEqual(a.split_summaries.count(), 1)
        batch = GarminImportBatch.objects.get()
        self.assertEqual(batch.status, "ok")
        self.assertEqual(batch.records_received, 1)

    def test_reimport_is_idempotent(self):
        self.post("activities", [SYNTH_ACTIVITY])
        updated = dict(SYNTH_ACTIVITY, calories=800.0)
        self.post("activities", [updated])
        self.assertEqual(GarminActivity.objects.count(), 1)
        a = GarminActivity.objects.get(pk=90000000001)
        self.assertEqual(a.calories, 800.0)
        self.assertEqual(a.splits.count(), 1)  # children replaced, not duplicated
        self.assertEqual(GarminActivitySplit.objects.count(), 1)

    def test_activities_are_owner_scoped(self):
        other = User.objects.create_user(username="other", password="x")
        self.post("activities", [SYNTH_ACTIVITY])
        c = auth_client(other)
        r = c.post(
            "/api/apps/garmin/import/activity-files/",
            data=json.dumps({"records": [{
                "file_name": "cross.fit", "sha256": "3" * 64, "size_bytes": 10,
                "session_start_time_gmt": 1760000000000,
            }]}),
            content_type="application/json",
        )
        self.assertEqual(r.status_code, 200)
        # Another user must never match this user's activity by timestamp.
        f = GarminActivityFile.objects.get(owner=other)
        self.assertEqual(f.match_status, "orphan")
        self.assertIsNone(f.activity)


class ActivityFileMatchingTests(GarminBase):
    def setUp(self):
        self.post("activities", [SYNTH_ACTIVITY])

    def test_unique_timestamp_match(self):
        r = self.post("activity-files", [{
            "file_name": "synthetic_1.fit",
            "sha256": "0" * 64,
            "size_bytes": 1000,
            "fit_type": "activity",
            "session_start_time_gmt": 1760000000000,  # exact
            "sport": "running",
        }])
        self.assertEqual(r.status_code, 200)
        f = GarminActivityFile.objects.get(file_name="synthetic_1.fit")
        self.assertEqual(f.match_status, "matched")
        self.assertEqual(f.activity_id, 90000000001)

    def test_orphan_when_no_candidate(self):
        self.post("activity-files", [{
            "file_name": "synthetic_2.fit", "sha256": "1" * 64, "size_bytes": 10,
            "session_start_time_gmt": 1700000000000,
        }])
        f = GarminActivityFile.objects.get(file_name="synthetic_2.fit")
        self.assertEqual(f.match_status, "orphan")
        self.assertIsNone(f.activity)

    def test_ambiguous_never_attached(self):
        second = dict(SYNTH_ACTIVITY, activityId=90000000002, uuidMsb=42, uuidLsb=43)
        self.post("activities", [second])  # same start time
        self.post("activity-files", [{
            "file_name": "synthetic_3.fit", "sha256": "2" * 64, "size_bytes": 10,
            "session_start_time_gmt": 1760000000000,
        }])
        f = GarminActivityFile.objects.get(file_name="synthetic_3.fit")
        self.assertEqual(f.match_status, "ambiguous")
        self.assertIsNone(f.activity)


# ---------------------------------------------------------------------------
# FIT parser (apps.garmin.fitdec) regression tests.
# ---------------------------------------------------------------------------

def _fit_header(payload_len):
    import struct as st
    return bytes([14, 16]) + st.pack('<H', 1078) + st.pack('<I', payload_len) + b'.FIT' + b'\x00\x00'


def _def_msg(local, gmn, fields, dev_fields=(), big_endian=False):
    """fields: (num, size, base_type); dev_fields: (fnum, size, dev_idx)."""
    import struct as st
    rh = 0x40 | (0x20 if dev_fields else 0) | local
    out = bytes([rh, 0, 1 if big_endian else 0])
    out += st.pack('>H' if big_endian else '<H', gmn)
    out += bytes([len(fields)])
    for num, size, bt in fields:
        out += bytes([num, size, bt])
    if dev_fields:
        out += bytes([len(dev_fields)])
        for fnum, size, didx in dev_fields:
            out += bytes([fnum, size, didx])
    return out


def _data_msg(local, values, compressed=False):
    rh = (0x80 | (local << 5)) if compressed else local
    return bytes([rh]) + values


class FitDecodeTests(TestCase):
    def _decode_one(self, gmn, fields, values, dev_defs=(), dev_fields=(),
                    dev_values=b'', big_endian=False, gmn_wanted=None):
        from apps.garmin.fitdec import _fit_decode
        payload = b''
        for dd in dev_defs:
            payload += _def_msg(0, 206, [(0, 1, 2), (1, 1, 2), (2, 1, 2), (3, 8, 7)])
            payload += _data_msg(0, dd)
        payload += _def_msg(1, gmn, fields, dev_fields=dev_fields, big_endian=big_endian)
        payload += _data_msg(1, values + dev_values)
        data = _fit_header(len(payload)) + payload + b'\x00\x00'
        wanted = gmn_wanted or {gmn: 'msgs'}
        out, _ = _fit_decode(data, wanted, include_records=True)
        return out.get('msgs', out.get('records', [{}]))[0]

    def test_all_base_types(self):
        import struct as st
        fields = [(i, sz, i) for i, (_, sz) in sorted(__import__('apps.garmin.fitdec', fromlist=['_BASE'])._BASE.items())]
        vals = b''
        for num, size, bt in fields:
            ch, sz = __import__('apps.garmin.fitdec', fromlist=['_BASE'])._BASE[bt]
            vals += st.pack('<' + ch, 7)
        rec = self._decode_one(18, fields, vals)
        for num, _, bt in fields:
            self.assertEqual(rec[num], '07' if bt == 13 else 7, f'base type {bt}')

    def test_big_endian_definition(self):
        import struct as st
        rec = self._decode_one(18, [(9, 4, 6)], st.pack('>I', 404503), big_endian=True)
        self.assertEqual(rec[9], 404503)

    def test_array_field(self):
        import struct as st
        rec = self._decode_one(18, [(50, 8, 4)], st.pack('<4H', 1, 2, 3, 4))
        self.assertEqual(rec[50], [1, 2, 3, 4])

    def test_invalid_sentinel_kept_raw(self):
        import struct as st
        rec = self._decode_one(18, [(16, 1, 2), (9, 4, 6)], b'\xff' + st.pack('<I', 0xFFFFFFFF))
        self.assertEqual(rec[16], 255)
        self.assertEqual(rec[9], 4294967295)

    def test_string_field(self):
        rec = self._decode_one(18, [(3, 8, 7)], b'Zwift\x00\x00\x00')
        self.assertEqual(rec[3], 'Zwift')

    def test_compressed_timestamp_header(self):
        import struct as st
        payload = _def_msg(2, 20, [(3, 1, 2), (5, 4, 6)]) + _data_msg(2, b'\x98' + st.pack('<I', 12345), compressed=True)
        from apps.garmin.fitdec import _fit_decode
        data = _fit_header(len(payload)) + payload + b'\x00\x00'
        out, rc = _fit_decode(data, {20: 'records'}, include_records=True)
        self.assertEqual(rc, 1)
        self.assertEqual(out['records'][0][3], 152)
        self.assertEqual(out['records'][0][5], 12345)

    def test_developer_fields_resolved_via_definitions(self):
        import struct as st
        dev_def = bytes([0, 9, 11]) + b'doubling\x00'[:8]  # idx 0, field 9, base uint16z, name
        rec = self._decode_one(
            20, [(3, 1, 2)], b'\x98',
            dev_defs=[dev_def], dev_fields=[(9, 2, 0)], dev_values=st.pack('<H', 42),
            gmn_wanted={20: 'records'})
        self.assertEqual(rec[3], 152)
        self.assertEqual(rec['dev:0:9'], 42)

    def test_float_nan_becomes_none(self):
        # A float32 field holding the FIT invalid sentinel (NaN) decodes to
        # None so the value survives JSON serialization.
        import struct as st
        from .fitdec import _decode_value
        data = st.pack("<f", float("nan"))
        self.assertIsNone(_decode_value(data, 0, 4, 0x88, "<"))
        data2 = st.pack("<ff", 1.5, float("nan"))
        self.assertEqual(_decode_value(data2, 0, 8, 0x88, "<"), [1.5, None])

    def test_record_count_without_decode(self):
        import struct as st
        from apps.garmin.fitdec import _fit_decode
        payload = _def_msg(1, 20, [(3, 1, 2)]) + _data_msg(1, b'\x90') * 3
        data = _fit_header(len(payload)) + payload + b'\x00\x00'
        out, rc = _fit_decode(data, {20: 'records'}, include_records=False)
        self.assertEqual(rc, 3)
        self.assertNotIn('records', out)
