"""Garmin Connect history: activities, daily wellness, metrics and gear.

Data-model proposal for review - see docs/garmin-data-model.md for the
verified source contract, unit conventions, deferred export domains and the
open time-series decision. Do not merge without Thomas's explicit OK.

Unit conventions (verified against the export): the source stores distance
and elevation in centimeters and speed in 0.1 m/s; this schema stores SI
units (meters, m/s, milliseconds) and mapping.py does the conversion once.
Every table is owner-scoped: rows belong to the auth_user who imported them.
"""

import uuid as uuid_mod

from django.conf import settings
from django.db import models


def uuid_from_msb_lsb(msb, lsb):
    """Combine the export's signed uuidMsb/uuidLsb pair into a UUID."""
    if msb is None or lsb is None:
        return None
    value = ((int(msb) & 0xFFFFFFFFFFFFFFFF) << 64) | (int(lsb) & 0xFFFFFFFFFFFFFFFF)
    return uuid_mod.UUID(int=value)


class OwnerModel(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="%(class)s_rows"
    )

    class Meta:
        abstract = True


class GarminActivity(OwnerModel):
    """One row per recorded activity, from summarizedActivities.

    The typed columns cover the fields Garmin fills for at least one sport;
    `raw` keeps the full source record so no summary field is ever lost.
    """

    garmin_activity_id = models.BigIntegerField(primary_key=True)
    uuid = models.UUIDField(null=True, blank=True, unique=True)
    activity_type = models.CharField(max_length=50, db_index=True)
    sport_type = models.CharField(max_length=50, blank=True, default="")
    name = models.CharField(max_length=300, blank=True, default="")
    location_name = models.CharField(max_length=300, blank=True, default="")
    rule = models.CharField(max_length=50, blank=True, default="")
    event_type_id = models.IntegerField(null=True, blank=True)
    time_zone_id = models.IntegerField(null=True, blank=True)
    parent = models.BooleanField(default=False)
    atp_activity = models.BooleanField(default=False)
    purposeful = models.BooleanField(default=False)
    favorite = models.BooleanField(default=False)
    pr = models.BooleanField(default=False)
    deco_dive = models.BooleanField(default=False)
    elevation_corrected = models.BooleanField(default=False)
    run_power_wind_data_enabled = models.BooleanField(default=False)

    start_time_gmt = models.DateTimeField(db_index=True)
    start_time_local = models.DateTimeField(null=True, blank=True)
    begin_timestamp_ms = models.BigIntegerField(null=True, blank=True)
    duration_ms = models.BigIntegerField(null=True, blank=True)
    elapsed_duration_ms = models.BigIntegerField(null=True, blank=True)
    moving_duration_ms = models.BigIntegerField(null=True, blank=True)

    distance_m = models.FloatField(null=True, blank=True)
    elevation_gain_m = models.FloatField(null=True, blank=True)
    elevation_loss_m = models.FloatField(null=True, blank=True)
    min_elevation_m = models.FloatField(null=True, blank=True)
    max_elevation_m = models.FloatField(null=True, blank=True)
    avg_speed_mps = models.FloatField(null=True, blank=True)
    max_speed_mps = models.FloatField(null=True, blank=True)
    avg_grade_adjusted_speed_mps = models.FloatField(null=True, blank=True)
    max_vertical_speed_mps = models.FloatField(null=True, blank=True)

    avg_hr = models.SmallIntegerField(null=True, blank=True)
    max_hr = models.SmallIntegerField(null=True, blank=True)
    min_hr = models.SmallIntegerField(null=True, blank=True)
    hr_time_in_zone_0_ms = models.BigIntegerField(null=True, blank=True)
    hr_time_in_zone_1_ms = models.BigIntegerField(null=True, blank=True)
    hr_time_in_zone_2_ms = models.BigIntegerField(null=True, blank=True)
    hr_time_in_zone_3_ms = models.BigIntegerField(null=True, blank=True)
    hr_time_in_zone_4_ms = models.BigIntegerField(null=True, blank=True)
    hr_time_in_zone_5_ms = models.BigIntegerField(null=True, blank=True)
    hr_time_in_zone_6_ms = models.BigIntegerField(null=True, blank=True)

    avg_power = models.FloatField(null=True, blank=True)
    max_power = models.FloatField(null=True, blank=True)
    norm_power = models.FloatField(null=True, blank=True)
    power_time_in_zone_0_ms = models.BigIntegerField(null=True, blank=True)
    power_time_in_zone_1_ms = models.BigIntegerField(null=True, blank=True)
    power_time_in_zone_2_ms = models.BigIntegerField(null=True, blank=True)
    power_time_in_zone_3_ms = models.BigIntegerField(null=True, blank=True)
    power_time_in_zone_4_ms = models.BigIntegerField(null=True, blank=True)
    power_time_in_zone_5_ms = models.BigIntegerField(null=True, blank=True)

    avg_run_cadence = models.FloatField(null=True, blank=True)
    max_run_cadence = models.FloatField(null=True, blank=True)
    avg_double_cadence = models.FloatField(null=True, blank=True)
    max_double_cadence = models.FloatField(null=True, blank=True)
    avg_fractional_cadence = models.FloatField(null=True, blank=True)
    max_fractional_cadence = models.FloatField(null=True, blank=True)
    avg_ground_contact_time_ms = models.FloatField(null=True, blank=True)
    avg_vertical_oscillation_mm = models.FloatField(null=True, blank=True)
    avg_vertical_ratio = models.FloatField(null=True, blank=True)
    avg_stride_length_m = models.FloatField(null=True, blank=True)

    calories = models.FloatField(null=True, blank=True)
    bmr_calories = models.FloatField(null=True, blank=True)
    water_estimated_ml = models.FloatField(null=True, blank=True)
    steps = models.IntegerField(null=True, blank=True)
    lap_count = models.SmallIntegerField(null=True, blank=True)
    moderate_intensity_minutes = models.SmallIntegerField(null=True, blank=True)
    vigorous_intensity_minutes = models.SmallIntegerField(null=True, blank=True)
    difference_body_battery = models.SmallIntegerField(null=True, blank=True)

    aerobic_training_effect = models.FloatField(null=True, blank=True)
    anaerobic_training_effect = models.FloatField(null=True, blank=True)
    training_effect_label = models.CharField(max_length=100, blank=True, default="")
    aerobic_training_effect_message = models.CharField(max_length=200, blank=True, default="")
    anaerobic_training_effect_message = models.CharField(max_length=200, blank=True, default="")
    activity_training_load = models.FloatField(null=True, blank=True)
    vo2max_value = models.FloatField(null=True, blank=True)

    start_latitude = models.FloatField(null=True, blank=True)
    start_longitude = models.FloatField(null=True, blank=True)
    end_latitude = models.FloatField(null=True, blank=True)
    end_longitude = models.FloatField(null=True, blank=True)
    min_latitude = models.FloatField(null=True, blank=True)
    max_latitude = models.FloatField(null=True, blank=True)
    min_longitude = models.FloatField(null=True, blank=True)
    max_longitude = models.FloatField(null=True, blank=True)

    device_id = models.BigIntegerField(null=True, blank=True)
    manufacturer = models.CharField(max_length=50, blank=True, default="")
    user_profile_id = models.BigIntegerField(null=True, blank=True)
    summarized_dive_info = models.JSONField(null=True, blank=True)

    # Full source record from summarizedActivitiesExport.
    raw = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "garmin_activity"
        indexes = [models.Index(fields=["owner", "start_time_gmt"])]

    def __str__(self):
        return f"{self.activity_type} {self.start_time_gmt:%Y-%m-%d}"


