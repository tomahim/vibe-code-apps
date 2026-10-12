import { lazy, Suspense, useEffect, useState } from "react";
import Gallery from "../pages/Gallery.jsx";
import LiveTrailScrap from "../apps/livetrail-scrap/LiveTrailScrap.jsx";

const ThreeLearningPath = lazy(() => import("../apps/threejs-learning-path/ThreeLearningPath.jsx"));

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

  if (path.startsWith("/apps/threejs-learning-path")) {
    return <Suspense fallback={<div style={{ minHeight: "100vh", background: "#10131a", color: "#bca3f5", display: "grid", placeItems: "center" }}>Opening your 3D studio…</div>}><ThreeLearningPath onHome={() => navigate("/")} /></Suspense>;
  }

  return <Gallery onOpenApp={(slug) => navigate(`/apps/${slug}`)} />;
}
