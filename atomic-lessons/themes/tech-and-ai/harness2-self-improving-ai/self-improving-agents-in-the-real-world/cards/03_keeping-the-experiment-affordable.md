---
id: fc1115de-682f-4557-a026-293f5b36d5c2
position: 3
title: Keeping the experiment affordable
archived: false
---


Refinement multiplies executions. If hundreds of tasks arrive per hour and each spawns baseline, candidate and composition rollouts, the adaptation workload can dwarf the original inference workload. The Medium article's architecture answer is decoupling: normal requests run on a stable harness while a separate asynchronous experimentation service evaluates improvements against representative tasks, using a queue, bounded worker pools, concurrency limits and independent model-call quotas.

The economic test is simple to state and hard to pass: a harness improvement is worth its cost only when its expected future benefit justifies its discovery, validation and maintenance costs. Recurring task families with observable traces and real volume pass easily. Rare one-off tasks almost never do. Organizations should also restrict the maximum recursion budget, token expenditure, execution time and parallel probe count, so the optimizer can never quietly become the largest line item.
