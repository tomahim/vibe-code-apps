---
id: 12964c7f-1b69-4a70-b29f-2841d6a8eeb1
position: 5
title: 'AC and DC: two flavors of electricity'
archived: false
---

Electricity comes in two forms. Alternating current (AC) reverses direction many times per second, 50 times in Europe and 60 in North America. Direct current (DC) flows steadily in one direction. The grid runs on AC because transformers can step AC voltage up and down easily, which is exactly what long-distance transmission needs. Chips, batteries and logic circuits run on DC.

A data center therefore converts between the two constantly. The grid delivers AC, a rectifier in the UPS or power supply turns it into DC, and an inverter can turn battery DC back into AC. Each conversion wastes a few percent of the energy as heat. That is why some designs, like Meta's Open Compute racks, convert AC to DC once per rack in a central power shelf instead of in every server, and why Google pushed a 48 V DC busbar: fewer conversions mean less wasted power and less heat to remove.
