"""Authenticated owner-scoped Little notes API. Never exposes import payloads."""
import json
from datetime import date
from urllib.parse import urlsplit

from django.db import transaction
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods
from django.core.exceptions import ValidationError

from apps.accounts.decorators import jwt_required
from apps.accounts.views import same_origin
from .models import Content, ContentTag, ObjectType, Tag


def item(content, *, detail=False):
    data = {"id": str(content.pk), "type": content.object_type.slug, "title": content.title,
            "summary": content.summary, "subtitle": content.subtitle, "external_url": content.external_url,
            "image_url": content.image_url, "image_alt": content.image_alt,
            "saved_on": content.saved_on.isoformat(), "published_on": content.published_on,
            "note_on": content.note_on, "updated_at": content.updated_at.isoformat(),
            "tags": [{"slug": t.slug, "name": t.name, "system": t.is_system} for t in content.tags.all()]}
    if detail:
        data.update(body_markdown=content.body_markdown, author=content.author,
                    source_name=content.source_name, claim_status=content.claim_status)
    return data


def body(request):
    if not same_origin(request):
        raise PermissionError("Cross-origin request refused.")
    if request.content_type != "application/json":
        raise ValueError("Use application/json.")
    if len(request.body) > 256 * 1024:
        raise ValueError("Request is too large.")
    data = json.loads(request.body)
    if not isinstance(data, dict):
        raise ValueError("Provide a JSON object.")
    return data


def validate_urls(content):
    for field in ["external_url", "image_url"]:
        value = getattr(content, field)
        if value:
            parsed = urlsplit(value)
            if parsed.scheme not in {"http", "https"} or not parsed.hostname or parsed.username or parsed.password:
                raise ValueError("Only HTTP(S) URLs without credentials are accepted.")


def error(exc):
    return JsonResponse({"error": str(exc)}, status=403 if isinstance(exc, PermissionError) else 400)


def owned(user):
    return Content.objects.filter(owner=user).select_related("object_type").prefetch_related("tags")


@never_cache
@require_GET
@jwt_required
def taxonomy(request):
    return JsonResponse({"types": list(ObjectType.objects.filter(is_active=True).values("slug", "name", "icon")),
                         "tags": list(Tag.objects.values("slug", "name", "is_system")),
                         "months": [{"month": row["month"].strftime("%Y-%m"), "count": row["count"]}
                                    for row in Content.objects.filter(owner=request.user).annotate(month=TruncMonth("saved_on"))
                                    .values("month").annotate(count=Count("id")).order_by("-month")]})


@never_cache
@csrf_exempt
@require_http_methods(["GET", "POST"])
@jwt_required
def collection(request):
    if request.method == "POST":
        try:
            data = body(request)
            kind = ObjectType.objects.get(slug=data.get("type"), is_active=True)
            allowed = {"title", "summary", "body_markdown", "external_url", "image_url", "image_alt", "saved_on", "note_on"}
            values = {k: v for k, v in data.items() if k in allowed}
            if not isinstance(values.get("title"), str) or not values["title"].strip():
                raise ValueError("A title is required.")
            with transaction.atomic():
                content = Content(owner=request.user, object_type=kind, **values)
                validate_urls(content)
                content.full_clean()
                content.save()
                ContentTag.objects.create(content=content, tag=Tag.objects.get(slug="inbox"))
            return JsonResponse(item(owned(request.user).get(pk=content.pk), detail=True), status=201)
        except (ValueError, TypeError, ValidationError, ObjectType.DoesNotExist) as exc:
            return error(ValueError("Invalid content. Check title, type, URLs and dates."))
        except PermissionError as exc:
            return error(exc)
    try:
        query = owned(request.user)
        kind, tag = request.GET.get("type", ""), request.GET.get("tag", "")
        search = request.GET.get("q", "").strip()
        if len(search) > 200:
            raise ValueError("Search is too long.")
        if kind:
            query = query.filter(object_type__slug=kind)
        if tag:
            query = query.filter(tags__slug=tag)
        if search:
            query = query.filter(Q(title__icontains=search) | Q(summary__icontains=search) | Q(body_markdown__icontains=search))
        month = request.GET.get("month", "")
        if month:
            start = date.fromisoformat(month + "-01")
            end = date(start.year + (start.month == 12), start.month % 12 + 1, 1)
            query = query.filter(saved_on__gte=start, saved_on__lt=end)
        page = int(request.GET.get("page", 1))
        if not 1 <= page <= 10000:
            raise ValueError("Invalid page.")
        query = query.distinct()
        count = query.count()
        result = list(query[(page - 1) * 30:page * 30])
        return JsonResponse({"items": [item(c) for c in result], "total": count,
                             "page": page, "next_page": page + 1 if page * 30 < count else None})
    except (ValueError, TypeError) as exc:
        return error(ValueError("Invalid filter or page."))


@never_cache
@csrf_exempt
@require_http_methods(["GET", "PATCH"])
@jwt_required
def detail(request, content_id):
    if request.method == "GET":
        content = owned(request.user).filter(pk=content_id).first()
        return JsonResponse(item(content, detail=True)) if content else JsonResponse({"error": "Not found."}, status=404)
    try:
        data = body(request)
        with transaction.atomic():
            content = Content.objects.select_for_update().filter(owner=request.user, pk=content_id).first()
            if not content:
                return JsonResponse({"error": "Not found."}, status=404)
            if data.get("updated_at") != content.updated_at.isoformat():
                return JsonResponse({"error": "This item changed. Reload before saving."}, status=409)
            allowed = {"title", "summary", "body_markdown", "external_url", "image_url", "image_alt", "saved_on", "note_on"}
            for field in allowed & data.keys():
                setattr(content, field, data[field])
            validate_urls(content)
            content.full_clean()
            content.save()
        return JsonResponse(item(owned(request.user).get(pk=content_id), detail=True))
    except (PermissionError, ValueError, TypeError, ValidationError) as exc:
        return error(exc if isinstance(exc, PermissionError) else ValueError("Invalid content fields."))


@never_cache
@csrf_exempt
@require_http_methods(["POST"])
@jwt_required
def assign_tag(request, content_id):
    try:
        data = body(request)
        slug, enabled = data.get("tag"), data.get("enabled")
        if not isinstance(enabled, bool):
            raise ValueError("Provide tag and enabled boolean.")
        tag = Tag.objects.get(slug=slug)
        with transaction.atomic():
            content = Content.objects.select_for_update().filter(owner=request.user, pk=content_id).first()
            if not content:
                return JsonResponse({"error": "Not found."}, status=404)
            if data.get("updated_at") != content.updated_at.isoformat():
                return JsonResponse({"error": "This item changed. Reload before tagging."}, status=409)
            if enabled:
                if slug in {"archive", "inbox"}:
                    ContentTag.objects.filter(content=content, tag__slug="inbox" if slug == "archive" else "archive").delete()
                ContentTag.objects.get_or_create(content=content, tag=tag)
            else:
                ContentTag.objects.filter(content=content, tag=tag).delete()
            content.save(update_fields=["updated_at"])
        return JsonResponse(item(owned(request.user).get(pk=content_id), detail=True))
    except (PermissionError, ValueError, TypeError, Tag.DoesNotExist) as exc:
        return error(exc if isinstance(exc, PermissionError) else ValueError("Unknown tag or invalid input."))
