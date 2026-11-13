# Separate private HTTPS endpoint for vibe music

Preparation only. Nothing created, paid for, enabled or deployed. This replaces
the proposed shared-router takeover route in #530/#531, subject to review.
Do not merge those router-adoption PRs for this design. Google sign-in is separate.

## Design

```text
Tailnet Chrome -> https://vibe-music-https.<actual-tailnet>.ts.net
  -> dedicated Tailscale Serve node TCP443
  -> localhost nginx :18080 -> ui.railway.internal:8080 (IPv4)
```

The exact hostname comes from the registered node/Serve status, not this example.
The existing `tailscale-rw` template, source, credentials, volume, DNS, routes,
and private HTTP URLs are untouched. The new service advertises no routes or
exit node. Its failures/restarts do not restart the subnet router.

The image starts with the official, version/digest-pinned Tailscale container
(v1.104.2), retains its `containerboot` login/state/Serve management, and adds a
small nginx local proxy plus child-process supervision. It does not copy the
subnet-router's network discovery/startup implementation. The official container
supports userspace networking, persistent state and `TS_SERVE_CONFIG`, including
`${TS_CERT_DOMAIN}` substitution. nginx is required because Serve proxies HTTP
only to localhost, not directly to another Railway service.

This is less coupling, not no maintenance: maintainers still review official
Tailscale/nginx/Alpine updates and test the small integration. Digest pinning
prevents silent base changes but also requires deliberate security updates.
No live vulnerability audit or guarantee against future Railway changes is made.

## Security boundaries

- Dedicated node, key and state volume. Do not reuse router credentials/state.
- No subnet routes, exit node, SSH, Funnel, public Railway domain or TCP proxy.
- Startup rejects routing/forward-proxy/extra-argument overrides; no config is
  taken from HTTP requests. The only upstream is the fixed UI on port 8080.
- nginx listens only on 127.0.0.1. The internal backend leg is HTTP over Railway's
  private network, not end-to-end TLS to Django.
- Fixed Serve config exposes 443 only with an empty AllowFunnel map. Check live
  status before acceptance. No global reset is sent to the existing router.
- Files created with umask 077, state/socket directories mode 0700. Root nginx
  master/client processes still share this new container; protecting it protects
  the endpoint's tailnet credentials. Certificate/cache permissions need live
  verification without printing keys. Certificate private keys are not exported
  by our scripts or stored in Terraform.
- This forwards the existing UI including its API/admin routes, not an isolated
  public music demo. Existing app authentication is unchanged. Use only an
  audience permitted to access the whole UI. Don't trust Tailscale identity
  headers as application authentication.
- Same-project Railway services share private-network reach. A compromised new
  endpoint could still attempt to reach other services. Separate credentials and
  no advertised routes reduce impact on the router, but are not a full network
  sandbox. It has no database credentials. Stronger isolation would require
  another network/project and separate backend routing design.

## Terraform and cost

`infra/terraform/music_https.tf` defaults `music_https_enabled = false`.
This PR's plan must be **no changes**: no new service, volume, router import,
public domain or secret resource. Review only; no automatic merge requested.

A later explicit approval and reviewed change to the durable default/input
creates **one paid always-on service and its own persistent volume**. A private
Tailscale listener cannot rely on Railway's public proxy waking a sleeping app,
so this ingress stays running even with little music traffic. The existing UI
can still sleep, and its first request may take time.

Rough extra usage budget: $1-$3/month, an assumption, not a cap. At listed rates,
64-192 MB RAM plus 0.005-0.01 vCPU is roughly $0.75-$2.15/month compute before
small storage/egress; actual usage must be measured. Rates: RAM $10/GB-month,
CPU $20/vCPU-month, volume $0.15/GB-month, egress $0.05/GB. Included Hobby usage
may cover part/all, but do not promise a free extra service. Low traffic does
not eliminate baseline memory billing. No new subscription is proposed.

## Ordered rollout, after review and approval

1. Review this PR, CI and its empty Terraform plan. Existing router must show
   no diff. Merge preparation only after approval. Keep #530/#531 unmerged.
2. Review intended new machine/tailnet name and audience first. Tailscale admin
   DNS: enable MagicDNS and HTTPS Certificates if needed, after accepting that
   issued certificate names enter permanent public CT logs. Names are public,
   content remains private. Do not enable Funnel.
