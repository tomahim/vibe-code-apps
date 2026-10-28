---
id: 013305fa-35a0-4a64-9650-9e7a2fd9e955
position: 4
title: "Pairs and n-grams"
archived: false
---
An n-gram is a run of n adjacent items, such as letters or words. Counting these runs captures local context that single-item counts miss.

For a two-gram of words, we count pairs such as “coffee cup” or “cup broke.” A three-gram records triples and can distinguish more local situations. These tables improve on treating every word as an isolated draw. But a phrase such as “the old coffee cup” may occur rarely, even when each of its shorter parts is familiar. Increasing n adds context and at the same time creates more combinations to observe. An n-gram model is therefore a useful stepping stone, not a complete account of long-form generation.
