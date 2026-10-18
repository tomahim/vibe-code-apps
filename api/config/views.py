from django.http import JsonResponse
from django.views.decorators.http import require_GET


@require_GET
def health(request):
    return JsonResponse({"status": "ok"})


@require_GET
def app_gallery(request):
    return JsonResponse({
        "apps": [{
            "slug": "livetrail-scrap",
            "name": "LiveTrail Scraper",
            "description": "Estimate race checkpoint times and inspect the elevation profile.",
            "category": "Trail running",
            "icon": "↗",
        }, {
            "slug": "recipes",
            "name": "Etchebest",
            "description": "Save recipes and find inspiration from the ingredients you have.",
            "category": "Cooking",
            "icon": "🍽",
            "href": "/admin/recipes/recipe/",
            "action_label": "Manage recipes",
        }]
    })
