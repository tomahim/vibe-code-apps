# Dedicated private HTTPS endpoint. Intentionally inert in this preparation PR.
# Enabling creates a paid service/volume and requires explicit rollout approval.
variable "music_https_enabled" {
  description = "Create the separate private vibe HTTPS endpoint. Approval required before enabling."
  type        = bool
  default     = false
}

resource "railway_service" "music_https" {
  count              = var.music_https_enabled ? 1 : 0
  name               = "vibe-music-https"
  project_id         = railway_project.genious_apps.id
  source_repo        = "tomahim/vibe-code-apps"
  source_repo_branch = "master"
  root_directory     = "/infra/music-https"
  watch_patterns     = ["/infra/music-https/**"]
  serverless         = false

  volume = {
    name       = "vibe-music-https-state"
    mount_path = "/var/lib/tailscale"
  }
}

# No TS_AUTHKEY resource: enter the new node's own narrowly tagged key only in
# Railway, not Terraform/state. Do not reuse the existing router key or volume.
# Fixed non-secret defaults are in the image and startup rejects route/proxy
# overrides. No railway_service_domain, TCP proxy, router import or change.
