---
id: 0709020d-56b5-46dc-b0ab-d9d1fd63827f
position: 6
title: Setting your own tiers
archived: false
---
Adopting risk-based approval starts with writing the tiers down. The article's advice is to set tiers from the change rather than the author, start strict, and loosen with evidence. Strict first matters because loosening after a quiet month is defensible, while tightening after an incident feels like punishment and meets resistance.

Use your own blast radius map. At Anthropic, billing, the auto-updater, CI workflows, and system prompts earn extra humans. Your equivalents might be payments, authentication, migrations, or anything with an expensive undo. Then let the guardrail metrics steer: if reverts stay flat after moving a category down a tier, the move was justified; if they twitch, move it back. Risk tiers are a hypothesis about your system, and like every hypothesis in this process, they answer to the revert rate.
