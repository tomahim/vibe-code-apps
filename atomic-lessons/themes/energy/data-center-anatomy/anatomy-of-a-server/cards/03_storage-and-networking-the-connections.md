---
id: c2551d85-b26a-4bdd-8c95-22adc226c029
position: 3
title: 'Storage and networking: the connections'
archived: false
---

Servers keep data on drives: NVMe solid-state drives for speed, hard disks for cheap bulk, often both. A storage server trades compute for capacity, filling its chassis with dozens of drives behind a modest CPU. Most application servers keep only a little local storage and fetch data over the network from dedicated storage systems, which we cover in lesson 6.

The network interface card (NIC) is the server's door to the rest of the world. Standard servers use 10 to 100 gigabit-per-second Ethernet ports; AI training servers carry multiple 400 or 800 Gb/s adapters, because synchronizing a model across thousands of GPUs moves staggering volumes of data. In an H100-class AI server the networking hardware can cost as much as the CPUs. Every cable and optic is also a power draw: high-speed transceivers add measurable watts per port, which is why SemiAnalysis insists networks belong in the datacenter power budget, not just the IT budget.
