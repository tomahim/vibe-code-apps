# Experimentation database cutover

Preparation only. Do not merge until the connection and cutover checks below
are reviewed. No database URL is committed, no data is copied, and no migration
is run by this change.

## Destinations

- `cultive-api-dev`: keep `cultive-dev db` (paid).
- `vibe-code-apps-dev` (existing `api` service, same ID): move to the restored
  `vibe-code-apps dev db` (Free) only after validation.
- Source content publisher and Cultive progress reader: keep `cultive-dev db`.
- Experimentation background workers: route individually to the Free target.
  The readonly credential has mixed consumers and must not be retargeted globally.

The database names above are user labels, not verified physical database names.

## Rename compatibility

Keep the Terraform resource address `railway_service.api` and service ID.
Deployment workflows already select this ID. Preserve the independently managed
private endpoint `api.railway.internal`: the experimentation UI, bot and image
fallbacks use it. The service display name is `vibe-code-apps-dev`; changing the
private endpoint is not part of this cutover. Verify DNS and proxy health after
apply. The Cultive UI already uses the standalone Cultive API.

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
4. Preserve the publisher's GitHub `DATABASE_URL` on `cultive-dev db`. The
   publisher workflow now migrates with `config.publisher_settings`, which
   installs only the shared apps plus learning, so it can no longer recreate
   experimentation tables on the paid database. The experimentation runtime
   no longer installs `apps.learning`; `apps.learning_cleanup`'s migration
   drops the orphaned `lg_*` tables from the experimentation database,
   replacing the Free-side manual SQL block in tomahim/cultive#34. The
   migration fails closed on a real database unless the service carries
   `LEARNING_CLEANUP_CONFIRM=drop-lg-tables` and the server itself proves its
   identity: the guard reads `current_setting('neon.project_id')` and
   `current_setting('neon.endpoint_id')` from the live connection and requires
   them to match `LEARNING_CLEANUP_EXPECT_PROJECT_ID=frosty-moon-05702800`
   and `LEARNING_CLEANUP_EXPECT_ENDPOINT_ID=ep-fragrant-sea-zafai3y3`. A
   wrongly targeted DATABASE_URL (as seen during this split) refuses before
   any SQL runs. Set the variables on the experimentation service
   (`vibe-code-apps-api-dev`) only, once its target is verified. Its
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
