---
id: e0854441-8a23-407f-87ed-bc415e55eaa8
position: 2
title: Inside a double-conversion UPS
image: ups-block-diagram.png
image_alt: 'Block diagram of a double-conversion UPS: AC input enters a rectifier producing DC, a battery bank sits on the
  DC bus, an inverter converts DC back to clean AC for the load, and a static bypass switch offers a direct route around the
  system.'
image_caption: 'Double conversion: AC to DC to AC, with batteries always on the DC bus and a bypass for faults.'
image_license: original
archived: false
---

The standard data center UPS uses double conversion, and SemiAnalysis lists its four parts. A rectifier converts incoming AC to DC. A battery bank hangs on that DC bus, always charged, always ready. An inverter, built on IGBT power semiconductors, converts DC back to clean AC for the load. And a static bypass switch can route power around the whole system if the UPS itself fails or needs service.

The beauty of the design is that the load never sees the input: power is always being rebuilt from the DC bus, so sags, surges, frequency drift and noise from the grid are filtered out completely. When the grid fails, nothing switches: the battery simply starts discharging into a bus it was already feeding. Response time is effectively zero, quoted under 10 milliseconds. That is the trick at the heart of every serious facility: continuity achieved not by reacting fast, but by never having to react at all.
