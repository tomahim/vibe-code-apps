---
id: 0b2cd369-faa8-4918-8265-d3234a8d974e
position: 7
title: From one server to a fleet
archived: false
---


Large distributed services rarely rely on one server, though small workloads can. A web application spreads across hundreds of identical machines behind load balancers; an AI training run synchronizes thousands of GPUs as if they were one giant accelerator. The fleet view changes what matters: individual server failures become routine background noise, and the design goal shifts from making one machine perfect to making the herd resilient and the total cost per unit of work low.

That is why servers are built to be replaced, not repaired at leisure: a failed machine is flagged by monitoring software, software may restart or move its work elsewhere if designed for that failure, and a technician swaps it during the next maintenance round. It is also why utilization matters so much economically. An idle server still draws power. SemiAnalysis discusses illustrative provisioned-power utilization of 50-60% for cloud workloads and above 80% for AI training, which keeps expensive GPUs busy. The next lesson scales this picture up: from one chassis to the rack that houses dozens.

[Further reading: NVIDIA rack-scale system overview](https://www.nvidia.com/en-us/data-center/gb200-nvl72/).

[Further reading: DGX H100 system specifications](https://docs.nvidia.com/dgx/dgxh100-user-guide/introduction-to-dgxh100.html).
