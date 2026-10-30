---
id: 1912d890-b9f9-4d75-9ca4-743b82560158
position: 3
title: Parallel hunters, voting verifiers
archived: false
---
Findings are not posted the moment an agent raises them. Several agents look for bugs at the same time, each hunting in parallel. Then a separate group of verifier agents votes on each finding, and it only gets posted if enough of them agree it is real.

This two-stage design fights the failure mode of a single confident model: a plausible-sounding but wrong bug report that sends the author chasing a ghost. Voting filters those out before a human ever sees them. Findings that are only about style, diagnostics, or cleanup get dropped entirely. The team A/B tested those filters on their own pull requests before keeping them, which is the same evidence-first discipline they apply to code changes. The goal of the whole pipeline is a short list of comments worth a person's attention.
