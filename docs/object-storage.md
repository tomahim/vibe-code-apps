# Shared object storage (Railway Bucket)

One private S3 compatible bucket, `genious-media`, in project `genious-apps`, environment `production`. Several apps share it, one key prefix per app (`recipes/...`). The Django side is described in `docs/media-storage-django.md`.

## Why a manual step

The Terraform provider we use (`terraform-community-providers/railway`) has no bucket resource, and we did not add a third-party provider. So the bucket is created in the Railway UI once. Terraform then wires it to the `api` service with variable references (`infra/terraform/main.tf`), so no credential is in the repo or in the Terraform state.

This is separate from the Terraform state bucket. Do not reuse that one for app files.

## Runbook: create the bucket

Do this before merging the PR that adds the variable references.

1. Railway > project `genious-apps` > `production` > Create > Bucket.
2. Name it exactly `genious-media` (the Terraform references use this name). Region cannot be changed later.
3. Merge the infra PR. CI applies it and creates these variables on the `api` service:

| Variable on `api` | Value |
| --- | --- |
| `AWS_S3_ENDPOINT_URL` | `${{genious-media.ENDPOINT}}` |
| `AWS_STORAGE_BUCKET_NAME` | `${{genious-media.BUCKET}}` |
| `AWS_ACCESS_KEY_ID` | `${{genious-media.ACCESS_KEY_ID}}` |
| `AWS_SECRET_ACCESS_KEY` | `${{genious-media.SECRET_ACCESS_KEY}}` |
| `AWS_S3_REGION_NAME` | `${{genious-media.REGION}}` |

4. If uploads fail with an addressing error (older buckets), set `AWS_S3_ADDRESSING_STYLE=path` on the `api` service. The bucket's Credentials tab says which style it needs.

If you merge before the bucket exists, the references resolve to nothing, the Django API sees no bucket name and keeps using local disk. Nothing breaks, but files saved that way are lost on redeploy.

## Rotate credentials

Railway bucket > Credentials > regenerate. The `api` service reads them by reference, so redeploy `api` to pick them up.

## Cost

$0.015 per GB-month, rounded up to the next whole GB-month. S3 operations and bucket egress are free. Recipe photos should cost about $0.02 per month or less. Uploads from the API count as normal service egress. Costs are workspace-wide. On the trial plan the bucket is suspended when the trial ends, same as the state bucket.

## Limits worth knowing

- Buckets are private only. Files are served through presigned URLs (up to 90 days, we default to 1 hour) or an API proxy.
- Buckets are not on the private network.
- One bucket per environment, with its own credentials.

Source: https://docs.railway.com/guides/storage-buckets

# Draft media bucket

A second private bucket, `draft-cultive`, in the same project and environment, wired only to the `cultive-api-dev` service. It exists so draft-stage files and live media never share credentials: Railway Buckets issue one full-access credential set per bucket, with no prefix or read-only scoping, so isolation means a separate bucket, not a second key.

Same manual-creation pattern as above: the pinned provider (`terraform-community-providers/railway` ~> 0.6) has no bucket resource, so create it in the Railway UI named exactly `draft-cultive` before applying the Terraform that wires these variable references onto `cultive-api-dev` (`infra/terraform/cultive.tf`):

| Variable on `cultive-api-dev` | Value |
| --- | --- |
| `DRAFT_MEDIA_ENDPOINT` | `${{draft-cultive.ENDPOINT}}` |
| `DRAFT_MEDIA_BUCKET` | `${{draft-cultive.BUCKET}}` |
| `DRAFT_MEDIA_ACCESS_KEY_ID` | `${{draft-cultive.ACCESS_KEY_ID}}` |
| `DRAFT_MEDIA_SECRET_ACCESS_KEY` | `${{draft-cultive.SECRET_ACCESS_KEY}}` |
| `DRAFT_MEDIA_REGION` | `${{draft-cultive.REGION}}` |

If the bucket does not exist when the references apply, they resolve to empty values; nothing else breaks. Same pricing ($0.015 per GB-month, operations and egress free) and same credential-rotation runbook as above.
