# Error monitoring for the Cultive dev services, configured purely through
# environment variables (the apps report nothing while the DSN is unset).
# DSNs are not secret credentials: they identify the target project to the
# ingest endpoint, and the UI DSN ships in the built assets regardless, so
# they live here as plain values. No secrets are committed.

resource "railway_variable" "cultive_api_sentry_dsn" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = "SENTRY_DSN"
  value          = "https://327ed1da321d7d44157046ff96b34720@o4512432009838592.ingest.de.sentry.io/4512432044638288"
}

resource "railway_variable" "cultive_api_sentry_environment" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = "SENTRY_ENVIRONMENT"
  value          = "dev"
}

# The UI inlines VITE_* variables into the static assets at Docker build
# time (service variables are available to builds), so a changed value only
# takes effect on the next build/redeploy, not on a plain restart.
resource "railway_variable" "cultive_ui_sentry_dsn" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_ui.id
  name           = "VITE_SENTRY_DSN"
  value          = "https://17d34a544cc70433d521697870a80802@o4512432009838592.ingest.de.sentry.io/4512432044769360"
}

resource "railway_variable" "cultive_ui_sentry_environment" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_ui.id
  name           = "VITE_SENTRY_ENVIRONMENT"
  value          = "dev"
}

# Dev-only tracing opt-in, raised from 10% at the owner's request
# (2026-11-18): 10% sampled too few traces to be useful. The shared
# Developer allowance is 5M spans/month; keep tuning from accepted
# spans/day, not temporary trial gifts. The API continues the browser's
# sampling decision for linked traces, so this rate only governs
# backend-rooted traces; browser-initiated traces follow the UI rate.
resource "railway_variable" "cultive_api_sentry_traces_sample_rate" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = "SENTRY_TRACES_SAMPLE_RATE"
  value          = "0.5"
}

# Vite embeds this at build time: apply before the UI's next Docker rebuild.
# Raised from 10% at the owner's request (2026-11-18). This rate gates
# browser-initiated end-to-end traces: the API continues the parent's
# decision for linked requests instead of re-drawing at its own rate.
resource "railway_variable" "cultive_ui_sentry_traces_sample_rate" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_ui.id
  name           = "VITE_SENTRY_TRACES_SAMPLE_RATE"
  value          = "0.3"
}

# Source-map upload for the dev UI build (hidden maps uploaded at Docker
# build time, deleted from the shipped image; Sentry charges no quota or
# price for source maps). org/project are non-secret identifiers.
resource "railway_variable" "cultive_ui_sentry_org" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_ui.id
  name           = "SENTRY_ORG"
  value          = "cultive-app"
}

resource "railway_variable" "cultive_ui_sentry_project" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_ui.id
  name           = "SENTRY_PROJECT"
  value          = "cultive-frontend"
}

# SENTRY_AUTH_TOKEN is deliberately NOT declared here (same decision as
# BREVO_API_KEY, 2026-11-14): the Railway provider reads live values back
# into Terraform state on refresh, and the token must stay out of state and
# plan artifacts. The scoped internal-integration token (org:ci, org:read,
# project:read, project:releases) is created already, kept in the owner's
# password vault, and is entered manually in Railway as a sealed variable on
# this service. While it is unset the build skips the upload; with it set,
# a failed upload fails the build so no deploy ships without its maps.
