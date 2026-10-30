---
id: 40188d95-bf1f-4d3a-b0d2-d3a12e5a7da7
position: 4
title: CLAUDE.md tells Claude what the project is
archived: false
---
CLAUDE.md describes the project to the agent: the stack, the conventions, the goals, and the non-goals. Every review loads it, which makes it one of the highest-leverage documents in the repository.

Because every review loads it, size discipline matters. In a large codebase the team keeps CLAUDE.md short and points to other documents from there, rather than letting it grow into an encyclopedia nobody maintains. The reviewer also uses it actively: it flags code that breaks a convention written in CLAUDE.md, and it flags changes that make a line in CLAUDE.md out of date. That second check is subtle and valuable. Documentation decays fastest exactly where code changes most, and an agent that notices the drift keeps the shared map of the project honest.
