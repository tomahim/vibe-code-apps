---
id: b231e955-eb06-4b7d-8936-7529d2d75f10
position: 1
title: The four always-on text files
archived: false
---


Four components are plain text, present in every model call. The system prompt states the agent's responsibilities and operating procedure: who it is, how it should approach work. Guardrails are standing rules and constraints that should never be overridden, such as "never run destructive commands without confirmation." Memory holds persistent facts that may matter later, from user preferences to lessons from past incidents. Tool guidance describes which tools exist and, critically, when and how to pick each one.

Because all four ride along on every call, they are the highest-leverage and the highest-cost components. A single crisp sentence in tool guidance can stop a whole class of wrong-tool choices; a rambling page of it dilutes attention and burns context. The paper's editor prompt captures the spirit: prefer concise always-on guidance, and do not automate professional judgment or encode one-off mistakes as permanent prose.
