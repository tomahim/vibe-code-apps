"""National League player stats, Hockey Manager data and private fantasy teams.

Data-model proposal for review - see docs/hockey-app-data-model.md for the
verified source contract, open decisions and the Postgres role guide.

Identity: the SIHF licence number is the primary key. Evidence so far (one
paired sample, 2026-11-04: Denis Malgin = 155486) says it matches the
nationalleague.ch API player id and Hockey Manager's "nlid" attribute;
ingestion re-validates the mapping per player and logs mismatches.
"""

from django.conf import settings
from django.db import models


class Position(models.TextChoices):
    GOALIE = "G", "Goalie"
    DEFENCE = "D", "Defenceman"
    FORWARD = "F", "Forward"


class Team(models.Model):
    sihf_team_id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    acronym = models.CharField(max_length=10)
    logo_url = models.URLField(blank=True, default="")
    logo_source = models.CharField(max_length=100, blank=True, default="")
    logo_attribution = models.CharField(max_length=200, blank=True, default="")

    class Meta:
        db_table = "hockey_team"

    def __str__(self):
        return self.acronym


class Player(models.Model):
    # SIHF licence number = nationalleague.ch API playerId = HM "nlid".
    licence_id = models.PositiveIntegerField(primary_key=True)
    hm_id = models.PositiveIntegerField(null=True, blank=True, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    position = models.CharField(max_length=1, choices=Position.choices)
    birth_date = models.DateField(null=True, blank=True)
    # Nationality exactly as Hockey Manager displays it (flag code, e.g. "ch",
    # "fi"), captured from HM's own pages. HM's flag is not necessarily
    # citizenship or import-license eligibility. Blank = never captured.
    hm_nationality = models.CharField(max_length=8, blank=True, default="")
    hm_nationality_source = models.CharField(max_length=100, blank=True, default="")
    hm_nationality_observed_at = models.DateTimeField(null=True, blank=True)
    photo_url = models.URLField(blank=True, default="")
    photo_source = models.CharField(max_length=100, blank=True, default="")
    photo_attribution = models.CharField(max_length=200, blank=True, default="")

    class Meta:
        db_table = "hockey_player"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class PlayerTeamMembership(models.Model):
    """A player's stint with a team within a season (mid-season transfers)."""

    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="memberships")
    team = models.ForeignKey(Team, on_delete=models.PROTECT, related_name="memberships")
    season = models.PositiveSmallIntegerField(help_text="Season end year, e.g. 2027 for 2026/27.")
    from_date = models.DateField()
    to_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "hockey_player_team_membership"
        constraints = [
            models.UniqueConstraint(
                fields=["player", "team", "season", "from_date"], name="hockey_membership_uniq"
            )
        ]


class Game(models.Model):
    game_id = models.BigIntegerField(primary_key=True, help_text="SIHF 14-digit game id.")
    season = models.PositiveSmallIntegerField()
    date = models.DateTimeField()
    home_team = models.ForeignKey(Team, on_delete=models.PROTECT, related_name="home_games")
    away_team = models.ForeignKey(Team, on_delete=models.PROTECT, related_name="away_games")
    home_score = models.PositiveSmallIntegerField(null=True, blank=True)
    away_score = models.PositiveSmallIntegerField(null=True, blank=True)
    went_overtime = models.BooleanField(default=False)
    went_shootout = models.BooleanField(default=False)
    status = models.CharField(max_length=30)
    arena = models.CharField(max_length=100, blank=True, default="")
    spectators = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        db_table = "hockey_game"
        ordering = ["-date"]


class GamePlayerStats(models.Model):
    """Official per-game box-score line (SIHF game overview)."""

    class Side(models.TextChoices):
        HOME = "home", "Home"
        AWAY = "away", "Away"

    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="player_stats")
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="game_stats")
    team_side = models.CharField(max_length=4, choices=Side.choices)
    goals = models.PositiveSmallIntegerField(default=0)
    assists_primary = models.PositiveSmallIntegerField(default=0)
    assists_secondary = models.PositiveSmallIntegerField(default=0)
    penalty_minutes = models.PositiveSmallIntegerField(default=0)
    plus_count = models.PositiveSmallIntegerField(default=0)
    minus_count = models.PositiveSmallIntegerField(default=0)
    toi_seconds = models.PositiveIntegerField(default=0)
    shots_on_goal = models.PositiveSmallIntegerField(default=0)
    shots_blocked = models.PositiveSmallIntegerField(default=0)
    faceoffs_won = models.PositiveSmallIntegerField(default=0)
    faceoffs_lost = models.PositiveSmallIntegerField(default=0)
    # Goalie-only (null for skaters)
    goals_against = models.PositiveSmallIntegerField(null=True, blank=True)
    saves = models.PositiveSmallIntegerField(null=True, blank=True)
    shots_against = models.PositiveSmallIntegerField(null=True, blank=True)
    shutout = models.BooleanField(null=True, blank=True)
    goalie_seconds = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        db_table = "hockey_game_player_stats"
        constraints = [
            models.UniqueConstraint(fields=["game", "player"], name="hockey_game_player_uniq")
        ]
        indexes = [models.Index(fields=["player", "game"])]


