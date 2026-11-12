# Independent UI service, deployed by a separate CLI upload workflow.
resource "railway_service" "cultive_ui" {
  name                       = "cultive-dev"
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

# No public domain. Configure deployment only after approved apply.
output "cultive_ui_service_id" {
  description = "Railway service ID for the independent UI deployment."
  value       = railway_service.cultive_ui.id
}