class GarminActivitySplit(models.Model):
    """One per-km / per-lap / per-interval split of an activity.

    `measurements` keeps the source's uniform metric list
    ({fieldEnum, value, unitEnum, ...}) verbatim: the filled set varies by
    sport, so a JSON list beats dozens of mostly-null columns.
    """

    activity = models.ForeignKey(GarminActivity, on_delete=models.CASCADE, related_name="splits")
    split_type = models.SmallIntegerField()
    message_index = models.SmallIntegerField(null=True, blank=True)
    start_index = models.IntegerField(null=True, blank=True)
    end_index = models.IntegerField(null=True, blank=True)
    start_time_gmt = models.DateTimeField(null=True, blank=True)
    end_time_gmt = models.DateTimeField(null=True, blank=True)
    start_time_source = models.CharField(max_length=30, blank=True, default="")
    end_time_source = models.CharField(max_length=30, blank=True, default="")
    start_latitude = models.FloatField(null=True, blank=True)
    start_longitude = models.FloatField(null=True, blank=True)
    end_latitude = models.FloatField(null=True, blank=True)
    end_longitude = models.FloatField(null=True, blank=True)
    total_exercise_reps = models.IntegerField(null=True, blank=True)
    measurements = models.JSONField(default=list)

    class Meta:
        db_table = "garmin_activity_split"
        indexes = [models.Index(fields=["activity", "split_type"])]


