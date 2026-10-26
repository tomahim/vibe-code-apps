# Dedicated Notion news connection. Never put the real token in Terraform code.
# The secret is entered securely in Railway after this definition is applied.
resource "railway_variable" "api_notion_news_token" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.api.id
  name           = "NOTION_NEWS_TOKEN"
  value          = ""

  lifecycle {
    ignore_changes = [value]
  }
}

resource "railway_variable" "api_notion_news_data_source" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.api.id
  name           = "NOTION_NEWS_DATA_SOURCE_ID"
  value          = "c6ff1ba1-556e-473e-bdae-25df05e4c383"
}

# Empty until the owner's existing Django account ID has been verified.
# No generic-account or staff bypass for the personal feed.
resource "railway_variable" "api_notion_news_allowed_users" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.api.id
  name           = "NOTION_NEWS_ALLOWED_USER_IDS"
  value          = ""

  lifecycle {
    ignore_changes = [value]
  }
}
