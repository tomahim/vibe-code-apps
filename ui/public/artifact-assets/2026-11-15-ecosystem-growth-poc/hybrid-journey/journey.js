/* A bounded 2.5D experiment: paint on demand, life on one canvas. */
(function () {
  'use strict';
  const data = window.HYBRID_JOURNEY_DATA;
  const assets = window.HYBRID_JOURNEY_ASSETS;
  const $ = id => document.getElementById(id);
  const art = $('art'), ctx = art.getContext('2d');
  const life = $('life'), live = life.getContext('2d');
  const painting = $('painting'), landscape = $('landscape');
  window.SceneTapGuard.install(landscape);
  window.HybridImageOnly.install({enter:$('imageOnly'),exit:$('exitImageOnly'),announce:$('announcement')});
  const viewport=window.SceneViewport.install({root:landscape,layer:painting,
    changed:()=>resize(),zoomIn:$('zoomIn'),zoomOut:$('zoomOut'),reset:$('zoomReset'),level:$('zoomLevel'),
    swipe:direction=>{if(!theme)go(group+direction);}});
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const names = ['Sparse / dormant', 'First seedlings', 'Taking root', 'Young shoots', 'A little greener', 'Growing together', 'Canopies return', 'A thriving habitat', 'Almost in bloom', 'Full ecosystem'];
  let group = 0, theme = null, state = 10, version = 0, current = null;
  let patchMode=true,patchImages=null;
  const patches=()=>theme==='nature'&&patchMode;
  let moving = !reduced, raf = 0, last = 0, frames = 0, fps = 0, fpsAt = 0, timer = null;
  let firstReady = null, renderMs = 0, loadedBytes = 0, reads = 0, decodedHits = 0;
  let imageCache = new Map(), pending = new Map();
  const started = performance.now();
  const composite = document.createElement('canvas'), comp = composite.getContext('2d');
  const mask = document.createElement('canvas'), maskCtx = mask.getContext('2d');
  const particles = Array.from({length:38}, (_, i) => ({x: random(i * 11 + 4), y: random(i * 9 + 13), speed: .02 + random(i * 3 + 17) * .035, phase: random(i + 8) * 6.28}));
  function random(n) { const v = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); }
  function image(entry) {
    if (imageCache.has(entry.src)) { decodedHits++; const found = imageCache.get(entry.src); imageCache.delete(entry.src); imageCache.set(entry.src, found); return Promise.resolve(found); }
    if (pending.has(entry.src)) return pending.get(entry.src);
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = async () => {
        try { await img.decode(); } catch (_) { /* load already succeeded */ }
        loadedBytes += entry.bytes; reads++;
        imageCache.set(entry.src, img);
        // Two group pairs and one interior, at most. No twenty-theme preload.
        while (imageCache.size > 5) imageCache.delete(imageCache.keys().next().value);
        pending.delete(entry.src); resolve(img);
      };
      img.onerror = () => { pending.delete(entry.src); reject(new Error('The painting could not load.')); };
      img.src = entry.src;
    });
    pending.set(entry.src, promise); return promise;
  }
  function report(message) { $('announcement').textContent = message; }
  function updateHead() {
    const g = data.groups[group];
    $('groupSelect').value = String(group);
    $('groupCount').textContent = 'Group ' + (group + 1) + ' of 7';
    $('groupBlurb').textContent = theme ? data.themes[theme].ecosystem + ' · 3 demo lessons' : g.blurb;
    $('viewHint').textContent = theme ? 'A LITTLE CLOSER' : 'SEVEN LITTLE WORLDS';
    $('natureModes').hidden=theme!=='nature';
    $('paintedNature').setAttribute('aria-pressed',String(!patchMode));$('patchNature').setAttribute('aria-pressed',String(patchMode));
    landscape.classList.toggle('patch-study',patches());
    $('back').hidden = !theme; $('interiorTitle').hidden = !theme;
    $('themeStrip').hidden = !!theme; $('lessonStrip').hidden = !theme;
    $('interactionHint').textContent = theme ? 'Pinch to zoom · drag when zoomed · tap a lesson' : 'Swipe at 100% · pinch to zoom · tap a theme';
    landscape.classList.toggle('interior', !!theme);
    if (theme) { $('interiorTitle').querySelector('h1').textContent = data.themes[theme].name; $('interiorTitle').querySelector('p').textContent = 'Sample lessons rooted in the scenery'; }
  }
  function markers() {
    $('markers').replaceChildren(); $('themeStrip').replaceChildren(); $('lessonStrip').replaceChildren();
    const g = data.groups[group];
    if (!theme) {
      const spots = g.spots || (g.themes.length === 2 ? [[29,42],[74,49]] : [[50,21],[23,57],[77,58]]);
      g.themes.forEach((key, index) => {
        const t = data.themes[key];
        const b = document.createElement('button'); b.className = 'map-marker'; b.style.cssText = 'left:' + spots[index][0] + '%;top:' + spots[index][1] + '%;--color:' + t.color;
        b.textContent = t.name; b.setAttribute('aria-label', 'Enter ' + t.name); b.onclick = () => openTheme(key); $('markers').append(b);
        const card = document.createElement('button'); card.className = 'theme-card'; card.style.setProperty('--color', t.color);
        card.innerHTML = '<i></i><span><strong></strong><small></small></span><span class="enter">↗</span>';
        card.querySelector('strong').textContent = t.name; card.querySelector('small').textContent = t.ecosystem;
        card.onclick = () => openTheme(key); $('themeStrip').append(card);
      });
    } else {
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');svg.classList.add('leaders');$('markers').append(svg);
      const labelSpots=patches()?[[25,15],[77,54],[26,86]]:[[21,18],[77,25],[51,91]];
      data.themes[theme].lessons.forEach((lesson, index) => {
        const b = document.createElement('button'); b.className = 'map-marker lesson';
        const [lx,ly]=labelSpots[index];
        if(patches())lesson=Object.assign({},lesson,window.HybridLessonPatches.regions[index]);
        b.style.cssText = 'left:' + lx + '%;top:' + ly + '%;--color:' + data.themes[theme].color;
        const line=document.createElementNS(svg.namespaceURI,'line');line.setAttribute('x1',lx);line.setAttribute('y1',ly);line.setAttribute('x2',lesson.x);line.setAttribute('y2',lesson.y);svg.append(line);
        const point=document.createElementNS(svg.namespaceURI,'circle');point.setAttribute('cx',lesson.x);point.setAttribute('cy',lesson.y);point.setAttribute('r','1');svg.append(point);
        b.innerHTML = '<div></div>'; b.firstChild.textContent = lesson.title;
        const small = document.createElement('span'); small.textContent = lesson.landmark; b.firstChild.append(small);
        b.setAttribute('aria-label', 'Open demo lesson ' + lesson.title + ' at ' + lesson.landmark);
        b.onclick = () => lessonOpen(index); $('markers').append(b);
        const row = document.createElement('button'); row.textContent = (index + 1) + '. ' + lesson.title;
        const sub = document.createElement('small'); sub.textContent = lesson.landmark + ' · demo'; row.append(sub); row.onclick = () => lessonOpen(index); $('lessonStrip').append(row);
      });
    }
  }
  function lessonOpen(index) {
    const t = data.themes[theme], l = patches()?Object.assign({},t.lessons[index],window.HybridLessonPatches.regions[index]):t.lessons[index];
    $('lessonTitle').textContent = l.title; $('lessonLandmark').textContent = t.name + ' · At the ' + l.landmark.toLowerCase() + '.';
    $('lessonDialog').showModal();
  }
  async function loadView() {
    const token = ++version;
    viewport.reset();
    current = null; $('loadState').hidden = false; $('loadState').textContent = 'Preparing this little world...';
    $('markers').style.visibility = 'hidden'; art.style.opacity = '.3';
    updateHead(); markers(); resize();
    const entries = theme ? assets.interiors[theme] : assets.groups[group];
    if(patches()){
      $('growthNotice').textContent='Patch-density PoC: one slider, three growth rates. Old oak trunk, terrain and existing scrub stay fixed; only added plants and foliage change.';
      try{patchImages=await window.HybridLessonPatches.ready();if(token!==version)return;current={patches:true};$('loadState').hidden=true;$('markers').style.visibility='';art.style.opacity='1';resize();render();updateMetrics();report('Nature lesson patches. One slider drives three different growth rates.');}catch(e){if(token!==version)return;$('loadState').textContent='Could not load lesson patches. Tap to retry.';$('loadState').onclick=loadView;}
      return;
    }
    $('growthNotice').textContent = entries.sparseMethod === 'painted-sparse'
      ? 'Growth preview: this group has painted sparse-to-lush artwork. Other scenes are still being finished.'
      : 'Growth unfinished here: vegetation currently changes color, not structure. New artwork is coming in a follow-up.';
    try {
      const result = await Promise.all([image(entries.sparse), image(entries.lush)]);
      if (token !== version) return;
      current = {sparse: result[0], lush: result[1], seed: theme ? Object.keys(data.themes).indexOf(theme) + 40 : group};
      $('loadState').hidden = true; $('markers').style.visibility = ''; art.style.opacity = '1';
      if (firstReady === null) firstReady = performance.now() - started;
      render(); drawLife(performance.now()); updateMetrics();
      report(theme ? data.themes[theme].name + ', three demo lessons.' : data.groups[group].name + ', group ' + (group + 1) + ' of seven.');
    } catch (e) {
      if (token !== version) return;
      $('loadState').textContent = e.message + ' Tap to retry.'; $('loadState').onclick = loadView;
    }
  }
  function go(index) { stopReplay(); group = (index + 7) % 7; theme = null; loadView(); }
  function openTheme(key) { stopReplay(); theme = key; loadView(); }
  function resize() {
    const bounds = landscape.getBoundingClientRect();
    const immersive=document.documentElement.classList.contains('image-only');
    const topPad = immersive?0:patches()?(innerWidth<=600&&innerHeight<=700?70:82):theme ? (innerWidth <= 600 ? 60 : 53) : 0;
    const availableH = Math.max(1,bounds.height-topPad-(!immersive&&theme&&innerWidth<=600?20:0));
    const availableW = Math.max(1,bounds.width-(!immersive&&innerWidth>=1000&&!theme?380:0));
    const ratio = patches()?840/800:theme ? 1672/941 : 1;
    const sizeW = Math.min(availableW,availableH*ratio,immersive?Infinity:theme?1100:760);
    painting.style.width=sizeW+'px'; painting.style.height=(sizeW/ratio)+'px';
    const r = painting.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    const w = Math.max(1, Math.min(1400, Math.round(r.width * dpr)));
    const h = Math.max(1, Math.round(w * r.height / Math.max(1, r.width)));
    if (art.width !== w || art.height !== h) { art.width = life.width = composite.width = w; art.height = life.height = composite.height = h; }
    viewport.reflow(); render(); drawLife(performance.now());
  }
  function revealMask(progress) {
    mask.width = 192; mask.height = 192;
    maskCtx.clearRect(0, 0, 192, 192);
    // Smooth deterministic patches, fixed between states, never new random dots.
    maskCtx.filter = 'blur(3px)';
    for (let y=0;y<24;y++) for(let x=0;x<24;x++) {
      const threshold = random(x * 31 + y * 79 + current.seed * 137);
      const alpha = Math.max(0, Math.min(1, (progress - threshold + .05) / .1));
      if (!alpha) continue;
      maskCtx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
      maskCtx.fillRect(x*8,y*8,8,8);
    }
    maskCtx.filter = 'none';
  }
  function render() {
    $('growthName').textContent = names[state-1]; $('growthCount').textContent = 'State ' + state + ' / 10';
    if (!current) return;
    const at = performance.now(), w = art.width, h = art.height;
    if(patches()&&patchImages){const values=window.HybridLessonPatches.draw(ctx,w,h,state,patchImages);
      document.querySelectorAll('#lessonStrip button').forEach((button,i)=>{button.querySelector('small').textContent=window.HybridLessonPatches.regions[i].curve+' · '+Math.round(values[i]*100)+'%';});
      document.querySelectorAll('#markers .lesson span').forEach((label,i)=>label.textContent=window.HybridLessonPatches.regions[i].landmark+' · '+Math.round(values[i]*100)+'%');
      renderMs=performance.now()-at;document.documentElement.dataset.growthState=String(state);document.documentElement.dataset.growthReady='true';return;}
    ctx.clearRect(0,0,w,h); ctx.drawImage(current.sparse,0,0,w,h);
    if (state === 10) ctx.drawImage(current.lush,0,0,w,h);
    else if (state > 1) {
      const progress = (state-1)/9;
      revealMask(progress);
      comp.clearRect(0,0,w,h); comp.globalCompositeOperation='source-over'; comp.drawImage(current.lush,0,0,w,h);
      comp.globalCompositeOperation='destination-in'; comp.drawImage(mask,0,0,w,h); comp.globalCompositeOperation='source-over';
      ctx.drawImage(composite,0,0);
    }
    renderMs = performance.now()-at;
    document.documentElement.dataset.growthState = String(state);
    document.documentElement.dataset.growthReady = 'true';
  }
  function setState(value) { state = Math.max(1,Math.min(10,Number(value))); $('growth').value = String(state); render(); updateMetrics(); }
  function stopReplay() { clearInterval(timer); timer=null; $('play').textContent='▶'; $('play').setAttribute('aria-pressed','false'); $('play').setAttribute('aria-label','Play growth evolution'); }
  function drawLife(now) {
    const w=life.width,h=life.height,t=now/1000;
    live.clearRect(0,0,w,h);
    if (!moving || !current) return;
    const scale=w/700, k=theme || data.groups[group].key;
    // Drifting cloud shadows remain independent from the cached painting.
    live.fillStyle='rgba(72,69,45,.035)';
    live.beginPath();live.ellipse(((t*.016)%1.5-.25)*w,.48*h,.20*w,.05*h,-.3,0,Math.PI*2);live.fill();
    live.strokeStyle='rgba(64,62,48,.65)';live.lineWidth=Math.max(1,1.2*scale);
    for(let i=0;i<3;i++){
      const x=((t*(.03+i*.006)+i*.3)%1.3-.15)*w,y=(.17+i*.045+Math.sin(t+i)*.009)*h,s=(5+i)*scale,f=Math.sin(t*7+i)*s*.6;
      live.beginPath();live.moveTo(x-s,y+f);live.quadraticCurveTo(x-s*.4,y-s*.3,x,y);live.quadraticCurveTo(x+s*.4,y-s*.3,x+s,y+f);live.stroke();
    }
    const snow = k === 'earthsky' || k === 'wellbeing' || k === 'climate' || k === 'sport';
    const sparks = k === 'discovery' || k === 'physics' || k === 'chemistry';
    particles.forEach((p,i)=>{
      const zoneX = snow ? .35+p.x*.3 : .12+p.x*.76;
      const x=(zoneX+Math.sin(t*.55+p.phase)*.009)*w;
      const y=(.2+(p.y+t*p.speed*.25)%.55)*h;
      live.fillStyle=snow?'rgba(255,255,255,.8)':sparks?'rgba(221,171,76,.6)':'rgba(202,178,92,.65)';
      live.beginPath();live.ellipse(x,y,(snow?1.5:2)*scale,(snow?1.5:.8)*scale,t*.5+p.phase,0,Math.PI*2);live.fill();
    });
    // A soft ripple, not a baked GIF, moves on each water landscape.
    if (!sparks) {
      const r=(t%3)/3; live.strokeStyle='rgba(255,255,255,'+(.35*(1-r))+')';live.lineWidth=scale;
      live.beginPath();live.ellipse(.60*w,.63*h,(4+r*17)*scale,(1+r*5)*scale,0,0,Math.PI*2);live.stroke();
    }
  }
  function animate(now) {
    raf=requestAnimationFrame(animate);
    if(document.hidden || !moving || !current) return;
    // Deliberately cap the decorative overlay at 30 fps to spare the battery.
    if(now-last<1000/30-1) return;
    last=now;drawLife(now);frames++;
    if(!fpsAt)fpsAt=now;
    if(now-fpsAt>1200){fps=Math.round(frames*1000/(now-fpsAt));frames=0;fpsAt=now;if(!$('performance').hidden)updateMetrics();}
  }
  function updateMetrics() {
    const decodedMiB=Array.from(imageCache.values()).reduce((n,img)=>n+img.naturalWidth*img.naturalHeight*4,0)/1048576;
    const rows=[['First group ready',firstReady===null?'Loading':Math.round(firstReady)+' ms'],['Overlay cadence',moving?(fps?fps+' fps':'Measuring')+' / 30 fps cap':'Paused'],['Growth compositing',renderMs.toFixed(1)+' ms'],['Painting decoded cache',imageCache.size+' / 5 images · '+decodedMiB.toFixed(1)+' MiB'],['Lesson-patch images',patchImages?'9 / '+((patchImages.base.naturalWidth*patchImages.base.naturalHeight*4+Object.values(patchImages.sprites).reduce((n,i)=>n+i.naturalWidth*i.naturalHeight*4,0))/1048576).toFixed(1)+' MiB':'Not loaded'],['Lesson-patch encoded size',(window.HybridLessonPatches.bytes/1024).toFixed(0)+' KiB'],['Decoded-cache reuses',decodedHits],['Painting loads / encoded total',reads+' / '+(loadedBytes/1048576).toFixed(2)+' MiB'],['Canvas pixels',art.width+' × '+art.height],['Current growth',state+' / 10']];
    $('metrics').replaceChildren(); rows.forEach(([name,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=name;dd.textContent=String(value);row.append(dt,dd);$('metrics').append(row);});
  }
  data.groups.forEach((g,index)=>{const opt=document.createElement('option');opt.value=String(index);opt.textContent=g.name;$('groupSelect').append(opt);});
  $('paintedNature').onclick=()=>{patchMode=false;loadView();};$('patchNature').onclick=()=>{patchMode=true;loadView();};
  $('lessonDialog').querySelectorAll('.close,.done').forEach(button=>button.onclick=()=>$('lessonDialog').close());
  $('groupSelect').onchange=e=>go(Number(e.target.value)); $('previous').onclick=()=>go(group-1); $('next').onclick=()=>go(group+1);
  $('back').onclick=()=>{theme=null;loadView();}; $('growth').oninput=e=>{stopReplay();setState(e.target.value);};
  $('play').onclick=()=>{if(timer){stopReplay();return;}if(state===10)setState(1);$('play').textContent='Ⅱ';$('play').setAttribute('aria-pressed','true');$('play').setAttribute('aria-label','Pause growth evolution');timer=setInterval(()=>{if(state===10){stopReplay();return;}setState(state+1);},1100);};
  $('motion').setAttribute('aria-pressed',String(moving));$('motion').textContent=moving?'Life on':'Life paused';
  $('motion').onclick=()=>{moving=!moving;$('motion').setAttribute('aria-pressed',String(moving));$('motion').textContent=moving?'Life on':'Life paused';drawLife(performance.now());};
  $('perfToggle').onclick=()=>{$('performance').hidden=!$('performance').hidden;$('perfToggle').setAttribute('aria-expanded',String(!$('performance').hidden));updateMetrics();};
  $('closePerf').onclick=()=>{$('performance').hidden=true;$('perfToggle').setAttribute('aria-expanded','false');$('perfToggle').focus();};
  document.addEventListener('keydown',e=>{
    if($('lessonDialog').open)return;
    if(e.key==='Escape'&&document.fullscreenElement)return;
    if(e.key==='Escape'){if(!$('performance').hidden){$('closePerf').click();return;}if(theme){theme=null;loadView();}return;}
    if(['SELECT','INPUT','TEXTAREA'].includes(e.target.tagName))return;
    if(e.key==='ArrowLeft'){e.preventDefault();go(group-1);}if(e.key==='ArrowRight'){e.preventDefault();go(group+1);}
  });
  new ResizeObserver(resize).observe(landscape);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopReplay();});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);stopReplay();imageCache.clear();});
  // Testable state only. No persistence or cross-frame access is needed.
  window.hybridJourneyState=()=>({group,theme,state,viewport:viewport.state(),patches:patches(),lessonProgress:patches()?window.HybridLessonPatches.progress(state):null,ready:!!current,cachedImages:imageCache.size,renderMs,fps,moving});
  loadView();raf=requestAnimationFrame(animate);
})();
