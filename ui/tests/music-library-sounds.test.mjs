import test from "node:test";
import assert from "node:assert/strict";

import { SOUND_CATALOG } from "../src/apps/music-library/soundCatalog.js";

// Fresh module state per test: sounds.js memoizes at module scope.
async function freshLoader() {
  const mod = await import(`../src/apps/music-library/sounds.js?case=${Math.random()}`);
  return mod.loadSounds;
}

test("returns the API instruments on success and memoizes the fetch", async () => {
  const apiList = [{ name: "my_synth", type: "Synth", blurb: "", origin: "imported" }];
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return { ok: true, json: async () => ({ instruments: apiList }) };
  };
  const loadSounds = await freshLoader();
  assert.deepEqual(await loadSounds(), apiList);
  assert.deepEqual(await loadSounds(), apiList);
  assert.equal(calls, 1);
});

test("falls back to the static catalog on HTTP error", async () => {
  globalThis.fetch = async () => ({ ok: false, status: 500, json: async () => ({}) });
  const loadSounds = await freshLoader();
  assert.deepEqual(await loadSounds(), SOUND_CATALOG);
});

test("falls back on network failure and retries next time", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    if (calls === 1) throw new Error("network down");
    return { ok: true, json: async () => ({ instruments: [{ name: "later" }] }) };
  };
  const loadSounds = await freshLoader();
  assert.deepEqual(await loadSounds(), SOUND_CATALOG);
  assert.deepEqual(await loadSounds(), [{ name: "later" }]);
  assert.equal(calls, 2);
});
