---
id: ab395782-05ba-461b-814c-7d14e8cd6739
position: 5
title: Noise costs more when the author is an agent
archived: false
---
There is a wrinkle that makes reviewer noise unusually expensive on this team: the author is often an agent too. A person can wave off a nit in seconds. An agent fixes it, which means another commit, another round of review, and another chance to break something while chasing something harmless.

This asymmetry raises the value of the precision filters from the earlier lesson on AI review. Dropping style-only findings is not just courtesy to human readers; it prevents agent authors from burning compute and review rounds on non-problems. It also explains the round caps and re-review rules covered in the next lesson. When both sides of the conversation are machines, every unnecessary comment multiplies into machine work, so the team tunes the reviewer's noise floor with the same care as its bug-catching recall.
