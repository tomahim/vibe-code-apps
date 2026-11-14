"""Garmin Connect history: sports activities and their splits/laps.

Scope set by Thomas (2026-11-14): no daily fitness, sleep, continuous
wellness, per-second samples, segments, or gear/equipment data.

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
    # Value-level decode of known FIT messages (sessions/laps/events/sport/
    # zones/hrv), keyed by FIT field number - no semantic mapping, so
    # nothing is guessed. Undocumented message types stay raw-bytes-only.
    fit_messages = models.JSONField(default=dict)
    # Per-second record messages counted during the scan (decoded records
    # themselves only when the gated high-volume import is enabled).
    record_count = models.BigIntegerField(null=True, blank=True)

    class Meta:
        db_table = "garmin_activity_file"


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
