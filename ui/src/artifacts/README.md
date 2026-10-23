# Artifacts

Standalone web design experiments, automatically listed at `/artifacts`.

## Add an experiment

1. Put a single HTML file directly in this folder, named `YYYY-MM-DD-short-name.html`, for example `2026-10-24-color-playground.html`.
2. Include its CSS in `<style>` and JavaScript in `<script>`. No React component, route registration, dependencies, or backend is needed.
3. Optionally add a JSON file with the **same basename**, such as `2026-10-24-color-playground.json`:

   ```json
   {
     "title": "Color Playground",
     "description": "An interactive study of color and contrast.",
     "date": "2026-10-24",
     "tags": ["color", "interactive", "typography"]
   }
   ```

Every metadata field is optional. Without JSON, the filename supplies the title and date. `date` overrides the filename date; use a real calendar date in `YYYY-MM-DD` format. Files without a valid date appear as **Undated** at the end of both sort orders. The filename (without `.html`) is also the permanent URL slug, so avoid renaming published artifacts.

Only HTML and matching JSON files directly in this folder are discovered. Tags are trimmed, lowercased, and deduplicated. The archive offers tag and year filters, newest/oldest sorting, and case-insensitive search across titles, descriptions, tags, and dates. Search words are combined with AND; search, tag, and year filters combine together.

Run `npm run dev` from `ui/` and visit `/artifacts`. New files are discovered by Vite; production additions require a build/deploy (`npm run build`). No central catalog needs updating.

## HTML template

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Color Playground</title>
  <style>
    body { margin: 0; padding: 2rem; font-family: system-ui; }
    button { font: inherit; }
  </style>
</head>
<body>
  <h1>Color Playground</h1>
  <button id="change">Try a color</button>
  <script>
    document.querySelector('#change').addEventListener('click', () => {
      document.body.style.background = `hsl(${Math.random() * 360} 70% 90%)`;
    });
  </script>
</body>
</html>
```

## Preview behavior

HTML loads on demand and runs inside a full-height iframe at `/artifacts/<filename-without-extension>`. Its styles cannot affect the gallery. The iframe enables scripts but keeps an opaque origin: parent-page access, cookies, local storage, popups, form submissions, and top-level navigation are unavailable. Keep interactions in memory and within the experiment. This is a design playground, not an application backend.

Use inline SVG or data URLs for images if you want to keep the artifact entirely self-contained. Relative asset paths resolve against the preview page URL, **not this source folder**; avoid them. External services may require CORS support for an opaque origin. For a dependable offline experiment, avoid network dependencies entirely. Include responsive styles, keyboard focus states, and reduced-motion handling for animations.

`2026-10-23-devflow.html` is the first example: a self-contained interpretation of the supplied DevFlow Overview screenshot, with generated demo data, repository/team/time filters, expandable lists, and PR detail dialogs. Its avatars use initials so no remote images are required. It opens directly from disk as well as in the archive.

Discovery and filtering live in `../pages/Artifacts.jsx` and `../pages/artifact-catalog.js`. The archive and Gallery share `../collection-theme.css`; individual experiments own their own visual theme.
