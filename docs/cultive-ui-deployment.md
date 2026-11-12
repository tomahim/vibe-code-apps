# cultive-dev UI service

Review-only infrastructure change. The existing Terraform workflow applies on
merge to master. Review the current plan and approve cost before merging.

Expected delta: one sleeping UI service and its PORT/API_UPSTREAM variables,
three additions with no changes or deletions to existing resources. No public
domain is added. No infrastructure has been applied during preparation.

## Deployment interface

- Upload `ui/` as the build root using Railway CLI `--path-as-root`.
- Dockerfile at upload root; HTTP listener on `PORT=8080`.
- `/health/` returns 200 independently of the upstream API.
- `API_UPSTREAM=http://api.railway.internal:8000`.
- Use the service-ID output after approved apply. Store deployment credentials
  in CI secrets, never source code or build arguments.
- Read actual private DNS after creation and verify health and application
  access before reporting deployment ready. No hostname is promised here.

## Cost review

[Published Railway rates](https://docs.railway.com/pricing/plans), checked
12 November 2026: RAM $10/GB-month, CPU $20/vCPU-month, egress $0.05/GB;
builds free. No volume is added. Illustrative month-average scenarios:
0.03 GB RAM + 0.005 vCPU = $0.40/month; 0.10 GB + 0.01 vCPU = $1.20/month,
plus egress and applicable tax. These are unmeasured arithmetic examples,
not a forecast, spending cap or approval. Sleeping may reduce usage.

Existing plan allowance may absorb usage; current billing headroom is
unverified. This change does not require a separate subscription per service.
