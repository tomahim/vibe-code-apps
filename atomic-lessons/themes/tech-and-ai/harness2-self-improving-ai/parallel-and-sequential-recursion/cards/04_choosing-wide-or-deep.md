---
id: da9c827e-fdf7-4a9a-8234-b0780201d0c0
position: 4
title: Choosing wide or deep
archived: false
---


How should a practitioner pick? Think about the failure structure. If the trajectory suggests several competing explanations, maybe the agent lacks domain knowledge, maybe its completion checking is broken, maybe both, parallel mode tests the hypotheses side by side and lets independent composers assemble the best combination. If the trajectory shows a chain of dependent problems, where you cannot even see problem two until problem one is fixed, sequential mode's step-by-step correction is the natural fit.

The honest caveat is that the paper explores a bounded range, k from 1 to 5, and lists adaptive allocation as future work: ideally the system would spend more on hard tasks and stop when extra probes stop yielding new evidence. Until then, budget and mode are chosen in advance, trading cost against expected gain. The results so far say both modes beat simply spending the same compute on more base-harness attempts.
