---
id: 0b095403-2c5a-4008-9299-a9d0b2a4aa5c
position: 6
title: No stronger editor needed
archived: false
---


A natural suspicion: maybe the gains come from the editor, Claude Opus 4.8, being smarter than the executors it improves. The paper tests this by making the same model play both roles, editor and executor, at k=2. All five models tested, from GLM-5 up to Claude Opus 5, improve on every benchmark under this self-editing setup. Opus 5 gains 3.3, 5.5 and 3.0 points on WorkBuddy-Bench, JobBench and LAB; GLM-5 gains a remarkable 13.7 points on LAB.

This result matters beyond the numbers. If harness refinement required a stronger external editor, the method would be a fancy distillation trick. Self-editing gains show the framework supplies something else: a structured way to turn a model's own execution evidence into harness improvements. The intelligence was already in the model; the contrastive process is what organizes it into better scaffolding.
