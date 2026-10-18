# Media storage in the Django API

Files (images) go through Django's storage abstraction. The code is in `api/config/media.py`.

- With `AWS_STORAGE_BUCKET_NAME` set, the default storage is the S3 compatible Railway Bucket (django-storages). The bucket is private, reads use presigned URLs.
- Without it, files go to `api/media/` on local disk (git-ignored) and are served by Django when `DJANGO_DEBUG=true`. No network or credentials needed for local dev and tests.

## Environment variables (on the `api` service)

| Variable | Default | Notes |
| --- | --- | --- |
| `AWS_STORAGE_BUCKET_NAME` | unset | Setting it turns the bucket on. |
| `AWS_S3_ENDPOINT_URL` | unset | `https://storage.railway.app` for Railway. |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | unset | Read by boto3. Never commit them. |
| `AWS_S3_REGION_NAME` | `auto` | |
| `AWS_S3_ADDRESSING_STYLE` | `virtual` | Use `path` for older buckets. |
| `AWS_QUERYSTRING_EXPIRE` | `3600` | Lifetime of presigned URLs, in seconds. |
| `MEDIA_UPLOAD_MAX_BYTES` | `5242880` | Max upload size (5 MB). |

## Use it from another app

```python
from config.media import app_upload_to, validate_image_upload

class Thing(models.Model):
    photo = models.ImageField(upload_to=app_upload_to("things"), validators=[validate_image_upload], blank=True)
```

Keys look like `things/<random uuid>.jpg`. One prefix per app. Isolation is by prefix, not by credentials. Allowed types: jpeg, png, webp (checked with Pillow, not just the extension).

## Try it

1. `cd api && pip install -r requirements-dev.txt && python manage.py migrate && python manage.py createsuperuser`
2. `DJANGO_DEBUG=true python manage.py runserver`
3. Open `/admin/`, add a Recipe with a picture. Without bucket variables it lands in `api/media/recipes/`.
4. With the bucket variables exported (see the table), the same upload lands in the bucket and the preview uses a presigned URL.

Tests: `python manage.py test` (the S3 path is tested against moto, no network).
