---
id: b5a93f10-efd5-4dcf-b14e-b2c126d52a99
position: 7
title: Reliability at fabric scale
archived: false
---

A fabric of thousands of switches and hundreds of thousands of cables fails somewhere every day. The design response is the same as for servers and power: assume failure, make it survivable, automate the workaround. Equal-cost multipath routing spreads flows across all available spine paths, so losing a spine switch removes a fraction of capacity rather than any connectivity. Link-level monitoring detects flapping optics and drains traffic before users notice.

Capacity planning adds the second layer of resilience: fabrics are provisioned with headroom so that even degraded, they carry peak AI training bursts. And because every link is also power draw, the efficiency work compounds: fewer, faster links with modern transceivers beat many slow ones on both cost and watts. From the GPU's NVLink to the campus backbone, the network is the last micro-level system we need. Next we scale out to the discipline that keeps all of it powered: the electrical chain, starting at the grid.
