import {createGarden} from './shape-garden.js';
import {THEMES} from '../../../scripts/artifacts/little-grains/data.js';
import {polygons,reshape} from './shape-footprints.js';

// Identical illustrative library, fresh-season scenery and progress in both modes.
// The optional shape callback touches only the outer theme slab and its outline.
const state={week:16,playing:false},mount=document.querySelector('#mount');let garden,changing=false;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function render(shaped){
 if(changing)return;changing=true;
 const previous=garden?{view:{...garden.view},progress:garden.progressSnapshot(),camera:garden.camera.position.clone(),target:garden.controls.target.clone()}:null;
 document.querySelectorAll('[data-shape]').forEach(b=>b.disabled=true);
 garden?.dispose();
 garden=createGarden({container:mount,profile:innerWidth<700?'mobile':'desktop',state,reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,themeShape:shaped?reshape:null,displayProgress:previous?.progress});
 window.__shapeGarden=garden;
 if(previous){
  const v=previous.view;
  if(v.level==='theme')garden.goTheme(v.ti,0);
  if(v.level==='path'){
   garden.goPath(v.ti,v.pi);
   while(!garden.ready())await wait(30);
   if(v.lesson>=0){garden.selectLesson(v.lesson);while(!garden.ready())await wait(30);}
  }
  garden.camera.position.copy(previous.camera);garden.controls.target.copy(previous.target);garden.controls.update();
 }
 document.querySelectorAll('[data-shape]').forEach(b=>{b.setAttribute('aria-pressed',String((b.dataset.shape==='paths')===shaped));b.disabled=false;});
 changing=false;
}
document.querySelectorAll('[data-shape]').forEach(b=>b.onclick=()=>render(b.dataset.shape==='paths'));
render(true);
window.__shapeExperiment={counts:THEMES.map((t,i)=>({name:t.title,paths:t.paths.length,outlineVertices:polygons[i].length})),polygons};
new ResizeObserver(([e])=>{mount.style.top=e.target.getBoundingClientRect().height+'px';}).observe(document.querySelector('.experiment-bar'));
