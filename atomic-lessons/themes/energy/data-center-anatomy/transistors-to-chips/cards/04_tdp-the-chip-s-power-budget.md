---
id: 7bd472ef-702b-492a-b00f-af07b20f7c5b
position: 4
title: 'TDP: the chip''s power budget'
image: chip-power-evolution.png
image_alt: 'Illustrative device ratings: laptop CPU 28 W, desktop CPU 125 W, server CPU 350 W, H100 SXM maximum
  700 W, and a multi-chip AI module example at 1.2 kW.'
image_caption: Different device examples, not a timeline or energy-per-task comparison.
image_license: original
archived: false
---


Engineers summarize a chip's appetite with its Thermal Design Power (TDP): the thermal design rating used to size cooling; its exact definition depends on the vendor. A laptop CPU might have a TDP of 15 to 28 W, a desktop chip around 125 W, a server CPU 300 to 500 W. The NVIDIA H100 has a configurable TDP up to 700 W in its SXM server form. Grace-Blackwell modules exceed a kilowatt.

TDP informs facility planning, but it is not a measurement of constant draw. Server planning must also include memory, fans, networking, power-supply losses and workload behavior. Nameplate ratings, measured draw and design capacity are different quantities, even though they all use watts. Nearly all of that electrical power becomes heat in a space the size of a pizza box. A 700 W chip produces about as much heat as a small fan heater, concentrated on a few square centimeters of silicon. Getting that heat out, fast and reliably, is what the entire cooling half of a data center exists to do.
