from django.urls import path
from . import views

urlpatterns = [
    path("taxonomy/", views.taxonomy),
    path("content/", views.collection),
    path("content/<uuid:content_id>/", views.detail),
    path("content/<uuid:content_id>/tags/", views.assign_tag),
    path("content/<uuid:content_id>/categories/", views.assign_category),
]
