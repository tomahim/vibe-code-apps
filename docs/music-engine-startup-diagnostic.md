# Music engine startup: November13,2026

Thomas confirmed real-device audio works on the private HTTPS endpoint, but
engine loading is slow. No measured device timings or its network profile yet.
Do not equate the following controlled experiment with his exact latency.

## Evidence

Production build from master31b993b2, local Chromium, cold new browser context:
- Local transfer: first Play to Stop-button readiness891ms; same-tab replay35ms.
- Synthetic150ms RTT /1Mbps download: first Play23862ms; WASM transfer21867ms.
- Same synthetic conditions with gzip server: first Play10455ms; WASM8856ms.
- Same-tab replay stays35ms. Readiness is not first audible sample; scores have
  deliberate fades and a scheduler delay. No live-device speedup promised.
- WASM raw2711992 bytes, gzip6 about1078934 bytes (about60% less). Synthdefs
  start only after engine init and add further requests. Palette is18 definitions,
  loaded concurrently by the library. No evidence they are fetched sequentially.

Live music relay GET on November13 at17:19:43Z with Accept-Encoding:gzip:
200/application-wasm, Content-Length2711992, noContent-Encoding, downloaded
2711992 bytes with rawWASM magic0061736d. Probe file removed. Earlier HEAD
alone was insufficient and was explicitly qualified before thisGET confirmation.
Relay probe bypasses the tailnet transport; full-device transport and first sound
remain unmeasured. UI wasSleeping while ingress wasOnline. UI waking can affect
first-page time, distinct from engine startup after page has loaded.

## Narrow change

Only /supersonic/ vendored public engine assets get gzip6 when accepted. Binary
WASM and synthdefs explicitly eligible; no personalized API/admin compression,
no cache persistence policy, no new resources, no router/ingress changes. Missing
engine paths return404 instead of SPA HTML. Identity clients and byte ranges
retain original delivery. Existing fixed-path assets are not marked immutable.
This adds some compression CPU on requests, not a new subscription or service.

CI exercises actual nginx HTTPGET gzip negotiation and checks decoded byte
identity, transfer size, WASM MIME, Vary, identity/gzip-refused fallback, ranges,
missing404 and unchanged health. This is not end-to-end tailnet playback proof.

After approval/normal UI deployment, repeatGET through the relay and actual
browser cold/reload/replay tests. Confirm first sound on Thomas's device, no
API/admin regressions. Existing secure-context/audio smoke test should remain
green. Rollback this nginx change only if needed. Do not increase paid compute,
disable UI sleeping or change Tailscale policy to address this without evidence.
