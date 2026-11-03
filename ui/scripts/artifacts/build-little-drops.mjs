// Rebuild only when intentionally updating the frozen artifact, not on every deploy.
import {build} from 'esbuild';
import {writeFile} from 'node:fs/promises';
const result=await build({entryPoints:['src/artifacts/little-drops-source/entry.jsx'],bundle:true,write:false,outdir:'archive',minify:true,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},legalComments:'inline'});
const js=result.outputFiles.find(f=>f.path.endsWith('.js')).text.replace(/<\/script/gi,'<\\/script');
const css=result.outputFiles.find(f=>f.path.endsWith('.css')).text;
await writeFile('src/artifacts/2026-11-03-little-drops.html',`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Little Drops - preserved study</title><style>html,body{margin:0} ${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`);
