/* Valley Fold - rigid flat-folding engine.
   Paper = list of planar faces (triangles). Each fold clips faces against the
   crease half-plane and rotates the moving side in 3D. Layers are kept with a
   z-order value baked into a small real z offset. */
'use strict';
window.VF = window.VF || {};
VF.engine = (function () {

  var EPSZ = 0.004;   // layer separation in world units (sheet half-side = 1)
  var SIDE = 1e-7;

  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function centroid(f) {
    var c = [0, 0, 0], n = f.pts.length;
    for (var i = 0; i < n; i++) { c[0] += f.pts[i][0]; c[1] += f.pts[i][1]; c[2] += f.pts[i][2]; }
    return [c[0] / n, c[1] / n, c[2] / n];
  }

  var nextId = 1;
  function face(pts, flip, z, group, pid) { var id = nextId++; return { id: id, pid: pid == null ? id : pid, pts: pts, flip: flip || 0, z: z || 0, group: group || 0 }; }
  function cloneFace(f) { return { id: f.id, pid: f.pid, pts: f.pts.map(function (p) { return p.slice(); }), flip: f.flip, z: f.z, group: f.group }; }

  function makeSheet() {
    // square [-1,1]^2, white side up (flip 0)
    return [
      face([[-1, -1, 0], [1, -1, 0], [1, 1, 0]], 0, 0, 0),
      face([[-1, -1, 0], [1, 1, 0], [-1, 1, 0]], 0, 0, 0)
    ];
  }

  function paper() {
    return { faces: makeSheet(), zTop: 0, zBot: 0, mem: {} };
  }

  function clonePaper(p) {
    return { faces: p.faces.map(cloneFace), zTop: p.zTop, zBot: p.zBot, mem: {} };
  }

  // signed side of point p (2D) relative to directed line a->b
  function side2(p, a, b) { return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]); }

  function pointInPoly(pt, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }

  // clip polygon pts (3D) by half-space dot(p-a, n) * keep > 0
  function clipPoly(pts, a, n, keep) {
    var out = [];
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i], q = pts[(i + 1) % pts.length];
      var dp = dot(sub(p, a), n) * keep, dq = dot(sub(q, a), n) * keep;
      if (dp >= -SIDE) out.push(p);
      if ((dp > SIDE && dq < -SIDE) || (dp < -SIDE && dq > SIDE)) {
        var t = dp / (dp - dq);
        out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]);
      }
    }
    return out;
  }

  function fanTris(pts) {
    var tris = [];
    for (var i = 1; i < pts.length - 1; i++) tris.push([pts[0], pts[i], pts[i + 1]]);
    return tris;
  }

  function rodrigues(p, pivot, axis, ang) {
    var v = sub(p, pivot), c = Math.cos(ang), s = Math.sin(ang);
    var k = axis, kv = cross(k, v), kdv = dot(k, v);
    return [
      pivot[0] + v[0] * c + kv[0] * s + k[0] * kdv * (1 - c),
      pivot[1] + v[1] * c + kv[1] * s + k[1] * kdv * (1 - c),
      pivot[2] + v[2] * c + kv[2] * s + k[2] * kdv * (1 - c)
    ];
  }

  /* op: {
       a:[x,y], b:[x,y],      crease line (2D layout coords)
       move:+1|-1,            which side of a->b moves (sign of side2)
       angle: radians,        final angle (default PI; sign = fold direction)
       region: [[x,y]...],    optional: only faces whose centroid is inside move
       includeGroups:[..], excludeGroups:[..],
       zMode:'over'|'under'|'keep',   default: over for angle>0 (valley), under for angle<0 (mountain)
       group: id assigned to moved faces,
       remember:'key' / restore:'key'  layer-order memory for fold+unfold pairs
     } */

  function ccw(poly) {
    var a = 0;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++)
      a += (poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1]);
    return a >= 0 ? poly : poly.slice().reverse();
  }

  function split(p, op) {
    var a2 = op.a, b2 = op.b;
    var dir2 = norm([b2[0] - a2[0], b2[1] - a2[1], 0]);
    var n = [-dir2[1], dir2[0], 0]; // 2D normal, lift to 3D (vertical plane)
    var a3 = [a2[0], a2[1], 0];
    var region = op.region ? ccw(op.region) : null;
    var moving = [], staying = [];
    for (var i = 0; i < p.faces.length; i++) {
      var f = p.faces[i];
      if (op.includeGroups && op.includeGroups.indexOf(f.group) < 0) { staying.push(f); continue; }
      if (op.excludeGroups && op.excludeGroups.indexOf(f.group) >= 0) { staying.push(f); continue; }
      // part of the face on the moving side of the crease
      var mv = clipPoly(f.pts, a3, n, op.move);
      var st = clipPoly(f.pts, a3, n, -op.move);
      if (region && mv.length >= 3) {
        // split the moving part by the (convex) region: inside moves, outside stays
        var inside = mv;
        for (var e = 0; e < region.length; e++) {
          var p1 = region[e], p2 = region[(e + 1) % region.length];
          var ed = norm([p2[0] - p1[0], p2[1] - p1[1], 0]);
          var en = [-ed[1], ed[0], 0];
          var e3 = [p1[0], p1[1], 0];
          fanTris(clipPoly(inside, e3, en, -1)).forEach(function (t) {
            staying.push(face(t, f.flip, f.z, f.group, f.pid));
          });
          inside = clipPoly(inside, e3, en, 1);
          if (inside.length < 3) break;
        }
        mv = inside;
      }
      fanTris(mv).forEach(function (t) { moving.push(face(t, f.flip, f.z, f.group, f.pid)); });
      fanTris(st).forEach(function (t) { staying.push(face(t, f.flip, f.z, f.group, f.pid)); });
    }
    return { moving: moving, staying: staying, axis: dir2, pivot: a3 };
  }

  // apply op at parameter t in [0,1]; mutates a working paper copy
  function applyAt(p, op, t) {
    if (isSpin(op)) return spin(p, op, t);
    var sp = split(p, op);
    var ang = (op.angle == null ? Math.PI : op.angle) * t;
    sp.moving.forEach(function (f) {
      f.pts = f.pts.map(function (pt) { return rodrigues(pt, sp.pivot, sp.axis, ang); });
    });
    return { moving: sp.moving, staying: sp.staying, faces: sp.staying.concat(sp.moving) };
  }

  // presentation transforms: spinZ rotates the whole model in its plane,
  // flipX turns it over (like turning a pancake, around the x axis).
  function spin(p, op, t) {
    var b = bounds(p);
    var c = [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2];
    var axis = op.flipX ? [1, 0, 0] : [0, 0, 1];
    var ang = (op.angle == null ? Math.PI : op.angle) * t;
    p.faces.forEach(function (f) {
      f.pts = f.pts.map(function (pt) { return rodrigues(pt, c, axis, ang); });
    });
    return { moving: p.faces, staying: [], faces: p.faces };
  }

  function commitSpin(p, op) {
    spin(p, op, 1);
    if (op.flipX) {
      p.faces.forEach(function (f) { f.flip ^= 1; f.z = -f.z; });
      var t = p.zTop; p.zTop = -p.zBot; p.zBot = -t;
    }
    return p;
  }

  function isSpin(op) { return !!(op.spinZ || op.flipX); }

  // fully apply op to paper p (t=1), committing layer order / flips / groups
  function commit(p, op) {
    if (isSpin(op)) return commitSpin(p, op);
    var r = applyAt(p, op, 1);
    var ang = op.angle == null ? Math.PI : op.angle;
    var flat = Math.abs(Math.abs(ang) - Math.PI) < 1e-6;
    var zMode = op.zMode || (ang >= 0 ? 'over' : 'under');
    if (flat) {
      r.moving.forEach(function (f) { f.flip ^= 1; });
      if (op.restore && p.mem[op.restore]) {
        var old = p.mem[op.restore];
        r.moving.forEach(function (f) { if (old[f.pid] != null) f.z = old[f.pid]; });
      } else if (zMode === 'over') {
        r.moving.sort(function (x, y) { return x.z - y.z; });
        r.moving.forEach(function (f) { f.z = ++p.zTop; });
      } else if (zMode === 'under') {
        r.moving.sort(function (x, y) { return y.z - x.z; });
        r.moving.forEach(function (f) { f.z = --p.zBot; });
      }
      if (op.remember) {
        var m = p.mem[op.remember] = {};
        r.moving.forEach(function (f) { m[f.pid] = f.z; });
      }
    }
    if (op.group != null) r.moving.forEach(function (f) { f.group = op.group; });
    p.faces = r.faces;
    return p;
  }

  function bake(p) {
    // bake z-order into real z offsets, return render-ready face list
    return p.faces.map(function (f) {
      var g = cloneFace(f);
      var dz = f.z * EPSZ;
      g.pts = g.pts.map(function (pt) { return [pt[0], pt[1], pt[2] + dz]; });
      return g;
    });
  }

  function bounds(p) {
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    p.faces.forEach(function (f) {
      f.pts.forEach(function (pt) {
        for (var i = 0; i < 3; i++) { mn[i] = Math.min(mn[i], pt[i]); mx[i] = Math.max(mx[i], pt[i]); }
      });
    });
    return { min: mn, max: mx };
  }

  return {
    paper: paper, clonePaper: clonePaper, commit: commit, applyAt: applyAt,
    split: split, bake: bake, bounds: bounds, centroid: centroid,
    side2: side2, pointInPoly: pointInPoly, EPSZ: EPSZ
  };
})();
