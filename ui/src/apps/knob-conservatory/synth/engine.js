// WebAudio monosynth engine: three oscillators + noise into a mixer, one
// lowpass filter with its own contour, a loudness contour, and an LFO that
// can ride cutoff, pitch or loudness. Oscillators run continuously (like the
// classic instrument) so glide is a frequency ramp, not a retrigger.

import { normalizePatch } from "./params.js";

const midiToFreq = (midi) => 440 * 2 ** ((midi - 69) / 12);
const GLIDE_MIN = 0.004; // seconds of smoothing even at glide 0, avoids clicks

export class SynthEngine {
  constructor() {
    this.context = null;
    this.patch = normalizePatch();
    this.currentMidi = null;
    this.gateOpen = false;
    this._nodes = null;
  }

  get running() {
    return Boolean(this.context) && this.context.state === "running";
  }

  // Must be called from a user gesture (the panel's power switch). A resume
  // that never resolves (odd embedded/headless audio stacks) must not wedge
  // the switch, so it races a short timeout.
  async powerOn() {
    if (!this.context) this._build();
    if (this.context.state !== "running") {
      await Promise.race([
        this.context.resume().catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
    }
    return this.running;
  }

  async powerOff() {
    if (this.context && this.context.state === "running") await this.context.suspend();
  }

  _build() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const context = new AudioCtx();
    this.context = context;

    const master = context.createGain();
    master.gain.value = 0;
    master.connect(context.destination);

    // Output probe (drives the signal check in the visual test; can feed a
    // VU meter later without touching the audio graph).
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    master.connect(analyser);

    const ampEnv = context.createGain();
    ampEnv.gain.value = 0;
    ampEnv.connect(master);

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.connect(ampEnv);

    const mixer = context.createGain();
    mixer.connect(filter);

    const oscillators = [1, 2, 3].map(() => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      gain.gain.value = 0;
      osc.connect(gain).connect(mixer);
      osc.start();
      return { osc, gain };
    });

    // Loopable two-second noise buffer, regenerated on color change.
    const noiseSource = context.createBufferSource();
    noiseSource.loop = true;
    const noiseGain = context.createGain();
    noiseGain.gain.value = 0;
    noiseSource.connect(noiseGain).connect(mixer);
    noiseSource.buffer = this._noiseBuffer("white");
    noiseSource.start();
    this._noiseColor = "white";

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfoGain.gain.value = 0;
    lfo.connect(lfoGain);
    lfo.start();

    this._nodes = { master, analyser, ampEnv, filter, mixer, oscillators, noiseSource, noiseGain, lfo, lfoGain, lfoTarget: null };
    this._applyAll();
  }

