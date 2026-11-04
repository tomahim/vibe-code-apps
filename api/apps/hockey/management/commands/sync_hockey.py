"""Sync National League data from the official SIHF statistic site.

Sources (all data.sihf.ch, the league's official statistic site; read-only):
- standing table   -> hockey_standing (official published ranking, verbatim)
- results table    -> hockey_game (official 14-digit game ids)
- game detail/box  -> hockey_player + hockey_game_player_stats (licence ids)
- weekly aggregates recomputed from stored game stats

Idempotent by design: every write is an upsert on a natural key or a
unique-constrained snapshot key, so running the command twice changes no
counts. A SyncLog row per phase records what happened.
"""

import time
from datetime import date, datetime

import requests
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.hockey.models import (Game, GamePlayerStats, Player, PlayerTeamMembership,
                                PlayerWeekStats, Standing, SyncLog, Team)

BASE = "https://data.sihf.ch/statistic/api/cms"
SEARCH = "1//1"  # National League (top competition), verified during research
PAUSE = 0.4      # polite spacing between requests


def get_json(path, **params):
    r = requests.get(f"{BASE}{path}", params=params, timeout=30,
                     headers={"User-Agent": "hockey-stats-app/1.0 (personal stats app)"})
    r.raise_for_status()
    return r.json()


def table(alias, season, page=None):
    params = {"alias": alias, "searchQuery": SEARCH, "language": "en",
              "filterBy": "Season", "filterQuery": str(season)}
    return get_json("/table", **params)


def results_table(season):
    """Full-season results via the official Season+Date filter (one request,
    every game incl. future ones - the plain Season filter returns only the
    latest page of six)."""
    return get_json("/table", alias="results", searchQuery=SEARCH, language="en",
                    filterBy="Season,Date",
                    filterQuery=f"{season}/01.07.{season-1}-30.06.{season}")


def game_detail(game_id):
    return get_json("/gameoverview", alias="gameDetail", searchQuery=str(game_id),
                    language="en")


def mmss_to_seconds(value):
    try:
        m, s = str(value).split(":")
        return int(m) * 60 + int(s)
    except (ValueError, AttributeError):
        return 0


def to_int(value, default=0):
    try:
        return int(str(value).replace(",", ""))
    except (ValueError, TypeError):
        return default


