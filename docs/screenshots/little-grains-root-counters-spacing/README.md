# Root counters spacing fix

Local Chromium screenshots with synthetic rewards (1284 drops / 212 carrots)
and seven themes at 20% card-reading progress. These are not production accounts
or evidence of production state.

- `mobile-root-before.png`: 390 × 844 garden root before the fix. The drops /
  carrots chips sat at `top: 56px`, a full breadcrumb-height below the header,
  because that offset was still reserved for the root Garden pill removed in
  #423.
- `mobile-root-after.png`: same fixture after the fix. With the crumbs pill
  hidden at the root, the chips move up to `top: 10px`.
- `mobile-path-after.png`: deeper Garden / theme / path levels still show the
  breadcrumbs and keep the chips at `top: 56px`, clear of the pill.

Desktop is unchanged: crumbs and chips share the top row there, so no offset
was reserved. Headless Chromium only; no physical Android Firefox or
production end-to-end verification is claimed.
