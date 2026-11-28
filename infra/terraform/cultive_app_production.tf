# Cultive app production: the public application at https://app.dailycultive.com,
# in the cultive-app Railway project (environment "production") next to the
# pre-release website services. Requested by the owner 2026-11-28 for the
# production launch. Both services run always-on (serverless = false):
# production must never sleep. Public, no Tailscale: the dev app stays private
# in genious-apps.
#
# Deploys do not come from Terraform. Pushing a release-app-X.Y.Z tag runs a
# cultive repo workflow that uploads api/ and ui/ to these services by name
# (cultive-api, cultive-ui); merging to main keeps deploying dev only. The API
# container applies Django migrations at startup, so a release migrates the
# production database automatically.
#
# Manual steps stay outside Terraform so no secret reaches its state (same
# decision as the dev services, 2026-11-14):
#   - DATABASE_URL        - production Neon database (branch of cultive-dev db),
#                           provided by the owner after apply
#   - DJANGO_SECRET_KEY   - fresh production signing secret
#   - BREVO_API_KEY       - transactional email delivery key
#   - SENTRY_AUTH_TOKEN   - source-map upload at UI build time
#   - GOOGLE_SIGN_IN_ENABLED / GOOGLE_CLIENT_ID / GOOGLE_ALLOWED_ORIGINS -
#                           Google sign-in, exactly as on dev; also needs the
#                           https://app.dailycultive.com origin added in the
#                           Google Cloud console (owner action)

locals {
  cultive_app_domain = "app.dailycultive.com"
}

# --- cultive-api (production) ---

resource "railway_service" "cultive_app_api" {
  name                       = "cultive-api"
  project_id                 = railway_project.cultive_production.id
  healthcheck_path           = "/health/"
  restart_policy_type        = "ALWAYS"
  restart_policy_max_retries = null
  serverless                 = false
}

resource "railway_variable" "cultive_app_api_port" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_api.id
  name           = "PORT"
  value          = "8000"
}

# The UI's nginx proxies /api with the public Host header, so Django only
# needs to trust the public hostname (default stays "*" until this applies;
# tightening to the real host is the point of setting it).
resource "railway_variable" "cultive_app_api_allowed_hosts" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_api.id
  name           = "DJANGO_ALLOWED_HOSTS"
  value          = local.cultive_app_domain
}

# Secrets: placeholders only, real values entered in Railway by the owner.
# ignore_changes keeps Terraform from overwriting them afterwards. While the
# placeholder is set, the api's secret-key guard refuses JWT sign-in, so an
# applied-but-unconfigured service fails closed, not open.
resource "railway_variable" "cultive_app_api_database_url" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_api.id
  name           = "DATABASE_URL"
  value          = "managed-in-railway"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "railway_variable" "cultive_app_api_django_secret_key" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_api.id
  name           = "DJANGO_SECRET_KEY"
  value          = "managed-in-railway"

  lifecycle {
    ignore_changes = [value]
  }
}

# Transactional email through Brevo's HTTPS API (Railway blocks outbound SMTP
# below Pro). BREVO_API_KEY itself is deliberately NOT declared: the provider
# reads live values back into state on refresh, and the key stays out of
# state - entered manually in Railway (decision 2026-11-14).
resource "railway_variable" "cultive_app_api_email_backend" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_api.id
  name           = "EMAIL_BACKEND"
  value          = "apps.emails.backends.BrevoEmailBackend"
}

resource "railway_variable" "cultive_app_api_default_from_email" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_api.id
  name           = "DEFAULT_FROM_EMAIL"
  value          = "Cultive - Atomic learning app <no-reply@dailycultive.com>"
}

# Base URL for links in transactional emails (verification, password reset).
resource "railway_variable" "cultive_app_api_public_app_url" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_api.id
  name           = "PUBLIC_APP_URL"
  value          = "https://${local.cultive_app_domain}"
}

# Same Sentry projects as the dev app, tagged production (DSNs are non-secret
# client keys, exactly like the website services).
resource "railway_variable" "cultive_app_api_sentry_dsn" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_api.id
  name           = "SENTRY_DSN"
  value          = "https://327ed1da321d7d44157046ff96b34720@o4512432009838592.ingest.de.sentry.io/4512432044638288"
}

resource "railway_variable" "cultive_app_api_sentry_environment" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_api.id
  name           = "SENTRY_ENVIRONMENT"
  value          = "production"
}

# Conservative tracing for launch (dev runs 0.5 by deliberate opt-in). Raise
# from accepted spans/day once real traffic is visible.
resource "railway_variable" "cultive_app_api_sentry_traces_sample_rate" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_api.id
  name           = "SENTRY_TRACES_SAMPLE_RATE"
  value          = "0.1"
}