class Standing(models.Model):
    """One team's official SIHF standing row at a capture date.

    Official ranking as published by the SIHF statistic site, stored verbatim
    (not computed from results). One snapshot per team per capture date.
    """

    team = models.ForeignKey(Team, on_delete=models.PROTECT, related_name="standings")
    season = models.PositiveSmallIntegerField(help_text="Season end year, e.g. 2027 for 2026/27.")
    captured_on = models.DateField()
    rank = models.PositiveSmallIntegerField()
    games_played = models.PositiveSmallIntegerField()
    points = models.PositiveSmallIntegerField()
    wins = models.PositiveSmallIntegerField(default=0)
    ot_wins = models.PositiveSmallIntegerField(default=0)
    so_wins = models.PositiveSmallIntegerField(default=0)
    so_losses = models.PositiveSmallIntegerField(default=0)
    ot_losses = models.PositiveSmallIntegerField(default=0)
    losses = models.PositiveSmallIntegerField(default=0)
    goals_for = models.PositiveSmallIntegerField(default=0)
    goals_against = models.PositiveSmallIntegerField(default=0)
    source = models.CharField(max_length=100, default="data.sihf.ch standing table")
    source_updated_at = models.DateTimeField(null=True, blank=True,
                                             help_text="updateDateTime reported by the source.")

    class Meta:
        db_table = "hockey_standing"
        constraints = [
            models.UniqueConstraint(
                fields=["team", "season", "captured_on"], name="uniq_standing_snapshot"
            )
        ]
        ordering = ["-captured_on", "rank"]

    def __str__(self):
        return f"{self.rank}. {self.team_id} ({self.captured_on})"


class PlayerWeekStats(models.Model):
    """Materialized weekly aggregates feeding the week-by-week charts."""

    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="week_stats")
    season = models.PositiveSmallIntegerField()
    iso_week = models.PositiveSmallIntegerField()
    games = models.PositiveSmallIntegerField(default=0)
    goals = models.PositiveSmallIntegerField(default=0)
    assists = models.PositiveSmallIntegerField(default=0)
    points = models.PositiveSmallIntegerField(default=0)
    penalty_minutes = models.PositiveSmallIntegerField(default=0)
    plus_minus = models.SmallIntegerField(default=0)
    toi_seconds = models.PositiveIntegerField(default=0)
    shots_on_goal = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = "hockey_player_week_stats"
        constraints = [
            models.UniqueConstraint(fields=["player", "season", "iso_week"], name="hockey_week_uniq")
        ]


class SyncLog(models.Model):
    source = models.CharField(max_length=50)
    started_at = models.DateTimeField()
    finished_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20)
    rows_processed = models.PositiveIntegerField(default=0)
    note = models.TextField(blank=True, default="")

    class Meta:
        db_table = "hockey_sync_log"
        ordering = ["-started_at"]


class HMSource(models.TextChoices):
    TOP_SCORER_PAGE = "top_scorer_page", "HM top-scorer page (account)"
    PUBLIC_PAGES = "public_pages", "HM / partner public pages"


class HMSnapshot(models.Model):
    """Full-league HM state per capture date. HM corrects retroactively, so
    source_observed_at records when we saw each value."""

    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="hm_snapshots")
    captured_on = models.DateField()
    hm_price_m = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    hm_points_season = models.IntegerField(null=True, blank=True)
    hm_points_avg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hm_ownership_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    # HM-supplied per-entity season metrics (HM's own counting, not SIHF stats).
    hm_matches = models.IntegerField(null=True, blank=True)
    hm_goals = models.IntegerField(null=True, blank=True)
    hm_goals_ot = models.IntegerField(null=True, blank=True)
    hm_assists_primary = models.IntegerField(null=True, blank=True)
    hm_assists_secondary = models.IntegerField(null=True, blank=True)
    hm_assists_ot = models.IntegerField(null=True, blank=True)
    hm_gwg = models.IntegerField(null=True, blank=True)
    hm_real_points = models.IntegerField(null=True, blank=True)
    source = models.CharField(max_length=20, choices=HMSource.choices)
    source_observed_at = models.DateTimeField()

    class Meta:
        db_table = "hockey_hm_snapshot"
        constraints = [
            models.UniqueConstraint(fields=["player", "captured_on"], name="hockey_hm_snapshot_uniq")
        ]
        ordering = ["-captured_on"]


