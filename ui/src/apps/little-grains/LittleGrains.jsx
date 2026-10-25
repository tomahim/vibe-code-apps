import { useEffect } from "react";

// Little Grains will be the first app that requires an account.
// There is no backend session yet, so the empty app simply sends every
// visitor to the login page for now.
export default function LittleGrains() {
  useEffect(() => {
    window.history.replaceState({}, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);
  return null;
}
