---
id: 590218de-7c8b-4046-af8d-05d9141cec8e
position: 5
title: Why files matter
archived: false
---


Treating the harness as files buys three properties engineers rely on. First, diffability: a candidate improvement is a textual change you can read line by line before trusting it. Second, versioning: every adopted harness can be stored as a fixed snapshot, so "which configuration produced this answer?" always has an answer. Third, reversal: if a change hurts, restoring the previous harness means restoring the previous files.

These properties sound mundane, but they are what separate engineering from alchemy. The paper's whole pipeline, proposing candidate harnesses, running them, comparing behavior and composing a successor, depends on candidates being concrete objects that can be executed, compared and stored. It is the same reason software teams keep code in version control: a change you cannot see, name or undo is a change you cannot manage.
