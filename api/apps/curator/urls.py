from django.urls import path
from . import views

urlpatterns = [
    path("taxonomy/", views.taxonomy),
    path("preferences/<slug:type_slug>/", views.view_preference),
    path("taxonomy/<str:kind>/", views.create_taxonomy),
    path("content/", views.collection),
    path("content/<uuid:content_id>/", views.detail),
    path("content/<uuid:content_id>/tags/", views.assign_tag),
    path("content/<uuid:content_id>/categories/", views.assign_category),
]
