---
id: a56b275f-d66d-4f56-bc0f-1c7d518311f3
position: 3
title: Organizational failures, not intellectual ones
archived: false
---


Watch a failing agent closely and a pattern appears. It reads too much irrelevant information and drowns its own context window. It picks the wrong tool for the job, or calls the right tool with the wrong arguments. It runs tests in an unhelpful order, burns its step budget early, or forgets a constraint it discovered twenty minutes ago. The Medium article's enterprise example is an engineering assistant investigating a failed deployment: it has repository search, shell access, monitoring APIs and logs, yet still fails for purely procedural reasons.

The tempting response is to reach for a bigger model. Sometimes that helps. But the Harness² paper argues these are failures of organization, not cognition. If the agent's instructions never say "check the deployment configuration before the application logs," no amount of extra reasoning power guarantees it will look there. The leverage sits in how the work is organized, and that organization lives in the harness, not in the model's weights.
