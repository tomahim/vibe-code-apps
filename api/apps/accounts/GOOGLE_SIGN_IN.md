# Optional Google sign-in

Disabled by default. Password login and per-user feature flags are unchanged.
No Google access/refresh tokens or Google profile data are stored. ID tokens
are verified with google-auth (Google signature, audience, issuer and expiry),
then checked for a verified email and a short-lived browser-bound nonce.
Django CSRF protection and an exact configured Origin are required on POST.
The response uses the existing application JWT contract.

## Proposed identity model - approval required before merge

ExternalIdentity stores provider, stable provider subject, existing user and
creation time. Uniqueness prevents one Google subject being assigned to two
users, or a user silently replacing an existing Google identity. No user is
created, no local profile is overwritten, and Google email never selects a
local account. For an unlinked Google identity the user must explicitly confirm
their existing account email/username and password before a binding is created.
An existing binding cannot be reassigned through these endpoints.

This is a schema decision and requires explicit review before merge. Deployment
runs migrations, so do not merge this backend PR merely to preview a button.
Alternative: a server-managed subject-to-user mapping avoids a database table,
but needs operator changes for each account, has no in-app explicit linking and
makes revocation/auditing harder. This PR proposes the database model instead.
Unlink/recovery UI and public account registration are out of scope. A database
operator can revoke a binding while password login remains available.

## Endpoints

- GET /api/auth/google/config: {enabled:false} unless enabled, configured and on
  an explicitly allowed HTTPS origin (HTTP localhost/loopback allowed for dev).
  Enabled responses return public client_id, nonce and a masked csrf_token,
  setting a five-minute HttpOnly, SameSite=Strict nonce cookie. HTTPS uses Secure.
- POST /api/auth/google/login: JSON {credential} and X-CSRFToken, same Origin.
  For an unlinked subject returns 403 with code=link_required, without mutation.
- Explicit linking uses the same POST with {credential,link:true,email,password}.
  Both proofs are checked. Invalid/inactive/ambiguous local users are refused.
  Password attempts are rate-limited with the existing process-local limiter.

The browser forwards Google's credential to the backend, never decodes it for
trust and never persists it. No credential or JWT appears in a URL. Google GIS
renders its own popup sign-in button; this is not a server OAuth redirect flow.
Only authentication is requested, not Google API access or offline scopes.

## Setup TODO - not performed by this PR

- [ ] Approve the identity model, first-link password confirmation and uniqueness
      rules. This PR must not merge or apply a migration before that decision.
- [ ] Approve an eligible HTTPS application origin for deployed use. A plain-HTTP
      private hostname is not supported by Google's web sign-in. Localhost is a
      development exception, not a production workaround. No DNS/TLS/infra work
      is included or authorized by this PR.
- [ ] Create/select a Google Cloud project and configure Google Auth Platform
      branding, audience (Internal only for a suitable Workspace organization,
      otherwise External), and test users when testing mode requires them.
- [ ] Create a Web application OAuth client. Add each exact eligible frontend
      origin, including scheme/port, as an Authorized JavaScript origin. GIS
      popup callback mode used here does not need an app redirect URI or a client
      secret. Do not put a client secret in a frontend bundle or PR.
- [ ] Configure GOOGLE_CLIENT_ID and comma-separated GOOGLE_ALLOWED_ORIGINS on
      the backend. Keep GOOGLE_SIGN_IN_ENABLED=false while preparing deployment.
      A matching host alone is insufficient: each origin must be allowlisted.
- [ ] After model approval, merge/deploy backend and apply its migration through
      the normal reviewed deployment. Verify existing password login still works.
- [ ] Deploy the dependent frontend, then deliberately enable Google sign-in.
- [ ] On the real eligible origin, test Google popup, CSRF/cookie behavior,
      explicit first link with password, returning sign-in, rejection cases,
      feature flags and password fallback. Mocked SDK tests are not Google E2E.
- [ ] Review privacy notice and any Google verification/publishing requirements
      for the chosen audience before expanding access. Request only sign-in
      identity, no broader API scopes.

## References

- https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
- https://developers.google.com/identity/gsi/web/reference/js-reference
- https://developers.google.com/identity/openid-connect/reference
- https://support.google.com/cloud/answer/15549257?hl=en
- https://docs.djangoproject.com/en/5.2/howto/csrf/
