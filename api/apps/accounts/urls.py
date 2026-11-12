from django.urls import path

from apps.feature_flags.views import me

from .views import login

urlpatterns = [
    path("login", login, name="auth-login"),
    path("me", me, name="auth-me"),
]