class HMPair(models.Model):
    """An HM goalkeeper-pair asset (goalkeepers are priced/scored per club as
    pairs). Identity as HM shows it; player-level stats stay on Player."""

    hm_asset_id = models.PositiveIntegerField(unique=True)
    label = models.CharField(max_length=120)
    team = models.ForeignKey(Team, on_delete=models.PROTECT, related_name="hm_pairs")

    class Meta:
        db_table = "hockey_hm_pair"

    def __str__(self):
        return self.label


class HMPairSnapshot(models.Model):
    """Point-in-time HM state of a goalkeeper pair; same capture semantics as
    HMSnapshot (HM corrects retroactively)."""

    pair = models.ForeignKey(HMPair, on_delete=models.CASCADE, related_name="snapshots")
    captured_on = models.DateField()
    hm_price_m = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    hm_points_season = models.IntegerField(null=True, blank=True)
    hm_points_avg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hm_matches = models.IntegerField(null=True, blank=True)
    hm_assists_primary = models.IntegerField(null=True, blank=True)
    hm_real_points = models.IntegerField(null=True, blank=True)
    source = models.CharField(max_length=20, choices=HMSource.choices)
    source_observed_at = models.DateTimeField()

    class Meta:
        db_table = "hockey_hm_pair_snapshot"
        constraints = [
            models.UniqueConstraint(fields=["pair", "captured_on"], name="hockey_hm_pair_snapshot_uniq")
        ]
        ordering = ["-captured_on"]


class HMPriceEvent(models.Model):
    """HM price history backfill. HM exposes the series as ordinal
    value-change events WITHOUT dates; event_date stays null until the
    repricing-calendar mapping is verified (date_verified)."""

    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="hm_price_events")
    value_change_seq = models.PositiveSmallIntegerField()
    price_m = models.DecimalField(max_digits=4, decimal_places=1)
    event_date = models.DateField(null=True, blank=True)
    date_verified = models.BooleanField(default=False)
    source_observed_at = models.DateTimeField()

    class Meta:
        db_table = "hockey_hm_price_event"
        constraints = [
            models.UniqueConstraint(fields=["player", "value_change_seq"], name="hockey_hm_price_uniq")
        ]


class HMGamePoints(models.Model):
    """HM per-appearance points. Also ordinal on HM's side: game stays null
    until the appearance is matched to an official game with real evidence
    (join_verified), never by ordinal order alone."""

    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="hm_game_points")
    appearance_seq = models.PositiveSmallIntegerField()
    hm_points = models.IntegerField()
    game = models.ForeignKey(Game, on_delete=models.SET_NULL, null=True, blank=True)
    join_verified = models.BooleanField(default=False)
    source_observed_at = models.DateTimeField()

    class Meta:
        db_table = "hockey_hm_game_points"
        constraints = [
            models.UniqueConstraint(fields=["player", "appearance_seq"], name="hockey_hm_points_uniq")
        ]


class InjuryReport(models.Model):
    """A medical-report mention of a player from a watched public news source.

    A row is a dated report, not a current medical state: the source's own
    words (headline/excerpt) are stored verbatim and status_hint is a coarse,
    transparent keyword derivation. Absence of a report is NOT a confirmation
    of health - the UI must never render "healthy".
    """

    class StatusHint(models.TextChoices):
        REPORTED = "reported", "Mentioned in a medical report"
        DAY_TO_DAY = "day_to_day", "Day-to-day"
        OUT = "out", "Out (weeks/months mentioned)"
        OUT_LONG = "out_long", "Out long-term / season"
        RETURNING = "returning", "Comeback / return mentioned"

    player = models.ForeignKey(Player, on_delete=models.CASCADE,
                               related_name="injury_reports")
    published_on = models.DateField()
    headline = models.CharField(max_length=300)
    excerpt = models.TextField(blank=True, default="")
    status_hint = models.CharField(max_length=20, choices=StatusHint.choices,
                                   default=StatusHint.REPORTED)
    source = models.CharField(max_length=100,
                              default="swisshockeynews.ch medical report")
    source_url = models.URLField()
    observed_at = models.DateTimeField()

    class Meta:
        db_table = "hockey_injury_report"
        constraints = [
            models.UniqueConstraint(fields=["player", "source_url"],
                                    name="hockey_injury_report_uniq")
        ]
        ordering = ["-published_on", "-id"]

    def __str__(self):
        return f"{self.player} - {self.headline[:60]}"


