import json
from datetime import date

from django.contrib.auth import get_user_model
from django.test import Client, TestCase

from apps.accounts.tokens import issue_token
from .models import (FantasyTeam, Game, GamePlayerStats, Player, PlayerTeamMembership,
                     PlayerWeekStats, RosterEntry, Standing, Team, FantasyTeamShare,
)

User = get_user_model()


def auth_client(user):
    c = Client()
    token = issue_token(user)
    c.defaults["HTTP_AUTHORIZATION"] = f"Bearer {token}"
    return c


class HockeyBase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="thomas", password="x")
        cls.other = User.objects.create_user(username="aurore", password="x")
        cls.zsc = Team.objects.create(sihf_team_id=101139, name="ZSC Lions", acronym="ZSC")
        cls.hcd = Team.objects.create(sihf_team_id=101151, name="HC Davos", acronym="HCD")
        cls.malgin = Player.objects.create(
            licence_id=155486, first_name="Denis", last_name="Malgin", position="F",
            birth_date=date(1997, 1, 18))
        cls.punnenovs = Player.objects.create(
            licence_id=310134, first_name="Ivars", last_name="Punnenovs", position="G")
        PlayerTeamMembership.objects.create(
            player=cls.malgin, team=cls.zsc, season=2027, from_date=date(2026, 9, 1))
        game = Game.objects.create(
            game_id=20271105000130, season=2027, date="2026-10-31T19:45:00+01:00",
            home_team=cls.hcd, away_team=cls.zsc, home_score=2, away_score=4,
            status="finished")
        GamePlayerStats.objects.create(
            game=game, player=cls.malgin, team_side="away", goals=1,
            assists_primary=1, plus_count=3, minus_count=1, toi_seconds=1100,
            shots_on_goal=4)
        PlayerWeekStats.objects.create(
            player=cls.malgin, season=2027, iso_week=44, games=1, goals=1,
            assists=1, points=2, plus_minus=2, toi_seconds=1100, shots_on_goal=4)


