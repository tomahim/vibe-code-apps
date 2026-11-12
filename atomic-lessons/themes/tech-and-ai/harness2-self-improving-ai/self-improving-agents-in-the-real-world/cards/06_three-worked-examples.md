---
id: 8a202d9b-723f-409a-8793-02dc95952f3d
position: 6
title: Three worked examples
archived: false
---


A retrieval-augmented assistant answers questions from a document database. Different question types need different retrieval strategies, and if the agent keeps producing unsupported answers, a refinement pass might add a citation-verification script or a source-reconciliation skill, tested against representative questions before promotion. Note this is a potential extension of the method, not a ready-made RAG optimizer in the release.

A multi-agent application with a planner, researcher, coder and reviewer gives each agent a different harness: better search guidance for the researcher, testing scripts for the coder, stronger verification for the reviewer, adapted locally instead of rewriting the whole workflow. A natural-language-to-SQL analytics agent keeps omitting join conditions; refinement introduces a deterministic schema-validation tool and a join-verification skill, evaluated on controlled questions, with generated SQL always running under read-only, least-privilege credentials and query timeouts in production.
