import * as T from 'three';
import {THEMES} from '../../../scripts/artifacts/little-grains/data.js';
const SLOTS=[[0,0],[1,0],[-1,1],[0,-1],[0,1],[-1,0],[1,-1]];
export const polygons=THEMES.map(t=>{
 const edges=new Map(),r=1.035,tag=v=>v.map(n=>Math.round(n*1e5)).join(',');
 t.paths.forEach((_,i)=>{const[q,z]=SLOTS[i],cx=r*Math.sqrt(3)*(q+z/2),cz=r*1.5*z;
  const vs=Array.from({length:6},(_,k)=>[cx+Math.cos(Math.PI/6+k*Math.PI/3)*r,cz+Math.sin(Math.PI/6+k*Math.PI/3)*r]);
  vs.forEach((a,k)=>{const b=vs[(k+1)%6],ka=tag(a),kb=tag(b),id=[ka,kb].sort().join('|');if(edges.has(id))edges.delete(id);else edges.set(id,[a,b]);});});
 const remaining=[...edges.values()],out=[remaining.shift()];while(remaining.length){const tail=tag(out.at(-1)[1]);const i=remaining.findIndex(e=>tag(e[0])===tail);if(i<0)throw new Error('Open footprint');out.push(remaining.splice(i,1)[0]);}
 return out.map(([a])=>a.map(n=>n*1.13));
});
// Build the changed outer territory directly from its full concave boundary.
// The cell geometry, props, colours, lighting and plant placement are untouched.
const h=(x,z,s)=>{const v=Math.sin(x*127.1+z*311.7+s*74.7)*43758.5453;return v-Math.floor(v);};
export function reshape(geo,ti){
 const poly=polygons[ti], outline=!geo.getAttribute('color');
 if(outline){const shape=new T.Shape(),hole=new T.Path();poly.forEach(([x,z],i)=>{shape[i?'lineTo':'moveTo'](x,-z);hole[i?'lineTo':'moveTo'](x*.967,-z*.967);});shape.closePath();hole.closePath();shape.holes.push(hole);const out=new T.ShapeGeometry(shape).rotateX(-Math.PI/2);geo.dispose();return out;}
 const pos=[],col=[],theme=THEMES[ti],seed=ti+1,H=.55,bev=.12;
 const c1=new T.Color(theme.top2),c2=new T.Color(theme.top);
 const push=(p,c)=>{pos.push(...p);col.push(c.r,c.g,c.b);};
 const tri=(a,b,c,color,top=false)=>{if(top){const cross=(b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2]);if(cross<0)[b,c]=[c,b];}push(a,color);push(b,color);push(c,color);};
 const midpoint=(a,b)=>a.map((v,i)=>(v+b[i])/2);
 const topTri=(a,b,c,depth)=>{if(depth){const ab=midpoint(a,b),bc=midpoint(b,c),ca=midpoint(c,a);topTri(a,ab,ca,depth-1);topTri(ab,b,bc,depth-1);topTri(ca,bc,c,depth-1);topTri(ab,bc,ca,depth-1);return;}const x=(a[0]+b[0]+c[0])/3,z=(a[2]+b[2]+c[2])/3;const color=c1.clone().lerp(c2,h(Math.floor(x*.8),Math.floor(z*.8),seed+11)).multiplyScalar(.94+h(x*3.1,z*2.7,seed)*.12);tri(a,b,c,color,true);};
 const points=poly.map(([x,z])=>new T.Vector2(x*.97,z*.97));
 T.ShapeUtils.triangulateShape(points,[]).forEach(ids=>topTri(...ids.map(i=>[points[i].x,H,points[i].y]),2));
 const bands=[H-bev,(H-bev)*.72,(H-bev)*.44,(H-bev)*.2,0],strata=['#a97c52','#946a45','#7b5738','#5f432c'];
 const quad=(a,b,c,d,color)=>{tri(a,b,c,color);tri(a,c,d,color);};
 // Earcut uses a counterclockwise world-x/z contour. Walls face outward.
 const ccw=T.ShapeUtils.isClockWise(poly.map(([x,z])=>new T.Vector2(x,z)))?[...poly].reverse():poly;
 ccw.forEach((a,i)=>{const b=ccw[(i+1)%ccw.length];quad([a[0]*.97,H,a[1]*.97],[b[0]*.97,H,b[1]*.97],[b[0],H-bev,b[1]],[a[0],H-bev,a[1]],c1.clone().multiplyScalar(.82));bands.slice(0,-1).forEach((y,j)=>quad([a[0],y,a[1]],[b[0],y,b[1]],[b[0],bands[j+1],b[1]],[a[0],bands[j+1],a[1]],new T.Color(strata[j]).multiplyScalar(.96+h(a[0]*5,y*7+b[1],seed)*.08)));});
 const out=new T.BufferGeometry();out.setAttribute('position',new T.Float32BufferAttribute(pos,3));out.setAttribute('color',new T.Float32BufferAttribute(col,3));out.computeVertexNormals();out.computeBoundingSphere();geo.dispose();return out;
}
