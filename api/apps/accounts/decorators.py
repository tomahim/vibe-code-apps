from functools import wraps

import jwt
from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from django.http import JsonResponse

from .tokens import decode_token


def jwt_required(view):
    """Require a valid `Authorization: Bearer <token>` header."""

    @wraps(view)
    def wrapped(request, *args, **kwargs):
        scheme, _, token = request.headers.get("Authorization", "").partition(" ")
        if scheme.lower() != "bearer" or not token.strip():
            return JsonResponse({"error": "Sign in to use this app."}, status=401)
        User = get_user_model()
        try:
            payload = decode_token(token.strip())
            request.user = User.objects.get(pk=payload["sub"], is_active=True)
        except ImproperlyConfigured:
            return JsonResponse({"error": "Sign-in is not configured on the server."}, status=503)
        except (jwt.PyJWTError, KeyError, ValueError, User.DoesNotExist):
            return JsonResponse({"error": "Your session expired. Sign in again."}, status=401)
        return view(request, *args, **kwargs)

    return wrapped
