from django.urls import path

from . import challenge, views
from .images import content_image

urlpatterns = [
    path("health/", views.health, name="learning-health"),
    path("garden/", views.garden, name="learning-garden"),
    path("badges/check/", views.badges_check, name="learning-badges-check"),
    path("leaderboard/", views.leaderboard, name="learning-leaderboard"),
    path("leaderboard/badges/", views.badges_leaderboard_view, name="learning-badges-leaderboard"),
    path("images/<str:kind>/<uuid:content_id>/", content_image, name="learning-image"),
    path("themes/", views.themes, name="learning-themes"),
    path("themes/<uuid:theme_id>/", views.theme_detail, name="learning-theme"),
    path("paths/<uuid:path_id>/", views.path_detail, name="learning-path"),
    path("review/", views.review, name="learning-review"),
    path("paths/<uuid:path_id>/catch-up/", views.catch_up, name="learning-catch-up"),
    path("paths/<uuid:path_id>/celebrated/", views.celebrate_path, name="learning-celebrate-path"),
    path("lessons/<uuid:lesson_id>/", views.lesson_detail, name="learning-lesson"),
    path("lessons/<uuid:lesson_id>/open/", views.open_lesson, name="learning-open-lesson"),
    path("cards/<uuid:card_id>/complete/", views.complete_card, name="learning-complete-card"),
    path("question-attempts/", views.question_attempts, name="learning-question-attempts"),
    path("challenge/", challenge.challenge, name="learning-challenge"),
    path("challenge/answers/", challenge.challenge_answer, name="learning-challenge-answer"),
    path("challenge/history/", challenge.challenge_history, name="learning-challenge-history"),
    path("progress/", views.progress, name="learning-progress"),
]

