/* Scene-only 2D camera. Pointer Events work for touch, pen and mouse, including
   when the gesture begins on a marker. The host page is never scaled. */
(function(global){
 'use strict';
 function install({root,layer,zoomIn,zoomOut,reset,level,swipe,changed}){
  const pointers=new Map();let zoom=1,x=0,y=0,start=null,multi=false,moved=false;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  function apply(){
   const maxX=(layer.offsetWidth*zoom-Math.min(layer.offsetWidth,root.clientWidth))/2;
   const maxY=(layer.offsetHeight*zoom-Math.min(layer.offsetHeight,root.clientHeight))/2;
   x=clamp(x,-Math.max(0,maxX),Math.max(0,maxX));y=clamp(y,-Math.max(0,maxY),Math.max(0,maxY));
   layer.style.setProperty('--scene-zoom',zoom);
   layer.style.transform=`translate(${x}px,${y}px) scale(${zoom})`;
   level.value=Math.round(zoom*100)+'%';zoomOut.disabled=zoom<=1;zoomIn.disabled=zoom>=3.5;
   root.style.cursor=zoom>1?'grab':'';
  }
  function zoomAt(value,cx,cy){
   const next=clamp(value,1,3.5),rect=layer.getBoundingClientRect();
   if(cx!==undefined){x+=(cx-(rect.left+rect.width/2))*(1-next/zoom);y+=(cy-(rect.top+rect.height/2))*(1-next/zoom);}
   zoom=next;if(zoom===1)x=y=0;apply();changed?.();
  }
  function resetView(){zoom=1;x=y=0;start=null;apply();}
  const pair=()=>{const[a,b]=[...pointers.values()];return {d:Math.hypot(a.x-b.x,a.y-b.y),x:(a.x+b.x)/2,y:(a.y+b.y)/2};};
  root.addEventListener('pointerdown',e=>{
   if(e.button!==0||e.target.closest('#back,#natureModes'))return;
   if(!pointers.size){multi=false;moved=false;start={x:e.clientX,y:e.clientY,zoom};}
   pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(pointers.size>1){multi=true;start=null;}
  });
  root.ownerDocument.addEventListener('pointermove',e=>{
   const prev=pointers.get(e.pointerId);if(!prev)return;
   const before=pointers.size===2?pair():null;
   pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>8)moved=true;
   if(pointers.size===2){
    const after=pair();x+=after.x-before.x;y+=after.y-before.y;
    if(before.d>0)zoomAt(zoom*after.d/before.d,after.x,after.y);
   }else if(pointers.size===1&&zoom>1){x+=e.clientX-prev.x;y+=e.clientY-prev.y;apply();}
   if(multi||moved){try{root.setPointerCapture(e.pointerId);}catch(_){/* pointer may have been canceled */}}
  });
  function end(e){
   if(!pointers.has(e.pointerId))return;
   if(e.type==='pointerup'&&!multi&&start&&start.zoom===1&&zoom===1){
    const dx=e.clientX-start.x,dy=e.clientY-start.y;
    if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.5)swipe(dx<0?1:-1);
   }
   pointers.delete(e.pointerId);start=null;
   if(!pointers.size){multi=false;moved=false;}
  }
  root.ownerDocument.addEventListener('pointerup',end);
  root.ownerDocument.addEventListener('pointercancel',end);
  root.addEventListener('wheel',e=>{e.preventDefault();zoomAt(zoom*Math.exp(-e.deltaY*.002),e.clientX,e.clientY);},{passive:false});
  zoomIn.onclick=()=>zoomAt(zoom*1.25);zoomOut.onclick=()=>zoomAt(zoom/1.25);reset.onclick=resetView;
  apply();return {reset:resetView,reflow:apply,state:()=>({zoom,x,y,pointers:pointers.size})};
 }
 global.SceneViewport={install};
})(window);
