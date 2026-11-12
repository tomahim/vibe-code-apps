---
id: 6ff881aa-8044-4ba2-a87d-e57a5481080d
position: 2
title: A change to the agent is a change to the system
archived: false
---


A self-improving harness can write scripts, hooks and tool instructions, and those shape what the application does next. A new script is executable code. A hook changes what tools do. A skill adds steps and dependencies. So the system is writing part of its own future behavior, and that deserves the same care you would give any code that reaches production, even though the edit looks like a harmless text file.

The rule of thumb that follows is to separate proposing from approving. The model may suggest a change, but something outside the model decides whether it runs. Keep each proposed change as a saved, versioned candidate. Try it first in an isolated environment with minimal permissions. Treat text coming from documents or tool results as data, never as new rules for the agent. These are general safety habits suggested by the paper's design, not results the paper measured.
