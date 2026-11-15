// Simple low-poly ecosystem scenes for the 20 themes, following the approved "Simple" designs.
// Every scenery item can be a lesson spot, and every item grows in over ten stages.
// Data only: no lesson content, progress or app data is connected.
import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const PAL={terra:'#c65d3b',terraD:'#a94a2e',sand:'#e5d4a8',pale:'#e7dcc3',moss:'#7d9c63',mossD:'#5f8660',oakA:'#8fae6b',oakB:'#a9c07c',pine:'#5f8660',pineD:'#486e55',trunk:'#8c6a4a',
rock:'#b6b1a2',rockD:'#8e8b82',snow:'#f3f5ef',ice:'#bcd8e6',iceD:'#8fbbd4',water:'#9ccbd6',waterD:'#6fa8bf',lagoon:'#8fd2cc',deep:'#2f6f93',gold:'#d9b95a',goldD:'#c49a3c',
purple:'#9a7bc0',purpleL:'#c3aadc',white:'#f4f1e6',pink:'#e5a6b0',orange:'#d98543',lava:'#ee7a35',basalt:'#5d5b60',basaltL:'#78757b',cobalt:'#4f78c4',sulfur:'#e6cf4a',acid:'#b5d24a',
mauve:'#9a6e66',rust:'#b8643f',strata1:'#c9784f',strata2:'#d99a6c',strata3:'#e8c79b',strata4:'#a8573a',indigo:'#2c3566',cream:'#f1e7cf',roof:'#c0704f',stone:'#d6cdb8',green:'#7da35f',
sunflower:'#e6b83a',lavender:'#8e7cc0',poppy:'#d9573a',daisy:'#f7f2df',brick:'#d19a7c',wheat:'#dcc16a',bamboo:'#b4c47a',rice:'#8fb86b',olive:'#9aa878',vine:'#6f9a52',mist:'#eef3ee',salt:'#d9d3e8',glow:'#f09a3e'};
const col=n=>PAL[n]||n;
const cache=new Map();
function mat(c,extra=''){const k=c+extra;if(!cache.has(k)){const m=new T.MeshStandardMaterial({color:c,roughness:1,flatShading:true});if(extra==='ds')m.side=T.DoubleSide;if(extra==='glow'){m.emissive=new T.Color(c);m.emissiveIntensity=.55;}if(extra==='soft'){m.transparent=true;m.opacity=.78;}cache.set(k,m);}return cache.get(k);}
function M(geo,c,g,x=0,y=0,z=0,extra=''){const m=new T.Mesh(geo,mat(col(c),extra));m.position.set(x,y,z);m.castShadow=extra!=='soft';m.receiveShadow=true;g.add(m);return m;}
const bx=(g,w,h,d,c,x,y,z)=>M(new T.BoxGeometry(w,h,d),c,g,x,y,z);
const ico=(g,r,c,x,y,z,sy=1,det=0)=>{const m=M(new T.IcosahedronGeometry(r,det),c,g,x,y,z);m.scale.y=sy;return m;};
const cone=(g,r,h,c,x,y,z,seg=5)=>M(new T.ConeGeometry(r,h,seg),c,g,x,y+h/2,z);
const cyl=(g,rt,rb,h,c,x,y,z,seg=6)=>M(new T.CylinderGeometry(rt,rb,h,seg),c,g,x,y+h/2,z);
const rockM=(g,r,c,x,z,s=1)=>{const m=M(new T.DodecahedronGeometry(r,0),c,g,x,r*.6,z);m.scale.set(s,.65*s,.85*s);m.rotation.y=x*3;return m;};

