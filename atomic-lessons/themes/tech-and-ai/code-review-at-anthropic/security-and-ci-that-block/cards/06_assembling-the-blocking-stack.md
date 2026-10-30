---
id: 1b68fb2d-02e7-49ae-8a7b-138561852747
position: 6
title: Assembling the blocking stack
archived: false
---
Seen together, the blocking layers form a stack of increasing judgment. At the bottom, CI executes deterministic checks: types, lint, tests, build. Above it, the bug review and security review apply learned judgment about what is broken or exploitable. Above those, risk-based approval decides how many humans must look, a lesson of its own later in this path.

Each layer trusts the ones below it. The security reviewer does not re-check whether the code compiles; CI already proved that. The human approver does not re-run the tests; they read the evidence. This trust is what makes dozens of checks affordable on every pull request. When a lower layer is weak, the weakness propagates upward as wasted attention, which is why the team invests in the boring floor as seriously as in the clever reviewers.
