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

### Batch import from ZIP

Open **Recipes → Batch import** in Django admin. The button is available to staff
who can add recipes, ingredients and recipe ingredient entries. It opens a
session-authenticated, CSRF-protected upload form with instructions and a
[downloadable example CSV](../api/apps/recipes/static/recipes/import-template.csv).

The adjacent **Copy LLM prompt** button opens a read-only prompt with a copy
button (or manual selection when clipboard access is unavailable). Paste it
into an LLM with your recipe images, documents or links. It instructs the LLM to
extract titles and ingredient quantities, download the main photo from supplied
links, validate the CSV and images, and return a downloadable ZIP. Its limits
come from the importer and the configured per-image limit. Download the ZIP
from the LLM and upload it manually using **Batch import**.

Upload a ZIP with this layout (no enclosing folder inside the ZIP):

```text
<name-zip>.zip
├── data.csv
└── images/
    ├── 1.jpg
    └── 2.jpg
```

The UTF-8 CSV uses one row per recipe and exactly four headers, in any order:

| Column | Value |
| --- | --- |
| `title` | Required recipe title, maximum 200 characters. |
| `source_url` | Optional valid recipe link, maximum 200 characters. |
| `image` | Optional filename in `images/`, e.g. `1.jpg`; omit the folder prefix. |
| `ingredients` | JSON array of 1–100 objects with `name` and optional `quantity`, using the same validation as recipe creation above. |

All four headers are required, even when image or link cells are empty. For
example, an ingredient cell contains
`[{"name":"tomato","quantity":"200 g"},{"name":"salt"}]`. When writing CSV
manually, quote that cell and double its inner quotes, as in the example CSV.
UTF-8 with a BOM and Windows line endings are accepted. Blank rows are ignored.
The `images/` folder is optional when every image cell is empty. Finder metadata
(`__MACOSX` and `.DS_Store`) is ignored.

Each submission creates new recipes; it never overwrites existing ones.
Ingredient names are normalized and reused. Repeated imports create duplicate
recipes, so check the success message before submitting the archive again.

The entire archive is validated before any write. Invalid CSV rows report their
row number; missing or invalid images reject the whole batch. Recipes and
ingredients are saved in one database transaction. If saving fails, the database
is rolled back and completed image uploads are deleted on a best-effort basis
(cleanup failures are logged). Images use the configured shared storage, with
random `recipes/<uuid>.<ext>` keys and extensions from their detected format.

Limits: 500 recipes, 50 MiB ZIP upload, 100 MiB total uncompressed content,
2 MiB CSV, 1,002 ZIP entries, and `MEDIA_UPLOAD_MAX_BYTES` per image (5 MiB by
default). Unsafe paths, duplicate ZIP entries, symlinks and encrypted archives
are rejected. Files are read from the archive without extracting them to disk.
The production proxy allows 51 MiB request bodies specifically on the recipe
import route, leaving room for multipart overhead while preserving the 6 MiB
request limit on other admin routes.

```sh
cd api
pip install -r requirements-dev.txt
python manage.py collectstatic --noinput
python manage.py test
python manage.py makemigrations --check --dry-run
```

CI also migrates and tests against PostgreSQL. Storage tests use local temporary
files and mocked S3, never the production bucket.
