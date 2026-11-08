---
id: 2827b3e9-d8f1-4857-93a6-73f6afa9cfeb
position: 2
title: 'Tiers: rating the promise of uptime'
archived: false
---

The Uptime Institute's Tier classification rates a facility's ability to keep running, and SemiAnalysis uses it as the frame for redundancy decisions. Tier I is a single power and cooling path with no redundancy. Tier II adds some redundant components. Tier III, the common standard for large commercial facilities, is concurrently maintainable: any component or distribution path can be serviced without interrupting IT, which is what the N+1 and 2N designs from lessons 8 to 11 deliver. Tier IV is fault tolerant: the facility survives any single failure without impact, at roughly double the infrastructure.

The tiers correspond to expected availability, from about 99.671% for Tier I to 99.995% for Tier IV, the difference between about 28 hours and about 26 minutes of expected downtime per year. One clarification SemiAnalysis adds: cloud providers advertise service-level nines, 99.9% or 99.999%, which describe a service spanning multiple data centers and software, a broader promise than any single building's tier. A Tier III building can host a five-nines service; the layers stack.
