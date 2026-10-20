from django.urls import path

from . import views

urlpatterns = [
    path("<slug:slug>/rate", views.rate, name="app-idea-rate"),
]
