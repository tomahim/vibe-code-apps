from django.http import JsonResponse
from django.views.decorators.http import require_GET


@require_GET
def health(request):
    return JsonResponse({"status": "ok"})


@require_GET
def app_gallery(request):
    return JsonResponse({
        "apps": [{
            "slug": "rust-learning-path",
            "name": "Rust learning path",
            "description": "Small lessons, real Rust. Learn the fundamentals with a code editor and compiler feedback.",
            "category": "Learning",
            "icon": "🦀",
        }, {
            "slug": "livetrail-scrap",
            "name": "LiveTrail Scraper",
            "description": "Estimate race checkpoint times and inspect the elevation profile.",
            "category": "Sports",
            "icon": "↗",
        }, {
            "slug": "recipes",
            "name": "Etchebest",
            "description": "Save recipes and find inspiration from the ingredients you have.",
            "category": "Daily organization",
            "icon": "🍽",
            "href": "/admin/recipes/recipe/",
            "action_label": "Manage recipes",
        }]
    })
