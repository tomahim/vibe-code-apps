#!/usr/bin/env python3
"""Integrate the post-midnight orientation pairs into the Island Garden manifest.

Phase 2 after island-pipeline.py: cuts the 20 generated portrait interiors
(3:4) into floating island dioramas with the same silhouette/cliff method,
computes dormant endpoints locally (same HSV vegetation-only algorithm as the
little-grains-orientations precedent), encodes the 7 generated wide group
worlds (16:9, already painted as dioramas so no silhouette cut), and fills the
portrait/landscape slots in island-assets.js that phase 1 left null.

Reads the approved generated paintings from /downloads/gen-*.png (not committed).
Run from the repo root:
  python3 ui/public/artifact-assets/2026-11-15-island-garden/island-pairs.py
"""
import hashlib
import json
import math
import os
import re

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = "ui/public/artifact-assets"
ISLAND = ROOT + "/2026-11-15-island-garden"
OUT = ISLAND + "/assets"
GEN = "/downloads"
PAPER = (243, 232, 208)  # #f3e8d0

THEMES = ["nature", "biology", "ocean", "climate", "space", "geology",
          "physics", "chemistry", "engineering", "sport", "health", "mind",
          "cooking", "economics", "mathematics", "languages", "art", "music",
          "history", "technology"]
GROUPS = ["living", "earthsky", "discovery", "wellbeing", "harvest",
          "expression", "civilization"]


def smooth(a, win):
    return np.convolve(a, np.ones(win) / win, mode="same")


def silhouette(seed, W, H, CX, CY, RX, RY):
    rng = np.random.default_rng(seed)
    ph = rng.uniform(0, 2 * math.pi, 4)
    th = np.linspace(0, 2 * math.pi, 720, endpoint=False)
    r = (1.0
         + 0.045 * np.sin(3 * th + ph[0])
         + 0.030 * np.sin(5 * th + ph[1])
         + 0.018 * np.sin(9 * th + ph[2])
         + 0.012 * np.sin(17 * th + ph[3]))
    ss = 3
    xs = (CX + RX * r * np.cos(th)) * ss
    ys = (CY + RY * r * np.sin(th)) * ss
    mask = Image.new("L", (W * ss, H * ss), 0)
    ImageDraw.Draw(mask).polygon(list(zip(xs, ys)), fill=255)
    mask = mask.resize((W, H), Image.LANCZOS)
    return mask.filter(ImageFilter.GaussianBlur(1.1))


def cliff_fields(mask_arr, W, H, RX, CLIFF):
    inside = mask_arr > 128
    ys = np.arange(H)[:, None]
    yb = np.where(inside, ys, -1).max(axis=0)
    valid = yb > 0
    xb = int(np.argmax(yb))
    dyb = np.gradient(smooth(yb.astype(float), 41))
    ang = np.abs(np.arctan(dyb))
    fade = np.clip(1.0 - (ang / 1.05) ** 2, 0, 1)
    bump = np.exp(-((np.arange(W) - xb) / (0.42 * RX)) ** 2)
    depth = CLIFF * bump * fade * valid
    depth = np.maximum(smooth(depth, 61) - 1.5, 0)
    return yb, depth


def cut_island(src_path, seed):
    """Same silhouette + cliff skirt as phase 1, generalised to any canvas."""
    img = Image.open(src_path).convert("RGB")
    W, H = img.size
    CX, CY = W // 2, int(0.442 * H)
    RX, RY = int(0.463 * W), int(0.404 * H)
    CLIFF = max(24, int(0.079 * H))
    px = np.asarray(img).astype(np.float32)
    mask = silhouette(seed, W, H, CX, CY, RX, RY)
    m = np.asarray(mask).astype(np.float32) / 255.0
    yb, depth = cliff_fields(np.asarray(mask), W, H, RX, CLIFF)

    out = np.zeros((H, W, 4), dtype=np.float32)
    out[..., :3] = px
    out[..., 3] = m * 255

    xs = np.arange(W)
    tops = np.minimum(yb, H - 1).clip(min=1)
    edge_col = px[tops - 1, xs].astype(np.float32)
    for c in range(3):
        edge_col[:, c] = smooth(edge_col[:, c], 121)
    rock = np.array([0x71, 0x5F, 0x47], dtype=np.float32)
    edge_col = 0.62 * edge_col * 0.55 + 0.38 * rock
    rng = np.random.default_rng(seed + 7)
    grain = smooth(rng.uniform(0.82, 1.18, W), 13)
    grain = 0.65 * grain + 0.35 * smooth(rng.uniform(0.9, 1.1, W), 61)
    for x in xs:
        d = int(round(depth[x]))
        if d <= 0:
            continue
        top = min(yb[x], H - 1)
        end = min(top + d, H)
        if end <= top:
            continue
        n = end - top
        shade = np.linspace(0.86, 0.55, n)[:, None] * grain[x]
        out[top:end, x, :3] = edge_col[x] * shade
        out[top:end, x, 3] = 255
        if n >= 3:
            out[end - 2:end, x, :3] *= 0.72

    im = Image.fromarray(out.astype(np.uint8), "RGBA")

    sh = Image.new("L", (W, H), 0)
    ymax = int(yb.max() + depth.max() + 10)
    ImageDraw.Draw(sh).ellipse(
        [CX - RX * 0.72, ymax - 30, CX + RX * 0.72, ymax + 34], fill=46)
    sh = sh.filter(ImageFilter.GaussianBlur(17))
    shadow = Image.new("RGBA", (W, H), (44, 36, 20, 0))
    shadow.putalpha(sh)
    base = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    base.alpha_composite(shadow)
    base.alpha_composite(im)
    return base


