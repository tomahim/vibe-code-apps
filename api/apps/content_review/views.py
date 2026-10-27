import json
import logging
from functools import wraps
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


def staff_required(view):
    """Limit the review app to staff reviewers.

    Commenting publishes through the repo owner's server-side GitHub token and
    the repo may go private, so every endpoint (reads included) requires a
    staff account, not just any signed-in learner account.
    """

    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if not request.user.is_staff:
            return error("Content review is limited to reviewers.", 403)
        return view(request, *args, **kwargs)

    return wrapped


def valid_content_path(path):
    """Confinement check that rejects traversal, not just foreign prefixes."""
    parts = path.split("/")
    return (
        len(parts) > 1
        and parts[0] == CONTENT_ROOT
        and all(part not in ("", ".", "..") for part in parts)
    )


def same_origin(request):
    """Browsers always send Origin on cross-site POSTs; reject a mismatching one."""
    origin = request.headers.get("Origin")
    return not origin or urlsplit(origin).netloc == request.get_host()


@never_cache
@require_GET
@jwt_required
@staff_required
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
@staff_required
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


MAX_COMMENT_LENGTH = 5000


@never_cache
@csrf_exempt
@require_POST
@jwt_required
@staff_required
def post_comment(request, number):
    """Post the reviewer's feedback as a comment on the pull request.

    The comment is published by the GitHub account behind GITHUB_REVIEW_TOKEN,
    with the reviewed unit's kind, title and file path quoted for context.
    """
    token, repo = review_settings()
    if not token:
        return error("Content review is not configured (GITHUB_REVIEW_TOKEN is not set on the api service).", 503)
    if not same_origin(request):
        return error("Cross-origin request refused.", 403)
    if request.content_type != "application/json":
        return error("Use application/json.", 415)
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return error("Invalid JSON.", 400)
    text = data.get("text") if isinstance(data, dict) else None
    if not isinstance(text, str) or not text.strip():
        return error("text is required.", 400)
    text = text.strip()
    if len(text) > MAX_COMMENT_LENGTH:
        return error(f"text must be at most {MAX_COMMENT_LENGTH} characters.", 400)

    kind = data.get("kind") if isinstance(data.get("kind"), str) else ""
    title = data.get("title") if isinstance(data.get("title"), str) else ""
    path = data.get("path") if isinstance(data.get("path"), str) else ""
    if path and not valid_content_path(path):
        return error("path must point into the atomic-lessons library.", 400)

    subject = "Pull request"
    if path:
        label = f'{kind} "{title}"' if kind and title else (title or kind or "file")
        subject = f"{label} - `{path}`"
    body = f"**Content review** - {subject}\n\n{text}"
    try:
        comment = github.post_pr_comment(token, repo, number, body)
        return JsonResponse({"comment": comment}, status=201)
    except github.NotFound:
        return error("Unknown pull request.", 404)
    except github.GitHubError as exc:
        logger.warning("comment on PR %s failed: %s", number, exc)
        return error("Could not post the comment to GitHub.", 502)
    except Exception:
        logger.exception("comment on PR %s failed", number)
        return error("Could not post the comment to GitHub.", 502)
