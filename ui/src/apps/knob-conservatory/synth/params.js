// Single registry for every control on the panel. The panel UI, the lesson
// unlocks, the ear-matching scorer and the saved patches all read from here,
// so a new control is added in exactly one place.
//
// The layout is inspired by the classic three-oscillator monosynth
// (Minimoog Model D): oscillators, mixer, filter, two envelopes, modulation.
// It is an inspiration, not an exact imitation.

export const WAVEFORMS = ["sawtooth", "square", "triangle", "sine"];
export const LFO_TARGETS = ["cutoff", "pitch", "amp"];
export const LFO_WAVES = ["sine", "triangle", "square"];
export const NOISE_COLORS = ["white", "pink"];

// kind: "knob" (continuous) or "selector" (discrete choices).
// scale: "log" values are compared and dragged in log space.
// tolerance: default normalized distance that still counts as an ear-match.
export const SECTIONS = [
  {
    id: "oscillators",
    name: "Oscillators",
    controls: [
      { id: "osc1_wave", kind: "selector", label: "Osc 1 wave", choices: WAVEFORMS, default: "sawtooth" },
      { id: "osc1_octave", kind: "knob", label: "Osc 1 octave", min: -2, max: 2, step: 1, default: 0, tolerance: 0 },
      { id: "osc2_wave", kind: "selector", label: "Osc 2 wave", choices: WAVEFORMS, default: "sawtooth" },
      { id: "osc2_octave", kind: "knob", label: "Osc 2 octave", min: -2, max: 2, step: 1, default: 0, tolerance: 0 },
      { id: "osc2_detune", kind: "knob", label: "Osc 2 detune", min: -50, max: 50, unit: "cents", default: 6, tolerance: 0.16 },
      { id: "osc3_wave", kind: "selector", label: "Osc 3 wave", choices: WAVEFORMS, default: "triangle" },
      { id: "osc3_octave", kind: "knob", label: "Osc 3 octave", min: -2, max: 2, step: 1, default: 0, tolerance: 0 },
      { id: "osc3_detune", kind: "knob", label: "Osc 3 detune", min: -50, max: 50, unit: "cents", default: -6, tolerance: 0.16 },
    ],
  },
  {
    id: "mixer",
    name: "Mixer",
    controls: [
      { id: "osc1_level", kind: "knob", label: "Osc 1 level", min: 0, max: 1, default: 0.8, tolerance: 0.12 },
      { id: "osc2_level", kind: "knob", label: "Osc 2 level", min: 0, max: 1, default: 0, tolerance: 0.12 },
      { id: "osc3_level", kind: "knob", label: "Osc 3 level", min: 0, max: 1, default: 0, tolerance: 0.12 },
      { id: "noise_level", kind: "knob", label: "Noise level", min: 0, max: 1, default: 0, tolerance: 0.12 },
      { id: "noise_color", kind: "selector", label: "Noise color", choices: NOISE_COLORS, default: "white" },
    ],
  },
  {
    id: "filter",
    name: "Filter",
    controls: [
      { id: "cutoff", kind: "knob", label: "Cutoff", min: 40, max: 12000, unit: "Hz", scale: "log", default: 1800, tolerance: 0.1 },
      { id: "resonance", kind: "knob", label: "Resonance", min: 0, max: 0.95, default: 0.15, tolerance: 0.12 },
      { id: "env_amount", kind: "knob", label: "Contour amount", min: -1, max: 1, default: 0.35, tolerance: 0.1 },
    ],
  },
  {
    id: "amp-envelope",
    name: "Loudness contour",
    controls: [
      { id: "attack", kind: "knob", label: "Attack", min: 0.002, max: 2, unit: "s", scale: "log", default: 0.01, tolerance: 0.14 },
      { id: "decay", kind: "knob", label: "Decay", min: 0.01, max: 2, unit: "s", scale: "log", default: 0.15, tolerance: 0.14 },
      { id: "sustain", kind: "knob", label: "Sustain", min: 0, max: 1, default: 0.8, tolerance: 0.12 },
      { id: "release", kind: "knob", label: "Release", min: 0.01, max: 3, unit: "s", scale: "log", default: 0.2, tolerance: 0.14 },
    ],
  },
  {
    id: "filter-envelope",
    name: "Filter contour",
    controls: [
      { id: "fattack", kind: "knob", label: "Attack", min: 0.002, max: 2, unit: "s", scale: "log", default: 0.01, tolerance: 0.14 },
      { id: "fdecay", kind: "knob", label: "Decay", min: 0.01, max: 2, unit: "s", scale: "log", default: 0.25, tolerance: 0.14 },
      { id: "fsustain", kind: "knob", label: "Sustain", min: 0, max: 1, default: 0.3, tolerance: 0.12 },
      { id: "frelease", kind: "knob", label: "Release", min: 0.01, max: 3, unit: "s", scale: "log", default: 0.3, tolerance: 0.14 },
    ],
  },
  {
    id: "modulation",
    name: "Modulation",
    controls: [
      { id: "lfo_rate", kind: "knob", label: "LFO rate", min: 0.05, max: 12, unit: "Hz", scale: "log", default: 2, tolerance: 0.12 },
      { id: "lfo_depth", kind: "knob", label: "LFO depth", min: 0, max: 1, default: 0, tolerance: 0.1 },
      { id: "lfo_target", kind: "selector", label: "LFO target", choices: LFO_TARGETS, default: "cutoff" },
      { id: "lfo_wave", kind: "selector", label: "LFO wave", choices: LFO_WAVES, default: "sine" },
    ],
  },
  {
    id: "performance",
    name: "Performance",
    controls: [
      { id: "glide", kind: "knob", label: "Glide", min: 0, max: 1, unit: "s", default: 0, tolerance: 0.12 },
      { id: "volume", kind: "knob", label: "Volume", min: 0, max: 1, default: 0.8, tolerance: 0.12 },
    ],
  },
];

