---
id: 187e20e9-96db-4c04-a661-a29dcea38209
position: 3
title: The start sequence
image: generator-start-sequence.png
image_alt: 'Bar-timeline of a generator start: signal at zero, engine cranking for a few seconds, engine stabilizing voltage
  and frequency around 10 to 15 seconds, load accepting in steps, full capacity near 60 seconds.'
image_caption: From signal to full power in about a minute, with the UPS covering every second of it.
image_license: original
archived: false
---

A generator does not deliver power instantly. The start signal fires the starter motors; the engine cranks and catches within seconds; then it must stabilize its speed, voltage and frequency before accepting load. Loads are applied in steps so the engine is not stalled by a sudden megawatt demand. SemiAnalysis notes generators generally take around 60 seconds to reach full capacity, and adds the honest detail that, like a car engine, they occasionally fail to start on the first try.

That last fact shapes the whole design. Because any single generator might balk, facilities install more than arithmetic requires, typically N+1 at Rated 3 sites: if the load needs five generators, six are installed. The UPS covers not just the nominal minute but the messy reality of retries and staggered starts. Every second of that uncertainty is exactly what the battery bridge was built to absorb.
