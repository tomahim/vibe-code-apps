/* Valley Fold - model library. Ten classic models, simple to complex.
   Sheet: square [-1,1]^2, white side up unless noted.
   kind: 'v' valley (toward viewer), 'm' mountain (behind). */
'use strict';
window.VF = window.VF || {};
VF.models = (function () {

  function mk(a, b, toward, kind, opts) {
    opts = opts || {};
    var move = VF.engine.side2(toward, a, b) >= 0 ? 1 : -1;
    var mag = opts.angle == null ? Math.PI : opts.angle;
    var op = {
      a: a, b: b, move: move,
      angle: move * (kind === 'v' ? mag : -mag),
      kind: kind
    };
    if (opts.region) op.region = opts.region;
    if (opts.includeGroups) op.includeGroups = opts.includeGroups;
    if (opts.excludeGroups) op.excludeGroups = opts.excludeGroups;
    if (opts.group != null) op.group = opts.group;
    if (opts.remember) op.remember = opts.remember;
    if (opts.restore) op.restore = opts.restore;
    if (opts.zMode) op.zMode = opts.zMode;
    return op;
  }

  // fold so point `from` lands on point `to` (crease = perpendicular bisector)
  function foldTo(from, to, kind, opts) {
    var mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
    var d = [to[0] - from[0], to[1] - from[1]];
    var perp = [-d[1], d[0]];
    var b = [mid[0] + perp[0], mid[1] + perp[1]];
    return mk(mid, b, from, kind, opts);
  }

  function reflectPt(p, a, b) {
    var d = [b[0] - a[0], b[1] - a[1]];
    var l2 = d[0] * d[0] + d[1] * d[1];
    var t = ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]) / l2;
    var f = [a[0] + t * d[0], a[1] + t * d[1]];
    return [2 * f[0] - p[0], 2 * f[1] - p[1]];
  }

  var preGroup = 100;
  // fold and unfold (pre-crease), as two ops within one step
  function precrease(a, b, toward, kind, key, opts) {
    opts = opts || {};
    var g = preGroup++;
    var o1 = mk(a, b, toward, kind, opts); o1.remember = key; o1.group = g;
    // after folding, the flap lies on the mirrored side: select it there, only its own layer group
    var o2 = mk(a, b, reflectPt(toward, a, b), kind,
      { includeGroups: [g] });
    o2.restore = key; o2.group = 0;
    return [o1, o2];
  }
  function precreaseTo(from, to, kind, key, opts) {
    var mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
    var d = [to[0] - from[0], to[1] - from[1]];
    var b = [mid[0] - d[1], mid[1] + d[0]];
    return precrease(mid, b, from, kind, key, opts);
  }
  function spinZ(angle) { return { spinZ: true, angle: angle }; }
  function flipX() { return { flipX: true }; }

  var S = []; // models

  /* ---------- 1. Paper Cup ---------- */
  S.push({
    slug: 'cup', name: 'Paper Cup', diff: 1, color: '#e07856',
    blurb: 'A real cup you can drink from. The classic first fold.',
    steps: [
      { text: 'Fold the sheet in half diagonally, bottom-right corner to top-left.',
        ops: [foldTo([1, -1], [-1, 1], 'v', { group: 1 })] },
      { text: 'Fold the right corner over to the middle of the left edge.',
        ops: [foldTo([1, 1], [-1, 0], 'v', { group: 2 })] },
      { text: 'Fold the left corner over to the middle of the top edge.',
        ops: [foldTo([-1, -1], [0, 1], 'v', { group: 3 })] },
      { text: 'Fold the front rim triangle out over the top edge.',
        ops: [mk([1, 1], [-1, -1], [-1, 1], 'v', {
          region: [[1 / 6, 1 / 6], [-1 / 6, -1 / 6], [-1 / 8, 1 / 8]],
          includeGroups: [1], group: 4 })] },
      { text: 'Fold the back rim triangle behind, the same way. Open the pocket - your cup is ready.',
        ops: [mk([1, 1], [-1, -1], [-1, 1], 'm', {
          region: [[1 / 6, 1 / 6], [-1 / 6, -1 / 6], [-1 / 8, 1 / 8]],
          includeGroups: [0], group: 5 })] }
    ]
  });

  /* ---------- 2. Cat Face ---------- */
  S.push({
    slug: 'cat', name: 'Cat Face', diff: 1, color: '#d8a84e',
    blurb: 'Three folds and one behind: whiskers optional.',
    steps: [
      { text: 'Fold in half diagonally, bottom-right corner to top-left.',
        ops: [foldTo([1, -1], [-1, 1], 'v', { group: 1 })] },
      { text: 'Fold the right corner up and out to make an ear.',
        ops: [mk([0.11, 0.11], [0.315, 1], [1, 1], 'v', { group: 2 })] },
      { text: 'Fold the left corner up and out for the other ear.',
        ops: [mk([-0.11, -0.11], [-1, -0.315], [-1, -1], 'v', { group: 3 })] },
      { text: 'Fold the top point behind.',
        ops: [mk([-1, 0.45], [-0.45, 1], [-1, 1], 'm', { group: 4 })] },
      { text: 'Turn the face upright - ears up, chin down. Draw on whiskers!',
        ops: [spinZ(7 * Math.PI / 4)], cam: { pitch: 0.3, yaw: 0 } }
    ]
  });

  /* ---------- 3. Envelope ---------- */
  S.push({
    slug: 'envelope', name: 'Envelope', diff: 2, color: '#62c9da',
    blurb: 'A pocket for small letters, closed with a tuck.',
    steps: [
      { text: 'Fold in half diagonally, then unfold.',
        ops: precreaseTo([-1, -1], [1, 1], 'v', 'e1') },
      { text: 'Fold the top-left corner to the center.',
        ops: [foldTo([-1, 1], [0, 0], 'v', { group: 1 })] },
      { text: 'Fold the bottom-right corner to the center.',
        ops: [foldTo([1, -1], [0, 0], 'v', { group: 2 })] },
      { text: 'Fold the bottom-left corner up past the center.',
        ops: [foldTo([-1, -1], [0, 0.35], 'v', { group: 3 })] },
      { text: 'Fold the top corner down over it. Tuck the tip inside to seal.',
        ops: [foldTo([1, 1], [0, -0.35], 'v', { group: 4 })] }
    ]
  });

  /* ---------- 4. Samurai Helmet (Kabuto) ---------- */
  S.push({
    slug: 'kabuto', name: 'Samurai Helmet', diff: 2, color: '#e07856',
    blurb: 'The kabuto: a paper helmet children in Japan fold for Children\u2019s Day.',
    steps: [
      { text: 'Fold in half diagonally, bottom-left corner to top-right.',
        ops: [foldTo([-1, -1], [1, 1], 'v', { group: 1 })] },
      { text: 'Fold the left corner up to the top point.',
        ops: [foldTo([-1, 1], [1, 1], 'v', { group: 2 })] },
      { text: 'Fold the bottom corner up to the top point.',
        ops: [foldTo([1, -1], [1, 1], 'v', { group: 3 })] },
      { text: 'Fold the top flap down and out to the right - the first wing.',
        ops: [foldTo([1, 1], [1.75, 0.5], 'v', { includeGroups: [3], group: 4 })] },
      { text: 'Fold the next flap down and out to the left - the second wing.',
        ops: [foldTo([1, 1], [0.5, 1.75], 'v', { includeGroups: [2], group: 5 })] },
      { text: 'Fold the bottom point\u2019s front layer up past the middle.',
        ops: [foldTo([0, 0], [0.55, 0.55], 'v', { includeGroups: [0], group: 6 })] },
      { text: 'Fold that same strip up again to make the band. Open it to wear.',
        ops: [mk([0.2, 0.2], [0.35, 0.05], [0.5, 0.5], 'v', { includeGroups: [6], group: 7 })] }
    ]
  });

  /* ---------- 5. Dart Plane ---------- */
  S.push({
    slug: 'dart', name: 'Dart Plane', diff: 3, color: '#62c9da',
    blurb: 'The classic paper dart. Throw it gently, nose first.',
    steps: [
      { text: 'Fold in half lengthwise, then unfold.',
        ops: precrease([0, -1], [0, 1], [1, 0], 'v', 'd1') },
      { text: 'Fold the top-right corner to the center line.',
        ops: [foldTo([1, 1], [0, 0], 'v', { group: 1 })] },
      { text: 'Fold the top-left corner to the center line.',
        ops: [foldTo([-1, 1], [0, 0], 'v', { group: 2 })] },
      { text: 'Fold the right slanted edge to the center line.',
        ops: [foldTo([1, 0], [0, 1 - Math.SQRT2], 'v', { group: 3 })] },
      { text: 'Fold the left slanted edge to the center line.',
        ops: [foldTo([-1, 0], [0, 1 - Math.SQRT2], 'v', { group: 4 })] },
      { text: 'Fold the plane in half away from you.',
        ops: [mk([0, -1], [0, 1], [1, 0], 'm', { group: 5 })] },
      { text: 'Fold the top wing down along the nose-to-tail line.',
        ops: [mk([0, 1], [-1, -1], [-0.5, 0.5], 'v', { includeGroups: [0, 2, 4], group: 6 })] },
      { text: 'Fold the other wing down behind. Hold the body and fly.',
        ops: [mk([0, 1], [-1, -1], [-0.5, 0.5], 'm', { includeGroups: [1, 3, 5], group: 7 })] }
    ]
  });

  /* ---------- 6. Cicada ---------- */
  S.push({
    slug: 'cicada', name: 'Cicada', diff: 3, color: '#8fce6d',
    blurb: 'A summer insect with two wide wings.',
    steps: [
      { text: 'Fold in half diagonally, bottom-right corner to top-left.',
        ops: [foldTo([1, -1], [-1, 1], 'v', { group: 1 })] },
      { text: 'Fold the right corner up to the top point.',
        ops: [foldTo([1, 1], [-1, 1], 'v', { group: 2 })] },
      { text: 'Fold the bottom corner up to the top point.',
        ops: [foldTo([-1, -1], [-1, 1], 'v', { group: 3 })] },
      { text: 'Fold the first top flap down and out - one wing.',
        ops: [foldTo([-1, 1], [0.2, 0.45], 'v', { includeGroups: [2], group: 4 })] },
      { text: 'Fold the second flap down and out - the other wing.',
        ops: [foldTo([-1, 1], [-0.45, -0.2], 'v', { includeGroups: [3], group: 5 })] },
      { text: 'Fold the top point down in front for the head.',
        ops: [mk([-0.55, 1], [-1, 0.55], [-1, 1], 'v', { includeGroups: [0, 1], group: 6 })] },
      { text: 'Fold the side corners behind to round the body.',
        ops: [
          mk([0, 0.75], [0.35, 0.4], [0.3, 0.75], 'm', { group: 7 }),
          mk([-0.75, 0], [-0.4, -0.35], [-0.75, -0.3], 'm', { group: 8 })
        ] }
    ]
  });

  /* ---------- 7. Sailboat ---------- */
  S.push({
    slug: 'sailboat', name: 'Sailboat', diff: 3, color: '#62c9da',
    blurb: 'A little yacht with a tall sail.',
    steps: [
      { text: 'Fold the top edge down to the bottom edge.',
        ops: [foldTo([0, 1], [0, -1], 'v', { group: 1 })] },
      { text: 'Fold in half from left to right, then unfold.',
        ops: precrease([-1, -0.5], [-1, -1], [1, -0.5], 'v', 's1') },
      { text: 'Fold the top-right corner down so the top edge meets the center line.',
        ops: [mk([0, 0], [1, -1], [1, 0], 'v', { group: 2 })] },
      { text: 'Fold the whole model in half behind, right side to the back.',
        ops: [mk([0, 0], [0, -1], [1, -0.5], 'm', { group: 3 })] },
      { text: 'Fold the front layer\u2019s bottom corner up to make the hull.',
        ops: [mk([0, -1], [-0.7, 0], [-0.4, -1], 'v', { includeGroups: [0, 1], group: 4 })] },
      { text: 'Fold the back corner up behind the same way. The boat stands on its hull.',
        ops: [mk([0, -1], [-0.7, 0], [-0.4, -1], 'm', { includeGroups: [2, 3], group: 5 })] }
    ]
  });

  /* ---------- 8. Easy Heart ---------- */
  S.push({
    slug: 'heart', name: 'Easy Heart', diff: 4, color: '#e07856',
    blurb: 'The classic Valentine heart, from one square.',
    steps: [
      { text: 'Start colored side down. Fold the top-left corner to the bottom-right corner, crease, and unfold.',
        ops: [flipX()].concat(precreaseTo([-1, 1], [1, -1], 'v', 'h1')) },
      { text: 'Fold the top-right corner to the bottom-left corner, crease, and unfold.',
        ops: precreaseTo([1, 1], [-1, -1], 'v', 'h2') },
      { text: 'Fold the top-right corner down to the center of the paper.',
        ops: [foldTo([1, 1], [0, 0], 'v', { group: 1 })] },
      { text: 'Fold the bottom-left corner up to meet the folded edge.',
        ops: [foldTo([-1, -1], [0.5, 0.5], 'v', { group: 2 })] },
      { text: 'Fold the left corner up so its edge lies along the center crease - the first lobe.',
        ops: [foldTo([-1, 0.5], [0.5, 0.5], 'v', { group: 3 })] },
      { text: 'Fold the bottom corner up the same way - the second lobe, with the cleft between them.',
        ops: [foldTo([0.5, -1], [0.5, 0.5], 'v', { group: 4 })] },
      { text: 'Fold the two top points behind to round the lobes. Turn the heart upright - lobes up, point down. Done!',
        ops: [mk([0.02, 1.22], [1.22, 0.02], [0.75, 0.75], 'm', { group: 5 })] },
      { text: 'Your heart is done!',
        ops: [spinZ(Math.PI / 4)], cam: { pitch: 0.35, yaw: 0 } }
    ]
  });

  /* ---------- 9. Stunt Glider ---------- */
  S.push({
    slug: 'stunt-glider', name: 'Stunt Glider', diff: 4, color: '#d8a84e',
    blurb: 'Take the dart one step further: blunt the nose, widen the wings.',
    steps: [
      { text: 'Fold in half lengthwise, then unfold.',
        ops: precrease([0, -1], [0, 1], [1, 0], 'v', 'g1') },
      { text: 'Fold the top-right corner to the center line.',
        ops: [foldTo([1, 1], [0, 0], 'v', { group: 1 })] },
      { text: 'Fold the top-left corner to the center line.',
        ops: [foldTo([-1, 1], [0, 0], 'v', { group: 2 })] },
      { text: 'Fold the nose tip back a little - a blunted nose glides, a pointy one dives.',
        ops: [mk([-0.2, 0.55], [0.2, 0.55], [0, 1], 'v', { group: 5 })] },
      { text: 'Fold the plane in half away from you.',
        ops: [mk([0, -1], [0, 1], [1, 0], 'm', { group: 6 })] },
      { text: 'Fold the top wing down: start a thumb-width below the nose, out to the tail corner. Wide wings glide.',
        ops: [mk([0, 0.35], [-1, -1], [-0.5, 0.5], 'v', { includeGroups: [0, 2, 4], group: 7 })] },
      { text: 'Fold the other wing down behind.',
        ops: [mk([0, 0.35], [-1, -1], [-0.5, 0.5], 'm', { includeGroups: [1, 3, 5, 6], group: 8 })] },
      { text: 'Open the wings, hold the body, throw high and watch it glide.',
        ops: [spinZ(Math.PI / 2)] }
    ]
  });

  /* ---------- 10. Fortune Teller ---------- */
  S.push({
    slug: 'cootie-catcher', name: 'Fortune Teller', diff: 5, color: '#b48ae0',
    blurb: 'The playground fortune teller - write fortunes inside.',
    steps: [
      { text: 'Fold both diagonals, unfolding each.',
        ops: precreaseTo([-1, -1], [1, 1], 'v', 'c1').concat(precreaseTo([-1, 1], [1, -1], 'v', 'c2')) },
      { text: 'Fold all four corners to the center, one after another.',
        ops: [foldTo([1, 1], [0, 0], 'v', { group: 1 })] },
      { text: 'Second corner to the center.',
        ops: [foldTo([-1, 1], [0, 0], 'v', { group: 2 })] },
      { text: 'Third corner to the center.',
        ops: [foldTo([-1, -1], [0, 0], 'v', { group: 3 })] },
      { text: 'Fourth corner to the center.',
        ops: [foldTo([1, -1], [0, 0], 'v', { group: 4 })] },
      { text: 'Turn the model over.',
        ops: [flipX()] },
      { text: 'Fold the four new corners to the center again. First corner.',
        ops: [foldTo([1, 0], [0, 0], 'v', { group: 5 })] },
      { text: 'Second corner to the center.',
        ops: [foldTo([0, 1], [0, 0], 'v', { group: 6 })] },
      { text: 'Third corner to the center.',
        ops: [foldTo([-1, 0], [0, 0], 'v', { group: 7 })] },
      { text: 'Fourth corner to the center.',
        ops: [foldTo([0, -1], [0, 0], 'v', { group: 8 })] },
      { text: 'Turn the model over - the four pocket openings are on this side.',
        ops: [flipX()] },
      { text: 'By hand now, past what this animation can show: crease the square in half both ways, then slide two thumbs and two fingers into the four pockets and push them gently together. The fortune teller pops into 3D - write fortunes inside!',
        ops: [] }
    ]
  });

  return S;
})();
