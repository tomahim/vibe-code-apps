import logging

from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.http import HttpResponseNotAllowed, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.urls import reverse
from django.utils.html import format_html
from django.utils.translation import ngettext
from unfold.admin import ModelAdmin, TabularInline
from unfold.decorators import action

from .forms import RecipeImportForm
from .importing import import_recipes
from .models import Ingredient, Recipe, RecipeIngredient

logger = logging.getLogger(__name__)


class RecipeIngredientInline(TabularInline):
    model = RecipeIngredient
    extra = 1
    autocomplete_fields = ("ingredient",)


@admin.register(Ingredient)
class IngredientAdmin(ModelAdmin):
    search_fields = ("name",)
    list_display = ("name",)


@admin.register(Recipe)
class RecipeAdmin(ModelAdmin):
    actions_list = ("batch_import",)
    inlines = (RecipeIngredientInline,)
    list_display = ("title", "has_image", "created_at")
    search_fields = ("title",)
    readonly_fields = ("image_preview", "created_at", "updated_at")
    fields = ("title", "source_url", "image", "image_preview", "created_at", "updated_at")

    def has_batch_import_permission(self, request):
        return self.has_add_permission(request) and request.user.has_perms(
            ("recipes.add_ingredient", "recipes.add_recipeingredient")
        )

    @action(description="Batch import", permissions=["batch_import"], url_path="import", icon="upload")
    def batch_import(self, request):
        if request.method not in {"GET", "POST"}:
            return HttpResponseNotAllowed(["GET", "POST"])
        form = RecipeImportForm(request.POST if request.method == "POST" else None, request.FILES)
        if request.method == "POST" and form.is_valid():
            try:
                count = import_recipes(form.cleaned_data["archive"])
            except ValidationError as exc:
                form.add_error("archive", exc)
            except Exception:
                logger.exception("Recipe batch import failed")
                form.add_error(None, "Import failed. No recipes were imported. Please try again later.")
            else:
                self.message_user(
                    request,
                    ngettext("Imported %d recipe.", "Imported %d recipes.", count) % count,
                    messages.SUCCESS,
                )
                return HttpResponseRedirect(reverse("admin:recipes_recipe_changelist"))
        context = {
            **self.admin_site.each_context(request),
            "opts": self.model._meta,
            "title": "Batch import recipes",
            "form": form,
            "media": self.media + form.media,
        }
        return TemplateResponse(request, "admin/recipes/recipe/import.html", context)

    @admin.display(boolean=True, description="Image")
    def has_image(self, obj):
        return bool(obj.image)

    @admin.display(description="Preview")
    def image_preview(self, obj):
        if not obj.image:
            return "-"
        # With the bucket this is a presigned URL (expires, see AWS_QUERYSTRING_EXPIRE).
        return format_html(
            '<img src="{}" alt="" style="max-width: 320px; max-height: 320px; border-radius: 8px;">',
            obj.image.url,
        )
