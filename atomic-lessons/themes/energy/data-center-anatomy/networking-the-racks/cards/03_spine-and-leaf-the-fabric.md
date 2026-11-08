---
id: ddea438d-16be-4baf-b5c3-facdc960bc41
position: 3
title: 'Spine and leaf: the fabric'
archived: false
---

A data center network is organized as a fabric. The topology that won is spine-leaf: every ToR switch (the leaves) connects to several aggregation switches (the spines), and every leaf reaches every other leaf in exactly two hops through any spine. The result is a mesh with many equal-cost paths, so traffic spreads evenly and a single switch failure degrades capacity instead of cutting connectivity.

Older designs used a three-tier hierarchy that worked when most traffic flowed in and out of the building, toward users. Modern traffic is mostly east-west, server to server inside the facility, and spine-leaf serves that pattern with predictable latency. The fabric is also built for repair: switches are small, numerous and interchangeable, so a failed unit is routed around instantly and replaced on a maintenance round. Like servers, network gear is designed for a world where individual failure is routine and only the fabric must endure.