class GarminActivitySplitSummary(models.Model):
    """Per sub-sport aggregate over an activity's splits (splitSummaries)."""

    activity = models.ForeignKey(
        GarminActivity, on_delete=models.CASCADE, related_name="split_summaries"
    )
    summary_type = models.SmallIntegerField()
    no_of_splits = models.SmallIntegerField(null=True, blank=True)
    distance_m = models.FloatField(null=True, blank=True)
    duration_ms = models.BigIntegerField(null=True, blank=True)
    average_speed_mps = models.FloatField(null=True, blank=True)
    max_speed_mps = models.FloatField(null=True, blank=True)
    average_elevation_gain_m = models.FloatField(null=True, blank=True)
    elevation_loss_m = models.FloatField(null=True, blank=True)
    total_ascent_m = models.FloatField(null=True, blank=True)
    max_elevation_gain_m = models.FloatField(null=True, blank=True)
    max_distance_m = models.FloatField(null=True, blank=True)
    max_distance_with_precision_m = models.FloatField(null=True, blank=True)
    avg_ground_contact_time_ms = models.FloatField(null=True, blank=True)
    avg_step_frequency = models.FloatField(null=True, blank=True)
    avg_step_length_m = models.FloatField(null=True, blank=True)
    vertical_oscillation_mm = models.FloatField(null=True, blank=True)
    vertical_ratio = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = "garmin_activity_split_summary"


class GarminActivityFile(OwnerModel):
    """Traceability row for one original .FIT file from the export.

    The raw bytes stay outside the database (export archive, later the media
    bucket): this row keeps the file identifiable (sha256) and links it to
    its activity by start-timestamp matching. `match_status` is 'matched',
    'orphan' (no candidate activity) or 'ambiguous' (several candidates -
    never attached silently). See docs/garmin-data-model.md.
    """

    MATCH_MATCHED = "matched"
    MATCH_ORPHAN = "orphan"
    MATCH_AMBIGUOUS = "ambiguous"
    MATCH_CHOICES = [
        (MATCH_MATCHED, "Matched"),
        (MATCH_ORPHAN, "Orphan"),
        (MATCH_AMBIGUOUS, "Ambiguous"),
    ]

    file_name = models.CharField(max_length=300, unique=True)
    sha256 = models.CharField(max_length=64, db_index=True)
    size_bytes = models.BigIntegerField()
    fit_type = models.CharField(max_length=40, blank=True, default="")
    session_start_time_gmt = models.DateTimeField(null=True, blank=True)
    sport = models.CharField(max_length=40, blank=True, default="")
    activity = models.ForeignKey(
        GarminActivity, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="source_files",
    )
    match_status = models.CharField(max_length=20, choices=MATCH_CHOICES)
    # Where the bytes live: 'export-uploaded-files' for the GDPR export, an
    # object-storage key prefix once raw files move to the media bucket.
    storage_ref = models.CharField(max_length=300, blank=True, default="")

    class Meta:
        db_table = "garmin_activity_file"