// Prop library. Each prop is built at the origin, base on the ground, about 2 units tall at scale 1.
const P={
oak:(g,c)=>{cyl(g,.13,.24,1.2,'#76563a',0,0,0,7);for(let j=0;j<4;j++){const a=j*1.9;const br=cyl(g,.06,.12,.85,'#876347',0,.65,0,5);br.rotation.set(Math.cos(a)*.55,0,Math.sin(a)*.55);}
 [[0,1.75,0,.95],[-.6,1.45,.1,.66],[.62,1.55,.05,.72],[-.1,1.45,-.55,.7],[.12,2.15,.1,.64]].forEach(([x,y,z,r],i)=>{const m=ico(g,r,['#78934b','#9bb55f','#a9be70','#627e41','#b7c77b'][i],x,y,z,.85,1);m.rotation.set(i*.4,i*1.7,0);});},
pine:(g,c)=>{const sn=c==='snow';cyl(g,.08,.12,.5,'trunk',0,0,0,5);cone(g,.8,1.1,sn?'#c6d7cb':'pine',0,.4,0);cone(g,.6,1,sn?'#e9efe0':'#6c966a',0,1.0,0);cone(g,.4,.9,sn?'snow':'#80a77b',0,1.55,0);},
blossom:g=>{cyl(g,.1,.16,.8,'trunk',0,0,0,5);ico(g,.8,'pink',0,1.35,0,.9);ico(g,.5,'#f0cfc4',.45,1.2,.1);ico(g,.4,'#e2939f',-.4,1.15,-.1);},
maple:g=>{cyl(g,.1,.16,.8,'trunk',0,0,0,5);ico(g,.78,'#d2763d',0,1.35,0,.9);ico(g,.5,'#e29b4c',.4,1.2,.1);},
palm:g=>{const t=cyl(g,.07,.12,1.7,'trunk',0,0,0,5);t.rotation.z=.12;for(let i=0;i<5;i++){const f=cone(g,.2,1,'#8fb06a',0,0,0,4);f.geometry.translate(0,.5,0);f.position.set(.2,1.7,0);f.rotation.set(0,i*1.26,1.35);}},
cypress:g=>{cone(g,.4,2.5,'#4f7658',0,0,0,6);},
bush:g=>{ico(g,.42,'#7da35f',0,.28,0,.75);ico(g,.3,'#93b574',.3,.22,.15,.7);},
emergent:g=>{cyl(g,.14,.22,2,'trunk',0,0,0,6);ico(g,1,'#4f9a6a',0,2.4,0,.55);ico(g,.6,'#69b27c',.5,2.2,.2,.6);},
bamboo:g=>{for(let i=0;i<5;i++){const h=1.8+((i*37)%7)/10,m=cyl(g,.05,.06,h,'bamboo',-.3+i*.15,0,((i*53)%5)/10-.2,5);m.rotation.z=(i-2)*.03;}},
mangrove:g=>{for(let i=0;i<6;i++){const a=i*1.05,r=cyl(g,.04,.07,1.1,'#7b5e44',Math.cos(a)*.35,.0,Math.sin(a)*.35,4);r.rotation.set(Math.sin(a)*.5,0,-Math.cos(a)*.5);}ico(g,.75,'#6fa263',0,1.5,0,.7);ico(g,.45,'#86b878',.4,1.3,.1,.8);},
olive:g=>{cyl(g,.1,.15,.55,'#8a7358',0,0,0,5);ico(g,.6,'olive',0,.95,0,.7);ico(g,.4,'#b2bd90',.35,.85,.1,.7);},
reeds:g=>{for(let i=0;i<7;i++){const m=cyl(g,.03,.04,.9+((i*29)%5)/10,'#a9b472',-.3+i*.1,0,((i*41)%5)/12-.15,4);m.rotation.z=(i-3)*.05;}},
fern:g=>{for(let i=0;i<4;i++){const f=cone(g,.15,.7,'#6c9a5c',0,0,0,4);f.geometry.translate(0,.3,0);f.position.set(0,.12,0);f.rotation.set(.9,i*1.57,0);}},
mushroom:(g,c)=>{cyl(g,.05,.06,.25,'cream',0,0,0,5);const k=cone(g,.26,.2,c==='glow'?'#7fe0c4':'#c86a3c',0,.2,0,6);if(c==='glow')k.material=mat('#7fe0c4','glow');cyl(g,.04,.05,.18,'cream',.3,0,.1,5);cone(g,.18,.14,c==='glow'?'#7fe0c4':'#d98a52',.3,.16,.1,6);},
log:g=>{const l=cyl(g,.22,.22,1.3,'#8a6a4c',0,.2,0,6);l.rotation.z=Math.PI/2;ico(g,.3,'moss',-.2,.45,0,.5);},
grass:g=>{for(let i=0;i<5;i++){const b=cone(g,.08,.55+((i*17)%4)/10,'#a7b568',-.3+i*.15,0,((i*31)%5)/10-.2,3);b.rotation.z=(i-2)*.12;}},
rock:(g,c)=>{rockM(g,.55,c==='terra'?'terra':(c==='white'?'#e4e1d6':'rock'),0,0);if(c==='terra')rockM(g,.25,'terraD',.5,.2);else rockM(g,.28,'rockD',.5,.25);},
cobble:g=>{rockM(g,.3,'rock',-.35,0);rockM(g,.35,'rockD',.1,.1);rockM(g,.25,'rock',.4,-.2);},
stones:g=>{rockM(g,.6,'#a9a59a',0,0,.9);rockM(g,.4,'rock',.65,.2);rockM(g,.32,'#8e8b82',-.55,.3);},
crystal:(g,c)=>{const cc=c==='white'?'#e8ecf6':'purple';for(let i=0;i<5;i++){const h=.8+((i*23)%7)/6,m=cone(g,.17,h,i%2?cc:(c==='white'?'#cfd8ec':'purpleL'),Math.cos(i*1.26)*.3,0,Math.sin(i*1.26)*.3,6);m.rotation.set(Math.sin(i)*.25,0,Math.cos(i*2)*.25);}},
geode:g=>{const s=M(new T.DodecahedronGeometry(1,0),'#8f8c88',g,0,.55,0);s.scale.set(1.05,.62,.9);const hole=M(new T.CylinderGeometry(.62,.62,.12,7),'#5d557a',g,0,.98,0);for(let i=0;i<6;i++){const m=cone(g,.12,.55+(i%3)*.15,i%2?'purple':'purpleL',Math.cos(i*1.05)*.32,.92,Math.sin(i*1.05)*.32,6);m.rotation.set(Math.sin(i*2)*.3,0,Math.cos(i*2)*.3);}},
ice:g=>{const a=M(new T.DodecahedronGeometry(1,0),'#c4dde8',g,0,.42,0);a.scale.set(1.2,.65,.85);const b=M(new T.IcosahedronGeometry(.85,0),'#f2f6f4',g,.04,.8,-.12);b.scale.set(1.2,.5,.9);},
iceberg:g=>{cone(g,.7,1,'#dcecf2',0,.1,0,4);cone(g,.4,.7,'ice',.5,.05,.1,4);},
crack:g=>{bx(g,.1,.06,1.6,'#4f7fa4',0,.03,0).rotation.y=.4;bx(g,.08,.06,.9,'#4f7fa4',.25,.03,.45).rotation.y=.9;},
basalt:g=>{[[0,0,1.3],[.42,.25,.9],[-.42,.2,1.6],[.1,-.45,.7],[-.2,.55,1.0],[.55,-.3,1.1],[-.55,-.35,.6]].forEach(([x,z,h],i)=>cyl(g,.24,.26,h,i%2?'basaltL':'basalt',x,0,z,6));},
seastack:g=>{cyl(g,.3,.4,2.2,'basalt',0,0,0,6);cyl(g,.26,.3,.3,'basaltL',0,2.2,0,6);},
mesa:(g,c)=>{const cs=c==='mauve'?['#8c5f5c','#a3706a','#b78479','#cf9b8b']:['strata1','strata2','strata3','strata2'];[[1.25,.45],[1.05,.45],[.85,.4],[.62,.35]].forEach(([r,h],i)=>cyl(g,r,r+.06,h,cs[i],0,[0,.45,.9,1.3][i],0,7));},
hoodoo:g=>{cyl(g,.3,.38,.5,'strata1',0,0,0,6);cyl(g,.22,.3,.5,'strata3',0,.5,0,6);cyl(g,.16,.22,.5,'strata2',0,1,0,6);cyl(g,.32,.2,.22,'strata4',0,1.5,0,6);},
fossil:g=>{rockM(g,.7,'strata3',0,0,1.1);const t=M(new T.TorusGeometry(.2,.06,4,10),'white',g,0,.55,.35);t.rotation.x=-.4;},
slot:g=>{bx(g,.3,.9,1.7,'#5a3a30',0,.45,0);bx(g,.5,1.1,.8,'strata4',-.35,.55,-.5);bx(g,.5,1.1,.8,'strata1',.35,.55,.5);},
peak:(g,c)=>{cone(g,1.7,3,'#9b9a94',0,0,0,5);cone(g,.7,1.1,'snow',0,1.9,0,5);cone(g,.9,1.6,'#a9a89f',1.3,0,.5,5);if(c==='flag'){cyl(g,.03,.03,.9,'#4a3f36',0,2.95,0,4);bx(g,.5,.3,.03,'terra',.25,3.65,0);}},
snowfield:g=>{cyl(g,1.2,1.3,.1,'snow',0,0,0,7);},
dome:g=>{cyl(g,.8,.88,.7,'white',0,0,0,8);const d=M(new T.SphereGeometry(.8,9,5,0,Math.PI*2,0,Math.PI/2),'white',g,0,.7,0);bx(g,.3,.6,.5,'glow',.4,1.1,0).material=mat('#f0b865','glow');},
cactus:g=>{bx(g,.26,1.3,.26,'#58805f',0,.65,0);bx(g,.4,.16,.16,'#58805f',-.28,.8,0);bx(g,.16,.45,.16,'#58805f',-.46,1,0);bx(g,.4,.16,.16,'#58805f',.26,.6,0);bx(g,.16,.4,.16,'#58805f',.42,.78,0);},
meteor:g=>{const m=ico(g,.4,'glow',0,.4,0,.9);m.material=mat('#f0a04a','glow');rockM(g,.3,'#6e4a44',.45,.15);},
crater:g=>{const t=M(new T.TorusGeometry(1.3,.32,5,9),'#8c5f5c',g,0,.15,0);t.rotation.x=Math.PI/2;cyl(g,1.25,1.25,.06,'salt',0,.02,0,9);},
stars:g=>{const pts=[[-1,2.6,0],[-.4,3.1,-.2],[.1,2.8,0],[.7,3.3,.1],[1.2,2.9,0]];const geo=new T.BufferGeometry().setFromPoints(pts.map(p=>new T.Vector3(...p)));g.add(new T.Line(geo,new T.LineBasicMaterial({color:'#f2ecd4'})));pts.forEach(p=>{M(new T.OctahedronGeometry(.1,0),'#fff7d6',g,...p).material=mat('#fff7d6','glow');});},
lavacrack:g=>{bx(g,1.9,.05,.12,'lava',0,.03,0).material=mat('#ee7a35','glow');bx(g,.9,.05,.1,'lava',.5,.03,.4).rotation.y=.6;bx(g,.8,.05,.1,'lava',-.6,.03,-.35).rotation.y=-.5;},
steam:g=>{cone(g,.3,1.6,'#f4f4f0',0,0,0,5).material=mat('#f4f4f0','soft');cone(g,.2,1.2,'#f4f4f0',.3,.4,.1,5).material=mat('#f4f4f0','soft');cyl(g,.25,.4,.25,'basalt',0,0,0,6);},
geyser:g=>{cyl(g,.4,.55,.3,'basaltL',0,0,0,7);cone(g,.28,2.2,'#f4f6f4',0,.3,0,6).material=mat('#f4f6f4','soft');ico(g,.35,'#f4f6f4',0,2.4,0,.8).material=mat('#f4f6f4','soft');},
pool:(g,c)=>{const cc={lagoon:'lagoon',deep:'deep',acid:'acid',cobalt:'cobalt',sulfur:'sulfur',water:'water',ice:'#a9d3e3',salt:'salt',sky:'#b9dbe4'}[c]||'water';cyl(g,1,1,.07,cc,0,0,0,9);},
coral:g=>{[[0,0,'#e8806e',.45],[.5,.2,'#e6b04a',.35],[-.45,.25,'#a87fc2',.4],[.15,-.5,'#e07fa2',.35],[-.3,-.35,'#58b8b0',.3]].forEach(([x,z,c,r])=>ico(g,r,c,x,r*.7,z,.9,0));},
fish:g=>{[[0,.9,0],[.5,1.1,.3],[-.4,.7,.35]].forEach(([x,y,z])=>{const f=cone(g,.1,.35,'#e98f46',x,y,z,4);f.rotation.z=Math.PI/2;});},
turtle:g=>{ico(g,.4,'#6c9a5c',0,.28,0,.5,0);ico(g,.14,'#8bb067',.45,.25,0,.8);},
deer:(g,c)=>{const b=c==='ibex'?'#cfc8b8':'#9a6b44';bx(g,.7,.32,.26,b,0,.62,0);[[-.28,-.09],[-.28,.09],[.28,-.09],[.28,.09]].forEach(([x,z])=>bx(g,.07,.5,.07,'#6e4a2f',x,.3,z));bx(g,.14,.4,.14,b,.4,.85,0).rotation.z=-.4;bx(g,.2,.14,.14,b,.55,1.05,0);bx(g,.03,.25,.03,'#7a5a3a',.5,1.25,.04);bx(g,.03,.25,.03,'#7a5a3a',.5,1.25,-.04);},
bird:g=>{const b=cone(g,.14,.4,'#d9482e',0,1.6,0,4);b.rotation.z=Math.PI/2;bx(g,.3,.03,.14,'#e9a23a',0,1.65,0);},
moss:g=>{const m=M(new T.SphereGeometry(.8,8,4,0,Math.PI*2,0,Math.PI/2),'#8ba96e',g,0,0,0);m.scale.set(1.1,.55,1);},
sandrings:g=>{[1.5,1.1,.7].forEach((r,i)=>{const t=M(new T.TorusGeometry(r,.035,3,18),'#cfc3a4',g,0,.04,0);t.rotation.x=Math.PI/2;});cyl(g,1.6,1.6,.04,'#ece2c6',0,0,0,12);},
screen:g=>{for(let i=0;i<4;i++)bx(g,.14,1.5,.1,'bamboo',-.6+i*.4,.75,0);bx(g,1.8,.08,.08,'#8a7a50',0,1.3,0);bx(g,1.8,.08,.08,'#8a7a50',0,.5,0);},
cottage:g=>{bx(g,1.4,1,1.05,'#e9dfc1',0,.5,0);const r=M(new T.ConeGeometry(1.2,.85,4),'roof',g,0,1.42,0);r.rotation.y=Math.PI/4;r.scale.z=.8;bx(g,.3,.7,.04,'#8a7a62',0,.35,.54);bx(g,.22,.28,.04,'#98b4b5',.42,.72,.54);bx(g,.2,.5,.2,'#b99a83',.45,1.55,-.15);},
farmhouse:g=>{bx(g,1.5,.95,1,'#eadcb2',0,.48,0);const r=M(new T.ConeGeometry(1.25,.8,4),'#b86f4b',g,0,1.35,0);r.rotation.y=Math.PI/4;r.scale.z=.78;bx(g,.28,.6,.04,'#8a6d50',0,.3,.52);},
columns:g=>{bx(g,2.3,.2,1.3,'stone',0,.1,0);[-.8,0,.8].forEach((x,i)=>cyl(g,.17,.2,[1.5,1.1,.7][i],'stone',x,.2,0,7));bx(g,1.2,.16,.5,'stone',-.5,1.78,0);},
aque:(g,c)=>{const cc=c==='bamboo'?'bamboo':'stone';[-.9,-.3,.3,.9].forEach(x=>bx(g,.2,.9,.3,cc,x,.45,0));bx(g,2.2,.14,.36,cc,0,.97,0);if(c==='bamboo')bx(g,2.2,.04,.1,'water',0,1.06,0);},
amphi:g=>{[[1.2,.2],[.95,.4],[.7,.6]].forEach(([r,h])=>M(new T.CylinderGeometry(r,r,h,10,1,false,Math.PI*.1,Math.PI*.8),'stone',g,0,h/2,0));},
boat:g=>{const h=cone(g,.45,1.2,'terra',0,.0,0,4);h.rotation.z=Math.PI/2;h.position.set(0,.25,0);bx(g,.05,1.1,.05,'#6a5a48',0,.8,0);const s=new T.Shape();s.moveTo(.06,.4);s.lineTo(.06,1.3);s.lineTo(.6,.4);M(new T.ShapeGeometry(s),'white',g,0,0,0,'ds');},
dock:g=>{bx(g,1.6,.1,.5,'#b79b72',0,.35,0);[-.7,0,.7].forEach(x=>bx(g,.08,.4,.08,'#8a7050',x,.15,.2));const h=cone(g,.3,.8,'terra',.2,0,.7,4);h.rotation.z=Math.PI/2;h.position.y=.2;},
flowers:(g,c)=>{const set={herb:['#7da35f','#9bbb6a','#cc7a4a'],mixed:['pink','daisy','lavender','sunflower'],tundra:['#c0576a','#8e6aa8','#cf8d74'],sun:['sunflower','#e6c14a'],purple:['lavender','#a592d0'],poppy:['poppy','#e57a56']}[c]||['pink','daisy'];bx(g,1.5,.1,.9,'#8a6d4c',0,.05,0);for(let i=0;i<10;i++)ico(g,.15,set[i%set.length],-.6+(i%5)*.3,.28+((i*7)%3)*.05,-.25+Math.floor(i/5)*.5,1);},
rows:(g,c)=>{for(let i=0;i<3;i++)bx(g,1.6,.4,.18,c==='vine'?'vine':'#8da05a',0,.25,-.45+i*.45);for(const x of [-.8,0,.8])bx(g,.05,.7,.05,'#8a7050',x,.35,-.5);},
wheat:g=>{bx(g,1.8,.08,1.3,'#c7a74c',0,.04,0);for(let i=0;i<4;i++)bx(g,1.6,.28,.16,i%2?'wheat':'#e4c870',0,.22,-.5+i*.34);},
terrace:(g,c)=>{const top=c==='rice'?'#a8d0c9':'#c9a35a';[[1.5,.3,'#9ab86e'],[1.2,.55,'#a9c47a'],[.9,.8,'#b4cf86']].forEach(([r,h,cc],i)=>{cyl(g,r,r+.05,.28,cc,0,i*.26,0,9);cyl(g,r-.1,r-.1,.03,top,0,i*.26+.28,0,9).material=mat(top);});},
waterwheel:g=>{bx(g,.9,.7,.8,'#dfd0aa',-.7,.35,0);const w=M(new T.TorusGeometry(.6,.07,4,12),'#8a6a48',g,.2,.7,0);for(let i=0;i<6;i++){const b=bx(g,.1,.3,.5,'#8a6a48',.2+Math.cos(i*1.05)*.6,.7+Math.sin(i*1.05)*.6,0);b.rotation.z=i*1.05;}},
granary:g=>{cone(g,1.5,.9,'#c8b25a',0,0,0,7);cyl(g,.45,.45,.7,'#e8d9a8',0,.8,0,8);cone(g,.55,.5,'terra',0,1.5,0,8);},
lantern:g=>{bx(g,.3,.35,.3,'stone',0,.18,0);bx(g,.2,.3,.2,'glow',0,.5,0).material=mat('#f0b865','glow');bx(g,.4,.12,.4,'stone',0,.72,0);},
pot:g=>{const p=M(new T.CylinderGeometry(.42,.28,.7,7),'terra',g,0,.35,0);cyl(g,.46,.46,.1,'terraD',0,.7,0,7);},
bridge:g=>{bx(g,2,.12,.8,'#ba9b72',0,.3,0);for(const z of [-.4,.4]){bx(g,2,.08,.06,'#c4ac86',0,.7,z);for(const x of [-.85,.85])bx(g,.08,.45,.08,'#b39772',x,.5,z);}},
flag:g=>{cyl(g,.03,.03,1.3,'#4a3f36',0,0,0,4);bx(g,.5,.3,.03,'terra',.25,1.1,0);}
};
// 'river' is a flat ribbon through points in unit coordinates.
function ribbon(g,pts,w,c,f){const cv=new T.CatmullRomCurve3(pts.map(([x,z])=>new T.Vector3(x*f,0,z*f)));const p=cv.getPoints(36),pos=[],idx=[];p.forEach((q,i)=>{const a=p[Math.max(0,i-1)],b=p[Math.min(p.length-1,i+1)];let tx=b.x-a.x,tz=b.z-a.z;const l=Math.hypot(tx,tz)||1;tx/=l;tz/=l;pos.push(q.x-tz*w*f,.03,q.z+tx*w*f,q.x+tz*w*f,.03,q.z-tx*w*f);if(i)idx.push(2*i-2,2*i-1,2*i,2*i-1,2*i+1,2*i);});const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();const m=new T.Mesh(geo,mat(col(c),'ds'));m.receiveShadow=true;g.add(m);return m;}

