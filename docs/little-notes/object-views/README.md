# Object views, preferences, theme and navigation

Five views: Default (the existing decision stage), Database (full rows: type, date, categories, topics, source), Light table (title/date/category, fits mobile), Cards (summary grid), Calendar (month by **saved date**). The calendar loads all pages in the month, not just the first30 objects. Select a day to list/open its objects. Other views keep30-object pagination.

The approved new model is `curator_view_preference`: UUID primary key, owner FK, object-type FK, view enum; unique (owner, object_type), database enum check. Missing row means Default. Preferences are private to each authenticated user, available to non-staff too. No content or taxonomy rewrite. Everything is not an object type: its current view is URL/session state only, not a database preference.

Theme is device-local (`little-notes-theme`), defaults to system preference and adds no DB field. A header sun/moon button changes it. Both palettes cover the admin/capture views as well.

Navigation follows the existing Little Grains native History API pattern under `/apps/little-notes`. Query parameters preserve type/category/tag/q/month/page/view/item/admin. Refresh, deep links and Back/Forward restore navigation without writing a preference. An explicit URL view wins; navigating to a type restores its saved choice. Typing search replaces history rather than adding one entry per letter. Open-object state is owner-checked by the existing detail API. Missing or inaccessible objects show an error. Draft capture input is not stored in URLs. Manage is staff-only, at the sidebar bottom with a gear, accessible in the mobile Types drawer.

## Verification

- `python manage.py test apps.curator --settings=apps.curator.test_settings`:46 API/model/copy tests, including privacy, enum validation, uniqueness, all view choices, and update-per-type behavior.
- `npm test`: navigation route round-trips and existing UI tests.
- `node object-views-visual-check.mjs`: synthetic data, Firefox and Chromium, widths320/390/1280, five views in both palettes, full-month35-object calendar, preference restore, reload, detail open/close, error handling, Everything no-write, item/admin deep links and Back/Forward.
- `node taxonomy-admin-visual-check.mjs`: existing create-only admin interactions still pass.
- `npm run build`: production build.

Screenshots use synthetic fixtures and desktop Firefox at phone-sized widths, not a physical Android device. Final pixels inspected before PR completion. Database rows intentionally allow internal horizontal scrolling on small screens; light table fits the viewport.
