# Music HTTPS enablement approval

This branch proposes paid enablement of the separate endpoint prepared in #543.
It has NOT been merged or deployed. Master remains disabled until approval.
The preparation runbook's disabled-plan statements describe #543, not this PR.

## Exact change

`infra/terraform/music-https.auto.tfvars` sets `music_https_enabled = true`.
The existing safe default remains false; Terraform automatically loads this
committed input. Reverting/removing this input disables and destroys this
endpoint and its state volume after a reviewed plan. That discards its node
identity and certificate state, not the existing router's state.

Expected plan: one `railway_service.music_https[0]` create with its own nested
volume, zero changes/deletions to existing resources. Service name
`vibe-music-https`, source master, root `/infra/music-https`, always on.
Volume `vibe-music-https-state` mounts at `/var/lib/tailscale`.
No public domain, TCP proxy, router import or secret variable resource.
The live CI plan, not this expectation, is the approval artifact.

## Cost and storage

The current workspace is Hobby. Railway documents a default 5GB volume for
Hobby. The provider's `volume.size` is computed/read-only, so the plan may
show its final size as known after apply. Do not promise a 500MB allocation.
Railway bills USED storage at $0.15/GB-month, not the allocated maximum.
New filesystem metadata consumes about 2-3% of capacity (about 100-150MB for
5GB), roughly $0.015-$0.0225/month before stored node/certificate data.

Compute is metered: $10/GB-month memory and $20/vCPU-month CPU; egress
$0.05/GB. The previous $1-$3/month extra usage estimate is an assumption,
not a cap. Actual baseline RAM/CPU must be measured after enrollment. No
new plan/subscription is proposed. Included Hobby usage may already be used.

## Remaining gates

- User approves paid enablement and current CI plan before merge. CI applies
  automatically on merge; this draft is not approval to merge.
- Approve intended node name and permanent public certificate-transparency
  disclosure. No certificate or CT setting is changed by this branch.
- Resolve intended audience for the whole vibe UI, including API/admin.
  Inspect actual tailnet ACLs before adding a narrow tag/443-only grant.
  Do not copy the router's tags, state or key.
- Supply a separate scoped short-lived registration key securely in Railway.
  No key in chat, code or Terraform state. The initial service intentionally
  fails closed until its own key/state exists. Retire registration key after
  enrollment according to policy, keep persistent node state.
- Complete real-origin playback, certificate, private reachability, restart,
  no-Funnel/no-routes and router-unchanged checks in the existing runbook.

Sources:
- https://docs.railway.com/reference/volumes
- https://docs.railway.com/reference/pricing/plans
- https://registry.terraform.io/providers/terraform-community-providers/railway/latest/docs/resources/service

See [the full rollout and rollback runbook](music-library-private-https.md).
