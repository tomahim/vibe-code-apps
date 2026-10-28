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
from .editing import EDITABLE, EditError, apply_edit
from .review import CONTENT_ROOT, build_review, build_unit, classify

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
        if pr["state"] == "open" and pr.get("head_repo") == repo:
            # The branch ref is current right after an edit; the PR object can lag,
            # and edits are checked against the ref.
            pr["head_sha"] = github.get_branch_head(token, repo, pr["head_ref"])
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


PROTECTED_BRANCHES = {"master", "main"}


@never_cache
@csrf_exempt
@require_POST
@jwt_required
@staff_required
def edit_unit(request, number):
    """Quick edit of one content file, committed on the pull request's branch.

    Guards: staff only, same-origin JSON, open same-repo PR whose branch is not
    the base or a protected branch, content-library paths of an editable kind
    only, the branch must still be at the head the reviewer loaded (409
    otherwise), the file is read at that head and written with its blob sha so
    a concurrent change to the file is rejected, and the edited file is
    re-parsed and compared with the original before anything is committed.
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
    if not isinstance(data, dict):
        return error("Invalid JSON.", 400)
    path = data.get("path")
    head_sha = data.get("head_sha")
    if not isinstance(path, str) or not valid_content_path(path):
        return error("path must point into the atomic-lessons library.", 400)
    kind, _groups = classify(path)
    if kind not in EDITABLE:
        return error("This kind of file cannot be edited here.", 400)
    if not isinstance(head_sha, str) or not head_sha:
        return error("head_sha is required.", 400)
    try:
        pr = github.get_pr(token, repo, number)
        if pr["state"] != "open":
            return error("Only open pull requests can be edited.", 409)
        if pr["head_repo"] != repo:
            return error("Pull requests from forks cannot be edited here.", 403)
        branch = pr["head_ref"]
        if branch == pr["base_ref"] or branch in PROTECTED_BRANCHES:
            return error("Refusing to commit to a protected branch.", 403)
        if github.get_branch_head(token, repo, branch) != head_sha:
            return error("The pull request changed since you opened it. Reload and try again.", 409)
        text, blob_sha = github.get_file(token, repo, path, head_sha)
        try:
            new_text = apply_edit(path, text, data.get("changes"))
        except EditError as exc:
            return error(str(exc), 400)
        changed = ", ".join(sorted(data["changes"]))
        message = f"Edit {kind} {path.rsplit('/', 1)[-1]} via Content Review\n\nChanged: {changed}\nPull request #{number}"
        commit = github.put_file(token, repo, path, branch, new_text, blob_sha, message)
        unit = build_unit({"path": path, "status": "modified", "patch": "", "previous_path": ""}, {path: new_text})
        return JsonResponse({"commit": commit, "head_sha": commit["sha"], "unit": unit}, status=201)
    except github.NotFound:
        return error("Unknown pull request or file.", 404)
    except github.Conflict:
        return error("The file changed on GitHub while you were editing. Reload and try again.", 409)
    except github.GitHubError as exc:
        logger.warning("edit on PR %s failed: %s", number, exc)
        return error(str(exc) if "Contents: write" in str(exc) else "Could not save the edit to GitHub.", 502)
    except Exception:
        logger.exception("edit on PR %s failed", number)
        return error("Could not save the edit to GitHub.", 502)
