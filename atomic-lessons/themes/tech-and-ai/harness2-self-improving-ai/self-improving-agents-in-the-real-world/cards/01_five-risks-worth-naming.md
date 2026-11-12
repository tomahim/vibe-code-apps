---
id: 7efbf1e3-135a-4a34-9ec0-1aea4759f9af
position: 1
title: Five risks worth naming
archived: false
---


Any system that rewrites its own surroundings has some predictable ways to go wrong. The first is the wrong pick: without an answer key, a convincing but wrong result can be adopted, and the paper itself says the adopted star means chosen, not proven best. The second is the over-broad lesson: something learned from one task gets applied to tasks it does not fit. The paper shows how naive reuse can hurt, with a directly inherited domain harness dropping Code scores from 73.4 to 63.2.

The third is pile-up: each round adds rules, scripts and hooks, and nobody removes the old ones until the harness is an unmaintainable heap. The fourth is runaway cost, because every candidate run is paid inference. The fifth is the unsafe edit: a changed script or hook may do something undesirable while the output still looks better. The paper tackles the first two directly and names cost and consolidation as open work; the fifth is general engineering caution, so anyone adopting the idea should measure each risk separately.
