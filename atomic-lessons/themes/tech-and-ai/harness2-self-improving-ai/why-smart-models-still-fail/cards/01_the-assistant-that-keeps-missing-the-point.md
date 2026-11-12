---
id: 19d8c915-713c-45e8-a55a-63dbf745c619
position: 1
title: The assistant that keeps missing the point
archived: false
---


Picture a Python debugging assistant. You give a language model access to your source files, a shell and a test runner, then ask it to fix a bug. It reads code, spots an error, edits the file and runs the tests. On good days this feels like magic. On bad days it reads the same irrelevant file five times, ignores the edge case that actually matters, runs the slow test suite when a quick check would do, and proudly produces a fix that breaks something else.

None of these failures are about raw intelligence. The model is perfectly capable of reasoning about the bug. What goes wrong is everything that surrounds that reasoning: which files it is told to look at first, what its instructions say about testing, how much context it is allowed to spend, and what it remembers from the last incident. The Medium article that inspires this path puts it plainly: building the agent is only the beginning. The real engineering starts when the agent meets a problem its original setup was never designed to handle.
