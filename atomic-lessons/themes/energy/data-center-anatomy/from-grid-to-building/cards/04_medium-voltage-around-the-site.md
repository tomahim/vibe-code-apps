---
id: 365e8ab0-e9d6-49b9-8615-715dc7b926de
position: 4
title: Medium voltage around the site
image: campus-mv-distribution.png
image_alt: 'Campus diagram: one substation feeding medium-voltage rings to several data hall buildings, each with its own
  step-down transformer near the building entrance.'
image_caption: Medium voltage circulates around the campus; each building steps it down locally.
image_license: original
archived: false
---

Once at medium voltage, power is distributed around the campus through loops and radial feeds of switchgear and cable, usually buried. Medium voltage is the sweet spot for this job: high enough to move megawatts hundreds of meters without punishing losses, low enough to handle with switchgear that fits in a room.

Each building, or each electrical block within a building, has its own step-down transformers near the load, converting medium voltage to the low voltage, around 400 to 480 V three-phase, that the data hall uses. Keeping the voltage high until physically close to the IT load is the governing principle SemiAnalysis identifies, and it explains the architecture of everything from a single hall to a multi-building campus: many small transformations near the load beat one giant transformation far away, in both efficiency and fault containment.
