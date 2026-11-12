from django.apps import AppConfig


class LearningConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.learning"
    verbose_name = "Little Grains learning"

    def ready(self):
        # In-process content writes (admin, shell, tests) bypass the SyncLog
        # commit check, so drop the cached content snapshot on any of them.
        # The GitHub sync runs in another process and is caught by the commit
        # check on the next read instead.
        from django.db.models.signals import post_delete, post_save
        from .snapshot import CONTENT_MODELS, invalidate
        for model in CONTENT_MODELS:
            post_save.connect(invalidate, sender=model,
                              dispatch_uid=f"learning-snapshot-save-{model.__name__}")
            post_delete.connect(invalidate, sender=model,
                                dispatch_uid=f"learning-snapshot-delete-{model.__name__}")
