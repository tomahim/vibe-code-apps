from django.urls import path

from . import views

urlpatterns = [
    path("overview", views.overview, name="db-dashboard-overview"),
]
