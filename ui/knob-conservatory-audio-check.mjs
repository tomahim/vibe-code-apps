// Real-audio verification in Firefox, headed under Xvfb (headless Firefox
// cannot run an AudioContext). Run with:
//   xvfb-run -a node knob-conservatory-audio-check.mjs
// Verifies that the app's synth actually outputs signal in Firefox and that
// the controls audibly change it - not just that the scorer sees the right
// knob values.
import { firefox } from '@playwright/test';
import { spawn } from 'node:child_process';

const server = spawn('npm', ['run', 'dev', '--', '--port', '5197'], { stdio: 'ignore' });
const browser = await firefox.launch({ headless: false });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });

for (let i = 0; i < 30; i += 1) {
  try { await page.goto('http://localhost:5197/apps/knob-conservatory'); break; }
  catch { await new Promise((resolve) => setTimeout(resolve, 200)); }
}
await page.getByRole('heading', { name: 'Knob Conservatory' }).waitFor();

const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
};

// 1. Power on: the AudioContext actually runs in Firefox.
await page.getByRole('button', { name: 'Power' }).click();
await page.getByRole('button', { name: 'On', exact: true }).waitFor();
check('power on', await page.evaluate(() => window.__kcEngine.running), 'AudioContext running');

const level = () => page.evaluate(() => window.__kcEngine.outputLevel());
const setParam = (id, value) => page.evaluate(([k, v]) => { window.__kcEngine.setParam(k, v); window.__kcEngine.applyPatch({ ...window.__kcEngine.patch, [k]: v }); }, [id, value]);
const settle = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 2. A played note produces real output signal (via the on-screen keyboard).
const key = page.getByRole('button', { name: 'C4' });
await key.dispatchEvent('pointerdown', { pointerId: 7 });
await settle(400);
const playing = await level();
check('note sounds', playing.rms > 0.01, `rms ${playing.rms.toFixed(4)} while holding C4`);

// 3. Cutoff control audibly changes the spectrum of the held note.
await setParam('cutoff', 300);
await settle(300);
const dark = await level();
await setParam('cutoff', 8000);
await settle(300);
const bright = await level();
check('cutoff audible', bright.centroid > dark.centroid * 1.5, `centroid ${dark.centroid.toFixed(3)} -> ${bright.centroid.toFixed(3)}`);

// 4. Mixer control silences the oscillator.
await setParam('osc1_level', 0);
await settle(300);
const muted = await level();
check('mixer mutes', muted.rms < playing.rms * 0.2, `rms ${playing.rms.toFixed(4)} -> ${muted.rms.toFixed(4)}`);
await setParam('osc1_level', 0.8);

// 5. Release control: note tail still audible shortly after key up.
await key.dispatchEvent('pointerup', { pointerId: 7 });
await page.evaluate(() => window.__kcEngine.setParam('release', 1.5));
await key.dispatchEvent('pointerdown', { pointerId: 8 });
await settle(250);
await key.dispatchEvent('pointerup', { pointerId: 8 });
await settle(400);
const tail = await level();
check('release tail', tail.rms > 0.001 && tail.rms < playing.rms, `rms ${tail.rms.toFixed(4)} 400ms after key up (release 1.5s)`);
await settle(2500);
const silent = await level();
check('note ends', silent.rms < 0.005, `rms ${silent.rms.toFixed(4)} after the tail`);

// 6. LFO on loudness creates a real tremolo (level varies over time).
await setParam('lfo_target', 'amp');
await setParam('lfo_depth', 0.8);
await setParam('lfo_rate', 4);
await key.dispatchEvent('pointerdown', { pointerId: 9 });
await settle(300);
const samples = [];
for (let i = 0; i < 12; i += 1) { samples.push((await level()).rms); await settle(90); }
await key.dispatchEvent('pointerup', { pointerId: 9 });
const min = Math.min(...samples);
const max = Math.max(...samples);
check('lfo tremolo', max > min * 1.8, `rms swings ${min.toFixed(4)}..${max.toFixed(4)} at 4 Hz`);

const failed = results.filter((result) => !result.ok);
console.log(failed.length === 0 ? 'ALL AUDIO CHECKS PASSED (headed Firefox)' : `${failed.length} CHECKS FAILED`);
await browser.close();
server.kill();
process.exit(failed.length === 0 ? 0 : 1);
