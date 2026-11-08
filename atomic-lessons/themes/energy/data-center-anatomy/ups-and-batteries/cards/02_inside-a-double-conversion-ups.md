---
id: e0854441-8a23-407f-87ed-bc415e55eaa8
position: 2
title: Inside a double-conversion UPS
image: ups-block-diagram.png
image_alt: 'Block diagram of a double-conversion UPS: AC input enters a rectifier producing DC, a battery bank sits
  on the DC bus, an inverter converts DC back to clean AC for the load, and a static bypass switch offers a direct
  route around the system.'
image_caption: 'Double conversion: AC to DC to AC, with batteries always on the DC bus and a bypass for faults.'
image_license: original
archived: false
---


The standard data center UPS uses double conversion, and SemiAnalysis lists its four parts. A rectifier converts incoming AC to DC. A battery bank is connected to that DC bus and kept charged during normal operation. An inverter, built on IGBT power semiconductors, converts DC back to clean AC for the load. And a static bypass switch can route power around the whole system if the UPS itself fails or needs service.

In normal online double-conversion operation, the inverter supplies the load from the DC bus rather than passing the input directly through, so sags, surges, frequency drift and noise from the grid are reduced within the UPS operating specification. During input loss, stored battery energy sustains the DC bus. In online double-conversion operation, the inverter continues supplying the load with no battery-transfer interruption; bypass and eco-mode transitions have different timing specifications. Bypass is the important exception: when the load is transferred to a bypass source, it is no longer supplied through the same conversion path, and its protection depends on that source and the transfer design.
