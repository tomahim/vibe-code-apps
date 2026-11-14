// Thin wrapper around the SuperSonic engine (SuperCollider's scsynth compiled
// to WebAssembly, running in an AudioWorklet). Everything happens in the
// browser: no server, no backend synthesis.
//
// The engine, its worklet and the .scsyndef binaries are vendored under
// /supersonic/ (ui/public/supersonic) so the app works fully from our own
// static bundle, with no CDN dependency.
import { SuperSonic } from "supersonic-scsynth";
import { audioEnvironmentProblem } from "./environment.js";

export const MUSIC_BUS = 10; // private stereo bus pair (10/11): every note plays here
export const WET_BUS = 12;   // reverb output pair (12/13), read by the master level
const LIMIT_BUS = 14;
// Final speaker bound: every output sample is clipped to +-OUTPUT_CLIP.
const OUTPUT_CLIP = 0.89;        // master level output pair (14/15), read by the peak normaliser

// Synthdefs preloaded at boot and available to compositions via short names.
// Names map to sonic-pi-<name>.scsyndef files vendored in /supersonic/synthdefs/.
export const SYNTH_PALETTE = [
  "prophet",        // warm poly synth, Prophet-5 flavour
  "dark_ambience",  // dark evolving drone with built-in space
  "hollow",         // airy, breathy pad
  "blade",          // cinematic string-like pad with vibrato
  "pretty_bell",    // fm bell, long shimmer
  "dull_bell",      // softer, rounder bell
  "pluck",          // karplus-strong pluck
  "growl",          // deep growling bass
  "hoover",         // classic alpha-juno hoovers
  "supersaw",       // detuned saw stack
  "saw",            // plain saw
  "tri",            // triangle wave
  "pulse",          // pulse wave
  "tb303",          // acid bassline
  "mod_fm",         // basic fm
  "fm",             // 2-op fm with modulator
  // 808 kit for percussion-driven tracks (Night Pursuit).
  "sc808_bassdrum",
  "sc808_snare",
  "sc808_clap",
  "sc808_rimshot",
  "sc808_closed_hihat",
  "sc808_open_hihat",
  "sc808_cymbal",
  "sc808_tomhi",
  "sc808_tommid",
  "sc808_tomlo",
];

const FX_SYNTHS = ["fx_gverb", "fx_level", "fx_normaliser"];

function fullName(short) {
  return `sonic-pi-${short}`;
}

class MusicEngine {
  constructor() {
    this.supersonic = null;
    this.ready = false;
    this.booting = null;
    this.sourceGroup = null;
    this.fxGroup = null;
    this.reverbId = null;
    this.masterId = null;
  }

  // Must be called from a user gesture (browser autoplay policy).
  async boot(onStatus = () => {}) {
    if (this.ready) return this;
    if (this.booting) return this.booting;
    this.booting = (async () => {
      // Fail fast with an actionable message when the browser hides
      // AudioWorklet (plain-HTTP origins) instead of SuperSonic's cryptic
      // "Missing required features for postMessage mode: audioWorklet".
      const problem = audioEnvironmentProblem();
      if (problem) throw new Error(problem);
      onStatus("Waking the SuperCollider engine…");
      const supersonic = new SuperSonic({
        baseURL: "/supersonic/",
        coreBaseURL: "/supersonic/core/",
        synthdefBaseURL: "/supersonic/synthdefs/",
      });
      this.supersonic = supersonic;
      if (import.meta.env.DEV) {
        for (const evt of ["loading:start", "loading:done", "ready", "error", "shutdown", "statechange", "init"]) {
          supersonic.on(evt, (data) => console.log(`[supersonic] ${evt}`, data ?? ""));
        }
      }
      await supersonic.init();
      // Autoplay policies can leave the context suspended even after a
      // gesture (seen on Firefox); resume explicitly before syncing.
      if (supersonic.audioContext && supersonic.audioContext.state !== "running") {
        await supersonic.resume();
        if (supersonic.audioContext.state !== "running") {
          await supersonic.audioContext.resume();
        }
      }

      onStatus("Loading instruments…");
      await supersonic.loadSynthDefs(
        [...SYNTH_PALETTE, ...FX_SYNTHS].map(fullName),
      );

      // Node ordering: sources first, then the fx chain, so the reverb always
      // sits after the notes it processes.
      this.sourceGroup = supersonic.nextNodeId();
      this.fxGroup = supersonic.nextNodeId();
      supersonic.send("/g_new", this.sourceGroup, 0, 0); // head of root
      supersonic.send("/g_new", this.fxGroup, 1, 0);     // tail of root

      // FX chain: music bus -> gverb -> wet bus -> master level -> speakers.
      this.reverbId = supersonic.nextNodeId();
      supersonic.send(
        "/s_new", fullName("fx_gverb"), this.reverbId, 0, this.fxGroup,
        "in_bus", MUSIC_BUS, "out_bus", WET_BUS,
        "room", 30, "release", 4, "dry", 0.85, "tail_level", 0.55, "ref_level", 0.4,
      );
      this.masterId = supersonic.nextNodeId();
      supersonic.send(
        "/s_new", fullName("fx_level"), this.masterId, 1, this.fxGroup,
        "in_bus", WET_BUS, "out_bus", LIMIT_BUS, "amp", 0.9,
      );
      // Last stage: peak normaliser, so even a definition that ignores its
      // amp parameter is pulled toward the target level before the speakers.
      // (Not a hard limiter: fast transients can still overshoot.)
      this.normaliserId = supersonic.nextNodeId();
      supersonic.send(
        "/s_new", fullName("fx_normaliser"), this.normaliserId, 1, this.fxGroup,
        "in_bus", LIMIT_BUS, "out_bus", 0, "level", 0.5,
      );

      await supersonic.sync();

      // Hard output bound: a final WebAudio stage clips every sample to
      // +-OUTPUT_CLIP before the speakers. The normaliser only pulls the
      // level toward a target (fast transients can overshoot), and an
      // imported definition can ignore its amp parameter entirely - so the
      // last word is a sample-level clip, outside the WASM engine.
      const ctx = supersonic.audioContext;
      const worklet = supersonic.node?.node ?? supersonic.node;
      if (worklet && !this.outputShaper) {
        const curve = new Float32Array(4096);
        for (let i = 0; i < curve.length; i += 1) {
          const x = (i / (curve.length - 1)) * 2 - 1;
          curve[i] = Math.max(-OUTPUT_CLIP, Math.min(OUTPUT_CLIP, x));
        }
        this.outputShaper = ctx.createWaveShaper();
        this.outputShaper.curve = curve;
        this.outputShaper.oversample = "none";
        worklet.disconnect();
        worklet.connect(this.outputShaper);
        this.outputShaper.connect(ctx.destination);
      }

      this.ready = true;
      onStatus("Ready");
      return this;
    })().catch((err) => {
      this.booting = null;
      this.supersonic = null;
      throw err;
    });
    return this.booting;
  }

