---
id: cabdec40-8db3-4e83-a4b4-c48ee73364b9
position: 3
title: Why more transistors stopped being free
archived: false
---


For decades, Moore's law doubled transistor counts roughly every two years, and a companion effect called Dennard scaling kept power per transistor falling just as fast, so each new chip was faster without being hotter. Around the mid-2000s, Dennard scaling broke down: at atomic scales, leakage current and voltage floors meant smaller transistors no longer sipped proportionally less power.

The industry kept shrinking transistors but could no longer shrink their appetite. The response was specialization: instead of one general-purpose engine running faster, chips gained more parallel units doing narrower jobs, which is exactly what AI workloads want. The consequence for facilities is direct. Performance now scales by adding silicon and feeding it power. Many recent accelerator generations have raised chip and system power budgets, though this is not a physical law, and the data center must absorb it. The heat problem is not a design flaw; it is the price of progress after free scaling ended.
