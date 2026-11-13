"""Admin sidebar: Django's default app/model list.

Unfold swaps its default sidebar for the configured navigation as soon as one
is set, so the per-app groups are rebuilt here from the admin's own app list.
That list already hides apps and models the user has no permission for.
"""
from django.contrib import admin


def navigation(request):
    groups = []
    for app in admin.site.get_app_list(request):
        items = [
            {"title": str(model["name"]), "link": model["admin_url"]}
            for model in app["models"]
            if model.get("admin_url")
        ]
        if items:
            groups.append({"title": str(app["name"]), "separator": True, "items": items})
    return groups
