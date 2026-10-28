"""Same-origin delivery of published artwork, without exposing a file proxy."""
import hashlib
from pathlib import PurePosixPath
import re
from urllib.parse import quote

import requests
from django.conf import settings
from django.core.cache import cache
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.views.decorators.cache import never_cache
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


@never_cache
@require_GET
def content_image(request, kind, content_id):
    # Published artwork is public so ordinary <img src> works without a Bearer
    # header. No learner state, Markdown, questions or arbitrary paths are served.
    from .api import visible

    model = IMAGE_MODELS.get(kind)
    if model is None:
        raise Http404
    row = get_object_or_404(visible(model), pk=content_id)
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
        return JsonResponse({"error": "Content image source is not configured or published."}, status=503)
    url = f"https://raw.githubusercontent.com/{repository}/{commit}/{quote(path, safe='/')}"
    key = "learning-image:" + hashlib.sha256(url.encode()).hexdigest()
    data = cache.get(key)
    if data is None:
        try:
            with requests.get(url, stream=True, timeout=(5, 15), allow_redirects=False) as upstream:
                if upstream.status_code == 404:
                    raise Http404
                if upstream.status_code != 200:
                    return JsonResponse({"error": "Content image is temporarily unavailable."}, status=502)
                data = bytearray()
                for chunk in upstream.iter_content(chunk_size=64 * 1024):
                    data.extend(chunk)
                    if len(data) > MAX_IMAGE_BYTES:
                        return JsonResponse({"error": "Content image exceeds the delivery limit."}, status=502)
                data = bytes(data)
        except requests.RequestException:
            return JsonResponse({"error": "Content image is temporarily unavailable."}, status=502)
        if not data:
            return JsonResponse({"error": "Content image is empty."}, status=502)
        cache.set(key, data, timeout=3600)

    response = HttpResponse(data, content_type=content_type)
    response["Content-Length"] = len(data)
    response["X-Content-Type-Options"] = "nosniff"
    # SVG is an authored image format; prevent active content on direct visits.
    response["Content-Security-Policy"] = "default-src 'none'; sandbox"
    return response
