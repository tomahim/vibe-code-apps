---
id: 32be9095-5f51-447f-a81f-0d303d636c24
position: 5
title: The ATS and the switchover
archived: false
---

Between utility and generators sits the automatic transfer switch (ATS), the component that decides where the building's power comes from. It watches the utility feed; on failure, it starts the generators, waits for stable output, then transfers the load. On restoration, it transfers back and commands cool-down. Downstream of it, the UPS smooths every transition, so the choreography upstream stays invisible to the IT load.

For larger and more redundant plants, the simple ATS is joined by static transfer switches (STS) downstream: solid-state devices that can move a load between two live power sources in milliseconds, because they use power electronics rather than mechanical contacts. SemiAnalysis highlights STS units in hyperscaler catcher schemes, where loads hop between UPS systems. The contrast is worth remembering: ATS decisions are slow and mechanical, about which source feeds the building; STS decisions are fast and electronic, about which internal path feeds the rack.
