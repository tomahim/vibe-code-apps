import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { books } from './content';

// A complete geometry-based library. The HTML collection below is its keyboard,
// screen-reader and WebGL-free counterpart, not a texture pretending to be 3D.
export default function ShelfRoom({ category, onChoose, reduced }) {
  const host=useRef(null); const pick=useRef(onChoose);pick.current=onChoose;
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const el=host.current;
    const scene=new THREE.Scene(); let renderer,controls,frame,resize,visible;
    const disposables=[];
    try {
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      renderer.domElement.setAttribute('aria-label','3D library shelves. Drag to look around; tap a book to place it on the reading table. Use the book buttons below with a keyboard.');renderer.domElement.setAttribute('role','img');
      el.appendChild(renderer.domElement);
      const camera=new THREE.PerspectiveCamera(36,1,.1,70);camera.position.set(.7,1.7,14);
      controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1,0);controls.enablePan=false;controls.enableZoom=false;controls.minAzimuthAngle=-.3;controls.maxAzimuthAngle=.3;controls.minPolarAngle=1.2;controls.maxPolarAngle=1.65;
      scene.add(new THREE.HemisphereLight(0xfff2d4,0x16392c,3));
      const key=new THREE.DirectionalLight(0xffe0ac,4);key.position.set(-4,7,9);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
      const lamp=new THREE.PointLight(0xffc67a,30,15);lamp.position.set(4,4,3);scene.add(lamp);
      const group=new THREE.Group();scene.add(group);
      function woodTexture() {
        const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');
        ctx.fillStyle='#725337';ctx.fillRect(0,0,512,128);
        for(let i=0;i<160;i++){let y=i*.8;ctx.strokeStyle=`rgba(${i%2?35:207},${i%2?24:158},${i%2?15:105},${.04+(i%5)*.015})`;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(140,y+Math.sin(i)*4,330,y-2,512,y+Math.cos(i)*3);ctx.stroke();}
        const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;disposables.push(t);return t;
      }
      const timber=new THREE.MeshStandardMaterial({map:woodTexture(),roughness:.78});
      const mesh=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;};
      const box=(w,h,d,m,x,y,z)=>mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z);
      const plain=c=>new THREE.MeshStandardMaterial({color:c,roughness:.9});
      box(9.6,8.6,.2,plain(0x173b30),0,.2,-.6);
      box(.18,8.9,1.1,timber,-4.9,.2,0);box(.18,8.9,1.1,timber,4.9,.2,0);
      const hit=[];let disposed=false; let loaded=0;
      const loader=new THREE.TextureLoader();
      function label(text,x,y) {
        const c=document.createElement('canvas');c.width=512;c.height=100;const ctx=c.getContext('2d');
        ctx.fillStyle='#b5945b';ctx.fillRect(0,0,512,100);ctx.strokeStyle='#6d5737';ctx.lineWidth=5;ctx.strokeRect(8,8,496,84);ctx.fillStyle='#263e31';ctx.font='34px Georgia';ctx.textAlign='center';ctx.fillText(text,256,62);
        const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;disposables.push(t);
        mesh(new THREE.PlaneGeometry(1.8,.35),new THREE.MeshBasicMaterial({map:t}),x,y,1.02);
      }
      ['History','Nature','Mountains'].forEach((cat,row)=>{
        const y=2.7-row*2.7;
        box(10,.18,1.8,timber,0,y-.12,.1);box(9.8,.13,.09,plain(0xb58b51),0,y-.04,.99);label(cat,3.3,y-.12);
        books.filter(b=>b.category===cat).forEach((b,i)=>{
          const x=-2.9+i*2.6, volume=new THREE.Group();volume.position.set(x,y+1.05,.15);volume.rotation.y=.17+(i*.1);volume.rotation.z=i?-.04:.04;group.add(volume);
          const mat=plain(b.color);const body=new THREE.Mesh(new THREE.BoxGeometry(1.7,2.1,.32),mat);body.castShadow=true;body.userData.book=b;volume.add(body);hit.push(body);
          const paper=new THREE.Mesh(new THREE.BoxGeometry(1.57,1.95,.29),plain(0xe7d9b8));paper.position.z=.035;volume.add(paper);
          const cover=new THREE.Mesh(new THREE.PlaneGeometry(1.7,2.1),mat.clone());cover.position.z=.205;cover.userData.book=b;volume.add(cover);hit.push(cover);
          loader.load(b.cover,texture=>{
            if(disposed){texture.dispose();return;}disposables.push(texture);texture.colorSpace=THREE.SRGBColorSpace;
            const c=document.createElement('canvas');c.width=510;c.height=630;const ctx=c.getContext('2d');ctx.fillStyle=b.color;ctx.fillRect(0,0,510,630);ctx.drawImage(texture.image,35,35,440,355);ctx.strokeStyle='#d6b77c';ctx.lineWidth=2;ctx.strokeRect(18,18,474,594);ctx.fillStyle='#f3e3be';ctx.textAlign='center';ctx.font='15px sans-serif';ctx.fillText(cat.toUpperCase(),255,432);
            ctx.font='34px Georgia';const words=b.title.split(' ');let line='',lines=[];for(const word of words){if(ctx.measureText(line+' '+word).width>425){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);lines.forEach((l,n)=>ctx.fillText(l,255,480+n*39));ctx.font='13px Georgia';ctx.fillText('THE STORY ROOM',255,589);
            const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;disposables.push(t);cover.material.dispose();cover.material=new THREE.MeshStandardMaterial({map:t,roughness:.85});
            if(category!=='All shelves'&&category!==cat) { cover.material.transparent=true;cover.material.opacity=.25; }
            loaded++;if(loaded===books.length)renderer.domElement.dataset.ready='true';
          });
          if(category!=='All shelves'&&category!==cat) {body.material=plain(0x405047);volume.children.forEach(o=>{o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.25;});}
        });
        // Small solid shelf objects give the scene scale and shadows.
        if(row===1){mesh(new THREE.CylinderGeometry(.25,.4,.8,20),plain(0xc8b58d),1,y+.4,.2);for(let j=0;j<5;j++){const stem=mesh(new THREE.ConeGeometry(.25,.8,5),plain(0x789469),1+Math.sin(j)*.25,y+1+j*.08,.2+Math.cos(j)*.2);stem.rotation.z=Math.sin(j)*.35;}}
        if(row===2){mesh(new THREE.ConeGeometry(.7,1.3,4),plain(0x769193),1.2,y+.6,.2);mesh(new THREE.ConeGeometry(.27,.5,4),plain(0xeee6ce),1.2,y+1.03,.2);}
      });
      const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down;
      const start=e=>{down={x:e.clientX,y:e.clientY};};
      const end=e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>12)return;const r=el.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const target=ray.intersectObjects(hit).find(h=>category==='All shelves'||h.object.userData.book.category===category);if(target)pick.current(target.object.userData.book);};
      renderer.domElement.addEventListener('pointerdown',start);renderer.domElement.addEventListener('pointerup',end);
      resize=new ResizeObserver(()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=w<600?22.5:15.5;camera.updateProjectionMatrix();});resize.observe(el);
      let active=true;visible=new IntersectionObserver(([e])=>active=e.isIntersecting);visible.observe(el);
      const draw=()=>{frame=requestAnimationFrame(draw);if(active&&!document.hidden){controls.update();renderer.render(scene,camera);}};draw();
      return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();visible.disconnect();controls.dispose();scene.traverse(o=>{o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();});disposables.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
    }catch{setFailed(true);renderer?.dispose();renderer?.domElement.remove();}
  },[category,reduced]);
  return <section className={`ss-shelf-room ${failed?'ss-room-unavailable':''}`} aria-label="3D bookshelf room"><div ref={host} className="ss-room-canvas"/>{failed?<p>The illustrated collection below is ready to read. The 3D room needs WebGL.</p>:<div className="ss-room-note"><span>A ROOM FULL OF POSSIBILITIES</span><p>Drag to look around · Tap a book to take it down</p></div>}</section>;
}