class FantasyTeam(models.Model):
    """A user's own fantasy team. Private to its owner; several per user."""

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="hockey_fantasy_teams"
    )
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "hockey_fantasy_team"
        constraints = [
            models.UniqueConstraint(fields=["owner", "name"], name="hockey_fantasy_team_uniq")
        ]

    def __str__(self):
        return self.name


class RosterEntry(models.Model):
    class Source(models.TextChoices):
        MANUAL = "manual", "Manual entry"
        HM_IMPORT = "hm_import", "Imported from Hockey Manager"

    team = models.ForeignKey(FantasyTeam, on_delete=models.CASCADE, related_name="roster")
    player = models.ForeignKey(Player, on_delete=models.PROTECT, related_name="roster_entries")
    position_slot = models.CharField(max_length=1, choices=Position.choices)
    acquired_price_m = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    acquired_on = models.DateField(null=True, blank=True)
    source = models.CharField(max_length=10, choices=Source.choices, default=Source.MANUAL)

    class Meta:
        db_table = "hockey_roster_entry"
        constraints = [
            models.UniqueConstraint(fields=["team", "player"], name="hockey_roster_entry_uniq")
        ]


class FantasyTeamShare(models.Model):
    """Read-only view grant on a fantasy team for another app user.

    Created when another person explicitly agrees to share their team with a
    specific user (e.g. via i2i consent). The owner keeps ownership; viewers
    get read-only API access with the owner labelled. Never grants writes.
    """

    team = models.ForeignKey(FantasyTeam, on_delete=models.CASCADE, related_name="shares")
    viewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="hockey_team_views"
    )
    granted_by = models.CharField(max_length=100, help_text="Provenance, e.g. 'Aurore via i2i consent 2026-11-04'.")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "hockey_fantasy_team_share"
        constraints = [
            models.UniqueConstraint(fields=["team", "viewer"], name="uniq_team_share")
        ]


class FantasyPairEntry(models.Model):
    """An indivisible HM goalie-pair asset on a fantasy roster.

    Hockey Manager sells goalkeepers as pairs; the pair is one fantasy asset
    and must not be collapsed onto one player or split into two invented
    player entries. Player-level stats stay on Player; this records the
    roster slot as HM models it.
    """

    team = models.ForeignKey(FantasyTeam, on_delete=models.CASCADE, related_name="pair_entries")
    label = models.CharField(max_length=120, help_text="As HM shows it, e.g. 'Zumbühl/Hrubec'.")
    hm_asset_id = models.PositiveIntegerField(help_text="HM internal id of the pair asset.")
    nlid_reference = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="nlid shown by HM for the pair (one of the two goalies; reference only).")
    current_price_m = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True,
                                          help_text="Pair price as last observed; not an acquisition cost.")
    source = models.CharField(max_length=10, choices=RosterEntry.Source.choices,
                              default=RosterEntry.Source.HM_IMPORT)

    class Meta:
        db_table = "hockey_fantasy_pair_entry"
        constraints = [
            models.UniqueConstraint(fields=["team", "hm_asset_id"], name="uniq_pair_asset")
        ]

    def __str__(self):
        return f"{self.label} ({self.team_id})"


class TransferSimulation(models.Model):
    """Sandboxed what-if: sells/buys with computed budget and foreigner
    count. Never touches the real Hockey Manager account."""

    team = models.ForeignKey(FantasyTeam, on_delete=models.CASCADE, related_name="simulations")
    name = models.CharField(max_length=100)
    sells = models.ManyToManyField(Player, related_name="simulation_sells", blank=True)
    buys = models.ManyToManyField(Player, related_name="simulation_buys", blank=True)
    computed_budget_after_m = models.DecimalField(
        max_digits=5, decimal_places=1, null=True, blank=True
    )
    computed_foreigners_after = models.PositiveSmallIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "hockey_transfer_simulation"
        ordering = ["-created_at"]
