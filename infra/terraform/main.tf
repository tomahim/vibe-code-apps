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
  project_id          = "79593d36-e4ba-406b-8f7e-51e9116a9c5a"
  tailscale_router_id = "3ace600b-b518-4d3e-a2a1-30505d2d64ef"
}


resource "railway_project" "genious_apps" {
  name        = "genious-apps"
  description = "Streamlit app deployed from the vibe-code-apps repository"

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

# Issue #26: Telegram long-polling worker. It uses the same private network as
# the API and builds from bot/Dockerfile. Credentials are entered manually in
# Railway so Terraform state never stores their values.
resource "railway_service" "bot" {
  name               = "bot"
  project_id         = railway_project.genious_apps.id
  source_repo        = "tomahim/vibe-code-apps"
  source_repo_branch = "master"
  root_directory     = "/bot"
}

# Issue #7: the Genious apps are reachable only over the Tailscale VPN.
# The public *.up.railway.app domain of the ui service is intentionally not
# managed here anymore: applying this configuration deletes it. Access goes
# through the Tailscale Subnet Router in the same Railway environment (see
# docs/genious-apps-tailscale.md).

# --- Tailscale router variables ---
# The template-created router and its volume remain managed in Railway.
# Adopt only this performance setting; leave its auth key outside Terraform.
# Disabling UDP send offloading reduced the 292 kB font download from
# 21–29 seconds to 2.7–3.5 seconds (2026-10-18).
resource "railway_variable" "tailscale_disable_udp_gso" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = local.tailscale_router_id
  name           = "TS_DEBUG_DISABLE_UDP_GSO"
  value          = "true"
}

# Uploads from a phone to the admin stalled (nginx 408 waiting for the request
# body, 2026-10-19). That is the receive direction, so also disable UDP
# receive offloading (GRO). Unlike the GSO variable above, this one does not
# exist in Railway yet: `terraform apply` creates it, so there is no import.
# Variable name checked in tailscale/tailscale net/batching/conn_linux.go.
resource "railway_variable" "tailscale_disable_udp_gro" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = local.tailscale_router_id
  name           = "TS_DEBUG_DISABLE_UDP_GRO"
  value          = "true"
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

resource "railway_variable" "bot_api_base_url" {
  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.bot.id
  name           = "API_BASE_URL"
  value          = "http://api.railway.internal:8000"
}

# --- shared media bucket (issue #28) ---
#
# The Terraform provider used here (terraform-community-providers/railway
# ~> 0.6) has no bucket resource, so the bucket itself is created by hand in
# the Railway UI (docs/object-storage.md). Terraform only wires it to the api
# service through Railway variable references, so no credential is ever in
# this repo or in the state. The reference name must match the bucket name.
# "$${" below is Terraform's escape for a literal "${".

locals {
  media_bucket_name = "genious-media"

  api_bucket_variables = {
    AWS_S3_ENDPOINT_URL     = "$${{${local.media_bucket_name}.ENDPOINT}}"
    AWS_STORAGE_BUCKET_NAME = "$${{${local.media_bucket_name}.BUCKET}}"
    AWS_ACCESS_KEY_ID       = "$${{${local.media_bucket_name}.ACCESS_KEY_ID}}"
    AWS_SECRET_ACCESS_KEY   = "$${{${local.media_bucket_name}.SECRET_ACCESS_KEY}}"
    AWS_S3_REGION_NAME      = "$${{${local.media_bucket_name}.REGION}}"
  }
}

resource "railway_variable" "api_bucket" {
  for_each = local.api_bucket_variables

  environment_id = railway_project.genious_apps.default_environment.id
  service_id     = railway_service.api.id
  name           = each.key
  value          = each.value
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
  to = railway_variable.tailscale_disable_udp_gso
  id = "${local.tailscale_router_id}:production:TS_DEBUG_DISABLE_UDP_GSO"
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
