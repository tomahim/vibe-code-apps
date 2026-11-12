---
id: 33d92abc-758b-4738-ac8f-49778cf4ecd5
position: 3
title: The harness as a folder of files
archived: false
image: l2-harness-folder-of-files.png
image_alt: "A folder tree named harness with four always-on files (system prompt, guardrails, long-term memory, tool guidance) and four on-demand parts (skills, scripts, sub_agents, plugin), each with a one-line purpose."
image_caption: "The harness as a literal folder of editable files."
image_license: original
---


In the implementation the paper describes, the harness is literally a folder tree. The system prompt lives in systemprompt.md. Standing rules sit in guardrails.md. Persistent memory is LongTermMEMORY.md, and advice on picking and using tools is tool_guidance.md. Alongside these sit directories: skills/ holds reusable procedures, scripts/ holds deterministic helper programs, sub_agents/ holds delegatable specialists, and plugin/ holds code that hooks into the tool loop.

This is a deliberate design, not an implementation accident. Because every component is a file, an "improvement" is a concrete, inspectable change: add a skill, rewrite a paragraph of guidance, drop in a verification script. The alternative, hiding behavior inside opaque configuration or hard-coded logic, would make systematic improvement nearly impossible. You cannot A/B test a rumor, but you can A/B test two versions of a file.
