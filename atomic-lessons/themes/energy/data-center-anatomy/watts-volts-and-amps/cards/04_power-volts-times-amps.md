---
id: 3c537408-ee2f-4356-bfb2-fa38a63b7136
position: 4
title: Power equations depend on the circuit
image: power-triangle.png
image_alt: Three rows distinguish DC P=VI, single-phase AC P=VI times power factor, and balanced three-phase AC
  P=sqrt(3) times line-to-line voltage times current times power factor.
image_caption: Use the power equation that matches the circuit and phase arrangement.
image_license: original
archived: false
---


Power, measured in watts (W), is the rate at which electrical energy is delivered or consumed. For DC, power equals voltage times current (P = V x I). For single-phase AC, real power also includes power factor: P = V x I x PF, using RMS values. A 230 V input drawing 10 A at unity power factor consumes 2,300 W, or 2.3 kW; the power delivered after conversion is slightly lower.

This relation is the data center designer's daily arithmetic. For a balanced three-phase feed, P = square root of 3 x line-to-line voltage x line current x PF. A 100 kW rack on 415 V three-phase at unity power factor therefore draws about 139 A per line, which dictates cable thickness, breaker ratings and connector types. Raise the voltage and the same power needs less current, thinner copper and less cooling of the wiring itself. That is why the industry keeps pushing distribution voltages upward, and why some operators now feed racks with higher-voltage DC. The simple DC equation builds intuition; three-phase AC calculations must include their phase arrangement and power factor. Do not use DC arithmetic to size an actual rack circuit.
