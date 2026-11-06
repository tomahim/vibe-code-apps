"""JSON API for the hockey stats app. All endpoints except health require
the shared JWT sign-in. Fantasy teams, rosters and simulations are strictly
owner-scoped: no cross-user visibility anywhere."""
from collections import defaultdict
from decimal import Decimal

from django.db.models import Count, F, Sum, Window
from django.db.models.functions import Rank
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_http_methods

from apps.accounts.decorators import jwt_required

from .models import (
    FantasyTeamShare,
    FantasyTeam, Game, GamePlayerStats, HMSnapshot, InjuryReport, Player,
    PlayerTeamMembership,
    PlayerWeekStats, Team, RosterEntry, TransferSimulation,
    Standing, HMPair, HMPairSnapshot)

CURRENT_SEASON = 2027  # 2026/27
INITIAL_BUDGET_M = Decimal("140.0")


def _sort_values():
    """Supported /hockey/players sort keys -> value extractor from the player dict.

    "price" is the latest HM price (HM domain); the stat keys are SIHF season
    totals. The two domains stay explicitly distinct in the response.
    """
    return {
        "name": lambda d: d["name"].lower(),
        "games": lambda d: d["season"]["games"],
        "goals": lambda d: d["season"]["goals"],
        "assists": lambda d: d["season"]["assists"],
        "points": lambda d: d["season"]["points"],
        "price": lambda d: float(d["hm"]["price_m"]) if d["hm"]["price_m"] is not None else None,
    }


SORT_KEYS = _sort_values()


def err(message, status=400):
    return JsonResponse({"error": message}, status=status)


def health(request):
    return JsonResponse({"ok": True, "app": "hockey"})


def season_from(request):
    try:
        return int(request.GET.get("season", CURRENT_SEASON))
    except (TypeError, ValueError):
        return CURRENT_SEASON


def season_totals(season, licence_ids=None):
    """Per-player season aggregates from official box-score lines."""
    rows = GamePlayerStats.objects.filter(game__season=season)
    if licence_ids:
        rows = rows.filter(player_id__in=licence_ids)
    return {
        r["player_id"]: r
        for r in rows.values("player_id").annotate(
            games=Count("game", distinct=True),
            goals=Sum("goals"),
            assists=Sum("assists_primary") + Sum("assists_secondary"),
            penalty_minutes=Sum("penalty_minutes"),
            plus_minus=Sum("plus_count") - Sum("minus_count"),
            toi_seconds=Sum("toi_seconds"),
            shots_on_goal=Sum("shots_on_goal"),
        )
    }


def latest_memberships(season, licence_ids=None):
    rows = PlayerTeamMembership.objects.filter(season=season).select_related("team")
    if licence_ids:
        rows = rows.filter(player_id__in=licence_ids)
    latest = {}
    for m in rows.order_by("from_date"):
        latest[m.player_id] = m  # ordered: last one wins = current stint
    return latest


def latest_injuries(licence_ids=None):
    """Most recent injury report per player. None = no report found, which is
    not a confirmation of health."""
    qs = InjuryReport.objects.all()
    if licence_ids:
        qs = qs.filter(player_id__in=licence_ids)
    latest = {}
    for r in qs.order_by("player_id", "-published_on", "-id"):
        latest.setdefault(r.player_id, r)
    return latest


def injury_dict(r):
    if r is None:
        return None
    return {
        "status_hint": r.status_hint,
        "headline": r.headline,
        "excerpt": r.excerpt,
        "url": r.source_url,
        "source": r.source,
        "published_on": r.published_on.isoformat(),
        "observed_at": r.observed_at.isoformat() if r.observed_at else None,
    }


def nationality_dict(p):
    """Nationality exactly as HM displays it (its flag code), never inferred."""
    return {
        "code": p.hm_nationality or None,
        "source": p.hm_nationality_source or None,
        "observed_at": (p.hm_nationality_observed_at.isoformat()
                        if p.hm_nationality_observed_at else None),
    }


