---
id: 80f2c47c-b498-4c13-ac6b-1bb9a0743d14
position: 3
title: Risky code and pattern-setting architecture
archived: false
---
The second and third human jobs are about where mistakes compound. People still review the risky code directly: billing, the auto-updater, CI workflows, the places where a bug is expensive, wide-reaching, or hard to undo.

People also review architecture that sets a pattern others will copy. A new abstraction, a new service boundary, a new convention: these diffs matter less for what they do today than for the hundred imitations they invite. An automated reviewer can check whether the code works; judging whether the pattern is worth copying is a taste call with long consequences. Both of these reviews share a shape: the cost of being wrong is large and delayed, which is precisely the case where upfront human judgment beats fast automated approval.
