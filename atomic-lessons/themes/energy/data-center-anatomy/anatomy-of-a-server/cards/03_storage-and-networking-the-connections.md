---
id: c2551d85-b26a-4bdd-8c95-22adc226c029
position: 3
title: 'Storage and networking: the connections'
archived: false
---


Servers keep data on drives: NVMe solid-state drives for speed, hard disks for cheap bulk, often both. A storage server trades compute for capacity, filling its chassis with dozens of drives behind a modest CPU. Many application servers keep limited local storage and fetch data over the network from dedicated storage systems, which we cover in lesson 6.

The network interface card (NIC) is the server's door to the rest of the world. Server Ethernet links range from tens to hundreds of gigabits per second; some AI training systems carry multiple high-speed adapters, because synchronizing a model across thousands of GPUs moves staggering volumes of data. Every cable and optic is also a power draw: high-speed transceivers add measurable watts per port, which is why SemiAnalysis insists networks belong in the datacenter power budget, not just the IT budget.