  setMasterVolume(value) {
    if (!this.ready) return;
    this.supersonic.send("/n_set", this.masterId, "amp", value);
  }

  setReverbRoom(value) {
    if (!this.ready) return;
    this.supersonic.send("/n_set", this.reverbId, "room", value);
  }

  // Schedule a note as an OSC bundle at an absolute NTP time so the engine
  // renders it sample-accurately, instead of relying on JS timer jitter.
  scheduleNote(ntpTime, synth, params) {
    const id = this.supersonic.nextNodeId();
    if (import.meta.env.DEV) console.log(`[music] schedule ${synth}#${id} at +${(ntpTime - this.ntpNow()).toFixed(2)}s`, params);
    const args = [];
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "number" && Number.isFinite(value)) args.push(key, value);
    }
    if (!("out_bus" in params)) args.push("out_bus", MUSIC_BUS);
    const bundle = SuperSonic.osc.encodeBundle(ntpTime, [
      ["/s_new", fullName(synth), id, 0, this.sourceGroup, ...args],
    ]);
    this.supersonic.sendOSC(bundle);
    return id;
  }

  ntpNow() {
    return SuperSonic.osc.ntpNow();
  }

  // Load an additional vendored synthdef on demand (beyond the boot palette).
  async ensureSynth(short) {
    if (!this.extraSynths) this.extraSynths = new Set();
    if (SYNTH_PALETTE.includes(short) || this.extraSynths.has(short)) return;
    await this.supersonic.loadSynthDefs([fullName(short)]);
    this.extraSynths.add(short);
  }

  // Import a .scsyndef binary (File/Blob/ArrayBuffer). The engine validates the
  // data, extracts the real definition name from it and returns it. Throws with
  // the engine's message when invalid.
  async importSynth(source) {
    const { name } = await this.supersonic.loadSynthDef(source);
    if (!name) throw new Error("No instrument name found in that file.");
    return name;
  }

  // Play one bounded preview note right now. `raw` names are used as-is
  // (imported instruments); short catalog names get the sonic-pi- prefix.
  preview(defName, { raw = false, amp = 0.25 } = {}) {
    const id = this.supersonic.nextNodeId();
    const name = raw ? defName : fullName(defName);
    const bundle = SuperSonic.osc.encodeBundle(this.ntpNow() + 0.1, [
      ["/s_new", name, id, 0, this.sourceGroup, "note", 60, "amp", amp, "out_bus", MUSIC_BUS],
    ]);
    this.supersonic.sendOSC(bundle);
    return id;
  }

  freeNode(id) {
    if (!this.ready) return;
    this.supersonic.send("/n_free", id);
  }

  // Drop every pending scheduled bundle and silence all sounding notes.
  stopAll() {
    if (!this.ready) return;
    this.supersonic.send("/clearSched");
    // One group id only: an extra 0 would free the ROOT group's contents
    // (our groups and the FX chain included).
    this.supersonic.send("/g_freeAll", this.sourceGroup);
  }
}

let shared = null;
export function getEngine() {
  if (!shared) shared = new MusicEngine();
  return shared;
}
