---
id: 9facd0be-f69f-4918-adcb-696bb403818b
position: 7
title: A worked miniature
archived: false
---


Put it together with a small invented example, a trip-planning agent. Reference run: the agent books a museum visit without ever checking opening hours, and the day's plan breaks. Propose: the invariant candidate adds a completion rule, "verify every booking against the venue's opening hours before finalizing," while the domain candidate adds a time-zone conversion script and a skill for this city's transit rules. Probe: both candidates run the same planning task; the first now checks hours before booking, the second converts times correctly but still skips one venue.

Compose: the successor merges the hours-check rule (strong contrast: the broken booking disappeared) with the conversion script (helpful) and drops the redundant skill edit that caused the missed venue. The composed harness runs once more, and its record, with all decisions and evidence, is stored. No human judged the final itinerary; behavioral contrasts, observed procedurally, guided every choice. [Further reading: section 2.2 of the [paper](https://arxiv.org/abs/2610.14224) formalizes this step. The trip planner is an illustration made up for this lesson, not an experiment from the paper.]