class GarminDailySummary(OwnerModel):
    """One row per day from the UDS (User Daily Summary) aggregator files."""

    calendar_date = models.DateField()
    source = models.CharField(max_length=50, blank=True, default="")
    uuid = models.CharField(max_length=64, blank=True, default="")
    version = models.IntegerField(null=True, blank=True)
    duration_ms = models.BigIntegerField(null=True, blank=True)

    total_steps = models.IntegerField(null=True, blank=True)
    daily_step_goal = models.IntegerField(null=True, blank=True)
    total_distance_m = models.FloatField(null=True, blank=True)
    total_kilocalories = models.FloatField(null=True, blank=True)
    active_kilocalories = models.FloatField(null=True, blank=True)
    bmr_kilocalories = models.FloatField(null=True, blank=True)
    wellness_kilocalories = models.FloatField(null=True, blank=True)
    wellness_active_kilocalories = models.FloatField(null=True, blank=True)
    wellness_total_kilocalories = models.FloatField(null=True, blank=True)
    wellness_distance_m = models.FloatField(null=True, blank=True)
    wellness_start_time_gmt = models.DateTimeField(null=True, blank=True)
    wellness_end_time_gmt = models.DateTimeField(null=True, blank=True)
    wellness_start_time_local = models.DateTimeField(null=True, blank=True)
    wellness_end_time_local = models.DateTimeField(null=True, blank=True)
    active_seconds = models.IntegerField(null=True, blank=True)
    highly_active_seconds = models.IntegerField(null=True, blank=True)
    moderate_intensity_minutes = models.SmallIntegerField(null=True, blank=True)
    vigorous_intensity_minutes = models.SmallIntegerField(null=True, blank=True)
    is_vigorous_day = models.BooleanField(default=False)
    floors_ascended_m = models.FloatField(null=True, blank=True)
    floors_descended_m = models.FloatField(null=True, blank=True)
    user_floors_ascended_goal = models.FloatField(null=True, blank=True)
    user_intensity_minutes_goal = models.IntegerField(null=True, blank=True)

    resting_heart_rate = models.SmallIntegerField(null=True, blank=True)
    resting_heart_rate_timestamp = models.DateTimeField(null=True, blank=True)
    min_heart_rate = models.SmallIntegerField(null=True, blank=True)
    max_heart_rate = models.SmallIntegerField(null=True, blank=True)
    min_avg_heart_rate = models.SmallIntegerField(null=True, blank=True)
    max_avg_heart_rate = models.SmallIntegerField(null=True, blank=True)
    current_day_resting_heart_rate = models.SmallIntegerField(null=True, blank=True)
    average_monitoring_environment_altitude_m = models.FloatField(null=True, blank=True)

    includes_activity_data = models.BooleanField(default=False)
    includes_wellness_data = models.BooleanField(default=False)
    includes_all_day_pulse_ox = models.BooleanField(default=False)
    includes_sleep_pulse_ox = models.BooleanField(default=False)
    includes_calorie_consumed_data = models.BooleanField(default=False)
    includes_single_measurement = models.BooleanField(default=False)
    includes_continuous_measurement = models.BooleanField(default=False)

    # Nested source structures kept verbatim.
    all_day_stress = models.JSONField(null=True, blank=True)
    body_battery = models.JSONField(null=True, blank=True)
    body_battery_feedback = models.JSONField(null=True, blank=True)
    hydration = models.JSONField(null=True, blank=True)
    respiration = models.JSONField(null=True, blank=True)

    class Meta:
        db_table = "garmin_daily_summary"
        constraints = [
            models.UniqueConstraint(fields=["owner", "calendar_date"], name="garmin_uds_uniq")
        ]
        indexes = [models.Index(fields=["owner", "calendar_date"])]


class GarminSleepNight(OwnerModel):
    calendar_date = models.DateField()
    sleep_start_time_gmt = models.DateTimeField(null=True, blank=True)
    sleep_end_time_gmt = models.DateTimeField(null=True, blank=True)
    deep_sleep_seconds = models.IntegerField(null=True, blank=True)
    light_sleep_seconds = models.IntegerField(null=True, blank=True)
    rem_sleep_seconds = models.IntegerField(null=True, blank=True)
    awake_sleep_seconds = models.IntegerField(null=True, blank=True)
    unmeasurable_seconds = models.IntegerField(null=True, blank=True)
    awake_count = models.SmallIntegerField(null=True, blank=True)
    restless_moment_count = models.SmallIntegerField(null=True, blank=True)
    average_respiration = models.FloatField(null=True, blank=True)
    highest_respiration = models.FloatField(null=True, blank=True)
    lowest_respiration = models.FloatField(null=True, blank=True)
    avg_sleep_stress = models.FloatField(null=True, blank=True)
    retro = models.BooleanField(default=False)
    sleep_window_confirmation_type = models.CharField(max_length=50, blank=True, default="")
    sleep_scores = models.JSONField(null=True, blank=True)

    class Meta:
        db_table = "garmin_sleep_night"
        constraints = [
            models.UniqueConstraint(fields=["owner", "calendar_date"], name="garmin_sleep_uniq")
        ]


