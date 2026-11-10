"""Authenticated owner-scoped Little notes API. Never exposes import payloads."""
import json
from datetime import date
from urllib.parse import urlsplit

from django.db import IntegrityError, transaction
from django.db.models import Count, Max, Q
from django.db.models.functions import TruncMonth
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods
from django.core.exceptions import ValidationError
from django.utils.text import slugify
import re

from apps.accounts.decorators import jwt_required
from apps.accounts.views import same_origin
from .models import Category, Content, ContentCategory, ContentTag, ObjectType, Tag, ViewPreference


def item(content, *, detail=False):
    data = {"id": str(content.pk), "type": content.object_type.slug, "title": content.title,
            "summary": content.summary, "subtitle": content.subtitle, "external_url": content.external_url,
            "image_url": content.image_url, "image_alt": content.image_alt,
            "saved_on": content.saved_on.isoformat(), "published_on": content.published_on,
            "note_on": content.note_on, "updated_at": content.updated_at.isoformat(),
            "categories": [{"slug": c.slug, "name": c.name, "system": c.is_system} for c in content.categories.all()],
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
    return Content.objects.filter(owner=user).select_related("object_type").prefetch_related("tags", "categories")


def inbox_view(query):
    # Inbox is the unprocessed view: explicit Inbox, uncategorized
    # objects, and every non-archived news item. Keep stored categories
    # untouched, including intentional non-news lanes.
    return query.filter(Q(categories__slug="inbox") | Q(categories__isnull=True)
                        | Q(object_type__slug="news")).exclude(
                            object_type__slug="news", categories__slug="archive")


@never_cache
@require_GET
@jwt_required
def taxonomy(request):
    return JsonResponse({"types": list(ObjectType.objects.filter(is_active=True).values("slug", "name", "icon")),
                         "categories": [{"slug": c.slug, "name": c.name, "is_system": c.is_system, "position": c.position,
                                         "types": sorted(c.object_types.values_list("slug", flat=True))}
                                        for c in Category.objects.prefetch_related("object_types")],
                         "tags": list(Tag.objects.values("slug", "name", "is_system")),
                         "can_manage_taxonomy": request.user.is_staff,
                         "view_preferences": dict(ViewPreference.objects.filter(owner=request.user).values_list("object_type__slug", "view")),
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
                ContentCategory.objects.create(content=content, category=Category.objects.get(slug="inbox"))
            return JsonResponse(item(owned(request.user).get(pk=content.pk), detail=True), status=201)
        except (ValueError, TypeError, ValidationError, ObjectType.DoesNotExist, Category.DoesNotExist) as exc:
            return error(ValueError("Invalid content. Check title, type, URLs and dates."))
        except PermissionError as exc:
            return error(exc)
    try:
        query = owned(request.user)
        kind, tag = request.GET.get("type", ""), request.GET.get("tag", "")
        category = request.GET.get("category", "")
        search = request.GET.get("q", "").strip()
        if len(search) > 200:
            raise ValueError("Search is too long.")
        if tag:
            query = query.filter(tags__slug=tag)
        if search:
            query = query.filter(Q(title__icontains=search) | Q(summary__icontains=search) | Q(body_markdown__icontains=search))
        month = request.GET.get("month", "")
        if month:
            start = date.fromisoformat(month + "-01")
            end = date(start.year + (start.month == 12), start.month % 12 + 1, 1)
            query = query.filter(saved_on__gte=start, saved_on__lt=end)
        # Type counts share tag, search, month and category but not the type
        # filter, so a sidebar number is what choosing that type shows.
        typed = inbox_view(query) if category == "inbox" else query.filter(categories__slug=category) if category else query
        type_counts = {row["object_type__slug"]: row["count"]
                       for row in typed.values("object_type__slug").annotate(count=Count("id", distinct=True))}
        type_counts["all"] = typed.distinct().count()
        if kind:
            query = query.filter(object_type__slug=kind)
        # Tab counts share the current context (type, tag, search, month) but
        # not the category filter, so a tab's number is what choosing it
        # shows. Inbox keeps its view semantics, so it is counted with the
        # same rules as the Inbox list itself.
        category_counts = {row["categories__slug"]: row["count"]
                           for row in query.values("categories__slug").annotate(count=Count("id", distinct=True))
                           if row["categories__slug"]}
        category_counts["inbox"] = inbox_view(query).distinct().count()
        category_counts["all"] = query.distinct().count()
        if category == "inbox":
            query = inbox_view(query)
        elif category:
            query = query.filter(categories__slug=category)
        page = int(request.GET.get("page", 1))
        if not 1 <= page <= 10000:
            raise ValueError("Invalid page.")
        query = query.distinct()
        count = query.count()
        result = list(query[(page - 1) * 30:page * 30])
        return JsonResponse({"items": [item(c) for c in result], "total": count,
                             "page": page, "next_page": page + 1 if page * 30 < count else None,
                             "category_counts": category_counts, "type_counts": type_counts})
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
                ContentTag.objects.get_or_create(content=content, tag=tag)
            else:
                ContentTag.objects.filter(content=content, tag=tag).delete()
            content.save(update_fields=["updated_at"])
        return JsonResponse(item(owned(request.user).get(pk=content_id), detail=True))
    except (PermissionError, ValueError, TypeError, Tag.DoesNotExist) as exc:
        return error(exc if isinstance(exc, PermissionError) else ValueError("Unknown tag or invalid input."))


@never_cache
@csrf_exempt
@require_http_methods(["POST"])
@jwt_required
def assign_category(request, content_id):
    try:
        data = body(request)
        slug, enabled = data.get("category"), data.get("enabled")
        if not isinstance(enabled, bool):
            raise ValueError("Provide category and enabled boolean.")
        category = Category.objects.prefetch_related("object_types").get(slug=slug)
        with transaction.atomic():
            content = Content.objects.select_for_update().filter(owner=request.user, pk=content_id).first()
            if not content:
                return JsonResponse({"error": "Not found."}, status=404)
            if data.get("updated_at") != content.updated_at.isoformat():
                return JsonResponse({"error": "This item changed. Reload before saving."}, status=409)
            if category.object_types.exists() and not category.object_types.filter(pk=content.object_type_id).exists():
                raise ValueError("This category does not apply to this object type.")
            if enabled:
                # Choosing a category is the triage decision ("I have read it"):
                # any category other than Inbox takes the object out of the
                # Inbox while keeping its other categories. Inbox and Archive
                # stay mutually exclusive; removing a category never restores
                # the Inbox, and topic tags are a separate axis, never touched.
                if slug == "inbox":
                    ContentCategory.objects.filter(content=content, category__slug="archive").delete()
                else:
                    ContentCategory.objects.filter(content=content, category__slug="inbox").delete()
                ContentCategory.objects.get_or_create(content=content, category=category)
            else:
                ContentCategory.objects.filter(content=content, category=category).delete()
            content.save(update_fields=["updated_at"])
        return JsonResponse(item(owned(request.user).get(pk=content_id), detail=True))
    except (PermissionError, ValueError, TypeError, Category.DoesNotExist) as exc:
        return error(exc if isinstance(exc, PermissionError) else ValueError("Unknown category or invalid input."))


@never_cache
@csrf_exempt
@require_http_methods(["POST"])
@jwt_required
def create_taxonomy(request, kind):
    """Create shared vocabulary only. No renames, deletes or scope edits."""
    if not request.user.is_staff:
        return JsonResponse({"error": "Only staff can manage the shared vocabulary."}, status=403)
    models = {"categories": Category, "tags": Tag, "types": ObjectType}
    model = models.get(kind)
    if model is None:
        return JsonResponse({"error": "Unknown vocabulary kind."}, status=404)
    try:
        data = body(request)
        allowed = {"name", "slug"} | ({"types"} if kind == "categories" else set()) | (
            {"description", "icon"} if kind == "types" else set())
        if data.keys() - allowed:
            raise ValueError("Unsupported fields. Existing vocabulary cannot be changed here.")
        name = data.get("name")
        if not isinstance(name, str) or not name.strip() or len(name.strip()) > 100:
            raise ValueError("Enter a name of 1 to 100 characters.")
        name = name.strip()
        slug = data.get("slug", slugify(name))
        limit = model._meta.get_field("slug").max_length
        if not isinstance(slug, str) or len(slug) > limit or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
            raise ValueError(f"Use a key of 1 to {limit} lowercase letters, numbers and single hyphens.")
        # Navigation slugs remain categories, never topic tags. System categories
        # are provisioned by migrations, not by this create-only endpoint.
        reserved = {"inbox", "archive", "favorite"}
        if (kind == "categories" and slug in reserved) or (kind == "tags" and slug in reserved | {"promising", "to-improve", "inspiration"}):
            raise ValueError("This key is reserved for navigation categories. Choose another key.")
        values = {"slug": slug, "name": name}
        types = []
        if kind == "categories":
            slugs = data.get("types", [])
            if not isinstance(slugs, list) or len(slugs) > 100 or any(not isinstance(v, str) for v in slugs):
                raise ValueError("Choose a list of active object types.")
            types = list(ObjectType.objects.filter(slug__in=slugs, is_active=True))
            if {t.slug for t in types} != set(slugs):
                raise ValueError("An object type no longer exists or is inactive. Reload and try again.")
        if kind == "types":
            for field, limit in [("description", 2000), ("icon", 64)]:
                value = data.get(field, "")
                if not isinstance(value, str) or len(value) > limit:
                    raise ValueError(f"{field.capitalize()} must be text of at most {limit} characters.")
                values[field] = value.strip()
        with transaction.atomic():
            if model.objects.filter(slug__iexact=slug).exists():
                return JsonResponse({"error": "This key already exists. Choose another key."}, status=409)
            values["position"] = (model.objects.aggregate(last=Max("position"))["last"] or 0) + 1
            entry = model(**values)
            entry.full_clean()
            entry.save()
            if kind == "categories":
                entry.object_types.set(types)
        return JsonResponse({"slug": entry.slug, "name": entry.name}, status=201)
    except IntegrityError:
        return JsonResponse({"error": "This key already exists. Reload before trying again."}, status=409)
    except ValidationError:
        return JsonResponse({"error": "Invalid vocabulary fields. Check the name and key."}, status=400)
    except (PermissionError, ValueError, TypeError, UnicodeDecodeError) as exc:
        return error(exc)


@never_cache
@csrf_exempt
@require_http_methods(["PUT"])
@jwt_required
def view_preference(request, type_slug):
    try:
        data = body(request)
        if set(data) != {"view"} or data["view"] not in ViewPreference.View.values:
            raise ValueError("Choose default, database, table, cards or calendar.")
        kind = ObjectType.objects.get(slug=type_slug, is_active=True)
        preference, _ = ViewPreference.objects.update_or_create(
            owner=request.user, object_type=kind, defaults={"view": data["view"]})
        return JsonResponse({"type": kind.slug, "view": preference.view})
    except ObjectType.DoesNotExist:
        return JsonResponse({"error": "Object type not found."}, status=404)
    except (PermissionError, ValueError, TypeError, UnicodeDecodeError) as exc:
        return error(exc)
