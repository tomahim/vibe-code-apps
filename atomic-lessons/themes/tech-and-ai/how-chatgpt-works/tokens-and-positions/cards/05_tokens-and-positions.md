---
id: c03a2e58-a802-488c-9367-bdce9ee6e949
position: 5
title: "Represent a sequence"
archived: false
---
The model processes a sequence of token representations, not just an isolated last word. Earlier tokens can influence later predictions.

To continue “The keys are on the table because I left them there,” the model can use more than the last word “there.” Earlier tokens establish what “them” refers to and what setting is being described. The input is a sequence of token representations with positions, and later layers combine information across that sequence. There are practical limits to how much context a given system accepts, so an earlier fact may be unavailable if it falls outside the input window. The principle remains that prediction is conditioned on the available context.
