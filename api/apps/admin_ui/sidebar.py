"""Admin sidebar: Django's default app/model list plus the learning dashboard.

Unfold swaps its default sidebar for the configured navigation as soon as one
is set, so the per-app groups are rebuilt here from the admin's own app list.
That list already hides apps and models the user has no permission for.
"""
from django.contrib import admin
from django.urls import reverse

from apps.learning.admin import can_view_progress

# Little Grains learning has no registered model, so its group is always ours.
PROGRESS_ICON = "monitoring"


def navigation(request):
    groups = []
    if can_view_progress(request):
        groups.append({
            "title": "Little Grains learning",
            "separator": True,
            "items": [{
                "title": "Learning progress",
                "icon": PROGRESS_ICON,
                "link": reverse("admin-learning-progress"),
            }],
        })
    for app in admin.site.get_app_list(request):
        items = [
            {"title": str(model["name"]), "link": model["admin_url"]}
            for model in app["models"]
            if model.get("admin_url")
        ]
        if items:
            groups.append({"title": str(app["name"]), "separator": True, "items": items})
    return groups
