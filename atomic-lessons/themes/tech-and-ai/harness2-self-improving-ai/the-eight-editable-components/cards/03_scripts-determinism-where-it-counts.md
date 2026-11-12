---
id: e49ef548-3a53-4164-a229-47a9046d66ae
position: 3
title: 'Scripts: determinism where it counts'
archived: false
---


Scripts are ordinary programs, typically Python, that the agent runs through the shell. Their superpower is determinism: a script does the same thing every time and can be trusted with operations where "usually right" is not good enough. The Medium article's example is financial totals: rather than trusting probabilistic text generation for arithmetic, hand the calculation to a Decimal-based script and let the model interpret results.

The paper's own case study shows scripts as verification: an inspect_inputs.py that dumps every supplied file in one pass, and a verify_outputs.py that reopens produced files to confirm they are correct, because "a successful write call does not establish usability." Scripts do add maintenance and security responsibilities, since generated code must be reviewed and sandboxed. But for mechanical repetition, checking and extraction, they are often the smallest reliable fix.
