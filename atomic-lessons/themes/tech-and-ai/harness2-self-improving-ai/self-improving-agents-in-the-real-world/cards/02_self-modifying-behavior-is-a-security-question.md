---
id: 6ff881aa-8044-4ba2-a87d-e57a5481080d
position: 2
title: Self-modifying behavior is a security question
archived: false
---


Here is the sharpest observation in the Medium article: a model that can create scripts, plugins and tool instructions effectively has influence over the future actions of the application. A new script is executable code. A plugin changes what tools do. A skill adds steps and dependencies. Self-improvement therefore means the system writes part of its own future behavior, and that capability deserves the same suspicion as any code deployment.

The article's core control is separation of authority: the model may propose a change, but the platform decides whether it executes. Every proposed artifact is stored as an immutable, versioned candidate. Static checks reject unsafe file paths, credential access, prohibited imports and unapproved network destinations. Candidate execution happens in isolated environments with minimal permissions. And strict separation is enforced between instructions supplied by the application and untrusted content from documents, tools or execution traces, so a poisoned input cannot rewrite the rules.