class DatedMetricModel(OwnerModel):
    """Base for dated metric time series from DI-Connect-Metrics."""

    calendar_date = models.DateField()
    device_id = models.BigIntegerField(null=True, blank=True)
    timestamp = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class GarminTrainingReadiness(DatedMetricModel):
    score = models.SmallIntegerField(null=True, blank=True)
    level = models.CharField(max_length=50, blank=True, default="")
    hrv_weekly_average = models.FloatField(null=True, blank=True)
    hrv_factor_percent = models.FloatField(null=True, blank=True)
    hrv_factor_feedback = models.CharField(max_length=100, blank=True, default="")
    sleep_score_factor_percent = models.FloatField(null=True, blank=True)
    sleep_score_factor_feedback = models.CharField(max_length=100, blank=True, default="")
    sleep_history_factor_percent = models.FloatField(null=True, blank=True)
    sleep_history_factor_feedback = models.CharField(max_length=100, blank=True, default="")
    stress_history_factor_percent = models.FloatField(null=True, blank=True)
    stress_history_factor_feedback = models.CharField(max_length=100, blank=True, default="")
    recovery_time = models.FloatField(null=True, blank=True)
    recovery_time_factor_percent = models.FloatField(null=True, blank=True)
    recovery_time_factor_feedback = models.CharField(max_length=100, blank=True, default="")
    acute_load = models.FloatField(null=True, blank=True)
    acwr_factor_percent = models.FloatField(null=True, blank=True)
    acwr_factor_feedback = models.CharField(max_length=100, blank=True, default="")
    valid_sleep = models.BooleanField(default=False)
    input_context = models.CharField(max_length=100, blank=True, default="")
    feedback_short = models.TextField(blank=True, default="")
    feedback_long = models.TextField(blank=True, default="")
    timestamp_local = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "garmin_training_readiness"
        constraints = [
            models.UniqueConstraint(fields=["owner", "calendar_date"], name="garmin_readiness_uniq")
        ]


class GarminVo2Max(DatedMetricModel):
    sport = models.CharField(max_length=50, blank=True, default="")
    sub_sport = models.CharField(max_length=50, blank=True, default="")
    vo2max_value = models.FloatField(null=True, blank=True)
    activity = models.ForeignKey(
        GarminActivity, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="vo2max_entries",
    )
    timestamp_gmt = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "garmin_vo2max"
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "calendar_date", "sport"], name="garmin_vo2max_uniq"
            )
        ]


class GarminRacePrediction(DatedMetricModel):
    race_time_5k = models.FloatField(null=True, blank=True)
    race_time_10k = models.FloatField(null=True, blank=True)
    race_time_half = models.FloatField(null=True, blank=True)
    race_time_marathon = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = "garmin_race_prediction"
        constraints = [
            models.UniqueConstraint(fields=["owner", "calendar_date"], name="garmin_racepred_uniq")
        ]


class GarminEnduranceScore(DatedMetricModel):
    overall_score = models.FloatField(null=True, blank=True)
    classification = models.CharField(max_length=50, blank=True, default="")
    endurance_score_contributor = models.CharField(max_length=50, blank=True, default="")
    feedback_phrase = models.CharField(max_length=200, blank=True, default="")
    primary_training_device = models.BooleanField(default=False)

    class Meta:
        db_table = "garmin_endurance_score"
        constraints = [
            models.UniqueConstraint(fields=["owner", "calendar_date"], name="garmin_endurance_uniq")
        ]


class GarminHillScore(DatedMetricModel):
    overall_score = models.FloatField(null=True, blank=True)
    endurance_score = models.FloatField(null=True, blank=True)
    strength_score = models.FloatField(null=True, blank=True)
    hill_score_classification_id = models.IntegerField(null=True, blank=True)
    hill_score_feedback_phrase_id = models.IntegerField(null=True, blank=True)
    primary_training_device = models.BooleanField(default=False)

    class Meta:
        db_table = "garmin_hill_score"
        constraints = [
            models.UniqueConstraint(fields=["owner", "calendar_date"], name="garmin_hill_uniq")
        ]


class GarminTrainingStatus(DatedMetricModel):
    sport = models.CharField(max_length=50, blank=True, default="")
    sub_sport = models.CharField(max_length=50, blank=True, default="")
    training_status = models.CharField(max_length=50, blank=True, default="")
    fitness_level_trend = models.CharField(max_length=50, blank=True, default="")
    feedback_phrase = models.CharField(max_length=200, blank=True, default="")

    class Meta:
        db_table = "garmin_training_status"
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "calendar_date", "sport"], name="garmin_trstatus_uniq"
            )
        ]


