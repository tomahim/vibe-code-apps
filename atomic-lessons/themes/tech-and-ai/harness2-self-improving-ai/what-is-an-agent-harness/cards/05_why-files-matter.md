---
id: 590218de-7c8b-4046-af8d-05d9141cec8e
position: 5
title: Why files matter
archived: false
---


Treating the harness as files buys three properties engineers rely on. First, diffability: a candidate improvement is a textual change you can read line by line before trusting it. Second, versioning: every adopted harness can be stored immutably, so "which configuration produced this answer?" always has an answer. Third, reversal: if a change hurts, restoring the previous harness is restoring the previous files.

These properties sound mundane, but they are what separate engineering from alchemy. The paper's whole pipeline, proposing candidate harnesses, running them, comparing behavior and composing a successor, depends on candidates being concrete objects that can be executed, compared and stored. The Medium article draws the production conclusion: candidate harnesses should be treated like software releases, with validation, staged rollout and instant rollback to a previous immutable version.
