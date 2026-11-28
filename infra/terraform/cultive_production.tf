# Cultive production project: the public website, in its own Railway project
# (cultive-app), environment "production". The service runs always-on
# (serverless = false): production must never sleep. There is deliberately no
# database here.
#
# Deploys do not come from Terraform. Pushing a release-X.Y.Z tag runs a
# workflow that uploads the website to this service by name.
#
# Manual steps stay outside Terraform so no secret reaches its state:
#   - a project token for the production environment, saved as the GitHub
#     environment secret RAILWAY_TOKEN
#
# The public domain is NOT in this file on purpose: attaching it can route
# live traffic, so it lives in its own change (cultive_production_domain.tf).

locals {
  cultive_production_project_id = "79299d89-100d-4262-a396-8c9e8362c39d"
  cultive_production_domain     = "dailycultive.com"
}

# The empty project already exists; adopt it. Its only environment is already
# named "production".
import {
  to = railway_project.cultive_production
  id = local.cultive_production_project_id
}

resource "railway_project" "cultive_production" {
  name        = "cultive-app"
  description = null

  default_environment = {
    name = "production"
  }
}

resource "railway_service" "cultive_production_ui" {
  name                       = "daily-cultive-ui"
  project_id                 = railway_project.cultive_production.id
  healthcheck_path           = "/health/"
  restart_policy_type        = "ALWAYS"
  restart_policy_max_retries = null
  serverless                 = false
}

resource "railway_variable" "cultive_production_ui_port" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_production_ui.id
  name           = "PORT"
  value          = "8080"
}

# Same website error-monitoring project as the pre-release site (a public
# client key), tagged production.
resource "railway_variable" "cultive_production_ui_sentry_dsn" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_production_ui.id
  name           = "SENTRY_DSN"
  value          = "https://6660873ad04b0daf922709897ecdf1a7@o4512432009838592.ingest.de.sentry.io/4512443238383696"
}

resource "railway_variable" "cultive_production_ui_sentry_environment" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_production_ui.id
  name           = "SENTRY_ENVIRONMENT"
  value          = "production"
}

output "cultive_production_service_ids" {
  value = {
    ui = railway_service.cultive_production_ui.id
  }
}
