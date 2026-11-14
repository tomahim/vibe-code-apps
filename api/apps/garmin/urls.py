from django.urls import path

from . import api, stats

urlpatterns = [
    path("health/", api.health, name="garmin-health"),
    path("import/<str:dataset>/", api.import_dataset, name="garmin-import-dataset"),
    path("stats/overview/", stats.overview, name="garmin-stats-overview"),
    path("stats/running/", stats.running, name="garmin-stats-running"),
]
