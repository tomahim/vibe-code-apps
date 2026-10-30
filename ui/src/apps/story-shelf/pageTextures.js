import * as THREE from 'three';

// Canvas textures for the immersive book: the same Markdown text and bundled
// illustrations as the readable mode, drawn onto paper.
export const PAGE_PX = { w: 1024, h: 1414 };
const PAPER = '#f4ead2';

function paper(ctx, side) {
  const { w, h } = PAGE_PX;
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, w, h);
  const g = ctx.createLinearGradient(0, 0, w, 0);
  const spine = side === 'left' ? 1 : 0, edge = 1 - spine;
  g.addColorStop(spine, 'rgba(90,60,30,.34)'); g.addColorStop(Math.abs(spine - .16), 'rgba(90,60,30,0)');
  g.addColorStop(edge, 'rgba(90,60,30,.08)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = .05;
  for (let i = 0; i < 700; i++) { ctx.fillStyle = i % 2 ? '#7a5a2c' : '#fff'; ctx.fillRect((i * 97) % w, (i * 211) % h, 2, 2); }
  ctx.globalAlpha = 1;
}

function wrap(ctx, text, x, y, maxW, lineH) {
  const words = text.split(/\s+/); let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); y += lineH; line = word; } else line = test;
  }
  if (line) { ctx.fillText(line, x, y); y += lineH; }
  return y;
}

export function drawTextPage(ctx, book, index) {
  const { w, h } = PAGE_PX; const page = book.pages[index];
  paper(ctx, 'left');
  const x = 110, maxW = w - 220;
  ctx.fillStyle = '#8a6a42'; ctx.font = '600 30px Georgia, serif'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(book.title.toUpperCase(), x, 120);
  ctx.fillStyle = book.color; ctx.font = 'italic 700 150px Georgia, serif'; ctx.globalAlpha = .28;
  ctx.fillText(`0${index + 1}`, w - 330, 270); ctx.globalAlpha = 1;
  ctx.fillStyle = '#2a1d12'; ctx.font = '700 66px Georgia, serif';
  let y = wrap(ctx, page.title, x, 240, maxW - 150, 76) + 24;
  let size = 46;
  const noteH = page.note ? 190 : 0;
  const limit = h - 170 - noteH;
  for (; size >= 28; size -= 2) {
    ctx.font = `${size}px Georgia, serif`;
    let probe = y;
    for (const p of page.paragraphs) { probe = measure(ctx, p, maxW, size * 1.42, probe) + size * .5; }
    if (probe <= limit) break;
  }
  ctx.fillStyle = '#33261a'; ctx.font = `${size}px Georgia, serif`;
  for (const p of page.paragraphs) { y = wrap(ctx, p, x, y, maxW, size * 1.42) + size * .5; }
  if (page.note) {
    const ny = h - 170 - noteH + 20;
    ctx.fillStyle = 'rgba(120,80,30,.12)'; ctx.fillRect(x - 20, ny, maxW + 40, noteH - 20);
    ctx.fillStyle = book.color; ctx.fillRect(x - 20, ny, 8, noteH - 20);
    ctx.fillStyle = '#8a6a42'; ctx.font = '700 26px Georgia, serif'; ctx.fillText('PAUSE & WONDER', x + 10, ny + 46);
    ctx.fillStyle = '#33261a'; ctx.font = 'italic 34px Georgia, serif';
    wrap(ctx, page.note, x + 10, ny + 92, maxW - 20, 44);
  }
  ctx.fillStyle = '#8a6a42'; ctx.font = '600 30px Georgia, serif'; ctx.fillText(String(index * 2 + 1).padStart(2, '0'), x, h - 70);
}
function measure(ctx, text, maxW, lineH, y) {
  const words = text.split(/\s+/); let line = '';
  for (const word of words) { const t = line ? `${line} ${word}` : word; if (ctx.measureText(t).width > maxW && line) { y += lineH; line = word; } else line = t; }
  return y + lineH;
}

