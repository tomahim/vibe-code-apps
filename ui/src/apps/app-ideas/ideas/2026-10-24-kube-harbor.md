---
name: Kube Harbor
tagline: A Living 3D Port Where Kubernetes Finally Makes Sense - Pods Sail, the Harbor Master Decides
pitch: A dynamic 3D simulation of a Kubernetes cluster as a working harbor: deploy, scale, break and update containers while watching the scheduler, services and traffic respond in real time.
domains: [3D, LEARN]
created: 2026-10-24T16:44:12Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Kubernetes documentation explains concepts; Kube Harbor lets you watch them misbehave. The cluster is a living 3D port: worker nodes are docks, pods are berthed ships loaded with containers, Deployments are shipping companies with a target fleet size, Services are marked sea lanes with a lighthouse (the stable endpoint), Ingress is the harbor entrance directing outside traffic, and the scheduler is the harbor master assigning berths by capacity and rules. The simulation is dynamic, not a diagram: deploy an app and pods sail in and berth; drag the replica slider and the fleet grows or shrinks; kill a pod and watch it sink, the harbor master notice, and a replacement launch; start a rolling update and see new-version ships cycle in one at a time, each taking traffic only once it signals ready; cordon a node and new pods stop landing on it while the resident fleet keeps sailing, then issue the drain order and watch those pods cast off and re-berth elsewhere. A traffic view turns on the flows: request streams from the harbor entrance fanning across lanes to healthy pods only. Every element can be tapped for its real counterpart ("this ship = a Pod: the smallest deployable unit, one or more containers sharing fate").
- **Core Problem & Target User:** Kubernetes is the industry default and famously hard to build intuition for: static diagrams can't show reconciliation, and real clusters are opaque walls of YAML. Target user: developers learning Kubernetes, students, DevOps-curious engineers, and engineering leads who need to explain orchestration to their team.
- **Core Value Proposition:** Cause and effect you can see: poke the cluster, watch the system heal, route and scale - the mental model forms from motion, not from memorizing architecture diagrams.

#### 2. USER STORIES

- **Primary User Story:** "As a learner, I want to deploy, scale, kill and update pods in a living 3D cluster, so that self-healing, scheduling and rolling updates become things I've watched happen."
- **Secondary User Story:** "As a teacher, I want each visual element mapped to its real Kubernetes concept with the exact term and one-line definition, so that the metaphor transfers directly to real kubectl work."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The harbor | A 3D port with 3 node docks, deployable apps, pods berthing and sailing, the scheduler visibly assigning berths by free capacity, and tap-to-inspect cards mapping every element to its real K8s term. | Day 1 PoC |
| Core Mechanism: The drills | Four signature interactions: kill a pod (self-healing), drag replicas (scaling), rolling update (ready pods before old ones retire), cordon versus drain a node (no new berthings, then evacuation) - each with a narrated explanation of what the control plane just did. | Day 1 PoC |
| Expansion 1: Traffic and load | Live request flows through Ingress and Services to healthy pods, CPU/memory berth gauges, horizontal pod autoscaling under a load-spike button, resource requests/limits visualized as berth sizes. | Month 1 MVP |
| Expansion 2: The full curriculum | Guided lesson path from pods to Deployments, Services, ConfigMaps/Secrets (cargo manifests), persistent volumes (warehouses), namespaces (separate quays), a chaos mode with random failures, and export of what you built as real YAML. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** A self-contained interactive page in the gallery's house style (Three.js low-poly harbor, warm dusk palette, step buttons, gauges, big-idea card); a small simulation engine models pods, nodes, the scheduler loop and traffic at a readable pace. All client-side, no real cluster, no backend.
- **Core 24-Hour Demo Flow:** Deploy "webshop" with 3 replicas and watch three ships berth across two docks; sink one and see the harbor master dispatch a replacement in seconds; then slide replicas to 6 and watch the fleet double, berths filling by capacity. **Aha moment:** the rolling update - old-version ships sail out one by one as new ones dock, traffic lines never flickering as long as each new ship passes its readiness check and capacity holds - and the caption "that readiness gate is why Deployments can update without downtime" lands with the visual proof still on screen.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The harbor is already alive when the page opens - traffic flowing, one pod mid-launch - with a single invitation: "sink a ship, see what Kubernetes does".
- **Growth Vector:** Every engineer who struggled to explain Kubernetes to a colleague shares a good visual; the metaphor glossary (ship = pod, dock = node, harbor master = scheduler) is quotable, and it pairs naturally with The Megawatt Path for the full "where does my code actually run" story.

#### 6. RISKS & MITIGATION

- **Metaphor leakage:** No metaphor maps Kubernetes perfectly (pods aren't independent ships; containers share pod fate). Mitigation: every inspect card states the real concept and explicitly flags where the metaphor bends, so the visual teaches the true model rather than a wrong one.
- **Oversimplification of the control plane:** The scheduler does more than pick berths (taints, affinities, priorities). Mitigation: PoC scopes to capacity-based placement and labels it as such; advanced scheduling is Expansion scope with its own visual language, never silently implied.
- **Dynamic honesty:** A simulation can look alive while teaching nothing real. Mitigation: the engine models the actual reconciliation loop semantics (desired vs observed state) under the hood, and every drill's narration names the real controller action that corresponds to the animation.
- **Overlap with The Megawatt Path:** Both are 3D explainers. Mitigation: clearly different layers of the stack - physical facility versus software orchestration - cross-referenced as companions in the series.
