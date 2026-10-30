---
id: 060dffcf-8388-4f7f-919c-cd40b7ba3b57
position: 3
title: Flags ship the code, not the behavior
archived: false
---
New behavior usually ships behind a feature flag, which separates deploying code from releasing behavior. The code can ride the normal release train while the behavior stays dark until someone flips the switch.

The first audience is Anthropic employees. Their heavy internal use of Claude Code means regressions often surface inside the company before any external user hits them, effectively donating a large, forgiving test population to every change. Flags also change the economics of mistakes: turning a bad behavior off takes seconds and needs no deploy, no rollback build, and no heroics. That speed is exactly what lets the layers above carry less weight. A bug caught behind a flag is a data point, not an incident, and the incident count is the guardrail the whole system answers to.
