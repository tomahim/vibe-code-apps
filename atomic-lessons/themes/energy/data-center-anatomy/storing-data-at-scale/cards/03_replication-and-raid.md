---
id: c429d22a-8b30-42fc-ab23-54f82bbd6124
position: 3
title: Replication and RAID
image: raid-vs-replication.png
image_alt: Diagram comparing RAID striping with parity across drives in one server versus replication of whole copies
  across three different servers in different racks.
image_caption: RAID protects inside a chassis; replication protects across racks and buildings.
image_license: original
archived: false
---


Two families of technique keep data alive. RAID, redundant array of independent disks, groups drives in one system. Some RAID levels mirror data; others add parity so the array can survive specified drive failures and rebuild from surviving data. RAID 0 stripes without redundancy, so the RAID label alone does not guarantee protection. It protects within a chassis or enclosure.

Replication and erasure coding work across machines. Replication keeps complete copies, typically three, on different servers in different racks, so any copy can serve a read and any failure is masked. Erasure coding is the space-efficient cousin: data is split into fragments with mathematical parity such that, for example, any 12 of 16 fragments reconstruct the whole, tolerating four simultaneous losses while using about 1.33 times the original data size, rather than the 3 times required for triple replication. This is a simplified capacity example, not a durability guarantee. Hyperscalers layer these: erasure coding within a site, replication or geo-coding across sites, because the failure modes that matter grow from one drive to one rack to one building.
