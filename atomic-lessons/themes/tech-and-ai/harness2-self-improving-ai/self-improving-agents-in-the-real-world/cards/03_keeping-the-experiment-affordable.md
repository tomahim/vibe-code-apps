---
id: fc1115de-682f-4557-a026-293f5b36d5c2
position: 3
title: Keeping the experiment affordable
archived: false
---


Refinement multiplies executions. If hundreds of tasks arrive per hour and each spawns reference, candidate and composition runs, the improvement workload can dwarf the original work. One sensible answer is separation: ordinary requests keep running on a stable harness while refinement happens elsewhere, in a queue, with a bounded number of workers and its own spending quota.

The economic test is simple to state and hard to pass: an improvement is worth its cost only when its expected future benefit exceeds what it cost to discover, check and maintain. Recurring task families with visible traces and real volume pass easily. Rare one-off tasks almost never do. Put hard caps on the recursion budget, token spend, run time and number of parallel probes, so the optimizer can never quietly become the biggest expense.
