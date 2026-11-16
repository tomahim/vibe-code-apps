# Independent UI service, deployed by a separate CLI upload workflow.
# Renames (cultive-dev -> cultive-ui-dev -> daily-cultive-ui-dev) are in-place
# updates: the provider patches the name on the same service ID, so state,
# variables and (future) deployments are preserved.
resource "railway_service" "cultive_ui" {
  name                       = "daily-cultive-ui-dev"
  project_id                 = railway_project.genious_apps.id
  healthcheck_path           = "/health/"
  restart_policy_max_retries = 3
  serverless                 = true
}

resource "railway_variable" "cultive_ui_port" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_ui.id
  name           = "PORT"
  value          = "8080"
}

resource "railway_variable" "cultive_ui_api_upstream" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_ui.id
  name           = "API_UPSTREAM"
  value          = "http://cultive-api-dev.railway.internal:8000"
}

# Independent API service, empty for now: no source, no build config and no
# deployment. Settings mirror the existing api service (/health/, PORT 8000)
# so a later backend deployment drops in without Terraform changes.
# serverless = false: turned off manually in Railway by the project owner on
# 2026-11-14 so the dev API stays running instead of idling to zero. Terraform
# mirrors the live setting here; changing back to true re-enables idle sleep.
resource "railway_service" "cultive_api" {
  name                       = "cultive-api-dev"
  project_id                 = railway_project.genious_apps.id
  healthcheck_path           = "/health/"
  restart_policy_max_retries = 3
  serverless                 = false
}

resource "railway_variable" "cultive_api_port" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = "PORT"
  value          = "8000"
}

# --- cultive-api-dev variables ---
#
# Cultive keeps "cultive-dev db" (paid), while the experimentation API moves
# to "vibe-code-apps db" (Free). These labels do not rename Postgres databases.
# DATABASE_URL must be an independent owner-managed secret,
# not a reference to api.DATABASE_URL. Media bucket variables remain references.
# Real secrets remain in Railway and the private Terraform state, never Git.
# No schema or data migration is implied by these declarations.

# Separate signing secret for the standalone backend (decision 2026-11-13):
# JWTs signed by the source api won't verify on Cultive, so users log in
# again after cutover. Placeholder only: the real value is entered securely
# in Railway by the owner after apply, and ignore_changes keeps Terraform
# from overwriting it. While the placeholder (or nothing) is set, the api's
# secret-key guard refuses JWT sign-in.
resource "railway_variable" "cultive_api_django_secret_key" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = "DJANGO_SECRET_KEY"
  value          = "managed-in-railway"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "railway_variable" "cultive_api_database_url" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = "DATABASE_URL"
  value          = "managed-in-railway"

  lifecycle {
    ignore_changes = [value]
  }
}

# Transactional email (cultive PR #49): production delivery goes through
# Brevo's HTTPS API because Railway blocks outbound SMTP below the Pro plan.
# These two settings are non-secret. BREVO_API_KEY is deliberately NOT
# declared here: the Railway provider reads live values back into Terraform
# state on refresh, and the owner keeps this key out of state - it is entered
# manually in Railway (decision 2026-11-14).
resource "railway_variable" "cultive_api_email_backend" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = "EMAIL_BACKEND"
  value          = "apps.emails.backends.BrevoEmailBackend"
}

resource "railway_variable" "cultive_api_default_from_email" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = "DEFAULT_FROM_EMAIL"
  value          = "Cultive - Atomic learning app <no-reply@dailycultive.com>"
}

# Existing resources keep their current value when ignore_changes is added.
# Therefore this change alone DOES NOT detach an existing api.DATABASE_URL
# reference. Before changing the source API connection, securely set Cultive's
# DATABASE_URL to the cultive-dev db URL and verify its resolved target.
# A newly created service receives the placeholder and needs the same setup.

resource "railway_variable" "cultive_api_bucket" {
  for_each = local.media_bucket_variables

  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = each.key
  value          = each.value
}

# --- dedicated draft media bucket (draft-cultive) ---
#
# A second bucket with its own credentials, separate from the shared media
# bucket: Railway Buckets issue one full-access credential set per bucket,
# with no prefix or read-only scoping, so isolation means a separate bucket.
# The bucket itself is created by Terraform in modules/draft_bucket through
# the bucket-capable lachieh/railway provider (the pinned
# terraform-community-providers provider has no bucket resource).
# Railway cannot delete buckets through its API, so apply is one-way: the
# name `draft-cultive` stays taken in the project afterwards. See
# docs/object-storage.md.
module "draft_bucket" {
  source = "./modules/draft_bucket"

  providers = {
    railway = railway_iac
  }

  environment_id = railway_project.genious_apps.default_environment.id
  bucket_name    = local.draft_bucket_name
}

# "$${" below is Terraform's escape for a literal "${".

locals {
  draft_bucket_name = "draft-cultive"

  draft_bucket_variables = {
    DRAFT_MEDIA_ENDPOINT          = "$${{${local.draft_bucket_name}.ENDPOINT}}"
    DRAFT_MEDIA_BUCKET            = "$${{${local.draft_bucket_name}.BUCKET}}"
    DRAFT_MEDIA_ACCESS_KEY_ID     = "$${{${local.draft_bucket_name}.ACCESS_KEY_ID}}"
    DRAFT_MEDIA_SECRET_ACCESS_KEY = "$${{${local.draft_bucket_name}.SECRET_ACCESS_KEY}}"
    DRAFT_MEDIA_REGION            = "$${{${local.draft_bucket_name}.REGION}}"
  }
}

resource "railway_variable" "cultive_api_draft_bucket" {
  # The referenced bucket must exist before these variables resolve at
  # deploy time.
  depends_on = [module.draft_bucket]

  for_each = local.draft_bucket_variables

  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = each.key
  value          = each.value
}

# Private DNS needs no resource: every service gets an endpoint on the project
# private network (<endpoint>.railway.internal, zero configuration). The
# endpoint name defaults to the service name at creation but does NOT follow
# later renames: after two renames (now daily-cultive-ui-dev) the endpoint is
# still "cultive-dev" until edited under Settings > Networking > Private
# Networking (this provider has no resource for it). cultive-api-dev, created
# here, gets "cultive-api-dev" from the start. Both services stay unexposed:
# the provider's only domain resource (railway_service_domain) manages public
# *.up.railway.app domains and is deliberately not used.

# No public domain. Configure deployment only after approved apply.
output "cultive_ui_service_id" {
  description = "Railway service ID for the independent UI deployment."
  value       = railway_service.cultive_ui.id
}

output "cultive_api_service_id" {
  description = "Railway service ID for the future API deployment."
  value       = railway_service.cultive_api.id
}
