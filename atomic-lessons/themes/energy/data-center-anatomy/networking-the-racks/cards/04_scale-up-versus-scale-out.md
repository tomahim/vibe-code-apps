---
id: 092dbaeb-4505-4d6f-8d86-58e452ea05cf
position: 4
title: Scale-up versus scale-out
image: scale-up-scale-out.png
image_alt: 'Two-panel diagram: scale-up shows GPUs within one rack connected by a fast NVLink fabric; scale-out
  shows many racks connected through the data center network with InfiniBand or Ethernet.'
image_caption: Scale-up links GPUs inside a rack at extreme speed; scale-out links racks across the facility.
image_license: original
archived: false
---


AI systems split networking into two regimes. Scale-up connects GPUs inside a rack or chassis over an extremely fast, short-range fabric: NVIDIA's NVLink lets the 72 GPUs of a GB200 rack exchange data at speeds far beyond any data center network, so they form a tightly connected scale-up domain while remaining distinct GPUs. Scale-out connects racks to each other over the facility network, using InfiniBand or high-performance Ethernet (RoCE), to build clusters of thousands or hundreds of thousands of GPUs.

The two regimes obey different physics and economics. Scale-up demands enormous bandwidth over centimeters, which is why the illustrated NVL72 rack uses short copper connections. Scale-out covers meters to kilometers and must balance bandwidth, latency and cost. The boundary matters for facilities too: the scale-up fabric is why an NVL72 rack is a single engineered product, while the scale-out fabric is part of the building's infrastructure, cabled row by row like power.
