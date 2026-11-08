---
id: 2afcefd4-0494-4a33-a715-5048be1eb315
position: 5
title: Redundancy from end to end
image: 2n-distribution.png
image_alt: 'Diagram of 2N distribution: two independent UPS systems each feed their own busway, panels and rack
  power strips, labeled A side and B side, and each dual-corded server connects to both sides.'
image_caption: '2N: two completely independent paths from UPS to server, with dual-corded equipment straddling both.'
image_license: original
archived: false
---


We can now see the full redundancy weave. Two UPS systems feed two distribution chains: two busways or PDU sets, two rack strips, two power supplies per server. The article illustrates dual downstream components such as PDUs. Full-path resilience depends on isolation, capacity and failure containment throughout the design; a Tier III label does not mandate a universal 2N recipe.

The test of the design is conceptual: pick any single component, cable, breaker or busway in either chain, fail it, and every server keeps running. Then extend the thought to maintenance: a technician can de-energize the entire A side, work on it safely, and hand it back, with the B side carrying everything. That property is what 'concurrently maintainable' purchases, and it is why the data hall wears its A and B labels so visibly: the redundancy only works if every human in the room respects which side is which.
