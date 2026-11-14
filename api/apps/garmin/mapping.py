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
    GarminAcuteTrainingLoad, GarminActivity, GarminActivitySplit,
    GarminActivitySplitSummary, GarminCourse, GarminDailySummary,
    GarminEnduranceScore, GarminGear, GarminHeatAltitudeAcclimation,
    GarminHillScore, GarminHydrationLog, GarminMaxMet, GarminPersonalRecord,
    GarminRacePrediction, GarminSleepNight, GarminTrainingReadiness,
    GarminTrainingStatus, GarminUserGoal, GarminVo2Max, GarminWeeklyTrainingReport,
    GarminWorkout, uuid_from_msb_lsb,
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
        device_id=rec.get("deviceId"),
        manufacturer=rec.get("manufacturer") or "",
        user_profile_id=rec.get("userProfileId"),
        summarized_dive_info=rec.get("summarizedDiveInfo") or None,
        raw=rec,
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


def map_daily_summary(rec, owner):
    return GarminDailySummary(
        owner=owner,
        calendar_date=_date(rec.get("calendarDate")),
        source=rec.get("source") or "",
        uuid=rec.get("uuid") or "",
        version=rec.get("version"),
        duration_ms=_int(rec.get("durationInMilliseconds")),
        total_steps=_int(rec.get("totalSteps")),
        daily_step_goal=_int(rec.get("dailyStepGoal")),
        total_distance_m=rec.get("totalDistanceMeters"),
        total_kilocalories=rec.get("totalKilocalories"),
        active_kilocalories=rec.get("activeKilocalories"),
        bmr_kilocalories=rec.get("bmrKilocalories"),
        wellness_kilocalories=rec.get("wellnessKilocalories"),
        wellness_active_kilocalories=rec.get("wellnessActiveKilocalories"),
        wellness_total_kilocalories=rec.get("wellnessTotalKilocalories"),
        wellness_distance_m=rec.get("wellnessDistanceMeters"),
        wellness_start_time_gmt=_any_epoch(rec.get("wellnessStartTimeGmt")),
        wellness_end_time_gmt=_any_epoch(rec.get("wellnessEndTimeGmt")),
        wellness_start_time_local=_any_epoch(rec.get("wellnessStartTimeLocal")),
        wellness_end_time_local=_any_epoch(rec.get("wellnessEndTimeLocal")),
        active_seconds=_int(rec.get("activeSeconds")),
        highly_active_seconds=_int(rec.get("highlyActiveSeconds")),
        moderate_intensity_minutes=_int(rec.get("moderateIntensityMinutes")),
        vigorous_intensity_minutes=_int(rec.get("vigorousIntensityMinutes")),
        is_vigorous_day=bool(rec.get("isVigorousDay")),
        floors_ascended_m=rec.get("floorsAscendedInMeters"),
        floors_descended_m=rec.get("floorsDescendedInMeters"),
        user_floors_ascended_goal=rec.get("userFloorsAscendedGoal"),
        user_intensity_minutes_goal=_int(rec.get("userIntensityMinutesGoal")),
        resting_heart_rate=_int(rec.get("restingHeartRate")),
        resting_heart_rate_timestamp=_any_epoch(rec.get("restingHeartRateTimestamp")),
        min_heart_rate=_int(rec.get("minHeartRate")),
        max_heart_rate=_int(rec.get("maxHeartRate")),
        min_avg_heart_rate=_int(rec.get("minAvgHeartRate")),
        max_avg_heart_rate=_int(rec.get("maxAvgHeartRate")),
        current_day_resting_heart_rate=_int(rec.get("currentDayRestingHeartRate")),
        average_monitoring_environment_altitude_m=rec.get(
            "averageMonitoringEnvironmentAltitude"
        ),
        includes_activity_data=bool(rec.get("includesActivityData")),
        includes_wellness_data=bool(rec.get("includesWellnessData")),
        includes_all_day_pulse_ox=bool(rec.get("includesAllDayPulseOx")),
        includes_sleep_pulse_ox=bool(rec.get("includesSleepPulseOx")),
        includes_calorie_consumed_data=bool(rec.get("includesCalorieConsumedData")),
        includes_single_measurement=bool(rec.get("includesSingleMeasurement")),
        includes_continuous_measurement=bool(rec.get("includesContinuousMeasurement")),
        all_day_stress=rec.get("allDayStress") or None,
        body_battery=rec.get("bodyBattery") or None,
        body_battery_feedback=rec.get("bodyBatteryFeedback") or None,
        hydration=rec.get("hydration") or None,
        respiration=rec.get("respiration") or None,
    )


