---
id: 85bd69e7-a750-4f54-9b16-be1ae4d5da25
position: 4
title: 'Subagents: bounded delegation'
archived: false
---


A subagent is a specialist the main agent can delegate to: a separate agent context with its own instructions, invoked through a task tool. Its value is isolation. A bounded investigation, say "find every place this configuration key is read," can fill tens of thousands of tokens with search results. Done in the main context, that noise crowds out the actual task. Delegated to a subagent, only the concise conclusion comes back.

The trade-offs are real: subagents add latency and model cost, and a poorly scoped delegation just moves the confusion elsewhere. The Medium article's rule of thumb is to delegate when the side-quest is bounded and its result is small. If the subagent's findings are the main deliverable, isolation gains nothing. Used well, delegation is how a harness keeps the main agent's context clean enough to think.
