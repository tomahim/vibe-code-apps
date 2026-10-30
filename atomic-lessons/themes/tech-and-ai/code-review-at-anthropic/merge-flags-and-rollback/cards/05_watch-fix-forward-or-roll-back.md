---
id: f7572db0-404c-43e5-89c1-265d21baf352
position: 5
title: Watch, fix forward, or roll back
archived: false
---
The last layer starts from humility: some mistakes will still get through everything above it. After release, the author and the on-call engineer watch the change. Claude Code runs a weekly on-call rotation, and noticing a bad merge still depends on people, backed by revert and incident dashboards that make the guardrail metrics visible.

When something breaks, the options are deliberately boring. Flags turn the behavior off quickly without a deploy. Broken builds get reverted. When a fix is small and safe, the team fixes forward instead. Just as important is what happens after the fire is out: incident reviews ask which layer should have caught the issue. That question feeds every other layer, because the answer becomes a new check, a new REVIEW.md line, or a new case in the incident eval set that a later lesson covers.
