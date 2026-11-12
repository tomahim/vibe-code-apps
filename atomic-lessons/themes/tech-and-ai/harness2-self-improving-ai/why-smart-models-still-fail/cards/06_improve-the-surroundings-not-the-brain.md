---
id: daeb2b70-adc1-4985-8a21-2bf806914b04
position: 6
title: Improve the surroundings, not the brain
archived: false
---


Harness² (read "Harness Squared") comes from researchers at Northwestern University and Google Cloud AI Research, in a paper published in October 2026. Its central move is to leave the model's weights completely frozen and instead improve the operational system around the model, using evidence from the agent's own executions. No fine-tuning, no retraining, no new model: the same brain, given a better workplace that improves itself.

The framework is "plug-and-play": it wraps around existing agent setups (the paper tests it on the off-the-shelf OpenCode and Codex harnesses) rather than replacing them. It works through two connected kinds of recursion. Task-level recursion improves the harness for the task in front of the agent right now. Harnessing-level recursion keeps the lessons from that process so the agent gets better at improving itself on future tasks. The next lessons unpack both, in plain language, one mechanism at a time.