def map_sleep(rec, owner):
    return GarminSleepNight(
        owner=owner,
        calendar_date=_date(rec.get("calendarDate")),
        sleep_start_time_gmt=_any_epoch(rec.get("sleepStartTimestampGMT")),
        sleep_end_time_gmt=_any_epoch(rec.get("sleepEndTimestampGMT")),
        deep_sleep_seconds=_int(rec.get("deepSleepSeconds")),
        light_sleep_seconds=_int(rec.get("lightSleepSeconds")),
        rem_sleep_seconds=_int(rec.get("remSleepSeconds")),
        awake_sleep_seconds=_int(rec.get("awakeSleepSeconds")),
        unmeasurable_seconds=_int(rec.get("unmeasurableSeconds")),
        awake_count=_int(rec.get("awakeCount")),
        restless_moment_count=_int(rec.get("restlessMomentCount")),
        average_respiration=rec.get("averageRespiration"),
        highest_respiration=rec.get("highestRespiration"),
        lowest_respiration=rec.get("lowestRespiration"),
        avg_sleep_stress=rec.get("avgSleepStress"),
        retro=bool(rec.get("retro")),
        sleep_window_confirmation_type=rec.get("sleepWindowConfirmationType") or "",
        sleep_scores=rec.get("sleepScores") or None,
    )


def map_training_readiness(rec, owner):
    return GarminTrainingReadiness(
        owner=owner,
        calendar_date=_date(rec.get("calendarDate")),
        device_id=rec.get("deviceId"),
        timestamp=_any_epoch(rec.get("timestamp")),
        timestamp_local=_any_epoch(rec.get("timestampLocal")),
        score=_int(rec.get("score")),
        level=rec.get("level") or "",
        hrv_weekly_average=rec.get("hrvWeeklyAverage"),
        hrv_factor_percent=rec.get("hrvFactorPercent"),
        hrv_factor_feedback=rec.get("hrvFactorFeedback") or "",
        sleep_score_factor_percent=rec.get("sleepScoreFactorPercent"),
        sleep_score_factor_feedback=rec.get("sleepScoreFactorFeedback") or "",
        sleep_history_factor_percent=rec.get("sleepHistoryFactorPercent"),
        sleep_history_factor_feedback=rec.get("sleepHistoryFactorFeedback") or "",
        stress_history_factor_percent=rec.get("stressHistoryFactorPercent"),
        stress_history_factor_feedback=rec.get("stressHistoryFactorFeedback") or "",
        recovery_time=rec.get("recoveryTime"),
        recovery_time_factor_percent=rec.get("recoveryTimeFactorPercent"),
        recovery_time_factor_feedback=rec.get("recoveryTimeFactorFeedback") or "",
        acute_load=rec.get("acuteLoad"),
        acwr_factor_percent=rec.get("acwrFactorPercent"),
        acwr_factor_feedback=rec.get("acwrFactorFeedback") or "",
        valid_sleep=bool(rec.get("validSleep")),
        input_context=rec.get("inputContext") or "",
        feedback_short=rec.get("feedbackShort") or "",
        feedback_long=rec.get("feedbackLong") or "",
    )


def map_vo2max(rec, owner, activities_by_id):
    return GarminVo2Max(
        owner=owner,
        calendar_date=_date(rec.get("calendarDate")),
        device_id=rec.get("deviceId"),
        timestamp=_any_epoch(rec.get("timestamp")),
        timestamp_gmt=_any_epoch(rec.get("timestampGmt")),
        sport=rec.get("sport") or "",
        sub_sport=rec.get("subSport") or "",
        vo2max_value=rec.get("vo2MaxValue"),
        activity=activities_by_id.get(rec.get("activityId")),
    )


def map_race_prediction(rec, owner):
    return GarminRacePrediction(
        owner=owner,
        calendar_date=_date(rec.get("calendarDate")),
        device_id=rec.get("deviceId"),
        timestamp=_any_epoch(rec.get("timestamp")),
        race_time_5k=rec.get("raceTime5K"),
        race_time_10k=rec.get("raceTime10K"),
        race_time_half=rec.get("raceTimeHalf"),
        race_time_marathon=rec.get("raceTimeMarathon"),
    )


def map_endurance_score(rec, owner):
    return GarminEnduranceScore(
        owner=owner,
        calendar_date=_date(rec.get("calendarDate")),
        device_id=rec.get("deviceId"),
        timestamp=_any_epoch(rec.get("timestamp")),
        overall_score=rec.get("overallScore"),
        classification=rec.get("classification") or "",
        endurance_score_contributor=rec.get("enduranceScoreContributor") or "",
        feedback_phrase=rec.get("feedbackPhrase") or "",
        primary_training_device=bool(rec.get("primaryTrainingDevice")),
    )


