import logging
from functools import wraps

from django.conf import settings
from django.db import DatabaseError, connection
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET

from apps.accounts.decorators import jwt_required

from . import stats

logger = logging.getLogger(__name__)


def staff_required(view):
    """The dashboard lists every table of every app, so it is staff only."""

    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if not request.user.is_staff:
            return JsonResponse({"error": "The database dashboard is limited to staff."}, status=403)
        return view(request, *args, **kwargs)

    return wrapped


@never_cache
@require_GET
@jwt_required
@staff_required
def overview(request):
    if connection.vendor != "postgresql":
        return JsonResponse(
            {"error": "The database dashboard needs PostgreSQL. This server is using " + connection.vendor + "."},
            status=503,
        )
    try:
        payload = stats.collect()
    except DatabaseError:
        logger.exception("db dashboard query failed")
        return JsonResponse({"error": "Could not read database statistics."}, status=502)
    payload["storage_limit_bytes"] = settings.DB_STORAGE_LIMIT_BYTES or None
    return JsonResponse(payload)