class Command(BaseCommand):
    help = "Sync NL teams, standings, games, players and stats from data.sihf.ch"

    def add_arguments(self, parser):
        parser.add_argument("--season", type=int, default=2027,
                            help="Season end year (2027 = 2026/27).")
        parser.add_argument("--phase", default="all",
                            choices=["teams", "standings", "games", "players",
                                     "weeks", "check", "all"])
        parser.add_argument("--sleep", type=float, default=PAUSE)
        parser.add_argument("--dry-run", action="store_true")

    def handle(self, *args, **opts):
        self.season = opts["season"]
        self.sleep = opts["sleep"]
        self.dry = opts["dry_run"]
        phases = (["teams", "standings", "games", "players", "weeks", "check"]
                  if opts["phase"] == "all" else [opts["phase"]])
        for phase in phases:
            log = None if self.dry else SyncLog.objects.create(
                source=f"sihf:{phase}", started_at=timezone.now(), status="running")
            try:
                n = getattr(self, f"sync_{phase}")()
                self.stdout.write(self.style.SUCCESS(f"{phase}: {n} rows processed"))
                if log:
                    log.status, log.rows_processed = "ok", n
            except Exception as exc:
                if log:
                    log.status, log.note = "error", str(exc)[:2000]
                    log.finished_at = timezone.now()
                    log.save(update_fields=["status", "note", "finished_at"])
                raise CommandError(f"{phase} failed: {exc}")
            if log:
                log.finished_at = timezone.now()
                log.save(update_fields=["status", "rows_processed", "finished_at"])

    # -- teams ---------------------------------------------------------------
    def sync_teams(self):
        found = {}

        def add(obj):
            if isinstance(obj, dict) and obj.get("type") == "team" and obj.get("id"):
                found[obj["id"]] = (obj.get("name", ""), obj.get("acronym", ""))

        for row in table("standing", self.season).get("data", []):
            add(row[1] if len(row) > 1 else None)
        for row in table("player", self.season).get("data", []):
            add(row[2] if len(row) > 2 else None)
        n = 0
        for team_id, (name, acronym) in sorted(found.items()):
            if not self.dry:
                Team.objects.update_or_create(
                    sihf_team_id=team_id, defaults={"name": name, "acronym": acronym})
            n += 1
        return n

    # -- standings -----------------------------------------------------------
    def sync_standings(self):
        payload = table("standing", self.season)
        updated = payload.get("updateDateTime")
        updated_dt = None
        if updated:
            try:
                updated_dt = datetime.fromisoformat(updated.replace("Z", "+00:00"))
            except ValueError:
                updated_dt = None
        today = date.today()
        n = 0
        for row in payload.get("data", []):
            team_obj = row[1]
            team = Team.objects.filter(sihf_team_id=team_obj["id"]).first()
            if team is None:
                continue  # run the teams phase first
            defaults = dict(
                rank=to_int(row[0]), games_played=to_int(row[2]),
                points=to_int(row[3]), wins=to_int(row[5]),
                ot_wins=to_int(row[6]), so_wins=to_int(row[7]),
                so_losses=to_int(row[8]), ot_losses=to_int(row[9]),
                losses=to_int(row[10]), goals_for=to_int(row[11]),
                goals_against=to_int(row[12]),
                source="data.sihf.ch standing table",
                source_updated_at=updated_dt)
            if not self.dry:
                Standing.objects.update_or_create(
                    team=team, season=self.season, captured_on=today, defaults=defaults)
            n += 1
        return n

    # -- games ---------------------------------------------------------------
    def sync_games(self):
        rows = results_table(self.season).get("data", [])
        n = 0
        for row in rows:
            try:
                day = datetime.strptime(row[1], "%d.%m.%Y").date()
                hh, mm = (row[2].split(":") + ["0"])[:2]
                start = timezone.make_aware(datetime(day.year, day.month, day.day,
                                                     int(hh), int(mm)))
                home = Team.objects.get(sihf_team_id=row[3]["id"])
                away = Team.objects.get(sihf_team_id=row[4]["id"])
                result = row[5] if isinstance(row[5], dict) else {}
                state = row[7] if isinstance(row[7], dict) else {}
                link = next((c for c in row if isinstance(c, dict)
                             and c.get("type") == "linkToGameDetail"), None)
                if not link:
                    continue
                ot_flag = str(row[8] or "")
                defaults = dict(
                    season=self.season, date=start, home_team=home, away_team=away,
                    home_score=to_int(result.get("homeTeam"), None) if result else None,
                    away_score=to_int(result.get("awayTeam"), None) if result else None,
                    went_overtime=ot_flag == "OT", went_shootout=ot_flag == "SO",
                    status=str(state.get("name") or ""))
                if not self.dry:
                    Game.objects.update_or_create(game_id=int(link["gameId"]),
                                                  defaults=defaults)
                n += 1
            except (KeyError, Team.DoesNotExist, ValueError, IndexError) as exc:
                self.stderr.write(f"skip results row: {exc} {row!r}"[:300])
        return n

    # -- players + per-game stats -------------------------------------------
    def sync_players(self):
        games = Game.objects.filter(season=self.season).exclude(
            home_score__isnull=True).order_by("date")
        n = 0
        for game in games:
            detail = game_detail(game.game_id)
            time.sleep(self.sleep)
            roster = {}  # (team_id, jersey) -> licence id
            names = {}
            for p in detail.get("players", []):
                key = (p.get("teamId"), str(p.get("jerseyNumber")))
                roster[key] = p.get("id")
                names[p.get("id")] = p.get("fullName", "")
            with transaction.atomic():
                for block in detail.get("stats", []):
                    alias = block.get("alias") or ""
                    if not (alias.startswith("gamePlayerStats")
                            or alias.startswith("gameGoalieStats")):
                        continue
                    side = "home" if alias.endswith("Home") else "away"
                    team_id = game.home_team_id if side == "home" else game.away_team_id
                    for row in block.get("data", []):
                        if alias.startswith("gamePlayerStats"):
                            n += self._skater_row(game, side, team_id, roster, names, row)
                        else:
                            n += self._goalie_row(game, side, team_id, roster, names, row)
        return n

    def _player(self, licence_id, names, team_id):
        full = names.get(licence_id, "").strip()
        last, _, first = full.partition(" ")
        player, created = Player.objects.get_or_create(
            licence_id=licence_id,
            defaults={"first_name": first or full, "last_name": last or full,
                      "position": "F"})
        if not created and (first or last):
            player.first_name, player.last_name = first or full, last or full
            player.save(update_fields=["first_name", "last_name"])
        team = Team.objects.filter(sihf_team_id=team_id).first()
        if team is not None:
            PlayerTeamMembership.objects.update_or_create(
                player=player, team=team, season=self.season,
                defaults={"from_date": date(self.season - 1, 8, 1)})
        return player

    def _skater_row(self, game, side, team_id, roster, names, row):
        # header: number, player, position, goals, assists, a1, a2, points,
        #         pim, +/-, sog, missed, post, blocks, foW, foL, fo%, toi, ...
        licence_id = roster.get((team_id, str(row[0])))
        if not licence_id or self.dry:
            return 1 if licence_id else 0
        player = self._player(licence_id, names, team_id)
        pos = "D" if str(row[2]).lower().startswith("vert") else "F"
        if player.position != pos:
            player.position = pos
            player.save(update_fields=["position"])
        plus_minus = to_int(row[9])
        GamePlayerStats.objects.update_or_create(
            game=game, player=player,
            defaults=dict(
                team_side=side, goals=to_int(row[3]),
                assists_primary=to_int(row[5]), assists_secondary=to_int(row[6]),
                penalty_minutes=to_int(row[8]),
                plus_count=max(plus_minus, 0), minus_count=max(-plus_minus, 0),
                shots_on_goal=to_int(row[10]), shots_blocked=to_int(row[13]),
                faceoffs_won=to_int(row[14]), faceoffs_lost=to_int(row[15]),
                toi_seconds=mmss_to_seconds(row[17])))
        return 1

    def _goalie_row(self, game, side, team_id, roster, names, row):
        # header: number, player, goalsAgainst, saves, shotsAgainst,
        #         saves%, secondsPlayed, gaa, pim
        licence_id = roster.get((team_id, str(row[0])))
        if not licence_id or self.dry:
            return 1 if licence_id else 0
        player = self._player(licence_id, names, team_id)
        if player.position != "G":
            player.position = "G"
            player.save(update_fields=["position"])
        seconds = mmss_to_seconds(row[6])
        GamePlayerStats.objects.update_or_create(
            game=game, player=player,
            defaults=dict(
                team_side=side, penalty_minutes=to_int(row[8]),
                goals_against=to_int(row[2]), saves=to_int(row[3]),
                shots_against=to_int(row[4]),
                shutout=bool(to_int(row[2]) == 0 and seconds > 0),
                goalie_seconds=seconds))
        return 1

    # -- weekly aggregates ---------------------------------------------------
    def sync_weeks(self):
        stats = (GamePlayerStats.objects
                 .filter(game__season=self.season)
                 .select_related("game"))
        agg = {}
        for s in stats:
            week = s.game.date.isocalendar().week
            key = (s.player_id, week)
            a = agg.setdefault(key, dict(games=0, goals=0, assists=0, points=0,
                                         penalty_minutes=0, plus_minus=0,
                                         toi_seconds=0, shots_on_goal=0))
            a["games"] += 1
            a["goals"] += s.goals
            a["assists"] += s.assists_primary + s.assists_secondary
            a["points"] += s.goals + s.assists_primary + s.assists_secondary
            a["penalty_minutes"] += s.penalty_minutes
            a["plus_minus"] += s.plus_count - s.minus_count
            a["toi_seconds"] += s.toi_seconds
            a["shots_on_goal"] += s.shots_on_goal
        n = 0
        for (player_id, week), a in agg.items():
            if not self.dry:
                PlayerWeekStats.objects.update_or_create(
                    player_id=player_id, season=self.season, iso_week=week, defaults=a)
            n += 1
        return n

    # -- reconciliation ------------------------------------------------------
    def sync_check(self):
        """Compare stored games/stats against the official results table."""
        official = set()
        for row in results_table(self.season).get("data", []):
            link = next((c for c in row if isinstance(c, dict)
                         and c.get("type") == "linkToGameDetail"), None)
            state = row[7] if len(row) > 7 and isinstance(row[7], dict) else {}
            if link and state.get("percent") == 100:
                official.add(int(link["gameId"]))
        stored = set(Game.objects.filter(season=self.season)
                     .values_list("game_id", flat=True))
        missing = sorted(official - stored)
        games_without_stats = [g.game_id for g in Game.objects.filter(
            season=self.season, game_id__in=official) if not g.player_stats.exists()]
        self.stdout.write(f"official completed games: {len(official)}")
        self.stdout.write(f"stored games: {len(stored & official)}")
        self.stdout.write(f"missing games: {missing or 'none'}")
        self.stdout.write(f"stored games without player stats: "
                          f"{games_without_stats or 'none'}")
        return len(official)
