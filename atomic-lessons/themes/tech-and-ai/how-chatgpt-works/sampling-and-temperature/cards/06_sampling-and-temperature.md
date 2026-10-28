---
id: 775bfc18-af6a-4d07-b35b-2d9b46af3ac8
position: 6
title: "Try the same prompt twice"
archived: false
---
Two runs can diverge because early token choices affect later probabilities. Different wording does not necessarily mean the model learned between runs.

Run “Write a one-sentence story about a lighthouse” twice with sampling enabled. One answer might feature a keeper, another a ship. The first selected words change the context seen on later steps, so small differences can grow. The model has not learned a new fact merely because the second run differs; its weights generally remain the same during these requests. If exact repeatability matters, decoding settings and the surrounding system must support it. Even then, identical wording is separate from factual reliability.