  _noiseBuffer(color) {
    const length = this.context.sampleRate * 2;
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      if (color === "pink") {
        // Simple one-pole approximation; good enough for a learning tool.
        last = 0.98 * last + 0.02 * white;
        data[i] = last * 6;
      } else {
        data[i] = white * 0.6;
      }
    }
    return buffer;
  }

  setParam(id, value) {
    this.patch = { ...this.patch, [id]: value };
    if (this._nodes) this._apply(id);
  }

  applyPatch(settings) {
    this.patch = normalizePatch(settings);
    if (this._nodes) this._applyAll();
  }

  _applyAll() {
    Object.keys(this.patch).forEach((id) => this._apply(id));
    this._retune(true);
  }

  _apply(id) {
    const n = this._nodes;
    const p = this.patch;
    const t = this.context.currentTime;
    switch (id) {
      case "osc1_wave": case "osc2_wave": case "osc3_wave": {
        const index = Number(id[3]) - 1;
        n.oscillators[index].osc.type = p[id];
        break;
      }
      case "osc1_level": case "osc2_level": case "osc3_level": {
        const index = Number(id[3]) - 1;
        n.oscillators[index].gain.gain.setTargetAtTime(p[id], t, 0.01);
        break;
      }
      case "osc1_octave": case "osc2_octave": case "osc3_octave":
      case "osc2_detune": case "osc3_detune":
        this._retune();
        break;
      case "noise_level":
        n.noiseGain.gain.setTargetAtTime(p.noise_level, t, 0.01);
        break;
      case "noise_color": {
        // A BufferSource's buffer is write-once, so swap in a fresh source.
        if (p.noise_color === this._noiseColor) break;
        const source = this.context.createBufferSource();
        source.loop = true;
        source.buffer = this._noiseBuffer(p.noise_color);
        source.connect(n.noiseGain);
        source.start();
        n.noiseSource.stop();
        n.noiseSource.disconnect();
        n.noiseSource = source;
        this._noiseColor = p.noise_color;
        break;
      }
      case "cutoff":
        n.filter.frequency.setTargetAtTime(p.cutoff, t, 0.005);
        break;
      case "resonance":
        n.filter.Q.setTargetAtTime(0.5 + p.resonance * 24, t, 0.01);
        break;
      case "lfo_rate":
        n.lfo.frequency.setTargetAtTime(p.lfo_rate, t, 0.02);
        break;
      case "lfo_wave":
        n.lfo.type = p.lfo_wave;
        break;
      case "lfo_depth":
        this._routeLfo();
        break;
      case "lfo_target":
        this._routeLfo();
        break;
      case "volume":
        n.master.gain.setTargetAtTime(p.volume, t, 0.02);
        break;
      default:
        break; // envelope and glide values are read at note time
    }
  }

  _routeLfo() {
    const n = this._nodes;
    const p = this.patch;
    n.lfoGain.disconnect();
    if (p.lfo_depth <= 0) {
      n.lfoGain.gain.value = 0;
      n.lfoTarget = null;
      return;
    }
    if (p.lfo_target === "cutoff") {
      n.lfoGain.gain.value = p.lfo_depth * 3600; // cents: up to three octaves of sweep
      n.lfoGain.connect(n.filter.detune);
    } else if (p.lfo_target === "pitch") {
      n.lfoGain.gain.value = p.lfo_depth * 120; // cents: up to a semitone of vibrato
      n.oscillators.forEach(({ osc }) => n.lfoGain.connect(osc.detune));
    } else {
      n.lfoGain.gain.value = p.lfo_depth * 0.5;
      n.lfoGain.connect(n.ampEnv.gain);
    }
    n.lfoTarget = p.lfo_target;
  }

  _retune(immediate = false) {
    const n = this._nodes;
    if (!n || this.currentMidi == null) return;
    const p = this.patch;
    const t = this.context.currentTime;
    const glide = Math.max(GLIDE_MIN, this.gateOpen ? p.glide : GLIDE_MIN);
    const freq = midiToFreq(this.currentMidi);
    const ratios = [
      2 ** p.osc1_octave,
      2 ** p.osc2_octave * 2 ** (p.osc2_detune / 1200),
      2 ** p.osc3_octave * 2 ** (p.osc3_detune / 1200),
    ];
    n.oscillators.forEach(({ osc }, index) => {
      if (immediate) osc.frequency.setValueAtTime(freq * ratios[index], t);
      else osc.frequency.setTargetAtTime(freq * ratios[index], t, glide / 3);
    });
  }

  noteOn(midi) {
    if (!this._nodes) return;
    const n = this._nodes;
    const p = this.patch;
    const t = this.context.currentTime;
    this.currentMidi = midi;
    this._retune(!this.gateOpen); // glide only between held notes

    // Loudness contour (ADSR).
    const amp = n.ampEnv.gain;
    amp.cancelScheduledValues(t);
    amp.setValueAtTime(Math.max(0.0001, amp.value), t);
    amp.linearRampToValueAtTime(1, t + Math.max(0.002, p.attack));
    amp.linearRampToValueAtTime(Math.max(0.0001, p.sustain), t + Math.max(0.002, p.attack) + Math.max(0.01, p.decay));

    // Filter contour rides the cutoff knob through the filter's detune (cents).
    const detune = n.filter.detune;
    const amount = p.env_amount * 4800; // up to four octaves of contour
    detune.cancelScheduledValues(t);
    detune.setValueAtTime(amount, t);
    detune.linearRampToValueAtTime(amount * p.fsustain, t + Math.max(0.002, p.fattack) + Math.max(0.01, p.fdecay));

    this.gateOpen = true;
  }

  noteOff() {
    if (!this._nodes || !this.gateOpen) return;
    const n = this._nodes;
    const p = this.patch;
    const t = this.context.currentTime;
    const amp = n.ampEnv.gain;
    amp.cancelScheduledValues(t);
    amp.setValueAtTime(Math.max(0.0001, amp.value), t);
    amp.exponentialRampToValueAtTime(0.0001, t + Math.max(0.02, p.release));
    const detune = n.filter.detune;
    detune.cancelScheduledValues(t);
    detune.setValueAtTime(detune.value, t);
    detune.linearRampToValueAtTime(0, t + Math.max(0.02, p.frelease));
    this.gateOpen = false;
  }

  // Current output level 0..1 (RMS of the master bus) and average spectrum,
  // for signal checks and a future meter. Zeros when the synth is off.
  outputLevel() {
    if (!this._nodes) return { rms: 0, centroid: 0 };
    const analyser = this._nodes.analyser;
    const time = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(time);
    const rms = Math.sqrt(time.reduce((sum, v) => sum + v * v, 0) / time.length);
    const freq = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freq);
    let weighted = 0;
    let total = 0;
    freq.forEach((magnitude, bin) => { weighted += magnitude * bin; total += magnitude; });
    return { rms, centroid: total > 0 ? weighted / total / freq.length : 0 };
  }

  // Play a short reference note with a different patch, then restore the
  // player's patch. Used by lessons for the hidden target sound.
  async preview(patch, midi = 57, seconds = 1.1) {
    if (!this._nodes) return;
    const saved = this.patch;
    this.applyPatch(patch);
    this.noteOn(midi);
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    this.noteOff();
    await new Promise((resolve) => setTimeout(resolve, 350));
    this.applyPatch(saved);
  }
}
