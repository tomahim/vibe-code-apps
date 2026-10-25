from django.urls import path

from .views import lessons

urlpatterns = [path("lessons", lessons, name="little-grains-lessons")]
