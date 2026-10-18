from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin

from .models import Recipe


@admin.register(Recipe)
class RecipeAdmin(ModelAdmin):
    list_display = ("title", "has_image", "created_at")
    search_fields = ("title",)
    readonly_fields = ("image_preview", "created_at", "updated_at")
    fields = ("title", "source_url", "image", "image_preview", "created_at", "updated_at")

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
