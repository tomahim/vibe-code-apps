import re

import requests
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .services.scrap import fetch_race_estimate, get_races


@require_GET
def races(request):
    return JsonResponse({"races": get_races()})


@require_GET
def estimate(request, race_id):
    race = next((race for race in get_races() if race["id"] == race_id), None)
    if race is None:
        return JsonResponse({"error": "Race not found."}, status=404)

    target = request.GET.get("target", race["defaultTime"])
    if not re.fullmatch(r"\d{1,3}:[0-5]\d", target):
        return JsonResponse({"error": "Enter a finish time in HH:MM format, for example 10:30."}, status=400)

    try:
        data = fetch_race_estimate(race, target)
    except requests.RequestException:
        return JsonResponse({"error": "LiveTrail could not be reached. Please try again shortly."}, status=502)
    except (ValueError, KeyError, IndexError, TypeError):
        return JsonResponse({"error": "LiveTrail returned race data in an unexpected format."}, status=502)

    return JsonResponse(data)
