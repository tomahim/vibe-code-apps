from django.urls import path

from . import views

urlpatterns = [
    path("instruments/", views.instruments, name="instrument-list"),
]
