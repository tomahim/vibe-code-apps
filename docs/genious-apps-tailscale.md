# Genious apps over Tailscale only (issues #7 and #8)

The Genious apps services (`ui` and `api`) in the Railway project
`genious-apps`, environment `production`, are reachable only from devices on
the Tailscale tailnet. They have no public `*.up.railway.app` domain.

The public domain of the `ui` service is removed by Terraform
(`infra/terraform/main.tf`). The steps below are done by hand in the Railway
and Tailscale dashboards. Terraform manages the router's UDP GSO workaround
as described below; the router itself and its auth key remain managed in Railway.

## Overview: how access works

- A Railway service called the Tailscale subnet router sits in the `production`
  environment. It joins the tailnet and advertises Railway's private network.
- Tailscale split DNS sends `*.railway.internal` lookups to the router, so
  `ui.railway.internal` resolves only for devices on the tailnet.
- Who can reach the app is decided by two things: membership of the tailnet,
  and the tailnet access policy (ACL).
- The router authenticates with the `TAILSCALE_AUTHKEY` variable, stored only
  in Railway. End users never need it and must never be given it.

| Thing | Where it lives | Who manages it |
| --- | --- | --- |
| Router service and `TAILSCALE_AUTHKEY` | Railway project `genious-apps` | Tailscale admin and Railway admin |
| Users and devices | Tailscale admin console, Machines and Users | Tailscale admin |
| Access policy (ACL) | Tailscale admin console, Access controls | Tailscale admin |
| Split DNS and MagicDNS | Tailscale admin console, DNS | Tailscale admin |
| Public domain removal | Terraform in this repo | Repo maintainers |

## Creating the tailnet (admin account)

Do this once, before the one-time setup below. Genious apps gets its own
personal tailnet. Do not reuse a work tailnet: the employer's admin controls
its ACLs, devices and subnet routers, and a personal project does not belong
there.

1. Go to https://tailscale.com and select Get Started.
2. Sign up with a personal identity provider account, for example a personal
   Google or GitHub account. Signing up with a public email domain such as
   `@gmail.com` puts the tailnet on the free Personal plan (6 users,
   unlimited devices, 3 ACL groups, enough for this setup). Signing up with a
   custom domain starts an Enterprise trial instead, so use a personal
   account.
3. Choose Personal use when asked.
4. Install the client on your first device from https://tailscale.com/download
   and sign in with the same account. This device makes you the tailnet admin.
