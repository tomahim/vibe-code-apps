---
id: d9eec431-f9db-4042-91ef-253deb234f03
position: 6
title: 'Compose: selective assembly'
archived: false
---


Composition reads everything: the reference execution, the candidate harnesses, their diffs against the current harness, and all task-local execution evidence. It then forms the successor harness selectively. It may merge the changes the evidence supports, revise conflicting edits, adopt one candidate wholesale, or, importantly, preserve the current harness if nothing proved its worth. Every decision must be tied to a concrete observation rather than a presumed score gain.

The composed harness is then executed for real, producing the successor's own execution record. In the paper's case study, the composer retained all four edits from the two candidates: the input-inventory guardrail, the output-verification script, the reconciliation skill and the number-format tool guidance, and the re-run scored 77.8 against the reference run's 43.1. The ablation shows composition itself matters: probing both candidates and just picking the better one, skipping composition, cost 1.6 points on WorkBuddy-Bench and 1.9 on JobBench.
