from django.urls import path
from .views import archive_news, news

urlpatterns = [path("", news, name="notion-news"), path("<uuid:page_id>/archive/", archive_news, name="archive-news")]
