# Etchebest recipes API

Plain Django JSON endpoints, available inside Railway at
`http://api.railway.internal:8000/api/apps/recipes/`. No public domain is needed.
The Telegram bot runs in the same project/environment and uses these endpoints
over Railway private networking. The gallery card opens recipe management in
Django admin until the wheel UI is implemented.

## Configuration

Set `BOT_API_SECRET` on the API service and configure the bot with the same
secret. Send it as `X-Bot-Token` on every create request. Use a separate random
secret, not the Telegram bot token, and keep it out of Git and client-side code.
An empty/unset secret disables creation (503); a missing/wrong header returns
403. GET endpoints retain the existing network-level access policy.

The machine-to-machine POST endpoint is CSRF exempt and authenticates via this
header, not Django sessions. Django admin keeps normal session/CSRF protection.

Apply migrations with `python manage.py migrate` (already run by the production
startup command). Existing recipes and images are preserved. Ingredients can
be filled in later for those recipes through the admin inline.

Storage uses the existing shared Django configuration: Railway's private bucket
in production, `MEDIA_ROOT` locally. See [media storage](media-storage-django.md).
No new bucket or credentials are required. Image validation and the configured
upload-size limit apply to API uploads as well as admin uploads.

## Create

`POST /api/apps/recipes/recipes/` accepts JSON without a photo:

```json
{
  "title": "Tomato pasta",
  "source_url": "https://example.com/recipe",
  "ingredients": [
    {"name": "tomato", "quantity": "200 g"},
    {"name": "pasta", "quantity": "150 g"}
  ]
}
```

For an optional photo use multipart/form-data with text fields `title`, optional
`source_url`, `ingredients` (a JSON-encoded array in the same shape), and an
optional uploaded file named `image`. The API does not accept remote image URLs
or existing storage keys. Supported image types are JPEG, PNG and WebP.

Title is required (maximum 200 characters). Provide 1–100 ingredients, each with
a nonempty name (maximum 200 characters) and optional string quantity (maximum
200 characters). Names are trimmed and lowercased. Duplicate normalized names
in one request are rejected; existing ingredients are reused. The source URL is
optional; when supplied it must be valid. Quantities default to an empty string.

Success returns 201 and one recipe object:

```json
{
  "id": 1,
  "title": "Tomato pasta",
  "source_url": "https://example.com/recipe",
  "ingredients": [
    {"name": "pasta", "quantity": "150 g"},
    {"name": "tomato", "quantity": "200 g"}
  ],
  "image_url": null,
  "created_at": "2026-10-18T12:00:00+00:00",
  "updated_at": "2026-10-18T12:00:00+00:00"
}
```

`image_url` is null or a fresh storage URL. Bucket URLs are presigned and expire;
store the recipe ID rather than caching those URLs indefinitely. Local media URLs
are absolute and served by Django with DEBUG enabled. A Telegram worker must
upload the bytes itself if the returned URL is only privately reachable.

Validation errors return 400 (`errors` or `error`); unsupported content types
return 415; oversized request bodies return 413. Invalid/oversized image fields
return 400. Storage failures return a generic 503 without backend details and
roll back database writes. If a completed upload is followed by a DB or URL
failure, its file is deleted on a best-effort basis; cleanup failures are logged.
Creation is not idempotent: do not blindly retry a POST after an ambiguous timeout.

## Query

- `GET /api/apps/recipes/recipes/` returns `{"recipes": [...]}` (newest first).
- `GET /api/apps/recipes/recipes/?ingredients=tomato,pasta` returns only recipes
  containing **all** those ingredients, with the same recipe object shape.
- `GET /api/apps/recipes/random/` returns one random recipe from the full database.
- `GET /api/apps/recipes/random/?ingredients=tomato,pasta` chooses only from recipes
  containing all supplied ingredients.

Both endpoints trim/lowercase filter names and ignore duplicates/empty segments.
Missing or empty filters mean all recipes, including old recipes without
ingredients. No matches produce an empty list for list requests and a 404
`{"error": "No matching recipe found."}` for random requests. Random selection
never falls back to an unrelated recipe. Lists are unpaginated for this initial
personal recipe collection.

## Admin and tests

Recipes retain the existing image preview; ingredients and quantities can be
edited inline. Ingredients have their own searchable admin page. Each ingredient
can occur only once per recipe (database constraint).

```sh
cd api
pip install -r requirements-dev.txt
python manage.py collectstatic --noinput
python manage.py test
python manage.py makemigrations --check --dry-run
```

CI also migrates and tests against PostgreSQL. Storage tests use local temporary
files and mocked S3, never the production bucket.
