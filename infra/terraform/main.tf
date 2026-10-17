terraform {
  required_version = ">= 1.10"

  required_providers {
    railway = {
      source  = "terraform-community-providers/railway"
      version = "~> 0.6"
    }
  }

  # State lives in a Railway Bucket (S3 compatible). Connection details are
  # passed at init time (see .github/workflows/terraform.yml), never committed.
  backend "s3" {}
}

# Reads the RAILWAY_TOKEN env var (an account or workspace token).
provider "railway" {}

locals {
  project_id = "79593d36-e4ba-406b-8f7e-51e9116a9c5a"
}


resource "railway_project" "genious_apps" {
  name = "genious-apps"

  default_environment = {
    name = "production"
  }
}

resource "railway_service" "api" {
  name       = "api"
  project_id = railway_project.genious_apps.id
}

resource "railway_service" "ui" {
  name       = "ui"
  project_id = railway_project.genious_apps.id
}

resource "railway_service_domain" "ui" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.ui.id
  subdomain      = "ui-production-4774"
}

# --- ui variables ---

resource "railway_variable" "ui_port" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.ui.id
  name           = "PORT"
  value          = "8080"
}

resource "railway_variable" "ui_api_upstream" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.ui.id
  name           = "API_UPSTREAM"
  value          = "http://api.railway.internal:8000"
}

# --- api variables ---

resource "railway_variable" "api_port" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.api.id
  name           = "PORT"
  value          = "8000"
}

resource "railway_variable" "api_django_debug" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.api.id
  name           = "DJANGO_DEBUG"
  value          = "false"
}

# Secrets: the real values live only in Railway (and the private state).
# Terraform tracks the variable but never overwrites or commits the value.
resource "railway_variable" "api_database_url" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.api.id
  name           = "DATABASE_URL"
  value          = "managed-in-railway"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "railway_variable" "api_django_secret_key" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.api.id
  name           = "DJANGO_SECRET_KEY"
  value          = "managed-in-railway"

  lifecycle {
    ignore_changes = [value]
  }
}

# Adopt the resources that already exist in Railway. Once applied they are in
# state and these blocks become no-ops (they can stay or be removed later).

import {
  to = railway_project.genious_apps
  id = local.project_id
}

import {
  to = railway_service.api
  id = "5b117cf2-e177-4951-ba3e-9b20c4920144"
}

import {
  to = railway_service.ui
  id = "1561708c-0f17-4e8c-aef6-04c66bd26731"
}

import {
  to = railway_service_domain.ui
  id = "1561708c-0f17-4e8c-aef6-04c66bd26731:production:ui-production-4774.up.railway.app"
}

import {
  to = railway_variable.ui_port
  id = "1561708c-0f17-4e8c-aef6-04c66bd26731:production:PORT"
}

import {
  to = railway_variable.ui_api_upstream
  id = "1561708c-0f17-4e8c-aef6-04c66bd26731:production:API_UPSTREAM"
}

import {
  to = railway_variable.api_port
  id = "5b117cf2-e177-4951-ba3e-9b20c4920144:production:PORT"
}

import {
  to = railway_variable.api_django_debug
  id = "5b117cf2-e177-4951-ba3e-9b20c4920144:production:DJANGO_DEBUG"
}

import {
  to = railway_variable.api_database_url
  id = "5b117cf2-e177-4951-ba3e-9b20c4920144:production:DATABASE_URL"
}

import {
  to = railway_variable.api_django_secret_key
  id = "5b117cf2-e177-4951-ba3e-9b20c4920144:production:DJANGO_SECRET_KEY"
}
