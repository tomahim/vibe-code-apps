---
id: 37861c2d-657d-44b2-aac9-51c5d937f203
position: 3
title: "How it spread, at a conceptual level"
archived: false
---
The worm used several independent weaknesses instead of one. It abused a debugging feature left enabled in a widely used mail program, a memory-handling bug in the finger service, and password guessing (the encrypted passwords sat in a readable file) combined with trust relationships between machines. When one route was closed on a host, another could still work.

The program also tried to hide itself and to avoid being counted twice. Eugene Spafford's 1989 analysis reports that it checked whether a machine was already infected, but a random decision could override the answer. That rule became the flaw: machines were reinfected again and again, loaded with many copies, and ground to a halt. The damage came mostly from this runaway replication, not from deleted files.
