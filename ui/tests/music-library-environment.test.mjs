import test from "node:test";
import assert from "node:assert/strict";

import { audioEnvironmentProblem } from "../src/apps/music-library/engine/environment.js";

test("secure context with AudioWorklet and Worker can boot", () => {
  assert.equal(
    audioEnvironmentProblem({ isSecureContext: true, hasAudioWorklet: true, hasWorker: true }),
    null,
  );
});

test("plain-HTTP origin hiding AudioWorklet gets the HTTPS guidance", () => {
  // Chrome on http://*.railway.internal:8080: secure context false, API hidden.
  const problem = audioEnvironmentProblem({ isSecureContext: false, hasAudioWorklet: false, hasWorker: true });
  assert.match(problem, /plain HTTP/);
  assert.match(problem, /HTTPS/);
});

test("secure context without AudioWorklet points at the browser", () => {
  const problem = audioEnvironmentProblem({ isSecureContext: true, hasAudioWorklet: false, hasWorker: true });
  assert.match(problem, /AudioWorklet/);
  assert.doesNotMatch(problem, /HTTP/);
});

test("insecure context that still exposes AudioWorklet is left to try", () => {
  assert.equal(
    audioEnvironmentProblem({ isSecureContext: false, hasAudioWorklet: true, hasWorker: true }),
    null,
  );
});
