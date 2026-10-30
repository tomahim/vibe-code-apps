---
id: 3b010dfa-30eb-43dd-9d44-5fb13977c345
position: 6
title: Circuit breakers are still missing
archived: false
---
The team is unusually candid about the limits of this layer. They do not yet have circuit breakers that automatically tighten approval requirements when revert and incident numbers move, and engineers at Anthropic want those circuit breakers before more code moves to zero-human merges.

That sequencing is the lesson. Automation earns scope by proving itself against the guardrail, and the team refuses to grant zero-human paths more territory until the feedback loop that would catch a drift is built. It is easy to read the whole system as a triumph of automation and miss that its boundaries are set by skepticism. For your own adoption, the equivalent rule is simple: widen automation only as fast as your detection improves, and treat a missing alarm as a reason to hold the line, not as permission to advance.
