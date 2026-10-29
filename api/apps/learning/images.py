"""Same-origin delivery of published artwork, without exposing a file proxy."""
import hashlib
from pathlib import PurePosixPath
import re
from urllib.parse import quote

import requests
from django.conf import settings
from django.core.cache import cache
from django.core.files.storage import default_storage
from django.http import Http404, HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.utils.cache import add_never_cache_headers
from django.views.decorators.http import require_GET

from .models import Card, LearningPath, Lesson, SyncLog, Theme


IMAGE_MODELS = {model.CONTENT_KIND: model for model in (Theme, LearningPath, Lesson, Card)}
IMAGE_TYPES = {
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
}
MAX_IMAGE_BYTES = 10 * 1024 * 1024


def image_path(row):
    return row.illustration_path if isinstance(row, Card) else row.image_path


def image_url(row):
    if not image_path(row):
        return ""
    return reverse("learning-image", kwargs={"kind": row.CONTENT_KIND, "content_id": row.pk})


def illustration_srcset(card):
    """Width-described variant URLs for a card with processed WebP variants."""
    variants = card.illustration_variants
    if not isinstance(variants, dict) or not variants:
        return []
    base = reverse("learning-image", kwargs={"kind": card.CONTENT_KIND, "content_id": card.pk})
    return [
        {"url": f"{base}?w={width}", "width": int(width)}
        for width in sorted(variants, key=int)
    ]


# Redirects must be re-requested before the bucket's signed URLs expire
# (genious-media is private, AWS_QUERYSTRING_EXPIRE defaults to one hour).
SIGNED_REDIRECT_CACHE_SECONDS = 3000


def variant_redirect(request, card):
    """Cards with processed WebP variants get a fresh signed bucket URL (#195).

    The bucket stays private: each request mints a short-lived presigned URL
    and the redirect itself is cacheable only for less than that lifetime, so
    no stale signature ever ships. Anything odd falls back to the repository
    proxy below.
    """
    variants = card.illustration_variants
    if not isinstance(variants, dict) or not variants:
        return None
    prefix = f"learning/{card.pk}/"
    candidates = [variants.get(request.GET.get("w", "")), variants.get("640")]
    candidates += [variants[width] for width in sorted(variants, key=int)]
    key = next((c for c in candidates if isinstance(c, str) and c.startswith(prefix)), None)
    if key is None:
        return None
    try:
        signed = default_storage.url(key)
    except Exception:
        return None
    response = HttpResponseRedirect(signed)
    response["Cache-Control"] = f"public, max-age={SIGNED_REDIRECT_CACHE_SECONDS}"
    return response


@require_GET
def content_image(request, kind, content_id):
    # Published artwork is public so ordinary <img src> works without a Bearer
    # header. No learner state, Markdown, questions or arbitrary paths are served.
    from .api import visible

    model = IMAGE_MODELS.get(kind)
    if model is None:
        raise Http404
    row = get_object_or_404(visible(model), pk=content_id)
    if isinstance(row, Card):
        redirect = variant_redirect(request, row)
        if redirect is not None:
            return redirect
    path = image_path(row)
    parts = path.split("/")
    content_type = IMAGE_TYPES.get(PurePosixPath(path).suffix.lower())
    if (not path or not content_type or "\\" in path
            or any(part in ("", ".", "..") for part in parts)):
        raise Http404

    # Use the publication snapshot, not the index.md's last-changed commit:
    # replacing an image alone must also change the bytes served here.
    commit = SyncLog.objects.values_list("commit_sha", flat=True).first()
    repository = settings.LEARNING_CONTENT_REPOSITORY
    if (not commit or not re.fullmatch(r"[0-9a-fA-F]{40,64}", commit)
            or not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository)):
        return never_cache_json({"error": "Content image source is not configured or published."}, status=503)
    url = f"https://raw.githubusercontent.com/{repository}/{commit}/{quote(path, safe='/')}"
    key = "learning-image:" + hashlib.sha256(url.encode()).hexdigest()
    data = cache.get(key)
    if data is None:
        try:
            with requests.get(url, stream=True, timeout=(5, 15), allow_redirects=False) as upstream:
                if upstream.status_code == 404:
                    raise Http404
                if upstream.status_code != 200:
                    return never_cache_json({"error": "Content image is temporarily unavailable."}, status=502)
                data = bytearray()
                for chunk in upstream.iter_content(chunk_size=64 * 1024):
                    data.extend(chunk)
                    if len(data) > MAX_IMAGE_BYTES:
                        return never_cache_json({"error": "Content image exceeds the delivery limit."}, status=502)
                data = bytes(data)
        except requests.RequestException:
            return never_cache_json({"error": "Content image is temporarily unavailable."}, status=502)
        if not data:
            return never_cache_json({"error": "Content image is empty."}, status=502)
        cache.set(key, data, timeout=3600)

    response = HttpResponse(data, content_type=content_type)
    response["Content-Length"] = len(data)
    response["X-Content-Type-Options"] = "nosniff"
    # SVG is an authored image format; prevent active content on direct visits.
    response["Content-Security-Policy"] = "default-src 'none'; sandbox"
    add_never_cache_headers(response)
    return response


def never_cache_json(data, status):
    response = JsonResponse(data, status=status)
    add_never_cache_headers(response)
    return response
