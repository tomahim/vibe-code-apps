"""Optional Google ID-token sign-in for explicitly linked existing users.

No Google access/refresh token is requested or stored. The ID token only
proves the provider subject; email never selects or links a local account.
"""
import json
import secrets
from urllib.parse import urlsplit

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import signing
from django.core.exceptions import ImproperlyConfigured
from django.db import IntegrityError, transaction
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils.crypto import constant_time_compare
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_GET, require_POST
from google.auth.exceptions import GoogleAuthError, TransportError
from google.auth.transport.requests import Request
from google.oauth2.id_token import verify_oauth2_token

from .models import ExternalIdentity
from .tokens import issue_token, signing_key
from .views import error, over_attempt_limit, LOGIN_MAX_ATTEMPTS_PER_MINUTE

NONCE_COOKIE = "google_signin_nonce"
NONCE_PATH = "/api/auth/google/"
NONCE_TTL = 300
NONCE_SALT = "accounts.google.nonce"


def enabled(request):
    origin = f"{request.scheme}://{request.get_host()}"
    parsed = urlsplit(origin)
    secure = parsed.scheme == "https" or (
        parsed.scheme == "http" and parsed.hostname in {"localhost", "127.0.0.1", "::1"}
    )
    return bool(settings.GOOGLE_SIGN_IN_ENABLED and settings.GOOGLE_CLIENT_ID and secure
                and origin in settings.GOOGLE_ALLOWED_ORIGINS)


@never_cache
@require_GET
def config(request):
    if not enabled(request):
        return JsonResponse({"enabled": False})
    try:
        signing_key()
    except ImproperlyConfigured:
        return JsonResponse({"enabled": False})
    nonce = signing.dumps(secrets.token_urlsafe(32), salt=NONCE_SALT)
    response = JsonResponse({"enabled": True, "client_id": settings.GOOGLE_CLIENT_ID,
                             "nonce": nonce, "csrf_token": get_token(request)})
    response.set_cookie(NONCE_COOKIE, nonce, max_age=NONCE_TTL, path=NONCE_PATH,
                        secure=request.is_secure(), httponly=True, samesite="Strict")
    return response


class InvalidCredential(Exception):
    pass


def google_subject(request, credential):
    nonce = request.COOKIES.get(NONCE_COOKIE, "")
    try:
        signing.loads(nonce, salt=NONCE_SALT, max_age=NONCE_TTL)
    except signing.BadSignature as exc:
        raise InvalidCredential from exc
    # A new transport per verification avoids sharing mutable requests sessions.
    # Bound Google's certificate fetch so unavailable Google never hangs login.
    session = requests.Session()
    transport = Request(session=session)
    def fetch(*args, **kwargs):
        kwargs["timeout"] = 5
        return transport(*args, **kwargs)
    try:
        claims = verify_oauth2_token(credential, fetch, settings.GOOGLE_CLIENT_ID)
    finally:
        session.close()
    subject = claims.get("sub")
    if (not isinstance(subject, str) or not 0 < len(subject) <= 255
            or claims.get("email_verified") is not True
            or not constant_time_compare(str(claims.get("nonce", "")), nonce)):
        raise InvalidCredential
    return subject


def success(user):
    try:
        token = issue_token(user)
    except ImproperlyConfigured:
        return error("Sign-in is not configured on the server.", 503)
    response = JsonResponse({"token": token, "user": {
        "email": user.email or user.get_username(),
        "first_name": user.first_name, "last_name": user.last_name,
    }})
    response.delete_cookie(NONCE_COOKIE, path=NONCE_PATH, samesite="Strict")
    return response


@never_cache
@csrf_protect
@require_POST
def authenticate(request):
    if not enabled(request):
        return error("Google sign-in is unavailable.", 503)
    # Require the exact configured origin, including scheme and port.
    if request.headers.get("Origin") != f"{request.scheme}://{request.get_host()}":
        return error("Cross-origin request refused.", 403)
    if request.content_type != "application/json":
        return error("Use application/json.", 415)
    if over_attempt_limit("google:" + request.META.get("REMOTE_ADDR", "unknown"),
                          LOGIN_MAX_ATTEMPTS_PER_MINUTE):
        return error("Too many attempts. Wait a minute and try again.", 429)
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return error("Invalid JSON.", 400)
    if not isinstance(data, dict) or not isinstance(data.get("credential"), str) or not 0 < len(data["credential"]) <= 16384:
        return error("Provide a Google credential.", 400)
    try:
        signing_key()  # Do not create an identity if token issuance would fail.
        subject = google_subject(request, data["credential"])
    except ImproperlyConfigured:
        return error("Sign-in is not configured on the server.", 503)
    except (TransportError, requests.RequestException):
        return error("Google sign-in is temporarily unavailable. Try again.", 503)
    except (InvalidCredential, ValueError, GoogleAuthError):
        return error("Google sign-in could not be verified. Try again.", 401)

    link = data.get("link") is True
    identity = ExternalIdentity.objects.select_related("user").filter(provider="google", subject=subject).first()
    if not link:
        if identity is None:
            return JsonResponse({"error": "Sign in with your existing password to link this Google account.",
                                 "code": "link_required"}, status=403)
        if not identity.user.is_active:
            return error("Google sign-in is not available for this account.", 401)
        return success(identity.user)

    # Both proofs are required, even if a browser already has a bearer token.
    # No account is selected using the email inside the Google ID token.
    identifier, password = data.get("email"), data.get("password")
    if not isinstance(identifier, str) or not isinstance(password, str) or not password:
        return error("Provide your existing account email and password to link.", 400)
    User = get_user_model()
    from django.db.models import Q
    matches = User.objects.filter(Q(email__iexact=identifier.strip()) | Q(username__iexact=identifier.strip()))
    users = list(matches[:2])
    user = users[0] if len(users) == 1 else None
    if user is None or not user.is_active or not user.check_password(password):
        return error("Wrong email or password.", 401)
    if identity is not None and identity.user_id != user.pk:
        return error("This Google account is already linked to another account.", 409)
    try:
        with transaction.atomic():
            identity, _ = ExternalIdentity.objects.get_or_create(
                provider="google", subject=subject, defaults={"user": user})
            if identity.user_id != user.pk:
                return error("This Google account is already linked to another account.", 409)
    except IntegrityError:
        return error("An account link already exists. No links were changed.", 409)
    return success(user)
