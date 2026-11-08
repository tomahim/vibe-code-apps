---
id: cb6f2480-ecd5-40e1-8d5a-5e3c14f14af0
position: 7
title: Testing the bridge
archived: false
---


A UPS is only real if it has carried the load lately. Batteries degrade silently: cells lose capacity, internal resistance climbs, and a bank that looked healthy on paper can collapse in thirty seconds under real load. Facilities therefore test constantly, with monitoring that tracks every battery string and periodic discharge tests that prove the autonomy figure is still true.

Maintenance requires safe isolation, not merely a static-bypass command. To service a UPS, operators use the specified external maintenance bypass and isolation procedure before servicing a de-energized unit, then restore its normal path, all without the servers noticing. During that window the facility runs without its bridge, which is why such work follows strict procedures and why the 2N design matters so much: the other chain still protects the load while this one is open. The uninterruptible promise is not a device but a discipline of monitoring, testing and redundant paths, renewed every week of the facility's life.

[Further reading: SemiAnalysis electrical systems, free section](https://newsletter.semianalysis.com/p/datacenter-anatomy-part-1-electrical).