export const CONTROLS = SECTIONS.flatMap((section) =>
  section.controls.map((control) => ({ ...control, section: section.id })),
);

export const CONTROL_BY_ID = new Map(CONTROLS.map((control) => [control.id, control]));

export const TOTAL_CONTROLS = CONTROLS.length;

export function defaultPatch() {
  return Object.fromEntries(CONTROLS.map((control) => [control.id, control.default]));
}

// Keep only known controls, coerce values into range/choices, fill the rest
// with defaults. Used for lesson base patches, loaded presets and scoring.
export function normalizePatch(patch = {}) {
  const clean = {};
  for (const control of CONTROLS) {
    const raw = patch[control.id];
    if (control.kind === "selector") {
      clean[control.id] = control.choices.includes(raw) ? raw : control.default;
    } else {
      let value = Number(raw);
      if (!Number.isFinite(value)) value = control.default;
      if (control.step) value = Math.round(value / control.step) * control.step;
      clean[control.id] = Math.min(control.max, Math.max(control.min, value));
    }
  }
  return clean;
}

// Normalized position 0..1 of a knob value (log knobs measured in log space),
// so distances are comparable across Hz, seconds and unitless controls.
export function normalizedValue(control, value) {
  if (control.scale === "log") {
    const min = Math.log(control.min);
    return (Math.log(Math.max(control.min, value)) - min) / (Math.log(control.max) - min);
  }
  return (value - control.min) / (control.max - control.min);
}

export function formatValue(control, value) {
  if (control.kind === "selector") return String(value);
  if (control.scale === "log" && value >= 100) return `${Math.round(value)}`;
  if (control.scale === "log") return `${Number(value).toPrecision(2)}`;
  const rounded = control.step ? value : Math.round(value * 100) / 100;
  return `${rounded}`;
}
