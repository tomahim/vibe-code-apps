// Build the single-file Valley Fold artifact from src parts.
// Run from the repo root: node ../valley-fold/build.mjs  (paths below are absolute)
import { readFile, writeFile } from 'node:fs/promises';

const SRC = '/home/sandbox/valley-fold/src';
const OUT = '/home/sandbox/vibe-code-apps/ui/src/artifacts/2026-11-09-valley-fold.html';

const [tpl, three, css, engine, models, app] = await Promise.all([
  'template.html', 'three-block.html', 'style.css', 'engine.js', 'models.js', 'app.js'
].map(f => readFile(`${SRC}/${f}`, 'utf8')));

const esc = s => s.replace(/<\/script/gi, '<\\/script');
const html = tpl
  .replace('/*STYLE*/', () => css)
  .replace('/*THREE*/', () => three.trimEnd())
  .replace('/*ENGINE*/', () => esc(engine))
  .replace('/*MODELS*/', () => esc(models))
  .replace('/*APP*/', () => esc(app));

await writeFile(OUT, html);
console.log('wrote', OUT, html.length, 'bytes');
