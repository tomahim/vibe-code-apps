---
id: 47f9aa22-04cf-4efe-bcb4-7bb34e7315b1
position: 4
title: The efficiency problem
archived: false
---


Double conversion has a cost: converting AC to DC and back wastes energy. SemiAnalysis cites typical UPS losses of 3 to 5%, worse at light load, and at campus scale 4% of throughput is many megawatts turned into heat around the clock. A 100 MW campus might burn 4 MW just keeping its UPS systems between the grid and the servers.

The industry's answer is smarter operating modes. Modern UPS units can run in an eco or standby mode where clean grid power flows straight through the static bypass, pushing efficiency above 99%, with the conversion path re-engaging in a few milliseconds when the power wavers. That small transfer delay is the price: a slightly larger blink risk in exchange for eliminating most of the continuous loss. It is a fine example of data center engineering as applied economics: reliability is not one number but a dial, and each facility chooses where on the dial to sit.
