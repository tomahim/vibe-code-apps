---
id: 6ab518ca-78ba-444e-8410-eecdc573033c
position: 3
title: "What the payload did"
archived: false
---
On a matching system, Stuxnet changed the code running on the controllers. According to the Symantec dossier, it looked for particular configurations that drive frequency converters and, at intervals, altered motor speeds while the system appeared to run normally. A rootkit hid the changes from engineers.

The key idea was deception. Operators looking at their monitoring screens saw normal values, because the malware recorded sensor readings and replayed them. Ralph Langner's analysis describes a 21-second recording played in a loop during the attack. Equipment could be stressed and broken while the display looked fine. For defenders this changed the question from "is the system up?" to "can we trust what our instruments report?". That is a hard problem when the instruments run on the same compromised software.
