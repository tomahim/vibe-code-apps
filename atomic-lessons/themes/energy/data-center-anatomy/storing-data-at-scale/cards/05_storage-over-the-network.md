---
id: 43d2ff8b-f531-43cb-89bc-86651401e691
position: 5
title: Storage over the network
archived: false
---

Most servers in a modern facility boot and run with little local storage. Their data lives on dedicated storage systems reached over the network: block storage that behaves like a remote drive, file storage shared like a network folder, and object storage, the architecture of the cloud era, where data is stored as objects behind simple HTTP-style requests, with durability achieved by erasure coding across many machines.

Object stores like Amazon S3 defined the model: everything is an object with a name, retrieved over the network, and the service hides the entire machinery of drives, failures and repairs behind an availability and durability promise measured in nines. For the facility, networked storage means the storage fleet concentrates in its own racks and halls, densely packed and power-modest, while compute racks stay lean. It also means the network from lesson 5 carries every byte twice over: once to the application and once, in the background, for replication and rebuild traffic nobody ever sees.
