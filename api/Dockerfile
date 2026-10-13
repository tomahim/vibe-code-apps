FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

# Static collection needs no database; deployed containers must use Postgres.
ENV DJANGO_REQUIRE_DATABASE_URL=true

CMD ["sh", "-c", "python manage.py migrate --settings=config.migration_settings --noinput && exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 60"]
