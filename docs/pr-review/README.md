# PR review recaps

Two Claude Code skills and a fixed offline template that turn a pull request into a layered, interactive review recap.

- `/generate-pr-recap <PR>`: builds validated JSON (schema v2) from the live PR, then renders it with the fixed template. See `.claude/skills/generate-pr-recap/SKILL.md`.
- `/open-pr-recap <PR>`: opens the recap for a PR, regenerating HTML locally from validated JSON with the trusted template. See `.claude/skills/open-pr-recap/SKILL.md`.
- Template: `.claude/assets/pr-review-template.html` (template 0.2). Dark IDE-style by default, inline CSS/JS, no network.
- Helper: `tools/recap.py` (`build`, `open`, `publish`, `fetch`, validation).
- Example data: `docs/pr-review/examples/example.json` (small synthetic pull request). The skills above are self-contained and cite no external documents.

## Recap layout

A separate PR description tab holds the verbatim PR body and PR-wide context. Each layer (behavior, design, annex) has a short description, optional attention bullets and code. Each highlighted line range has its own short comment: in a right-hand rail on desktop, stacked below the code on phones. Click a note to jump to its range.

## Try it

```
python3 tools/recap.py build docs/pr-review/examples/example.json --output /tmp/review-example
python3 tools/recap.py open /tmp/review-example/pr-1-<sha>.html

# publish/fetch against any git remote (use a throwaway bare repo to try):
git init --bare /tmp/remote.git
python3 tools/recap.py publish docs/pr-review/examples/example.json --remote /tmp/remote.git          # dry run
python3 tools/recap.py publish docs/pr-review/examples/example.json --remote /tmp/remote.git --yes
python3 tools/recap.py fetch 1 --remote /tmp/remote.git --current-head <sha> --output /tmp/fetched
```

## What is automated and what is not

Automated and tested against a local bare remote: build, open, validation, orphan branch creation, immutable per-head recaps, index, dry run/confirm, head-moved refusal, one retry after a concurrent writer, fetch by current head or SHA prefix, "no recap for current head", and local regeneration from validated JSON.

Left to Claude: reading the PR with `gh`, writing the layers, descriptions and highlight comments, and asking for confirmation before publishing. These have not been run in a real Claude Code session or against GitHub. Validation covers schema, text length and hunk ranges; it is not a full JSON Schema or HTML security audit. Read marks are session-only. No CI is attached.
