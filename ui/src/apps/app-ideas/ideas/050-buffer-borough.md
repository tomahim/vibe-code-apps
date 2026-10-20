---
name: Buffer Borough
tagline: See Where Your Day Breaks Before It Does
domains: [PROD, 3D]
date: 2026-10-20
issue: 50
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Turn a daily plan into a miniature street. Tasks become buildings whose widths represent time; gaps become parks. Drag a “delay cloud” onto a task and watch later buildings shift until they hit a fixed appointment. Green parks absorb disruption, making spare time visibly useful.
- **Core Problem & Target User:** Freelancers, parents, and people with appointment-heavy days make plans that fit on paper but collapse after one task runs late.
- **Core Value Proposition:** Discover which buffer would protect your next fixed commitment in under a minute.
- **Signature Interaction:** Increase a task's duration by 20 minutes and watch the delay travel down the street, shrink open gaps, and flag the first appointment collision.
- **Visual Rule:** Horizontal distance encodes time. Building height and decoration are cosmetic and never imply task importance.

#### 2. USER STORIES

- **Primary User Story:** "As someone with several fixed appointments, I want to see how one late task affects the rest of my day, so that I can add breathing room where it matters."
- **Secondary User Story:** "As a busy parent, I want to try shortening or postponing a flexible task, so that I can compare practical ways to protect an immovable commitment."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Sample city street | Open a six-item example day with four flexible tasks and two fixed appointments. Edit labels, planned starts, durations, and fixed status in a simple form. | Day 1 PoC |
| Delay cloud | Select a flexible task and add 0–60 minutes through one slider; display a baseline and simulated timeline. | Day 1 PoC |
| Buffer absorption | Recalculate downstream flexible starts in their existing order. Consume gaps first; keep fixed appointments at their original times and flag collisions. | Day 1 PoC |
| Reset and local save | Reset the simulation independently from the plan; preserve the edited baseline locally. Provide a text list alongside the 3D view. | Day 1 PoC |
| Useful daily planner | Add recurring templates, explicit travel blocks, and a clear comparison of two alternative plans. | Month 1 |
| Scenario workbench | Save named disruptions, such as a late train or an overrun, and compare targeted edits. Add optional calendar-file import with preview. | Month 2 |
| Personal planning feedback | Let users record actual durations, inspect their own estimation patterns, and adjust future templates. Add shareable plan snapshots through explicit export. | Month 3 |

**One-day build budget:** 1 hour for the schedule model; 2 hours for propagation logic and edge cases; 2 hours for a basic 3D street; 1 hour for forms and persistence; 2 hours for accessible feedback and deployment.

**Day 1 exclusions:** Calendar OAuth, automatic rescheduling, notifications, maps, travel-time APIs, probabilistic forecasts, and detailed procedural buildings.

#### 4. SOLO DEVELOPER ARCHITECTURE

- **Suggested stack:** React, TypeScript, Vite, React Three Fiber, basic box geometry, Tailwind CSS, and localStorage.
- **Core model:** PlanItem with id, label, plannedStartMinutes, durationMinutes, and fixed; Scenario with targetTaskId and addedMinutes.
- **Deterministic engine:** Walk items in their original order. For flexible tasks, simulated start is the later of planned start and the previous simulated end. Fixed items retain their planned interval; overlap with an earlier unfinished item is reported as a conflict. Carry the latest occupied end forward so overload cannot disappear behind a fixed appointment.
- **Model boundary:** Simulate one person's sequential workload within one day. A collision describes an infeasible plan; the app does not claim that both tasks can be completed simultaneously.
- **Rendering boundary:** The schedule engine returns intervals and conflicts independently from the scene. The same data powers an accessible HTML list and WebGL fallback.
- **Engagement loop:** Plan → introduce a disruption → inspect the first collision → adjust one task or buffer → compare.

#### 5. DAY 1 ACCEPTANCE CRITERIA

- [ ] The sample day renders without login or setup.
- [ ] A 20-minute delay followed by a 30-minute gap leaves the next task's start unchanged and shows 10 minutes of remaining buffer.
- [ ] A delay larger than the available gap moves later flexible tasks by the unabsorbed amount.
- [ ] Fixed appointments never silently move; overlapping intervals are labeled with conflict minutes.
- [ ] Task order stays unchanged throughout a simulation.
- [ ] Resetting a scenario preserves the edited baseline plan.
- [ ] The text view reports the same starts, ends, and conflicts as the 3D scene.
- [ ] Refresh restores the baseline, and the essential interaction works without WebGL.

#### 6. VALIDATION & SUCCESS SIGNAL

Give five users a sample day with one hidden scheduling vulnerability. Target: four identify the first threatened appointment within a minute, and three make a specific change that removes the conflict. Ask whether the street helped them understand the buffer better than the accompanying list.

**Duplicate check:** Reviewed the open issues on 2026-10-20, including #46–#48. This concept models time and disruption for one person's day; it does not allocate household chores or reproduce the history excavation mechanic.
