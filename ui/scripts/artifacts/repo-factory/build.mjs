// Regenerate the standalone artifact HTML after editing the readable sources in this folder.
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const here = root + 'scripts/artifacts/repo-factory/';
const out = root + 'src/artifacts/2026-10-30-repo-factory.html';
const result = await build({ entryPoints: [here + 'main.js'], bundle: true, minify: true, format: 'iife', write: false, legalComments: 'inline' });
const shell = await readFile(here + 'template.html', 'utf8');
await writeFile(out, shell.replace('/*BUNDLE*/', () => result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script').replace(/[ \t]+$/gm, '')));
console.log('wrote', out);
