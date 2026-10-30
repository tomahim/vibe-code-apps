---
id: cf42496e-9744-4984-9713-6386dc802fbf
position: 3
title: Measuring human time directly
archived: false
---
You cannot optimize what you do not measure, so the team tracks human time with explicit metrics. They watch human approvals per pull request, both the median and the 95th percentile, because a process that is cheap on average but occasionally demands many approvers still hurts. They also track human comments and how long a pull request waits on a person.

Waiting time matters more than it seems. A pull request that needs only one approval but sits for two days blocks the author and multiplies context switching. Together these metrics answer the question the whole system is built around: how much human time does each change actually consume, and where does it queue up? Without them, arguments about review rigor are just taste.
