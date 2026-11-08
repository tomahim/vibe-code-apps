---
id: 63a5e6ac-7ccf-45d4-9f88-735b1907dab0
position: 4
title: 'Sizing and redundancy: N, N+1 and 2N'
archived: false
---


How many transformers does a data center buy? The vocabulary: N is the number strictly needed to carry the load. N+1 adds one spare, so any single unit can fail or be serviced. 2N doubles everything into two fully independent systems. SemiAnalysis gives the concrete picture: if a site needs ten transformers, N+1 means buying eleven; 2N means twenty.

The choice is an economic bet on downtime. Each added unit costs capital, space and a lifetime of maintenance, while each outage costs revenue and reputation. The article illustrates N+1 components and dual distribution paths. These are design patterns, not the definition of Tier III: the full system must support concurrent maintenance. Hyperscalers have evolved subtler schemes such as 4N3R, four systems where three suffice, which reduces installed spare capacity relative to duplicating the entire load. The actual cost depends on equipment and layout, not one universal fraction. Whatever the scheme, the arithmetic is the same: pay for extra iron now, or pay for outages later.
