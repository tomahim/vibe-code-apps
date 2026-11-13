from django.urls import path

from .views import login, me

urlpatterns = [
    path("login", login, name="auth-login"),
    path("me", me, name="auth-me"),
]
