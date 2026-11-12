---
id: 43ebcd2e-280f-4617-be6c-0a707bb5d2db
position: 4
title: Version, trace, and roll back
archived: false
---


The article's governance advice borrows directly from software release discipline. Every adaptation cycle should produce traceable artifacts: the input task, model version, base and candidate harness versions, tool-call sequences, outcomes, selection rationale, cost, latency and the approval decision. OpenTelemetry-style distributed tracing can span the proposer, executor, evaluator, selector and storage services, with secrets and sensitive task data redacted from structured logs.

Rollout should be gradual: a candidate passes automated validation, representative regression tests, security checks and domain acceptance criteria, then shadow evaluation, then limited canary traffic, then expansion. If accuracy degrades, policy violations rise or latency exceeds thresholds, the platform reverts to the previous immutable harness version. The versioned experiment record answers the one question that matters during an incident: which harness change caused this behavior to change? This is what keeps a self-improving agent from becoming an uncontrolled self-modifying service.
