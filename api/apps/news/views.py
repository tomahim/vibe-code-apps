import json

from django.conf import settings
from django.core import signing
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from apps.accounts.decorators import jwt_required
from apps.accounts.views import same_origin
from .notion import NewsUnavailable, read_news, set_archived, set_category


def allowed(request):
    return str(request.user.pk) in settings.NOTION_NEWS_ALLOWED_USER_IDS


@never_cache
@require_GET
@jwt_required
def news(request):
    if not allowed(request):
        return JsonResponse({"error": "This personal news feed is not shared with your account."}, status=403)
    view = request.GET.get("view", "news")
    categories = {"inbox": "Inbox", "news": "News", "favorite": "Favorite", "inspiration": "Inspiration"}
    if view not in {*categories, "archive"}:
        return JsonResponse({"error": "Unknown category."}, status=400)
    archived = view == "archive"
    category = categories.get(view, "")
    topic = request.GET.get("topic", "").strip()
    query = request.GET.get("q", "").strip()
    if len(topic) > 100 or len(query) > 200:
        return JsonResponse({"error": "Filter is too long."}, status=400)
    cursor = request.GET.get("cursor")
    undated = False
    salt = f"news:{settings.NOTION_NEWS_DATA_SOURCE_ID}:{request.user.pk}:{archived}:{category}:{topic}:{query}"
    if cursor:
        try:
            state = signing.loads(cursor, salt=salt, max_age=86400)
            cursor, undated = state["cursor"], state["undated"]
            if (cursor is not None and not isinstance(cursor, str)) or not isinstance(undated, bool):
                raise signing.BadSignature()
        except (signing.BadSignature, KeyError, TypeError):
            return JsonResponse({"error": "Page link expired. Refresh the feed."}, status=400)
    try:
        result = dict(read_news(cursor, archived, topic, query, undated, category))
        # Exhaust known publication dates first. Then page undated entries by
        # saved date / creation time, with no assumption about Notion null order.
        if not undated and not result["items"] and not result["next_cursor"]:
            undated = True
            result = dict(read_news(None, archived, topic, query, True, category))
    except NewsUnavailable as error:
        return JsonResponse({"error": str(error)}, status=503)
    if result["next_cursor"]:
        result["next_cursor"] = signing.dumps({"cursor": result["next_cursor"], "undated": undated}, salt=salt)
    elif not undated:
        try:
            has_undated = read_news(None, archived, topic, query, True, category)["items"]
        except NewsUnavailable as error:
            return JsonResponse({"error": str(error)}, status=503)
        if has_undated:
            result["next_cursor"] = signing.dumps({"cursor": None, "undated": True}, salt=salt)
    return JsonResponse(result)


@never_cache
@csrf_exempt
@require_POST
@jwt_required
def archive_news(request, page_id):
    if not allowed(request):
        return JsonResponse({"error": "This personal news feed is not shared with your account."}, status=403)
    if not same_origin(request):
        return JsonResponse({"error": "Cross-origin request refused."}, status=403)
    if request.content_type != "application/json":
        return JsonResponse({"error": "Use application/json."}, status=415)
    if len(request.body) > 1024:
        return JsonResponse({"error": "Request too large."}, status=413)
    try:
        value = json.loads(request.body).get("archived")
        if not isinstance(value, bool):
            raise ValueError()
    except (ValueError, AttributeError, UnicodeDecodeError):
        return JsonResponse({"error": "Provide an archived boolean."}, status=400)
    try:
        set_archived(page_id, value)
    except NewsUnavailable as error:
        return JsonResponse({"error": str(error)}, status=503)
    return JsonResponse({"archived": value})


@never_cache
@csrf_exempt
@require_POST
@jwt_required
def category_news(request, page_id):
    if not allowed(request):
        return JsonResponse({"error": "This personal news feed is not shared with your account."}, status=403)
    if not same_origin(request):
        return JsonResponse({"error": "Cross-origin request refused."}, status=403)
    if request.content_type != "application/json":
        return JsonResponse({"error": "Use application/json."}, status=415)
    if len(request.body) > 1024:
        return JsonResponse({"error": "Request too large."}, status=413)
    try:
        value = json.loads(request.body).get("category")
        if not isinstance(value, str) or value not in {"Inbox", "News", "Favorite", "Inspiration"}:
            raise ValueError()
    except (ValueError, AttributeError, UnicodeDecodeError):
        return JsonResponse({"error": "Provide a valid category."}, status=400)
    try:
        set_category(page_id, value)
    except NewsUnavailable as error:
        return JsonResponse({"error": str(error)}, status=503)
    return JsonResponse({"category": value})
