/* Distinguish a deliberate tap from the click a browser may emit after a gesture.
   Does not prevent native zoom, scrolling, pointer events or keyboard activation. */
(function (global) {
 'use strict';
 function install(root, options) {
  if (!root || root.__sceneTapGuard) return root && root.__sceneTapGuard;
  const doc=root.ownerDocument, clock=()=>performance.now();
  const threshold=options?.threshold || 8, pointers=new Map();
  let gesture=false, blockedUntil=0, startedHere=false;
  function block(){gesture=true;blockedUntil=clock()+700;}
  function down(e){
   if(options?.enabled&&!options.enabled())return;
   const inside=root.contains(e.target);
   if(!pointers.size){gesture=false;blockedUntil=0;startedHere=inside;}
   if(!startedHere&&!inside)return;
   startedHere=true;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(pointers.size>1)block();
  }
  function move(e){const start=pointers.get(e.pointerId);if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>threshold)block();}
  function up(e){if(!pointers.has(e.pointerId))return;if(e.type==='pointercancel')block();else move(e);pointers.delete(e.pointerId);if(gesture)blockedUntil=clock()+700;}
  function touch(e){if(root.contains(e.target)&&e.touches.length>1)block();}
  function click(e){
   if(options?.enabled&&!options.enabled())return;
   // detail=0 is keyboard/programmatic activation, not a residual pointer click.
   if(e.detail===0)return;
   if((pointers.size&&gesture)||clock()<blockedUntil){e.preventDefault();e.stopImmediatePropagation();}
  }
  doc.addEventListener('pointerdown',down,true);doc.addEventListener('pointermove',move,true);
  doc.addEventListener('pointerup',up,true);doc.addEventListener('pointercancel',up,true);
  root.addEventListener('touchstart',touch,{capture:true,passive:true});
  root.addEventListener('click',click,true);
  const api={destroy(){doc.removeEventListener('pointerdown',down,true);doc.removeEventListener('pointermove',move,true);doc.removeEventListener('pointerup',up,true);doc.removeEventListener('pointercancel',up,true);root.removeEventListener('touchstart',touch,true);root.removeEventListener('click',click,true);delete root.__sceneTapGuard;}};
  root.__sceneTapGuard=api;return api;
 }
 global.SceneTapGuard={install};
})(window);