// [kind(:param), x, z, scale, appears at stage, lesson spot name | 0, interior only]
// Layout is in unit space inside the hex. Spots are named after the scenery element they sit on.
export const THEMES={
nature:{g:'#cad8ae',items:[['oak',0,-.1,1.5,2,'The old oak'],['pine',-.72,-.35,1,1,0],['pine',-.6,.35,.9,3,0],['oak',.5,-.5,.9,3,0],['oak',.7,.05,.8,4,0],['bush',-.25,.62,1,2,0],['bush',.25,.7,.9,5,0],['deer',.4,.6,1.05,6,'Deer at the forest edge'],['rock:terra',.8,.12,1,4,'Mossy boulder'],['river',[[-.95,-.15],[-.45,.25],[.1,.2],[.5,.85]],.08,3,'Stream through the trees'],['fern',-.35,.2,1,2,0,1],['mushroom',.3,.2,1,4,0,1],['log',-.6,.6,1,5,0,1],['oak',-.2,-.7,1,2,0,1]]},
biology:{g:'#b9d39c',items:[['emergent',-.1,-.25,1.35,3,'Emergent giant'],['emergent',.55,-.55,1.05,5,0],['emergent',-.65,.0,1.1,4,0],['palm',.45,.15,1,2,0],['palm',-.3,.55,.9,3,0],['bush',.2,.62,1,1,0],['bush',-.7,.5,1,1,0],['river',[[-.9,.7],[-.3,.35],[.2,.3],[.85,-.1]],.08,2,'Jungle river'],['mist',.0,.45,1,4,'Canopy mist'],['bird',.3,-.1,1,8,'Scarlet bird'],['mushroom:glow',.65,.5,1,6,0,1],['fern',-.2,.2,1,2,0,1],['log',.2,.75,1,7,0,1]]},
ocean:{g:'#ead9ae',items:[['pool:lagoon',0,.05,2.7,1,0],['pool:deep',.15,-.05,.7,3,'Blue hole'],['coral',-.35,-.4,1.1,3,'Coral garden'],['coral',.5,.35,.9,5,0],['coral',-.5,.35,.8,4,0],['fish',.0,-.3,1,6,'School of fish'],['turtle',.5,-.15,1.2,9,'Sea turtle'],['palm',.8,-.55,1,2,0],['rock:white',-.8,.15,.8,2,0],['rock:white',.0,.78,.8,3,0],['coral',.3,.55,.6,7,0,1],['fish',-.5,.0,1,8,0,1]]},
climate:{g:'#e3ecef',items:[['ice',0,-.1,1.5,2,'Glacier cap'],['ice',-.6,.35,.9,3,0],['crack',.35,.3,1,4,'Crevasse'],['pool:ice',.6,.6,1.1,5,0],['iceberg',.65,.6,.9,6,'Iceberg'],['flowers:tundra',-.5,-.65,.9,8,'Tundra bloom'],['rock',.7,-.3,.8,3,0],['rock',-.8,-.1,.7,4,0],['snowfield',.0,.75,1.2,1,0,1],['flowers:tundra',.2,.8,.7,9,0,1]]},
space:{g:'#a37f73',items:[['mesa:mauve',-.3,-.35,1.2,2,0],['dome',.15,-.25,1.2,3,'Observatory dome'],['cactus',.7,-.05,1,2,0],['cactus',-.7,.35,.9,3,0],['cactus',.4,.6,1,4,0],['meteor',.55,.45,1.1,5,'Meteor fragment'],['crater',-.4,.45,.9,6,'Meteor crater'],['stars',0,-.3,1.2,8,'Constellation'],['rock',-.85,-.1,.8,1,0],['rock',.1,.8,.8,2,0],['pool:salt',.05,.4,1.7,7,0,1]]},
geology:{g:'#d6b196',items:[['mesa',-.1,-.2,1.5,2,'Stepped mesa'],['hoodoo',.55,.2,1,4,'Hoodoo column'],['hoodoo',-.6,.4,.9,5,0],['hoodoo',.7,-.5,.8,6,0],['fossil',.15,.55,1,6,'Fossil wall'],['slot',-.75,-.35,1,8,'Slot canyon'],['rock',.0,.8,.8,1,0],['cactus',.8,.6,.8,3,0],['rock',-.3,.7,.7,2,0,1]]},
physics:{g:'#74707a',items:[['lavacrack',0,.0,1.7,2,'Lava crack'],['basalt',-.65,-.4,.9,2,0],['basalt',.6,-.55,.8,3,0],['steam',-.5,.25,1,4,'Steam vent'],['steam',.55,.15,.9,5,0],['pool:acid',.0,.62,1.1,6,'Hot spring'],['geyser',.75,.62,1,9,'Geyser'],['rock',-.8,.6,.7,1,0],['pool:cobalt',-.45,.7,.7,7,0,1]]},
chemistry:{g:'#b8aebd',items:[['geode',0,-.1,1.45,2,'Geode'],['crystal',-.65,.35,1.1,4,'Crystal cluster'],['crystal:white',.7,.3,1,5,0],['crystal',.6,-.55,.8,6,0],['pool:cobalt',-.35,.65,.8,6,'Mineral pool'],['pool:sulfur',.4,.7,.6,8,'Sulfur spring'],['rock',-.75,-.4,.8,1,0],['crystal:white',-.5,-.55,.7,7,0,1]]},
sport:{g:'#d0d9c0',items:[['peak:flag',0,-.35,1.5,2,'Summit flag'],['peak',-.6,-.1,.8,3,0],['pine',-.65,.45,.9,2,'Pine foothills'],['pine',-.35,.65,.8,3,0],['pine',.6,.55,.9,3,0],['ice',.45,.05,.7,5,'Glacier pass'],['river:sand',[[-.2,.1],[.2,.3],[-.2,.55],[.1,.8]],.05,4,'Switchback trail'],['bush',.8,.15,.8,2,0],['deer:ibex',.75,.35,.7,7,0,1]]},
health:{g:'#cfdcb2',items:[['blossom',-.4,-.35,1.4,2,'Cherry tree'],['maple',.5,-.4,1.1,4,'Maple'],['pine:snow',.55,.5,1,6,'Winter pine'],['pool:water',-.5,.45,1.1,5,0],['bridge',-.5,.45,.7,8,'Pond bridge'],['rock',.0,.0,.7,3,0],['sandrings',.05,.05,.6,1,0,1],['lantern',-.1,.6,1,7,0,1],['bush',.9,-.1,.8,3,0]]},
mind:{g:'#c8d3af',items:[['sandrings',0,.15,1.3,2,'Raked sand'],['moss',-.65,-.4,1.1,3,'Moss knoll'],['moss',.6,-.45,.9,4,0],['moss',.15,-.75,.8,5,0],['stones',.0,.15,.8,5,'Focal stones'],['screen',.0,-.85,1,7,'Bamboo screen'],['pool:water',-.7,.55,.9,9,'Koi pond'],['rock',.75,.55,.7,3,0],['moss',.65,.3,.6,6,0,1]]},
cooking:{g:'#d9c690',items:[['farmhouse',-.5,-.4,1.1,2,'Farmhouse'],['rows:vine',.35,-.3,1,4,'Vine rows'],['rows:vine',.35,.1,1,5,0],['olive',-.7,.2,1,5,'Olive tree'],['olive',-.35,.55,.9,6,0],['flowers:herb',.5,.55,.8,7,'Herb beds'],['wheat',-.1,.2,.8,9,'Wheat patch'],['cypress',.85,-.5,.9,3,0],['cypress',-.9,-.5,.8,3,0],['pool:water',.0,.8,.5,2,0,1]]},
languages:{g:'#cdd9a4',items:[['cottage',-.15,-.55,1.3,2,'The cottage'],['river:brick',[[-.05,-.2],[.15,.1],[-.2,.4],[-.5,.75]],.07,3,'Brick path'],['flowers:mixed',.55,-.1,1,4,'Flower beds'],['flowers:mixed',-.7,.05,.9,6,0],['pool:water',.45,.6,1.1,8,'Pond'],['pot',-.55,.55,1,6,'Terracotta pot'],['oak',-.8,-.5,.8,3,0],['bush',.85,-.55,.9,2,0],['rows',.0,.7,.6,5,0,1]]},
art:{g:'#d8d9a2',items:[['oak',.0,-.8,1.1,2,'Lone tree'],['flowers:purple',-.55,-.15,1.5,3,'Purple drift'],['flowers:poppy',.4,.1,1.6,5,'Poppy drift'],['flowers:sun',-.2,.55,1.4,7,'Sunflower drift'],['grass',.7,-.4,1,1,0],['grass',-.8,.4,1,2,0],['grass',.6,.7,1,3,0],['grass',-.7,-.55,1,2,0,1],['flowers:mixed',.8,-.1,.8,8,0,1]]},
music:{g:'#bfd7b0',items:[['fall',0,-.55,1.3,2,'Waterfall'],['cliff',-.6,-.45,1,3,'Echo cliffs'],['cliff',.6,-.45,1,4,0],['pool:water',.0,.1,1.4,5,'Still pool'],['reeds',-.5,.35,1,7,'Reed bed'],['reeds',.55,.4,1,8,0],['rock:white',.0,.7,1,9,'Natural stage'],['oak',-.85,.35,.8,2,0],['pine',.85,.3,.8,2,0]]},
history:{g:'#dccea4',items:[['columns',-.3,-.35,1.2,2,'Columned ruin'],['aque',.5,-.55,.8,4,'Aqueduct'],['amphi',-.6,.3,1,6,'Amphitheater'],['pool:water',.45,.55,1.7,1,0],['boat',.5,.5,1,7,'Harbor boat'],['olive',.7,-.1,.9,3,0],['olive',-.2,.1,.8,4,0],['cypress',-.85,-.4,.8,3,0],['rock',.05,.75,.6,2,0,1]]},
technology:{g:'#b8cfb5',items:[['mangrove',-.4,-.35,1.2,2,'Root maze'],['mangrove',.5,-.4,1.1,3,0],['mangrove',.3,.3,1,4,0],['mangrove',-.7,.3,1,5,0],['river:water',[[-.95,.1],[-.3,.1],[.1,-.1],[.9,.2]],.08,4,'Tidal channel'],['river:water',[[-.1,-.9],[-.05,-.3],[.1,.9]],.06,6,0],['bird',.1,.4,1,8,'Heron'],['rock:green',.8,.65,.8,5,'Estuary island'],['mushroom:glow',-.1,.7,1,7,0,1]]},
engineering:{g:'#b8bcb2',items:[['basalt',-.2,-.3,1.5,2,'Basalt columns'],['basalt',.6,.1,.9,4,'Column stair'],['basalt',-.7,.35,.8,5,0],['pool:water',.1,.7,1.8,1,0],['seastack',.45,.75,.8,7,'Sea stack'],['pool:water',.6,-.5,.5,6,'Tide pool'],['rock',.8,-.7,.7,3,0],['rock',-.1,.1,.6,2,0,1]]},
mathematics:{g:'#cfd9a6',items:[['terrace:rice',-.2,-.2,1.3,2,'Spiral terrace'],['terrace',.6,.2,.9,4,'Contour terrace'],['terrace:rice',-.65,.45,.8,5,0],['pool:sky',.4,.65,.9,6,'Mirror paddy'],['aque:bamboo',.2,-.65,.9,7,'Bamboo aqueduct'],['bamboo',.85,-.3,1,3,0],['bamboo',-.85,-.4,.9,3,0],['bush',.0,.8,.8,2,0]]},
economics:{g:'#dcc886',items:[['wheat',-.5,-.35,1.2,3,'Wheat rows'],['wheat',.35,-.5,1,4,0],['wheat',-.4,.3,1.1,5,0],['river',[[-.95,.7],[-.2,.55],[.3,.65],[.9,.85]],.09,2,'River'],['dock',.5,.55,1,7,'Port'],['waterwheel',.65,-.05,.9,5,'Waterwheel'],['granary',.0,.0,.7,9,'Granary hill'],['bush',-.85,.0,.8,2,0],['wheat',.1,.1,.6,6,0,1]]}
};
P.fall=g=>{bx(g,1.8,1.3,.6,'#a9a59a',0,.65,0);bx(g,1.2,.3,.7,'#bdb8aa',0,1.3,.05);bx(g,.4,1.25,.08,'white',0,.65,.34).material=mat('#f4fbfb','soft');cyl(g,.55,.6,.07,'water',0,0,.8,8);};
P.cliff=g=>{bx(g,.9,1.8,.7,'#a5a095',0,.9,0).rotation.y=.2;bx(g,.7,1.2,.6,'#b6b0a3',.5,.6,.2);bx(g,.5,.5,.4,'#c4beb0',-.3,2,.05);};
P.mist=g=>{cyl(g,1.3,1.5,.3,'mist',0,.5,0,9).material=mat('#eef3ee','soft');};

