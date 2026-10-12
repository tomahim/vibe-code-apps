# vibe-code-apps

A collection of small applications. The reusable web platform lives in two projects:

- `api/` is the shared Django API. Each feature is a Django app under `api/apps/`; `livetrail_scrap` is the first one.
- `ui/` is the shared React app gallery. Each frontend app lives under `ui/src/apps/`; LiveTrail Scraper is the first card.

## Run locally

Start the Django API:

```sh
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

In another terminal, start the React UI:

```sh
cd ui
npm install
npm run dev
```

Open the Vite URL printed in the terminal. Vite proxies `/api` requests to Django on `localhost:8000`.
The **Admin** link in the catalog header opens Django admin at `/admin/`.

## LiveTrail API

- `GET /health/` — Railway health check.
- `GET /api/apps/` — apps available in the gallery.
- `GET /api/apps/livetrail-scrap/races/` — race list and default finish times.
- `GET /api/apps/livetrail-scrap/races/<race-id>/estimate/?target=HH:MM` — checkpoint estimates and the elevation profile.

LiveTrail responses are cached in memory for one hour per API instance.

## Railway deployment

Railway has separate `api` and `ui` services in the same production project so the UI can proxy requests to `api.railway.internal`. The UI is public; the API does not need a public domain.
The UI also proxies `/admin/` and Django admin's `/static/admin/` assets to the API. The API applies built-in Django migrations on startup. To keep admin users and sessions across deploys, configure a persistent database for the API and create a superuser there; the current SQLite database in the API container is ephemeral.

GitHub Actions deploys `api/` when changes under `api/` reach `master` and `ui/` when changes under `ui/` reach `master`. Configure these repository secrets:

- `RAILWAY_TOKEN`

The service and environment IDs are stored in the workflows; only the Railway project token is a repository secret.
