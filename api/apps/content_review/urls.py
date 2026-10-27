from django.urls import path

from . import views

urlpatterns = [
    path("prs", views.pull_requests, name="content-review-prs"),
]
