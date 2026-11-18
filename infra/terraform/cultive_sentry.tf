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

# Dev-only tracing opt-in. The shared Developer allowance is 5M spans/month;
# start at 10% and tune from accepted spans/day, not temporary trial gifts.
resource "railway_variable" "cultive_api_sentry_traces_sample_rate" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = "SENTRY_TRACES_SAMPLE_RATE"
  value          = "0.1"
}

# Vite embeds this at build time: apply before the UI's next Docker rebuild.
resource "railway_variable" "cultive_ui_sentry_traces_sample_rate" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_ui.id
  name           = "VITE_SENTRY_TRACES_SAMPLE_RATE"
  value          = "0.1"
}