class GarminAcuteTrainingLoad(DatedMetricModel):
    daily_training_load_acute = models.FloatField(null=True, blank=True)
    daily_training_load_chronic = models.FloatField(null=True, blank=True)
    daily_acute_chronic_workload_ratio = models.FloatField(null=True, blank=True)
    acwr_percent = models.FloatField(null=True, blank=True)
    acwr_status = models.CharField(max_length=50, blank=True, default="")
    acwr_status_feedback = models.CharField(max_length=200, blank=True, default="")

    class Meta:
        db_table = "garmin_acute_training_load"
        constraints = [
            models.UniqueConstraint(fields=["owner", "calendar_date"], name="garmin_acuteload_uniq")
        ]


class GarminHeatAltitudeAcclimation(DatedMetricModel):
    current_altitude = models.FloatField(null=True, blank=True)
    heat_acclimation_percentage = models.FloatField(null=True, blank=True)
    heat_trend = models.CharField(max_length=50, blank=True, default="")
    heat_acclimation_timestamp = models.DateTimeField(null=True, blank=True)
    previous_heat_acclimation_percentage = models.FloatField(null=True, blank=True)
    previous_heat_acclimation_timestamp = models.DateTimeField(null=True, blank=True)
    altitude_acclimation = models.FloatField(null=True, blank=True)
    altitude_trend = models.CharField(max_length=50, blank=True, default="")
    altitude_acclimation_timestamp = models.DateTimeField(null=True, blank=True)
    altitude_acclimation_local_timestamp = models.DateTimeField(null=True, blank=True)
    previous_altitude_acclimation = models.FloatField(null=True, blank=True)
    previous_altitude_acclimation_timestamp = models.DateTimeField(null=True, blank=True)
    prev_acclimation_percentage = models.FloatField(null=True, blank=True)
    prev_altitude = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = "garmin_heat_altitude_acclimation"
        constraints = [
            models.UniqueConstraint(fields=["owner", "calendar_date"], name="garmin_acclimation_uniq")
        ]


class GarminMaxMet(DatedMetricModel):
    sport = models.CharField(max_length=50, blank=True, default="")
    sub_sport = models.CharField(max_length=50, blank=True, default="")
    max_met = models.FloatField(null=True, blank=True)
    max_met_category = models.CharField(max_length=50, blank=True, default="")
    vo2max_value = models.FloatField(null=True, blank=True)
    calibrated_data = models.JSONField(null=True, blank=True)
    update_timestamp = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "garmin_max_met"
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "calendar_date", "sport"], name="garmin_maxmet_uniq"
            )
        ]


class GarminHydrationLog(OwnerModel):
    uuid = models.CharField(max_length=64, unique=True)
    calendar_date = models.DateField()
    value_ml = models.FloatField(null=True, blank=True)
    activity = models.ForeignKey(
        GarminActivity, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="hydration_logs",
    )
    hydration_source = models.CharField(max_length=50, blank=True, default="")
    duration_ms = models.BigIntegerField(null=True, blank=True)
    estimated_sweat_loss_ml = models.FloatField(null=True, blank=True)
    capped = models.BooleanField(default=False)
    persisted_timestamp_gmt = models.DateTimeField(null=True, blank=True)
    timestamp_local = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "garmin_hydration_log"


class GarminGear(OwnerModel):
    gear_pk = models.BigIntegerField(primary_key=True)
    uuid = models.CharField(max_length=64, blank=True, default="")
    gear_type_name = models.CharField(max_length=50, blank=True, default="")
    gear_status_name = models.CharField(max_length=50, blank=True, default="")
    display_name = models.CharField(max_length=200, blank=True, default="")
    custom_make_model = models.CharField(max_length=200, blank=True, default="")
    date_begin = models.DateField(null=True, blank=True)
    maximum_meters = models.FloatField(null=True, blank=True)
    notified = models.BooleanField(default=False)
    gear_version = models.SmallIntegerField(null=True, blank=True)
    create_date = models.DateTimeField(null=True, blank=True)
    update_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "garmin_gear"


class GarminGearActivity(models.Model):
    """M-N link from the export's gearActivityDTOs (gear mileage per activity)."""

    gear = models.ForeignKey(GarminGear, on_delete=models.CASCADE, related_name="activity_links")
    activity = models.ForeignKey(
        GarminActivity, on_delete=models.CASCADE, related_name="gear_links"
    )

    class Meta:
        db_table = "garmin_gear_activity"
        constraints = [
            models.UniqueConstraint(fields=["gear", "activity"], name="garmin_gear_activity_uniq")
        ]


