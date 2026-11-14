from django.urls import path

from . import views

urlpatterns = [
    path("tracks/", views.tracks, name="music-track-list"),
    path("tracks/<int:pk>/", views.track_detail, name="music-track-detail"),
    path("tracks/<int:pk>/versions/", views.track_versions, name="music-track-versions"),
    path("tracks/<int:pk>/versions/<int:version_id>/", views.track_version_detail, name="music-track-version"),
    path(
        "tracks/<int:pk>/versions/<int:version_id>/restore/",
        views.restore_track_version,
        name="music-track-restore",
    ),
    path("categories/", views.categories, name="music-category-list"),
]
