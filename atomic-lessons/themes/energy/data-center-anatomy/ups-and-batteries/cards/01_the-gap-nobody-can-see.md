---
id: 79dc04d0-0f3d-4cb9-bccb-6360b307d239
position: 1
title: The gap nobody can see
image: outage-timeline.png
image_alt: 'Timeline of a power outage: grid fails at zero seconds, UPS batteries carry the load instantly with
  a response under 10 ms, the generator starts around 60 seconds, batteries hand over, and fuel sustains the load
  for days.'
image_caption: The UPS bridges the minute between grid failure and generator takeover.
image_license: original
archived: false
---


Grid power fails more often than you think: lightning, excavation accidents, storms and switching operations cause sags and outages on every network. Servers have only limited power-supply hold-up time; a long-enough interruption can reset machines and lose in-flight work. Worse, the backup generators that would take over need roughly a minute to start and reach full output. Between the grid's failure and the generator's arrival lies a deadly gap.

The uninterruptible power supply (UPS) exists to fill it. Sitting between the utility feed and the IT load, the UPS carries its protected load from stored energy, seamlessly, for the minutes the generators need. SemiAnalysis puts typical battery autonomy at 5 to 10 minutes: not enough to survive a long outage, but far more than enough to hide the generator start. The UPS is not an alternative source of energy; it is a bridge, and its only job is that nothing across it ever notices the crossing.
