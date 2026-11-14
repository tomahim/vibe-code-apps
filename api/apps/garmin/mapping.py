"""Raw Garmin export record -> model field mapping.

One place for every unit conversion, verified against the real export:
- distance / elevation: centimeters -> meters
- speed: 0.1 m/s -> m/s
- duration / HR & power zone times: milliseconds (kept as ms)
- timestamps: epoch milliseconds -> aware datetimes
Field names below are the export's camelCase keys.
"""
from datetime import datetime, timezone

from .models import (
    GarminActivity, GarminActivitySplit, GarminActivitySplitSummary,
    uuid_from_msb_lsb,
)


def _cm_to_m(v):
    return None if v is None else v / 100.0


def _speed_to_mps(v):
    return None if v is None else v * 10.0


def _ms_epoch(v):
    if v is None:
        return None
    return datetime.fromtimestamp(v / 1000.0, tz=timezone.utc)


def _s_epoch(v):
    if v is None:
        return None
    return datetime.fromtimestamp(float(v), tz=timezone.utc)


def _any_epoch(v):
    """Export timestamps come as epoch ms (activities), epoch s (metrics),
    or occasionally an ISO string (e.g. wellnessStartTimeGmt on some days)."""
    if v is None:
        return None
    if isinstance(v, str) and not v.replace('.', '', 1).isdigit():
        return _iso(v)
    v = float(v)
    return datetime.fromtimestamp(v / 1000.0 if v > 1e12 else v, tz=timezone.utc)