export const THEME_KEYS=Object.keys(THEMES);
const lerpC=(a,b,t)=>new T.Color(a).lerp(new T.Color(b),t);
// Build one theme into parent at (cx,cz). mode 'ov' (overview) or 'in' (interior).
export function buildTheme(parent,key,mode,cx,cz,R,hexFn,polygon=null){
 const th=THEMES[key],f=R*.88,k=R*.19,items=[],pins=[],root=new T.Group();root.position.set(cx,0,cz);parent.add(root);
 const gmat=new T.MeshStandardMaterial({color:th.g,roughness:1,flatShading:true,vertexColors:true});
 const poly=polygon||Array.from({length:9},(_,i)=>{const a=i*Math.PI*2/9;return [Math.cos(a)*R*(1+.08*Math.sin(i*17)),Math.sin(a)*R*(1+.08*Math.sin(i*17))];});
 const ground=terrain(root,poly,R,key,gmat);ground.userData.theme=key;
 const entry={root,items,pins,gmat,color:th.g};
 th.items.forEach(it=>{
  let [kind,x,z,s,from,lesson,inOnly]=it;if(inOnly&&mode!=='in')return;if(key==='ocean'&&kind==='pool:lagoon')return;
  const [name,param]=kind.split(':');const g=new T.Group();root.add(g);
  if(name==='river'){const pts=x,w=z;ribbon(g,pts,w*(mode==='in'?1:1.5),param||'water',f);g.position.y=.42;g.userData.flat=true;
   const mp=pts[Math.min(1,pts.length-1)],mid=new T.Vector3(mp[0]*f,.9,mp[1]*f);
   const rname=from,rec={g,from:s,scale:1,flat:true,lesson:rname||null,mid};items.push(rec);g.userData.rec=rec;
   if(rname){const pin=makePin();pin.position.copy(mid);g.add(pin);pins.push({pin,rec});rec.pin=pin;}
   return;}
  const build=key==='art'&&name==='flowers'?P.wildflowers:P[name];if(!build)throw new Error('missing prop '+name);build(g,param);if(!['stars','steam','geyser','mist','lavacrack','meteor'].includes(name))bake(g);
  const box=new T.Box3().setFromObject(g),top=Math.max(.8,box.max.y);
  const sc=k*s;g.position.set(x*f,(key==='ocean'&&name==='pool'?.52:.42)+(key==='cooking'&&Math.abs(x)<.73&&z>-.77&&z<.49?Math.max(0,Math.floor((.75-z)*2.5))*R*.065+R*.035:0),z*f);g.rotation.y=(x*7+z*3)%6.28*.4;g.scale.setScalar(sc);
  const rec={g,from,scale:sc,lesson:lesson||null};items.push(rec);g.userData.rec=rec;
  if(lesson){const pin=makePin();pin.position.set(0,top+.45,0);pin.scale.setScalar((mode==='in'?.7:.42)/Math.max(.55,sc));g.add(pin);pins.push({pin,rec});rec.pin=pin;rec.pinK=mode==='in'?.7:.42;}
 });
 enrich(entry,key,mode,R,poly);
 return entry;
}
function makePin(){const g=new T.Group();const m=new T.Mesh(new T.OctahedronGeometry(.18,0),mat('#c65d3b','glow'));m.scale.y=1.25;g.add(m);g.userData.pin=true;return g;}
// Growth: item appears at its stage and reaches full size three stages later.
export function applyStage(entry,stage){
 for(const rec of entry.items){const vis=stage>rec.from-.85;rec.g.visible=vis;if(!vis)continue;const w=Math.min(2.4,10-rec.from+.85),t=Math.max(0,Math.min(1,(stage-rec.from+.85)/w)),k=Math.max(.001,t*t*(3-2*t));
  if(rec.flat){rec.g.scale.set(1,1,1);const q=.4+.6*k;rec.g.scale.set(1,1,1);rec.g.children[0].scale.set(1,1,1);rec.g.children[0].material.opacity=1;rec.g.scale.y=1;rec.g.scale.x=q+0*1;rec.g.scale.z=q;rec.g.position.x=0;}
  else if(rec.deco)rec.g.scale.set(1,k,1);else rec.g.scale.setScalar(rec.scale*k);
  if(rec.pin&&!rec.flat)rec.pin.scale.setScalar(rec.pinK/Math.max(.55,rec.scale*k));}
 entry.gmat.color.copy(lerpC('#a99a7b','#ffffff',.65+.35*(stage-1)/9));
}
export function disposeEntry(entry){entry.root.traverse(o=>{if(o.geometry)o.geometry.dispose();});entry.gmat.dispose();}