def latest_hm():
    """Most recent HM snapshot per player (price/points). Empty until HM sync runs."""
    ranked = HMSnapshot.objects.annotate(
        rnk=Window(expression=Rank(), partition_by=[F("player_id")], order_by=F("captured_on").desc())
    ).filter(rnk=1)
    return {s.player_id: s for s in ranked}


def player_dict(p, season, totals, memberships, hm, injuries=None):
    t = totals.get(p.licence_id, {})
    m = memberships.get(p.licence_id)
    snap = hm.get(p.licence_id)
    return {
        "licence_id": p.licence_id,
        "name": f"{p.first_name} {p.last_name}",
        "position": p.position,
        "birth_date": p.birth_date.isoformat() if p.birth_date else None,
        "team": {"id": m.team.sihf_team_id, "name": m.team.name, "acronym": m.team.acronym} if m else None,
        "photo_url": p.photo_url or None,
        "nationality": nationality_dict(p),
        "injury": injury_dict((injuries or {}).get(p.licence_id)),
        "season": {
            "games": t.get("games", 0), "goals": t.get("goals", 0),
            "assists": t.get("assists", 0),
            "points": (t.get("goals") or 0) + (t.get("assists") or 0),
            "penalty_minutes": t.get("penalty_minutes", 0),
            "plus_minus": t.get("plus_minus", 0),
            "toi_seconds": t.get("toi_seconds", 0),
            "shots_on_goal": t.get("shots_on_goal", 0),
        },
        "hm": {
            "price_m": str(snap.hm_price_m) if snap and snap.hm_price_m is not None else None,
            "points_season": snap.hm_points_season if snap else None,
            "points_avg": str(snap.hm_points_avg) if snap and snap.hm_points_avg is not None else None,
            "matches": snap.hm_matches if snap else None,
            "goals": snap.hm_goals if snap else None,
            "assists_primary": snap.hm_assists_primary if snap else None,
            "assists_secondary": snap.hm_assists_secondary if snap else None,
            "gwg": snap.hm_gwg if snap else None,
            "real_points": snap.hm_real_points if snap else None,
            "captured_on": snap.captured_on.isoformat() if snap else None,
        },
    }


@jwt_required
@require_GET
def hm_pairs(request):
    """League-wide HM goalkeeper pairs with their latest snapshot."""
    latest = {}
    for s in HMPairSnapshot.objects.select_related("pair__team").annotate(
            rnk=Window(expression=Rank(), partition_by=[F("pair_id")],
                       order_by=F("captured_on").desc())).filter(rnk=1):
        latest[s.pair_id] = s
    data = []
    for pair in HMPair.objects.select_related("team").order_by("-hm_asset_id"):
        s = latest.get(pair.pk)
        data.append({
            "hm_asset_id": pair.hm_asset_id,
            "label": pair.label,
            "team": {"id": pair.team.sihf_team_id, "name": pair.team.name,
                     "acronym": pair.team.acronym},
            "snapshot": {
                "price_m": str(s.hm_price_m) if s and s.hm_price_m is not None else None,
                "points_season": s.hm_points_season if s else None,
                "points_avg": str(s.hm_points_avg) if s and s.hm_points_avg is not None else None,
                "matches": s.hm_matches if s else None,
                "captured_on": s.captured_on.isoformat() if s else None,
            } if s else None,
        })
    return JsonResponse({"pairs": data})


@jwt_required
@require_GET
def teams(request):
    data = [{"id": t.sihf_team_id, "name": t.name, "acronym": t.acronym, "logo_url": t.logo_url or None}
            for t in Team.objects.order_by("name")]
    return JsonResponse({"teams": data})


