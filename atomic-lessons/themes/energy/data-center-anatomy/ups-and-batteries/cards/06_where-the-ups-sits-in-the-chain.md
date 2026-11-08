---
id: 9a3d7241-0900-4644-b1c0-bafb76ab2b90
position: 6
title: Where the UPS sits in the chain
archived: false
---

The UPS lives directly downstream of the automatic transfer switch and upstream of the power distribution units, guarding the IT path. The cooling plant is treated separately: chillers and pumps are generally not given battery ride-through, because they can tolerate a minute's interruption, which is one reason cooling failures, while rarer than electrical ones, have a larger blast radius when they do occur.

Redundancy applies here with full force. Rated 3 facilities typically deploy 2N UPS systems, two fully independent chains, so either can carry the load while the other is serviced; the A side and B side from lesson 4 originate at this pair of UPS systems. Hyperscalers sometimes prefer catcher designs with N+1 UPS blocks and static transfer switches that move loads between them in milliseconds, trading the simplicity of 2N for capital savings and better loading. Every scheme answers the same question SemiAnalysis poses: how much iron are you willing to buy so the servers never know the grid is gone?
