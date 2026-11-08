---
id: 43d2ff8b-f531-43cb-89bc-86651401e691
position: 5
title: Storage over the network
archived: false
---


Many disaggregated cloud designs use networked storage, while others keep substantial local storage for performance or architecture reasons. Their data lives on dedicated storage systems reached over the network: block storage that behaves like a remote drive, file storage shared like a network folder, and object storage, the architecture of the cloud era, where data is stored as objects behind HTTP-style APIs, with durability provided through redundancy and integrity checks.

Object stores like Amazon S3 defined the model: everything is an object with a name, retrieved over the network, and the service hides the entire machinery of drives, failures and repairs behind an availability and durability promise measured in nines. For the facility, networked storage means the storage fleet concentrates in its own racks and halls, densely packed and power-modest, while compute racks stay lean. It also means the network from lesson 5 carries application reads and writes plus additional replication and rebuild traffic. There is no universal twice-per-byte multiplier; it depends on the redundancy scheme and access pattern.
