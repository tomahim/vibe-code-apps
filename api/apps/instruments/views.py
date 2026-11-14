import json
import logging

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from apps.accounts.decorators import jwt_required

from .models import Instrument
from .models import validate_synthdef
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)


def serialize(instrument, request):
    definition_url = None
    if instrument.definition:
        try:
            # Bucket storage returns an absolute presigned URL; local disk
            # returns a path, which the browser resolves against its own
            # origin so dev proxies keep working.
            definition_url = instrument.definition.url
        except Exception:  # storage unavailable: still list the instrument
            definition_url = None
    return {
        "id": instrument.pk,
        "name": instrument.name,
        "type": instrument.type,
        "blurb": instrument.blurb,
        "origin": instrument.origin,
        "ready": instrument.ready,
        "definition_url": definition_url,
        "source_url": instrument.source_url,
        "license": instrument.license,
        "created_at": instrument.created_at.isoformat(),
    }


@csrf_exempt
@require_http_methods(["GET", "POST"])
def instruments(request):
    if request.method == "POST":
        return import_instrument(request)
    queryset = Instrument.objects.all()
    origin = request.GET.get("origin", "").strip()
    if origin in (Instrument.ORIGIN_BUILTIN, Instrument.ORIGIN_IMPORTED):
        queryset = queryset.filter(origin=origin)
    query = request.GET.get("q", "").strip()
    if query:
        queryset = queryset.filter(name__icontains=query)
    return JsonResponse({"instruments": [serialize(i, request) for i in queryset]})


@jwt_required
def import_instrument(request):
    """Accept a .scsyndef upload. Container-level checks only; the browser
    test-previews the actual definition before relying on it."""
    if request.content_type != "multipart/form-data":
        return JsonResponse({"error": "Use multipart/form-data with a 'definition' file."}, status=400)
    upload = request.FILES.get("definition")
    if upload is None:
        return JsonResponse({"error": "Missing the 'definition' file."}, status=400)
    try:
        validate_synthdef(upload)
    except ValidationError as exc:
        return JsonResponse({"error": exc.messages[0]}, status=400)
    name = (request.POST.get("name") or "").strip()
    if not name:
        return JsonResponse({"error": "Provide the instrument name detected by the engine."}, status=400)
    if Instrument.objects.filter(name=name).exists():
        return JsonResponse({"error": f'An instrument named "{name}" already exists.'}, status=409)
    instrument = Instrument(
        name=name[:120],
        type=(request.POST.get("type") or "Imported")[:40],
        blurb=(request.POST.get("blurb") or "")[:200],
        origin=Instrument.ORIGIN_IMPORTED,
        ready=False,
        definition=upload,
        source_url=(request.POST.get("source_url") or "").strip(),
        license=(request.POST.get("license") or "").strip()[:120],
    )
    instrument.save()
    return JsonResponse(serialize(instrument, request), status=201)
