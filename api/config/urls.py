from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from .views import app_gallery, health

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health, name="health"),
    path("api/apps/little-notes/", include("apps.curator.urls")),
    path("api/apps/", app_gallery, name="app-gallery"),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/apps/db-dashboard/", include("apps.db_dashboard.urls")),
    path("api/", include("apps.livetrail_scrap.urls")),
    path("api/apps/rust/", include("apps.rust_learning_path.urls")),
    path("api/apps/recipes/", include("apps.recipes.urls")),
    path("api/apps/hockey/", include("apps.hockey.urls")),
    path("api/apps/instruments/", include("apps.instruments.urls")),
    path("api/apps/knob-conservatory/", include("apps.knob_conservatory.urls")),
]

# Local disk media is served by Django in DEBUG only; production uses the bucket.
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
