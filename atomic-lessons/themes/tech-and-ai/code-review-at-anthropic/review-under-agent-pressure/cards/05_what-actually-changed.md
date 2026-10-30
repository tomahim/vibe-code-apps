---
id: ba58d148-5591-4d06-bc4b-0b0a694373b9
position: 5
title: What actually changed
archived: false
---
The team is careful to say they did not remove review. They did three things instead. First, they moved most of the reading to machines, because machines can read every line of every diff without fatigue. Second, they optimized for human time and attention, treating those as the scarce resources the whole system should protect.

Third, they invested heavily in making mistakes fast and easy to undo: feature flags that turn off without a deploy, a merge queue that retests everything, staged releases, and quick reverts. This last investment is what makes the first two safe. If catching a problem late costs minutes instead of days, you can afford to let low-risk changes through with less human reading. Speed of recovery substitutes for depth of upfront inspection on the changes where that trade is worth it.
