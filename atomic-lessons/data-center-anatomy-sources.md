# Sources and editorial notes

Reviewed 8 November 2026. This is an introductory learning path, not an electrical installation or cooling-system design manual. Only publicly accessible material was used. No subscription was purchased and no paid-only sections are represented as having been covered.

## Core reading

| Source | Scope used | Notes |
| --- | --- | --- |
| [SemiAnalysis, Datacenter Anatomy Part 1: Electrical Systems](https://newsletter.semianalysis.com/p/datacenter-anatomy-part-1-electrical), 14 October 2024 | Electrical chain, substations, switchgear, UPS, generators, rack distribution, business segmentation | Publicly accessible portion. The article's deployment sizes, utilization figures and voltage examples are examples, not universal standards. |
| [SemiAnalysis, Datacenter Anatomy Part 2: Cooling Systems](https://newsletter.semianalysis.com/p/datacenter-anatomy-part-2-cooling-systems), 13 February 2025 | Airflow, chilled-water systems, heat rejection, economizers and density transition | Publicly accessible portion. Detailed paid designs and models are outside this path's scope. |
| [US Department of Energy, Best Practices Guide for Energy-Efficient Data Center Design](https://www.energy.gov/sites/default/files/2024-07/best-practice-guide-data-center-design.pdf), July 2024 | Airflow management, cooling systems, efficiency, electrical and mechanical context | Public technical guide. Useful further reading for lessons 7-15. |

## Primary definitions and specifications

| Source | Claims used | Confidence and limits |
| --- | --- | --- |
| [Schneider Electric, active, reactive and apparent power](https://eshop.se.com/in/blog/post/difference-between-active-power-reactive-power-and-apparent-power.html) | AC power, power factor and three-phase distinction | High for formulas. Balanced three-phase examples use line-to-line RMS voltage and unity power factor. The power triangle is a simplified sinusoidal model; distortion can also affect true power factor. |
| [IBM, What are semiconductors?](https://www.ibm.com/think/topics/semiconductors) | Transistors and switching in semiconductor devices | General introduction. The course's on/off switch drawing is an abstraction, not a transistor fabrication diagram or a rule equating every conducting device with logical 1. |
| [NVIDIA, H100 specifications](https://www.nvidia.com/en-us/data-center/h100/) | H100 SXM configurable TDP up to 700 W | High. Other H100 variants differ. Maximum rating is not constant measured draw. |
| [NVIDIA, DGX H100 user guide](https://docs.nvidia.com/dgx/dgxh100-user-guide/introduction-to-dgxh100.html) | Eight-GPU system with 10.2 kW maximum input power | High. Complete-system rating, not just the GPU sum. |
| [NVIDIA, GB200 NVL72](https://www.nvidia.com/en-us/data-center/gb200-nvl72/) | 72 Blackwell GPUs, 36 Grace CPUs, rack-scale NVLink domain, liquid cooling | High for topology and product requirements. Approximately 120 kW is the SemiAnalysis article's rack example; configurations vary. A rack is not literally a single GPU. |
| [Cisco, Massively Scalable Data Center network design](https://www.cisco.com/c/en/us/products/collateral/switches/nexus-9000-series-switches/white-paper-c11-743245.html) | Leaf-to-spine links, two-tier Clos fabric, equal-cost paths and scale-out | High. Two leaf-to-leaf links apply to the simplified two-tier fabric, not every end-to-end network path or every larger fabric. |
| [Amazon S3, Data durability and protection](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DataDurability.html) | S3 Standard design target of 99.999999999% annual object durability | High for the design target. Availability and durability are different, and storage classes differ. RAID alone is not a backup. |
| [Open Compute Project, Cheval Open Rack V3](https://www.opencompute.org/marketplace/facilities-physical-infrastructure/cheval-group-open-rack-v3-orv3/) | Wider 21-inch OCP equipment space alongside 19-inch mounting options | High for this product example. 19 inches is a mounting convention, not cabinet external width. |
| [ASHRAE TC 9.9, Thermal Guidelines reference card](https://www.ashrae.org/File%20Library/Technical%20Resources/Bookstore/Supplemental%20Files/Therm-Gdlns-5th-R-E-RefCard.pdf), 2021/2024 | Recommended A1-A4 inlet range of 18-27 C; H1 range of 18-22 C; distinct allowable and liquid classes | High. Class and manufacturer limits matter. No guideline table or diagram is reproduced. |
| [Uptime Institute, Explaining the Tier Classification System](https://journal.uptimeinstitute.com/explaining-uptime-institutes-tier-classification-system/) | Tier I basic capacity, Tier II redundant capacity, Tier III concurrent maintainability, Tier IV fault tolerance | High. Tiers specify outcomes, not a fixed N+1/2N recipe. Expected annual downtime figures were removed in 2009. |
| [Cummins, renewable-diesel approval](https://www.cummins.com/en-na/news/releases/2023/08/25/cummins-announces-approval-unblended-renewable-diesel-use-all-industrial), 25 August 2023 | HVO use in approved engines | High for stated Cummins approvals. Compatibility must be verified per engine; lifecycle-emissions benefit depends on feedstock and fuel pathway. It does not mean zero exhaust emissions. |

## Context and supplementary explanations

| Source | Claims used | Notes |
| --- | --- | --- |
| [IEA, Energy demand from AI](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai), 2025 | Estimated data-center electricity use of 415 TWh in 2024, about 1.5% globally; approximately 945 TWh in 2030 base case | Estimate and scenario projection, not a guarantee. Future demand is uncertain. |
| [Data Center Dynamics, reporting on Uptime Institute's 2025 survey](https://www.datacenterdynamics.com/en/news/roughly-one-third-of-data-center-owners-and-operators-doing-ai-training-or-inference-uptime-institute/) | Survey average PUE around 1.54; facilities above 20 MW around 1.44; most respondents' reported maximum rack densities 10-30 kW | Secondary reporting on a survey, not a census of all facilities or every rack. |
| [Vertiv, Direct-to-chip cooling explanation](https://www.vertiv.com/en-us/insights/articles/educational-articles/understanding-direct-to-chip-cooling-in-hpc-infrastructure-a-deep-dive-into-liquid-cooling/), 21 August 2024 | Cold plates, manifolds, CDU heat exchange and remaining air cooling | Vendor educational source, cross-checked against DOE/ASHRAE context. Coolant and topology vary; a universal capture percentage is deliberately not taught. |
| [Vertiv, Immersion cooling explanation](https://www.vertiv.com/en-us/insights/articles/educational-articles/what-is-immersion-cooling-for-data-centers/), 6 November 2026 | Single-phase and two-phase immersion, dielectric fluids and service trade-offs | Vendor educational source. Immersion is an alternative architecture, not a mandatory successor to cold plates. |

## Simplifications used deliberately

- Images are original explanatory diagrams, not certified wiring diagrams, site layouts, exact hardware drawings or construction instructions.
- The path builds volts and transistors into chips, servers, racks, networking and storage, then adds the electrical and cooling plant. Generic components are introduced before site-scale combinations.
- A continuous 300 MW load divided by an assumed 1.2 kW per home gives about 250,000 homes. The original article's roughly 200,000-household annual-energy comparison includes utilization assumptions; the course avoids mixing those two calculations.
- DC uses P = V x I. Single-phase AC real power uses RMS V x I x PF. Balanced three-phase real power uses sqrt(3) x line-to-line RMS V x line current x PF. Real installations also require code, protection, conductor and thermal checks beyond this course.
- TDP, nameplate capacity, maximum system input and measured workload draw are different. The course does not add processor TDPs and call that the full facility load.
- There is no universal air-cooled rack cutoff, safe cooling-interruption duration, direct-to-chip heat-capture share, or chiller-free ambient condition. These depend on the system.
- A/B labels alone do not prove complete independence. Tier III is not a guaranteed annual uptime percentage, and a spare UPS module alone does not establish concurrent maintainability.
- Storage durability targets are not guarantees against deletion, correlated failures or loss of every copy. Independent backups and recovery procedures remain separate concerns.
