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

import json
import re
import time
import unicodedata
from datetime import date, datetime, timedelta

import requests
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.hockey.models import (Game, GamePlayerStats, InjuryReport, Player,
                                PlayerTeamMembership, PlayerWeekStats, Standing,
                                SyncLog, Team)

BASE = "https://data.sihf.ch/statistic/api/cms"
SEARCH = "1//1"  # National League (top competition), verified during research
PAUSE = 0.4      # polite spacing between requests


def get_json(path, **params):
    r = requests.get(f"{BASE}{path}", params=params, timeout=30,
                     headers={"User-Agent": "hockey-stats-app/1.0 (personal stats app)"})
    r.raise_for_status()
    return r.json()


SHN_BASE = "https://swisshockeynews.ch"
SHN_MEDICALS = f"{SHN_BASE}/en/national-league/medicals"
SHN_ARTICLE_RE = re.compile(
    # heading level varies by layout slot (h2 featured, h3 hero, h4 list);
    # class attribute may carry extra tokens - match the raxo-title token.
    r'<h[1-6]\b[^>]*class="[^"]*\braxo-title\b[^"]*"[^>]*>\s*'
    r'<a href="(?P<href>/en/shn/medical/[^"]+)"[^>]*>'
    r'(?P<title>.*?)</a>', re.S)
SHN_DATE_RE = re.compile(
    r'<span\b[^>]*class="[^"]*\braxo-date\b[^"]*"[^>]*>'
    r'(\d{2}\.\d{2}\.\d{4})</span>')


def parse_medicals_listing(html, cutoff):
    """Extract (url, headline, published_on) entries from the medicals list.

    The listing renders the same article in several layout slots (featured
    h2, hero h3, list h4), so hrefs repeat: entries are deduplicated by URL
    here, before any per-article fetch budget is spent. Only the first
    listing page exists (no pagination links), so the effective window is
    whatever page 1 shows - roughly the last 2-3 weeks; nightly runs keep
    coverage current and the caller's cutoff only filters page-1 entries.
    """
    entries = []
    seen = set()
    for block in re.findall(r"<article.*?</article>", html, re.S):
        m = SHN_ARTICLE_RE.search(block)
        d = SHN_DATE_RE.search(block)
        if not m or not d:
            continue
        try:
            published = datetime.strptime(d.group(1), "%d.%m.%Y").date()
        except ValueError:
            continue
        if published < cutoff:
            continue
        url = SHN_BASE + m.group("href")
        if url in seen:
            continue
        seen.add(url)
        entries.append({
            "url": url,
            "headline": strip_tags(m.group("title")).strip(),
            "published_on": published,
        })
    return entries


def fetch_text(url):
    """Plain GET of a public HTML page (robots.txt verified: /en/shn/* allowed)."""
    r = requests.get(url, timeout=30,
                     headers={"User-Agent": "hockey-stats-app/1.0 (personal stats app)"})
    r.raise_for_status()
    return r.text


