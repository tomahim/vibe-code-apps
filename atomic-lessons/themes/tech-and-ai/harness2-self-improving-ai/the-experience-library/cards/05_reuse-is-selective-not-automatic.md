---
id: 3fb0336f-d3c9-41a2-b9a4-ad1ec42aa1d3
position: 5
title: Reuse is selective, not automatic
archived: false
---


A subtle but crucial choice: the next task does not inherit the previous task's harness. Every task starts from the common base harness. What carries over is the improvement harness's library, and reuse flows through the normal machinery: the Propose stage may reuse or adapt library components, and accumulated experience informs Probe and Compose. The paper is explicit that proposals must check task-specific facts against the current task's evidence rather than trusting old ones blindly.

Why start from the base instead of the last winner? Because a heavily tailored harness drags its task's specifics into every future task, and the paper's analysis shows how badly naive reuse fails: directly refining the base harness into a domain harness without reference executions, probes or library access degraded Code scores from 73.4 to 63.2 and Web from 69.9 to 65.0. Selective, evidence-checked reuse is what separates accumulating wisdom from accumulating noise.
