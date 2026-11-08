---
id: ba1c68f5-442d-4be6-beee-8032e68b439d
position: 1
title: Why liquid, why now
image: liquid-vs-air.png
image_alt: Comparison chart showing the heat-carrying capacity of water versus air per unit volume, with water's
  bar vastly taller, illustrating why liquid cooling is required above roughly 100 kW per rack.
image_caption: Water carries heat thousands of times better than air per unit volume. At AI densities, that gap
  is decisive.
image_license: original
archived: false
---


The physics from lesson 12 left a cliff edge: air can practically serve racks up to a few tens of kilowatts, while AI racks now draw 60, 100, 130 kW. The way across is a better heat carrier. Water's volumetric heat capacity beats air's by a factor in the thousands, so a modest flow of liquid through a pipe carries the heat that a hurricane of air could not.

A concrete example is NVIDIA's liquid-cooled GB200 NVL72 rack, ending years in which liquid was an exotic option for supercomputing niches. When the industry's flagship AI system made liquid mandatory, the entire supply chain, from coolant distribution units to quick-disconnect fittings to facility water loops, had to industrialize at once. Liquid cooling became a major design requirement for many new high-density AI deployments, which is why SemiAnalysis frames Blackwell as the standardizing moment of datacenter design.