def norm_text(value):
    """Lowercase, strip diacritics, collapse non-alphanumerics to spaces."""
    value = unicodedata.normalize("NFKD", value)
    value = "".join(c for c in value if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def strip_tags(html):
    return re.sub(r"<[^>]+>", " ", html)


def status_hint_for(text):
    """Coarse, transparent keyword derivation from the source's own words.
    The headline/excerpt stay stored verbatim - this hint never replaces them."""
    t = text.lower()
    if "day-to-day" in t or "day to day" in t:
        return InjuryReport.StatusHint.DAY_TO_DAY
    if re.search(r"out for the season|season is over|season-ending|indefinitely|long-term", t):
        return InjuryReport.StatusHint.OUT_LONG
    if re.search(r"comeback|return|back on (the )?ice|on the horizon", t):
        return InjuryReport.StatusHint.RETURNING
    if re.search(r"week|month|absence|out for|sidelined|surgery|suffer|miss", t):
        return InjuryReport.StatusHint.OUT
    return InjuryReport.StatusHint.REPORTED


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


def latest_memberships_current(season):
    """licence_id -> Team of the player's latest membership row this season."""
    latest = {}
    for m in (PlayerTeamMembership.objects.filter(season=season)
              .select_related("team").order_by("from_date")):
        latest[m.player_id] = m.team
    return latest


def mmss_to_seconds(value):
    try:
        m, s = str(value).split(":")
        return int(m) * 60 + int(s)
    except (ValueError, AttributeError):
        return 0





def parse_start(row, state):
    """Official start instant. The results table's date/time strings are local
    Swiss wall time, but the state cell carries startDateTime as ISO WITH the
    correct offset (CET +01:00, CEST +02:00) - parse that so stored instants
    are right in both winter and summer. Fall back to the legacy wall-time
    parse (interpreted under TIME_ZONE) when the cell is absent or malformed."""
    raw = (state or {}).get("startDateTime")
    if raw:
        try:
            start = datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
            if start.tzinfo is None:
                start = timezone.make_aware(start)
            return start
        except ValueError:
            pass  # fall through to the legacy wall-time parse
    day = datetime.strptime(row[1], "%d.%m.%Y").date()
    hh, mm = (row[2].split(":") + ["0"])[:2]
    return timezone.make_aware(datetime(day.year, day.month, day.day,
                                        int(hh), int(mm)))

def result_cells(row):
    """Identify the cells of a results-table row by content, not position
    (column order differs between the default and the Date-filtered query)."""
    result = state = link = None
    ot_flag = ""
    for cell in row:
        if isinstance(cell, dict):
            if cell.get("type") == "result":
                result = cell
            elif cell.get("type") == "linkToGameDetail":
                link = cell
            elif "percent" in cell:
                state = cell
        elif isinstance(cell, str) and cell in ("OT", "SO"):
            ot_flag = cell
    return result, state, link, ot_flag

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
                                     "weeks", "check", "injuries", "nationality", "all"])
        parser.add_argument("--file", default="",
                            help="nationality phase: HM capture JSON "
                                 '[{"hm_id": 134, "name": "Sven Andrighetto", "club": "ZSC", '
                                 '"flag": "ch", "kind": "player"}, ...] from the HM '
                                 "/fr/transfers-classic list (one page, flag image code). "
                                 "kind 'pair' rows are skipped (goalie pairs are not players).")
        parser.add_argument("--lookback", type=int, default=60,
                            help="injuries phase: only process medical reports from the last N days.")
        parser.add_argument("--max-articles", type=int, default=25,
                            help="injuries phase: cap article-page fetches per run (politeness).")
        parser.add_argument("--sleep", type=float, default=PAUSE)
        parser.add_argument("--dry-run", action="store_true")

    def handle(self, *args, **opts):
        self.season = opts["season"]
        self.sleep = opts["sleep"]
        self.dry = opts["dry_run"]
        self.file = opts["file"]
        self.lookback = opts["lookback"]
        self.max_articles = opts["max_articles"]
        phases = (["teams", "standings", "games", "players", "weeks", "injuries", "check"]
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
        teams = {t.sihf_team_id: t for t in Team.objects.all()}
        objs = []
        for row in rows:
            try:
                result, state, link, ot_flag = result_cells(row)
                start = parse_start(row, state)
                home = teams[row[3]["id"]]
                away = teams[row[4]["id"]]
                if not link:
                    continue
                objs.append(Game(
                    game_id=int(link["gameId"]), season=self.season, date=start,
                    home_team=home, away_team=away,
                    home_score=(to_int(result["homeTeam"], None)
                                if result and result.get("homeTeam", "-") != "-" else None),
                    away_score=(to_int(result["awayTeam"], None)
                                if result and result.get("awayTeam", "-") != "-" else None),
                    went_overtime=ot_flag == "OT", went_shootout=ot_flag == "SO",
                    status=str(state.get("name") or "") if state else ""))
            except (KeyError, ValueError, IndexError) as exc:
                self.stderr.write(f"skip results row: {exc} {row!r}"[:300])
        if not self.dry:
            Game.objects.bulk_create(
                objs, update_conflicts=True, unique_fields=["game_id"],
                update_fields=["season", "date", "home_team", "away_team",
                               "home_score", "away_score", "went_overtime",
                               "went_shootout", "status"])
        return len(objs)

    # -- players + per-game stats -------------------------------------------
    def sync_players(self):
        games = (Game.objects.filter(season=self.season)
                 .exclude(home_score__isnull=True)
                 .filter(player_stats__isnull=True)  # resume: only games without stats
                 .order_by("date").distinct())
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
                n += self._game_rows(game, detail, roster, names)
        return n

    def _game_rows(self, game, detail, roster, names):
        """One game's writes in bulk: a handful of queries instead of one
        round trip per row (the production pooler makes per-row upserts
        take minutes for a full season)."""
        pending = []  # (side, team_id, row, is_goalie)
        for block in detail.get("stats", []):
            alias = block.get("alias") or ""
            if not (alias.startswith("gamePlayerStats")
                    or alias.startswith("gameGoalieStats")):
                continue
            side = "home" if alias.endswith("Home") else "away"
            team_id = game.home_team_id if side == "home" else game.away_team_id
            for row in block.get("data", []):
                pending.append((side, team_id, row,
                                alias.startswith("gameGoalieStats")))
        wanted = {}  # licence_id -> (first, last, position, team_id)
        for side, team_id, row, is_goalie in pending:
            licence_id = roster.get((team_id, str(row[0])))
            if not licence_id:
                continue
            full = names.get(licence_id, "").strip()
            last, _, first = full.partition(" ")
            if is_goalie:
                pos = "G"
            else:
                pos = "D" if str(row[2]).lower().startswith("vert") else "F"
            wanted[licence_id] = (first or full, last or full, pos, team_id)
        if not wanted:
            return 0
        existing = {pl.licence_id: pl for pl in
                    Player.objects.filter(licence_id__in=wanted)}
        for licence_id, (first, last, pos, _t) in wanted.items():
            if licence_id in existing:
                pl = existing[licence_id]
                changed = []
                if first and pl.first_name != first:
                    pl.first_name, changed = first, changed + ["first_name"]
                if last and pl.last_name != last:
                    pl.last_name, changed = last, changed + ["last_name"]
                if pl.position != pos:
                    pl.position, changed = pos, changed + ["position"]
                if changed:
                    pl.save(update_fields=changed)
        Player.objects.bulk_create(
            [Player(licence_id=lid, first_name=v[0], last_name=v[1],
                    position=v[2])
             for lid, v in wanted.items() if lid not in existing],
            ignore_conflicts=True)
        players = {pl.licence_id: pl for pl in
                   Player.objects.filter(licence_id__in=wanted)}
        season_start = date(self.season - 1, 8, 1)
        known_teams = set(Team.objects.filter(
            sihf_team_id__in={v[3] for v in wanted.values()}
        ).values_list("sihf_team_id", flat=True))
        PlayerTeamMembership.objects.bulk_create(
            [PlayerTeamMembership(player=players[lid],
                                  team_id=v[3], season=self.season,
                                  from_date=season_start)
             for lid, v in wanted.items() if v[3] in known_teams],
            ignore_conflicts=True)
        rows = []
        for side, team_id, row, is_goalie in pending:
            licence_id = roster.get((team_id, str(row[0])))
            player = players.get(licence_id)
            if player is None:
                continue
            if is_goalie:
                seconds = mmss_to_seconds(row[6])
                rows.append(GamePlayerStats(
                    game=game, player=player, team_side=side,
                    penalty_minutes=to_int(row[8]),
                    goals_against=to_int(row[2]), saves=to_int(row[3]),
                    shots_against=to_int(row[4]),
                    shutout=bool(to_int(row[2]) == 0 and seconds > 0),
                    goalie_seconds=seconds))
            else:
                plus_minus = to_int(row[9])
                rows.append(GamePlayerStats(
                    game=game, player=player, team_side=side,
                    goals=to_int(row[3]),
                    assists_primary=to_int(row[5]),
                    assists_secondary=to_int(row[6]),
                    penalty_minutes=to_int(row[8]),
                    plus_count=max(plus_minus, 0),
                    minus_count=max(-plus_minus, 0),
                    shots_on_goal=to_int(row[10]),
                    shots_blocked=to_int(row[13]),
                    faceoffs_won=to_int(row[14]),
                    faceoffs_lost=to_int(row[15]),
                    toi_seconds=mmss_to_seconds(row[17])))
        GamePlayerStats.objects.bulk_create(
            rows, update_conflicts=True,
            unique_fields=["game", "player"],
            update_fields=["team_side", "goals", "assists_primary",
                           "assists_secondary", "penalty_minutes",
                           "plus_count", "minus_count", "shots_on_goal",
                           "shots_blocked", "faceoffs_won", "faceoffs_lost",
                           "toi_seconds", "goals_against", "saves",
                           "shots_against", "shutout", "goalie_seconds"])
        return len(rows)

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
        objs = [PlayerWeekStats(player_id=pid, season=self.season, iso_week=week, **a)
                for (pid, week), a in agg.items()]
        if not self.dry:
            PlayerWeekStats.objects.bulk_create(
                objs, update_conflicts=True,
                unique_fields=["player", "season", "iso_week"],
                update_fields=["games", "goals", "assists", "points",
                               "penalty_minutes", "plus_minus", "toi_seconds",
                               "shots_on_goal"])
        return len(objs)

    # -- injury reports (swisshockeynews.ch medicals, public) ----------------
    def sync_injuries(self):
        """Latest NL medical reports -> hockey_injury_report.

        Public news source, no login. One list page plus at most
        --max-articles article pages (polite sleep; the cap applies after
        URL dedup so duplicate layout slots never burn fetch budget).
        Players are matched by
        exact full name against the roster database; ambiguous same-name
        matches need a club mention, otherwise the article is skipped and
        logged - never guessed. Idempotent via the (player, source_url) key.
        """
        listing = fetch_text(SHN_MEDICALS)
        cutoff = date.today() - timedelta(days=self.lookback)
        entries = parse_medicals_listing(listing, cutoff)
        self.stdout.write(
            f"medicals list: {len(entries)} unique in-window articles "
            f"(page-1 window only, see parse_medicals_listing docstring)")
        players = list(Player.objects.all())
        by_name = {}
        for pl in players:
            by_name.setdefault(norm_text(f"{pl.first_name} {pl.last_name}"), []).append(pl)
        teams_of = latest_memberships_current(self.season)
        n = 0
        fetched = 0
        for e in entries:
            matched = self._match_players(e["headline"], by_name, teams_of)
            body_paras = []
            if fetched < self.max_articles:
                page = fetch_text(e["url"])
                fetched += 1
                time.sleep(self.sleep)
                h1 = re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S)
                if h1:
                    e["headline"] = strip_tags(h1.group(1)).strip() or e["headline"]
                body_paras = [strip_tags(x).strip()
                              for x in re.findall(r"<p[^>]*>(.*?)</p>", page, re.S)]
                body_paras = [x for x in body_paras
                              if len(x) > 40 and "passkey" not in x.lower()]
                if not matched:
                    matched = self._match_players(
                        e["headline"] + " " + " ".join(body_paras), by_name, teams_of)
            if not matched:
                self.stdout.write(f"no player match: {e['headline'][:90]}")
                continue
            for player in matched:
                excerpt = next(
                    (x for x in body_paras
                     if norm_text(player.last_name) in norm_text(x)), "")
                defaults = {
                    "published_on": e["published_on"],
                    "headline": e["headline"][:300],
                    "excerpt": excerpt[:1000],
                    "status_hint": status_hint_for(e["headline"] + " " + excerpt),
                    "observed_at": timezone.now(),
                }
                if not self.dry:
                    InjuryReport.objects.update_or_create(
                        player=player, source_url=e["url"], defaults=defaults)
                n += 1
        return n

    def _match_players(self, text, by_name, teams_of):
        """Players whose exact normalized full name appears in the text.
        Same-name players require exactly one club name/acronym mention."""
        hay = " " + norm_text(text) + " "
        found = []
        for key, candidates in by_name.items():
            if f" {key} " not in hay:
                continue
            if len(candidates) == 1:
                found.append(candidates[0])
                continue
            def club_mentioned(t):
                if t is None:
                    return False
                tokens = {norm_text(t.name), norm_text(t.acronym)}
                words = [w for w in norm_text(t.name).split() if len(w) >= 3]
                if words:
                    tokens.add(max(words, key=len))  # e.g. "kloten" from "EHC Kloten"
                return any(f" {tok} " in hay for tok in tokens if tok)

            clubs = [t for t in (teams_of.get(pl.licence_id) for pl in candidates)
                     if club_mentioned(t)]
            if len(clubs) == 1:
                pl = next(pl for pl in candidates
                          if teams_of.get(pl.licence_id)
                          and teams_of[pl.licence_id].pk == clubs[0].pk)
                found.append(pl)
            else:
                self.stdout.write(f"ambiguous name skipped: {key}")
        return found

    # -- HM nationality (Swiss/foreign) import -------------------------------
    def sync_nationality(self):
        """Apply an HM capture of /fr/transfers-classic (one page, every
        purchasable player with HM's own flag image code) to hockey_player.

        The capture JSON is produced by the browser-side HM read (the same
        infrequent, account-scoped read as the HM snapshot capture):
          [{"hm_id": 134, "name": "Sven Andrighetto", "club": "ZSC",
            "flag": "ch", "kind": "player"}, ...]
        Join order: Player.hm_id (HM's internal id), else normalized full
        name + current club acronym. kind="pair" rows (goalie pairs) are
        skipped - nationality is per player. Unmatched rows are logged,
        never guessed. Only changed rows are written."""
        if not self.file:
            raise CommandError("nationality phase needs --file <capture.json>")
        rows = json.load(open(self.file))
        teams_of = latest_memberships_current(self.season)
        by_hm = {pl.hm_id: pl for pl in Player.objects.exclude(hm_id__isnull=True)}
        by_name = {}
        for pl in Player.objects.all():
            by_name.setdefault((norm_text(f"{pl.first_name} {pl.last_name}"),
                                (teams_of.get(pl.licence_id).acronym.lower()
                                 if teams_of.get(pl.licence_id) else "")), []).append(pl)
        observed = timezone.now()
        n = 0
        for row in rows:
            if row.get("kind", "player") != "player":
                continue  # goalie-pair market rows are not players
            flag = str(row.get("flag") or "").strip().lower()
            if not flag:
                continue
            player = by_hm.get(row.get("hm_id"))
            if player is None:
                key = (norm_text(str(row.get("name", ""))),
                       str(row.get("club", "")).strip().lower())
                cand = by_name.get(key, [])
                if len(cand) == 1:
                    player = cand[0]
            if player is None:
                self.stdout.write(f"no player match: {row.get('name')!r} "
                                  f"(hm_id={row.get('hm_id')})")
                continue
            if player.hm_nationality != flag:
                player.hm_nationality = flag
                player.hm_nationality_source = "HM /fr/transfers-classic flag"
                player.hm_nationality_observed_at = observed
                if not self.dry:
                    player.save(update_fields=["hm_nationality",
                                               "hm_nationality_source",
                                               "hm_nationality_observed_at"])
            n += 1
        return n

    # -- reconciliation ------------------------------------------------------
    def sync_check(self):
        """Compare stored games/stats against the official results table."""
        official = set()
        for row in results_table(self.season).get("data", []):
            result, state, link, ot_flag = result_cells(row)
            if link and state and state.get("percent") == 100:
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
