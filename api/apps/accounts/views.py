import json
import time
from urllib.parse import urlsplit

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.exceptions import ImproperlyConfigured
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .tokens import issue_token

# Brute-force guard: a handful of tries per minute per client IP.
LOGIN_MAX_ATTEMPTS_PER_MINUTE = 5


def error(message, status):
    return JsonResponse({"error": message}, status=status)


def same_origin(request):
    """Browsers always send Origin on cross-site POSTs; reject a mismatching one."""
    origin = request.headers.get("Origin")
    return not origin or urlsplit(origin).netloc == request.get_host()


def over_attempt_limit(key, limit):
    key = f"login:rate:{key}:{int(time.time() // 60)}"
    if cache.add(key, 1, timeout=65):
        return False
    try:
        return cache.incr(key) > limit
    except ValueError:
        return False


# Token login, not session/CSRF based: the UI is a static bundle that stores
# the returned JWT and sends it as a Bearer header. Same-origin, JSON-only.
@never_cache
@csrf_exempt
@require_POST
def login(request):
    if not same_origin(request):
        return error("Cross-origin request refused.", 403)
    if request.content_type != "application/json":
        return error("Use application/json.", 415)
    if over_attempt_limit(request.META.get("REMOTE_ADDR", "unknown"), LOGIN_MAX_ATTEMPTS_PER_MINUTE):
        return error("Too many attempts. Wait a minute and try again.", 429)
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return error("Invalid JSON.", 400)
    email = data.get("email") if isinstance(data, dict) else None
    password = data.get("password") if isinstance(data, dict) else None
    if not isinstance(email, str) or not isinstance(password, str) or not email.strip() or not password:
        return error("Provide email and password.", 400)
    User = get_user_model()
    identifier = email.strip()
    # People sign in with their email; accept the username as a fallback since
    # admin-created accounts may only have one of the two filled in.
    user = User.objects.filter(Q(email__iexact=identifier) | Q(username__iexact=identifier)).first()
    if user is None or not user.check_password(password) or not user.is_active:
        return error("Wrong email or password.", 401)
    try:
        token = issue_token(user)
    except ImproperlyConfigured:
        return error("Sign-in is not configured on the server.", 503)
    return JsonResponse({
        "token": token,
        "user": {
            "email": user.email or user.get_username(),
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
    })