# --- cultive-media bucket ---
#
# The app's production media get their own bucket in this project, separate
# from the shared genious-media bucket in genious-apps: Railway Buckets issue
# one full-access credential set per bucket, so isolation means a separate
# bucket. Managed through the same bucket-capable module as draft-cultive
# (lachieh/railway, scoped to modules/draft_bucket; provider deletion is
# unsupported - dashboard deletion with the 52-hour restore window, reconcile
# state first, docs/object-storage.md). Copying existing media from
# genious-media is a separate runbook step after this applies.
module "cultive_media_bucket" {
  source = "./modules/draft_bucket"

  environment_id = railway_project.cultive_production.default_environment.id
  bucket_name    = local.cultive_media_bucket_name
}

# "$${" below is Terraform's escape for a literal "${".

locals {
  cultive_media_bucket_name = "cultive-media"

  cultive_media_bucket_variables = {
    AWS_S3_ENDPOINT_URL     = "$${{${local.cultive_media_bucket_name}.ENDPOINT}}"
    AWS_STORAGE_BUCKET_NAME = "$${{${local.cultive_media_bucket_name}.BUCKET}}"
    AWS_ACCESS_KEY_ID       = "$${{${local.cultive_media_bucket_name}.ACCESS_KEY_ID}}"
    AWS_SECRET_ACCESS_KEY   = "$${{${local.cultive_media_bucket_name}.SECRET_ACCESS_KEY}}"
    AWS_S3_REGION_NAME      = "$${{${local.cultive_media_bucket_name}.REGION}}"
  }
}

resource "railway_variable" "cultive_app_api_bucket" {
  # The referenced bucket must exist before these variables resolve at
  # deploy time.
  depends_on = [module.cultive_media_bucket]

  for_each = local.cultive_media_bucket_variables

  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_api.id
  name           = each.key
  value          = each.value
}

# --- cultive-ui (production) ---

resource "railway_service" "cultive_app_ui" {
  name                       = "cultive-ui"
  project_id                 = railway_project.cultive_production.id
  healthcheck_path           = "/health/"
  restart_policy_type        = "ALWAYS"
  restart_policy_max_retries = null
  serverless                 = false
}

resource "railway_variable" "cultive_app_ui_port" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_ui.id
  name           = "PORT"
  value          = "8080"
}

# Same-project private network: only the UI is public; the API gets no public
# domain and is reached through the UI's nginx proxy, like the dev pair.
resource "railway_variable" "cultive_app_ui_api_upstream" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_ui.id
  name           = "API_UPSTREAM"
  value          = "http://cultive-api.railway.internal:8000"
}

# The UI inlines VITE_* variables into the static assets at Docker build time,
# so a changed value only takes effect on the next build/redeploy.
resource "railway_variable" "cultive_app_ui_sentry_dsn" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_ui.id
  name           = "VITE_SENTRY_DSN"
  value          = "https://17d34a544cc70433d521697870a80802@o4512432009838592.ingest.de.sentry.io/4512432044769360"
}

resource "railway_variable" "cultive_app_ui_sentry_environment" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_ui.id
  name           = "VITE_SENTRY_ENVIRONMENT"
  value          = "production"
}

resource "railway_variable" "cultive_app_ui_sentry_traces_sample_rate" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_ui.id
  name           = "VITE_SENTRY_TRACES_SAMPLE_RATE"
  value          = "0.1"
}

# Source-map upload at build time (SENTRY_AUTH_TOKEN stays manual, see header).
resource "railway_variable" "cultive_app_ui_sentry_org" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_ui.id
  name           = "SENTRY_ORG"
  value          = "cultive-app"
}

resource "railway_variable" "cultive_app_ui_sentry_project" {
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_ui.id
  name           = "SENTRY_PROJECT"
  value          = "cultive-frontend"
}

# --- public domain ---
#
# app.dailycultive.com on the UI service. DNS for dailycultive.com is hosted
# at the registrar (name.com nameservers; verified 2026-11-28: www is a manual
# CNAME to <id>.up.railway.app), so after apply one manual step remains: add a
# CNAME for app -> the dns_record_value this resource outputs, at name.com.
# Railway provisions the TLS certificate once the name resolves. Unlike the
# website cutover there is no existing traffic on this name to disrupt, so
# the domain lives in this change, ahead of the first release-app deploy.

resource "railway_custom_domain" "cultive_app_ui" {
  domain         = local.cultive_app_domain
  environment_id = railway_project.cultive_production.default_environment.id
  service_id     = railway_service.cultive_app_ui.id
  target_port    = 8080
}

output "cultive_app_production_service_ids" {
  value = {
    ui  = railway_service.cultive_app_ui.id
    api = railway_service.cultive_app_api.id
  }
}
