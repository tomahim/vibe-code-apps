---
id: 69ea817d-49dd-404c-9ae2-c0f85ed0953b
position: 4
title: "Why the controls failed"
archived: false
---
The bank's SWIFT environment lacked some of the basics. BAE says the attackers had the means to send authentic payment messages and hid their traces by manipulating the software and the printer that produced confirmations. The sources cited here do not give a full account of every control that failed at the bank, so avoid claiming more than that.

The lesson is that the weakness was at the bank's own end of a trusted network: a trusted network is only as strong as the weakest participant, and each participant is a possible entry point.

Teams can apply this lesson by asking one practical question about each payment path: if an attacker controlled the terminal, which independent check would still catch it? Checks that run on the same machine as the attacker give no protection.
