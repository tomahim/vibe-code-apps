import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const source=readFileSync(new URL('src/apps/ecosystem-lowpoly/tour.js',root),'utf8');
const scenes=readFileSync(new URL('src/apps/ecosystem-lowpoly/scenes.js',root),'utf8');
const html=readFileSync(new URL('src/apps/ecosystem-lowpoly/tour.html',root),'utf8');
const artifact=readFileSync(new URL('src/artifacts/2026-11-15-ecosystem-growth-poc.html',root),'utf8');
const data=JSON.parse(readFileSync(new URL('public/artifact-assets/2026-11-15-ecosystem-growth-poc/low-poly/tour-data.js',root),'utf8').replace('window.LOWPOLY_DATA=','').replace(/;$/,''));
test('low-poly studies preserve the five-world twenty-theme inventory',()=>{
 assert.equal(data.worlds.length,5);assert.equal(Object.keys(data.names).length,20);
 assert.equal(new Set(data.worlds.flatMap(w=>w.themes)).size,20);
 for(const w of data.worlds)assert.equal(w.themes.length,4);
 for(const key of ['nature','chemistry','health','history','mathematics'])assert.ok(data.names[key]);
});
test('both variants are lazy and unload without replacing existing studies',()=>{
 for(const id of ['pane-worlds','pane-tour','pane-interiorlab','pane-lowpoly','pane-lowpolyall'])assert.ok(artifact.includes('id="'+id+'"'));
 for(const id of ['lpFrame','lpAllFrame'])assert.ok(artifact.includes("getElementById('"+id+"').src='about:blank'"));
 assert.ok(artifact.includes('tour.html?mode=atlas'));assert.ok(source.includes('if(!theme&&!atlasMode)return'));
 assert.ok(statSync(new URL('public/artifact-assets/2026-11-15-ecosystem-growth-poc/low-poly/low-poly-tour.js',root)).size<650000);
});
test('placeholder labels are honest and controls include touch and reduced motion',()=>{
 assert.ok(source.includes('lesson spot')||source.includes('Lesson spot'));assert.ok(html.includes('no lesson content connected'));assert.ok(html.includes('No lesson content or progress data'));
 assert.ok(source.includes('pointers.size===2'));assert.ok(source.includes('prefers-reduced-motion: reduce'));assert.ok(source.includes('Math.max(-24,Math.min(24,'));assert.ok(source.includes('Math.min(1.75,'));
 for(const f of [source,scenes]){assert.ok(!f.includes('TextureLoader'));assert.ok(!f.includes('fetch('));}
});

test('each theme has a simple scene with named lesson spots and appears in ten stages',()=>{
 for(const key of Object.keys(data.names)){const re=new RegExp('\\n'+key+':\\{g:');assert.ok(re.test(scenes),key);}
 const body=scenes.slice(scenes.indexOf('export const THEMES'),scenes.indexOf('P.fall='));
 for(const key of Object.keys(data.names)){const start=body.indexOf('\n'+key+':{g:');const end=body.indexOf('\n',start+2);const line=body.slice(start,end);const spots=(line.match(/,'[A-Z][^']+'(?:,1)?\]/g)||[]).length;assert.ok(spots>=4,key+' needs at least four lesson spots, has '+spots);}
 assert.ok(html.includes('type="range" min="1" max="10"'));assert.ok(source.includes('setStage'));assert.ok(scenes.includes('applyStage'));
 assert.ok(html.includes('Compact names sit in front'));
});
