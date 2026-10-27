from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET

from apps.accounts.decorators import jwt_required

from .api import LearnerState, described, visible
from .models import LearningPath, Lesson, Theme


@never_cache
@require_GET
@jwt_required
def themes(request):
    state = LearnerState(request.user)
    lessons = list(visible(Lesson).select_related("learning_path"))
    paths = list(visible(LearningPath))
    return JsonResponse({"themes": [
        {**described(theme), "learning_paths_total": sum(p.theme_id == theme.pk for p in paths),
         "learning_paths_started": sum(state.progress([l for l in lessons if l.learning_path_id == p.pk])["started"]
                                       for p in paths if p.theme_id == theme.pk),
         "progress": state.progress([l for l in lessons if l.learning_path.theme_id == theme.pk])}
        for theme in visible(Theme)
    ]})
