import json

from django.conf import settings
from django.core import signing
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from apps.accounts.decorators import jwt_required
from apps.accounts.views import same_origin
from .notion import NewsUnavailable, canonical_url, read_news, set_archived, set_category


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
        # Fill a logical page across the dated/undated boundary. Request only
        # the remaining capacity so an upstream page never drops any links.
        items, seen = [], set()
        has_more = False
        for _ in range(10):  # bound work even if upstream returns duplicate pages
            result = read_news(cursor, archived, topic, query, undated, category,
                               page_size=20 - len(items))
            for item in result["items"]:
                key = canonical_url(item["url"]) if item.get("url") else item["id"]
                if key not in seen:
                    seen.add(key)
                    items.append(item)
            cursor = result["next_cursor"]
            has_more = bool(cursor)
            if not cursor:
                if undated:
                    break
                undated = True
                has_more = True
                if len(items) == 20:
                    # Check for a real next page rather than offering an empty one.
                    has_more = bool(read_news(None, archived, topic, query, True, category,
                                              page_size=1)["items"])
                    break
            if len(items) == 20:
                break
        result = {"items": items, "fetched_at": result["fetched_at"],
                  "next_cursor": signing.dumps({"cursor": cursor, "undated": undated}, salt=salt)
                  if has_more else None}
    except NewsUnavailable as error:
        return JsonResponse({"error": str(error)}, status=503)
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
