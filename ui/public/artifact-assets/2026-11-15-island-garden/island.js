/* Island Garden PoC: app-style fullscreen canvas, floating interface,
   viewport-shape-driven artwork. The painted island fills the screen behind
   the header, panel and growth dock. Portrait viewports use the portrait
   composition, landscape viewports the landscape one; when the painted pair
   for an orientation is still pending (manifest slot null), the available
   composition is reframed as an interim fallback and the pair note says so. */
(function () {
  'use strict';
  const data = window.ISLAND_GARDEN_DATA;
  const assets = window.ISLAND_GARDEN_ASSETS;
  const $ = id => document.getElementById(id);
  const stage = $('stage'), painting = $('painting');
  const art = $('art'), ctx = art.getContext('2d');
  const life = $('life'), live = life.getContext('2d');
  window.SceneTapGuard.install(stage);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const names = ['Sparse / dormant', 'First seedlings', 'Taking root', 'Young shoots', 'A little greener', 'Growing together', 'Canopies return', 'A thriving habitat', 'Almost in bloom', 'Full ecosystem'];
  let group = 0, theme = null, state = 10, version = 0, current = null;
  let orientation = null, slotUsed = null, interimSlot = false;
  let moving = !reduced, raf = 0, last = 0;
  let renderMs = 0, loadedBytes = 0, reads = 0, decodedHits = 0;
  let imageCache = new Map(), pending = new Map();
  const composite = document.createElement('canvas'), comp = composite.getContext('2d');
  const mask = document.createElement('canvas'), maskCtx = mask.getContext('2d');
  const particles = Array.from({length:38}, (_, i) => ({x: random(i * 11 + 4), y: random(i * 9 + 13), speed: .02 + random(i * 3 + 17) * .035, phase: random(i + 8) * 6.28}));
  function random(n) { const v = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); }

  const viewport = window.SceneViewport.install({root:stage, layer:painting,
    changed:()=>layout(), zoomIn:$('zoomIn'), zoomOut:$('zoomOut'), reset:$('zoomReset'), level:$('zoomLevel'),
    swipe:direction=>{ if(!theme) go(group+direction); }});

  function pairFor() { return theme ? assets.themes[theme] : assets.groups[group]; }
  function stageOrientation() {
    const b = stage.getBoundingClientRect();
    return b.height > b.width ? 'portrait' : 'landscape';
  }
  function pickEntry() {
    const pair = pairFor();
    const want = orientation;
    if (pair[want]) { interimSlot = false; return { entry: pair[want], slot: want }; }
    const other = want === 'portrait' ? 'landscape' : 'portrait';
    interimSlot = true; // Available composition reframed; painted pair pending.
    return { entry: pair[other], slot: other };
  }
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
        // Two views x two orientations x two endpoints, at most.
        while (imageCache.size > 8) imageCache.delete(imageCache.keys().next().value);
        pending.delete(entry.src); resolve(img);
      };
      img.onerror = () => { pending.delete(entry.src); reject(new Error('The painting could not load.')); };
      img.src = entry.src;
    });
    pending.set(entry.src, promise); return promise;
  }
  function report(message) { $('announcement').textContent = message; }

  function buildNav() {
    $('groupList').replaceChildren();
    data.groups.forEach((g, gi) => {
      const block = document.createElement('div'); block.className = 'group-block';
      const name = document.createElement('button'); name.className = 'group-name';
      name.textContent = g.name;
      const sub = document.createElement('small'); sub.textContent = g.blurb; name.append(sub);
      name.onclick = () => go(gi);
      block.append(name);
      const rows = document.createElement('div'); rows.className = 'theme-rows';
      g.themes.forEach(key => {
        const t = data.themes[key];
        const b = document.createElement('button'); b.className = 'theme-row';
        b.style.setProperty('--color', t.color);
        b.innerHTML = '<i></i><span></span>';
        b.querySelector('span').textContent = t.name;
        b.setAttribute('aria-current', String(theme === key));
        b.onclick = () => openTheme(key);
        rows.append(b);
      });
      block.append(rows);
      $('groupList').append(block);
    });
    const nav = $('bottomNav'); nav.replaceChildren();
    const overview = document.createElement('button');
    overview.textContent = 'World'; overview.setAttribute('aria-current', String(!theme));
    overview.onclick = () => { if (theme) { theme = null; loadView(); } };
    nav.append(overview);
    data.groups[group].themes.forEach(key => {
      const t = data.themes[key];
      const b = document.createElement('button'); b.textContent = t.name;
      b.setAttribute('aria-current', String(theme === key));
      b.onclick = () => openTheme(key);
      nav.append(b);
    });
    const pn = $('pairNote');
    pn.textContent = interimSlot
      ? 'This orientation is temporarily reframed from the existing painting; the distinct ' + orientation + ' composition is being painted separately.'
      : '';
    document.querySelectorAll('.theme-row').forEach(() => {});
  }

  function markers() {
    $('markers').replaceChildren();
    if (!theme) {
      const g = data.groups[group];
      const spots = (slotUsed === 'landscape' && g.wideSpots) ? g.wideSpots
        : (g.spots || (g.themes.length === 2 ? [[29,42],[74,49]] : [[50,21],[23,57],[77,58]]));
      g.themes.forEach((key, index) => {
        const t = data.themes[key];
        const b = document.createElement('button'); b.className = 'map-marker';
        b.style.cssText = 'left:' + spots[index][0] + '%;top:' + spots[index][1] + '%;--color:' + t.color;
        b.textContent = t.name; b.setAttribute('aria-label', 'Enter ' + t.name);
        b.onclick = () => openTheme(key); $('markers').append(b);
      });
    } else {
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 100 100'); svg.setAttribute('preserveAspectRatio','none');
      svg.classList.add('leaders'); $('markers').append(svg);
      const portrait = slotUsed === 'portrait';
      const labelSpots = portrait ? [[14,16],[72,22],[50,90]] : [[21,18],[77,25],[51,91]];
      data.themes[theme].lessons.forEach((lesson, index) => {
        const b = document.createElement('button'); b.className = 'map-marker lesson';
        const [lx,ly] = labelSpots[index];
        const ax = portrait && lesson.px !== undefined ? lesson.px : lesson.x;
        const ay = portrait && lesson.py !== undefined ? lesson.py : lesson.y;
        b.style.cssText = 'left:' + lx + '%;top:' + ly + '%;--color:' + data.themes[theme].color;
        const line = document.createElementNS(svg.namespaceURI,'line');
        line.setAttribute('x1',lx); line.setAttribute('y1',ly);
        line.setAttribute('x2',ax); line.setAttribute('y2',ay); svg.append(line);
        const point = document.createElementNS(svg.namespaceURI,'circle');
        point.setAttribute('cx',ax); point.setAttribute('cy',ay); point.setAttribute('r','1'); svg.append(point);
        b.innerHTML = '<div></div>'; b.firstChild.textContent = lesson.title;
        const small = document.createElement('span'); small.textContent = lesson.landmark; b.firstChild.append(small);
        b.setAttribute('aria-label', 'Open demo lesson ' + lesson.title + ' at ' + lesson.landmark);
        b.onclick = () => lessonOpen(index); $('markers').append(b);
      });
    }
  }
  function lessonOpen(index) {
    const t = data.themes[theme], l = t.lessons[index];
    $('lessonTitle').textContent = l.title;
    $('lessonLandmark').textContent = t.name + ' · At the ' + l.landmark.toLowerCase() + '.';
    $('lessonDialog').showModal();
  }

  async function loadView() {
    const token = ++version;
    viewport.reset();
    current = null; $('loadState').hidden = false; $('loadState').textContent = 'Preparing this little world...';
    $('markers').style.visibility = 'hidden'; art.style.opacity = '.3';
    orientation = stageOrientation();
    const picked = pickEntry(); slotUsed = picked.slot;
    buildNav(); markers();
    const chip = $('themeChip');
    $('back').hidden = !theme; chip.hidden = !theme;
    if (theme) {
      chip.querySelector('strong').textContent = data.themes[theme].name;
      chip.querySelector('small').textContent = data.themes[theme].ecosystem;
    }
    layout();
    try {
      const result = await Promise.all([image(picked.entry.sparse), image(picked.entry.lush)]);
      if (token !== version) return;
      current = {sparse: result[0], lush: result[1], seed: theme ? Object.keys(data.themes).indexOf(theme) + 40 : group};
      $('loadState').hidden = true; $('markers').style.visibility = ''; art.style.opacity = '1';
      layout(); render(); drawLife(performance.now());
      report(theme ? data.themes[theme].name + ', three demo lessons.' : data.groups[group].name + '.');
      // Alternate orientation preloaded in the background, ready for rotation.
      const pair = pairFor();
      const other = slotUsed === 'portrait' ? pair.landscape : pair.portrait;
      if (other) { const idle = window.requestIdleCallback || (fn => setTimeout(fn, 400));
        idle(() => { image(other.sparse); image(other.lush); }); }
    } catch (e) {
      if (token !== version) return;
      $('loadState').textContent = e.message + ' Tap to retry.'; $('loadState').onclick = loadView;
    }
  }
  function go(index) { stopReplay(); group = (index + 7) % 7; theme = null; loadView(); }
  function openTheme(key) { stopReplay(); theme = key; loadView(); }

  function layout() {
    const b = stage.getBoundingClientRect();
    const picked = current ? {w: current.lush.naturalWidth, h: current.lush.naturalHeight} : null;
    const entry = picked || (() => { const p = pickEntry(); return {w: p.entry.lush.width, h: p.entry.lush.height}; })();
    const compact = b.height <= 560 && b.width > 700; // short landscape windows
    const narrow = b.width <= 700 || compact;
    const topClear = narrow ? (compact ? 92 : 100) : 64;
    const bottomClear = narrow ? (compact ? 128 : 150) : 100;
    const availW = Math.max(1, b.width * (narrow ? 0.98 : 0.9));
    const availH = Math.max(1, b.height - topClear - bottomClear);
    const scale = Math.min(availW / entry.w, availH / entry.h);
    const w = Math.round(entry.w * scale), h = Math.round(entry.h * scale);
    painting.style.width = w + 'px'; painting.style.height = h + 'px';
    painting.style.left = Math.round((b.width - w) / 2) + 'px';
    painting.style.top = Math.round(topClear + (availH - h) / 2) + 'px';
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    const cw = Math.max(1, Math.min(1600, Math.round(w * dpr)));
    const ch = Math.max(1, Math.round(cw * h / Math.max(1, w)));
    if (art.width !== cw || art.height !== ch) { art.width = life.width = composite.width = cw; art.height = life.height = composite.height = ch; }
    viewport.reflow(); render(); drawLife(performance.now());
  }
  function onResize() {
    const next = stageOrientation();
    if (next !== orientation && current) {
      // Viewport shape changed: swap to the matching composition, keep
      // theme, group, growth state and labels.
      orientation = next;
      const picked = pickEntry(); slotUsed = picked.slot;
      viewport.reset();
      Promise.all([image(picked.entry.sparse), image(picked.entry.lush)]).then(result => {
        current = {sparse: result[0], lush: result[1], seed: current.seed};
        buildNav(); layout(); drawLife(performance.now());
      });
    } else layout();
  }
  function revealMask(progress) {
    mask.width = 192; mask.height = 192;
    maskCtx.clearRect(0, 0, 192, 192);
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
    ctx.clearRect(0,0,w,h); ctx.drawImage(current.sparse,0,0,w,h);
    if (state === 10) ctx.drawImage(current.lush,0,0,w,h);
    else if (state > 1) {
      const progress = (state-1)/9;
      revealMask(progress);
      comp.clearRect(0,0,w,h); comp.globalCompositeOperation='source-over'; comp.drawImage(current.lush,0,0,w,h);
      comp.globalCompositeOperation='destination-in'; comp.drawImage(mask,0,0,w,h); comp.globalCompositeOperation='source-over';
      ctx.drawImage(composite,0,0);
    }
    renderMs = performance.now() - at;
    document.documentElement.dataset.growthState = String(state);
    document.documentElement.dataset.growthReady = 'true';
  }
  function setState(value) { state = Math.max(1,Math.min(10,Number(value))); $('growth').value = String(state); render(); }
  let timer = null;
  function stopReplay() { clearInterval(timer); timer=null; $('play').textContent='▶'; $('play').setAttribute('aria-pressed','false'); }
  function drawLife(now) {
    const w=life.width,h=life.height,t=now/1000;
    live.clearRect(0,0,w,h);
    if (!moving || !current) return;
    const scale=w/700, k=theme || data.groups[group].key;
    live.fillStyle='rgba(72,69,45,.035)';
    live.beginPath();live.ellipse(((t*.016)%1.5-.25)*w,.48*h,.20*w,.05*h,-.3,0,Math.PI*2);live.fill();
    live.strokeStyle='rgba(64,62,48,.65)';live.lineWidth=Math.max(1,1.2*scale);
    for(let i=0;i<3;i++){
      const x=((t*(.03+i*.006)+i*.3)%1.3-.15)*w,y=(.17+i*.045+Math.sin(t+i)*.009)*h,s=(5+i)*scale,f=Math.sin(t*7+i)*s*.6;
      live.beginPath();live.moveTo(x-s,y+f);live.quadraticCurveTo(x-s*.4,y-s*.3,x,y);live.quadraticCurveTo(x+s*.4,y-s*.3,x+s,y+f);live.stroke();
    }
    if(k==='ocean'){
      live.strokeStyle='rgba(58,56,44,.7)';live.lineWidth=Math.max(1,scale);
      for(let i=0;i<5;i++){
        const gx=((t*.045+i*.13)%1.45-.22)*w,gy=(.11+.05*Math.sin(t*.8+i*2.1)+i*.016)*h,gs=(3.2+(i%3))*scale,gf=Math.sin(t*9+i*1.7)*gs*.7;
        live.beginPath();live.moveTo(gx-gs,gy+gf);live.quadraticCurveTo(gx-gs*.35,gy-gs*.4,gx,gy);live.quadraticCurveTo(gx+gs*.35,gy-gs*.4,gx+gs,gy+gf);live.stroke();
      }
      for(let i=0;i<2;i++){
        const a=t*(.5+i*.18)+i*3.1,gx=(.6+.14*Math.cos(a))*w,gy=(.3+.07*Math.sin(a))*h,gs=3.6*scale,gf=Math.sin(t*8+i)*gs*.6;
        live.beginPath();live.moveTo(gx-gs,gy+gf);live.quadraticCurveTo(gx-gs*.4,gy-gs*.3,gx,gy);live.quadraticCurveTo(gx+gs*.4,gy-gs*.3,gx+gs,gy+gf);live.stroke();
      }
      for(let i=0;i<12;i++){
        const sx=(.18+random(i*7+2)*.64)*w,sy=(.3+random(i*5+9)*.42)*h,tw=.5+.5*Math.sin(t*2.2+i*1.9);
        live.fillStyle='rgba(255,255,255,'+(.5*tw*tw)+')';
        live.beginPath();live.ellipse(sx,sy,1.7*scale*tw,.8*scale*tw,0,0,Math.PI*2);live.fill();
      }
      const mx=((t*.02+.35)%1.6-.3)*w,my=(.58+.04*Math.sin(t*.5))*h,mw=15*scale,mh=mw*.32,beat=Math.sin(t*2.4)*.35;
      live.fillStyle='rgba(18,60,74,.5)';
      live.beginPath();live.moveTo(mx-mw,my);
      live.quadraticCurveTo(mx-mw*.3,my-mh*(1+beat),mx,my);
      live.quadraticCurveTo(mx+mw*.3,my-mh*(1-beat),mx+mw,my);
      live.quadraticCurveTo(mx+mw*.3,my+mh*(1+beat),mx,my);
      live.quadraticCurveTo(mx-mw*.3,my+mh*(1-beat),mx-mw,my);live.fill();
      live.strokeStyle='rgba(18,60,74,.5)';
      live.beginPath();live.moveTo(mx+mw,my);live.lineTo(mx+mw+9*scale,my+2*scale);live.stroke();
    }
    const snow = k==='climate' || k==='space' || k==='sport' || k==='health' || k==='mind';
    const sparks = k==='physics' || k==='chemistry' || k==='engineering';
    particles.forEach((p,i)=>{
      const zoneX = snow ? .35+p.x*.3 : .12+p.x*.76;
      const x=(zoneX+Math.sin(t*.55+p.phase)*.009)*w;
      const y=(.2+(p.y+t*p.speed*.25)%.55)*h;
      live.fillStyle=snow?'rgba(255,255,255,.8)':sparks?'rgba(221,171,76,.6)':'rgba(202,178,92,.65)';
      live.beginPath();live.ellipse(x,y,(snow?1.5:2)*scale,(snow?1.5:.8)*scale,t*.5+p.phase,0,Math.PI*2);live.fill();
    });
    if (!sparks) {
      const r=(t%3)/3; live.strokeStyle='rgba(255,255,255,'+(.35*(1-r))+')';live.lineWidth=scale;
      live.beginPath();live.ellipse(.60*w,.63*h,(4+r*17)*scale,(1+r*5)*scale,0,0,Math.PI*2);live.stroke();
    }
  }
  function animate(now) {
    raf=requestAnimationFrame(animate);
    if(document.hidden || !moving || !current) return;
    if(now-last<1000/30-1) return;
    last=now;drawLife(now);
  }
  $('play').onclick=()=>{ if(timer){stopReplay();return;} if(state===10)setState(1);
    $('play').textContent='Ⅱ'; $('play').setAttribute('aria-pressed','true');
    timer=setInterval(()=>{ if(state===10){stopReplay();return;} setState(state+1); },1100); };
  $('growth').oninput=e=>{ stopReplay(); setState(e.target.value); };
  $('back').onclick=()=>{ theme=null; loadView(); };
  $('lessonDialog').querySelectorAll('.close,.done').forEach(button=>button.onclick=()=>$('lessonDialog').close());
  document.addEventListener('keydown',e=>{
    if($('lessonDialog').open) return;
    if(e.key==='Escape'){ if(theme){ theme=null; loadView(); } return; }
    if(['SELECT','INPUT','TEXTAREA'].includes(e.target.tagName)) return;
    if(e.key==='ArrowLeft'){ e.preventDefault(); go(group-1); }
    if(e.key==='ArrowRight'){ e.preventDefault(); go(group+1); }
  });
  let resizeTimer = 0;
  new ResizeObserver(()=>{ clearTimeout(resizeTimer); resizeTimer = setTimeout(onResize, 90); }).observe(stage);
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) stopReplay(); });
  window.addEventListener('pagehide',()=>{ cancelAnimationFrame(raf); stopReplay(); imageCache.clear(); });
  window.islandGardenState=()=>({group, theme, state, orientation, slot: slotUsed, interim: interimSlot,
    viewport: viewport.state(), ready: !!current, cachedImages: imageCache.size, renderMs, moving});
  loadView(); raf=requestAnimationFrame(animate);
})();
