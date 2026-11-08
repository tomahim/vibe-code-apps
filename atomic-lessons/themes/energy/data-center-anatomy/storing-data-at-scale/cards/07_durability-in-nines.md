---
id: 49243b38-9971-458a-b723-3a27bb2445ab
position: 7
title: Durability in nines
archived: false
---


Storage systems express their promise as durability nines: an object store such as S3 Standard designed for eleven nines of durability, 99.999999999%, expects to lose one object per one hundred billion per year in a simple expected-loss interpretation. A service design target is not a guarantee about each individual object. That number is not achieved by magic drives but by arithmetic: redundancy across many independent failure domains, aggressive rebuild speeds when failures happen, and constant background verification.

That last mechanism, scrubbing, deserves a mention: the system continuously reads data nobody has requested, checks it against checksums and parity, and repairs silent corruption before it accumulates. Bit rot, the slow decay of stored data, is real at fleet scale, and only active verification keeps the nines honest. The durability figure is therefore a measure of process as much as of hardware: how fast failures are found, how fast copies are rebuilt, and whether the window where two failures could overlap is kept short enough to be vanishingly unlikely.

[Further reading: Amazon S3 durability design](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DataDurability.html).
