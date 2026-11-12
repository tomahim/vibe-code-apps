---
id: c3c6ea6c-36d7-4247-a2a4-2ef8a82ffdad
position: 6
title: Not just prompt templates
archived: false
---


It is tempting to hear "editable files" and picture a pile of prompt templates. The harness is more than that. A script is deterministic Python that validates a calculation or checks a produced file, running exactly the same way every time. A subagent is a separate agent context that can isolate a bounded investigation and return only its conclusion. A plugin is middleware that hooks every tool call, outside the model's discretion, for example to refuse an exit before a deliverable exists.

This range is the point. Different weaknesses need different kinds of fixes. If an agent keeps botching financial totals, another paragraph pleading "calculate carefully" is fragile; a Decimal-based checking script is robust, because it moves a verifiable computation from probabilistic text generation into deterministic code. Because harness changes can alter execution behavior this deeply, improving the harness is a real engineering act, not prompt decoration.
