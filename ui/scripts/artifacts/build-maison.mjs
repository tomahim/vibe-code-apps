// Regenerate the standalone HTML after editing its readable source or shell.
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const result=await build({entryPoints:[root+'scripts/artifacts/maison-des-heures.js'],bundle:true,minify:true,format:'iife',write:false,legalComments:'inline'});
const shell=await readFile(root+'scripts/artifacts/maison-des-heures.template.html','utf8');
await writeFile(root+'src/artifacts/2026-10-25-maison-des-heures.html',shell.replace('/*BUNDLE*/',()=>result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script').replace(/[ \t]+$/gm,'')));
