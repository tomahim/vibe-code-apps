---
id: fa6da064-61bb-4672-a38a-d6dee7c29fdf
position: 4
title: The PR template asks about undo
archived: false
---
The pull request template asks two questions that reveal the team's philosophy: how was the change tested, and how do you undo it. The first forces the verification habit from the earlier lesson into the open; the second forces the author to think about rollback before it is needed.

Claude can fill the template in, but the person who asked for the change signs off on it. That split is a small example of a rule that runs through the whole system: agents can draft the evidence, but a person owns its accuracy. An undo plan written before merge is worth far more than one improvised during an incident, because the honest answer might be “this migration is hard to reverse”, which should raise the review tier before the change lands rather than after it breaks.
