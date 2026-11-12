from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET

from apps.accounts.decorators import jwt_required

from .models import active_flag_keys


@never_cache
@require_GET
@jwt_required
def me(request):
    user = request.user
    return JsonResponse({
        "user": {
            "email": user.email or user.get_username(),
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
        "feature_flags": active_flag_keys(user),
    })
