---
id: c885da28-4de0-479a-98ec-0b13ff833f56
position: 1
title: When the outage outlasts the batteries
image: failover-sequence.png
image_alt: 'Sequence diagram of a grid outage: utility power fails, the UPS carries the load from batteries within milliseconds,
  the automatic transfer switch signals the generators, generators reach full output around 60 seconds, and the load transfers
  to generator power with batteries recharging.'
image_caption: 'Failover: batteries first, then engines, then fuel logistics for the long haul.'
image_license: original
archived: false
---

The UPS buys minutes. When an outage lasts longer, and some last hours or days, the data center becomes its own power plant. Rows of diesel generators, each the size of a shipping container and rated around 2 MW, stand ready in yards beside the building, fueled to run for days. They are the reason a data center can promise uptime through storms that darken entire regions.

The sequence is choreographed. The grid fails; the UPS carries everything seamlessly; the automatic transfer switch signals the generators; engines crank, stabilize and accept load; and within about a minute the facility runs on its own fuel. When the grid returns, the process reverses gently, with a cool-down before the engines sleep again. Operators test this choreography regularly, often weekly, because a backup system that has never been proven under load is not a backup system; it is a hope.
