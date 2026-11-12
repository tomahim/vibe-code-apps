from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import FeatureFlag


@admin.register(FeatureFlag)
class FeatureFlagAdmin(ModelAdmin):
    list_display = ("key", "enabled_for_everyone", "user_count", "description", "updated_at")
    list_filter = ("enabled_for_everyone",)
    search_fields = ("key", "description")
    filter_horizontal = ("users",)
    readonly_fields = ("created_at", "updated_at")

    @admin.display(description="Assigned users")
    def user_count(self, obj):
        return obj.users.count()
