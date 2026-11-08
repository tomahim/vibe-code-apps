---
id: e8cb2dab-df49-474d-b9fe-47d119a93606
position: 2
title: From the NIC to the top of the rack
archived: false
---

Every server connects through its network interface cards. In a conventional rack, each server runs one or two cables to the top-of-rack (ToR) switch, which aggregates forty-odd server links into a handful of faster uplinks. Speeds have climbed relentlessly: servers commonly connect at 10, 25 or 100 Gb/s, while AI servers carry multiple 400 or 800 Gb/s ports, one per GPU in many designs.

The humble cable choice is a power decision. Copper connections are cheap and low-power but reach only a few meters at high speed; optical links cross the building but their transceivers add watts and cost at every end. SemiAnalysis notes a deliberate strategy in large AI clusters: use copper everywhere physics allows, both for the scale-up network inside the rack and for short scale-out runs, reserving optics for longer reaches. Every watt not spent moving bits is a watt available for computing them.
