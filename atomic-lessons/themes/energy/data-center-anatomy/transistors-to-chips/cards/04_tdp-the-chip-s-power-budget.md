---
id: 7bd472ef-702b-492a-b00f-af07b20f7c5b
position: 4
title: 'TDP: the chip''s power budget'
image: chip-power-evolution.png
image_alt: 'Bar chart of chip power budgets: a laptop CPU at about 28 W, a desktop CPU at 125 W, a server CPU at 350 W, an
  NVIDIA H100 GPU at 700 W, and a Grace-Blackwell module at about 1,200 W.'
image_caption: Chip power budgets have climbed from tens of watts to over a kilowatt per module.
image_license: original
archived: false
---

Engineers summarize a chip's appetite with its Thermal Design Power (TDP): the sustained power the cooling system must be able to remove. A laptop CPU might have a TDP of 15 to 28 W, a desktop chip around 125 W, a server CPU 300 to 500 W. The NVIDIA H100, the GPU that powered the first wave of large AI models, has a TDP of 700 W in its SXM server form. Grace-Blackwell modules exceed a kilowatt.

TDP is a facility-planning number, not just a chip spec. Sum the TDPs of everything in a server and you have its power draw; sum the servers and you have the rack; sum the racks and you have the data hall. Nearly all of that electrical power becomes heat in a space the size of a pizza box. A 700 W chip produces about as much heat as a small fan heater, concentrated on a few square centimeters of silicon. Getting that heat out, fast and reliably, is what the entire cooling half of a data center exists to do.
