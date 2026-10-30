---
id: 1eb3424c-bb67-4d6a-a36a-4b25f0f398a8
position: 5
title: Why not just slow down
archived: false
---
One colleague put the trade-off bluntly: slowing down does lower your error rate, but mostly because you are doing less of everything. A team can always buy safety with speed, but the price is all the value that slower shipping destroys.

The team's preference is to get faster at noticing and fixing problems instead. That preference explains investments that look unrelated to review, like feature flags that turn off without a deploy and staged release channels. Each one shrinks the cost of a mistake, which lowers the amount of upfront human inspection a low-risk change needs. Notice the philosophy: rather than rationing change to match human reading speed, they rebuilt the system so human attention is spent where failure is expensive, and recovery covers the rest.
