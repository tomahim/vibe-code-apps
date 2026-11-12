---
id: 406df5f8-e847-4495-9e3d-5a16e23c13dd
position: 4
title: Always-on and on-demand parts
archived: false
---


The eight components split into two rhythms. Four are always-on: the system prompt, guardrails, memory and tool guidance are injected into the model's context on every call, so they shape every decision but also spend context budget continuously. The other four are on-demand: skills load through a skill tool when relevant, scripts run through the shell when invoked, subagents spin up through a task tool, and plugins hook each tool call from outside the model's discretion.

This split is the first thing a harness designer reasons about. Put a rule in an always-on file and it applies everywhere, including tasks where it is useless noise. Put a procedure in a skill and it costs nothing until the trigger fires, but then the agent must recognize when to load it. Many of the improvements Harness² discovers are exactly this kind of placement decision: moving a narrow procedure out of the bloated prompt and into an on-demand component.
