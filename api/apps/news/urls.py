from django.urls import path
from .views import archive_news, category_news, news

urlpatterns = [path("<uuid:page_id>/category/", category_news, name="category-news"), path("", news, name="notion-news"), path("<uuid:page_id>/archive/", archive_news, name="archive-news")]
