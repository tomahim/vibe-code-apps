---
id: 365e8ab0-e9d6-49b9-8615-715dc7b926de
position: 4
title: Medium voltage around the site
image: campus-mv-distribution.png
image_alt: A substation supplies separate radial medium-voltage feeds to data halls, each with a local step-down
  transformer.
image_caption: Simplified radial feeds; real sites may use rings, radial feeds or other arrangements.
image_license: original
archived: false
---


Once at medium voltage, power is distributed around the campus through loops and radial feeds of switchgear and cable, usually buried. Medium voltage is the sweet spot for this job: high enough to move megawatts hundreds of meters without punishing losses, low enough to handle with switchgear that fits in a room.

Each building, or each electrical block within a building, has its own step-down transformers near the load, converting medium voltage to the low voltage, around 400 to 480 V three-phase, that the data hall uses. Keeping the voltage high until physically close to the IT load is the governing principle SemiAnalysis identifies, and it explains the architecture of everything from a single hall to a multi-building campus: many small transformations near the load beat one giant transformation far away, in both efficiency and fault containment.
