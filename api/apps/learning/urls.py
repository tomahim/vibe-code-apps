from django.urls import path

from . import views
from .images import content_image

urlpatterns = [
    path("garden/", views.garden, name="learning-garden"),
    path("leaderboard/", views.leaderboard, name="learning-leaderboard"),
    path("images/<str:kind>/<uuid:content_id>/", content_image, name="learning-image"),
    path("themes/", views.themes, name="learning-themes"),
    path("themes/<uuid:theme_id>/", views.theme_detail, name="learning-theme"),
    path("paths/<uuid:path_id>/", views.path_detail, name="learning-path"),
    path("lessons/<uuid:lesson_id>/", views.lesson_detail, name="learning-lesson"),
    path("lessons/<uuid:lesson_id>/open/", views.open_lesson, name="learning-open-lesson"),
    path("cards/<uuid:card_id>/complete/", views.complete_card, name="learning-complete-card"),
    path("question-attempts/", views.question_attempts, name="learning-question-attempts"),
    path("progress/", views.progress, name="learning-progress"),
]

