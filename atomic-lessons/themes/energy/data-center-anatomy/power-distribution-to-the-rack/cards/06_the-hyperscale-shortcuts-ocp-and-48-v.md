---
id: 2f3558a7-ac98-4989-954d-67f853dd5717
position: 6
title: 'The hyperscale shortcuts: OCP and 48 V'
archived: false
---


Hyperscalers, buying servers by the hundred thousand, found savings in rethinking the last hop. Meta's Open Compute Project moved AC-DC conversion out of individual servers into central power shelves per rack, feeding servers DC over a shared busbar, with modular 3 kW rectifier modules and optional battery backup units providing minutes of in-rack ride-through. Google went further, standardizing a 48 V DC busbar in the rack, cutting conversion stages and copper losses.

The efficiency logic compounds: one efficient conversion per rack beats forty per rack, and DC busbars skip the per-server rectifier entirely. SemiAnalysis points out the resilience bonus too: in-rack batteries can halve total battery capacity compared with maintaining A and B central UPS chains, at the price of putting lithium in the rack and the fire engineering that demands. The lesson generalizes: at hyperscale, even the sacred topology of the electrical chain is negotiable if the watts and dollars justify it.