@jwt_required
@require_GET
def players(request):
    season = season_from(request)
    qs = Player.objects.all().order_by("last_name", "first_name")
    team_id = request.GET.get("team")
    if team_id:
        qs = qs.filter(memberships__team_id=team_id, memberships__season=season).distinct()
    position = request.GET.get("position")
    if position in {"G", "D", "F"}:
        qs = qs.filter(position=position)
    q = request.GET.get("q", "").strip()
    if q:
        qs = qs.filter(last_name__icontains=q) | qs.filter(first_name__icontains=q)
    total = qs.count()
    players_qs = list(qs)
    ids = [p.licence_id for p in players_qs]
    totals = season_totals(season, ids)
    memberships = latest_memberships(season, ids)
    hm = latest_hm()
    injuries = latest_injuries(ids)
    data = [player_dict(p, season, totals, memberships, hm, injuries) for p in players_qs]
    # Full-dataset sort BEFORE the 500-row cap; unknown/None values last in both
    # directions. Contract: ?sort=<key> with optional leading "-" for descending.
    sort = request.GET.get("sort", "name")
    descending = sort.startswith("-")
    key = sort[1:] if descending else sort
    extractor = SORT_KEYS.get(key)
    if extractor:
        keyed = [(extractor(d), d) for d in data]
        with_value = sorted([(v, d) for v, d in keyed if v is not None],
                            key=lambda item: item[0], reverse=descending)
        data = [d for _, d in with_value] + [d for v, d in keyed if v is None]
    data = data[:500]
    return JsonResponse({
        "season": season,
        "total": total,
        "sort": {"applied": sort, "supported": sorted(SORT_KEYS)},
        "players": data,
    })


@jwt_required
@require_GET
def player_detail(request, licence_id):
    try:
        p = Player.objects.get(pk=licence_id)
    except Player.DoesNotExist:
        return err("Unknown player.", 404)
    season = season_from(request)
    totals = season_totals(season, [p.licence_id])
    memberships = latest_memberships(season, [p.licence_id])
    data = player_dict(p, season, totals, memberships, latest_hm(),
                       latest_injuries([p.licence_id]))
    data["stints"] = [
        {"team": m.team.name, "from": m.from_date.isoformat(),
         "to": m.to_date.isoformat() if m.to_date else None}
        for m in PlayerTeamMembership.objects.filter(player=p, season=season).select_related("team").order_by("from_date")
    ]
    return JsonResponse(data)


def weekly_series(season, licence_ids):
    rows = (PlayerWeekStats.objects.filter(season=season, player_id__in=licence_ids)
            .order_by("player_id", "iso_week"))
    series = defaultdict(list)
    for w in rows:
        series[w.player_id].append({
            "week": w.iso_week, "games": w.games, "goals": w.goals, "assists": w.assists,
            "points": w.points, "plus_minus": w.plus_minus, "toi_seconds": w.toi_seconds,
            "shots_on_goal": w.shots_on_goal,
        })
    return series


@jwt_required
@require_GET
def player_weekly(request, licence_id):
    season = season_from(request)
    return JsonResponse({
        "licence_id": int(licence_id), "season": season,
        "weeks": weekly_series(season, [int(licence_id)]).get(int(licence_id), []),
    })


@jwt_required
@require_GET
def compare(request):
    """Multi-select comparison: season totals + weekly series per player."""
    try:
        ids = [int(x) for x in request.GET.get("ids", "").split(",") if x.strip()][:8]
    except ValueError:
        return err("ids must be comma-separated licence ids.")
    if not ids:
        return err("Pass at least one player id.")
    season = season_from(request)
    found = {p.licence_id: p for p in Player.objects.filter(pk__in=ids)}
    totals = season_totals(season, ids)
    memberships = latest_memberships(season, ids)
    hm = latest_hm()
    injuries = latest_injuries(ids)
    series = weekly_series(season, ids)
    return JsonResponse({
        "season": season,
        "players": [
            {**player_dict(found[i], season, totals, memberships, hm, injuries),
             "weeks": series.get(i, [])}
            for i in ids if i in found
        ],
        "missing": [i for i in ids if i not in found],
    })


# ---- Fantasy (owner-scoped) ----

