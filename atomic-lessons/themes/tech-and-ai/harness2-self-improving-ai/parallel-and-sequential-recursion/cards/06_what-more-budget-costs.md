---
id: 20c2ee44-cef9-4cbe-8048-092aab40c3e6
position: 6
title: What more budget costs
archived: false
---


The other side of the ledger is compute. Every candidate probe, composition run and editor session is model inference, so a k=5 task costs many times a single execution. The paper measures this honestly, counting all tokens spent before the final deliverable is submitted, and plots the compute-performance trade-off. Both evaluated Harness² configurations landed on the empirical Pareto frontier: no compared method achieved their scores more cheaply.

Two reference points make the trade concrete. Raising k from 1 to 5 lifted gains over the base harness from 4.5 to 7.5 points on JobBench and from 5.1 to 8.4 on WorkBuddy-Bench. Meanwhile Meta-Harness, the offline optimizer, used more compute than Harness² at k=5 for lower performance. More budget does buy more score in this range, but the Medium article's production advice stands: cap the recursion budget, token spend and probe count, and only spend when the expected future benefit justifies the discovery cost.
