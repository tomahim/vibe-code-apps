import { useEffect, useState } from "react";
import Gallery from "../pages/Gallery.jsx";
import LiveTrailScrap from "../apps/livetrail-scrap/LiveTrailScrap.jsx";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(nextPath) {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo(0, 0);
  }

  if (path.startsWith("/apps/livetrail-scrap")) {
    return <LiveTrailScrap onHome={() => navigate("/")} />;
  }

  return <Gallery onOpenApp={(slug) => navigate(`/apps/${slug}`)} />;
}
