---
id: e05e453b-83fb-4328-94b5-c3a33616387c
position: 5
title: 'Plugins: hooks outside the model''s discretion'
archived: false
---


A plugin is middleware: TypeScript code that hooks every tool call, acting whether or not the model remembers to ask for it. That "outside the model's discretion" property is what makes plugins special. Prompts and skills rely on the model choosing to follow them; a plugin simply fires. The paper's example is a hook that prevents the agent from exiting before a deliverable file exists, a mechanical completion check no amount of prompting guarantees.

Because plugins are powerful, the paper treats them as a last resort. Its editor guidance says only repeated evidence that clear prose is being skipped can justify a defensive hook, and the hook must never block valid completion. Plugins also change runtime behavior in ways a read-through of the prompt will not reveal, so they deserve extra review. The principle: use the lightest component that reliably fixes the observed problem.
