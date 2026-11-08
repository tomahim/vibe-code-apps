---
id: ab879572-1676-4b4c-9c10-578b64d58582
position: 6
title: A side and B side
archived: false
---


Look behind a well-built rack and you will see two of everything: two power strips, two feeds, two paths back to two independent UPS systems. This is one common implementation of dual-path distribution; A and B labels alone do not prove complete independence. In a fully independent 2N design, A side and B side are separate power distribution systems, and every piece of IT equipment with dual power supplies straddles them. Either side alone carries the whole load.

The discipline extends to behavior: network cables, cooling capacity and even maintenance schedules respect the A/B split, because the design only works if no single event can kill both sides. A technician can shut down the entire A side for maintenance while the data hall hums on B. That property, called concurrent maintainability, is what Tier III facilities are required to have, and it is tested in real life every time someone works on electrical equipment under controlled isolation procedures.
