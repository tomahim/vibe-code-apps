---
id: a50d6c60-57fb-4500-a7df-00e9bec5809f
position: 4
title: Measuring noise, not just recall
archived: false
---
Catching more known bugs is only half the scorecard, because it is easy to catch more bugs if you do not mind flagging a lot of non-bugs. The team measures noise by watching what people do with the reviewer's comments.

Every comment gets sorted by how the person on the pull request responded: they fixed it, said it was wrong, said the behavior was intentional, or decided it did not matter. The team also runs the reviewer on pull requests known to be clean and counts how often it reports something that would have led someone to make a harmful change. Their written priority puts catching real bugs first and cutting review rounds second. A reviewer that aces the incident eval but buries authors in false alarms fails this second test, because noise taxes the exact human attention the system exists to protect.
