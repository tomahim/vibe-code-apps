# Independent UI service, deployed by a separate CLI upload workflow.
# The rename from cultive-dev to cultive-ui-dev is an in-place update: the
# provider patches the name on the same service ID, so state, variables and
# (future) deployments are preserved.
resource "railway_service" "cultive_ui" {
  name                       = "cultive-ui-dev"
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
resource "railway_service" "cultive_api" {
  name                       = "cultive-api-dev"
  project_id                 = railway_project.genious_apps.id
  healthcheck_path           = "/health/"
  restart_policy_max_retries = 3
  serverless                 = true
}

resource "railway_variable" "cultive_api_port" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = "PORT"
  value          = "8000"
}

# --- cultive-api-dev variables ---
#
# Same shared database and media bucket as the api service, by reference:
# Railway resolves the $${{...}} expressions at runtime, so no secret value is
# ever in this repo or in the state (the provider stores the literal reference
# string, marked sensitive). No schema or data migration is implied.

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
  value          = "$${{api.DATABASE_URL}}"
}

resource "railway_variable" "cultive_api_bucket" {
  for_each = local.media_bucket_variables

  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = each.key
  value          = each.value
}

# Private DNS needs no resource: every service gets an endpoint on the project
# private network (<endpoint>.railway.internal, zero configuration). The
# endpoint name defaults to the service name at creation but does NOT follow
# later renames: after the cultive-dev -> cultive-ui-dev rename the endpoint is
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
