---
id: 3c537408-ee2f-4356-bfb2-fa38a63b7136
position: 4
title: 'Power: volts times amps'
image: power-triangle.png
image_alt: 'Diagram of the power triangle: power in watts equals voltage in volts multiplied by current in amps, with the
  three rearrangements shown.'
image_caption: 'One relation to remember: watts = volts x amps.'
image_license: original
archived: false
---

Power, measured in watts (W), is the rate at which electrical energy is delivered or consumed. The relationship is beautifully simple: power equals voltage times current (P = V x I). A server supply drawing 230 V at 10 A delivers 2,300 W, or 2.3 kW.

This relation is the data center designer's daily arithmetic. If a rack must deliver 100 kW and the distribution runs at 415 V, the circuit must carry about 240 A, which dictates cable thickness, breaker ratings and connector types. Raise the voltage and the same power needs less current, thinner copper and less cooling of the wiring itself. That is why the industry keeps pushing distribution voltages upward, and why some operators now feed racks with higher-voltage DC. Every capacity figure in this course, from a 700 W GPU to a 300 MW campus, is a power figure computed from this same multiplication.
