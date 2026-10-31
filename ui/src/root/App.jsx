import { lazy, Suspense, useEffect, useState } from "react";
import Gallery from "../pages/Gallery.jsx";
import Login from "../pages/Login.jsx";
import Profile from "../pages/Profile.jsx";
import LiveTrailScrap from "../apps/livetrail-scrap/LiveTrailScrap.jsx";

const StoryShelf = lazy(() => import("../apps/story-shelf/StoryShelf.jsx"));
const LittleDrops = lazy(() => import("../apps/little-drops/LittleDrops.jsx"));
const News = lazy(() => import("../apps/news/News.jsx"));
const LittleGrains = lazy(() => import("../apps/little-grains/LittleGrains.jsx"));

const Recipes = lazy(() => import("../apps/recipes/Recipes.jsx"));

const RustLearningPath = lazy(() => import("../apps/rust-learning-path/RustLearningPath.jsx"));
const ThreeLearningPath = lazy(() => import("../apps/threejs-learning-path/ThreeLearningPath.jsx"));

const AppIdeas = lazy(() => import("../apps/app-ideas/AppIdeas.jsx"));
const Artifacts = lazy(() => import("../pages/Artifacts.jsx"));
const ContentReview = lazy(() => import("../apps/content-review/ContentReview.jsx"));

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

  if (path === "/login") {
    return <Login />;
  }

  if (path === "/profile") {
    return <Profile />;
  }

  if (path === "/artifacts" || path.startsWith("/artifacts/")) {
    return <Suspense fallback={<div className="gallery-page">Opening the archive…</div>}><Artifacts path={path} /></Suspense>;
  }

  if (path === "/apps/story-shelf") {
    return <Suspense fallback={<div>Opening the story room...</div>}><StoryShelf onHome={() => navigate("/")} /></Suspense>;
  }

  if (path === "/apps/news") {
    return <Suspense fallback={<div>Opening the briefing...</div>}><News onHome={() => navigate("/")} /></Suspense>;
  }

  if (path === "/apps/little-drops") {
    return <Suspense fallback={<div>Following the drop...</div>}><LittleDrops onHome={() => navigate("/")} /></Suspense>;
  }

  if (path.startsWith("/apps/little-grains")) {
    return <Suspense fallback={<div>Opening the garden…</div>}><LittleGrains /></Suspense>;
  }

  if (path.startsWith("/apps/livetrail-scrap")) {
    return <LiveTrailScrap onHome={() => navigate("/")} />;
  }

  if (path.startsWith("/apps/threejs-learning-path")) {
    return <Suspense fallback={<div style={{ minHeight: "100vh", background: "#10131a", color: "#bca3f5", display: "grid", placeItems: "center" }}>Opening your 3D studio…</div>}><ThreeLearningPath onHome={() => navigate("/")} /></Suspense>;
  }

  if (path.startsWith("/apps/app-ideas")) {
    return <Suspense fallback={<div className="ideas-page" style={{ paddingTop: 40 }}>Opening the idea garden…</div>}><AppIdeas onHome={() => navigate("/")} /></Suspense>;
  }

  if (path.startsWith("/apps/content-review")) {
    return <Suspense fallback={<div className="review-page" style={{ paddingTop: 40 }}>Opening the review bench…</div>}><ContentReview /></Suspense>;
  }

  if (path.startsWith("/apps/recipes")) {
    return <Suspense fallback={<div className="recipes-app">Opening the kitchen…</div>}><Recipes onHome={() => navigate("/")} /></Suspense>;
  }

  if (path.startsWith("/apps/rust-learning-path")) {
    return <Suspense fallback={<div>Opening Rust workshop…</div>}><RustLearningPath onHome={() => navigate("/")} /></Suspense>;
  }

  return <Gallery onOpenApp={(slug) => navigate(`/apps/${slug}`)} />;
}
