/* Real transparent botanical pieces on one fixed, genuinely sparse Nature base. */
(function(){
 'use strict';
 const a=window.HYBRID_PATCH_ASSETS;
 const groups=[
  // Around the old oak: canopy fragments belong to this lesson, not its neighbours.
  {key:'oak',items:[['pine',35,42,14,0],['pine',66,40,13,1],['fern',38,37,8,0],['fern',60,37,8,1],['leaves',40,25,14,2],['leaves',58,24,14,3],['leaves',45,17,16,4],['leaves',57,15,15,5],['leaves',48,11,17,6],['leaves',65,22,13,7],['leaves',35,18,13,8],['leaves',52,24,16,9],['pine',27,38,14,10],['fern',65,43,8,11],['purple',33,43,6,12]]},
  // Banks are separate from the pond and the bridge, which remain in the base.
  {key:'stream',items:[['fern',39,57,8,0],['fern',66,53,8,1],['yellow',38,54,6,2],['fern',68,59,8,3],['purple',41,63,7,4],['daisy',58,67,7,5],['fern',63,65,8,6],['yellow',45,66,6,7],['fern',38,61,9,8],['purple',70,55,6,9],['daisy',68,63,7,10],['fern',59,62,7,11],['yellow',36,58,6,12],['daisy',72,58,6,13]]},
  {key:'floor',items:[['fern',20,70,10,0],['mushroom',31,73,8,1],['fern',26,76,11,2],['log',27,68,11,3],['purple',17,75,7,4],['mushroom',35,77,9,5],['fern',34,70,10,6],['yellow',22,80,7,7],['daisy',39,74,8,8],['fern',15,68,10,9],['mushroom',23,73,8,10],['purple',29,82,7,11],['fern',36,81,10,12],['daisy',15,79,7,13],['fern',42,78,9,14]]}
 ];
 function progress(step){const p=(step-1)/9;return [Math.min(1,p*1.8),Math.max(0,Math.min(1,(p-.12)/.88)),Math.max(0,Math.min(1,(p-.48)/.52))];}
 function load(entry){return new Promise((resolve,reject)=>{const im=new Image();im.decoding='async';im.onload=async()=>{try{await im.decode();}catch(_){}resolve(im);};im.onerror=reject;im.src=entry.src;});}
 let promise;
 function ready(){return promise||(promise=Promise.all([load(a.base),...Object.values(a.sprites).map(load)]).then(([base,...images])=>({base,sprites:Object.fromEntries(Object.keys(a.sprites).map((key,i)=>[key,images[i]]))}))).catch(error=>{promise=null;throw error;});}
 function draw(ctx,w,h,step,loaded){
  const values=progress(step);ctx.clearRect(0,0,w,h);ctx.drawImage(loaded.base,0,0,w,h);
  // Each item is a real alpha cutout. Density changes at fixed plant positions.
  const active=[];groups.forEach((g,index)=>{const v=values[index];g.items.forEach((item,j)=>{const threshold=(j+.6)/g.items.length;if(v>=threshold)active.push({item,group:index});});});
  active.sort((a,b)=>a.item[2]-b.item[2]);
  for(const{item}of active){const[key,x,y,size]=item,im=loaded.sprites[key],sw=w*size/100,sh=sw*im.height/im.width;const top=key==='leaves'?Math.max(h*.025,y/100*h-sh*.55):y/100*h-sh;ctx.drawImage(im,x/100*w-sw/2,top,sw,sh);}
  return values;
 }
 window.HybridLessonPatches={ready,draw,progress,regions:a.regions,bytes:a.base.bytes+Object.values(a.sprites).reduce((n,v)=>n+v.bytes,0)};
})();
