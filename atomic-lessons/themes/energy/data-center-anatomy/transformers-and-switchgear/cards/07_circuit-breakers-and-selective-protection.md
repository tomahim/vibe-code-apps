---
id: d72eb90b-7e6a-470e-8698-44615a4241ca
position: 7
title: Circuit breakers and selective protection
archived: false
---

Inside switchgear, the circuit breaker is the reflex: a device that monitors current and opens the circuit in milliseconds when it exceeds safe limits, extinguishing an electric arc that can reach thousands of degrees. Breakers range from the small units guarding a single rack circuit to house-sized medium-voltage breakers at the substation.

The art is selectivity. Protection is coordinated so that the breaker closest to a fault trips first, leaving everything upstream and sideways alive: a shorted server supply trips one rack circuit, not the hall; a failed busway section trips its feed, not the campus. Engineers set these trip curves deliberately, studying how faults propagate through their specific one-line diagram. Combined with the redundant paths of this course, selectivity is what makes electrical faults, in SemiAnalysis's words, more common but with a smaller blast radius than cooling failures: the system is designed so that the most frequent failure category is also the most contained.
