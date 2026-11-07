from django.contrib import admin

from .models import Preset


@admin.register(Preset)
class PresetAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "updated_at")
    search_fields = ("name", "owner__email")
    readonly_fields = ("id", "created_at", "updated_at")
