# Dedicated private Cultive HTTPS endpoint

Preparation only: disabled by default, no service/volume created, no merge or
paid deployment authorized by this PR. Candidate origin for Google configuration:
`https://cultive.tailfd1cee.ts.net`. Verify exact hostname after registration and
check no existing node owns `cultive` before creating anything. Google client
acceptance and live Google account linking remain separate checks, not proven by
this infrastructure PR.

## Fixed design

Tailnet browser -> dedicated Tailscale Serve443 (`cultive`) -> localhost nginx
18080 -> `cultive-dev.railway.internal:8080` -> existing Cultive UI/API proxy.
That private DNS name was read in live Railway settings on November13,2026:
service display name is `cultive-ui-dev`, but its private DNS retains `cultive-dev`.
Do not infer private DNS from display name or rename it as part of this work.

All UI routes, `/api` and admin share the same new HTTPS origin, with Host
preserved and forwarded scheme forced to HTTPS. App authentication is unchanged.
The endpoint exposes the whole Cultive UI, not only Google sign-in. Access
is governed by the actual tailnet policy; a narrow added rule cannot override
an allow-all rule. Explicitly settle audience for this new endpoint.

Separate service `cultive-https`, own volume `cultive-https-state`, own node/key.
No modifications to existing subnet router or live music endpoint. No routes,
exit node, SSH, Funnel, public Railway domain, TCP proxy or generic backend input.
Same-project private network reach remains: this is not a network sandbox.
The small fixed image mirrors the verified music pattern without modifying or
redeploying music. This deliberate duplication requires keeping upstream
Tailscale/nginx security updates and both integration tests in sync.

## Resource and cost approval

Default `cultive_https_enabled=false`: this PR plan must be no changes.
A later approved durable enablement input creates exactly one always-on
Railway service with nested own persistent volume, no existing resource edits.
CI auto-applies on merge, so paid enablement must be explicitly approved.

Current workspace Hobby default volume allocation5GB, provider size read-only;
billed USED storage at$0.15/GB-month, not the allocated maximum. Filesystem
metadata uses about2-3%, roughly100-150MB before state, around$0.015-$0.0225/month.
RAM$10/GB-month, CPU$20/vCPU-month, egress$0.05/GB. Extra compute usage estimate
$1-$3/month is unmeasured and not a cap; little traffic still has baseline cost.
No new subscription proposed; music remains a separate cost.

## Ordered rollout gates

1. Review disabled no-change plan and build/proxy/startup safety CI. Merge only
   when approved. Do not enable automatically or touch music/router resources.
2. Before paid enablement, approve current one-service/own-volume plan, candidate
   hostname and audience. Before cert issuance, obtain explicit public permanent
   CT-name consent for this NEW hostname, not merely music's prior consent.
3. Inspect current personal tailnet machine list and policy. Keep existing DNS,
   router/routes/key unchanged. Verify no `cultive` hostname collision. HTTPS
   certificates/MagicDNS may already be enabled by music; don't toggle blindly.
4. Create own one-off non-ephemeral short-lived registration key using approved
   identity/tag policy. No reuse of music/router keys or router tags. Collect
   securely, fill only this service's TS_AUTHKEY, never chat/code/Terraform.
5. Verify live node registered, exact private443 Serve mapping/no Funnel/routes,
   state700/key600, backend DNS and health, valid TLS cert, no public exposure.
6. Configure Google exact allowed origin/client separately with the backend
   owner. Test password login and first-time password-confirmed Google linking
   in the actual tailnet browser; no TLS bypass or insecure-origin flags.
7. Remove consumed registration variable and restart ONLY this endpoint. Confirm
   same node/IP/hostname/cert. Record actual node-key expiry and arrange advance
   reauthentication, separately from registration-key expiry/cert renewal.
8. Validate cold start, admin login, image upload, on-tailnet UI and fresh
   off-tailnet failure, and unchanged music/router access. Measure runtime cost.

Rollback: stop/revert only this endpoint's enablement after reviewing destroy
plan. Its own volume deletion loses node identity/cert state. Never delete or
revoke music/router state/key. Never globally disable HTTPS to roll back this
one service. CT names remain public permanently.

Sources:
- https://tailscale.com/docs/reference/tailscale-cli/serve
- https://tailscale.com/docs/features/containers/docker/docker-params
- https://tailscale.com/docs/features/access-control/auth-keys
- https://tailscale.com/docs/how-to/set-up-https-certificates
- https://docs.railway.com/reference/volumes
- https://docs.railway.com/reference/pricing/plans
- https://registry.terraform.io/providers/terraform-community-providers/railway/latest/docs/resources/service
