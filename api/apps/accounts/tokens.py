"""HS256 JWT access tokens signed with DJANGO_SECRET_KEY.

Stateless: no session table, no refresh token. The token carries the user id
and an expiry; every protected endpoint re-checks signature, expiry and that
the user still exists and is active.
"""

import time

import jwt
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

ALGORITHM = "HS256"


def signing_key():
    """Refuse the public local-dev key when a real secret is required.

    A JWT signed with a known key (the dev default or the Terraform
    placeholder) can be forged by anyone, so production must never issue or
    accept tokens without a real DJANGO_SECRET_KEY.
    """
    from config.settings import INSECURE_SECRET_KEYS

    if settings.SECRET_KEY_REQUIRED and settings.SECRET_KEY in INSECURE_SECRET_KEYS:
        raise ImproperlyConfigured(
            "Set DJANGO_SECRET_KEY to a real secret before using JWT sign-in in production."
        )
    return settings.SECRET_KEY


def issue_token(user):
    now = int(time.time())
    payload = {
        "sub": str(user.pk),
        "email": user.email or user.get_username(),
        "iat": now,
        "exp": now + settings.AUTH_JWT_TTL_SECONDS,
    }
    return jwt.encode(payload, signing_key(), algorithm=ALGORITHM)


def decode_token(token):
    """Return the payload or raise jwt.PyJWTError (bad signature/expired)."""
    return jwt.decode(token, signing_key(), algorithms=[ALGORITHM])
