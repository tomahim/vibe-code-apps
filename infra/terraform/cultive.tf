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
  value          = "http://api.railway.internal:8000"
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

# Private DNS needs no resource: Railway automatically resolves
# <service-name>.railway.internal on the project private network (zero
# configuration), so the rename moves the UI to cultive-ui-dev.railway.internal
# and the API answers at cultive-api-dev.railway.internal once deployed.
# The provider's only domain resource (railway_service_domain) manages public
# *.up.railway.app domains and is deliberately not used: both services stay
# unexposed, reachable over the Tailscale router like the other services.

# No public domain. Configure deployment only after approved apply.
output "cultive_ui_service_id" {
  description = "Railway service ID for the independent UI deployment."
  value       = railway_service.cultive_ui.id
}

output "cultive_api_service_id" {
  description = "Railway service ID for the future API deployment."
  value       = railway_service.cultive_api.id
}
