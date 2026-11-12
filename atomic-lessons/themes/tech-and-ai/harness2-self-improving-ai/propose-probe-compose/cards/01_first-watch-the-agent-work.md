---
id: b87824b9-0065-47f9-9770-7f7ff1cfeaed
position: 1
title: First, watch the agent work
archived: false
---


Every improvement starts with observation. The pipeline runs the current harness on the task and records a reference execution: the full trajectory of reasoning, tool calls and outputs, plus the final deliverable. The paper is careful about what this reference means. It reveals how the harness behaves, not whether its deliverable is correct. In the open world, nobody knows the right answer; but everyone can see that the agent never opened the configuration file, or never checked its own output.

This evidence-first posture is what makes the rest possible. Instead of asking "did we get the right answer?", which has no referee, the system asks "what did the agent actually do, and where did the procedure go wrong?" The trip planner that never checks opening hours before booking, the analyst who never reconciles figures across files: these are observable procedural facts, and they are enough to aim an improvement at.