class GarminPersonalRecord(OwnerModel):
    personal_record_id = models.BigIntegerField(primary_key=True)
    personal_record_type = models.CharField(max_length=100)
    value = models.FloatField(null=True, blank=True)
    # The export writes this as a display string ("Fri Oct 02 22:00:00 GMT
    # 2026"); keep the text verbatim and the parsed date beside it.
    pr_start_time_text = models.CharField(max_length=100, blank=True, default="")
    pr_start_date = models.DateField(null=True, blank=True)
    activity = models.ForeignKey(
        GarminActivity, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="personal_records",
    )
    confirmed = models.BooleanField(default=False)
    current = models.BooleanField(default=False)
    created_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "garmin_personal_record"


class GarminWorkout(OwnerModel):
    workout_id = models.BigIntegerField(primary_key=True)
    workout_name = models.CharField(max_length=300, blank=True, default="")
    description = models.TextField(blank=True, default="")
    sport_type_key = models.CharField(max_length=50, blank=True, default="")
    sport_type = models.JSONField(null=True, blank=True)
    workout_steps = models.JSONField(null=True, blank=True)
    estimated_duration_secs = models.FloatField(null=True, blank=True)
    estimated_distance_unit = models.JSONField(null=True, blank=True)
    avg_training_speed = models.FloatField(null=True, blank=True)
    atp = models.BooleanField(default=False)
    atp_plan_id = models.BigIntegerField(null=True, blank=True)
    author = models.JSONField(null=True, blank=True)
    shared = models.BooleanField(default=False)
    create_date = models.DateTimeField(null=True, blank=True)
    update_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "garmin_workout"


class GarminWorkoutSchedule(OwnerModel):
    """One scheduled workout entry (workoutScheduleList)."""

    workout = models.ForeignKey(
        GarminWorkout, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="schedules",
    )
    payload = models.JSONField(default=dict)

    class Meta:
        db_table = "garmin_workout_schedule"


class GarminCourse(OwnerModel):
    course_name = models.CharField(max_length=300, blank=True, default="")
    course_type = models.JSONField(null=True, blank=True)
    elevation_gain_m = models.FloatField(null=True, blank=True)
    elevation_loss_m = models.FloatField(null=True, blank=True)
    start_point = models.JSONField(null=True, blank=True)
    geo_points = models.JSONField(null=True, blank=True)
    access_control = models.JSONField(null=True, blank=True)
    has_turn_detection_disabled = models.BooleanField(default=False)
    create_date = models.DateTimeField(null=True, blank=True)
    update_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "garmin_course"
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "course_name", "create_date"], name="garmin_course_uniq"
            )
        ]


class GarminUserGoal(OwnerModel):
    user_goal_category = models.JSONField(null=True, blank=True)
    user_goal_type = models.JSONField(null=True, blank=True)
    goal_value = models.FloatField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    create_date = models.DateTimeField(null=True, blank=True)
    update_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "garmin_user_goal"


class GarminWeeklyTrainingReport(OwnerModel):
    primary_activity_type = models.JSONField(null=True, blank=True)
    cross_training_enabled = models.BooleanField(default=False)
    payload = models.JSONField(default=dict)

    class Meta:
        db_table = "garmin_weekly_training_report"


class GarminImportBatch(OwnerModel):
    """Audit row for every bulk-import API call."""

    STATUS_RUNNING = "running"
    STATUS_OK = "ok"
    STATUS_ERROR = "error"
    STATUS_CHOICES = [
        (STATUS_RUNNING, "Running"),
        (STATUS_OK, "OK"),
        (STATUS_ERROR, "Error"),
    ]

    dataset = models.CharField(max_length=40, db_index=True)
    source_file = models.CharField(max_length=300, blank=True, default="")
    records_received = models.IntegerField(default=0)
    records_written = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_RUNNING)
    error = models.TextField(blank=True, default="")
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "garmin_import_batch"


# --- High-volume tier (DECISION PENDING - see docs/garmin-data-model.md) ---
# These tables account for the remaining retrievable data. They are part of
# the proposed schema so the review covers everything; whether the migration
# ships them depends on Thomas's storage choice.


