---
id: e8add08c-f9ab-4ca6-ae5e-fac58175d649
position: 1
title: Two paths from the UPS
image: two-power-paths.png
image_alt: 'Diagram of the two downstream paths after the UPS and transfer switch: one path feeds IT equipment through distribution
  to the racks, the other feeds the cooling plant with chillers, pumps and fans.'
image_caption: 'After the UPS, power splits: one path for IT, one for cooling.'
image_license: original
archived: false
---

Downstream of the UPS and transfer switches, power splits into two great paths. One feeds the IT equipment, the reason the building exists. The other feeds the cooling plant: chillers, pumps, fans and air handlers that will remove the heat the IT path creates. SemiAnalysis draws exactly this fork, and its asymmetry matters: the IT path gets battery ride-through and the most elaborate redundancy, while cooling generally waits out the generator start.

Sizing the split is the efficiency story in miniature. In an average facility, roughly a third of total power goes to cooling and other overhead; in the best hyperscale facilities, far less. Every watt on the cooling path is a watt bought from the grid that never becomes computation, so engineers attack both sides: more efficient cooling, and IT equipment that tolerates warmer air. Keep this fork in mind; the PUE metric in lesson 15 is nothing more than its ratio.
