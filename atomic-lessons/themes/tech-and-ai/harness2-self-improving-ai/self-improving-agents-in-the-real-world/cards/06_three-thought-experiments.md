---
id: 8a202d9b-723f-409a-8793-02dc95952f3d
position: 6
title: Three thought experiments
archived: false
---


Here are three made-up cases, offered as illustrations rather than results from the paper. A contract-review agent keeps missing dates buried in annexes. A refinement pass might add a guardrail to list every date in every attachment and a small script that extracts them, tested on past contracts before anyone relies on it.

A data-cleaning agent for survey spreadsheets keeps writing numbers stored as text into its summaries. The fix might be a tool-guidance note plus a validation script that rejects non-numeric cells, checked on a handful of messy files. A repository-chores agent for a small software team keeps forgetting to run the formatter before finishing, a repeated skipped step that a completion hook could enforce, but only after clear prose has been tried and ignored. In each case: find a repeated failure, pick the lightest component, test it, keep what the evidence supports.
