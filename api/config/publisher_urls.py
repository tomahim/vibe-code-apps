"""URL configuration for the content publisher (config.publisher_settings).

The publisher only runs management commands (migrate, sync_atomic_lessons) and
tests; it serves no HTTP routes, and the experimentation URLconf imports apps
that are deliberately not installed here.
"""

urlpatterns = []