5. You land in the admin console (https://login.tailscale.com). The sections
   below happen there: Users, Machines, Access controls, DNS.

Notes:

- The Personal plan covers 6 users. Each invited person counts as one user,
  no matter how many devices they add. If you hit the limit, remove an
  inactive user (admin console, Users) or upgrade the plan.
- One laptop can hold both a work account and this personal account
  (account switching in the client), but only one is connected at a time. If
  both need to be reachable together, use a second device for one of them.

## Registering users

Registering a user is covered below in "Onboarding a user and their devices":
an admin invites the person by email from the Users page of the admin console
(step 1) and adds them to `group:genious-users` (step 2). The invited person
signs in with their own Google, GitHub or other supported identity provider
account; they never see the admin's credentials or `TAILSCALE_AUTHKEY`.

## One-time setup

1. In Railway, deploy the "Tailscale Subnet Router" template into the
   `production` environment of `genious-apps` (same environment as `ui` and
   `api`):
   https://railway.com/deploy/tailscale-subnet-router--tailscale-subnet-router
2. In the Tailscale admin console:
   - Enable MagicDNS.
   - Create a reusable, ephemeral, pre-authorized auth key tagged for the
     router (for example `tag:railway-router`).
3. Add the key to the router service in Railway as the `TAILSCALE_AUTHKEY`
   variable. Never commit it to the repo.
4. Approve the Railway subnet routes the router advertises, either manually
   in the Tailscale console or with a narrowly scoped `autoApprovers` policy
   for the router tag.
5. Configure split DNS in Tailscale: map the `railway.internal` zone to the
   router's tailnet IP. The router's startup logs print the advertised routes
   and the exact DNS entry to use.
6. From a Tailscale-connected laptop or phone, open the app at its private
   address `http://ui.railway.internal:8080` (the `ui` service listens on its
   `PORT`, 8080). The `ui` service proxies `/api`, `/admin` and `/static` to
   `api.railway.internal:8000` over Railway's private network, so the whole app
   works through that one address.

## Router throughput workaround

The existing `tailscale-rw` service has `TS_DEBUG_DISABLE_UDP_GSO=true`.
Terraform declares this variable and imports its existing Railway value in
`infra/terraform/main.tf`, using the router's service ID. It does not adopt
the router service, its volume, or `TAILSCALE_AUTHKEY`.

On 2026-10-18, enabling this setting on Tailscale 1.104.1 reduced a
291,696-byte admin font download from 21–29 seconds to 2.7–3.5 seconds.
An [upstream report](https://github.com/tailscale/tailscale/issues/20026)
describes a similar slowdown caused by UDP send offloading in a nested
tunnel setup. This is evidence for the workaround, not confirmation of
Railway's underlying network fault.

### UDP GRO (receive side), added 2026-10-19

Saving a recipe with an image from a phone in the admin stalled: the ui nginx
logged `POST ... 408` (request body never fully arrived), so the API never saw
the request. Uploads are the receive direction of the router, so Terraform also
sets `TS_DEBUG_DISABLE_UDP_GRO=true` (the receive-offload counterpart of the GSO
variable; name checked in Tailscale's `net/batching/conn_linux.go`). This is a
hypothesis, not confirmed: it is not known that GRO is the cause. Terraform
creates this variable on apply (it does not exist in Railway before). To test,
upload an image of a few hundred kB from the admin after the router redeploys.
To roll back, remove the resource from Terraform and merge, which deletes it.

### IPv6 upload stall: use IPv4 UI ingress

The GSO/GRO settings and larger nginx body limits did not resolve the reported
admin saves. On 2026-10-19, unauthenticated POST probes to the production UI
isolated the failure before Django or S3:

| Probe | Result |
| --- | --- |
| IPv4, 256 bytes | HTTP 403 in 0.28 s |
| IPv4, 16 KiB | HTTP 403 in 1.77 s |
| IPv4, 256 KiB | HTTP 403 in 3.03 s |
| IPv4, 5 MiB, change URL | HTTP 403 in 9.06 s |
| IPv6, 256 bytes | HTTP 403 in 0.26 s |
| IPv6, 16 KiB | No response within 10 s |
| IPv6, 16 KiB sent in 500-byte writes with 150 ms pauses | HTTP 403 |

HTTP 403 is expected here: probes have no CSRF token or login cookie, so they
cannot create or edit recipes. nginx buffers the body before proxying it to
Django. Larger IPv6 writes stalled with both add and change forms in production;
nginx eventually logged 408. Even pacing curl at 1,000 bytes/s did not resolve
the IPv6 stall. The exact fault inside the IPv6 transport remains unconfirmed;
these results do not establish an S3, image validation, or overall file-size bug.
One 5 MiB IPv4 probe initially returned 502 while the API woke from sleep;
nginx logged an upstream connection refusal. Repeating it after startup
returned 403. That cold-start failure is separate from the IPv6 body stall.

The UI now listens only on `0.0.0.0:${PORT}`. A connection to its AAAA address
is refused before HTTP starts, allowing dual-stack browsers to select the A
record and send the full upload over the verified IPv4 path. An IPv6 connection
to a closed port on the live UI failed in 0.19 s during diagnosis. This relies
on Railway's dual-stack service DNS and the router advertising its IPv4 subnet;
both were verified for this environment. IPv6-only private environments need
a different solution. The hostname, cookies and CSRF origin remain the same.

After deployment, check add and edit with a small image and one near the 5 MiB
Django limit, including “Save and continue editing”. Recheck these transport
probes from a Tailscale-connected device (no authentication required):

```sh
head -c 16384 /dev/zero > /tmp/recipe-upload-probe
curl -4 --max-time 15 --data-binary @/tmp/recipe-upload-probe \
  -o /dev/null -w 'status=%{http_code} seconds=%{time_total}\n' \
  http://ui.genious-apps-production-railway.internal:8080/admin/recipes/recipe/add/
curl -6 --max-time 15 --data-binary @/tmp/recipe-upload-probe \
  -o /dev/null -w 'status=%{http_code} seconds=%{time_total}\n' \
  http://ui.genious-apps-production-railway.internal:8080/admin/recipes/recipe/add/
```

IPv4 should return 403 promptly; IPv6 should refuse the connection promptly.
Repeat IPv4 without `-4` to exercise normal address selection. Do not restore
the IPv6 listener until normal unpaced IPv6 POSTs of 16 KiB, 256 KiB and 5 MiB
complete repeatedly on the affected devices. `cd ui && npm run test:proxy`
checks the actual nginx configuration in Docker, including add/change multipart
body integrity, the 5 MiB upload allowance, the 6 MiB proxy limit and refusal of
IPv6 connections. It uses a test backend, so it does not exercise Django or S3.

For a replacement router, update `local.tailscale_router_id` and migrate the
variable's state/import as needed. If this workaround is removed later, update Terraform as
well so the next apply does not restore it. Variable changes can redeploy
the router; repeat the same font download twice after any change.

## Removing the public domain

Only after step 6 works: merge the pull request that removes
`railway_service_domain.ui` from Terraform. The merge triggers
`terraform apply`, which deletes `ui-production-4774.up.railway.app`.

## Scoping access with the access policy

Keep access limited to the intended people and the app port. Example ACL
fragment (adapt group names and the subnet to what the router advertises in its
logs):

```json
{
  "groups": { "group:genious-users": ["alice@example.com", "bob@example.com"] },
  "tagOwners": { "tag:railway-router": ["autogroup:admin"] },
  "acls": [
    {
      "action": "accept",
      "src": ["group:genious-users"],
      "dst": ["<railway-subnet-cidr>:8080"]
    }
  ],
  "autoApprovers": { "routes": { "<railway-subnet-cidr>": ["tag:railway-router"] } }
}
```

- Add a person to `group:genious-users` to grant access, remove them to revoke.
- Port 8080 is the `ui` port. Do not open the whole subnet or `api` directly.
- The router itself is a tagged device, not a user device. Do not give users
  access to it.

## Onboarding a user and their devices

An administrator does steps 1 to 3. The user does steps 4 to 8.

1. Invite the person to the tailnet. In the Tailscale admin console, Users,
   Invite external users (or invite by email). For someone outside the
   organization see
   https://tailscale.com/docs/features/sharing/how-to/invite-any-user
2. Add their email to `group:genious-users` in the access policy and save.
3. Send them the app address `http://ui.railway.internal:8080` and this
   document. Never send `TAILSCALE_AUTHKEY`.
4. Install the Tailscale client from https://tailscale.com/download
   (macOS, Windows, Linux, iOS, Android) and sign in with the invited account.
   Quickstart: https://tailscale.com/docs/how-to/quickstart
5. Subnet routes: the router's route is approved once by an admin (setup
   step 4). Normal devices accept it automatically. On Linux clients only, run
   `sudo tailscale up --accept-routes`. If the app does not open, check the
   client has "Use Tailscale subnets" enabled (Windows and Android settings).
6. Make sure MagicDNS and "Use Tailscale DNS settings" are on in the client, so
   the `railway.internal` split DNS applies.
7. Verify while connected: open `http://ui.railway.internal:8080`. The app
   should load.
8. Verify while disconnected: turn Tailscale off and reload. The app must not
   open.

Each extra device (phone, second laptop) signs in with the same account and
follows steps 4 to 8.

## Offboarding

1. Remove the person's email from `group:genious-users` in the access policy.
2. In the admin console, Machines: remove each of their devices (Delete, or
   Disable key expiry off and expire the key).
3. In Users: suspend or delete the user so they cannot sign back in.
4. Confirm they can no longer open `http://ui.railway.internal:8080`.

If a device is lost, remove that device from Machines right away.

## Who has access: reviewing it

- Admin console, Users: lists everyone in the tailnet and their role.
- Access controls: `group:genious-users` is the list of people allowed to reach
  the app. Review it regularly.
- Machines: lists devices and when they were last seen. Remove stale ones.
- Rotate `TAILSCALE_AUTHKEY` if it may have leaked: create a new key, update the
  Railway variable, redeploy the router, revoke the old key.

## Verification after the domain is gone

- Off the VPN, the app does not open (the public domain no longer resolves).
- On the VPN, `http://ui.railway.internal:8080` works.
- The `master` deploy workflows (GitHub Actions deploying `ui` and `api` to
  Railway) still succeed; they authenticate with the `RAILWAY_TOKEN` secret and
  do not depend on a public domain.
