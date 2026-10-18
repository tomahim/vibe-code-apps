from django.urls import path

from . import views

urlpatterns = [
    path("recipes/", views.recipes, name="recipe-list"),
    path("random/", views.random_recipe, name="recipe-random"),
]
