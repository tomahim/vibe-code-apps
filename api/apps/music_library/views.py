import json
import logging

from django.core.paginator import Paginator
from django.db.models import Count, Q
from django.http import JsonResponse
from django.template.defaultfilters import slugify
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from apps.accounts.decorators import jwt_required

from .models import Category, Track

logger = logging.getLogger(__name__)

MAX_PAGE_SIZE = 100


def serialize_track(track, full=False):
    data = {
        "id": track.pk,
        "name": track.name,
        "description": track.description,
        "category": track.category.name if track.category else None,
        "category_slug": track.category.slug if track.category else None,
        "created_at": track.created_at.isoformat(),
        "updated_at": track.updated_at.isoformat(),
    }
    if full:
        data["code"] = track.code
    return data


def json_body(request):
    if request.content_type != "application/json":
        return None
    try:
        return json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


def resolve_category(data):
    """Accept a category name or slug; create it on first use. Returns None for empty."""
    raw = (data.get("category") or "").strip()
    if not raw:
        return None
    category, _ = Category.objects.get_or_create(
        slug=slugify(raw)[:140], defaults={"name": raw[:120]}
    )
    return category


@csrf_exempt
@require_http_methods(["GET", "POST"])
def tracks(request):
    if request.method == "POST":
        return create_track(request)
    return list_tracks(request)


@jwt_required
def create_track(request):
    data = json_body(request)
    if data is None:
        return JsonResponse({"error": "Expected a JSON body."}, status=400)
    name = (data.get("name") or "").strip()
    code = data.get("code") or ""
    if not name or not code.strip():
        return JsonResponse({"error": "Both name and code are required."}, status=400)
    track = Track.objects.create(
        name=name[:200],
        description=(data.get("description") or "").strip(),
        code=code,
        category=resolve_category(data),
    )
    return JsonResponse(serialize_track(track, full=True), status=201)


def list_tracks(request):
    queryset = Track.objects.select_related("category")
    query = (request.GET.get("q") or "").strip()
    if query:
        queryset = queryset.filter(Q(name__icontains=query) | Q(description__icontains=query))
    category = (request.GET.get("category") or "").strip()
    if category:
        queryset = queryset.filter(category__slug=category)
    try:
        page_size = min(int(request.GET.get("page_size", 20)), MAX_PAGE_SIZE)
        page_number = max(int(request.GET.get("page", 1)), 1)
    except ValueError:
        return JsonResponse({"error": "page and page_size must be integers."}, status=400)
    paginator = Paginator(queryset, page_size)
    page = paginator.get_page(page_number)
    return JsonResponse(
        {
            "count": paginator.count,
            "page": page.number,
            "page_size": page_size,
            "results": [serialize_track(t) for t in page.object_list],
        }
    )


@csrf_exempt
@require_http_methods(["GET", "PATCH", "PUT"])
def track_detail(request, pk):
    try:
        track = Track.objects.select_related("category").get(pk=pk)
    except Track.DoesNotExist:
        return JsonResponse({"error": "Track not found."}, status=404)
    if request.method == "GET":
        return JsonResponse(serialize_track(track, full=True))
    return update_track(request, track)


@jwt_required
def update_track(request, track):
    data = json_body(request)
    if data is None:
        return JsonResponse({"error": "Expected a JSON body."}, status=400)
    if "name" in data:
        name = (data.get("name") or "").strip()
        if not name:
            return JsonResponse({"error": "name cannot be empty."}, status=400)
        track.name = name[:200]
    if "description" in data:
        track.description = (data.get("description") or "").strip()
    if "code" in data:
        code = data.get("code") or ""
        if not code.strip():
            return JsonResponse({"error": "code cannot be empty."}, status=400)
        track.code = code
    if "category" in data:
        track.category = resolve_category(data)
    track.save()
    return JsonResponse(serialize_track(track, full=True))


@require_GET
def categories(request):
    rows = Category.objects.annotate(track_count=Count("tracks"))
    return JsonResponse(
        {
            "categories": [
                {"name": c.name, "slug": c.slug, "track_count": c.track_count} for c in rows
            ]
        }
    )
