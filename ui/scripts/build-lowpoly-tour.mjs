import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {build} from 'esbuild';
const src=await readFile('src/artifacts/2026-11-15-ecosystem-growth-poc.html','utf8');
const raw=src.match(/var FW_DATA=(\{.*?\});<\/script>/s);if(!raw)throw new Error('world inventory missing');
const data=JSON.parse(raw[1]);
const names={nature:'Nature',biology:'Biology & Life',ocean:'Ocean',climate:'Climate & Environment',space:'Space & Astronomy',geology:'Geology & Earth',physics:'Physics & Energy',chemistry:'Chemistry',sport:'Sport',health:'Health & Body',mind:'Mind & Psychology',cooking:'Cooking & Food',languages:'Languages',art:'Art & Design',music:'Music',history:'History',technology:'Technology & AI',engineering:'Engineering & Invention',mathematics:'Mathematics',economics:'Economics & Money'};
const dir='public/artifact-assets/2026-11-15-ecosystem-growth-poc/low-poly/';await mkdir(dir,{recursive:true});
await writeFile(dir+'tour-data.js','window.LOWPOLY_DATA='+JSON.stringify({worlds:data.worlds.map(({key,name,themes})=>({key,name,themes})),names})+';');
await copyFile('src/apps/ecosystem-lowpoly/tour.html',dir+'tour.html');
await build({entryPoints:['src/apps/ecosystem-lowpoly/tour.js'],outfile:dir+'low-poly-tour.js',bundle:true,format:'iife',minify:true,target:'es2022',legalComments:'eof'});

await copyFile('src/apps/ecosystem-lowpoly/shapes.html',dir+'shapes.html');
await build({entryPoints:['src/apps/ecosystem-lowpoly/shape-experiment.js'],outfile:dir+'shape-experiment.js',bundle:true,format:'iife',minify:true,target:'es2022',legalComments:'eof'});

// Garden family preview: five landscape families in the real garden scene (Compact + focus).
const famDir='public/artifact-assets/2026-11-15-garden-families/';await mkdir(famDir,{recursive:true});
await copyFile('src/apps/ecosystem-lowpoly/families.html',famDir+'families.html');
await build({entryPoints:['src/apps/ecosystem-lowpoly/families.js'],outfile:famDir+'families.js',bundle:true,format:'iife',minify:true,target:'es2022',legalComments:'eof'});