def _iso(s):
    """Parse ISO datetimes incl. shapes datetime.fromisoformat (<3.11) rejects."""
    s = s.strip().rstrip('Z')
    for fmt in ('%Y-%m-%dT%H:%M:%S.%f', '%Y-%m-%dT%H:%M:%S', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d'):
        try:
            dt = datetime.strptime(s, fmt)
            break
        except ValueError:
            continue
    else:
        dt = datetime.fromisoformat(s)
    return dt.replace(tzinfo=timezone.utc)


def _date(v):
    """calendarDate comes as 'YYYY-MM-DD' or, in some metric files, epoch s/ms."""
    if not v:
        return None
    s = str(v)
    if s.replace('.', '', 1).isdigit():
        ts = float(s)
        return datetime.fromtimestamp(ts / 1000.0 if ts > 1e12 else ts, tz=timezone.utc).date()
    return datetime.strptime(s[:10], "%Y-%m-%d").date()


def _iso_dt(v):
    """createDate/updateDate come as ISO strings."""
    if not v:
        return None
    try:
        return datetime.fromisoformat(str(v).replace("Z", "+00:00"))
    except ValueError:
        return None


def _int(v):
    return None if v is None else int(v)


def map_activity(rec, owner):
    return GarminActivity(
        owner=owner,
        garmin_activity_id=rec["activityId"],
        uuid=uuid_from_msb_lsb(rec.get("uuidMsb"), rec.get("uuidLsb")),
        activity_type=rec.get("activityType", ""),
        sport_type=rec.get("sportType") or "",
        name=rec.get("name") or "",
        location_name=rec.get("locationName") or "",
        rule=rec.get("rule") or "",
        event_type_id=rec.get("eventTypeId"),
        time_zone_id=rec.get("timeZoneId"),
        parent=bool(rec.get("parent")),
        atp_activity=bool(rec.get("atpActivity")),
        purposeful=bool(rec.get("purposeful")),
        favorite=bool(rec.get("favorite")),
        pr=bool(rec.get("pr")),
        deco_dive=bool(rec.get("decoDive")),
        elevation_corrected=bool(rec.get("elevationCorrected")),
        run_power_wind_data_enabled=bool(
            rec.get("runPowerWindDataEnabled") or rec.get("isRunPowerWindDataEnabled")
        ),
        start_time_gmt=_any_epoch(rec.get("startTimeGmt") or rec.get("beginTimestamp")),
        start_time_local=_any_epoch(rec.get("startTimeLocal")),
        begin_timestamp_ms=rec.get("beginTimestamp"),
        duration_ms=_int(rec.get("duration")),
        elapsed_duration_ms=_int(rec.get("elapsedDuration")),
        moving_duration_ms=_int(rec.get("movingDuration")),
        distance_m=_cm_to_m(rec.get("distance")),
        elevation_gain_m=_cm_to_m(rec.get("elevationGain")),
        elevation_loss_m=_cm_to_m(rec.get("elevationLoss")),
        min_elevation_m=_cm_to_m(rec.get("minElevation")),
        max_elevation_m=_cm_to_m(rec.get("maxElevation")),
        avg_speed_mps=_speed_to_mps(rec.get("avgSpeed")),
        max_speed_mps=_speed_to_mps(rec.get("maxSpeed")),
        avg_grade_adjusted_speed_mps=_speed_to_mps(rec.get("avgGradeAdjustedSpeed")),
        max_vertical_speed_mps=_speed_to_mps(rec.get("maxVerticalSpeed")),
        avg_hr=_int(rec.get("avgHr")),
        max_hr=_int(rec.get("maxHr")),
        min_hr=_int(rec.get("minHr")),
        **{f"hr_time_in_zone_{i}_ms": _int(rec.get(f"hrTimeInZone_{i}")) for i in range(7)},
        avg_power=rec.get("avgPower"),
        max_power=rec.get("maxPower"),
        norm_power=rec.get("normPower"),
        **{f"power_time_in_zone_{i}_ms": _int(rec.get(f"powerTimeInZone_{i}")) for i in range(6)},
        avg_run_cadence=rec.get("avgRunCadence"),
        max_run_cadence=rec.get("maxRunCadence"),
        avg_double_cadence=rec.get("avgDoubleCadence"),
        max_double_cadence=rec.get("maxDoubleCadence"),
        avg_fractional_cadence=rec.get("avgFractionalCadence"),
        max_fractional_cadence=rec.get("maxFractionalCadence"),
        avg_ground_contact_time_ms=rec.get("avgGroundContactTime"),
        avg_vertical_oscillation_mm=rec.get("avgVerticalOscillation"),
        avg_vertical_ratio=rec.get("avgVerticalRatio"),
        avg_stride_length_m=_cm_to_m(rec.get("avgStrideLength")),
        calories=rec.get("calories"),
        bmr_calories=rec.get("bmrCalories"),
        water_estimated_ml=rec.get("waterEstimated"),
        steps=_int(rec.get("steps")),
        lap_count=_int(rec.get("lapCount")),
        moderate_intensity_minutes=_int(rec.get("moderateIntensityMinutes")),
        vigorous_intensity_minutes=_int(rec.get("vigorousIntensityMinutes")),
        difference_body_battery=_int(rec.get("differenceBodyBattery")),
        aerobic_training_effect=rec.get("aerobicTrainingEffect"),
        anaerobic_training_effect=rec.get("anaerobicTrainingEffect"),
        training_effect_label=rec.get("trainingEffectLabel") or "",
        aerobic_training_effect_message=rec.get("aerobicTrainingEffectMessage") or "",
        anaerobic_training_effect_message=rec.get("anaerobicTrainingEffectMessage") or "",
        activity_training_load=rec.get("activityTrainingLoad"),
        vo2max_value=rec.get("vO2MaxValue"),
        start_latitude=rec.get("startLatitude"),
        start_longitude=rec.get("startLongitude"),
        end_latitude=rec.get("endLatitude"),
        end_longitude=rec.get("endLongitude"),
        min_latitude=rec.get("minLatitude"),
        max_latitude=rec.get("maxLatitude"),
        min_longitude=rec.get("minLongitude"),
        max_longitude=rec.get("maxLongitude"),
        user_profile_id=rec.get("userProfileId"),
        summarized_dive_info=rec.get("summarizedDiveInfo") or None,
        # Gear/device metadata is out of scope: stripped even from raw.
        raw={k: v for k, v in rec.items() if k not in ("deviceId", "manufacturer")},
    )


def map_split(rec, activity):
    return GarminActivitySplit(
        activity=activity,
        split_type=rec.get("type"),
        message_index=rec.get("messageIndex"),
        start_index=rec.get("startIndex"),
        end_index=rec.get("endIndex"),
        start_time_gmt=_any_epoch(rec.get("startTimeGMT")),
        end_time_gmt=_any_epoch(rec.get("endTimeGMT")),
        start_time_source=rec.get("startTimeSource") or "",
        end_time_source=rec.get("endTimeSource") or "",
        start_latitude=rec.get("startLatitude"),
        start_longitude=rec.get("startLongitude"),
        end_latitude=rec.get("endLatitude"),
        end_longitude=rec.get("endLongitude"),
        total_exercise_reps=rec.get("totalExerciseReps"),
        measurements=rec.get("measurements") or [],
    )


def map_split_summary(rec, activity):
    return GarminActivitySplitSummary(
        activity=activity,
        summary_type=rec.get("type"),
        no_of_splits=rec.get("noOfSplits"),
        distance_m=_cm_to_m(rec.get("distance")),
        duration_ms=_int(rec.get("duration")),
        average_speed_mps=_speed_to_mps(rec.get("averageSpeed")),
        max_speed_mps=_speed_to_mps(rec.get("maxSpeed")),
        average_elevation_gain_m=_cm_to_m(rec.get("averageElevationGain")),
        elevation_loss_m=_cm_to_m(rec.get("elevationLoss")),
        total_ascent_m=_cm_to_m(rec.get("totalAscent")),
        max_elevation_gain_m=_cm_to_m(rec.get("maxElevationGain")),
        max_distance_m=_cm_to_m(rec.get("maxDistance")),
        max_distance_with_precision_m=_cm_to_m(rec.get("maxDistanceWithPrecision")),
        avg_ground_contact_time_ms=rec.get("avgGroundContactTime"),
        avg_step_frequency=rec.get("avgStepFrequency"),
        avg_step_length_m=_cm_to_m(rec.get("avgStepLength")),
        vertical_oscillation_mm=rec.get("verticalOscillation"),
        vertical_ratio=rec.get("verticalRatio"),
    )