P.lavarock=g=>{rockM(g,.75,'basalt',0,0);rockM(g,.4,'basaltL',.45,.2);};
P.wildflowers=(g,c)=>{const cc={purple:'#9b81b8',sun:'#ecc85d',poppy:'#e27e68'}[c]||'#ece7bf';for(let i=0;i<7;i++){const x=(i%3-.8)*.3,z=(Math.floor(i/3)-.8)*.3;cyl(g,.014,.02,.3+i%3*.08,'green',x,0,z,4);ico(g,.08,cc,x,.34+i%3*.08,z,.7);}};
// Seeded low-poly ground, planted layers and ecosystem-scale silhouettes.
const rnd=(i,s=0)=>{const x=Math.sin(i*127.1+s*311.7)*43758.5453;return x-Math.floor(x);};
function inside(x,z,p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if(((a[1]>z)!==(b[1]>z))&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
function terrain(root,p,R,key,material){
 const pos=[],colors=[],base=new T.Color(THEMES[key].g),sand=new T.Color('#d9c799');
 function tri(a,b,c,depth=0){if(depth<3){const ab=[(a[0]+b[0])/2,(a[1]+b[1])/2],bc=[(b[0]+c[0])/2,(b[1]+c[1])/2],ca=[(c[0]+a[0])/2,(c[1]+a[1])/2];tri(a,ab,ca,depth+1);tri(ab,b,bc,depth+1);tri(ca,bc,c,depth+1);tri(ab,bc,ca,depth+1);return;}
  const x=(a[0]+b[0]+c[0])/3,z=(a[1]+b[1]+c[1])/3,n=rnd(x*9+z*3,4),cc=base.clone().lerp(sand,n*.12).multiplyScalar(.96+n*.07);
  for(const q of [a,c,b]){pos.push(q[0],.42+(rnd(q[0]*3+q[1]*7,8)-.5)*R*.0011,q[1]);colors.push(cc.r,cc.g,cc.b);}}
 p.forEach((a,i)=>tri([0,0],a,p[(i+1)%p.length]));
 const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute(pos,3));geom.setAttribute('color',new T.Float32BufferAttribute(colors,3));geom.computeVertexNormals();const top=new T.Mesh(geom,material);top.receiveShadow=true;root.add(top);
 // Three narrow soil bands and a bevel give the shared landscape physical depth.
 const shape=new T.Shape(p.map(([x,z])=>new T.Vector2(x,-z)));const geo=new T.ExtrudeGeometry(shape,{depth:.34,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.025,bevelThickness:.025});geo.rotateX(-Math.PI/2);const slab=new T.Mesh(geo,mat('#b8a37d'));slab.position.y=.04;slab.castShadow=true;slab.receiveShadow=true;root.add(slab);return top;
}
function bake(g){const geos=[];g.updateMatrixWorld(true);const inv=new T.Matrix4().copy(g.matrixWorld).invert();g.traverse(m=>{if(!m.isMesh||m.userData.pin)return;let geo=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();geo.applyMatrix4(new T.Matrix4().multiplyMatrices(inv,m.matrixWorld));const co=m.material.color,cs=[];for(let i=0;i<geo.attributes.position.count;i++)cs.push(co.r,co.g,co.b);geo.setAttribute('color',new T.Float32BufferAttribute(cs,3));for(const a of Object.keys(geo.attributes))if(!['position','normal','color'].includes(a))geo.deleteAttribute(a);geos.push(geo);});
 if(!geos.length)return;const merged=mergeGeometries(geos);g.clear();const material=new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true});const mesh=new T.Mesh(merged,material);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);geos.forEach(x=>x.dispose());
}
function enrich(entry,key,mode,R,poly){
 const root=entry.root,groups=Array.from({length:8},()=>new T.Group());groups.forEach(g=>{g.position.y=.43;root.add(g);});
 const f=R*.88,seed=THEME_KEYS.indexOf(key)+1;
 function add(kind,x,z,s=1,from=3,c){if(!inside(x*R*1.045,z*R*1.045,poly))return;const g=new T.Group();groups[Math.min(7,Math.max(0,from-2))].add(g);P[kind](g,c);g.position.set(x*R,key==='cooking'&&Math.abs(x)<.73&&z>-.77&&z<.49?Math.max(0,Math.floor((.75-z)*2.5))*R*.065+R*.035:0,z*R);g.scale.setScalar(s*R*.185);g.rotation.y=rnd(x+z,seed)*6.28;return g;}
 const leafy=['nature','biology','health','languages','music','history','technology','mathematics','cooking'];
 const lush=leafy.includes(key),barren=['climate','space','physics','chemistry','geology','engineering'].includes(key);
 // A planted ground layer, with quiet clearings and open water kept clear.
 const N=mode==='in'?470:190;
 for(let i=0;i<N;i++){
  const x=(rnd(i,seed)-.5)*2.8,z=(rnd(i+901,seed)-.5)*2.8;if(!inside(x*R,z*R,poly))continue;
  if(Math.hypot(x,z)>1.18)continue;
  const clear=Math.abs(x+.16*Math.sin(z*5))<.13;
  if(key==='mind')continue;
  if(key==='ocean'&&Math.hypot(x,z)<.79)continue;
  if(['health','languages'].includes(key)&&Math.hypot(x+.45,z-.4)<.29)continue;
  if(['history','engineering'].includes(key)&&z>.27)continue;
  if(key==='technology'&&(Math.abs(x)<.13||Math.abs(z)<.16))continue;
  if(lush&&clear&&z>-.5&&z<.95)continue;
  const scale=.13+rnd(i+78,seed)*.24,from=2+(i%7);
  if(barren){if(i%4===0)add('rock',x,z,scale,from);if(key==='space'&&i%31===0)add('cactus',x,z,.28,from);continue;}
  if(i%13===0)add('rock',x,z,scale,from);
  else if(i%7===0&&lush)add('bush',x,z,scale*1.8,from);
  else if(i%17===0&&key==='nature')add('mushroom',x,z,.24,from);
  else if(i%6===0&&['health','languages','art','cooking','music'].includes(key))add('flowers',x,z,scale*.7,from,key==='art'?['purple','sun','poppy'][Math.floor((z+1)*2)%3]:'mixed');
  else add(lush&&i%3===0?'fern':'grass',x,z,scale*1.8,from);
 }
 // Composition-level masses, not a collection of symbols.
 if(key==='nature'||key==='biology'){
  const N=key==='nature'?25:21;
  for(let i=0;i<N;i++){
   const a=i*2.399,r=.39+.56*Math.sqrt(rnd(i+42,seed)),x=Math.cos(a)*r,z=Math.sin(a)*r;
   if(z>.18&&Math.abs(x)<.32)continue;
   add(key==='biology'?(i%4?'emergent':'palm'):(i%5?'oak':'pine'),x,z,.7+rnd(i,9)*.8,2+i%6);
  }
  if(key==='biology')for(let i=0;i<8;i++)add('rock',-.15+Math.cos(i)*.28,-.5+Math.sin(i)*.18,1.3+i%3*.3,2+i%4);
  const path=new T.Group();path.position.y=.44;root.add(path);ribbon(path,[[.05,-.8],[-.1,-.3],[.15,.15],[-.12,.55],[.07,1]],.075,'#e8d3a8',R);
 }
 if(key==='ocean'){
  const lagoon=new T.Group();lagoon.position.y=.435;root.add(lagoon);cyl(lagoon,R*.84,R*.84,.015,'#65c9cb',0,0,0,22);cyl(lagoon,R*.65,R*.65,.025,'#70d1cf',0,0,0,18);
  // Ring of beach, reef stones and palms around the lagoon.
  for(let i=0;i<30;i++){const a=i*6.28/30,x=Math.cos(a)*.92,z=Math.sin(a)*.92;add(i%7===0?'palm':i%3?'rock':'bush',x,z,i%7===0?.65:.35,2+i%6,i%3?'white':undefined);}
  for(let i=0;i<14;i++){const a=i*2.4;add('coral',Math.cos(a)*.65,Math.sin(a)*.65,.4+rnd(i,2)*.25,3+i%6);}
 }
 if(key==='climate'){
  for(let i=0;i<13;i++){const x=(i%5-2)*.36,z=-.6+Math.floor(i/5)*.34;add('ice',x,z,1.3+rnd(i,8)*1.4,2+i%5);}
  const sea=new T.Group();root.add(sea);sea.position.y=.44;ribbon(sea,[[-.7,.6],[-.3,.68],[.3,.62],[.7,.65]],.13,'#5fa9c6',R);
 }
 if(key==='space'){for(let i=0;i<6;i++)add('mesa',-.75+i*.3,-.75+Math.sin(i)*.1,1.2+i%2*.3,2+i%3,'mauve');}
 if(key==='geology'){for(let i=0;i<8;i++)add(i%3?'mesa':'hoodoo',Math.cos(i*2.1)*.58,-.15+Math.sin(i*2.1)*.55,1.2+rnd(i,5)*1.1,2+i%5);}
 if(key==='physics'){
  for(let i=0;i<10;i++){const a=i*2.4;add('lavarock',Math.cos(a)*(.35+rnd(i,5)*.6),Math.sin(a)*.8,.65+rnd(i,7)*.85,2+i%6);}
  const lava=new T.Group();root.add(lava);lava.position.y=.46;ribbon(lava,[[.2,-1],[.35,-.5],[-.15,0],[.25,.5],[-.1,1]],.045,'lava',R);
 }
 if(key==='chemistry'){
  for(let i=0;i<11;i++){const a=Math.PI+i*Math.PI/10;add('rock',Math.cos(a)*.57,Math.sin(a)*.65,2.5+Math.sin(i/10*Math.PI)*2,2+i%5);}
  for(let i=0;i<22;i++){const a=i*2.4,r=.25+rnd(i,3)*.55;add('crystal',Math.cos(a)*r,Math.sin(a)*r,.6+rnd(i,4),3+i%6,i%4===0?'white':undefined);}
 }
 if(key==='sport'){for(let i=0;i<7;i++)add('peak',-.8+i*.25,-.55+Math.sin(i)*.13,1.3+Math.sin(i*.7)*.9,2+i%4);for(let i=0;i<18;i++){const a=i*2.4;add('pine',Math.cos(a)*.8,.3+Math.sin(a)*.45,.35+rnd(i,3)*.45,2+i%6);}}
 if(key==='health'){for(let i=0;i<13;i++){const a=i*2.4;add(['blossom','maple','pine'][i%3],Math.cos(a)*.8,Math.sin(a)*.75,.45+rnd(i,3)*.4,2+i%6,i%3===2?'snow':undefined);}}
 if(key==='mind'){
  for(let i=0;i<42;i++){const t=M(new T.TorusGeometry(R*(.18+i*.018),R*.0018,3,64),'#c5ba99',root,0,.435,.12*R);t.rotation.x=Math.PI/2;}
  for(let i=0;i<5;i++)add('screen',-.65+i*.3,-.8,.85,2+i%4);
 }
 if(key==='cooking'){
  for(let i=0;i<4;i++){const g=new T.Group();groups[0].add(g);bx(g,R*1.45,R*.07,R*.24,'#cbb67c',0,(3-i)*R*.065,-.65*R+i*.34*R);for(let j=0;j<7;j++)add(i%2?'olive':'rows',-.75+j*.24,-.6+i*.34,.43,2+(i+j)%6,'vine');}
 }
 if(key==='languages'){for(let i=0;i<13;i++)add('bush',-.9+i*.15,-.78,.65,2+i%6);for(let i=0;i<9;i++)add('flowers',-.7+i*.18,.08+Math.sin(i)*.2,.6,3+i%5,'mixed');}
 if(key==='art'){for(let i=0;i<85;i++){const x=(rnd(i,4)-.5)*1.9,z=(rnd(i,5)-.5)*1.9;add('wildflowers',x,z,.9,2+i%7,z<-.25?'purple':z<.3?'sun':'poppy');}}
 if(key==='music'){
  for(let i=0;i<9;i++){const a=Math.PI+i*Math.PI/8;add('cliff',Math.cos(a)*.7,Math.sin(a)*.7,1.2+rnd(i,1)*.5,2+i%5);}
  for(let i=0;i<9;i++)add(i%3?'pine':'oak',Math.cos(i*2.4)*.8,Math.sin(i*2.4)*.8,.5,2+i%5);
 }
 if(key==='history'){for(let i=0;i<24;i++)add(i%4?'olive':'cypress',Math.cos(i*2.4)*.8,-.2+Math.sin(i*2.4)*.4,.7+rnd(i,3)*.3,2+i%6);for(let i=0;i<7;i++)add('rock',-.9+i*.28,.32,.8,2+i%4);}
 if(key==='technology'){for(let i=0;i<20;i++){const a=i*2.4;add('mangrove',Math.cos(a)*(.45+rnd(i,3)*.35),Math.sin(a)*.8,.65+rnd(i,2)*.6,2+i%6);}}
 if(key==='engineering'){for(let i=0;i<20;i++){const x=-.8+(i%5)*.34,z=-.6+Math.floor(i/5)*.28;add('basalt',x,z,1.2-z*.9,2+i%6);}}
 if(key==='mathematics'){for(let i=0;i<6;i++){const a=i*2.4;add('terrace',Math.cos(a)*.48,Math.sin(a)*.48,1.3,2+i,'rice');}for(let i=0;i<8;i++)add(i%2?'pine':'oak',Math.cos(i*2.4)*.88,Math.sin(i*2.4)*.88,.55,2+i%6);}
 if(key==='economics'){for(let i=0;i<20;i++){const x=-.65+(i%4)*.4,z=-.65+Math.floor(i/4)*.29;if(Math.abs(x)<.15)continue;add('wheat',x,z,.85,2+i%6);}for(let i=0;i<7;i++)add('cypress',-.8+i*.26,-.85,.6,2+i%6);}
 // Signature terracotta stone recurring in the reference sheets.
 if(key!=='mind')add('rock',.69,.68,.55,5,'terra');
 groups.forEach((g,i)=>{bake(g);entry.items.push({g,from:Math.min(9,i+2),scale:1,deco:true,lesson:null});});
}
