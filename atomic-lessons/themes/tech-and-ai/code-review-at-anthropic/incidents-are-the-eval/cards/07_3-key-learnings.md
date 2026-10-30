---
id: 47514d99-cfae-4aff-b5ff-9e69416aa610
position: 7
title: 3 key learnings
archived: false
---
Incidents and reverts become an eval set. The team collected past pull requests that caused incidents, with their fix-forwards and reverts, and engineers who know the code confirmed each bug and where it lived.

Every change to the reviewer, its prompts, tools, or model, is scored daily against the whole set. If the score went up they keep the change; if not, they drop it. The set grows with every incident, so the reviewer's hardest exam is always its own worst history.

Recall is only half the scorecard. The team measures noise by how people respond to comments and by running the reviewer on known-clean pull requests. Noise matters even more when the author is an agent, because a person waves off a nit in seconds while an agent burns a whole review round fixing it.
