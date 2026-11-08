---
id: ab879572-1676-4b4c-9c10-578b64d58582
position: 6
title: A side and B side
archived: false
---


Look behind a well-built rack and you will see two of everything: two power strips, two feeds, two paths back to two independent UPS systems. This is one common implementation of dual-path distribution; A and B labels alone do not prove complete independence. In a fully independent 2N design, A side and B side are separate power distribution systems, and every piece of IT equipment with dual power supplies straddles them. In the depicted 2N design, either healthy side is sized to carry the whole load.

The discipline extends to behavior: network cables, cooling capacity and even maintenance schedules respect the A/B split, because the design only works if no single event can kill both sides. With appropriate capacity, healthy loads and controlled isolation, a technician can take A out for maintenance while B supports the IT load. That property, called concurrent maintainability, is what Tier III facilities are required to have, and it is tested in real life every time someone works on electrical equipment under controlled isolation procedures.
