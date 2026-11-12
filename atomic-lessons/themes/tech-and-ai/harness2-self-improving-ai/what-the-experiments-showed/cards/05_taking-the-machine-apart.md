---
id: 13165703-5823-4ad2-81d6-c99d67b0b5b3
position: 5
title: Taking the machine apart
archived: false
---


Ablation experiments remove one component at a time to see what actually earns its keep. Removing the library, so no task benefits from what earlier ones tried, costs 3.1 points on WorkBuddy-Bench and 1.8 on JobBench. Removing the scoped editor roles, replacing the invariant and domain editors with two generic ones drafting from the same evidence under the same budget, costs 2.9 and 3.7. Removing composition, probing both candidates and simply keeping the better one, costs 1.6 and 1.9.

Every part contributes, and the sizes are informative. Scoping matters most on JobBench's long professional tasks, where separating cross-domain procedure from domain knowledge is hardest and most valuable. The library matters most on WorkBuddy-Bench, whose domains reward reusable procedure. Composition's smaller but consistent cost confirms that treating proposals as parts to assemble beats treating them as alternatives to rank. Design decisions in Harness² are not aesthetic; each one is priced in points.
