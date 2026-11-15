// Shared-edge Voronoi territories. Neighbours meet along the same irregular border,
// with a narrow inset seam rather than detached regular hexagons.
export function territories(seeds,outline){
 return seeds.map(([cx,cz],i)=>{
  let p=outline.map(v=>v.slice());
  seeds.forEach(([x,z],j)=>{if(i===j)return;const a=x-cx,b=z-cz,c=(x*x+z*z-cx*cx-cz*cz)/2;const q=[];
   p.forEach((u,k)=>{const v=p[(k+1)%p.length],du=a*u[0]+b*u[1]-c,dv=a*v[0]+b*v[1]-c;
    if(du<=0)q.push(u);if((du<0)!==(dv<0)){const t=du/(du-dv);q.push([u[0]+(v[0]-u[0])*t,u[1]+(v[1]-u[1])*t]);}});p=q;});
  p=p.filter((v,k)=>Math.hypot(v[0]-p[(k+1)%p.length][0],v[1]-p[(k+1)%p.length][1])>1e-5);
  const poly=p.map(([x,z])=>[(x-cx)*.987,(z-cz)*.987]);
  const radius=Math.min(...poly.map((a,k)=>{const b=poly[(k+1)%poly.length];return Math.abs(a[0]*b[1]-a[1]*b[0])/Math.hypot(b[0]-a[0],b[1]-a[1]);}));
  return {x:cx,z:cz,poly,radius};
 });
}
export const MAP_SEEDS=[[-8,-12],[-1,-13],[6,-12],[12,-8],[-12,-6],[-5,-6],[2,-6],[8,-2],[-13,1],[-6,1],[1,1],[13,4],[-10,8],[-3,8],[5,7],[10,11],[-6,15],[1,15],[6,17],[-12,14]];
export const MAP_EDGE=[[-16,-10],[-10,-17],[-1,-18],[8,-16],[15,-10],[17,-1],[16,8],[11,17],[4,21],[-5,20],[-14,18],[-18,10],[-17,1],[-19,-4]];
export const TOUR_SEEDS=[[-3,-2.8],[2.9,-2.4],[-3.5,3],[2.7,3.5]];
export const TOUR_EDGE=[[-7,-4],[-4,-7],[1,-7.5],[6,-6],[7.4,-1],[7,4],[4.8,7],[0,7.8],[-5,7],[-7.7,3],[-7.2,0]];