class GarminActivitySample(models.Model):
    """Per-second time series from activity .FIT record messages.

    ~27 source fields per record incl. developer/unknown fields; `extra`
    keeps every field this schema does not type, so nothing is dropped when
    Garmin adds message fields. Estimated volume for a full history import:
    on the order of millions of rows and several hundred MB - see the doc's
    storage math. Not created until the storage decision is made.
    """

    activity = models.ForeignKey(
        GarminActivity, on_delete=models.CASCADE, related_name="samples"
    )
    timestamp = models.DateTimeField()
    position_lat = models.FloatField(null=True, blank=True)
    position_long = models.FloatField(null=True, blank=True)
    altitude_m = models.FloatField(null=True, blank=True)
    speed_mps = models.FloatField(null=True, blank=True)
    distance_m = models.FloatField(null=True, blank=True)
    heart_rate = models.SmallIntegerField(null=True, blank=True)
    cadence = models.SmallIntegerField(null=True, blank=True)
    fractional_cadence = models.FloatField(null=True, blank=True)
    power = models.SmallIntegerField(null=True, blank=True)
    accumulated_power = models.IntegerField(null=True, blank=True)
    stance_time_ms = models.FloatField(null=True, blank=True)
    stance_time_balance = models.FloatField(null=True, blank=True)
    stance_time_percent = models.FloatField(null=True, blank=True)
    step_length_mm = models.FloatField(null=True, blank=True)
    vertical_oscillation_mm = models.FloatField(null=True, blank=True)
    vertical_ratio = models.FloatField(null=True, blank=True)
    # Developer fields + message fields not typed above, verbatim.
    extra = models.JSONField(default=dict)

    class Meta:
        db_table = "garmin_activity_sample"
        constraints = [
            models.UniqueConstraint(fields=["activity", "timestamp"], name="garmin_sample_uniq")
        ]


class GarminMonitoringSample(OwnerModel):
    """Minute-level daily wellness series from monitoring .FIT files.

    Monitoring and newer wellness FIT types (heart rate, stress, body
    battery, HRV, SpO2...) carry one payload per minute or event; the message
    layouts vary by file type and some are not in public FIT profiles yet, so
    the payload stays verbatim JSON. Largest volume in the export (tens of
    millions of points estimated) - decision pending, see the doc.
    """

    source_fit_type = models.CharField(max_length=40)
    timestamp = models.DateTimeField()
    payload = models.JSONField(default=dict)

    class Meta:
        db_table = "garmin_monitoring_sample"
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "source_fit_type", "timestamp"], name="garmin_monitoring_uniq"
            )
        ]
        indexes = [models.Index(fields=["owner", "timestamp"])]


class GarminSegment(OwnerModel):
    """A Strava/Garmin live segment from the export's segment_list files.

    Parsing of the segment_list FIT layout is pending; `payload` keeps the
    segment message verbatim until typed columns are grounded.
    """

    name = models.CharField(max_length=300, blank=True, default="")
    sport = models.CharField(max_length=40, blank=True, default="")
    payload = models.JSONField(default=dict)

    class Meta:
        db_table = "garmin_segment"


class GarminSourceFile(OwnerModel):
    """Preservation manifest: one row per file in the export.

    Every file of the export archive is accounted for here, whether it was
    parsed into tables (status 'parsed'), kept traceable ('retained'), left
    for a later iteration ('deferred') or deliberately not imported
    ('excluded', e.g. account data). This is the completeness guarantee for
    the import: coverage is auditable per file, not asserted overall.
    """

    STATUS_PARSED = "parsed"
    STATUS_RETAINED = "retained"
    STATUS_DEFERRED = "deferred"
    STATUS_EXCLUDED = "excluded"
    STATUS_CHOICES = [
        (STATUS_PARSED, "Parsed into tables"),
        (STATUS_RETAINED, "Retained, traceable"),
        (STATUS_DEFERRED, "Deferred to a later iteration"),
        (STATUS_EXCLUDED, "Excluded by design"),
    ]

    path = models.CharField(max_length=500)
    size_bytes = models.BigIntegerField()
    sha256 = models.CharField(max_length=64, blank=True, default="")
    category = models.CharField(max_length=60)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    note = models.CharField(max_length=300, blank=True, default="")

    class Meta:
        db_table = "garmin_source_file"
        constraints = [
            models.UniqueConstraint(fields=["owner", "path"], name="garmin_sourcefile_uniq")
        ]
