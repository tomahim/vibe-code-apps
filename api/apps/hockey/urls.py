from django.urls import path

from . import api

urlpatterns = [
    path("health/", api.health, name="hockey-health"),
    path("teams/", api.teams, name="hockey-teams"),
    path("players/", api.players, name="hockey-players"),
    path("players/<int:licence_id>/", api.player_detail, name="hockey-player-detail"),
    path("players/<int:licence_id>/weekly/", api.player_weekly, name="hockey-player-weekly"),
    path("compare/", api.compare, name="hockey-compare"),
    path("my/teams/", api.my_teams, name="hockey-my-teams"),
    path("my/teams/<int:team_id>/", api.my_team_detail, name="hockey-my-team-detail"),
    path("my/teams/<int:team_id>/roster/", api.my_team_roster, name="hockey-my-team-roster"),
    path("my/teams/<int:team_id>/simulations/", api.my_team_simulations, name="hockey-my-team-simulations"),
    path("standings/", api.standings),
]
