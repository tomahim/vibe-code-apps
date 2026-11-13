# Music library: private HTTPS rollout

Status: prepared, not deployed. Last checked 2026-11-13 after the Cultive split.
This is independent of Google sign-in. No database or account change is needed.

## Why this route

The music engine uses AudioWorklet. Chrome does not expose it on an ordinary
non-localhost HTTP origin, even inside an encrypted Tailscale connection.
The current UI contains the explanatory error from #444, not an HTTP playback
fix. Keep the app private: use **Tailscale Serve**, not Funnel or a public
Railway domain.

The proposed path is:

```text
Chrome on tailnet -> HTTPS router's exact MagicDNS name, port 443
  -> tailscale serve -> 127.0.0.1:18080 (socat)
  -> ui.railway.internal:8080 (IPv4)
```

This preserves existing HTTP URLs and split DNS. Serve listens on the router's
own tailnet address, not the Railway subnet address. Certificate names must end
in the tailnet's `.ts.net` domain; `https://ui.railway.internal` will not work.
Discover the exact URL from `tailscale serve status`; do not guess the tailnet
suffix or machine name.

## What was checked and what was not

- Current master still has the music app and all of its vendored engine assets.
- Railway read-only check: `ui` still exists; router `tailscale-rw` is online,
  sourced from `dotlouis/tailscale-rw`, branch `main`, with an attached volume.
- The volume was checked at `/var/lib/tailscale` on November 12; recheck that
  mount before changing the router. Keeping that volume keeps the node identity,
  tailnet IP and stored Serve configuration. Do not delete/recreate the router.
- Local production-build Chrome check: plain HTTP on a non-localhost test name
  shows the secure-context error; actual HTTPS on that test name boots the real
  engine and produces non-silent output. This uses a local self-signed test
  certificate accepted only by the test context, not a public-chain test.
- Shell tests use a stub Tailscale binary: they test forwarding, timeout and
  failure isolation, not real Serve, certificate issuance or the tailnet ACL.
- Live router userspace Serve on 1.104.1, router-side UI DNS resolution, real
  certificate issuance/renewal, and playback at the final private origin remain
  rollout checks. They have not been performed by this preparation PR.

Run the local checks:

```sh
bash infra/tailscale-router/test-https-serve.sh
(cd ui && npm ci && npm run build)
node infra/tailscale-router/music-https-check.mjs
# For installed system Chrome, prefix the last command with:
# PLAYWRIGHT_CHROME_PATH=/path/to/chrome
```

The browser check measures real audio samples at the engine's output, rather
than treating `isSecureContext` or a visible Stop button alone as success.

## Cost and privacy decisions before rollout

No new Railway service, volume or subscription is proposed. This is not a claim
of zero extra usage: TLS and forwarding run on the existing billed router.
Incremental CPU/RAM/network usage is unmeasured. Railway currently lists RAM
at $10/GB-month, CPU at $20/vCPU-month and egress at $0.05/GB. Review actual usage
after rollout, and agree to that variable usage before enabling it. The older
$0.60-$1.70/month estimate concerned a separate proxy, not this design.

Tailscale HTTPS consent allows certificate issuance. Issuing the certificate
publishes the machine name plus tailnet DNS suffix in public Certificate
Transparency logs. Content and access stay private; published names cannot be
removed by rollback. Review the names before consent. Never enable Funnel.

## Ordered rollout: stop at each gate

### 1. Review and merge the preparation only

Review PR #530 and its current CI. The default `tailscale_https_services` is
empty, so it creates no HTTPS variable; it does not switch the router source or
enable certificates. Expect a fresh Terraform plan with no changes. Do not
merge on a non-empty or unrelated plan. No automatic merge is requested.

Before the later source switch, record the current router source, variables,
volume mount and tailnet node IP. Keep auth values in Railway, never in this
repo or PR comments. Test the existing private HTTP UI and admin login/upload
from the normal Tailscale-connected device as the baseline.

### 2. Adopt/switch the router through a separately reviewed Terraform plan

PR #531 is a **draft research PR, not a ready-to-merge prerequisite**. Its
November 12 plan is historical, before today's service rename and cleanup.
Refresh it on current master after #530, review a new plan and only then decide
whether to merge. A merge runs `terraform apply` and may restart the shared
router. This preparation task does not authorize that live change.

The reviewed configuration must import the existing service ID, retain the
existing `tailscale-rw-volume` at `/var/lib/tailscale`, retain its auth key and
GSO/GRO settings, and switch source to `tomahim/vibe-code-apps`, branch `master`,
root directory `/infra/tailscale-router`, watch path `/infra/tailscale-router/**`.
Require **no destroys/replacements** and no unrelated service/database changes.
Ensure the Railway GitHub app can read this repo. Do not use a public domain.

