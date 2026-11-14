from django.urls import path

from . import api

urlpatterns = [
    path("health/", api.health, name="garmin-health"),
    path("import/batches/", api.import_batches, name="garmin-import-batches"),
    path("import/<str:dataset>/", api.import_dataset, name="garmin-import-dataset"),
]
