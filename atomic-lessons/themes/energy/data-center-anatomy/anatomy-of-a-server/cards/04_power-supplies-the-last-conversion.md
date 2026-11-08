---
id: 90bd8083-e11d-4ca9-80b2-ce0ed8fe0d26
position: 4
title: 'Power supplies: the last conversion'
image: psu-conversion-chain.png
image_alt: 'Diagram of the conversion chain inside a server power supply: 415 V three-phase AC enters the rack, the PSU rectifies
  it to DC and steps it down to 12 V, and voltage regulator modules near the chip reduce it to about 1 V.'
image_caption: 'From 415 V AC at the rack to about 1 V DC at the silicon: the PSU and VRMs do the final conversions.'
image_license: original
archived: false
---

The server's power supply unit (PSU) does the final act of the electrical chain: it takes the rack's AC feed and converts it to the low-voltage DC the components use, typically 12 V for the motherboard. Near each chip, voltage regulator modules (VRMs) step that down again to around 1 V at currents that can exceed a thousand amps for a large GPU. Modern PSUs are remarkably good at this, with the best rated 80 Plus Titanium, wasting only a few percent as heat.

Servers carry two PSUs, each plugged into a different power feed, called A side and B side. Either supply alone can run the machine. This is the last link of the 2N redundancy pattern: if a UPS, a busway or a whole distribution path fails anywhere upstream, the server never notices, because the other side keeps feeding it. When you see two cords per server in a data hall photo, you are looking at the visible end of the facility's entire redundancy philosophy.
