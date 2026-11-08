---
id: b5b0041e-7d5d-4468-974a-67e3ebf5e10b
position: 2
title: 'MVA versus MW: apparent and real power'
image: power-triangle-mva-mw.png
image_alt: 'Right triangle diagram of apparent power: the hypotenuse labeled MVA, the horizontal side labeled MW of real power,
  the vertical side labeled reactive power, with the power factor as the cosine of the angle between MVA and MW.'
image_caption: Apparent power (MVA), real power (MW) and the power factor between them.
image_license: original
archived: false
---

Transformers are rated in MVA, megavolt-amperes, not megawatts, and the difference is real physics. AC loads do not always draw current in step with voltage; motors and power supplies shift the timing, creating reactive power that sloshes back and forth without doing useful work. Apparent power, in VA, combines real power (watts, the work done) with reactive power. The ratio between them is the power factor: MW divided by MVA.

Practically, a 10 MVA transformer with a 0.95 power factor load delivers at most 9.5 MW of real power. Data center equipment, with its modern power-factor-corrected supplies, keeps the ratio close to 1, which is why SemiAnalysis says an MVA is roughly a MW in this context. But the electrical plant must be sized on apparent power, because cables and transformers feel all the current, useful or not. When a campus buys a 100 MVA transformer, it is buying current-carrying capacity, and hoping the load uses it well.
