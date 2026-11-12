from django.urls import path

from apps.feature_flags.views import me

from .views import login
from . import google

urlpatterns = [
    path("google/config", google.config, name="auth-google-config"),
    path("google/login", google.authenticate, name="auth-google-login"),
    path("login", login, name="auth-login"),
    path("me", me, name="auth-me"),
]
