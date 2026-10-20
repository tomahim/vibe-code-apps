from django.urls import path

from . import views

urlpatterns = [
    path("ratings", views.ratings, name="app-idea-ratings"),
    path("<slug:slug>/rate", views.rate, name="app-idea-rate"),
]