def team_dict(t, with_roster=False):
    data = {"id": t.pk, "name": t.name, "created_at": t.created_at.isoformat(),
            "roster_size": t.roster.count(),
            "pair_count": t.pair_entries.count()}
    if with_roster:
        entries = list(t.roster.select_related("player"))
        injuries = latest_injuries([e.player_id for e in entries])
        data["roster"] = [
            {"player": e.player_id, "name": str(e.player), "slot": e.position_slot,
             "acquired_price_m": str(e.acquired_price_m) if e.acquired_price_m is not None else None,
             "acquired_on": e.acquired_on.isoformat() if e.acquired_on else None,
             "source": e.source,
             "nationality": nationality_dict(e.player),
             "injury": injury_dict(injuries.get(e.player_id))}
            for e in entries
        ]
        data["pair_entries"] = [
            {"label": pe.label, "hm_asset_id": pe.hm_asset_id,
             "current_price_m": str(pe.current_price_m) if pe.current_price_m is not None else None,
             "source": pe.source}
            for pe in t.pair_entries.all()
        ]
    return data


def own_team(request, team_id):
    try:
        return FantasyTeam.objects.get(pk=team_id, owner=request.user)
    except FantasyTeam.DoesNotExist:
        return None


@jwt_required
@require_http_methods(["GET", "POST"])
def my_teams(request):
    if request.method == "GET":
        shared = []
        for share in (FantasyTeamShare.objects
                      .filter(viewer=request.user)
                      .select_related("team", "team__owner")):
            data = team_dict(share.team, with_roster=True)
            data["read_only"] = True
            data["owner_label"] = share.team.owner.username
            shared.append(data)
        return JsonResponse({
            "teams": [team_dict(t) for t in
                      FantasyTeam.objects.filter(owner=request.user)],
            "shared_with_me": shared,
        })
    import json
    try:
        body = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return err("Invalid JSON.")
    name = (body.get("name") or "").strip()[:100]
    if not name:
        return err("Name your team.")
    if FantasyTeam.objects.filter(owner=request.user, name=name).exists():
        return err("You already have a team with that name.", 409)
    t = FantasyTeam.objects.create(owner=request.user, name=name)
    return JsonResponse(team_dict(t), status=201)


@jwt_required
@require_http_methods(["GET", "DELETE"])
def my_team_detail(request, team_id):
    t = own_team(request, team_id)
    if t is None:
        return err("Team not found.", 404)
    if request.method == "DELETE":
        t.delete()
        return JsonResponse({"deleted": True})
    return JsonResponse(team_dict(t, with_roster=True))


@jwt_required
@require_http_methods(["POST", "DELETE"])
def my_team_roster(request, team_id):
    t = own_team(request, team_id)
    if t is None:
        return err("Team not found.", 404)
    import json
    try:
        body = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return err("Invalid JSON.")
    licence_id = body.get("player")
    try:
        player = Player.objects.get(pk=licence_id)
    except Player.DoesNotExist:
        return err("Unknown player.", 404)
    if request.method == "DELETE":
        RosterEntry.objects.filter(team=t, player=player).delete()
        return JsonResponse(team_dict(t, with_roster=True))
    if t.roster.count() + t.pair_entries.count() >= 22:
        return err("Roster is full (22 players; HM counts each goalie duo as one player).", 409)
    price = body.get("acquired_price_m")
    entry, created = RosterEntry.objects.get_or_create(
        team=t, player=player,
        defaults={
            "position_slot": body.get("position_slot") or player.position,
            "acquired_price_m": price,
            "acquired_on": body.get("acquired_on") or None,
            "source": body.get("source") or RosterEntry.Source.MANUAL,
        },
    )
    if not created:
        return err("Player already in this roster.", 409)
    return JsonResponse(team_dict(t, with_roster=True), status=201)


