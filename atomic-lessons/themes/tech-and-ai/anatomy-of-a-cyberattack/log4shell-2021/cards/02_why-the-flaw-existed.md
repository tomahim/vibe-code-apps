---
id: 73e1d50d-aebc-4d4e-85f2-d011dbe193b2
position: 2
title: "Why the flaw existed"
archived: false
---
Without going into attack details, the problem was an over-helpful feature. CISA's advisory says the flaw lay in how the library substituted JNDI lookups inside log messages. If an application logged text controlled by an outside user, that text could trigger the lookup in a way the developers had not intended.

The lesson for programmers is that logging is not a harmless output channel, because it processes data that comes from outside the system. A function that interprets data as instructions needs very careful limits.

For developers the point is not to avoid logging but to be careful with any feature that interprets text as instructions. Safe defaults, small feature sets and review of rarely used functions reduce this kind of risk, and users cannot be expected to find such features themselves.