def dormant_rgba(image):
    """Vegetation-hue dormant endpoint; water, stone, coral and alpha fixed.
    Vectorised port of the little-grains-orientations per-pixel algorithm."""
    arr = np.asarray(image.convert("RGBA")).astype(np.float32)
    r, g, b, a = arr[..., 0] / 255, arr[..., 1] / 255, arr[..., 2] / 255, arr[..., 3]
    mx = np.max(arr[..., :3], axis=-1) / 255
    mn = np.min(arr[..., :3], axis=-1) / 255
    diff = mx - mn
    v = mx
    s = np.where(mx > 0, diff / np.maximum(mx, 1e-9), 0)
    rc = np.where(diff > 1e-9, (mx - r) / np.maximum(diff, 1e-9), 0)
    gc = np.where(diff > 1e-9, (mx - g) / np.maximum(diff, 1e-9), 0)
    bc = np.where(diff > 1e-9, (mx - b) / np.maximum(diff, 1e-9), 0)
    h = np.where(mx == r, bc - gc, np.where(mx == g, 2.0 + rc - bc, 4.0 + gc - rc))
    h = (h / 6.0) % 1.0
    sel = (a > 0) & (h > 0.12) & (h < 0.46) & (s > 0.35) & (v > 0.16)
    strength = np.minimum(1, (s - 0.35) / 0.15) * np.minimum(
        1, np.minimum((h - 0.12) / 0.025, (0.46 - h) / 0.035))
    strength = np.clip(strength, 0, 1)
    # target = hsv(0.085, min(0.30, s*0.42), v*0.65), hue 0.085 -> sector 0
    ts = np.minimum(0.30, s * 0.42)
    tv = v * 0.65
    th = 0.085 * 6.0
    i = np.floor(th).astype(int)
    f = th - i
    p = tv * (1 - ts)
    q = tv * (1 - ts * f)
    t = tv * (1 - ts * (1 - f))
    # sector 0: (tv, t, p)
    tr, tg, tb = tv, t, p
    out = arr.copy()
    for c, (old, new) in enumerate(((r, tr), (g, tg), (b, tb))):
        out[..., c] = np.where(sel, old * 255 * (1 - strength) + new * 255 * strength, arr[..., c])
    return Image.fromarray(np.clip(np.round(out), 0, 255).astype(np.uint8), "RGBA")


def save_hashed(img, prefix, suffix):
    tmp = os.path.join(OUT, "tmp.webp")
    img.save(tmp, "WEBP", quality=88, method=6)
    data = open(tmp, "rb").read()
    h = hashlib.sha256(data).hexdigest()[:12]
    name = f"{prefix}-{suffix}-{h}.webp"
    os.replace(tmp, os.path.join(OUT, name))
    return {"src": "assets/" + name, "bytes": len(data),
            "width": img.width, "height": img.height}


def main():
    import sys
    only = sys.argv[1:]  # optional subset: theme keys, group keys, or "manifest"
    text = open(ISLAND + "/island-assets.js").read()
    manifest = json.loads(re.search(
        r"window\.ISLAND_GARDEN_ASSETS=(\{.*\})\s*;?\s*$", text, re.S).group(1))

    state_path = ISLAND + "/.pairs-state.json"
    state = json.load(open(state_path)) if os.path.exists(state_path) else {"themes": {}, "groups": {}}

    for key in THEMES:
        if only and key not in only:
            continue
        src = os.path.join(GEN, f"gen-{key}-portrait.png")
        seed = int(hashlib.sha256(("island-portrait:" + key).encode()).hexdigest()[:8], 16)
        lush = cut_island(src, seed)
        sparse = dormant_rgba(lush)
        state["themes"][key] = {
            "lush": save_hashed(lush, f"island-{key}-portrait", "lush"),
            "sparse": save_hashed(sparse, f"island-{key}-portrait", "sparse"),
        }
        json.dump(state, open(state_path, "w"))
        print("portrait", key, lush.size, flush=True)

    for i, key in enumerate(GROUPS):
        if only and key not in only:
            continue
        src = os.path.join(GEN, f"gen-group-{key}-wide.png")
        img = Image.open(src)
        if img.mode in ("RGBA", "LA", "P"):
            rgba = img.convert("RGBA")
            flat = Image.new("RGBA", rgba.size, PAPER + (255,))
            flat.alpha_composite(rgba)
            img = flat
        lush = img.convert("RGB").convert("RGBA")  # flat painting, alpha fixed
        sparse = dormant_rgba(lush)
        state["groups"][key] = {
            "lush": save_hashed(lush.convert("RGB"), f"world-{key}-wide", "lush"),
            "sparse": save_hashed(sparse.convert("RGB"), f"world-{key}-wide", "sparse"),
        }
        json.dump(state, open(state_path, "w"))
        print("wide", key, lush.size, flush=True)

    if only and "manifest" not in only:
        return
    for key, pair in state["themes"].items():
        manifest["themes"][key]["portrait"] = pair
    for i, key in enumerate(GROUPS):
        if key in state["groups"]:
            manifest["groups"][i]["landscape"] = state["groups"][key]
    header = ("/* Generated by island-pipeline.py + island-pairs.py. Both orientations are\n"
              "   distinct painted compositions (portrait interiors generated 2026-11-16 after\n"
              "   the daily image limit reset; wide group worlds the same night). Dormant\n"
              "   endpoints are computed locally from the lush paintings (vegetation hues\n"
              "   only). No interim reframing remains. */\n")
    open(ISLAND + "/island-assets.js", "w").write(
        header + "window.ISLAND_GARDEN_ASSETS=" + json.dumps(manifest) + ";\n")
    print("manifest updated", flush=True)


if __name__ == "__main__":
    main()
