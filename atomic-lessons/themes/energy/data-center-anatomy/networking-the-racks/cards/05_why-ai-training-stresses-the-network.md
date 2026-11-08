---
id: e3b9f8ff-c1cc-4405-941d-90de698b28f4
position: 5
title: Why AI training stresses the network
archived: false
---

Training a large model is a collective exercise. Thousands of GPUs each compute on their slice of data, then must exchange and combine their gradients, repeatedly, for weeks. During each synchronization, the fastest GPU waits for the slowest, so the cluster advances at the speed of its worst straggler and its most congested link. Network hiccups translate directly into lost training time.

This traffic pattern, called all-reduce, is brutally synchronized: bursts where every GPU talks at once. It defeated networks designed for the gentle statistical multiplexing of web traffic. Modern AI fabrics use rail-optimized layouts, congestion control and enormous bisection bandwidth to keep those bursts flowing. The performance stakes are measured in percentage points of cluster utilization, and each point of utilization on a gigawatt-scale fleet is worth megawatts of power and tens of millions of dollars a year. This is why SemiAnalysis treats the network as a first-class citizen of datacenter design.
