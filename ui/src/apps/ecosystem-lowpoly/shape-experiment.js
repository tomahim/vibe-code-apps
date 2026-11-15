import {createGarden} from './shape-garden.js';
import {THEMES} from './shape-data.js';
import {polygons,interlocking,reshape,compactCenters} from './shape-footprints.js';

// Identical illustrative library, fresh-season scenery and progress in every mode.
// The shape callbacks touch only the outer theme slab and its outline.
const state={week:16,playing:false,group:-1},mount=document.querySelector('#mount');let garden,changing=false;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const MODES={compactfocus:{shape:null,compact:true,groups:true},compact:{shape:null,compact:true},hex:{shape:null},paths:{shape:reshape},interlock:{shape:(g,ti)=>reshape(g,ti,interlocking[ti])},groups:{shape:(g,ti)=>reshape(g,ti,interlocking[ti]),groups:true}};
async function render(mode){
 if(changing)return;changing=true;
 const previous=garden?{view:{...garden.view},compact:garden.compact,progress:garden.progressSnapshot(),camera:garden.camera.position.clone(),target:garden.controls.target.clone()}:null;
 document.querySelectorAll('[data-shape]').forEach(b=>b.disabled=true);
 garden?.dispose();
 const m=MODES[mode]||MODES.paths;
 garden=createGarden({container:mount,profile:innerWidth<700?'mobile':'desktop',state,reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,themeShape:m.shape,displayProgress:previous?.progress,groupFocus:!!m.groups,compact:!!m.compact});
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
  if(previous.compact!==!!m.compact&&v.level==='garden')garden.goGarden(0);
  if(m.groups&&state.group>=0&&garden.view.level==='garden')garden.setGroup(state.group,0);
 }
 document.querySelectorAll('[data-shape]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.shape===mode));b.disabled=false;});
 changing=false;
}
document.querySelectorAll('[data-shape]').forEach(b=>b.onclick=()=>render(b.dataset.shape));
render(MODES[location.hash.slice(1)]?location.hash.slice(1):'paths');
window.__shapeExperiment={counts:THEMES.map((t,i)=>({name:t.title,paths:t.paths.length,outlineVertices:polygons[i].length,interlockVertices:interlocking[i].length})),polygons,interlocking,compactCenters};
new ResizeObserver(([e])=>{mount.style.top=e.target.getBoundingClientRect().height+'px';}).observe(document.querySelector('.experiment-bar'));
