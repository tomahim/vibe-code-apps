---
id: 74c0abc7-6c9d-456f-9d65-eee0928dd14d
position: 3
title: 'The automated floor: CI'
archived: false
---
Underneath the intelligent reviewers sits the unglamorous floor: lint, type checks, tests on every platform, and a build. A typical CLI pull request may run dozens of these checks before anyone looks at it. The team has written separately about scaling CI for this volume, which tells you the floor itself is an engineering problem at their change rate.

The floor's job is to catch the mechanical failures so the intelligent layers never waste attention on them. A type error or a broken Windows test needs no reasoning to find, only execution. Red blocks the merge, full stop. This is also the cheapest layer per problem caught, which is why it runs first and runs on everything. When you design a pipeline, the same ordering logic applies: run the cheap deterministic checks before the expensive probabilistic ones.
