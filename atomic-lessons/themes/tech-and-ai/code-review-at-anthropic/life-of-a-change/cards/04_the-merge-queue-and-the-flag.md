---
id: 9b454fd1-5591-4a4e-8d0b-7532ceda8e0b
position: 4
title: The merge queue and the flag
archived: false
---
Passing every gate is still not the end. The merge queue re-runs the full check suite against the latest main with the change applied, because two pull requests that each pass alone can combine into a broken main. Only then does the change land.

New behavior usually ships behind a feature flag, and it goes to Anthropic employees first. Their heavy internal use often surfaces regressions before any external user would. Public release is gradual too: the latest channel gets the build first, and the stable channel trails behind it. Each step is another chance to catch a problem with a small blast radius, so that by the time a change reaches every user it has already survived contact with thousands of real workflows.