def map_hill_score(rec, owner):
    return GarminHillScore(
        owner=owner,
        calendar_date=_date(rec.get("calendarDate")),
        device_id=rec.get("deviceId"),
        timestamp=_any_epoch(rec.get("timestamp")),
        overall_score=rec.get("overallScore"),
        endurance_score=rec.get("enduranceScore"),
        strength_score=rec.get("strengthScore"),
        hill_score_classification_id=rec.get("hillScoreClassificationId"),
        hill_score_feedback_phrase_id=rec.get("hillScoreFeedbackPhraseId"),
        primary_training_device=bool(rec.get("primaryTrainingDevice")),
    )


def map_training_status(rec, owner):
    return GarminTrainingStatus(
        owner=owner,
        calendar_date=_date(rec.get("calendarDate")),
        device_id=rec.get("deviceId"),
        timestamp=_any_epoch(rec.get("timestamp")),
        sport=rec.get("sport") or "",
        sub_sport=rec.get("subSport") or "",
        training_status=rec.get("trainingStatus") or "",
        fitness_level_trend=rec.get("fitnessLevelTrend") or "",
        feedback_phrase=rec.get("trainingStatus2FeedbackPhrase") or "",
    )


def map_acute_training_load(rec, owner):
    return GarminAcuteTrainingLoad(
        owner=owner,
        calendar_date=_date(rec.get("calendarDate")),
        device_id=rec.get("deviceId"),
        timestamp=_any_epoch(rec.get("timestamp")),
        daily_training_load_acute=rec.get("dailyTrainingLoadAcute"),
        daily_training_load_chronic=rec.get("dailyTrainingLoadChronic"),
        daily_acute_chronic_workload_ratio=rec.get("dailyAcuteChronicWorkloadRatio"),
        acwr_percent=rec.get("acwrPercent"),
        acwr_status=rec.get("acwrStatus") or "",
        acwr_status_feedback=rec.get("acwrStatusFeedback") or "",
    )


def map_heat_altitude(rec, owner):
    return GarminHeatAltitudeAcclimation(
        owner=owner,
        calendar_date=_date(rec.get("calendarDate")),
        device_id=rec.get("deviceId"),
        timestamp=_any_epoch(rec.get("timestamp")),
        current_altitude=rec.get("currentAltitude"),
        heat_acclimation_percentage=rec.get("heatAcclimationPercentage"),
        heat_trend=rec.get("heatTrend") or "",
        heat_acclimation_timestamp=_any_epoch(rec.get("heatAcclimationTimestamp")),
        previous_heat_acclimation_percentage=rec.get("previousHeatAcclimationPercentage"),
        previous_heat_acclimation_timestamp=_any_epoch(rec.get("previousHeatAcclimationTimestamp")),
        altitude_acclimation=rec.get("altitudeAcclimation"),
        altitude_trend=rec.get("altitudeTrend") or "",
        altitude_acclimation_timestamp=_any_epoch(rec.get("altitudeAcclimationTimestamp")),
        altitude_acclimation_local_timestamp=_any_epoch(
            rec.get("altitudeAcclimationLocalTimestamp")
        ),
        previous_altitude_acclimation=rec.get("previousAltitudeAcclimation"),
        previous_altitude_acclimation_timestamp=_any_epoch(
            rec.get("previousAltitudeAcclimationTimestamp")
        ),
        prev_acclimation_percentage=rec.get("prevAcclimationPercentage"),
        prev_altitude=rec.get("prevAltitude"),
    )


def map_max_met(rec, owner):
    return GarminMaxMet(
        owner=owner,
        calendar_date=_date(rec.get("calendarDate")),
        device_id=rec.get("deviceId"),
        timestamp=_any_epoch(rec.get("timestamp")),
        sport=rec.get("sport") or "",
        sub_sport=rec.get("subSport") or "",
        max_met=rec.get("maxMet"),
        max_met_category=rec.get("maxMetCategory") or "",
        vo2max_value=rec.get("vo2MaxValue"),
        calibrated_data=rec.get("calibratedData") or None,
        update_timestamp=_any_epoch(rec.get("updateTimestamp")),
    )


def map_hydration(rec, owner, activities_by_id):
    # Activity-derived sweat entries have no uuid; fall back to a stable key.
    uuid = rec.get("uuid") or "activity-%s" % rec.get("activityId")
    return GarminHydrationLog(
        owner=owner,
        uuid=uuid,
        calendar_date=_date(rec.get("calendarDate")),
        value_ml=rec.get("valueInML"),
        activity=activities_by_id.get(rec.get("activityId")),
        hydration_source=rec.get("hydrationSource") or "",
        duration_ms=_int(rec.get("duration")),
        estimated_sweat_loss_ml=rec.get("estimatedSweatLossInML"),
        capped=bool(rec.get("capped")),
        persisted_timestamp_gmt=_any_epoch(rec.get("persistedTimestampGMT")),
        timestamp_local=_any_epoch(rec.get("timestampLocal")),
    )


