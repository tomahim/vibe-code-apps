---
id: e49ef548-3a53-4164-a229-47a9046d66ae
position: 3
title: 'Scripts: determinism where it counts'
archived: false
---


Scripts are ordinary programs, typically Python, that the agent runs through the shell. Their superpower is determinism: a script does the same thing every time and can be trusted with operations where "usually right" is not good enough. Suppose an agent keeps misadding invoice lines or mixing up date arithmetic. Rather than trusting free-form text generation for that work, hand the calculation to a small script and let the model interpret the result.

The paper's own case study shows scripts as verification: an inspect_inputs.py that dumps every supplied file in one pass, and a verify_outputs.py that reopens produced files to confirm they are correct, because "a successful write call does not establish usability." Scripts do add maintenance and safety responsibilities, since generated code must be reviewed and sandboxed. But for mechanical repetition, checking and extraction, they are often the smallest reliable fix.
