import json
import logging

from django.conf import settings
from django.core.exceptions import RequestDataTooBig, ValidationError
from django.db import transaction
from django.db.models import Count, Q
from django.http import JsonResponse
from django.utils.crypto import constant_time_compare
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .forms import RecipeForm, clean_ingredients
from .models import Ingredient, Recipe, RecipeIngredient

logger = logging.getLogger(__name__)


class StorageUnavailable(Exception):
    pass


def serialize_recipe(recipe, request):
    try:
        image_url = request.build_absolute_uri(recipe.image.url) if recipe.image else None
    except Exception as exc:
        raise StorageUnavailable from exc
    return {
        "id": recipe.pk,
        "title": recipe.title,
        "source_url": recipe.source_url,
        "image_url": image_url,
        "ingredients": [
            {"name": entry.ingredient.name, "quantity": entry.quantity}
            for entry in recipe.ingredient_entries.all()
        ],
        "created_at": recipe.created_at.isoformat(),
        "updated_at": recipe.updated_at.isoformat(),
    }


def filtered_recipes(request):
    names = {name.strip().lower() for name in request.GET.get("ingredients", "").split(",") if name.strip()}
    recipes = Recipe.objects.all()
    # Count matching distinct names so every requested ingredient must be present.
    if names:
        recipes = recipes.annotate(
            matching_ingredients=Count("ingredients", filter=Q(ingredients__name__in=names), distinct=True),
        ).filter(matching_ingredients=len(names))
    return recipes.prefetch_related("ingredient_entries__ingredient")


def storage_error():
    return JsonResponse({"error": "Image storage is temporarily unavailable."}, status=503)


@csrf_exempt  # Machine-to-machine writes authenticate exclusively with X-Bot-Token.
@require_http_methods(["GET", "POST"])
def recipes(request):
    if request.method == "GET":
        try:
            return JsonResponse({"recipes": [serialize_recipe(r, request) for r in filtered_recipes(request)]})
        except StorageUnavailable:
            return storage_error()
    secret = settings.BOT_API_SECRET
    if not secret:
        return JsonResponse({"error": "Recipe creation is not configured."}, status=503)
    if not constant_time_compare(request.headers.get("X-Bot-Token", ""), secret):
        return JsonResponse({"error": "Invalid bot token."}, status=403)
    try:
        if request.content_type == "application/json":
            data = json.loads(request.body)
        elif request.content_type == "multipart/form-data":
            data = request.POST.dict()
            data["ingredients"] = json.loads(data.get("ingredients", "null"))
        else:
            return JsonResponse({"error": "Use application/json or multipart/form-data."}, status=415)
        if not isinstance(data, dict):
            raise ValidationError("Expected an object.")
        for field in ("title", "source_url"):
            if field in data and not isinstance(data[field], str):
                raise ValidationError(f"{field} must be a string.")
        if "image" in data:
            raise ValidationError("Send image as an uploaded file, not a URL or storage key.")
        ingredients = clean_ingredients(data.get("ingredients"))
        form = RecipeForm(data, request.FILES)
        if not form.is_valid():
            return JsonResponse({"errors": form.errors.get_json_data()}, status=400)
    except RequestDataTooBig:
        return JsonResponse({"error": "Request too large."}, status=413)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON."}, status=400)
    except ValidationError as exc:
        return JsonResponse({"errors": exc.messages}, status=400)

    recipe = form.save(commit=False)
    saved_image = None
    try:
        with transaction.atomic():
            if recipe.image:
                try:
                    recipe.image.save(recipe.image.name, recipe.image.file, save=False)
                    saved_image = recipe.image.name
                except Exception as exc:
                    raise StorageUnavailable from exc
            recipe.save()
            for name, quantity in ingredients:
                ingredient, _ = Ingredient.objects.get_or_create(name=name)
                RecipeIngredient.objects.create(recipe=recipe, ingredient=ingredient, quantity=quantity)
            response = serialize_recipe(recipe, request)
    except Exception as exc:
        # Storage is not transactional. Remove a completed upload if DB/URL work fails.
        if saved_image:
            try:
                recipe.image.storage.delete(saved_image)
            except Exception:
                logger.exception("Could not remove image after failed recipe creation")
        if isinstance(exc, StorageUnavailable):
            return storage_error()
        raise
    return JsonResponse(response, status=201)


@require_GET
def random_recipe(request):
    recipe = filtered_recipes(request).order_by("?").first()
    if recipe is None:
        return JsonResponse({"error": "No matching recipe found."}, status=404)
    try:
        return JsonResponse(serialize_recipe(recipe, request))
    except StorageUnavailable:
        return storage_error()
