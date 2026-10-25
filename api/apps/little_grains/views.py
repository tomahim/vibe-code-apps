from django.http import JsonResponse
from django.views.decorators.http import require_GET

from apps.accounts.decorators import jwt_required

from .lessons import LESSONS


@require_GET
@jwt_required
def lessons(request):
    return JsonResponse({"lessons": LESSONS})
