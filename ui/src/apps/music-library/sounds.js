// Session-memoized loader for the playable sounds list.
//
// The instruments API mirrors the bundled SOUND_CATALOG and adds the `ready`
// flags plus any imported sounds. The static catalog renders instantly, so
// callers show it first and swap in the API result when it arrives: a slow
// or unreachable API never blocks the sounds pane. The list page warms the
// loader so the editor is instant after navigating from it.
//
// Successful responses are memoized for the session. Failures fall back to
// the static catalog but are not cached, so the next caller retries.

import { SOUND_CATALOG } from "./soundCatalog.js";

let soundsPromise = null;

export function loadSounds() {
  if (!soundsPromise) {
    soundsPromise = fetch("/api/apps/instruments/instruments/")
      .then((response) => {
        if (!response.ok) throw new Error(`instruments API ${response.status}`);
        return response.json();
      })
      .then((data) => data.instruments)
      .catch(() => {
        soundsPromise = null; // do not cache a failure: retry next time
        return SOUND_CATALOG;
      });
  }
  return soundsPromise;
}
