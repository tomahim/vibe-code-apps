---
id: 4fca089f-afed-41cb-9aff-0c5dc5209cd3
position: 3
title: "Learn from demonstrations"
archived: false
---
Example answers can show a model what following an instruction looks like. This is a different training signal from ordinary next-token prediction.

A demonstration might pair “Summarize this paragraph in one sentence” with a concise example summary. Training on such pairs shows the model the desired input-output pattern. This is more direct than merely showing webpages that happen to contain summaries. The example can teach format, tone, and task completion, but it may not cover every future request. Evaluation still matters: the model could learn to sound like the examples while omitting an important fact from a new paragraph. The model still has to apply that pattern to unfamiliar text.
