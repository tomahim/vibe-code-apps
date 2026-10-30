---
id: 093314cf-335b-43f0-8353-2469f0db18e5
position: 4
title: Severity tags protect the author
archived: false
---
What survives verification shows up as inline comments sorted by severity, and each comment is tagged Important, Nit, or Pre-existing. That last tag solves a real social problem: reviewers, human or machine, tend to flag old code sitting next to the diff, which makes a bug the pull request did not introduce look like the author's fault.

Pre-existing tags keep the conversation honest about what this change actually did. Severity sorting does the same for attention: the author fixes the Important findings first and treats Nits accordingly. Every finding still has to be answered, either by fixing it or by resolving the thread with a reason, so nothing sinks silently. Often an agent picks up the fix overnight, and the author comes back to a pull request that has already been through another round.
