---
id: 2b3a4d8f-a478-4190-9e33-8754ecb11cf5
position: 4
title: Hot, warm and cold tiers
archived: false
---

Not all data is equal. A payment database is read and written constantly; last year's logs are touched rarely; backups are written once and, with luck, never read at all. Storage systems exploit this with tiers. Hot data lives on NVMe flash close to compute. Warm data sits on slower flash or fast HDDs. Cold data migrates to dense HDD shelves, object storage, or even tape libraries, which remain among the cheapest and most energy-frugal archives ever built.

Tiering is an energy strategy as much as a cost one. A cold-archive system can spin drives down or keep tapes unpowered on shelves, storing petabytes for watts. The software that moves data between tiers, by age, access pattern or policy, is one of the quiet optimizers of the industry: it lets the same facility serve milliseconds-fast queries and decade-long retention without paying flash prices, or flash power, for everything. When people say the cloud remembers everything, they mean this hierarchy of media, managed automatically.
