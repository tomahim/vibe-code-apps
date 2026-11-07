from django.urls import path

from . import views

urlpatterns = [
    path("presets", views.presets, name="kc-presets"),
    path("presets/<uuid:preset_id>", views.preset_detail, name="kc-preset-detail"),
]
