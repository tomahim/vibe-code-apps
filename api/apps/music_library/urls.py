from django.urls import path

from . import views

urlpatterns = [
    path("tracks/", views.tracks, name="music-track-list"),
    path("tracks/<int:pk>/", views.track_detail, name="music-track-detail"),
    path("categories/", views.categories, name="music-category-list"),
]
