---
id: 855df8a4-0ee7-44da-8bf5-24c376e29243
position: 2
title: One step already helps
archived: false
---


The headline result is that a single contrastive step, k=1, improves every configuration on all three benchmarks. The gains reach up to 11.5 points on WorkBuddy-Bench, 4.5 points on JobBench and 11.8 percentage points on LAB's Partial pass rate. One step means: one reference execution, one invariant and one domain proposal, probes, one composition, one successor run. That is a modest amount of extra compute for a double-digit swing on some configurations.

Against the baselines, Harness² exceeds ReasoningBank, Meta-Harness and Harness Scaling on WorkBuddy-Bench average and JobBench score in all four configurations. The one exception: on LAB, Meta-Harness leads for Gemini 3.5 Flash under Codex, a reminder that offline optimization with labeled training tasks remains competitive when such tasks exist. No method wins everywhere, and the paper does not pretend otherwise.
