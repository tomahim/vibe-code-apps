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
The admin uses [Unfold](https://unfoldadmin.com/docs/installation/quickstart/) for its login, Users, and Groups screens, with light/dark mode and the existing Django permissions. This is a presentation-only change: existing accounts and passwords still work, and the catalog/API remain public. Run `python manage.py collectstatic --noinput` before running API tests or serving with `DEBUG=false`; this collects both Django and Unfold assets.

## LiveTrail API

- `GET /health/` — Railway health check.
- `GET /api/apps/` — apps available in the gallery.
- `GET /api/apps/livetrail-scrap/races/` — race list and default finish times.
- `GET /api/apps/livetrail-scrap/races/<race-id>/estimate/?target=HH:MM` — checkpoint estimates and the elevation profile.

LiveTrail responses are cached in memory for one hour per API instance.

## Railway deployment

Railway has separate `api` and `ui` services in the same production project so the UI can proxy requests to `api.railway.internal`. The UI is public; the API does not need a public domain.
The UI also proxies `/admin/` and `/static/` assets (Django admin and Unfold) to the API, preserving Railway's original HTTPS scheme for CSRF checks.

### Neon PostgreSQL

Set `DATABASE_URL` **on Railway's production `api` service**, using the connection string from Neon → Connect. Keep `sslmode=require` and `channel_binding=require`; never commit the real URL or put it in frontend variables. A pooled Neon URL is supported for web requests. Django uses psycopg 3, disables server-side cursors for transaction pooling, and closes connections after each request so Neon can suspend when idle. The first request after suspension can be slower.

The API container requires PostgreSQL at runtime and fails startup if the URL is absent or TLS is disabled. Local development without `DATABASE_URL` still uses SQLite. Environment files are not loaded automatically; export variables in your shell or use your IDE's environment configuration.

At startup, Django applies its normal migrations **before** serving traffic, using a direct connection. For Neon it derives this connection by removing `-pooler` from the endpoint hostname, preserving credentials and TLS options. Optionally set `DATABASE_URL_UNPOOLED` to a direct URL for the **same database and branch**. Manual maintenance commands can use:

```sh
python manage.py migrate --settings=config.migration_settings
python manage.py showmigrations --settings=config.migration_settings
```

Users, groups, permissions, and admin sessions live in Neon and survive API redeploys. Existing SQLite users are **not copied automatically**; export/import any needed data before switching an existing installation. This adds no login requirement to the catalog or API endpoints, and does not integrate Neon Auth.

### Create the first admin user

After the API deploy succeeds, open a shell in the running Railway `api` service. In Railway, right-click that service and choose **Copy SSH Command**, then run it in your terminal (install/login to the Railway CLI if prompted). Inside the container run:

```sh
python manage.py createsuperuser
```

Choose your username, email, and a unique strong password at the private terminal prompts. There is no default superuser or default password. Open the UI's **Admin** link and sign in; **Users** and **Groups** provide Django's built-in user management. Only give trusted administrators staff access; superuser status grants all permissions. To reset a password later, run `python manage.py changepassword USERNAME` in the same service shell.

Verify that the account still works after an API redeploy. If a database password was exposed, rotate it in Neon and update Railway's connection variable(s), then redeploy. Never send admin passwords through chat or store them in the repository.

### Telegram recipe bot

The bot in the bot/ directory runs Telegram long polling and calls the recipe API over Railway private networking. Terraform provisions it as a separate service. Set its Telegram token, shared API secret, and allowed Telegram user IDs in Railway before it can start; see [bot setup and commands](bot/README.md).

### Database maintenance and recovery

Before schema changes, test migrations on a separate Neon branch and check the project's configured restore window in Neon; retention depends on the plan and settings. For an independent backup, use `pg_dump` against the **direct** endpoint, store the dump securely, and rehearse restoring into a separate database before relying on it. Database rollback means restoring a backup/branch or reversing a verified reversible migration, not merely rolling back the application image.

References: [Neon Django guide](https://neon.com/docs/guides/django), [Neon migrations](https://neon.com/docs/guides/django-migrations), [Railway SSH](https://docs.railway.com/cli/ssh).

### Deployment automation

GitHub Actions deploys `api/` when changes under `api/` reach `master` and `ui/` when changes under `ui/` reach `master`. Configure these repository secrets:

- `RAILWAY_TOKEN`

The service and environment IDs are stored in the workflows; only the Railway project token is a repository secret.

### App Ideas ratings

Idea content is bundled from `ui/src/apps/app-ideas/ideas/*.md`. New ideas and
content edits still use the normal UI build/deploy on merge.

Ratings stay in each markdown file's frontmatter, with GitHub as the only durable
store. On opening App Ideas, the UI reads `GET /api/app-ideas/ratings` from the API,
which reads the current configured GitHub branch in one GraphQL request. The API
returns only slug-to-rating values, with no cache, and keeps its token private.
Loading and read failures are shown explicitly with a Retry button, rather than
showing old bundled ratings. No localStorage or other browser persistence is used.

`POST /api/app-ideas/<slug>/rate` writes only the rating to GitHub. These commits
include `[skip ci]`, so a vote does not start a GitHub Actions pipeline or Railway
deploy. This marker is only added by the rating endpoint; ordinary daily idea PRs
keep their validation and deploy. It skips all push/pull-request workflows for that
rating-only commit, not just UI deployment. GitHub documents this behavior at
https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs.

Deploy the API and UI changes together once when introducing this behavior. The
API needs its existing `GITHUB_IDEAS_TOKEN`, `GITHUB_IDEAS_REPO` and
`GITHUB_IDEAS_BRANCH`; no new service or database is needed. Each page open adds one
GitHub read, so showing current ratings depends on API/GitHub availability.