class LeagueApiTests(HockeyBase):
    def test_health_open(self):
        self.assertEqual(Client().get("/api/apps/hockey/health/").status_code, 200)

    def test_players_require_auth(self):
        self.assertEqual(Client().get("/api/apps/hockey/players/").status_code, 401)

    def test_players_list_and_filter(self):
        c = auth_client(self.user)
        data = c.get("/api/apps/hockey/players/?team=101139").json()
        self.assertEqual(len(data["players"]), 1)
        malgin = data["players"][0]
        self.assertEqual(malgin["name"], "Denis Malgin")
        self.assertEqual(malgin["team"]["acronym"], "ZSC")
        self.assertEqual(malgin["season"]["points"], 2)
        self.assertIsNone(malgin["hm"]["price_m"])  # no HM sync yet

    def test_players_sort_full_dataset(self):
        scorer = Player.objects.create(
            licence_id=999001, first_name="Zach", last_name="Able", position="F")
        game2 = Game.objects.create(
            game_id=20271105000131, season=2027, date="2026-11-01T19:45:00+01:00",
            home_team=self.zsc, away_team=self.hcd, home_score=3, away_score=1,
            status="finished")
        GamePlayerStats.objects.create(
            game=game2, player=scorer, team_side="home", goals=3, assists_primary=1)
        c = auth_client(self.user)
        data = c.get("/api/apps/hockey/players/?sort=-points").json()
        names = [p["name"] for p in data["players"]]
        self.assertEqual(names[0], "Zach Able")  # 4 pts first
        self.assertEqual(data["sort"]["applied"], "-points")
        self.assertEqual(data["total"], 3)
        data = c.get("/api/apps/hockey/players/?sort=points").json()
        self.assertEqual(data["players"][0]["name"], "Ivars Punnenovs")  # 0 pts

    def test_players_sort_price_nulls_last(self):
        from .models import HMSnapshot
        from django.utils import timezone
        HMSnapshot.objects.create(player=self.malgin, captured_on=date(2026, 11, 4),
                                  source="account", source_observed_at=timezone.now(),
                                  hm_price_m="14.0")
        c = auth_client(self.user)
        for q in ("price", "-price"):
            data = c.get(f"/api/apps/hockey/players/?sort={q}").json()
            priced = [p for p in data["players"] if p["hm"]["price_m"] is not None]
            unpriced = [p for p in data["players"] if p["hm"]["price_m"] is None]
            self.assertEqual([p["name"] for p in priced], ["Denis Malgin"])
            self.assertEqual(len(unpriced), 1)
            # nulls last in both directions
            self.assertEqual(data["players"][-1]["hm"]["price_m"], None)

    def test_players_sort_unknown_key_falls_back_to_name(self):
        c = auth_client(self.user)
        data = c.get("/api/apps/hockey/players/?sort=bogus").json()
        names = [p["name"] for p in data["players"]]
        self.assertEqual(names, ["Denis Malgin", "Ivars Punnenovs"])
        self.assertIn("points", data["sort"]["supported"])

    def test_compare_weekly(self):
        c = auth_client(self.user)
        data = c.get("/api/apps/hockey/compare/?ids=155486,310134,999999").json()
        self.assertEqual(len(data["players"]), 2)
        self.assertEqual(data["missing"], [999999])
        weeks = data["players"][0]["weeks"]
        self.assertEqual(weeks[0]["week"], 44)
        self.assertEqual(weeks[0]["points"], 2)


    def test_standings_empty_then_latest(self):
        c = auth_client(self.user)
        r = c.get("/api/apps/hockey/standings/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["rows"], [])
        team = Team.objects.get(sihf_team_id=101139)
        Standing.objects.create(team=team, season=2027, captured_on="2026-11-01",
                                rank=1, games_played=18, points=47, wins=13,
                                ot_wins=3, so_wins=1, so_losses=0, ot_losses=0,
                                losses=1, goals_for=75, goals_against=38,
                                source="data.sihf.ch standing table")
        r = c.get("/api/apps/hockey/standings/").json()
        self.assertEqual(r["captured_on"], "2026-11-01")
        self.assertEqual(r["source"], "data.sihf.ch standing table")
        row = r["rows"][0]
        self.assertEqual((row["rank"], row["team"]["acronym"], row["points"]), (1, "ZSC", 47))

class FantasyApiTests(HockeyBase):
    def test_hm_pairs_endpoint(self):
        from django.utils import timezone
        from .models import HMPair, HMPairSnapshot
        pair = HMPair.objects.create(hm_asset_id=93, label="Zumbühl / Hrubec", team=self.zsc)
        HMPairSnapshot.objects.create(
            pair=pair, captured_on=date(2026, 11, 4), source="top_scorer_page",
            source_observed_at=timezone.now(), hm_price_m="14.0",
            hm_points_season=256, hm_matches=18)
        c = auth_client(self.user)
        data = c.get("/api/apps/hockey/hm-pairs/").json()
        self.assertEqual(len(data["pairs"]), 1)
        p0 = data["pairs"][0]
        self.assertEqual(p0["label"], "Zumbühl / Hrubec")
        self.assertEqual(p0["team"]["acronym"], "ZSC")
        self.assertEqual(p0["snapshot"]["price_m"], "14.0")
        self.assertEqual(p0["snapshot"]["matches"], 18)
        self.assertEqual(Client().get("/api/apps/hockey/hm-pairs/").status_code, 401)

    def test_player_hm_metrics_nullable(self):
        from django.utils import timezone
        from .models import HMSnapshot
        HMSnapshot.objects.create(
            player=self.malgin, captured_on=date(2026, 11, 4),
            source="top_scorer_page", source_observed_at=timezone.now(),
            hm_price_m="10.0", hm_points_season=100, hm_matches=19,
            hm_goals=5, hm_real_points=12)
        c = auth_client(self.user)
        data = c.get("/api/apps/hockey/players/?q=Malgin").json()
        hm = data["players"][0]["hm"]
        self.assertEqual(hm["matches"], 19)
        self.assertEqual(hm["goals"], 5)
        self.assertIsNone(hm["gwg"])  # not supplied by the capture
        punn = c.get("/api/apps/hockey/players/?q=Punnenovs").json()
        self.assertIsNone(punn["players"][0]["hm"]["matches"])  # no snapshot

    def test_owner_isolation(self):
        t = FantasyTeam.objects.create(owner=self.user, name="Elephant Crushers")
        c_other = auth_client(self.other)
        self.assertEqual(c_other.get(f"/api/apps/hockey/my/teams/{t.pk}/").status_code, 404)
        mine = auth_client(self.user).get("/api/apps/hockey/my/teams/").json()["teams"]
        self.assertEqual([t["name"] for t in mine], ["Elephant Crushers"])
        self.assertEqual(auth_client(self.other).get("/api/apps/hockey/my/teams/").json()["teams"], [])

    def test_create_team_roster_simulation(self):
        c = auth_client(self.user)
        t = c.post("/api/apps/hockey/my/teams/", data=json.dumps({"name": "A"}),
                   content_type="application/json").json()
        r = c.post(f"/api/apps/hockey/my/teams/{t['id']}/roster/",
                   data=json.dumps({"player": 155486, "acquired_price_m": "17.0"}),
                   content_type="application/json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.json()["roster"][0]["name"], "Denis Malgin")
        dup = c.post(f"/api/apps/hockey/my/teams/{t['id']}/roster/",
                     data=json.dumps({"player": 155486}), content_type="application/json")
        self.assertEqual(dup.status_code, 409)
        sim = c.post(f"/api/apps/hockey/my/teams/{t['id']}/simulations/",
                     data=json.dumps({"sells": [155486], "buys": [310134]}),
                     content_type="application/json")
        self.assertEqual(sim.status_code, 201)
        # HM prices unknown (no sync): budget estimate honestly blocked
        self.assertIsNone(sim.json()["computed_budget_after_m"])
        self.assertIn("Unknown HM price", sim.json()["notes"])

    def test_shared_team_read_only_for_viewer(self):
        # Aurore owns a team; she shares it read-only with Thomas
        aurore_team = FantasyTeam.objects.create(owner=self.other, name="Pongo")
        RosterEntry.objects.create(team=aurore_team, player_id=155486, position_slot="F")
        FantasyTeamShare.objects.create(team=aurore_team, viewer=self.user,
                                        granted_by="Aurore via i2i consent 2026-11-04")
        c = auth_client(self.user)
        r = c.get("/api/apps/hockey/my/teams/")
        self.assertEqual(r.status_code, 200)
        body = r.json()
        self.assertEqual(body["teams"], [])
        shared = body["shared_with_me"]
        self.assertEqual(len(shared), 1)
        self.assertEqual(shared[0]["name"], "Pongo")
        self.assertEqual(shared[0]["owner_label"], "aurore")
        self.assertNotIn("granted_by", shared[0])  # internal provenance stays server-side
        self.assertTrue(shared[0]["read_only"])
        self.assertEqual(shared[0]["roster"][0]["name"], "Denis Malgin")
        # viewer cannot write to the shared team
        w = c.post(f"/api/apps/hockey/my/teams/{aurore_team.pk}/roster/",
                   data=json.dumps({"player": 310134}), content_type="application/json")
        self.assertEqual(w.status_code, 404)
        d = c.delete(f"/api/apps/hockey/my/teams/{aurore_team.pk}/")
        self.assertEqual(d.status_code, 404)
        # and the owner still sees it as her own
        mine = auth_client(self.other).get("/api/apps/hockey/my/teams/").json()
        self.assertEqual([t["name"] for t in mine["teams"]], ["Pongo"])
        self.assertEqual(mine["shared_with_me"], [])

    def test_pair_entries_in_roster_view(self):
        c = auth_client(self.user)
        t = c.post("/api/apps/hockey/my/teams/", data=json.dumps({"name": "Pairs"}),
                   content_type="application/json").json()
        from .models import FantasyPairEntry
        FantasyPairEntry.objects.create(team_id=t["id"], label="Zumbühl/Hrubec",
                                        hm_asset_id=93, current_price_m="14.0")
        r = c.get(f"/api/apps/hockey/my/teams/{t['id']}/")
        self.assertEqual(r.status_code, 200)
        pairs = r.json()["pair_entries"]
        self.assertEqual(pairs[0]["label"], "Zumbühl/Hrubec")
        self.assertEqual(pairs[0]["current_price_m"], "14.0")
        # the list payload exposes pair_count so the UI can count HM slots
        listed = c.get("/api/apps/hockey/my/teams/").json()["teams"][0]
        self.assertEqual(listed["roster_size"], 0)
        self.assertEqual(listed["pair_count"], 1)

    def test_roster_cap_counts_pair_as_one_slot(self):
        c = auth_client(self.user)
        t = c.post("/api/apps/hockey/my/teams/", data=json.dumps({"name": "Full"}),
                   content_type="application/json").json()
        from .models import FantasyPairEntry, RosterEntry
        FantasyPairEntry.objects.create(team_id=t["id"], label="Zumbühl/Hrubec",
                                        hm_asset_id=93)
        for i in range(21):
            pl = Player.objects.create(licence_id=900001 + i, first_name="Fill",
                                       last_name=f"Player{i}", position="F")
            RosterEntry.objects.create(team_id=t["id"], player=pl, position_slot="F")
        r = c.post(f"/api/apps/hockey/my/teams/{t['id']}/roster/",
                   data=json.dumps({"player": 310134}), content_type="application/json")
        # 21 singles + 1 pair = 22 HM slots, so the next add is rejected
        self.assertEqual(r.status_code, 409)
        self.assertIn("goalie pair", r.json()["error"])

    def test_simulation_validation(self):
        c = auth_client(self.user)
        t = c.post("/api/apps/hockey/my/teams/", data=json.dumps({"name": "V"}),
                   content_type="application/json").json()
        c.post(f"/api/apps/hockey/my/teams/{t['id']}/roster/",
               data=json.dumps({"player": 155486, "acquired_price_m": "17.0"}),
               content_type="application/json")
        # sell a player not in the roster
        r = c.post(f"/api/apps/hockey/my/teams/{t['id']}/simulations/",
                   data=json.dumps({"sells": [310134], "buys": []}),
                   content_type="application/json")
        self.assertEqual(r.status_code, 400)
        self.assertIn("not in this roster", r.json()["error"])
        # buy a player already in the roster
        r = c.post(f"/api/apps/hockey/my/teams/{t['id']}/simulations/",
                   data=json.dumps({"sells": [], "buys": [155486]}),
                   content_type="application/json")
        self.assertEqual(r.status_code, 400)
        self.assertIn("Already in this roster", r.json()["error"])
        # same player sold and bought
        r = c.post(f"/api/apps/hockey/my/teams/{t['id']}/simulations/",
                   data=json.dumps({"sells": [155486], "buys": [155486]}),
                   content_type="application/json")
        self.assertEqual(r.status_code, 400)
        # unknown player id
        r = c.post(f"/api/apps/hockey/my/teams/{t['id']}/simulations/",
                   data=json.dumps({"sells": [], "buys": [999999]}),
                   content_type="application/json")
        self.assertEqual(r.status_code, 400)
        self.assertIn("Unknown player id", r.json()["error"])

    def test_simulation_unknown_acquisition_price_blocks_estimate(self):
        c = auth_client(self.user)
        t = c.post("/api/apps/hockey/my/teams/", data=json.dumps({"name": "U"}),
                   content_type="application/json").json()
        # roster entry without acquisition price: spent is unknown,
        # the estimate must be null, never computed with a silent zero
        c.post(f"/api/apps/hockey/my/teams/{t['id']}/roster/",
               data=json.dumps({"player": 155486}), content_type="application/json")
        r = c.post(f"/api/apps/hockey/my/teams/{t['id']}/simulations/",
                   data=json.dumps({"sells": [], "buys": []}),
                   content_type="application/json")
        self.assertEqual(r.status_code, 201)
        self.assertIsNone(r.json()["computed_budget_after_m"])
        self.assertIn("Denis Malgin", r.json()["notes"])

    def test_roster_cap(self):
        c = auth_client(self.user)
        t = c.post("/api/apps/hockey/my/teams/", data=json.dumps({"name": "B"}),
                   content_type="application/json").json()
        for i in range(22):
            Player.objects.create(licence_id=900000 + i, first_name="P", last_name=f"X{i}",
                                  position="F")
            RosterEntry.objects.create(team_id=t["id"], player_id=900000 + i, position_slot="F")
        r = c.post(f"/api/apps/hockey/my/teams/{t['id']}/roster/",
                   data=json.dumps({"player": 155486}), content_type="application/json")
        self.assertEqual(r.status_code, 409)


class SyncGamesTimezoneTests(TestCase):
    """sync_hockey games phase must store official start instants with their
    real offset (CET +01:00 / CEST +02:00 from the payload's startDateTime),
    not the local wall time reinterpreted under TIME_ZONE."""

    def setUp(self):
        Team.objects.create(sihf_team_id=101144, name="EV Zug", acronym="EVZ")
        Team.objects.create(sihf_team_id=101152, name="HC Ambri-Piotta", acronym="HCAP")

    @staticmethod
    def _row(day, wall, start_iso, game_id):
        state = {"id": 0, "percent": 0, "name": "Wie geplant",
                 "canceled": False, "type": "gameStatus"}
        if start_iso is not None:
            state["startDateTime"] = start_iso
        return ["Mi", day, wall,
                {"id": 101144, "name": "EV Zug", "acronym": "EVZ", "type": "team"},
                {"id": 101152, "name": "HC Ambri-Piotta", "acronym": "HCAP", "type": "team"},
                {"homeTeam": "-", "awayTeam": "-", "type": "result"},
                {"homeTeam": ["-", "-", "-"], "awayTeam": ["-", "-", "-"], "type": "periods"},
                "", state,
                {"type": "linkToGameDetail", "gameId": str(game_id)}]

    def _sync(self, rows):
        from unittest.mock import patch
        from django.core.management import call_command
        with patch("apps.hockey.management.commands.sync_hockey.results_table",
                   return_value={"data": rows}):
            call_command("sync_hockey", phase="games")

    def test_cet_start_uses_payload_offset(self):
        self._sync([self._row("11.11.2026", "19:45",
                              "2026-11-11T19:45:00+01:00", 1001)])
        game = Game.objects.get(game_id=1001)
        self.assertEqual(game.date.isoformat(), "2026-11-11T18:45:00+00:00")

    def test_cest_start_uses_payload_offset(self):
        self._sync([self._row("19.09.2026", "19:45",
                              "2026-09-19T19:45:00+02:00", 1002)])
        game = Game.objects.get(game_id=1002)
        self.assertEqual(game.date.isoformat(), "2026-09-19T17:45:00+00:00")

    def test_missing_start_datetime_keeps_legacy_wall_parse(self):
        self._sync([self._row("12.11.2026", "20:00", None, 1003)])
        game = Game.objects.get(game_id=1003)
        self.assertEqual(game.date.isoformat(), "2026-11-12T20:00:00+00:00")

    def test_resync_repairs_existing_offset_error(self):
        self._sync([self._row("11.11.2026", "19:45", None, 1004)])
        self.assertEqual(Game.objects.get(game_id=1004).date.isoformat(),
                         "2026-11-11T19:45:00+00:00")
        self._sync([self._row("11.11.2026", "19:45",
                              "2026-11-11T19:45:00+01:00", 1004)])
        self.assertEqual(Game.objects.get(game_id=1004).date.isoformat(),
                         "2026-11-11T18:45:00+00:00")


class PlayerStatusApiTests(HockeyBase):
    def _roster_team(self):
        t = FantasyTeam.objects.create(owner=self.user, name="EC")
        RosterEntry.objects.create(team=t, player=self.malgin, position_slot="F")
        RosterEntry.objects.create(team=t, player=self.punnenovs, position_slot="G")
        return t

    def test_roster_nationality_and_injury(self):
        from django.utils import timezone
        from .models import InjuryReport
        self.malgin.hm_nationality = "ch"
        self.malgin.hm_nationality_source = "HM /fr/transfers-classic flag"
        self.malgin.hm_nationality_observed_at = timezone.now()
        self.malgin.save()
        InjuryReport.objects.create(
            player=self.malgin, published_on=date(2026, 11, 4),
            headline="Several weeks of absence for Kloten's Bernd Wolf",
            status_hint="out", source_url="https://swisshockeynews.ch/en/shn/medical/x",
            observed_at=timezone.now())
        t = self._roster_team()
        data = auth_client(self.user).get(f"/api/apps/hockey/my/teams/{t.pk}/").json()
        rows = {r["name"]: r for r in data["roster"]}
        malgin = rows["Denis Malgin"]
        self.assertEqual(malgin["nationality"]["code"], "ch")
        self.assertEqual(malgin["nationality"]["source"], "HM /fr/transfers-classic flag")
        self.assertEqual(malgin["injury"]["status_hint"], "out")
        self.assertEqual(malgin["injury"]["published_on"], "2026-11-04")
        self.assertIn("swisshockeynews.ch", malgin["injury"]["url"])
        # No report and no HM capture: null, never "healthy"/"swiss" defaults
        punn = rows["Ivars Punnenovs"]
        self.assertIsNone(punn["injury"])
        self.assertIsNone(punn["nationality"]["code"])

    def test_shared_roster_carries_status_but_no_prices(self):
        from django.utils import timezone
        from .models import InjuryReport
        InjuryReport.objects.create(
            player=self.malgin, published_on=date(2026, 11, 2),
            headline="Malgin day-to-day", status_hint="day_to_day",
            source_url="https://swisshockeynews.ch/en/shn/medical/y",
            observed_at=timezone.now())
        team = FantasyTeam.objects.create(owner=self.other, name="Pongo")
        RosterEntry.objects.create(team=team, player=self.malgin, position_slot="F")
        FantasyTeamShare.objects.create(team=team, viewer=self.user,
                                        granted_by="test share")
        data = auth_client(self.user).get("/api/apps/hockey/my/teams/").json()
        row = data["shared_with_me"][0]["roster"][0]
        self.assertEqual(row["injury"]["status_hint"], "day_to_day")
        self.assertIsNone(row["acquired_price_m"])  # prices stay excluded

    def test_player_list_includes_status_fields(self):
        data = auth_client(self.user).get("/api/apps/hockey/players/?q=Malgin").json()
        malgin = data["players"][0]
        self.assertIn("nationality", malgin)
        self.assertIn("injury", malgin)
        self.assertIsNone(malgin["injury"])


class SyncInjuriesTests(TestCase):
    LIST_HTML = """
    <article class="raxo-item-top"><div class="raxo-wrap">
      <div class="raxo-info"><span class="raxo-category">MEDICAL REPORT</span>
      <span class="raxo-date">04.11.2026</span></div>
      <h2 class="raxo-title"><a href="/en/shn/medical/several-weeks-of-absence-for-klotens-bernd-wolf">Several weeks of absence for Kloten's Bernd Wolf</a></h2>
    </div></article>
    <article class="raxo-item-top"><div class="raxo-wrap">
      <div class="raxo-info"><span class="raxo-category">MEDICAL REPORT</span>
      <span class="raxo-date">03.11.2026</span></div>
      <h2 class="raxo-title"><a href="/en/shn/medical/biel-infirmary">EHC Biel adds another player to their infirmary</a></h2>
    </div></article>
    <article class="raxo-item-top"><div class="raxo-wrap">
      <div class="raxo-info"><span class="raxo-category">MEDICAL REPORT</span>
      <span class="raxo-date">02.11.2026</span></div>
      <h2 class="raxo-title"><a href="/en/shn/medical/comebacks-davos">Some comebacks on the horizon for HC Davos</a></h2>
    </div></article>
    <article class="raxo-item-top"><div class="raxo-wrap">
      <div class="raxo-info"><span class="raxo-category">MEDICAL REPORT</span>
      <span class="raxo-date">01.06.2026</span></div>
      <h2 class="raxo-title"><a href="/en/shn/medical/old">Old report about Bernd Wolf</a></h2>
    </div></article>
    """
    WOLF_PAGE = """
    <h1>Several weeks of absence for Kloten&#039;s Bernd Wolf</h1>
    <p>During EHC Kloten's last game, Bernd Wolf suffered injuries to both his
    right ankle and the right adductor area. The estimated time of absence is
    about five to six weeks.</p>
    """
    BIEL_PAGE = """
    <h1>EHC Biel adds another player to their infirmary</h1>
    <p>Defenseman Ivars Punnenovs is considered day-to-day, the club confirms.</p>
    """
    COMEBACKS_PAGE = """
    <div class="com-content-article item-page" itemscope itemtype="https://schema.org/Article">
    <h1>Some comebacks on the horizon for HC Davos</h1>
    <div class="introtext"><div class='article'>
    <p>Defender Calle Andersson, out since October, is set to make his return
    after the international break, team manager Jan Alston confirms.</p>
    </div></div>
    </div>
    <div class="shn-a card "><h3 class="card-header ">Latest Transfers</h3>
    <div class="card-body"><div class="mod-custom custom">
    <p><table class="ltrans_table">
    <tr class="ltrans_row1"><td class="ltrans_name">Ivars Punnenovs (G, 31)</td><td>HC Biel</td></tr>
    <tr class="ltrans_row2"><td class="ltrans_name">Bernd Wolf (D, 29)</td><td>EHC Kloten</td></tr>
    </table></p>
    </div></div></div>
    """

    @classmethod
    def setUpTestData(cls):
        cls.kloten = Team.objects.create(sihf_team_id=101149, name="EHC Kloten", acronym="EHC")
        cls.wolf = Player.objects.create(licence_id=700001, first_name="Bernd",
                                         last_name="Wolf", position="D")
        cls.punnenovs = Player.objects.create(licence_id=310134, first_name="Ivars",
                                              last_name="Punnenovs", position="G")
        cls.andersson = Player.objects.create(licence_id=700002, first_name="Calle",
                                              last_name="Andersson", position="D")
        PlayerTeamMembership.objects.create(player=cls.wolf, team=cls.kloten,
                                            season=2027, from_date=date(2026, 9, 1))

    def _pages(self, url):
        if url.endswith("/medicals"):
            return self.LIST_HTML
        if url.endswith("biel-infirmary"):
            return self.BIEL_PAGE
        if url.endswith("comebacks-davos"):
            return self.COMEBACKS_PAGE
        return self.WOLF_PAGE

    def _run(self, **kwargs):
        from unittest.mock import patch
        from django.core.management import call_command
        with patch("apps.hockey.management.commands.sync_hockey.fetch_text",
                   side_effect=self._pages):
            call_command("sync_hockey", phase="injuries", sleep=0, **kwargs)

    def test_transfers_widget_never_produces_match_or_excerpt(self):
        from .models import InjuryReport
        self._run()
        # prose-backed match still works inside the article container
        row = InjuryReport.objects.get(
            player=self.andersson, source_url__contains="comebacks-davos")
        self.assertEqual(row.status_hint, "returning")
        self.assertIn("Andersson", row.excerpt)
        self.assertNotIn("ltrans", row.excerpt)
        self.assertNotIn("HC Biel", row.excerpt)
        # names that appear only in the Latest Transfers widget do not match
        self.assertFalse(InjuryReport.objects.filter(
            player=self.punnenovs, source_url__contains="comebacks-davos").exists())
        self.assertFalse(InjuryReport.objects.filter(
            player=self.wolf, source_url__contains="comebacks-davos").exists())
        # Punnenovs' genuine prose-backed row from the Biel article survives
        self.assertTrue(InjuryReport.objects.filter(
            player=self.punnenovs, source_url__contains="biel-infirmary").exists())

    def test_headline_and_body_matches_with_hints(self):
        from .models import InjuryReport
        self._run()
        wolf = InjuryReport.objects.get(player=self.wolf)
        self.assertEqual(wolf.status_hint, "out")
        self.assertEqual(wolf.published_on.isoformat(), "2026-11-04")
        self.assertIn("ankle", wolf.excerpt)
        self.assertEqual(wolf.source_url,
                         "https://swisshockeynews.ch/en/shn/medical/several-weeks-of-absence-for-klotens-bernd-wolf")
        punn = InjuryReport.objects.get(player=self.punnenovs)
        self.assertEqual(punn.status_hint, "day_to_day")
        # old article beyond lookback is ignored
        self.assertEqual(InjuryReport.objects.count(), 3)

    def test_idempotent_rerun(self):
        from .models import InjuryReport
        self._run()
        self._run()
        self.assertEqual(InjuryReport.objects.count(), 3)

    def test_no_match_no_row(self):
        from .models import InjuryReport
        self.wolf.delete()
        self.punnenovs.delete()
        self.andersson.delete()
        self._run()
        self.assertEqual(InjuryReport.objects.count(), 0)


class SyncNationalityTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.zsc = Team.objects.create(sihf_team_id=101139, name="ZSC Lions", acronym="ZSC")
        cls.andrighetto = Player.objects.create(
            licence_id=700101, first_name="Sven", last_name="Andrighetto",
            position="F", hm_id=134)
        cls.jarventie = Player.objects.create(
            licence_id=700102, first_name="Jere", last_name="Järventie", position="F")
        PlayerTeamMembership.objects.create(player=cls.andrighetto, team=cls.zsc,
                                            season=2027, from_date=date(2026, 9, 1))
        PlayerTeamMembership.objects.create(player=cls.jarventie, team=cls.zsc,
                                            season=2027, from_date=date(2026, 9, 1))

    def _run(self, rows):
        import json as _json
        import tempfile
        from django.core.management import call_command
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
            _json.dump(rows, f)
            path = f.name
        call_command("sync_hockey", phase="nationality", file=path)

    def test_hm_id_and_name_club_joins(self):
        self._run([
            {"hm_id": 134, "name": "Sven Andrighetto", "club": "ZSC",
             "flag": "ch", "kind": "player"},
            {"hm_id": 728, "name": "Jere Järventie", "club": "ZSC",
             "flag": "fi", "kind": "player"},
            {"hm_id": 93, "name": "Hrubec / Zumbühl", "club": "ZSC",
             "flag": "ch", "kind": "pair"},
            {"hm_id": 999999, "name": "Nobody Here", "club": "ZSC",
             "flag": "ca", "kind": "player"},
        ])
        self.andrighetto.refresh_from_db()
        self.assertEqual(self.andrighetto.hm_nationality, "ch")
        self.assertEqual(self.andrighetto.hm_nationality_source,
                         "HM /fr/transfers-classic flag")
        self.assertIsNotNone(self.andrighetto.hm_nationality_observed_at)
        # hm_id mismatch fell back to normalized name + club (diacritics ok)
        self.jarventie.refresh_from_db()
        self.assertEqual(self.jarventie.hm_nationality, "fi")
        # pair row skipped even though hm_id 93 could collide, unknown skipped
        self.assertEqual(Player.objects.filter(hm_nationality="ca").count(), 0)

    def test_idempotent_no_rewrite(self):
        rows = [{"hm_id": 134, "name": "Sven Andrighetto", "club": "ZSC",
                 "flag": "ch", "kind": "player"}]
        self._run(rows)
        first = Player.objects.get(pk=self.andrighetto.pk).hm_nationality_observed_at
        self._run(rows)
        second = Player.objects.get(pk=self.andrighetto.pk).hm_nationality_observed_at
        self.assertEqual(first, second)


class InjuryOrderingAndMatchingTests(TestCase):
    """Status safeguards: newest dated report wins, comebacks are not 'out',
    same-name players are never guessed without a club mention."""

    @classmethod
    def setUpTestData(cls):
        cls.kloten = Team.objects.create(sihf_team_id=101149, name="EHC Kloten", acronym="EHC")
        cls.zsc = Team.objects.create(sihf_team_id=101139, name="ZSC Lions", acronym="ZSC")
        cls.wolf_k = Player.objects.create(licence_id=700001, first_name="Bernd",
                                           last_name="Wolf", position="D")
        cls.wolf_z = Player.objects.create(licence_id=700002, first_name="Bernd",
                                           last_name="Wolf", position="F")
        PlayerTeamMembership.objects.create(player=cls.wolf_k, team=cls.kloten,
                                            season=2027, from_date=date(2026, 9, 1))
        PlayerTeamMembership.objects.create(player=cls.wolf_z, team=cls.zsc,
                                            season=2027, from_date=date(2026, 9, 1))

    def _api_latest(self):
        from django.utils import timezone
        from .models import InjuryReport
        return InjuryReport, timezone

    def test_latest_report_wins_regardless_of_insert_order(self):
        InjuryReport, timezone = self._api_latest()
        InjuryReport.objects.create(player=self.wolf_k, published_on=date(2026, 10, 1),
                                    headline="Older out report", status_hint="out",
                                    source_url="https://x.ch/old", observed_at=timezone.now())
        InjuryReport.objects.create(player=self.wolf_k, published_on=date(2026, 11, 1),
                                    headline="Newer comeback report", status_hint="returning",
                                    source_url="https://x.ch/new", observed_at=timezone.now())
        t = FantasyTeam.objects.create(owner=User.objects.create_user(username="u2"),
                                       name="T")
        RosterEntry.objects.create(team=t, player=self.wolf_k, position_slot="D")
        data = auth_client(t.owner).get(f"/api/apps/hockey/my/teams/{t.pk}/").json()
        self.assertEqual(data["roster"][0]["injury"]["status_hint"], "returning")
        self.assertEqual(data["roster"][0]["injury"]["published_on"], "2026-11-01")

    def test_returning_not_read_as_out(self):
        from apps.hockey.management.commands.sync_hockey import status_hint_for
        self.assertEqual(status_hint_for("Some comebacks on the horizon for HC Davos"),
                         "returning")
        self.assertEqual(status_hint_for("Several weeks of absence for Bernd Wolf"),
                         "out")
        self.assertEqual(status_hint_for("ZSC's Sven Andrighetto considered day-to-day"),
                         "day_to_day")

    LIST_AMBIG = """
    <article class="raxo-item-top"><div class="raxo-wrap">
      <div class="raxo-info"><span class="raxo-date">04.11.2026</span></div>
      <h2 class="raxo-title"><a href="/en/shn/medical/ambig">Bernd Wolf sidelined</a></h2>
    </div></article>
    <article class="raxo-item-top"><div class="raxo-wrap">
      <div class="raxo-info"><span class="raxo-date">04.11.2026</span></div>
      <h2 class="raxo-title"><a href="/en/shn/medical/with-club">Kloten's Bernd Wolf sidelined</a></h2>
    </div></article>
    """

    def test_same_name_needs_club_mention(self):
        from unittest.mock import patch
        from django.core.management import call_command
        from .models import InjuryReport
        with patch("apps.hockey.management.commands.sync_hockey.fetch_text",
                   side_effect=lambda url: self.LIST_AMBIG if url.endswith("/medicals") else "<h1>x</h1>"):
            call_command("sync_hockey", phase="injuries", sleep=0)
        # ambiguous article: no report at all (never guessed)
        self.assertFalse(InjuryReport.objects.filter(source_url__endswith="ambig").exists())
        # club mention disambiguates to the Kloten Wolf only
        reports = InjuryReport.objects.filter(source_url__endswith="with-club")
        self.assertEqual([r.player_id for r in reports], [self.wolf_k.licence_id])


class SyncInjuriesParserTests(TestCase):
    """parse_medicals_listing against listing fixtures that mirror the live
    layout slots: featured h2, hero h3, list h4, duplicate hrefs across
    slots, non-medical links, and class attributes with extra tokens."""

    FIXTURE = """
    <article class="raxo-item-top raxo-category-id23"><div class="raxo-wrap">
      <div class="raxo-content">
        <h2 class="raxo-title">
          <a href="/en/shn/medical/featured-out-for-weeks">Featured out for weeks</a>
        </h2>
        <span class="raxo-date">04.11.2026</span>
      </div>
    </article>
    <article class="raxo-hero-item">
      <div class="raxo-content">
        <h3 class="raxo-title">
          <a href="/en/shn/medical/hero-day-to-day">Hero day-to-day</a>
        </h3>
        <span class="raxo-date">30.10.2026</span>
      </div>
    </article>
    <article class="raxo-item-nor raxo-category-id23"><div class="raxo-wrap">
      <div class="raxo-content">
        <h4 class="raxo-title"><a href="/en/shn/medical/hero-day-to-day">Hero day-to-day</a></h4>
        <span class="raxo-date">30.10.2026</span>
      </div>
    </article>
    <article class="raxo-item-nor raxo-category-id23"><div class="raxo-wrap">
      <div class="raxo-content">
        <h4 class="raxo-title extra-token"><a href="/en/shn/medical/list-injured">List injured</a></h4>
        <span class="raxo-date">28.10.2026</span>
      </div>
    </article>
    <article class="raxo-item-nor raxo-category-id23"><div class="raxo-wrap">
      <div class="raxo-content">
        <h4 class="raxo-title"><a href="/en/shn/medical/old-entry">Too old</a></h4>
        <span class="raxo-date">01.08.2026</span>
      </div>
    </article>
    <article class="raxo-item-top raxo-category-id88"><div class="raxo-wrap">
      <h2 class="raxo-title"><a href="/en/shb/podcasts/episode-9">Podcast, not medical</a></h2>
      <span class="raxo-date">03.11.2026</span>
    </article>
    """

    def test_extracts_all_heading_levels_deduped(self):
        from apps.hockey.management.commands.sync_hockey import (
            parse_medicals_listing)
        entries = parse_medicals_listing(self.FIXTURE, date(2026, 9, 1))
        urls = [e["url"] for e in entries]
        self.assertEqual(len(urls), len(set(urls)))  # deduped
        self.assertIn("https://swisshockeynews.ch/en/shn/medical/featured-out-for-weeks", urls)
        self.assertIn("https://swisshockeynews.ch/en/shn/medical/hero-day-to-day", urls)
        self.assertIn("https://swisshockeynews.ch/en/shn/medical/list-injured", urls)

    def test_dedup_before_fetch_budget(self):
        from apps.hockey.management.commands.sync_hockey import (
            parse_medicals_listing)
        entries = parse_medicals_listing(self.FIXTURE, date(2026, 9, 1))
        hero = [e for e in entries if e["url"].endswith("hero-day-to-day")]
        self.assertEqual(len(hero), 1)  # h3 hero + h4 list slot collapse to one

    def test_cutoff_and_non_medical_excluded(self):
        from apps.hockey.management.commands.sync_hockey import (
            parse_medicals_listing)
        entries = parse_medicals_listing(self.FIXTURE, date(2026, 9, 1))
        urls = [e["url"] for e in entries]
        self.assertFalse(any(u.endswith("old-entry") for u in urls))
        self.assertFalse(any("podcasts" in u for u in urls))
        self.assertEqual(len(entries), 3)

    def test_dates_and_headlines_parsed(self):
        from apps.hockey.management.commands.sync_hockey import (
            parse_medicals_listing)
        entries = parse_medicals_listing(self.FIXTURE, date(2026, 9, 1))
        by_url = {e["url"]: e for e in entries}
        self.assertEqual(by_url["https://swisshockeynews.ch/en/shn/medical/hero-day-to-day"]["published_on"],
                         date(2026, 10, 30))
        self.assertEqual(by_url["https://swisshockeynews.ch/en/shn/medical/featured-out-for-weeks"]["headline"],
                         "Featured out for weeks")
