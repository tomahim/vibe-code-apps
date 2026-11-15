(function (root) {
  'use strict';
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function orientation(width, height) { return width < height ? 'portrait' : 'landscape'; }
  function fit(width, height, ratio, padding) {
    const {left, right, top, bottom} = padding;
    const availableW = Math.max(1, width - left - right);
    const availableH = Math.max(1, height - top - bottom);
    const w = Math.min(availableW, availableH * ratio), h = w / ratio;
    return {x: left + (availableW - w) / 2, y: top + (availableH - h) / 2, width:w, height:h};
  }
  function placeLabels(points, bounds, width = 148, height = 48) {
    const boxes = [];
    for (const p of points) {
      const preferred = p.x < (bounds.left + bounds.right) / 2 ? p.x - width - 18 : p.x + 18;
      let best, score = Infinity;
      for (const dx of [preferred, p.x - width / 2, p.x + 18, p.x - width - 18]) {
        for (const dy of [-height / 2, -height - 22, 22, -height - 80, 80]) {
          const x = clamp(dx, bounds.left, Math.max(bounds.left, bounds.right - width));
          const y = clamp(p.y + dy, bounds.top, Math.max(bounds.top, bounds.bottom - height));
          let cost = Math.hypot(x + width/2 - p.x, y + height/2 - p.y);
          for (const b of boxes) if (x < b.x + width + 8 && x + width + 8 > b.x && y < b.y + height + 8 && y + height + 8 > b.y) cost += 10000;
          if (cost < score) { score = cost; best = {x,y,width,height}; }
        }
      }
      boxes.push(best);
    }
    return boxes;
  }
  function parseRoute(hash, data) {
    const value = hash.replace(/^#/, '');
    if (data.themes[value]) return {theme:value, group:data.groups.findIndex(g => g.themes.includes(value))};
    const group = data.groups.findIndex(g => 'world-' + g.key === value);
    return group < 0 ? {theme:'ocean', group:0} : {theme:null, group};
  }
  root.GardenCore = {clamp, orientation, fit, placeLabels, parseRoute};
})(window);
