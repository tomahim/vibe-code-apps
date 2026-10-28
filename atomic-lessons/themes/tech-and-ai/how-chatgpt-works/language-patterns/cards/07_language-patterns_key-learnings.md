---
id: 3be9d648-b0ae-4170-9687-ebed8f88a1f0
position: 7
title: "3 key learnings"
archived: false
---
**1. Simple counts miss dependence.** The letter u is especially likely after q, a fact hidden by a table of overall letter frequencies. The next symbol depends on what has already appeared.

**2. N-grams add local context.** Counting pairs or triples makes generated text more realistic than drawing each letter or word independently. “Coffee cup” has a relationship that separate counts for “coffee” and “cup” cannot capture.

**3. Exact counting eventually runs out.** Long word sequences multiply so quickly that most possible phrases are never observed. A useful language model must estimate beyond the combinations it has counted directly. This is why the essay turns from direct counting to a learned model.
