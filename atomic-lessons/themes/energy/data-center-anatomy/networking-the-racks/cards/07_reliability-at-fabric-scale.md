---
id: b5a93f10-efd5-4dcf-b14e-b2c126d52a99
position: 7
title: Reliability at fabric scale
archived: false
---


A fabric of thousands of switches and hundreds of thousands of cables fails somewhere every day. The design response is the same as for servers and power: assume failure, make it survivable, automate the workaround. Equal-cost multipath routing spreads flows across all available spine paths, so losing one spine can reduce capacity without disconnecting leaves when the remaining paths are healthy. Link-level monitoring detects flapping optics and drains traffic before users notice.

Capacity planning adds the second layer of resilience: fabrics are provisioned with headroom so that even degraded, they carry peak AI training bursts. And because every link is also power draw, the efficiency work compounds: fewer, faster links with modern transceivers beat many slow ones on both cost and watts. From GPU links to the campus backbone, networking ties compute together. Next comes storage, then the electrical chain that feeds the collection.

[Further reading: NVIDIA GB200 NVL72 interconnect overview](https://www.nvidia.com/en-us/data-center/gb200-nvl72/).

[Further reading: Cisco spine-leaf design](https://www.cisco.com/c/en/us/products/collateral/switches/nexus-9000-series-switches/white-paper-c11-743245.html).
