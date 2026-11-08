---
id: eca6503a-4551-455f-8625-ae2423f92885
position: 6
title: The limits of air
archived: false
---


Air is a mediocre heat carrier. Per unit of volume it moves little heat, so removing kilowatts means moving storm-force volumes of it, and fans to move that air themselves consume meaningful power, often several percent of the IT load. At low rack densities, this is fine. As density climbs, the airflow required per rack grows until the physics breaks: you cannot push a hurricane through a server without the fans consuming the energy you are trying to save.

Air cooling becomes harder as density rises, but there is no universal rack-kilowatt ceiling. Server design, temperature rise, airflow and fan energy determine the practical limit. Rear-door heat exchangers are already a hybrid liquid technique: the server uses air, but water captures its exhaust heat. Very dense AI designs increasingly use cold plates rather than relying on room air alone. The accessible cooling article introduces this density challenge; the public sources linked here explain the engineering choices. When air fails, the answer is to bring a better heat carrier to the chip: liquid, the subject of lesson 14, and the reason the newest data halls are plumbed like refineries.
