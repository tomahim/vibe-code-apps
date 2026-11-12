---
id: f83d39fc-1dad-4c82-9052-fed4e2bf2400
position: 4
title: Against the alternatives
archived: false
---


The baselines fail in instructive ways. ReasoningBank keeps the harness fixed and retrieves distilled strategies from past trajectories into context; it falls as much as 6.6 points below the base harness on coding tasks, showing that memory retrieval without harness change can actively hurt. Harness Scaling revises the harness per task with extra inference budget but carries no state across tasks; it underperforms the plain base harness in seven of the twelve benchmark-configuration pairs.

Meta-Harness, the offline optimizer, is the strongest baseline and even leads on one LAB configuration, but it needs labeled training tasks, and in the compute analysis it uses more compute than Harness² at k=5 for lower performance. The pattern across all three: methods that neither refine the harness with execution evidence nor accumulate improvement experience leave gains on the table, and sometimes lose points outright.
