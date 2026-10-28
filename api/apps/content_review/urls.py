from django.urls import path

from . import views

urlpatterns = [
    path("prs", views.pull_requests, name="content-review-prs"),
    path("prs/<int:number>", views.pull_request_detail, name="content-review-pr-detail"),
    path("prs/<int:number>/edits", views.edit_unit, name="content-review-pr-edit"),
    path("prs/<int:number>/comments", views.post_comment, name="content-review-pr-comment"),
]
