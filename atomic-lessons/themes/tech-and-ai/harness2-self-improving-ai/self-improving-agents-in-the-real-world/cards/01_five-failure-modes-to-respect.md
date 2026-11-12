---
id: 7efbf1e3-135a-4a34-9ec0-1aea4759f9af
position: 1
title: Five failure modes to respect
archived: false
---


The Medium article lists five failure modes any serious user of harness adaptation should know by name. Selection error: the framework picks a wrong result because it looks convincing. Experience contamination: a lesson inferred from limited evidence gets generalized too broadly to future tasks. Harness complexity growth: each iteration adds instructions, scripts and plugins without removing obsolete ones, until the harness is an unmaintainable pile.

Optimization overhead: the cost of many candidate runs outweighs the value of the improvement, especially for rare or cheap tasks. Security regression: a modified script, skill or plugin introduces undesirable actions even though the task output looks better. None of these is hypothetical, and none is fully solved by the research framework. A rigorous implementation, the article insists, must measure these risks separately rather than assuming better benchmark behavior implies better overall system behavior.
