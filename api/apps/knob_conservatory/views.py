"""Owner-scoped preset shelf for the Knob Conservatory workshop."""

import json

from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from apps.accounts.decorators import jwt_required

from .models import Preset

MAX_NAME = 80
MAX_SETTINGS_KEYS = 64
MAX_PRESETS = 200


def error(message, status=400):
    return JsonResponse({"error": message}, status=status)


def preset_dict(preset):
    return {
        "id": str(preset.id),
        "name": preset.name,
        "settings": preset.settings,
        "created_at": preset.created_at.isoformat(),
        "updated_at": preset.updated_at.isoformat(),
    }


def valid_settings(value):
    """Settings must be a flat object of control id -> number or string."""
    if not isinstance(value, dict) or len(value) > MAX_SETTINGS_KEYS:
        return False
    for key, item in value.items():
        if not isinstance(key, str) or len(key) > 64:
            return False
        if isinstance(item, bool) or not isinstance(item, (int, float, str)):
            return False
        if isinstance(item, str) and len(item) > 64:
            return False
    return True


@never_cache
@csrf_exempt
@require_http_methods(["GET", "POST"])
@jwt_required
def presets(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body or b"{}")
        except json.JSONDecodeError:
            return error("Invalid JSON body.")
        name = data.get("name")
        settings_value = data.get("settings")
        if not isinstance(name, str) or not name.strip():
            return error("A name is required.")
        name = name.strip()
        if len(name) > MAX_NAME:
            return error("The name is too long.")
        if not valid_settings(settings_value):
            return error("Invalid settings: expected a flat object of knob values.")
        if Preset.objects.filter(owner=request.user).count() >= MAX_PRESETS:
            return error("Your shelf is full. Remove an instrument first.")
        if Preset.objects.filter(owner=request.user, name=name).exists():
            return error("You already have an instrument with that name.", status=409)
        preset = Preset.objects.create(owner=request.user, name=name, settings=settings_value)
        return JsonResponse(preset_dict(preset), status=201)
    owned = Preset.objects.filter(owner=request.user)
    return JsonResponse({"presets": [preset_dict(preset) for preset in owned]})


@never_cache
@csrf_exempt
@require_http_methods(["DELETE"])
@jwt_required
def preset_detail(request, preset_id):
    deleted, _ = Preset.objects.filter(owner=request.user, pk=preset_id).delete()
    if not deleted:
        return error("No instrument with that id.", status=404)
    return JsonResponse({}, status=204)