First deploy with `TS_HTTPS_SERVICES` absent. Check router health, unchanged node
IP, existing HTTP UI, admin login and upload, plus Cultive's existing private
HTTP route because the router is shared. Stop and roll back the source on a
regression. Preserve the volume even during rollback.

### 3. Tailscale settings (manual, only after approval)

1. Open the Tailscale admin console's **DNS** page. Check MagicDNS is enabled.
   Under **HTTPS Certificates**, choose **Enable HTTPS**, after reviewing the
   public-name notice above. If already enabled, do not toggle it off/on.
2. In **Access controls**, inspect the existing policy. Permit only the intended
   users/devices to the router node on TCP 443. An existing subnet rule to
   `...:8080` does not grant access to Serve at the router itself. Do not replace
   the policy or add an allow-all rule. Keep an existing router tag if it has
   one; do not invent a tag or enable Funnel. Review any needed narrow policy
   change before applying it.

No separate `tailscale cert` command is needed for this design: Serve obtains
and manages its certificate. Do not copy private keys into Railway variables.

### 4. Enable only vibe HTTPS through Terraform

Prepare/review a separate small PR that sets the variable default to:

```hcl
default = "443=ui.railway.internal:8080"
```

Alternatively use an established durable Terraform variable input, if one
exists. A one-off local `-var` is not durable: later CI applies use defaults.
Do not rely on an uncommitted local tfvars file. Review the plan: the intended
change is only the router's `TS_HTTPS_SERVICES` variable. Merging applies it and
restarts the router. Do not include a Cultive mapping in this rollout.

Watch startup logs for the forwarder and Serve status. If DNS, a certificate,
ACL or backend connection fails, stop; do not retry issuance repeatedly or
relax access controls. Confirm the actual Serve URL from the router console:

```sh
tailscale --socket=/var/run/tailscale/tailscaled.sock serve status
tailscale --socket=/var/run/tailscale/tailscaled.sock status --json
```

These commands are read-only. Do not post full status JSON or secrets in a PR.
If needed, resolve `ui.railway.internal` inside the router and check its HTTP
health before diagnosing the browser. Cold-starting UI/API may take time.

### 5. Acceptance on the real device and origin

On the Tailscale-connected Chrome device, without insecure-origin flags:

1. Open the exact Serve URL plus `/apps/music-library`. There must be no TLS
   warning and no mixed-content/worklet/WASM load error.
2. Press Play on Neon Rain, hear audio for at least 30 seconds, press Stop,
   then Play again. Test First Light too. A secure-context diagnostic alone
   does not prove playback.
3. Recheck the original HTTP URL and both private apps' existing HTTP access.
   HTTP music playback is still unsupported; other HTTP functionality remains.
4. Check account/admin login and an image upload via the new HTTPS origin.
   nginx already forwards Host and X-Forwarded-Proto; Django trusts the HTTPS
   proxy header. Verify this live instead of pre-emptively loosening CSRF.
5. Check the HTTPS URL does not load off the tailnet in a fresh browser session
   (avoid mistaking cached app HTML for a network response).
6. After one deliberate approved router redeploy, confirm the same IP/URL,
   Serve persistence and real playback again. Inspect the machine's TLS
   certificate status in Tailscale. Auto-renewal is managed by Serve; one
   redeploy is not proof that a future renewal has happened.

This work is not complete until real-origin playback passes. Google sign-in
has its own separate provider and application checks.

## Rollback

Set the durable Terraform input/default back to `""` in a reviewed PR. The plan
should delete only `TS_HTTPS_SERVICES`. Apply/redeploy clears the persisted
Serve configuration at boot via a bounded `tailscale serve reset`. Check logs
and `serve status`; if reset fails, do not claim HTTPS is off.

If the router image itself regresses HTTP, restore its previous source
`dotlouis/tailscale-rw` / `main` through the same approved management route,
keeping the existing volume, auth key and DNS settings. Do not revert the
entire old Terraform file, which could undo today's split. Source rollback
alone may retain Serve config on the volume: verify/reset it before claiming
HTTPS is disabled. Both approaches restart the router and can cause a brief
interruption. Do not disable the whole tailnet HTTPS feature as a routine
rollback; it could break other services and does not erase public CT records.

## Sources

- [AudioWorklet secure-context requirement](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet)
- [Tailscale HTTPS settings and public certificate names](https://tailscale.com/docs/how-to/set-up-https-certificates)
- [Serve, tailnet access rules and Funnel distinction](https://tailscale.com/docs/features/tailscale-serve)
- [Serve CLI, local reverse proxy, background persistence and reset](https://tailscale.com/docs/reference/tailscale-cli/serve)
- [Railway usage pricing](https://docs.railway.com/reference/pricing/plans)