@jwt_required
@require_http_methods(["GET", "POST"])
def my_team_simulations(request, team_id):
    t = own_team(request, team_id)
    if t is None:
        return err("Team not found.", 404)
    if request.method == "GET":
        sims = t.simulations.prefetch_related("sells", "buys")
        return JsonResponse({"simulations": [sim_dict(s) for s in sims]})
    import json
    try:
        body = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return err("Invalid JSON.")
    name = (body.get("name") or "Simulation").strip()[:100]
    sell_ids = body.get("sells", [])
    buy_ids = body.get("buys", [])
    if not isinstance(sell_ids, list) or not isinstance(buy_ids, list):
        return err("sells and buys must be lists of player licence ids.")
    if set(sell_ids) & set(buy_ids):
        return err("A player cannot be both sold and bought in one simulation.")
    sells = list(Player.objects.filter(pk__in=sell_ids))
    buys = list(Player.objects.filter(pk__in=buy_ids))
    if len(sells) != len(set(sell_ids)) or len(buys) != len(set(buy_ids)):
        return err("Unknown player id in sells or buys.")
    roster_ids = set(t.roster.values_list("player_id", flat=True))
    not_owned = [p.licence_id for p in sells if p.licence_id not in roster_ids]
    if not_owned:
        return err("Cannot sell players not in this roster: %s" % not_owned)
    already = [p.licence_id for p in buys if p.licence_id in roster_ids]
    if already:
        return err("Already in this roster: %s" % already)
    hm = latest_hm()

    def price_of(p):
        snap = hm.get(p.licence_id)
        return snap.hm_price_m if snap and snap.hm_price_m is not None else None

    # Budget math: 140M start - current roster acquisition cost - buys + sells.
    # Every input must be known; any unknown price makes the whole estimate
    # unknown (null) instead of silently counting zero.
    entries = list(t.roster.all())
    unknown = [str(p) for p in buys + sells if price_of(p) is None]
    unknown += [str(e.player) for e in entries if e.acquired_price_m is None]
    budget_after = None
    if not unknown:
        spent = sum(e.acquired_price_m for e in entries)
        budget_after = (INITIAL_BUDGET_M - spent
                        + sum(price_of(p) for p in sells)
                        - sum(price_of(p) for p in buys))
    # Foreigner count needs a nationality field not yet in the approved model;
    # left null until a model review adds it.
    sim = TransferSimulation.objects.create(
        team=t, name=name,
        computed_budget_after_m=budget_after,
        notes=("Unknown HM price (estimate unavailable, not zero): "
               + ", ".join(unknown)) if unknown else "",
    )
    sim.sells.set(sells)
    sim.buys.set(buys)
    return JsonResponse(sim_dict(sim), status=201)


def sim_dict(s):
    return {
        "id": s.pk, "name": s.name, "created_at": s.created_at.isoformat(),
        "sells": [{"licence_id": p.licence_id, "name": str(p)} for p in s.sells.all()],
        "buys": [{"licence_id": p.licence_id, "name": str(p)} for p in s.buys.all()],
        "computed_budget_after_m": str(s.computed_budget_after_m) if s.computed_budget_after_m is not None else None,
        "computed_foreigners_after": s.computed_foreigners_after,
        "notes": s.notes,
    }

@jwt_required
@require_http_methods(["GET"])
def standings(request):
    """Latest official SIHF standing snapshot (current season).

    Official published ranking, stored verbatim by the sync - never computed
    from partial results. Empty until the first standings sync runs.
    """
    season = CURRENT_SEASON
    latest = (Standing.objects.filter(season=season)
              .order_by("-captured_on").values_list("captured_on", flat=True).first())
    if latest is None:
        return JsonResponse({"season": season, "captured_on": None, "source": None,
                             "source_updated_at": None, "rows": []})
    rows = (Standing.objects.filter(season=season, captured_on=latest)
            .select_related("team").order_by("rank"))
    first = rows[0] if rows else None
    return JsonResponse({
        "season": season,
        "captured_on": latest.isoformat(),
        "source": first.source if first else None,
        "source_updated_at": first.source_updated_at.isoformat() if first and first.source_updated_at else None,
        "rows": [{
            "rank": s.rank,
            "team": {"id": s.team.sihf_team_id, "name": s.team.name, "acronym": s.team.acronym},
            "games_played": s.games_played, "points": s.points,
            "wins": s.wins, "ot_wins": s.ot_wins, "so_wins": s.so_wins,
            "so_losses": s.so_losses, "ot_losses": s.ot_losses, "losses": s.losses,
            "goals_for": s.goals_for, "goals_against": s.goals_against,
        } for s in rows],
    })

