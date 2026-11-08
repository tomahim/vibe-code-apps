---
id: bb7493c0-95c7-4911-96f3-5391920aa33c
position: 2
title: Drives fail, by the numbers
archived: false
---


Here is the arithmetic that shapes storage design: a drive with an annualized failure rate around 1% sounds reliable until you own 100,000 drives, at which point roughly three fail every day. At fleet scale, drive failure is not an emergency; it is the weather. Any architecture that treats a single drive as trustworthy will lose data with mathematical certainty.

So the first commandment of storage is redundancy. Data that exists in one place is already lost, you just do not know when. The second commandment is automation: failures are detected, replacement copies are rebuilt from the surviving copies, and failed drives queue up for a technician's routine swap. Monitoring still raises alarms, but routine recovery can be automated. The system is designed so that the daily failure is a nonevent, which means the design question is never whether drives fail but how the system behaves when they do, and when two do, and when a whole rack goes dark.
