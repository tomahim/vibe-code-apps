---
name: layered-review
description: Create a layered review artifact for a pull request. Splits the PR into ordered layers (behavior changes first, then design choices, then a collapsed annex of mechanical changes like test coverage or regenerated API types), each highlighting its key lines, and renders it as one self-contained interactive HTML artifact. Use when asked to review, summarize, walk through, or explain a PR.
argument-hint: "[pr-number-or-url]"
allowed-tools: Bash(gh pr *), Bash(gh api *), Bash(git diff *), Bash(git log *), Bash(git show *)
---

# Layered Review

Turn one pull request into a short, ordered reading list instead of a flat diff. This skill is the simple first version of the Layered Review idea (see `ui/src/apps/app-ideas/ideas/2026-10-21-layered-review.md`).

## Input

- `$ARGUMENTS` may hold a PR number, a GitHub PR URL, or nothing.
- PR number or URL: review that PR with `gh pr view` and `gh pr diff`.
- Nothing: if the current branch has an open PR (`gh pr view` succeeds), review it. Otherwise review the local diff of the current branch against the default branch (`git diff $(git merge-base HEAD origin/master)...HEAD`).

## Gather the facts

1. `gh pr view <pr> --json number,title,author,url,body,files,additions,deletions,baseRefName,headRefName`
2. `gh pr diff <pr>` for the full unified diff. For very large diffs, read it per file instead of dropping files.

Never guess what changed. Every layer must trace back to hunks in the diff.

## Split the changes into layers

Group the hunks into a small set of ordered layers (aim for 3 to 8). Order them by what a reviewer should read first:

1. **Behavior changes** - what the system or its users do differently now: new endpoints, changed logic, new UI behavior, changed data. One layer per distinct behavior, not per file.
2. **Design choices** - structural decisions a reviewer should judge: new abstractions, data model or schema changes (including migrations), moved or renamed responsibilities, new dependencies, chosen trade-offs.
3. **Annex** - mechanical and supporting changes, grouped and collapsed by default but never dropped: added test coverage, regenerated API types or clients, formatting, lockfile updates, mechanical renames, comment/docs touch-ups.

Rules:

- A change belongs in exactly one layer.
- Database migrations describe a data-model decision: put them in design choices, not the annex.
- Each layer gets: a title, a one-to-two line summary in plain words, a type badge (behavior / design / annex), and its key lines - the 3 to 10 line ranges that carry the change, each as `file path` + line range + one line on why it matters.
- Key lines link or scroll to that hunk in the full diff. The complete diff stays reachable; layers are a reading guide, not a filter.
- If the PR is tiny (one behavior, no design change), say so and use fewer layers. Do not invent layers to fill the template.

## Build the artifact

Write one self-contained HTML file, following `ui/src/artifacts/README.md` conventions:

- Location: `ui/src/artifacts/YYYY-MM-DD-pr-<number>-<short-slug>.html` (today's date, slug from the PR title). For a local branch with no PR number, use `pr-local-<branch-slug>`.
- Add the matching JSON sidecar (`<same-name>.json`) with `title` (`PR #<n>: <title>`), a one-sentence `description`, `date`, and `tags: ["layered-review", "pr-review", "<repo-or-app-area>"]`.
- All CSS in `<style>`, all JS in `<script>`. No external assets, no network calls, no React or build step. It must work opened directly from disk.
- The gallery preview runs in an opaque-origin iframe: no localStorage, no cookies. Keep reading state (expanded layers, mark-as-read) in memory only.
- Responsive layout, keyboard focus states, and `prefers-reduced-motion` handling, as the artifacts README requires.

Suggested layout (adapt if something simpler fits):

- Header: PR title, number, author, branch pair, +/- line counts, link to the GitHub PR.
- Left rail: the ordered layers as a reading list with type badges and mark-as-read toggles, so the artifact reads as "a stack of 5-minute reads".
- Main pane: the selected layer's summary and its key-line excerpts (small syntax-tinted code blocks with file path and line numbers).
- Bottom: the full diff, collapsed by default, with anchors so each key line jumps to its hunk.

Keep the artifact quiet and readable: this is a review document, not a demo. Prioritize legible diffs, clear layer titles, and honest key lines over visual effects.

## Report

When done, report:

- The artifact path(s) and the layer list with one line each.
- How to view it: open the HTML file directly, or run `npm run dev` in `ui/` and visit `/artifacts`.
- Ask before committing the artifact to the gallery; review artifacts are ephemeral and the user may not want every PR review archived there.
