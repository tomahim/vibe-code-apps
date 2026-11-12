---
id: bf8a5991-41f5-4f84-9686-f4cd312f109c
position: 7
title: More than a chat transcript
archived: false
---


It is tempting to compare the library to simply appending every conversation into a long-term memory store. The Medium article draws the distinction: the library is more controlled. It captures which harness modifications were adopted and the observed reasons for those decisions, structured as situation, lesson and evidence. A raw transcript buries that signal under thousands of tokens of irrelevant reasoning.

The paper adds two discipline points. Each domain processes its tasks in order, so later tasks can access earlier experience without ever reading future results, keeping the online setting honest. And the library is per-domain: legal experience and office-work experience live in separate shelves. The paper's future-work section admits the library is still simple, an indexed store, and imagines consolidating overlapping components, revising outdated experience and refining retrieval as it grows. [Further reading: section 2.3 of the [paper](https://arxiv.org/abs/2610.14224) defines the library update formally.]
