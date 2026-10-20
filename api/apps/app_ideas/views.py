import json
import logging
from urllib.parse import urlsplit

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from . import github
from .frontmatter import set_rating

logger = logging.getLogger(__name__)

IDEAS_DIR = "ui/src/apps/app-ideas/ideas"
MAX_ATTEMPTS = 3


def error(message, status):
    return JsonResponse({"error": message}, status=status)


def same_origin(request):
    """Browsers always send Origin on cross-site POSTs; reject a mismatching one."""
    origin = request.headers.get("Origin")
    return not origin or urlsplit(origin).netloc == request.get_host()


# Not session/CSRF based: the UI is a static bundle with no login. Access is
# limited by the Tailscale-only network, an Origin check, a JSON-only body and,
# optionally, a Django staff session (IDEAS_RATE_REQUIRE_STAFF=true).
@csrf_exempt
@require_POST
def rate(request, slug):
    token = settings.GITHUB_IDEAS_TOKEN
    if not token:
        return error("Rating is not configured (GITHUB_IDEAS_TOKEN is not set on the api service).", 503)
    if not same_origin(request):
        return error("Cross-origin request refused.", 403)
    if settings.IDEAS_RATE_REQUIRE_STAFF and not (request.user.is_authenticated and request.user.is_staff):
        return error("Sign in to the admin first.", 403)
    if request.content_type != "application/json":
        return error("Use application/json.", 415)
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return error("Invalid JSON.", 400)
    rating = data.get("rating") if isinstance(data, dict) else False
    if rating is not None and (type(rating) is not int or rating not in (1, 2, 3)):
        return error("rating must be 1, 2, 3 or null.", 400)

    repo, branch = settings.GITHUB_IDEAS_REPO, settings.GITHUB_IDEAS_BRANCH
    path = f"{IDEAS_DIR}/{slug}.md"
    label = "unrated" if rating is None else f"{rating} star{'s' if rating > 1 else ''}"
    try:
        for attempt in range(MAX_ATTEMPTS):
            text, sha = github.read_file(token, repo, branch, path)
            try:
                updated = set_rating(text, rating)
            except ValueError:
                return error("Idea file has no frontmatter.", 422)
            if updated == text:
                return JsonResponse({"slug": slug, "rating": rating, "committed": False})
            try:
                github.write_file(token, repo, branch, path, updated, sha, f"rate {slug}: {label}")
                return JsonResponse({"slug": slug, "rating": rating, "committed": True})
            except github.Conflict:
                logger.info("rate %s: sha conflict, retry %s", slug, attempt + 1)
        return error("The idea file keeps changing, try again.", 409)
    except github.NotFound:
        return error("Unknown idea.", 404)
    except github.GitHubError as exc:
        logger.warning("rate %s failed: %s", slug, exc)
        return error("Could not save the rating to GitHub.", 502)
    except Exception:
        logger.exception("rate %s failed", slug)
        return error("Could not save the rating to GitHub.", 502)
