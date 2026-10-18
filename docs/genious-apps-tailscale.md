# Genious apps over Tailscale only (issues #7 and #8)

The Genious apps services (`ui` and `api`) in the Railway project
`genious-apps`, environment `production`, are reachable only from devices on
the Tailscale tailnet. They have no public `*.up.railway.app` domain.

The public domain of the `ui` service is removed by Terraform
(`infra/terraform/main.tf`). The steps below are done by hand in the Railway
and Tailscale dashboards; they cannot be expressed in the repo.

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

## Troubleshooting: slow large downloads through the router

### Symptom

Over the tailnet, small responses were fast (a 560 B page in 0.2 s) but large
static files were very slow: the 290 kB `woff2` font through `ui` took 21-29 s
(about 10-14 kB/s), so the admin login page took several seconds. The connection
was direct (not a DERP relay), at about 88 ms RTT from France to the router in
Railway US East.

### What was ruled out

- Router to `ui` hop: from the router container, the same font from `ui` over
  the private network took 0.011 s. `ui` nginx and the private network are fine.
- MTU: `tailscale ping --size 1300` from the router to a laptop worked direct
  (about 90 ms). Railway fixes `railnet0` at MTU 1316, but that did not explain it.
- DERP relay: the path was direct.
- Tailscale version: bumping to 1.104.1 (see below) gave no real gain
  (login page 1.91 s to 1.78 s).

### Fix

Set this variable on the `tailscale-rw` service and redeploy it:

```
TS_DEBUG_DISABLE_UDP_GSO=true
```

After this the font took about 2.7-3.5 s instead of 21-29 s.

To roll back, delete the variable and redeploy `tailscale-rw`.

### Likely cause (hypothesis, not confirmed)

UDP GSO (send offload of batched UDP packets) probably misbehaves on Railway's
network, so large transfers collapse to a few kB/s while small ones are fine.
Nobody has confirmed this inside Railway. The symptoms match an upstream report
of the same pattern (fast backend, direct connection, ~20 KiB/s on large
responses, fixed by disabling UDP GSO):
https://github.com/tailscale/tailscale/issues/20858 (open when checked). The
knob itself was added in
https://github.com/tailscale/tailscale/commit/dea49bb4daaf4aea90f720d5eddce6bb39be0ce7.
That report is about Kubernetes with a kernel TUN, while our router runs in
userspace mode, so it is a similar symptom, not proof of the same bug.

### Tailscale version pin

`TAILSCALE_VERSION=1.104.1` is currently set as a Railway variable on
`tailscale-rw` (it overrides the Dockerfile `ARG` of the template). It was set
while investigating a netstack bug and did not fix the slowness. It is probably
safe to leave, and removing it is untested.

### Optional: move to an EU region

The router, `ui` and `api` are in US East. Moving all three to an EU region would
cut the RTT from about 88 ms. This is tracked in
https://github.com/tomahim/vibe-code-apps/issues/33 and is optional now that the
main slowness is fixed.
