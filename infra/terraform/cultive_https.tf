# Preparation only. Paid enablement needs an explicit later approval.
variable "cultive_https_enabled" {
  description = "Create dedicated private Cultive HTTPS endpoint. Approval required before enabling."
  type        = bool
  default     = false
}

resource "railway_service" "cultive_https" {
  count              = var.cultive_https_enabled ? 1 : 0
  name               = "cultive-https"
  project_id         = railway_project.genious_apps.id
  source_repo        = "tomahim/vibe-code-apps"
  source_repo_branch = "master"
  root_directory     = "/infra/cultive-https"
  watch_patterns     = ["/infra/cultive-https/**"]
  serverless         = false

  volume = {
    name       = "cultive-https-state"
    mount_path = "/var/lib/tailscale"
  }
}

# Its own registration key is entered securely in Railway only, not Terraform.
# No router import/change, public domain, TCP proxy, route or Funnel.
