import json
from datetime import date

from django.contrib.auth import get_user_model
from django.test import Client, TestCase

from apps.accounts.tokens import issue_token
from .models import (FantasyTeam, Game, GamePlayerStats, Player, PlayerTeamMembership,
                     PlayerWeekStats, RosterEntry, Standing, Team)

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
