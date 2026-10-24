// ---- tape deck runtime (scoped to tape panel) ----
const tapePanel = document.querySelector('[data-panel="tape"]');
const tStage = tapePanel.querySelector(".iso-stage");
const tReadout = tapePanel.querySelector("[data-readout]");
const tIdea = tapePanel.querySelector("[data-idea]");
const tSay = tapePanel.querySelector("[data-say]");
const TSTEPS = [
  { id: "load", short: "01 Load", parts: ["shell", "reels", "packs"], label: "01 · Slide the cassette in" },
  { id: "path", short: "02 Path", parts: ["tape", "guides"], label: "02 · The tape threads a path" },
  { id: "capstan", short: "03 Capstan", parts: ["capstan", "pinch"], label: "03 · The capstan sets the pace" },
  { id: "reels", short: "04 Reels", parts: ["reels", "packs"], label: "04 · The reels trade radii" },
  { id: "head", short: "05 Head", parts: ["head", "inset"], label: "05 · The head listens" },
  { id: "side", short: "06 Side A", parts: [], label: "06 · Side A" },
];
const TPOSES = [0, 0.15, 0.3, 0.5, 0.65];          // frozen side progress per step
const TIDEAS = {
  load: "A C-60 holds 86 metres of tape for a side - 30 minutes of music at 4.76 centimetres a second.",
  path: "Tape leaves the supply pack, rounds the guides, crosses the head and the capstan, and winds onto the take-up pack. The shell here is drawn translucent so you can see it.",
  capstan: "The pinch roller presses the tape against the capstan shaft - o2.4 mm, spinning 379 rpm - and that pinch is the whole speed control: 4.76 cm a second, no matter how full either reel is.",
  reels: "A pack's radius grows with the square root of its tape: r = √(core² + L·thickness/π). So a full pack turns slow and an empty one fast - 18.5 rpm at the start of a side, 43.3 at the end.",
  head: "The play head is an electromagnet with a gap a few microns wide. The tape's magnetic print slides across it and the gap reads it, one pole at a time.",
  side: "Side A plays (here at 20x so you can watch): the counter walks, the packs trade places, and the reel speeds drift apart - the capstan never notices.",
};
let tStep = 0, tS = 0, tAngSup = 0, tAngTak = 0, tAngCap = 0, tAngPin = 0, tTravel = 0, tDone = false;
const TDEMO = 20;                                  // Side A demo timescale

function tState() {
  const frozen = tStep < 5;
  const s = frozen ? TPOSES[tStep] * L_SIDE : tS;
  const rs = packR(L_SIDE - s), rt = packR(s);
  return { frozen, s, rs, rt };
}
function tRender(st) {
  tStage.querySelector("[data-t-packsup]").innerHTML = packSvg(SUP, st.rs);
  tStage.querySelector("[data-t-packtak]").innerHTML = packSvg(TAK, st.rt);
  tStage.querySelector("[data-t-reelsup]").innerHTML = reelSvg(SUP, tAngSup);
  tStage.querySelector("[data-t-reeltak]").innerHTML = reelSvg(TAK, tAngTak);
  tStage.querySelector("[data-t-tape]").innerHTML = tapeSvg(st.rs, st.rt, tTravel);
  tStage.querySelector("[data-t-capstan]").innerHTML = capstanSvg(tAngCap);
  tStage.querySelector("[data-t-pinch]").innerHTML = pinchSvg(tAngPin);
  if (TSTEPS[tStep].id === "head") tapePanel.querySelector("[data-t-inset]").innerHTML = insetLiveSvg(tTravel / 10);
  // gauges
  const secs = st.s / V_TAPE;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(Math.floor(secs % 60)).padStart(2, "0");
  tapePanel.querySelector("[data-t-count]").textContent = `${mm}:${ss} / 30:00`;
  tapePanel.querySelector("[data-t-count-bar]").style.width = `${(100 * st.s) / L_SIDE}%`;
  tapePanel.querySelector("[data-t-sup]").textContent = `${((V_TAPE / st.rs) * (60 / TAU)).toFixed(1)} rpm`;
  tapePanel.querySelector("[data-t-tak]").textContent = `${((V_TAPE / st.rt) * (60 / TAU)).toFixed(1)} rpm`;
  const phase = st.frozen ? (tStep >= 2 ? "running" : "still") : (tDone ? "end of side" : "playing");
  tReadout.textContent = `${TSTEPS[tStep].short.replace(/^\d+ /, "")} · ${phase} · ${mm}:${ss} · ${(V_TAPE / st.rs * 60 / TAU).toFixed(1)} / ${(V_TAPE / st.rt * 60 / TAU).toFixed(1)} rpm`;
}
function tSetStep(i, announce) {
  tStep = i;
  if (i === 5) { tS = 0; tDone = false; }
  tapePanel.querySelectorAll("[data-step]").forEach((b) => { b.toggleAttribute("data-on", Number(b.dataset.step) === i); });
  const parts = TSTEPS[i].parts;
  tStage.querySelectorAll(".it[data-part]").forEach((el) => { el.toggleAttribute("data-on", parts.length === 0 || parts.includes(el.dataset.part)); });
  tStage.dataset.focus = TSTEPS[i].id;
  tIdea.textContent = TIDEAS[TSTEPS[i].id];
  if (announce) tSay.textContent = TSTEPS[i].label;
  tRender(tState());
}
tapePanel.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => { tSetStep(Number(b.dataset.step), true); }));
tStage.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") { event.preventDefault(); tSetStep((tStep + 1) % TSTEPS.length, true); }
  if (event.key === "ArrowLeft") { event.preventDefault(); tSetStep((tStep + TSTEPS.length - 1) % TSTEPS.length, true); }
});
let tPrev = performance.now();
function tTick(now) {
  const dt = Math.min(0.05, (now - tPrev) / 1000);
  tPrev = now;
  const st = tState();
  if (!st.frozen && !tDone) {
    tS += V_TAPE * TDEMO * dt;
    if (tS >= L_SIDE) { tS = L_SIDE; tDone = true; }
  }
  const moving = !st.frozen ? !tDone : tStep >= 2;
  if (moving) {
    const v = V_TAPE;
    tTravel += v * dt;
    tAngSup -= (v / st.rs) * dt;             // both reels turn clockwise on side A
    tAngTak -= (v / st.rt) * dt;
    tAngCap -= (v / CAP_R) * dt;
    tAngPin -= (v / PINCH_R) * dt;
  }
  if (!tapePanel.hidden) tRender(tState());
  requestAnimationFrame(tTick);
}
tSetStep(0, false);
requestAnimationFrame(tTick);
