---
id: 03f41aa9-efb2-4713-a09e-4d257dc86c98
position: 1
title: The network is the computer
image: spine-leaf-fabric.png
image_alt: 'Diagram of a spine-leaf network: racks with top-of-rack leaf switches at the bottom, each connected
  to every spine switch in the row above, forming a mesh of equal-cost paths.'
image_caption: 'Spine-leaf fabric: every leaf reaches every other leaf in two hops, through any spine.'
image_license: original
archived: false
---


Sun Microsystems coined the phrase "the network is the computer" in the 1980s, and data centers finally made it literal. Almost no workload of consequence runs on one machine: a search query fans out to hundreds of servers, a video stream pulls from caches worldwide, and an AI training run synchronizes tens of thousands of GPUs. The network is not plumbing between computers; it is the backplane of one enormous computer that happens to fill a building.

That reframing explains the money. Networking can represent a significant slice of an AI cluster's capital cost, and SemiAnalysis warns that a poorly designed network can slash the utilization of GPUs that cost tens of thousands of dollars each. Idle GPUs waiting for data are burning money: the power bill continues, the depreciation clock ticks, and no training progress happens. Network design is therefore an economic discipline as much as an engineering one.
