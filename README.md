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
python manage.py runserver 8000
```

In another terminal, start the React UI:

```sh
cd ui
npm install
npm run dev
```

Open the Vite URL printed in the terminal. Vite proxies `/api` requests to Django on `localhost:8000`.

## LiveTrail API

- `GET /health/` — Railway health check.
- `GET /api/apps/` — apps available in the gallery.
- `GET /api/apps/livetrail-scrap/races/` — race list and default finish times.
- `GET /api/apps/livetrail-scrap/races/<race-id>/estimate/?target=HH:MM` — checkpoint estimates and the elevation profile.

LiveTrail responses are cached in memory for one hour per API instance.

## Railway deployment

Railway has separate `api` and `ui` services in the same production project so the UI can proxy requests to `api.railway.internal`. The UI is public; the API does not need a public domain.

GitHub Actions deploys `api/` when changes under `api/` reach `master` and `ui/` when changes under `ui/` reach `master`. Configure these repository secrets:

- `RAILWAY_TOKEN`

The service and environment IDs are stored in the workflows; only the Railway project token is a repository secret.
