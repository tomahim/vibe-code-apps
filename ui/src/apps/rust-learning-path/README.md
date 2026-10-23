# Rust workshop

Four atomic lessons for issue #62's day-one PoC: Hello Rust, immutable bindings,
functions, and moves. Ownership has two checks: deliberately produce E0382, then
repair the move with `clone()`. A lesson completes only after all its checks pass.

Open `/apps/rust-learning-path` in the shared UI. The shared Django API must be
running for execution (`npm run dev` proxies `/api` to localhost:8000). No new
service, database, account, migration, or Railway configuration is required.

## Content and checks

Chapter JSON in `lessons/` is discovered and sorted by `catalog.js`. Stable lesson
IDs also work as URL hashes. Each lesson declares edition 2021. `diagnostic` is an
optional first exercise with its own starter, solution, task, hint, and check.

- `stdout`: successful execution and trimmed output equals `expected`; optional
  `requires` tokens provide lightweight feedback on the concept being practiced.
- `compile_error`: unsuccessful execution and a matching `error[E....]` diagnostic.
- `tests`: append the checked-in `#[cfg(test)]` harness outside the editable code,
  execute in test mode, and require a successful non-empty test run.

These are learning checks, not a tamper-proof grading system. Tests are bundled
with the UI and inspectable. Drafts and completion are kept only in React state
for the current visit. Quizzes, persistent progress, search, exports, and the
remaining curriculum are outside this PoC.

CodeMirror is shared with Three.js through `src/components/CodeEditor.jsx`, with
Rust language support and a 16px editor. Run is manual, with Cmd/Ctrl+Enter,
clickable compiler locations, hints, reset, and solutions. On phones the panes
stack, the symbol row scrolls inside its panel, and Run stays at the bottom.
Editing or navigating cancels stale responses; editing revokes that exercise's
completion until its check passes again.

## Execution boundary

`runRust({code, mode, signal})` only calls `POST /api/apps/rust/run`. Django's
`apps/rust_learning_path/runner.py` is the sole Playground adapter. It sends
`channel=stable`, `edition=2021`, `mode=debug`, `crateType=bin`, and `tests=true`
only for test mode to `https://play.rust-lang.org/execute`. The Playground controls
the live stable compiler version; curriculum CI pins rustc **1.85.0**. Code runs
on the public Playground, never on the Django host. Do not put secrets in lessons.

The anonymous endpoint requires JSON and rejects cross-site browser fetches. It
has a 16 KiB UTF-8 code limit (including tests), a 32 KiB request limit, 12 requests
per minute per peer and 60 globally, one active upstream run per cache, a five-minute
result cache, and a 256 KiB upstream-response cap. Limits apply before cache hits.
Connection/read timeouts are 2/8 seconds with an elapsed-time check while reading;
the browser aborts after 12 seconds. An aborted browser run may continue upstream
until its server timeout. There are no automatic retries.

Limits and locks use Django's configured cache. The default LocMemCache is
**per process**, so budgets multiply across workers/replicas. The server uses
REMOTE_ADDR, not untrusted X-Forwarded-For; browsers behind the same proxy may
share a budget. This deliberately conservative PoC needs a shared cache and a
trusted proxy identity policy before scaling usage. Only cache keys contain hashes,
not source code. Results are briefly cached in memory; the app does not log code.

## Verification

- `npm test`: validates JSON and check behavior.
- `npm run test:rust`: runs every starter and solution with local rustc 1.85.0
  (or `RUSTC=/absolute/path/to/rustc`). Starters must fail their intended check;
  every solution must pass. Only repository fixtures are executed locally.
- `npm run test:browser -- rust-learning-path.spec.js`: deterministic API fixtures
  test manual execution, all check types, compiler links, errors, cancellation,
  and 1440px / 390px layouts without contacting the Playground.
- `python manage.py test apps.rust_learning_path` from `api/`: validates limits,
  cache/adapter behavior, malformed inputs, and upstream failures with mocks.

`.github/workflows/test-rust.yml` runs the real compiler checks and browser tests;
the existing API workflow discovers the backend tests. CI does not send workloads
to the public Playground. Live availability still requires an occasional manual
end-to-end smoke check with the API running.
