---
id: 63a5e6ac-7ccf-45d4-9f88-735b1907dab0
position: 4
title: 'Sizing and redundancy: N, N+1 and 2N'
archived: false
---

How many transformers does a data center buy? The vocabulary: N is the number strictly needed to carry the load. N+1 adds one spare, so any single unit can fail or be serviced. 2N doubles everything into two fully independent systems. SemiAnalysis gives the concrete picture: if a site needs ten transformers, N+1 means buying eleven; 2N means twenty.

The choice is an economic bet on downtime. Each added unit costs capital, space and a lifetime of maintenance, while each outage costs revenue and reputation. Rated 3 facilities, the common standard for large commercial data centers, typically run N+1 on components like transformers and generators and 2N on the distribution that feeds the IT load. Hyperscalers have evolved subtler schemes such as 4N3R, four systems where three suffice, which buys resilience at three-quarters of the 2N price. Whatever the scheme, the arithmetic is the same: pay for extra iron now, or pay for outages later.