export function drawPicturePage(ctx, book, index, img) {
  const { w, h } = PAGE_PX;
  paper(ctx, 'right');
  const m = 90, fw = w - m * 2, fh = h - m * 2 - 120;
  ctx.fillStyle = 'rgba(60,35,15,.22)'; ctx.fillRect(m + 10, m + 14, fw, fh);
  ctx.fillStyle = '#efe0bd'; ctx.fillRect(m - 14, m - 14, fw + 28, fh + 28);
  if (img && img.naturalWidth) {
    const s = Math.max(fw / img.naturalWidth, fh / img.naturalHeight);
    const sw = fw / s, sh = fh / s;
    ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, m, m, fw, fh);
  } else { ctx.fillStyle = book.color; ctx.globalAlpha = .35; ctx.fillRect(m, m, fw, fh); ctx.globalAlpha = 1; }
  ctx.fillStyle = '#8a6a42'; ctx.font = '600 28px Georgia, serif';
  ctx.fillText('AN IMAGINED WORLD, A REAL CURIOSITY', m, h - 100);
  ctx.textAlign = 'right'; ctx.fillText(String(index * 2 + 2).padStart(2, '0'), w - m, h - 100); ctx.textAlign = 'left';
}

export function drawCover(ctx, book, img, w, h) {
  ctx.fillStyle = book.color; ctx.fillRect(0, 0, w, h);
  if (img && img.naturalWidth) {
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight), sw = w / s, sh = h / s;
    ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, w, h);
  }
  const g = ctx.createLinearGradient(0, h * .45, 0, h); g.addColorStop(0, 'rgba(20,10,5,0)'); g.addColorStop(1, 'rgba(20,10,5,.85)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(244,226,180,.7)'; ctx.lineWidth = 5; ctx.strokeRect(26, 26, w - 52, h - 52);
  ctx.fillStyle = '#f4e2b4'; ctx.textAlign = 'center';
  ctx.font = '600 24px Georgia, serif'; ctx.fillText(`THE STORY ROOM · ${book.category.toUpperCase()}`, w / 2, h - 230);
  ctx.font = '700 64px Georgia, serif';
  const words = book.title.split(' '); let line = '', y = h - 160; const lines = [];
  for (const word of words) { const t = line ? `${line} ${word}` : word; if (ctx.measureText(t).width > w - 120 && line) { lines.push(line); line = word; } else line = t; }
  lines.push(line);
  y = h - 160 - (lines.length - 1) * 34;
  for (const l of lines) { ctx.fillText(l, w / 2, y); y += 70; }
  ctx.font = 'italic 28px Georgia, serif'; ctx.fillText(book.subtitle, w / 2, h - 52);
  ctx.textAlign = 'left';
}

function loadImage(src) {
  return new Promise(resolve => { const i = new Image(); i.onload = () => resolve(i); i.onerror = () => resolve(null); i.src = src; });
}

// Creates and caches textures. Picture textures redraw themselves once the image arrives.
export function createTextureStore(renderer) {
  const cache = new Map(); const images = new Map();
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const getImage = src => { if (!images.has(src)) images.set(src, loadImage(src)); return images.get(src); };
  function make(key, w, h, draw, imageSrc) {
    if (cache.has(key)) return cache.get(key);
    const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = Math.min(aniso, 8);
    draw(ctx, null); tex.needsUpdate = true;
    if (imageSrc) getImage(imageSrc).then(img => { draw(ctx, img); tex.needsUpdate = true; });
    cache.set(key, tex); return tex;
  }
  return {
    left: (book, i) => make(`${book.slug}:L${i}`, PAGE_PX.w, PAGE_PX.h, ctx => drawTextPage(ctx, book, i)),
    right: (book, i, src) => make(`${book.slug}:R${i}`, PAGE_PX.w, PAGE_PX.h, (ctx, img) => drawPicturePage(ctx, book, i, img), src),
    cover: (book) => make(`${book.slug}:C`, 768, 1056, (ctx, img) => drawCover(ctx, book, img, 768, 1056), book.cover),
    dispose() { cache.forEach(t => t.dispose()); cache.clear(); },
  };
}
