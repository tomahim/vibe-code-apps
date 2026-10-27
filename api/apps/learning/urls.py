from django.urls import path

from . import views

urlpatterns = [path("themes/", views.themes, name="learning-themes")]
