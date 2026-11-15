/* Request fullscreen from the original click, preserving its user activation.
   Browser Escape and the visible exit button both restore the same journey. */
(function(global){
 'use strict';
 function install({enter,exit,announce}){
  const doc=enter.ownerDocument,html=doc.documentElement;
  const sync=()=>{const active=doc.fullscreenElement===html;html.classList.toggle('image-only',active);exit.hidden=!active;enter.setAttribute('aria-pressed',String(active));if(!active)enter.focus({preventScroll:true});};
  enter.onclick=async()=>{
   try{if(!html.requestFullscreen)throw Error('unsupported');await html.requestFullscreen();}
   catch(_){announce.textContent='Fullscreen is not available in this browser. Your view has not changed.';}
  };
  exit.onclick=()=>{if(doc.fullscreenElement)doc.exitFullscreen();};
  doc.addEventListener('fullscreenchange',sync);
  doc.addEventListener('fullscreenerror',()=>{announce.textContent='Fullscreen could not open. Your view has not changed.';});
 }
 global.HybridImageOnly={install};
})(window);
