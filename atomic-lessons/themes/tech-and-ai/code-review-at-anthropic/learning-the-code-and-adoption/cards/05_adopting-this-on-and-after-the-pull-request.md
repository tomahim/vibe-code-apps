---
id: 68ac3704-9806-421a-aeb4-d6d59f55118a
position: 5
title: Adopting this on and after the pull request
archived: false
---
On the pull request itself, the recipe is: require CI; add Testing, Risk, and How to revert to your PR template; add an AI reviewer on one repository and tune its REVIEW.md for a few weeks before widening; add automated security review and require every thread resolved before merge; match review effort to risk with quick and deep passes; and cap review rounds, re-reviewing only the new diff after the first few.

For approval, write down risk tiers set from the change rather than the author, start strict and loosen with evidence, keep lighter paths for trusted authors, use CODEOWNERS and branch protection so auth, billing, CI and release workflows and installers always need a person, never let a bot's approval replace a required human's, and dismiss approvals on new commits. After merging, use a merge queue, feature flags, internal use first, staged releases and one-step rollback, turn incidents into an eval set, and measure human time with revert and incident rates as the guardrail.
