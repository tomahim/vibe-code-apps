---
id: 128d6582-e312-4a25-8eea-9341ab1bae9f
position: 7
title: 3 key learnings
archived: false
---
Approval scales by risk. Low-risk changes like docs and flagged features need no human once automated checks are green; medium changes like ordinary product work and sensitive areas need one person; the highest-risk code and protected paths need two.

The change sets the tier, not the author. A classifier reads the change, a second classifier asks whether this specific change needs a person anyway, and sensitive paths plus CI workflow files always need one. Only trusted authors use the lighter paths.

An agent's approval never counts as a person's, and whoever prompted an agent-written change counts as a required reviewer themselves. An approval covers one specific commit: an agent's push or a hand-resolved merge resets it. Write tiers down, start strict, and loosen with evidence.