3. Prepare a narrow new endpoint tag/auth key under the actual tailnet policy.
   Grant intended users only TCP443 to the new node/tag. Do not copy a broad
   router tag or add allow-all. Verify this node has no route/exit-node grants
   and cannot initiate unnecessary tailnet connections. Exact tag/ACL depends
   on the current policy, which has not been inspected for this preparation.
4. In a separate reviewed enablement PR, set `music_https_enabled = true` using a
   durable input/default. CI auto-applies on merge to master, so this requires
   explicit deployment/spending approval. Plan must add only this service,
   volume and necessary configuration, not touch the existing router or DBs.
   Confirm the provider's volume default size and final plan cost assumptions.
5. Put the new endpoint's own `TS_AUTHKEY` into its Railway variables through
   the secure account UI, never a PR/commit or Terraform value. Initial boot
   intentionally stops if no key/state exists; no request is exposed by this
   failure. Redeploy after the key is set. Keep `TS_AUTH_ONCE=true` and retain
   its volume to preserve identity on restart. Use a scoped, short-lived
   registration key and retire it after successful enrollment according to
   Tailscale policy. Do not reuse the existing router's registration key.
6. Inspect logs, `tailscale status`, `tailscale serve status --json` and
   `tailscale funnel status` on the new service only. Verify no subnet routes,
   exit node, public Funnel, extra Serve ports or unsolicited proxies. Confirm
   actual URL and issued certificate chain. Check the UI resolves/replies from
   inside this service. Current code assumes Railway DNS `[fd12::10]` and an
   IPv4 UI, matching existing nginx; verify on the new deployed service.
7. On the normal Tailscale Chrome device, open that HTTPS URL plus
   `/apps/music-library` without insecure-origin flags or TLS exceptions.
   Play Neon Rain and First Light, hear output for 30 seconds, Stop and replay.
   Check worklet/WASM assets, no mixed content, account/admin login and a small
   image upload (6 MB proxy cap). Check the old HTTP route still works for its
   existing uses and Cultive's current routes remain untouched. HTTP music
   remains unsupported. Off-tailnet, confirm a fresh network load cannot reach
   the new endpoint, rather than relying on cached app HTML.
8. After an approved endpoint restart, verify same node/URL, cert status and
   actual music playback again. Serve manages auto-renewal; one restart is not
   proof of a future renewal. Measure resource usage and review monthly cost.

## Verification provided by this PR

- Static assertions for exact Serve mapping/no Funnel, localhost-only fixed
  UI backend, hard-coded originating HTTPS header, disabled Terraform.
- Build-only Docker CI, nginx configuration validation and a real nginx relay
  test for Host/path/POST-body preservation and forced HTTPS scheme. The test
  uses Docker DNS, not the Railway resolver or a live tailnet.
- Startup negative tests reject route/exit-node config and missing first-login
  key before network login.
- Real production-build Chrome audio regression: ordinary HTTP on a non-localhost
  test hostname is blocked; local HTTPS starts the actual engine and measures
  non-silent audio, then Stop works. Local self-signed certificate accepted only
  inside the test context is not proof of the deployed public certificate chain.

Not verified before deployment: actual Tailscale registration/ACL/certificate,
userspace Serve on Railway, service-to-UI DNS/HTTP, cold starts, persistence,
Django HTTPS behavior and real-origin playback. Passing CI is not completion.

## Rollback

Stop only the new endpoint if acceptance fails. Existing router/HTTP path need
no change. Revert durable Terraform enablement in a reviewed PR and inspect the
plan: only the dedicated endpoint/volume should be destroyed, never shared
router or UI resources. Destroying the volume discards this node's identity and
certificate state. Remove/revoke its node/key in Tailscale separately; do not
revoke the router. Do not globally disable HTTPS certificates, which can break
other services and never removes already published CT names.

## Sources

- https://tailscale.com/docs/features/containers/docker/docker-params
- https://tailscale.com/docs/concepts/userspace-networking
- https://tailscale.com/docs/reference/tailscale-cli/serve
- https://tailscale.com/docs/how-to/set-up-https-certificates
- https://github.com/tailscale/tailscale/blob/v1.104.2/cmd/containerboot/serve.go
- https://docs.railway.com/reference/pricing/plans
