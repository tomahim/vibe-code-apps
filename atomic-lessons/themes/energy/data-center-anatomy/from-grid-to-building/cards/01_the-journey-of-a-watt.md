---
id: 663aa4bb-f6e3-4c60-929d-13b4adf5ebbb
position: 1
title: The journey of a watt
image: grid-to-chip-voltage-chain.png
image_alt: 'Diagram of the voltage descent from power plant to chip: generator at about 20 kV, transmission at 230
  kV, substation down to 33 kV medium voltage, facility transformer down to 415 V, server power supply to 12 V,
  and voltage regulators to about 1 V at the chip.'
image_caption: 'A watt''s journey: stepped up for travel, stepped down again and again toward the chip.'
image_license: original
archived: false
---


The electricity feeding a rack was generated perhaps a hundred kilometers away, in a plant producing power at around 20 kV. A step-up transformer raises that to transmission voltage, 110 to 400 kV, for the journey across the grid. Near the load, substations step it back down to medium voltage for local distribution, and the data center's own transformers step it down again toward the few hundred volts the IT equipment uses.

Why this cascade? The I-squared-R law from lesson 1: losses grow with the square of current, so moving power at high voltage and low current is the only economical way to cross distance. But high voltage is dangerous and bulky to insulate, so it must come down before it approaches people and equipment. The data center's electrical design is the last chapter of this story: a controlled descent from transmission voltage to the roughly 1 V of a processor core, losing as little energy as possible at every step.
