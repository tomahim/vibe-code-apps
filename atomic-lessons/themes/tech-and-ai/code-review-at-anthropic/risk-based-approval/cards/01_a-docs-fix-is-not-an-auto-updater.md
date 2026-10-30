---
id: f6f272cd-3eee-499e-8ad6-17f0d2392211
position: 1
title: A docs fix is not an auto-updater
archived: false
---
A docs fix and an auto-updater change carry completely different risk, so on the Claude Code team they get completely different review. That sentence sounds obvious, yet most review processes treat every pull request identically: same approvers, same checklist, same wait.

Risk-based approval turns the difference into a system with three tiers. Low-risk changes, like docs, copy, internal-only features, and additive changes behind a flag, need no human approval once automated review and security checks are green. Medium-risk changes, ordinary product work plus sensitive areas like caching, the auto-updater, or system prompts, need one person. High-risk changes, the highest-risk code plus a small set of protected paths, need two people. The rest of this lesson covers how the tier is chosen and who is allowed on the lighter paths.
