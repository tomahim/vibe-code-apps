"""Tests with fully synthetic fixtures: invented ids, timestamps, places and
values. No real export data ever enters this file."""
import json
from datetime import datetime, timezone

from django.contrib.auth import get_user_model
from django.test import Client, TestCase

from apps.accounts.tokens import issue_token

from .models import (
    GarminActivity, GarminActivityFile, GarminActivitySplit,
    GarminDailySummary, GarminGear, GarminGearActivity, GarminImportBatch,
    GarminSleepNight, GarminTrainingReadiness,
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
            "/api/apps/garmin/import/vo2max/",
            data=json.dumps({"records": [
                {"calendarDate": "2026-01-01", "sport": "RUNNING",
                 "vo2MaxValue": 49.0, "activityId": 90000000001}
            ]}),
            content_type="application/json",
        )
        self.assertEqual(r.status_code, 200)
        # The other user's VO2max row must not link to this user's activity.
        from .models import GarminVo2Max
        self.assertIsNone(GarminVo2Max.objects.get(owner=other).activity)


class SimpleDatasetTests(GarminBase):
    def test_daily_summary_upsert(self):
        rec = {"calendarDate": "2026-01-02", "totalSteps": 10000,
               "restingHeartRate": 50, "bodyBattery": {"chargedValue": 90}}
        self.post("daily-summaries", [rec])
        self.post("daily-summaries", [dict(rec, totalSteps=12000)])
        self.assertEqual(GarminDailySummary.objects.count(), 1)
        d = GarminDailySummary.objects.get()
        self.assertEqual(d.total_steps, 12000)
        self.assertEqual(d.body_battery["chargedValue"], 90)

    def test_sleep_and_readiness(self):
        self.post("sleep-nights", [
            {"calendarDate": "2026-01-02", "deepSleepSeconds": 3600,
             "sleepScores": {"overallScore": 80}}
        ])
        self.post("training-readiness", [
            {"calendarDate": "2026-01-02", "score": 75, "level": "MODERATE"}
        ])
        self.assertEqual(GarminSleepNight.objects.get().sleep_scores["overallScore"], 80)
        self.assertEqual(GarminTrainingReadiness.objects.get().score, 75)


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


class GearImportTests(GarminBase):
    def test_gear_with_activity_links(self):
        self.post("activities", [SYNTH_ACTIVITY])
        r = self.post("gear", [{
            "gearPk": 555,
            "gearTypeName": "Shoes",
            "customMakeModel": "Synthetic Shoe",
            "activityIds": [90000000001, 99999999999],  # one missing activity
        }])
        self.assertEqual(r.status_code, 200)
        gear = GarminGear.objects.get(gear_pk=555)
        self.assertEqual(gear.custom_make_model, "Synthetic Shoe")
        # Only the existing activity is linked.
        self.assertEqual(GarminGearActivity.objects.count(), 1)
