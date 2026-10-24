// ---- bicycle drivetrain runtime ----
const bikePanel = document.querySelector('[data-panel="bike"]');
const bStage = bikePanel.querySelector(".iso-stage");
const bSvg = bStage.querySelector("svg");
const bReadout = bikePanel.querySelector("[data-readout]");
const bIdea = bikePanel.querySelector("[data-idea]");
const bSay = bikePanel.querySelector("[data-say]");
const bCadEl = bikePanel.querySelector("[data-b-cad]"), bCadBar = bikePanel.querySelector("[data-b-cad-bar]");
const bGearEl = bikePanel.querySelector("[data-b-gear]");
const bSpeedEl = bikePanel.querySelector("[data-b-speed]"), bSpeedBar = bikePanel.querySelector("[data-b-speed-bar]");
const bDistEl = bikePanel.querySelector("[data-b-dist]");
const bChainEl = bSvg.querySelector("[data-b-chainpath]");
const bClickEl = bSvg.querySelector("[data-click]");
const BSTEPS = [
  { id: "push", short: "01 Push", parts: ["crank"], label: "01 · Push the pedal" },
  { id: "ring", short: "02 Ring", parts: ["ring", "mesh"], label: "02 · The ring pulls the chain" },
  { id: "chain", short: "03 Chain", parts: ["chain"], label: "03 · The chain carries the force" },
  { id: "gears", short: "04 Cogs", parts: ["cog", "ghost", "mesh"], label: "04 · The cogs trade force for speed" },
  { id: "free", short: "05 Freewheel", parts: ["pawls", "cog", "inset"], label: "05 · The gate: pawls, or coast" },
  { id: "wheel", short: "06 Wheel", parts: ["wheel", "fwheel"], label: "06 · The wheel rolls it out" },
  { id: "ride", short: "07 Ride", parts: [], label: "07 · Ride" },
];
const BIDEAS = {
  push: "A bicycle is a lever train. Your leg pushes a 172.5 mm crank, and the crank turns the chainring - a pry bar going in a circle. The green arrow is your foot's push: strong at mid-stroke, nothing at top and bottom.",
  ring: "Fifty teeth, one job: each turn of the cranks pulls fifty chain links - 635 mm of chain - over the top of the ring. The red dots are where tooth meets link.",
  chain: "A chain is a rack that bends. It only pulls, never pushes: the top run is tight and carries everything; the bottom run just comes back for more (a real one sags a little - drawn taut here).",
  gears: "At the back, the trade: 50 teeth driving 15 turns the wheel 3.3 times per pedal turn - faster, but 3.3 times weaker. The dashed cogs are the cassette's range: 11 teeth for flat-out, 28 for walls.",
  free: "Inside the hub, spring pawls are the gate. Pedal and they bite into the driver's teeth; stop and they fold back and tick over them - click click click - while the wheel spins on. One way only, and that is the whole point.",
  wheel: "One wheel turn is 2.1 metres of road. At 90 pedal turns a minute in this gear, that is 37 km/h. The wheel also stores a little spin, smoothing the pulses your legs make.",
  ride: "Everything at once: legs push, ring pulls, chain carries, cogs trade, pawls gate, wheel rolls. A bicycle stores nothing like the watch does - it spends your effort on the road the moment you make it.",
};
const RATIO = T1 / T2;
let bStep = 0, bCad = 0, bCrank = -0.6, bChain = 0, bWheel = 0, bWheelVel = 0, bDist = 0, bEngage = 1, bCoast = false;
let bClock = 0, bFrame = 0, bLast = 0, bVisible = false;
function bForce() {
  if (BSTEPS[bStep].id !== "push" || bCad < 5) return 0;
  return Math.max(0, Math.cos(bCrank));
}
function bPartsFor(s) { bStage.dataset.focus = "1"; bSvg.querySelectorAll(".it").forEach((el) => { el.toggleAttribute("data-on", BSTEPS[s].parts.includes(el.dataset.part)); }); if (!BSTEPS[s].parts.length) delete bStage.dataset.focus; }
function bSetStep(i, announce) {
  bStep = i; bStage.dataset.stepId = BSTEPS[i].id;
  bPartsFor(i);
  bikePanel.querySelectorAll("[data-step]").forEach((b) => { b.toggleAttribute("data-on", Number(b.dataset.step) === i); });
  if (bIdea) bIdea.textContent = BIDEAS[BSTEPS[i].id];
  if (announce && bSay) bSay.textContent = BSTEPS[i].label;
  if (still.matches) { // reduced motion: frozen pose, gauges still show the state
    bCad = 0; bCrank = -0.6; bEngage = 1; bCoast = false;
  }
  bRun();
}
function bDraw() {
  bSvg.querySelector("[data-b-arms]").innerHTML = crankArmsSvg(bCrank);
  bSvg.querySelector("[data-b-ring]").innerHTML = ringSvg(bCrank);
  bSvg.querySelector("[data-b-pedals]").innerHTML = pedalsSvg(bCrank, bForce());
  bSvg.querySelector("[data-b-pins]").innerHTML = chainPinsSvg(bChain);
  bSvg.querySelector("[data-b-cog]").innerHTML = cogSvg(-bChain / R2);
  bSvg.querySelector("[data-b-rspokes]").innerHTML = spokesSvg(RH, bWheel);
  bSvg.querySelector("[data-b-fspokes]").innerHTML = spokesSvg(FH, bWheel);
  bSvg.querySelector("[data-b-pawls]").innerHTML = pawlSvg(bWheel, bEngage);
  const insetEl = bSvg.querySelector("[data-b-inset]");
  if (BSTEPS[bStep].id === "free") insetEl.innerHTML = insetLiveSvg(bWheel, -bChain / R2, bEngage);
  else if (insetEl.innerHTML) insetEl.innerHTML = "";
  const frozen = still.matches;
  const cadNow = frozen ? (bStep >= 1 ? 90 : 0) : bCad;
  const wheelVelNow = frozen ? (bStep >= 1 ? (cadNow / 60) * TAU * RATIO : 0) : bWheelVel;
  const speed = wheelVelNow / TAU * CIRC * 3.6;
  bCadEl.textContent = cadNow.toFixed(0) + " rpm";
  bCadBar.style.width = Math.min(100, (100 * cadNow) / 120) + "%";
  bGearEl.textContent = T1 + ":" + T2 + " · ×" + RATIO.toFixed(1);
  bSpeedEl.textContent = speed.toFixed(1) + " km/h";
  bSpeedBar.style.width = Math.min(100, (100 * speed) / 60) + "%";
  bDistEl.textContent = bDist < 1000 ? bDist.toFixed(0) + " m" : (bDist / 1000).toFixed(2) + " km";
  const phase = frozen ? (bStep >= 1 ? "rolling" : "still") : (bCoast ? "coasting" : (bCad > 2 ? "pedaling" : "still"));
  const text = BSTEPS[bStep].short + " · " + phase + " · " + cadNow.toFixed(0) + " rpm · " + speed.toFixed(1) + " km/h";
  if (bReadout.textContent !== text) bReadout.textContent = text;
}
function bTick(now) {
  const dt = bLast ? Math.min((now - bLast) / 1000, 1 / 30) : 1 / 60;
  bLast = now; bClock += dt;
  const calm = still.matches;
  const id = BSTEPS[bStep].id;
  let target = 0;
  if (id === "push") target = 55;
  else if (id === "ring" || id === "chain" || id === "gears" || id === "wheel") target = 90;
  else if (id === "free") target = (bClock % 9) < 4.5 ? 90 : 0;
  else if (id === "ride") target = 85 + 8 * Math.sin(bClock * 0.5);
  bCad += (target - bCad) * Math.min(1, dt * (target > bCad ? 1.6 : 2.5));
  if (bCad < 0.4 && target === 0) bCad = 0;
  if (!calm) {
    const cadRad = (bCad / 60) * TAU;
    bCrank -= cadRad * dt;
    const chainVel = cadRad * R1;
    bChain += chainVel * dt;
    const sprocketVel = chainVel / R2;
    if (sprocketVel >= bWheelVel) bWheelVel = sprocketVel; else bWheelVel *= Math.pow(0.9985, dt * 60); // pawls overrun: wheel keeps its speed
    bWheel -= bWheelVel * dt;
    bDist += (bWheelVel / TAU) * CIRC * dt;
    bCoast = bCad < 3 && bWheelVel > 0.1;
    bEngage += ((bCoast ? 0.3 : 1) - bEngage) * Math.min(1, dt * 6);
    bClickEl.setAttribute("opacity", bCoast && id === "free" ? "1" : "0");
  }
  bDraw();
  const active = !calm && (bCad > 0.4 || target > 0 || bWheelVel > 0.05);
  bFrame = bVisible && active ? requestAnimationFrame(bTick) : 0;
}
const bRun = () => { if (!bFrame && bVisible) { bLast = 0; bFrame = requestAnimationFrame(bTick); } };
new IntersectionObserver((entries) => { bVisible = entries[entries.length - 1].isIntersecting; if (bVisible) bRun(); }, { rootMargin: "120px 0px" }).observe(bStage);
bikePanel.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => { bSetStep(Number(b.dataset.step), true); }));
bStage.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); bSetStep(Math.min(BSTEPS.length - 1, bStep + 1), true); }
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); bSetStep(Math.max(0, bStep - 1), true); }
  if (event.key === "Home") { event.preventDefault(); bSetStep(0, true); }
  if (event.key === "End") { event.preventDefault(); bSetStep(BSTEPS.length - 1, true); }
});
bSetStep(0, false);
bDraw();
