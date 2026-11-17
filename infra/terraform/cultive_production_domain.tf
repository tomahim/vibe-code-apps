# Public domain for the Cultive website: the final cutover step, kept apart
# from the production services change on purpose. With Railway-managed DNS,
# attaching a domain may route live traffic (unverified whether the provider
# also creates DNS records), so applying this resource is the public cutover.
# The email-provider DNS records on the domain must stay untouched.
#
# Disabled by default: until the website service exists there is no service
# id to attach to, so the gate below is empty and this file plans no change.
# To enable: after the services change is applied, put the daily-cultive-ui
# service id (output cultive_production_service_ids) in the local below, in a
# separate change whose plan shows exactly one resource to add.

locals {
  cultive_production_environment_id = "bccbb2b0-0cb7-4e67-9a0a-def3039cfd19"
  cultive_production_ui_service_id  = ""
  cultive_production_domain_enabled = local.cultive_production_ui_service_id != ""
}

resource "railway_custom_domain" "cultive_production_ui" {
  count = local.cultive_production_domain_enabled ? 1 : 0

  domain         = "dailycultive.com"
  environment_id = local.cultive_production_environment_id
  service_id     = local.cultive_production_ui_service_id
  target_port    = 8080
}

output "cultive_production_dns" {
  description = "DNS values for the website domain, empty while the domain is disabled."
  value = local.cultive_production_domain_enabled ? {
    domain                    = railway_custom_domain.cultive_production_ui[0].domain
    dns_record_value          = railway_custom_domain.cultive_production_ui[0].dns_record_value
    host_label                = railway_custom_domain.cultive_production_ui[0].host_label
    verification_host_label   = railway_custom_domain.cultive_production_ui[0].verification_host_label
    verification_record_value = railway_custom_domain.cultive_production_ui[0].verification_record_value
  } : null
}
