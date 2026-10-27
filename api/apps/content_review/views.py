import json
import logging
from urllib.parse import urlsplit

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from apps.accounts.decorators import jwt_required

from . import github
from .review import CONTENT_ROOT, build_review

logger = logging.getLogger(__name__)

def error(message, status):
    return JsonResponse({"error": message}, status=status)


def review_settings():
    token = settings.GITHUB_REVIEW_TOKEN
    return token, settings.GITHUB_REVIEW_REPO


def same_origin(request):
    """Browsers always send Origin on cross-site POSTs; reject a mismatching one."""
    origin = request.headers.get("Origin")
    return not origin or urlsplit(origin).netloc == request.get_host()


@never_cache
@require_GET
@jwt_required
def pull_requests(request):
    """Open pull requests, annotated with their atomic-lessons change counts."""
    token, repo = review_settings()
    if not token:
        return error("Content review is not configured (GITHUB_REVIEW_TOKEN is not set on the api service).", 503)
    try:
        prs = github.list_open_prs(token, repo)
        for pr in prs:
            files = github.list_pr_files(token, repo, pr["number"])
            content = [f for f in files if f["path"].startswith(f"{CONTENT_ROOT}/")]
            pr["content_changes"] = {
                "files": len(content),
                "added": sum(1 for f in content if f["status"] == "added"),
                "modified": sum(1 for f in content if f["status"] == "modified"),
                "removed": sum(1 for f in content if f["status"] == "removed"),
            }
        # Content-changing PRs first (stable sort keeps the recency order).
        prs.sort(key=lambda pr: pr["updated_at"], reverse=True)
        prs.sort(key=lambda pr: pr["content_changes"]["files"] == 0)
        return JsonResponse({"pull_requests": prs})
    except github.GitHubError as exc:
        logger.warning("list review pull requests failed: %s", exc)
        return error("Could not load pull requests from GitHub.", 502)
    except Exception:
        logger.exception("list review pull requests failed")
        return error("Could not load pull requests from GitHub.", 502)


@never_cache
@require_GET
@jwt_required
def pull_request_detail(request, number):
    """Every atomic-lessons unit changed by the pull request, parsed from the
    PR head tree (never from the database), with its diff patch."""
    token, repo = review_settings()
    if not token:
        return error("Content review is not configured (GITHUB_REVIEW_TOKEN is not set on the api service).", 503)
    try:
        pr = github.get_pr(token, repo, number)
        files = github.list_pr_files(token, repo, number)
        content_files = [f for f in files if f["path"].startswith(f"{CONTENT_ROOT}/")]
        texts = (
            github.fetch_tree_texts(token, repo, pr["head_sha"], CONTENT_ROOT)
            if content_files
            else {}
        )
        return JsonResponse({"pr": pr, **build_review(texts, content_files)})
    except github.NotFound:
        return error("Unknown pull request.", 404)
    except github.GitHubError as exc:
        logger.warning("review detail for PR %s failed: %s", number, exc)
        return error("Could not load the pull request from GitHub.", 502)
    except Exception:
        logger.exception("review detail for PR %s failed", number)
        return error("Could not load the pull request from GitHub.", 502)
