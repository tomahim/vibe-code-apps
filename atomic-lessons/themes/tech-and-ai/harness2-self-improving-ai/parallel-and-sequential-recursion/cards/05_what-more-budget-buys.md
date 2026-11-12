---
id: 8c5cb9c0-dea4-49bf-90e1-6b874b7620c3
position: 5
title: What more budget buys
archived: false
---


The scaling results are encouragingly monotone: on WorkBuddy-Bench, both recursion forms keep improving as k grows from 1 to 5. Parallel recursion rose from 76.5 to 80.8 on the Code domain and from 79.5 to 83.4 on Office. The comparison baselines did not scale this way: Harness Scaling actually regressed between k=2 and k=3 on both domains, and ReasoningBank fluctuated without a trend.

Two findings stand out. First, both recursive forms of Harness² at k=2 already outperformed every plotted baseline running at k=5: refinement quality beat raw quantity of exploration. Second, increasing test-time exploration alone, through best-of-k base attempts or the stateless per-task revision baseline, did not produce the same consistent gains. The improvement comes from recursive refinement of the harness itself, not from simply sampling more answers.
