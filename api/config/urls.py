from django.urls import include, path

from .views import app_gallery, health

urlpatterns = [
    path("health/", health, name="health"),
    path("api/apps/", app_gallery, name="app-gallery"),
    path("api/", include("apps.livetrail_scrap.urls")),
]
