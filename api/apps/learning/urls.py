from django.urls import path

from . import views

urlpatterns = [
    path("themes/", views.themes, name="learning-themes"),
    path("themes/<uuid:theme_id>/", views.theme_detail, name="learning-theme"),
]
