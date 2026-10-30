---
id: b9323fb9-329b-4aab-8e71-088dd626c44e
position: 6
title: Building your own incident eval
archived: false
---
The pattern transfers even at small scale. After your next production bug, resist closing the postmortem with “add a test” alone. Extract the pull request that introduced the bug, write down precisely what a reviewer should have flagged, and keep that case in a folder next to your review tooling.

Whenever you change your review setup, a new prompt, a new linter, a new model, run the collection. Does the new setup catch the login bypass from March, the race condition from June, the misrouted config from August? If it misses one, the change is a regression no matter how good it feels. Start with three cases and let incidents grow the set naturally. The habit converts your worst days into permanent defenses, and it gives every future review improvement an honest scoreboard instead of a vibe.
