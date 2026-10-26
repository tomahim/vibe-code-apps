# PR review reports

Two Claude Code skills and a fixed offline template that turn a pull request into a layered, interactive review report.

- `/generate-pr-report <PR>`: builds validated JSON (schema v2) from the live PR, then renders it with the fixed template. See `.claude/skills/generate-pr-report/SKILL.md`.
- `/open-pr <PR>`: opens the report for a PR, regenerating HTML locally from validated JSON with the trusted template. See `.claude/skills/open-pr/SKILL.md`.
- Template: `.claude/assets/pr-review-template.html` (template 0.2). Dark IDE-style by default, inline CSS/JS, no network.
- Helper: `tools/report.py` (`build`, `open`, validation).
- Example data: `docs/pr-review/examples/pr-93.json` (actual PR 93, 31 files).

## Report layout

A separate PR description tab holds the verbatim PR body and PR-wide context. Each layer (behavior, design, annex) has a short description, optional attention bullets and code. Each highlighted line range has its own short comment: in a right-hand rail on desktop, stacked below the code on phones. Click a note to jump to its range.

## Try it

```
python3 tools/report.py build docs/pr-review/examples/pr-93.json --output /tmp/review-example
python3 tools/report.py open /tmp/review-example/<generated>.html
```

## Limits

Local build/open and validation are implemented. Fetching and publishing reports from a report branch are specified in the skills but not automated or tested end to end. Validation covers schema, text length and hunk ranges; it is not a full JSON Schema or HTML security audit. Read marks are session-only. No CI is attached (`.claude/`, `docs/` and `tools/` are outside the deploy pipelines).
