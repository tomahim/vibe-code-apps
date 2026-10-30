# The Story Room

A frontend-only app at `/apps/story-shelf`, listed in the main app gallery. No API, database, storage, new account, paid resource or infrastructure is needed. All book text and pictures ship in the Vite build. It works without the API, including a direct route visit. This does not install a service worker: opening the site for the first time still needs its static files.

## Interaction and rendering

- A real Three.js cabinet has solid shelves, books, cover textures, shadows, bounded orbit controls and pointer-raycast book selection. Drag to change your view; tap a cover to choose it.
- The HTML cover collection below provides larger readable covers, native buttons, keyboard access and a WebGL-free browsing route. Category buttons filter this collection and dim unrelated books in the 3D room.
- Choosing a book first places its closed, titled cover on a wooden table. The cover opens before showing the story.
- The book cover, paper depth and page-turn transitions use CSS 3D transforms, not a fully WebGL book mesh. Desktop uses side-by-side leaves; mobile stacks the two leaves so the text remains readable. This is an intentional readability trade-off, not a claim that the mobile layout is an all-3D camera scene.
- Real Three.js paper sculptures sit above the illustration on each spread: a printing press, stylized fossil spiral, acorn/seedling/oak, or alpine mountain. Drag to rotate. The oak changes with the story; the mountain gains a stream in later pages. These are original simplified teaching sculptures, not scientific reconstructions.
- Buttons, arrow keys and horizontal swipes turn pages. The final page returns to the shelves. Escape returns to the collection; focus returns to the selected cover. Canvas gestures do not also turn the page.
- Reduced-motion settings remove cover/page animation and automatic model rotation. Pause motion stops auto-rotation but keeps deliberate dragging. A WebGL failure leaves every illustration and word available.
- Render resolution is capped, only one room/model is mounted at a time, hidden/offscreen canvases skip renders, and renderers, controls, textures and geometry are disposed on exit.

## Editorial assumptions

English, approximately ages 7-10, four books, five story pages per book, two paragraphs and a curiosity prompt per page. Two books are historical fiction, with invented child characters and meetings explicitly distinguished from real background facts. Nature and mountain books are imagined journeys explaining real processes. No progress tracking, audio or backend editor in this first version.

1. **The Printer's Secret**: a fictional child visits a Mainz print workshop around 1450. Gutenberg's system is framed as a European development, not the invention of all printing. Asian printing predates it.
2. **Mary & the Stone Sea**: a fictional companion explores Mary Anning's world. An ichthyosaur is a marine reptile, not a dinosaur. Includes coastal safety advice.
3. **The Acorn's Big Adventure**: one possible seed-to-oak journey, without implying that all acorns grow or that growth takes only a season.
4. **A Mountain's Drop of Water**: one possible water-cycle route, with clear distinctions between invisible water vapour, visible mist, clouds and precipitation.

## Factual sources (checked 30 October 2026)

Sources also appear in the in-app About & sources notes. Text is original, not copied from these publications.

- [German National Library, European type printing](https://mediengeschichte.dnb.de/DBSMZBN/Content/EN/Printing/04-europaeischer-typendruck-en.html): Mainz, around 1450; standardized reusable metal type, press, coordinated production; earlier Korean type printing.
- [Natural History Museum, Mary Anning](https://www.nhm.ac.uk/discover/mary-anning-unsung-hero.html): born in Lyme Regis in 1799; fossil observation, marine reptiles, historical recognition. The invented meeting is not presented as an event in Anning's life.
- [RHS, watch acorns germinate](https://www.rhs.org.uk/education-learning/school-gardening/resources/gardening-club/planting-acorns): roots and shoots, germination and seedling care.
- [Woodland Trust, English oak](https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/british-trees/a-z-of-british-trees/english-oak/): acorns, lobed leaves, squirrels, woodland habitats and long-lived tree growth.
- [USGS, Water cycle](https://www.usgs.gov/water-science-school/water-cycle): stores and pathways, solar energy, gravity, changes of state, evaporation, condensation, snowmelt and precipitation. The older special-topics URL timed out; this current source was retrieved successfully.

## Art and design provenance

All 24 local WebP images are original AI-generated storybook illustrations made for this app, generated as four six-panel sheets and cropped/optimized locally. Six images per book: one cover and five story illustrations. They are fictional illustrations, not documentary evidence or exact historical reconstructions. There are no scraped reference images, external model downloads, third-party artwork or fonts in this app's content. See `images/README.md` for the asset inventory and generation notes.

The physical-book interaction was inspired by Thomas's supplied reference, [Techartist's Still Here](https://iamtechartist.com/dinosaurs-to-birds/). Its live cover, table, page turn and raised model interactions were inspected. No reference source code, images, skeleton models, sounds, or text are reused. This app deliberately takes a different, warm illustrated-library direction. It does not claim parity with the reference's detailed holographic dinosaur models or cinematic all-WebGL page construction.

## Add a book

Add one `books/<slug>.md` and an entry in `manifest.json`. Each page begins with `# Title`, paragraphs follow, and the last `> ...` line is the curiosity prompt. Separate pages with a line containing `---page---`. This small Markdown subset is parsed as text into React nodes, not injected as HTML. Add `<art>-0.webp` for the cover and `<art>-1.webp` through `<art>-5.webp` for story pages. Use a current category or add a category to `content.js` and the shelf scene. No server changes.

## Checks

From `ui/`:

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_CHROME_PATH=/usr/bin/google-chrome npm run test:browser -- story-shelf.spec.js
npx playwright install firefox
xvfb-run -a npx playwright test --config playwright.books-firefox.config.mjs
```

Chromium and Firefox were checked at desktop, 390px mobile and 320px narrow widths. Firefox here needs a display for software WebGL: native headless Firefox cannot create a WebGL2 context on this host, so headed Firefox under Xvfb is the checked 3D route. This is desktop Firefox with a narrow viewport, not a claim of a physical Android-device test.

Browser coverage: gallery route, category filtering, all four books/all 20 story pages, closed cover, opening transition, page animation, keyboard controls, return focus, real WebGL canvases, pointer picking on geometry, reduced motion and WebGL-unavailable fallback. Screenshots are actual local app renders, not proxy mockups. Private deployment was not changed or inspected.

## Reading modes

A **Reading mode** switch sits above the book (choice is remembered in `localStorage`).

- **Readable** (default): the CSS 3D book with text, illustration and the draggable paper theatre.
- **Immersive 3D**: `ImmersiveBook.jsx`, a full WebGL scene. A book lies on a wooden table; tapping the cover opens it, pages bend as they turn (a deforming strip with picture front and text back), and the paper sculpture for each page rises from the pages with drifting glints. Click or tap the right page for next and the left for previous; drag to look around. Page textures are drawn from the same Markdown and bundled images (`pageTextures.js`); sculptures come from `models.js`, shared with the readable theatre.
- Text is always available as real HTML: below the canvas on narrow screens, visually hidden on wide ones. If WebGL fails, the app falls back to Readable with a note. Reduced motion shortens animation and stops bobbing and glints.
