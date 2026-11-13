# Experimentation database cutover

Preparation only. Do not merge until the connection and cutover checks below
are reviewed. No database URL is committed, no data is copied, and no migration
is run by this change.

## Destinations

- `cultive-api-dev`: keep `cultive-dev db` (paid).
- `vibe-code-apps-api-dev` (existing `api` service, same ID): move to the
  restored `vibe-code-apps dev db` (Free) only after validation.
- Source content publisher: moves to the Cultive repo (cultive#35), which
  publishes to `cultive-dev db` through its own GitHub `DATABASE_URL` secret.
- Cultive progress reader: keep `cultive-dev db`.
- Experimentation background workers: route individually to the Free target.
  The readonly credential has mixed consumers and must not be retargeted globally.

The database names above are user labels, not verified physical database names.

## Rename compatibility

Keep the Terraform resource address `railway_service.api` and service ID.
Deployment workflows already select this ID. Preserve the independently managed
private endpoint `api.railway.internal`: the experimentation UI, bot and image
fallbacks use it. The service display name is `vibe-code-apps-api-dev`;
changing the private endpoint is not part of this cutover. Verify DNS and proxy
health after apply. The Cultive UI already uses the standalone Cultive API.

## Before the database switch

1. Obtain the target connection securely and verify the actual endpoint/database.
2. Compare restored non-Cultive tables, data freshness, migration records,
   extensions, ownership, scoped grants and sequence state. Pause writers and
   arrange an approved final delta/copy if writes occurred after the restore.
3. Apply the reviewed Cultive owner-managed-secret declaration. This alone does
   **not** remove its current `${{api.DATABASE_URL}}` reference. Independently pin
   Cultive's value securely to `cultive-dev db`, then verify its resolved target
   and health. Complete this before changing the experimentation API connection
   or renaming a service referenced by that expression.
4. Move the publisher to the Cultive repo (cultive#35), keeping exactly one
   publisher at all times: first pause the source publisher (disable
   `sync-atomic-lessons.yml` via the Actions API and confirm no run is in
   progress), then set the `DATABASE_URL` Actions secret on the Cultive repo
   fresh from the vault's paid Cultive connection URL (GitHub secrets cannot
   be read back) pointing at `cultive-dev db`, set the five media bucket
   secrets (values retrieved from Railway's signed-in session at cutover,
   never exposed), and set the `SYNC_ATOMIC_LESSONS_ENABLED` repository
   variable to `true`. Run the ported workflow once manually and confirm the
   new `lg_sync_log` row on the paid database. Only then set the three
   `LEARNING_CLEANUP_*` variables below and merge this PR, which deletes the
   publisher workflow, the sync command, the learning app and the
   `atomic-lessons/` tree here, and afterwards remove the `DATABASE_URL` and
   media secrets from this repo (audited: the retired workflow was their
   only consumer; the Railway bucket variables stay for the recipes app).
   Also repoint `GITHUB_REVIEW_REPO` on `vibe-code-apps-api-dev` to
   `tomahim/cultive` so the content-review tool reviews content PRs in
   their new home (its `GITHUB_REVIEW_TOKEN` needs access to that repo).
   The experimentation runtime no longer installs `apps.learning`;
   `apps.learning_cleanup`'s migration drops the orphaned `lg_*` tables
   from the experimentation database, replacing the Free-side manual SQL
   block in tomahim/cultive#34. The
   migration fails closed on a real database unless the service carries
   `LEARNING_CLEANUP_CONFIRM=drop-lg-tables` and the server itself proves its
   identity: the guard reads `current_setting('neon.project_id')` and
   `current_setting('neon.endpoint_id')` from the live connection and requires
   them to match `LEARNING_CLEANUP_EXPECT_PROJECT_ID=frosty-moon-05702800`
   and `LEARNING_CLEANUP_EXPECT_ENDPOINT_ID=ep-fragrant-sea-zafai3y3`. A
   wrongly targeted DATABASE_URL (as seen during this split) refuses before
   any SQL runs. Set the variables on the experimentation service
   (`vibe-code-apps-api-dev`) only, once its target is verified, BEFORE
   merging this PR: they are inert on `master` (no cleanup app there) and
   let the merge's deploy run the drop in the same rollout, while a guard
   refusal fails the deploy with the previous version still serving. Its
   `django_migrations` ledger rows are retained.
5. With target checks and review complete, update the owner-managed
   experimentation API connection and scoped worker routes. Preserve exact
   permissions; do not add schema rights or delete old roles.
6. Verify activation, DNS, backend/proxy health and each consumer's destination.
   Retain the paid database for Cultive and rollback. Thomas handles later
   removal of duplicated Cultive tables from the Free database.

The Terraform placeholders and `ignore_changes` cannot perform either secure
pinning or the database switch. Both remain explicit gated cutover steps.
Automatic and manual production migrations remain off unless separately approved.
