---
id: 0b2cd369-faa8-4918-8265-d3234a8d974e
position: 7
title: From one server to a fleet
archived: false
---

No data center workload runs on one server. A web application spreads across hundreds of identical machines behind load balancers; an AI training run synchronizes thousands of GPUs as if they were one giant accelerator. The fleet view changes what matters: individual server failures become routine background noise, and the design goal shifts from making one machine perfect to making the herd resilient and the total cost per unit of work low.

That is why servers are built to be replaced, not repaired at leisure: a failed machine is flagged by monitoring software, its work migrates elsewhere automatically, and a technician swaps it during the next maintenance round. It is also why utilization matters so much economically. An idle server still draws power, so SemiAnalysis notes typical power utilization of 50-60% for cloud workloads and above 80% for AI training, which keeps expensive GPUs busy. The next lesson scales this picture up: from one chassis to the rack that houses dozens.
