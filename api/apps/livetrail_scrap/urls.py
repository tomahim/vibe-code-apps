from django.urls import path
from . import views

urlpatterns = [
    path("apps/livetrail-scrap/races/", views.races, name="livetrail-races"),
    path("apps/livetrail-scrap/races/<str:race_id>/estimate/", views.estimate, name="livetrail-estimate"),
]
