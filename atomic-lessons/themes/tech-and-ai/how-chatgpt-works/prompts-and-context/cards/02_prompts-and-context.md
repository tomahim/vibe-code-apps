---
id: 299987be-8554-4dfa-bc23-74b239c906d9
position: 2
title: "A task described once"
archived: false
---
A capable pretrained model may follow a task described in a single prompt. That behavior does not require changing its stored weights during the exchange.

Suppose a prompt defines a new fictional rule: “In this game, blue doors lead north.” A capable model may use that rule when answering a follow-up about a blue door, even though it was not in pretraining. The information is available in the current context. This is different from teaching the model permanently through a weight update. If the rule is removed from the available context, the model may no longer apply it. The success also depends on how complex the rule is and whether the model can track it reliably.
