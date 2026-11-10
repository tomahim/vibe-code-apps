// Browser-environment preflight for the SuperSonic engine.
//
// The engine renders audio inside an AudioWorklet, and browsers only expose
// AudioWorklet in secure contexts (HTTPS, or localhost during development).
// The deployed app is reached over plain HTTP on the Tailscale network, where
// Chrome hides the API entirely; SuperSonic then fails with the cryptic
// "Missing required features for postMessage mode: audioWorklet". Checking up
// front lets us say what actually happened and what fixes it.
//
// Returns null when the engine can boot, otherwise a user-facing sentence
// fragment that reads well after "The audio engine could not start: ".
// `env` is injectable so tests can simulate browser environments.
export function audioEnvironmentProblem(env = {}) {
  const isSecureContext = env.isSecureContext ?? globalThis.isSecureContext;
  const hasAudioWorklet =
    env.hasAudioWorklet ?? typeof globalThis.AudioWorklet !== "undefined";
  const hasWorker = env.hasWorker ?? typeof globalThis.Worker !== "undefined";

  if (hasAudioWorklet && hasWorker) return null;

  if (isSecureContext === false) {
    return "this page was loaded over plain HTTP, and browsers only allow the audio engine (AudioWorklet) on HTTPS pages or localhost. Open the app over HTTPS and press Play again";
  }
  return "this browser doesn't support AudioWorklet, which the SuperCollider audio engine needs. Try a recent version of Chrome, Firefox, Edge or Safari";
}
