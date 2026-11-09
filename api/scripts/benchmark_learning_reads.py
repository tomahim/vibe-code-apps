"""Synthetic, local-only GET benchmark. Never connects to the production DB.

Run from api/: python scripts/benchmark_learning_reads.py
Report SELECT query count, returned rows and UTF-8 cell-value bytes by replaying
captured SELECTs against the isolated test fixture after each GET. These are
logical result bytes, NOT Postgres protocol/TLS bytes or Neon billed transfer.
The response digest detects unintended API output changes between revisions.
"""
import hashlib
import json
import os
from pathlib import Path
import random
import sys
from datetime import datetime, timezone
from unittest.mock import patch
from uuid import NAMESPACE_URL, uuid5

sys.path.insert(0, str(Path.cwd()))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
if os.environ.get('DATABASE_URL'):
    raise SystemExit('Refusing DATABASE_URL: run against the local SQLite fallback only.')
import django
django.setup()
from django.contrib.auth import get_user_model
from django.db import connection
from django.test import Client
from django.test.runner import DiscoverRunner
from django.test.utils import CaptureQueriesContext
from apps.accounts.tokens import issue_token
from apps.learning.models import Card, CardProgress, ContentEntity, LearningPath, Lesson, LessonOpen, Question, QuestionAttempt, Theme

if connection.vendor != 'sqlite':
    raise SystemExit('Refusing non-SQLite database.')
runner = DiscoverRunner(verbosity=0)
old_config = runner.setup_databases()
try:
    counter = 0
    def row(model, **fields):
        global counter
        counter += 1
        return model.objects.create(
            entity=ContentEntity.objects.create(id=uuid5(NAMESPACE_URL, f'loading-benchmark/{counter}'), kind=model.CONTENT_KIND),
            published=True, position=fields.pop('position', 1), source_path='synthetic/fixture',
            last_changed_commit='a' * 40,
            **({'title': model.__name__} if model != Question else {}), **fields)
    user = get_user_model().objects.create_user(username='benchmark')
    at = datetime(2026, 11, 1, 12, tzinfo=timezone.utc)
    lessons = []
    for ti in range(4):
        theme = row(Theme, position=ti + 1)
        for pi in range(2):
            path = row(LearningPath, theme=theme, position=pi + 1)
            for li in range(5):
                lesson = row(Lesson, learning_path=path, position=li + 1)
                lessons.append(lesson)
                for ci in range(10):
                    card = row(Card, lesson=lesson, position=ci + 1, body_markdown='Synthetic learning text. ' * 100)
                    question = row(Question, lesson=lesson, position=ci + 1, after_card_position=ci + 1,
                                   prompt='Synthetic quiz prompt. ' * 40, options=[{'id':'a', 'text':'Choice A'}, {'id':'b', 'text':'Choice B'}],
                                   answer='a', explanation='Synthetic explanation. ' * 40)
                    if len(lessons) != 1 or ci < 9:
                        CardProgress.objects.create(user=user, card=card, completed_at=at)
                    QuestionAttempt.objects.create(user=user, question=question, attempt_type='initial', submitted_answer='a', correct=True, answered_at=at)
    lesson = lessons[0]
    LessonOpen.objects.create(user=user, lesson=lesson, opened_at=at)
    client = Client(HTTP_AUTHORIZATION=f'Bearer {issue_token(user)}')
    urls = {
        'themes': '/api/learning/themes/',
        'theme': f'/api/learning/themes/{lesson.learning_path.theme_id}/',
        'path': f'/api/learning/paths/{lesson.learning_path_id}/',
        'lesson': f'/api/learning/lessons/{lesson.pk}/',
        'garden': '/api/learning/garden/',
        'practice': f'/api/learning/paths/{lesson.learning_path_id}/catch-up/',
        'review': '/api/learning/review/?minutes=5',
    }
    report = {}
    for name, url in urls.items():
        random.seed(123)
        with patch('django.utils.timezone.now', return_value=datetime(2026,11,9,12,tzinfo=timezone.utc)):
            with CaptureQueriesContext(connection) as queries:
                response = client.get(url)
        if response.status_code != 200:
            raise RuntimeError(f'{name}: HTTP {response.status_code}, {response.content[:300]!r}')
        rows_count = cell_bytes = 0
        selects = [q['sql'] for q in queries if q['sql'].startswith('SELECT')]
        with connection.cursor() as cursor:
            for sql in selects:
                cursor.execute(sql)
                rows = cursor.fetchall()
                rows_count += len(rows)
                cell_bytes += sum(len(str(cell).encode('utf-8')) for row_ in rows for cell in row_ if cell is not None)
        report[name] = {'selects': len(selects), 'rows': rows_count, 'logical_cell_bytes': cell_bytes,
                        'response_bytes': len(response.content), 'response_sha256': hashlib.sha256(response.content).hexdigest()}
    print(json.dumps({'fixture': '4 themes, 8 paths, 40 lessons, 400 cards, 400 questions, 399 reads, 400 attempts; synthetic text',
                      'measurement': 'SQLite SELECT replay logical cell bytes, not network/billed bytes', 'results': report}, indent=2))
finally:
    runner.teardown_databases(old_config)
