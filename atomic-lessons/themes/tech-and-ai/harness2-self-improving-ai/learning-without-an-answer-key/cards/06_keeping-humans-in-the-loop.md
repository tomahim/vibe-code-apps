---
id: 02f10dc7-dd73-4534-b29c-86eee3675f33
position: 6
title: Keeping humans in the loop
archived: false
---


The Medium article draws the production line clearly: the research framework's answer-free selection is not a guarantee, and applications needing high reliability should supplement harness adaptation with independent validation. Concretely that means external validators where they exist, real test results where tests exist, and human review for consequential changes.

The article recommends a full validation and review layer between a composed candidate harness and its adoption: automated checks, representative regression tests, security review and approval gates, with mandatory approval for changes touching production writes, database mutations, payments, deployments or the agent's own enforcement policies. Self-improvement then looks less like an unsupervised agent rewriting itself and more like a disciplined release process that happens to be proposed by a machine.
