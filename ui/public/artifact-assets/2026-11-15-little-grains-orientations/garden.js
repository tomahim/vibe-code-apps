(function () {
  'use strict';
  const data = window.HYBRID_JOURNEY_DATA, assets = window.GARDEN_ARTWORK;
  const Core = window.GardenCore, $ = id => document.getElementById(id);
  const keys = ['ocean', 'nature'];
  const canvas = $('art'), ctx = canvas.getContext('2d');
  const life = $('life'), live = life.getContext('2d');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = $('stage'), markers = $('markers'), svg = $('leaders');
  const svgNS = 'http://www.w3.org/2000/svg';
  const initial = Core.parseRoute(location.hash, data);
  let theme = keys.includes(initial.theme) ? initial.theme : 'ocean';
  let growth = 10, direction, current = null, request = 0, timer = null, artOnly = false;
  let geometry, width = 1, height = 1, labelButtons = [], resizeFrame = 0;
  let lessonIndex = 0, loadedBytes = 0, renders = 0;
  const cache = new Map(), pending = new Map();
  const started = performance.now(); let firstReady = null;
  const storageKey = 'little-grains-orientation-demo-v1';
  let discovered = new Set();
  try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(saved)) discovered = new Set(saved.filter(s => /^(nature|ocean):[0-2]$/.test(s))); } catch (_) { /* Opaque artifact frames use session state. */ }
  const growthNames = ['Dormant', 'First signs', 'Taking root', 'Young shoots', 'A little greener', 'Growing together', 'Canopies return', 'Thriving', 'Almost in bloom', 'Full ecosystem'];
  function announce(text) { $('announcement').textContent = text; }
  function stopPlay() { clearInterval(timer); timer = null; $('play').textContent = '▶'; $('play').setAttribute('aria-pressed', 'false'); $('play').setAttribute('aria-label', 'Play growth evolution'); }
  function image(entry) {
    if (cache.has(entry.src)) { const hit = cache.get(entry.src); cache.delete(entry.src); cache.set(entry.src, hit); return Promise.resolve(hit); }
    if (pending.has(entry.src)) return pending.get(entry.src);
    const promise = new Promise((resolve, reject) => {
      const img = new Image(); img.decoding = 'async';
      img.onload = async () => {
        try { await img.decode(); } catch (_) { /* onload proves decoding succeeded enough to draw. */ }
        cache.set(entry.src, img); loadedBytes += entry.bytes || 0;
        while (cache.size > 6) cache.delete(cache.keys().next().value);
        pending.delete(entry.src); resolve(img);
      };
      img.onerror = () => { pending.delete(entry.src); reject(new Error('This painting could not load.')); };
      img.src = entry.src;
    });
    pending.set(entry.src, promise); return promise;
  }
  async function pair(entry) { const [lush, dormant] = await Promise.all([image(entry.lush), image(entry.dormant)]); return {lush, dormant, entry}; }
  function entryFor(key, orient) { return assets.themes[key][orient]; }
  async function loadScene() {
    const token = ++request, key = theme, orient = direction;
    current = null; markers.hidden = true; svg.hidden = true;
    $('loadState').hidden = false; $('loadState').disabled = true; $('loadState').textContent = 'Growing your little world…';
    canvas.setAttribute('aria-label', `${data.themes[key].name}: ${data.themes[key].ecosystem}, ${orient} painting`);
    updateContext(); paint();
    try {
      const ready = await pair(entryFor(key, orient));
      if (token !== request) return;
      current = ready; if (firstReady === null) firstReady = performance.now() - started;
      $('loadState').hidden = true; markers.hidden = false; svg.hidden = false;
      makeMarkers(); layout();
      announce(`${data.themes[key].name}. Three discoveries. ${growthNames[growth - 1]}.`);
      // Only this theme's alternate pair is preloaded; no whole-catalog decode.
      pair(entryFor(key, orient === 'portrait' ? 'landscape' : 'portrait')).catch(() => {});
    } catch (error) {
      if (token !== request) return;
      $('loadState').textContent = 'Couldn’t load this world. Tap to retry.';
      $('loadState').disabled = false; announce(error.message);
    }
  }
  function updateContext() {
    const t = data.themes[theme];
    $('sceneTitle').textContent = t.name; $('sceneDescription').textContent = t.ecosystem;
    $('worldName').textContent = t.name + '  ⌄';
    $('completedCount').textContent = String(discovered.size);
    document.title = `${t.name} · Little Grains`;
    $('growthName').textContent = growthNames[growth - 1];
    $('growth').setAttribute('aria-valuetext', `${growth} of 10: ${growthNames[growth - 1]}`);
    $('growth').value = String(growth);
  }
  function makeMarkers() {
    markers.replaceChildren(); svg.replaceChildren(); labelButtons = [];
    data.themes[theme].lessons.forEach((lesson, i) => {
      const b = document.createElement('button'); b.type = 'button';
      b.className = 'marker' + (discovered.has(theme + ':' + i) ? ' complete' : '');
      b.dataset.lesson = String(i); b.style.setProperty('--accent', data.themes[theme].color);
      const dot = document.createElement('span'); dot.className = 'dot'; dot.setAttribute('aria-hidden','true');
      const text = document.createElement('span'); text.className = 'text';
      const strong = document.createElement('strong'); strong.textContent = lesson.landmark;
      const small = document.createElement('small'); small.textContent = lesson.title;
      text.append(strong,small); b.append(dot,text);
      b.setAttribute('aria-label', `${lesson.title}, at the ${lesson.landmark}${discovered.has(theme + ':' + i) ? ', discovered' : ''}`);
      b.onclick = () => openLesson(i); markers.append(b); labelButtons.push(b);
      const line = document.createElementNS(svgNS,'line'), point = document.createElementNS(svgNS,'circle');
      point.setAttribute('r','3.5'); svg.append(line,point);
    });
  }
  function layout() {
    const rect = stage.getBoundingClientRect(); width = rect.width; height = rect.height;
    const next = Core.orientation(width, height);
    if (next !== direction) { direction = next; loadScene(); }
    const mobile = width <= 680;
    const padding = artOnly ? {left:8,right:8,top:8,bottom:88} : {
      left:mobile ? 0 : 106, right:mobile ? 0 : 24,
      top:mobile ? Math.min(80,height*.15) : 70,
      bottom:mobile ? 95 : 80,
    };
    const entry = current?.entry || entryFor(theme,direction);
    const ratio = entry.lush.width / entry.lush.height;
    geometry = Core.fit(width,height,ratio,padding);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = Math.max(1,Math.round(width*dpr)), h = Math.max(1,Math.round(height*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    if(life.width!==w||life.height!==h){life.width=w;life.height=h;}
    ctx.setTransform(dpr,0,0,dpr,0,0); live.setTransform(dpr,0,0,dpr,0,0); paint();
    if(!current) return;
    const points = entry.anchors.map(([x,y]) => ({x:geometry.x + x*geometry.width/100,y:geometry.y + y*geometry.height/100}));
    const bounds = artOnly ? {left:10,right:width-10,top:76,bottom:height-110} : {left:mobile?10:110,right:width-10,top:mobile?155:185,bottom:height-(mobile?168:117)};
    if(bounds.bottom-bounds.top<120) bounds.top=Math.min(bounds.top,height*.29);
    const boxes=Core.placeLabels(points,bounds);
    labelButtons.forEach((b,i)=>{
      const box=boxes[i],p=points[i]; b.style.left=box.x+'px';b.style.top=box.y+'px';
      b.dataset.anchorX=String(p.x);b.dataset.anchorY=String(p.y);
      const line=svg.children[i*2],circle=svg.children[i*2+1];
      line.setAttribute('x1',Core.clamp(p.x,box.x+8,box.x+box.width-8));line.setAttribute('y1',Core.clamp(p.y,box.y+8,box.y+box.height-8));
      line.setAttribute('x2',p.x);line.setAttribute('y2',p.y);circle.setAttribute('cx',p.x);circle.setAttribute('cy',p.y);
    });
  }
  const composite=document.createElement('canvas'),comp=composite.getContext('2d');
  const overlay=document.createElement('canvas'),over=overlay.getContext('2d');
  const mask=document.createElement('canvas'),maskContext=mask.getContext('2d');mask.width=192;mask.height=192;
  function reveal(progress){
    maskContext.clearRect(0,0,192,192);maskContext.filter='blur(3px)';
    for(let y=0;y<24;y++)for(let x=0;x<24;x++){
      const noise=Math.sin(x*31+y*79+17)*43758.5453;
      const threshold=noise-Math.floor(noise),alpha=Core.clamp((progress-threshold+.08)/.16,0,1);
      maskContext.fillStyle='rgba(255,255,255,'+alpha+')';maskContext.fillRect(x*8,y*8,8,8);
    }
    maskContext.filter='none';
  }
  function paint() {
    ctx.fillStyle='#f3e8d0'; ctx.fillRect(0,0,width,height);
    if(!current||!geometry)return;
    // Blend once on a transparent offscreen layer, then composite over exact paper.
    // Keeping the original alpha avoids darkening the contact shadow at mid-growth.
    const w=current.lush.naturalWidth,h=current.lush.naturalHeight;
    if(composite.width!==w||composite.height!==h){composite.width=overlay.width=w;composite.height=overlay.height=h;}
    comp.clearRect(0,0,w,h);comp.globalCompositeOperation='source-over';comp.globalAlpha=1;
    comp.drawImage(current.dormant,0,0,w,h);
    if(growth===10){comp.clearRect(0,0,w,h);comp.drawImage(current.lush,0,0,w,h);}
    else if(growth>1){
      reveal((growth-1)/9);over.clearRect(0,0,w,h);over.globalCompositeOperation='source-over';over.drawImage(current.lush,0,0,w,h);
      over.globalCompositeOperation='destination-in';over.drawImage(mask,0,0,w,h);over.globalCompositeOperation='source-over';
      comp.globalCompositeOperation='source-atop';comp.drawImage(overlay,0,0,w,h);
    }
    comp.globalCompositeOperation='source-over';comp.globalAlpha=1;
    ctx.drawImage(composite,geometry.x,geometry.y,geometry.width,geometry.height);renders++;
  }

  // Decorative life overlay: birds, rays and drifting specks on a transparent
  // canvas above the painting, below the lesson labels. Capped at 30 fps.
  const rand = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  function bird(x, y, s, f) {
    live.beginPath(); live.moveTo(x - s, y + f);
    live.quadraticCurveTo(x - s * .4, y - s * .35, x, y);
    live.quadraticCurveTo(x + s * .4, y - s * .35, x + s, y + f); live.stroke();
  }
  function ray(gx, gy, mw, beat) {
    const mh = mw * .32;
    live.beginPath(); live.moveTo(gx - mw, gy);
    live.quadraticCurveTo(gx - mw * .3, gy - mh * (1 + beat), gx, gy);
    live.quadraticCurveTo(gx + mw * .3, gy - mh * (1 - beat), gx + mw, gy);
    live.quadraticCurveTo(gx + mw * .3, gy + mh * (1 + beat), gx, gy);
    live.quadraticCurveTo(gx - mw * .3, gy + mh * (1 - beat), gx - mw, gy);
    live.fill();
    live.beginPath(); live.moveTo(gx + mw, gy); live.lineTo(gx + mw + mw * .6, gy + mh * .6); live.stroke();
  }
  function drawLife(now) {
    const t = now / 1000;
    live.clearRect(0, 0, width, height);
    if (!current || !geometry) return;
    const gx = geometry.x, gy = geometry.y, gw = geometry.width, gh = geometry.height;
    const scale = gw / 700, px = fx => gx + fx * gw, py = fy => gy + fy * gh;
    // A slow cloud shadow drifting across the painting.
    live.fillStyle = 'rgba(72,69,45,.035)';
    live.beginPath(); live.ellipse(px(((t * .016) % 1.5) - .25), py(.45), gw * .2, gh * .05, -.3, 0, Math.PI * 2); live.fill();
    // Small birds crossing the sky of either world.
    live.strokeStyle = 'rgba(64,62,48,.65)'; live.lineWidth = Math.max(1, 1.2 * scale);
    for (let i = 0; i < 3; i++) {
      const bx = px(((t * (.03 + i * .006) + i * .3) % 1.3) - .15), by = py(.1 + i * .05 + Math.sin(t + i) * .012), s = (5 + i) * scale, f = Math.sin(t * 7 + i) * s * .6;
      bird(bx, by, s, f);
    }
    if (theme === 'ocean') {
      // A gull squadron crossing high, then two wheeling over the lagoon.
      live.strokeStyle = 'rgba(58,56,44,.7)'; live.lineWidth = Math.max(1, scale);
      for (let i = 0; i < 5; i++) {
        const bx = px(((t * .045 + i * .13) % 1.45) - .22), by = py(.08 + .04 * Math.sin(t * .8 + i * 2.1) + i * .018), s = (3.2 + (i % 3)) * scale, f = Math.sin(t * 9 + i * 1.7) * s * .7;
        bird(bx, by, s, f);
      }
      for (let i = 0; i < 2; i++) {
        const a = t * (.5 + i * .18) + i * 3.1, s = 3.6 * scale, f = Math.sin(t * 8 + i) * s * .6;
        bird(px(.6 + .14 * Math.cos(a)), py(.28 + .07 * Math.sin(a)), s, f);
      }
      // Sun glints twinkling on the lagoon.
      for (let i = 0; i < 12; i++) {
        const sx = px(.18 + rand(i * 7 + 2) * .64), sy = py(.32 + rand(i * 5 + 9) * .4), tw = .5 + .5 * Math.sin(t * 2.2 + i * 1.9);
        live.fillStyle = 'rgba(255,255,255,' + (.5 * tw * tw) + ')';
        live.beginPath(); live.ellipse(sx, sy, 1.7 * scale * tw, .8 * scale * tw, 0, 0, Math.PI * 2); live.fill();
      }
      // A few small fish drifting through the lagoon in the painting's muted palette.
      live.fillStyle = 'rgba(38,84,96,.5)';
      for (let i = 0; i < 6; i++) {
        const dir = i % 2 ? -1 : 1, sp = .022 + rand(i * 3 + 5) * .014;
        const fx = px(((t * sp * dir + rand(i * 13 + 4)) % 1 + 1) % 1 * .6 + .2), fy = py(.48 + rand(i * 7 + 11) * .3 + Math.sin(t * .9 + i * 2.2) * .012);
        const s = (3.4 + rand(i + 9) * 2.2) * scale, tail = Math.sin(t * 6 + i * 1.4) * s * .3;
        live.beginPath(); live.ellipse(fx, fy, s, s * .38, 0, 0, Math.PI * 2); live.fill();
        live.beginPath(); live.moveTo(fx - dir * s, fy);
        live.lineTo(fx - dir * (s + s * .5), fy - s * .35 + tail * .5);
        live.lineTo(fx - dir * (s + s * .5), fy + s * .35 + tail * .5); live.fill();
      }
      // Two small gray rays gliding beneath the surface, deliberately muted.
      live.fillStyle = 'rgba(45,58,66,.45)'; live.strokeStyle = 'rgba(45,58,66,.45)'; live.lineWidth = Math.max(1, scale);
      ray(px(((t * .018 + .35) % 1.6) - .3), py(.6 + .03 * Math.sin(t * .5)), 9 * scale, Math.sin(t * 2.4) * .35);
      ray(px(((t * .013 + .8) % 1.7) - .35), py(.72 + .025 * Math.sin(t * .4 + 2)), 7 * scale, Math.sin(t * 2.1 + 1) * .35);
    } else {
      // Nature: butterflies over the clearings and drifting pollen in the light.
      for (let i = 0; i < 3; i++) {
        const a = t * (.4 + i * .13) + i * 2.4, bx = px(.3 + i * .2 + .09 * Math.cos(a)), by = py(.55 + .1 * Math.sin(a * 1.3) + i * .06), s = 2.6 * scale, w2 = Math.abs(Math.sin(t * 9 + i)) * s;
        live.fillStyle = 'rgba(94,80,56,.55)';
        live.beginPath(); live.ellipse(bx - w2 * .5, by, w2 * .55, s * .5, -.5, 0, Math.PI * 2); live.fill();
        live.beginPath(); live.ellipse(bx + w2 * .5, by, w2 * .55, s * .5, .5, 0, Math.PI * 2); live.fill();
      }
      for (let i = 0; i < 14; i++) {
        const sx = px(.15 + rand(i * 11 + 3) * .7 + Math.sin(t * .5 + i) * .008), sy = py(.15 + ((rand(i * 5 + 7) + t * .012) % .6));
        live.fillStyle = 'rgba(202,178,92,.5)';
        live.beginPath(); live.ellipse(sx, sy, 1.6 * scale, .8 * scale, t * .5 + i, 0, Math.PI * 2); live.fill();
      }
    }
  }
  let lifeLast = 0;
  function animateLife(now) {
    requestAnimationFrame(animateLife);
    if (document.hidden || !current) return;
    if (now - lifeLast < 1000 / 30 - 1) return;
    lifeLast = now; drawLife(now);
  }
  if (!reduceMotion) requestAnimationFrame(animateLife);
  function setGrowth(value) { growth=Core.clamp(Math.round(Number(value))||1,1,10);updateContext();paint(); }
  function navigate(key, push=true) {
    if(!keys.includes(key)) return;
    stopPlay();theme=key;
    if(push){try{history.replaceState(null,'','#'+key);}catch(_){/* Sandboxed srcdoc can deny history writes. */}}
    loadScene();
  }
  function openDialog(id){stopPlay();$(id).showModal();}
  function openWorlds(){
    $('worldList').replaceChildren();
    keys.forEach((key,i)=>{
      const t=data.themes[key],b=document.createElement('button');b.className='world-card'+(theme===key?' selected':'');
      const number=document.createElement('span');number.className='number';number.textContent='0'+(i+1)+' / LEARNING WORLD';
      const name=document.createElement('strong');name.textContent=t.name;
      const sub=document.createElement('small');sub.textContent=t.ecosystem+' · 3 discoveries';
      b.append(number,name,sub);b.onclick=()=>{$('worldsDialog').close();navigate(key);};$('worldList').append(b);
    });openDialog('worldsDialog');
  }
  const lessons={
    ocean:[
      'Look closely at the coral garden. Its branching and plate-like forms create shelter for many different creatures. Which shapes can you spot?',
      'Follow the pale ridge where waves break. A reef crest takes the force of the open water, helping shelter the calmer lagoon behind it.',
      'Find where turquoise gives way to deeper blue. Water depth changes the light that reaches below the surface, shaping the life that can live there.'
    ],
    nature:[
      'Look for the old oak’s broad trunk and branching crown. A tree adds a new growth ring each year, leaving a record of its life inside the wood.',
      'Trace the stream through the forest. Moving water connects habitats, carrying nutrients and offering many small places for life to gather.',
      'Find the mound of woven branches by the water. A beaver lodge provides shelter, while the beaver’s building work can change the habitat around it.'
    ]
  };
  function openLesson(index){
    lessonIndex=index;const l=data.themes[theme].lessons[index];
    $('lessonTitle').textContent=l.title;$('lessonLandmark').textContent=data.themes[theme].name+' · '+l.landmark;
    $('lessonBody').textContent=lessons[theme][index];
    $('completeLesson').textContent=discovered.has(theme+':'+index)?'Discovered ✓':'Mark as discovered ↗';
    openDialog('lessonDialog');
  }
  function showProgress(){
    $('progressSummary').textContent=discovered.size+' of 6 little discoveries. There’s always something new to notice.';
    $('progressList').replaceChildren();
    keys.forEach(key=>{
      const row=document.createElement('div');row.className='progress-row';
      const text=document.createElement('div');text.textContent=data.themes[key].name;
      const small=document.createElement('small');small.textContent=data.themes[key].lessons.filter((_,i)=>discovered.has(key+':'+i)).length+' / 3 discovered';text.append(small);
      const button=document.createElement('button');button.textContent='Explore ↗';button.onclick=()=>{$('progressDialog').close();navigate(key);};row.append(text,button);$('progressList').append(row);
    });openDialog('progressDialog');
  }
  function showAbout(){
    $('benchmarkNotes').textContent=assets.note;
    const rows=[['Composition',direction],['Artwork',current?current.lush.naturalWidth+' × '+current.lush.naturalHeight:'Loading'],['Decoded cache',cache.size+' / 6 images'],['Loaded artwork',(loadedBytes/1048576).toFixed(2)+' MiB'],['First scene ready',firstReady===null?'Loading':Math.round(firstReady)+' ms'],['Growth',growth+' / 10']];
    $('metrics').replaceChildren();rows.forEach(([k,v])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;$('metrics').append(dt,dd);});openDialog('aboutDialog');
  }
  function setArtOnly(value, native = true){
    artOnly=value;$('garden').classList.toggle('image-only',value);$('exitArt').hidden=!value;$('expandedWorlds').hidden=!value;
    $('artOnly').setAttribute('aria-label',value?'Leave full screen':'Expand garden, keeping lesson labels');
    if(native){
      if(value && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{});
      else if(!value && document.fullscreenElement) document.exitFullscreen().catch(()=>{});
    }
    layout();(value?$('exitArt'):$('artOnly')).focus();
  }
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&artOnly)setArtOnly(false,false);});
  $('loadState').onclick=loadScene;
  $('home').onclick=openWorlds;$('back').onclick=openWorlds;$('worldName').onclick=openWorlds;
  $('navGarden').onclick=()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());};
  $('expandedWorlds').onclick=openWorlds;$('navWorlds').onclick=openWorlds;$('navProgress').onclick=showProgress;$('progressPill').onclick=showProgress;$('about').onclick=showAbout;
  $('previous').onclick=() => navigate(keys[(keys.indexOf(theme)+1)%keys.length]);
  $('next').onclick=() => navigate(keys[(keys.indexOf(theme)+1)%keys.length]);
  $('growth').oninput=e=>{stopPlay();setGrowth(e.target.value);};
  $('play').onclick=()=>{if(timer){stopPlay();return;}if(growth===10)setGrowth(1);$('play').textContent='Ⅱ';$('play').setAttribute('aria-pressed','true');$('play').setAttribute('aria-label','Pause growth evolution');timer=setInterval(()=>{setGrowth(growth+1);if(growth===10)stopPlay();},850);};
  $('completeLesson').onclick=()=>{discovered.add(theme+':'+lessonIndex);try{localStorage.setItem(storageKey,JSON.stringify([...discovered]));}catch(_){}$('lessonDialog').close();updateContext();makeMarkers();layout();labelButtons[lessonIndex]?.focus();announce('Discovery saved. '+discovered.size+' of 6 discoveries.');};
  $('artOnly').onclick=()=>setArtOnly(!artOnly);$('exitArt').onclick=()=>setArtOnly(false);
  document.querySelectorAll('dialog .close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}));
  window.addEventListener('hashchange',()=>navigate(Core.parseRoute(location.hash,data).theme,false));
  document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(e.key==='Escape'&&artOnly){setArtOnly(false);return;}if(['INPUT','TEXTAREA','SELECT','BUTTON'].includes(e.target.tagName))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();$('next').click();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlay();});
  new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(layout);}).observe(stage);
  window.addEventListener('pagehide',()=>{stopPlay();cancelAnimationFrame(resizeFrame);cache.clear();});
  window.littleGrainsState=()=>({theme,growth,orientation:direction,ready:!!current,cacheSize:cache.size,cached:[...cache.keys()],discovered:[...discovered],geometry,renders,artOnly});
  layout();
})();
