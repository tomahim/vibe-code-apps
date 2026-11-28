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

Unlike the shared bucket above (created by hand), `draft-cultive` is managed by Terraform in `infra/terraform/modules/draft_bucket` through the `lachieh/railway` provider, pinned to `0.1.0` and scoped to that single module: the pinned provider (`terraform-community-providers/railway` ~> 0.6) has no bucket resource, and both providers ship `railway_*` resource types that Terraform routes by local-name prefix, so they cannot share one module. Existing resources and state stay with the pinned provider; adopting the bucket provider is additive only. Two consequences to know before apply:

- This provider does not manage bucket deletion through its API lifecycle; removing a resource from Terraform state is not deletion. To stop managing it without a destroy attempt, use a `removed` block with `destroy = false`. This does not make the bucket irreversible: Railway supports deletion through the dashboard (bucket Settings > Delete Bucket, then deploy the staged change), with a 52-hour restore window before permanent deletion. Reconcile Terraform configuration/state before a dashboard deletion so a later apply does not recreate it. See https://docs.railway.com/guides/storage-buckets#deleting-a-bucket.
- `lachieh/railway` is a young provider (first bucket release 2026-10). Review its plan output carefully at apply time; it manages only the one bucket resource here.

The same apply wires these variable references onto `cultive-api-dev` (`infra/terraform/cultive.tf`):

| Variable on `cultive-api-dev` | Value |
| --- | --- |
| `DRAFT_MEDIA_ENDPOINT` | `${{draft-cultive.ENDPOINT}}` |
| `DRAFT_MEDIA_BUCKET` | `${{draft-cultive.BUCKET}}` |
| `DRAFT_MEDIA_ACCESS_KEY_ID` | `${{draft-cultive.ACCESS_KEY_ID}}` |
| `DRAFT_MEDIA_SECRET_ACCESS_KEY` | `${{draft-cultive.SECRET_ACCESS_KEY}}` |
| `DRAFT_MEDIA_REGION` | `${{draft-cultive.REGION}}` |

If the bucket does not exist when the references apply, they resolve to empty values; nothing else breaks. Same pricing ($0.015 per GB-month, operations and egress free) and same credential-rotation runbook as above.

# Cultive production media bucket (cultive-media)

A third private bucket, `cultive-media`, in project `cultive-app`, environment `production`, wired only to the `cultive-api` (production app) service. Managed by Terraform in `infra/terraform/cultive_app_production.tf` through the same `modules/draft_bucket` module and the same constraints as `draft-cultive` (no provider deletion; dashboard deletion with the 52-hour restore window, reconcile state first). Created for the production launch (owner request 2026-11-28) so production media never share credentials with the shared `genious-media` bucket.

## Runbook: copy existing media from genious-media to cultive-media

Run this **after** the Terraform apply has created `cultive-media`, and before the first `release-app-*` deploy serves production traffic. It copies, it does not move: `genious-media` stays intact as the dev bucket, so the copy can be re-run or verified without risk.

1. Collect both credential sets without writing them into any repo:
   - Source: Railway > `genious-apps` > `production` > `genious-media` > Credentials.
   - Target: Railway > `cultive-app` > `production` > `cultive-media` > Credentials.
2. From any machine with the AWS CLI (or `rclone`), sync bucket to bucket. With the AWS CLI twice (no direct bucket-to-bucket copy across accounts/credentials, so stage through a local temp dir or a small throwaway Railway service):

   ```sh
   aws s3 sync s3://genious-media s3://cultive-media \
     --endpoint-url <target-endpoint> # per-side credentials/endpoints via profiles
   ```

   In practice: configure two named profiles (`--profile genious` / `--profile cultive`) with each bucket's endpoint and keys, download to a temp dir from the source profile, then upload with the target profile. Keep the object keys byte-identical: the database stores keys, not bucket names, so no data migration is needed.
3. Verify: object count and total bytes match on both sides (`aws s3 ls --recursive --summarize`), then spot-check a few presigned URLs through the production API once it runs.
4. Only then point production traffic at it (first `release-app-*` deploy). Dev keeps using `genious-media`; nothing is deleted from it.

Same pricing as the other buckets ($0.015 per GB-month, operations and bucket egress free).
