from django.urls import path

from . import views

urlpatterns = [
    path("prs", views.pull_requests, name="content-review-prs"),
    path("prs/<int:number>", views.pull_request_detail, name="content-review-pr-detail"),
]
