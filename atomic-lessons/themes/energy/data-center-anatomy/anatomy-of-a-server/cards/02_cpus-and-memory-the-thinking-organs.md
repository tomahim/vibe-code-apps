---
id: 8dc33ee6-10c9-464f-9006-43cbaa33bd58
position: 2
title: 'CPUs and memory: the thinking organs'
archived: false
---

The central processing unit executes the server's programs. Servers usually carry one or two CPU sockets, each chip with dozens of cores. Next to each CPU sit slots of DRAM, the fast working memory that holds the data being processed right now. A modern server might carry 512 GB to several terabytes of RAM, because keeping data close to the CPU is the cheapest performance there is.

In AI servers the roles invert: the GPUs do the computing and the CPUs feed them. NVIDIA's Grace CPU exists largely to keep Blackwell GPUs supplied with data at high speed. Memory also changed shape for AI: high-bandwidth memory (HBM) stacks DRAM dies directly next to the GPU on the same package, trading upgradeability for enormous data rates. Whether conventional or accelerated, the rule is the same: the compute chips are the hungriest components in the box, and everything else exists to keep them busy.