def map_gear(rec, owner):
    return GarminGear(
        owner=owner,
        gear_pk=rec["gearPk"],
        uuid=rec.get("uuid") or "",
        gear_type_name=rec.get("gearTypeName") or "",
        gear_status_name=rec.get("gearStatusName") or "",
        display_name=rec.get("displayName") or "",
        custom_make_model=rec.get("customMakeModel") or "",
        date_begin=_date(rec.get("dateBegin")),
        maximum_meters=rec.get("maximumMeters"),
        notified=bool(rec.get("notified")),
        gear_version=rec.get("gearVersion"),
        create_date=_iso_dt(rec.get("createDate")),
        update_date=_iso_dt(rec.get("updateDate")),
    )


def map_personal_record(rec, owner, activities_by_id):
    pr_date = None
    text = rec.get("prStartTimeGMT") or ""
    if len(text) >= 11:
        # "Fri Oct 02 22:00:00 GMT 2026" -> 2026-10-02 (display string, day
        # precision at best; kept verbatim in pr_start_time_text).
        try:
            pr_date = datetime.strptime(text, "%a %b %d %H:%M:%S GMT %Y").date()
        except ValueError:
            pr_date = None
    activity = activities_by_id.get(rec.get("activityId")) if rec.get("activityId") else None
    return GarminPersonalRecord(
        owner=owner,
        personal_record_id=rec["personalRecordId"],
        personal_record_type=rec.get("personalRecordType") or "",
        value=rec.get("value"),
        pr_start_time_text=text,
        pr_start_date=pr_date,
        activity=activity,
        confirmed=bool(rec.get("confirmed")),
        current=bool(rec.get("current")),
        created_date=_date(rec.get("createdDate")),
    )


def map_workout(rec, owner):
    sport = rec.get("sportType") or {}
    return GarminWorkout(
        owner=owner,
        workout_id=rec["workoutId"],
        workout_name=rec.get("workoutName") or "",
        description=rec.get("description") or "",
        sport_type_key=sport.get("sportTypeKey") or "" if isinstance(sport, dict) else "",
        sport_type=rec.get("sportType") or None,
        workout_steps=rec.get("workoutSteps") or None,
        estimated_duration_secs=rec.get("estimatedDurationInSecs"),
        estimated_distance_unit=rec.get("estimatedDistanceUnit") or None,
        avg_training_speed=rec.get("avgTrainingSpeed"),
        atp=bool(rec.get("atp")),
        atp_plan_id=rec.get("atpPlanId"),
        author=rec.get("author") or None,
        shared=bool(rec.get("shared")),
        create_date=_iso_dt(rec.get("createdDate")),
        update_date=_iso_dt(rec.get("updatedDate")),
    )


def map_course(rec, owner):
    return GarminCourse(
        owner=owner,
        course_name=rec.get("courseName") or "",
        course_type=rec.get("courseType") or None,
        elevation_gain_m=rec.get("elevationGainMeter"),
        elevation_loss_m=rec.get("elevationLossMeter"),
        start_point=rec.get("startPoint") or None,
        geo_points=rec.get("geoPoints") or None,
        access_control=rec.get("accessControl") or None,
        has_turn_detection_disabled=bool(rec.get("hasTurnDetectionDisabled")),
        create_date=_iso_dt(rec.get("createDate")),
        update_date=_iso_dt(rec.get("updateDate")),
    )


def _goal_date(v):
    """Goals carry dates as {'date': 'Sep 7, 2021'} or with a time suffix."""
    if not v:
        return None
    s = v.get("date") if isinstance(v, dict) else str(v)
    if not s:
        return None
    for fmt in ("%b %d, %Y %I:%M:%S %p", "%b %d, %Y"):
        try:
            return datetime.strptime(s, fmt)
        except ValueError:
            continue
    return None


def map_goal(rec, owner):
    return GarminUserGoal(
        owner=owner,
        user_goal_category=rec.get("userGoalCategory") or None,
        user_goal_type=rec.get("userGoalType") or None,
        goal_value=rec.get("goalValue"),
        start_date=_goal_date(rec.get("startDate")),
        create_date=_goal_date(rec.get("createDate")),
        update_date=_goal_date(rec.get("updateDate")),
    )


def map_weekly_report(rec, owner):
    return GarminWeeklyTrainingReport(
        owner=owner,
        primary_activity_type=rec.get("primaryActivityType") or None,
        cross_training_enabled=bool(rec.get("crossTrainingEnabled")),
        payload=rec,
    )
