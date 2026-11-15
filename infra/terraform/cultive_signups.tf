# Pre-release landing signup storage (cultive API signup endpoints): the API
# writes submitted emails to an external form-store database through its own
# server-side token. Both values are entered manually in Railway by the owner:
# like the email delivery key they are deliberately NOT declared as real
# values here, so they stay out of Terraform state.
#
#   NOTION_SIGNUPS_TOKEN        - server-side integration token (secret)
#   NOTION_SIGNUPS_DATABASE_ID  - target database identifier
#
# The signup endpoints answer 503 until both are set.

# The static landing service proxies /api/signups/ to the API, so the site's
# Origin can never match the API host; trust it explicitly (non-secret).
resource "railway_variable" "cultive_api_signups_allowed_origins" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.cultive_api.id
  name           = "SIGNUPS_ALLOWED_ORIGINS"
  value          = "daily-cultive-ui.genious-apps-production-railway.internal"
}
