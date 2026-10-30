---
id: d5fd19e8-95b9-43f4-be11-6c4f352533f5
position: 6
title: Why layers instead of one gate
archived: false
---
A single strong gate has a single point of failure: whatever the gatekeeper is bad at seeing walks straight through. The Anthropic design accepts that every layer catches some problems and misses others. Verification catches code that never worked. CI catches breakage across platforms. The AI review catches bugs in logic the tests do not cover. Security review catches vulnerabilities. Human approval catches changes that should not exist.

Few problems get through all of them, and rollback handles the rest. The depth of the stack is what allows each individual layer to be fast and mostly automated. Later lessons return to this idea with the team's own diagram of the layers, and with the evidence that fewer problems escape as each layer improved. When you design your own process, ask of each layer what it catches that no other layer does.
