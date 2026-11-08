---
id: 9a3d7241-0900-4644-b1c0-bafb76ab2b90
position: 6
title: Where the UPS sits in the chain
archived: false
---


In a common arrangement the UPS protects the IT branch downstream of utility/generator transfer equipment and upstream of distribution to the racks. This is not the only topology: transfer can happen at different voltage levels, and rack-level battery systems move the energy store nearer the computers. A drawing must state its assumptions before it can be used to reason about failures.

Cooling needs its own continuity analysis. Some chillers rely on thermal storage during a restart, while critical fans, pumps, controls or liquid-cooling circulation may need uninterrupted power. The safe interruption time depends on heat density and system design, not a universal one-minute allowance. Likewise, Tier III does not prescribe 2N UPS equipment. Concurrent maintainability is an outcome checked across the entire topology. A spare module without an isolatable delivery path may still leave maintenance that interrupts IT.
