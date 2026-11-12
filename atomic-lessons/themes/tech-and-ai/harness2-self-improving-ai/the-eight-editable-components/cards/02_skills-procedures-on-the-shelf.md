---
id: 8f2c7d58-0024-4c28-b0a7-a02dc606191a
position: 2
title: 'Skills: procedures on the shelf'
archived: false
---


A skill is a reusable, multi-step procedure stored as a file (skills/<name>/SKILL.md) and loaded only when relevant. Think of it as a recipe card on a shelf: it costs no context while it sits there, and when the agent recognizes the right situation, it pulls the card down and follows it. A skill for reconciling spreadsheet figures, for triaging deployment logs, or for checking a legal memo's citations are typical examples.

Skills shine when a workflow is narrow, repeatable and worth getting right every time. Their weakness is triggering: the agent must notice that this task is the one the skill was written for. That is why the paper's guidance says to name the trigger in the always-on text: a short pointer like "for spreadsheet reconciliation, load the reconciliation skill" connects the cheap always-on layer to the detailed on-demand procedure. Harness²'s case study used exactly a domain skill for reconciliation mechanics.
