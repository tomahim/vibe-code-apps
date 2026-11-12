---
id: 53312b72-572d-4de4-9bb1-2ff5006860da
position: 2
title: 'Parallel recursion: explore wide'
archived: false
---


Parallel recursion bets on breadth. It collects k reference executions of the current harness, then independently proposes and probes k invariant and k domain-specific candidates. Finally, k independent composition sessions each receive the full pool of references and probed candidates, and each assembles its own successor harness, which is then executed. The implementation performs one population update; k controls its width, not its depth.

The paper describes this as an aggregation principle applied to executable harnesses rather than reasoning outputs: many independent eyes on the same evidence pool assemble different combinations of the supported edits. This mode suits tasks where multiple independent hypotheses could explain the failure, because several theories get tested at once. A practical bonus the paper mentions: proposal and composition sessions can run concurrently, so wall-clock latency depends on available compute rather than on k alone.
