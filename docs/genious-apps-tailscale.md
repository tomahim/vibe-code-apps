# Genious apps over Tailscale only (issue #7)

The Genious apps services (`ui` and `api`) in the Railway project
`genious-apps`, environment `production`, are reachable only from devices on
the Tailscale tailnet. They have no public `*.up.railway.app` domain.

The public domain of the `ui` service is removed by Terraform
(`infra/terraform/main.tf`). The steps below are done once by hand in the
Railway and Tailscale dashboards; they cannot be expressed in the repo.

## One-time setup

1. In Railway, deploy the "Tailscale Subnet Router" template into the
   `production` environment of `genious-apps` (same environment as `ui` and
   `api`):
   https://railway.com/deploy/tailscale-subnet-router--tailscale-subnet-router
2. In the Tailscale admin console:
   - Enable MagicDNS.
   - Create a reusable, ephemeral, pre-authorized auth key tagged for the
     router (e.g. `tag:railway-router`).
3. Add the key to the router service in Railway as the `TAILSCALE_AUTHKEY`
   variable. Never commit it to the repo.
4. Approve the Railway subnet routes the router advertises, either manually
   in the Tailscale console or with a narrowly scoped `autoApprovers` ACL
   policy for the router tag.
5. Configure split DNS in Tailscale: map the `railway.internal` zone to the
   router's tailnet IP. The router's startup logs print the advertised
   routes and the exact DNS entry to use.
6. From a Tailscale-connected laptop or phone, open the app at its private
   address `http://ui.railway.internal:8080` (the ui service listens on its
   `PORT`, 8080). The ui service proxies `/api`, `/admin` and `/static` to
   `api.railway.internal:8000` over Railway's private network, so the whole
   app works through that one address.

## Removing the public domain

Only after step 6 works: merge the pull request that removes
`railway_service_domain.ui` from Terraform. The merge triggers
`terraform apply`, which deletes `ui-production-4774.up.railway.app`.

## Verification after the domain is gone

- Off the VPN, the app does not open (the public domain no longer resolves).
- On the VPN, `http://ui.railway.internal:8080` works.
- The `master` deploy workflows (GitHub Actions deploying ui and api to
  Railway) still succeed; they authenticate with the `RAILWAY_TOKEN` secret
  and do not depend on a public domain.

Onboarding new users to the tailnet is covered by issue #8.
