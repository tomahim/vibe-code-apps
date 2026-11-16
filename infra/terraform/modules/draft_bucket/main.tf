# Dedicated module for Railway Buckets so the bucket-capable provider stays
# isolated from the pinned one. The root module's `railway` local name keeps
# pointing at terraform-community-providers/railway (which manages every
# existing resource and has no bucket resource); inside this module the
# `railway` local name points at lachieh/railway, which does.
#
# Why isolate it: both providers name their resource types `railway_*`, and
# Terraform routes resource types to providers by local-name prefix, so the
# two cannot share one module. lachieh/railway is also a young provider
# (first bucket release 2026-10, low adoption): keeping it to one module
# containing one resource bounds the blast radius.
terraform {
  required_providers {
    railway = {
      source  = "lachieh/railway"
      version = "0.1.0"
    }
  }
}


variable "environment_id" {
  type        = string
  description = "ID of the Railway environment that holds this bucket."
}

variable "bucket_name" {
  type        = string
  description = "Bucket name. Provider deletion is unsupported; dashboard deletion and Terraform state reconciliation are documented in docs/object-storage.md."
}

variable "region" {
  type        = string
  default     = "iad"
  description = "Bucket region (sjc, iad, ams or sin). Immutable after creation. iad keeps drafts next to the US-East deployment."
}

resource "railway_bucket" "this" {
  environment_id = var.environment_id
  name           = var.bucket_name
  region         = var.region
}

output "railway_id" {
  value       = railway_bucket.this.railway_id
  description = "Railway's ID for the bucket; lets callers order dependent resources after creation."
}
