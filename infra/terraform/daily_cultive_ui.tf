# Cultive pre-release landing page: a tiny static site behind nginx,
# deployed by a separate CLI upload workflow. Like the other private services
# it gets no public domain: it is reachable only over the Tailscale network
# through the existing subnet router (<service>.genious-apps-production-railway.internal).
resource "railway_service" "daily_cultive_ui" {
  name                       = "daily-cultive-ui"
  project_id                 = railway_project.genious_apps.id
  healthcheck_path           = "/health/"
  restart_policy_max_retries = 3
  # Static page with pre-release traffic: let it idle to zero instead of
  # running always-on.
  serverless = true
}

resource "railway_variable" "daily_cultive_ui_port" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.daily_cultive_ui.id
  name           = "PORT"
  value          = "8080"
}

# The landing page proxies /api/signups/ to the API over the private network,
# same pattern as the main UI.
resource "railway_variable" "daily_cultive_ui_api_upstream" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.daily_cultive_ui.id
  name           = "API_UPSTREAM"
  value          = "http://cultive-api-dev.railway.internal:8000"
}

# Signup failures report to the website's own error-monitoring project,
# separate from the app frontend. The DSN is a public client key, added here
# once that project exists; until then the container starts with reporting
# off (empty SENTRY_DSN in the entrypoint default).
# resource "railway_variable" "daily_cultive_ui_sentry_dsn" {
#   environment_id = railway_project.genious_apps.default_environment.id
#   service_id     = railway_service.daily_cultive_ui.id
#   name           = "SENTRY_DSN"
#   value          = "<website project client key>"
# }
resource "railway_variable" "daily_cultive_ui_sentry_environment" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.daily_cultive_ui.id
  name           = "SENTRY_ENVIRONMENT"
  value          = "dev"
}

# No public domain. Configure deployment only after approved apply.
output "daily_cultive_ui_service_id" {
  description = "Railway service ID for the Cultive landing page deployment."
  value       = railway_service.daily_cultive_ui.id
}
