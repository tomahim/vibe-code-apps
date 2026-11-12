from functools import wraps

from django.http import JsonResponse

from .models import flag_enabled


def feature_flag_required(key):
    """Answer 404 unless the flag is on for request.user.

    Stack it below @jwt_required so request.user is set. A flag that does not
    exist, is off for the user, or cannot be read hides the endpoint."""

    def decorator(view):
        @wraps(view)
        def wrapped(request, *args, **kwargs):
            if not flag_enabled(request.user, key):
                return JsonResponse({"error": "Not found."}, status=404)
            return view(request, *args, **kwargs)

        return wrapped

    return decorator
