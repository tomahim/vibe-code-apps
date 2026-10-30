---
id: ec268960-7080-4598-9e51-66c0303eaf04
position: 3
title: Scoring every change against all of it
archived: false
---
The eval's purpose is to grade changes to the reviewer itself. Whenever the team changes the reviewer's prompts, tools, or model, the new version runs against the entire set of past cases, daily in their loop, and the score answers a simple question: did it catch more of the bugs we know about?

Score went up? Keep the change. If not, drop it. That discipline converts reviewer development from opinion into measurement. A prompt rewrite that sounds better but lets a known incident slip through is a regression, full stop. The loop never ends, because the set keeps growing with each new incident and the reviewer keeps changing. Every proposed improvement is scored against all of history, not just the failures fresh in someone's memory, which protects the team from fixing last month's bug while re-opening last year's.
