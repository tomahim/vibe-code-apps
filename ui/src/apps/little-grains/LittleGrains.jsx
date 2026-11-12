import { useCallback, useEffect, useRef, useState } from "react";
import { BRAND_BADGE } from "../../config/brand.js";
import { getToken } from "../../auth.js";
import AccountMenu from "../../components/AccountMenu.jsx";
import { createGarden } from "./garden/garden.js";
import { GrainsLoader } from "./Loader.jsx";
import { PathComplete } from "./PathComplete.jsx";
import { finishedPaths, newlyCompletedPaths, pathFinished } from "./path-completion.js";
import { BadgeButton, BadgeCollection, StreakPanel, StreakPill } from "./Badges.jsx";
import { api, redirectToLogin } from "./api.js";
import { LessonReader } from "./reader/LessonReader.jsx";
import { QuizSession } from "./quiz/QuizSession.jsx";
import { ReviewPicker } from "./quiz/ReviewPicker.jsx";
import { fetchFeatureFlags } from "../../featureFlags.js";
import { ChallengeSession } from "./challenge/ChallengeSession.jsx";
import { Leaderboard, RewardInfo } from "./leaderboard/Leaderboard.jsx";
import "./garden/garden.css";
import "./little-grains.css";

// Cold start: the first request can hit a sleeping api. Wait on a real
// database health check before loading the garden; the loader covers the
// retry budget. No keep-awake heartbeat: the api no longer sleeps (#466).
const HEALTH_URL = "/api/learning/health/";
const HEALTH_TIMEOUT_MS = 10000;
const HEALTH_MAX_ATTEMPTS = 24;
const HEALTH_WAIT_BUDGET_MS = 120000; // Total cap: attempts alone could stretch much longer.
const HEALTH_RETRY_BASE_MS = 1500;
const HEALTH_RETRY_CAP_MS = 5000;

// Window overrides let browser tests run the retry loop fast.
function healthMaxAttempts() { return window.__GRAINS_HEALTH_MAX_ATTEMPTS__ ?? HEALTH_MAX_ATTEMPTS; }
function healthWaitBudget() { return window.__GRAINS_HEALTH_BUDGET_MS__ ?? HEALTH_WAIT_BUDGET_MS; }
function healthRetryDelay(attempt) { return window.__GRAINS_HEALTH_RETRY_MS__ ?? Math.min(HEALTH_RETRY_BASE_MS * attempt, HEALTH_RETRY_CAP_MS); }

async function pingHealth() {
  const response = await fetch(HEALTH_URL, { cache: "no-store", signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS) });
  if (!response.ok) return false;
  const data = await response.json().catch(() => ({}));
  return data.status === "ok";
}

// Path-based routing (#225): garden level, selected lesson and the card or
// question being read all live in the URL, so refresh, back/forward and
// copied links restore the same place.
function parseRoute(pathname) {
  const match = pathname.match(/^\/apps\/little-grains(?:\/theme\/([^/]+)(?:\/path\/([^/]+)(?:\/lesson\/([^/]+)(?:\/(card|question)\/([^/]+))?)?)?)?\/?$/);
  if (!match) return {};
  return { themeId: match[1] || null, pathId: match[2] || null, lessonId: match[3] || null, step: match[4] ? { type: match[4], id: match[5] } : null };
}

function routeUrl(route) {
  let url = "/apps/little-grains";
  if (route.themeId) url += `/theme/${route.themeId}`;
  if (route.pathId) url += `/path/${route.pathId}`;
  if (route.lessonId) url += `/lesson/${route.lessonId}`;
  if (route.step) url += `/${route.step.type}/${route.step.id}`;
  return url;
}

// Map URL ids to garden indices; an unknown or removed id falls back to the
// nearest valid level (theme -> garden, path -> theme, lesson -> path).
function locateRoute(gardenData, route) {
  const themes = gardenData?.themes || [];
  const ti = themes.findIndex((theme) => theme.id === route.themeId);
  if (!route.themeId || ti < 0) return { view: { ti: -1, pi: -1, lesson: -1 }, route: {} };
  const paths = themes[ti].learning_paths || [];
  const pi = paths.findIndex((path) => path.id === route.pathId);
  if (!route.pathId || pi < 0) return { view: { ti, pi: -1, lesson: -1 }, route: { themeId: route.themeId } };
  const lessons = paths[pi].lessons || [];
  const li = lessons.findIndex((lesson) => lesson.id === route.lessonId);
  if (!route.lessonId || li < 0) return { view: { ti, pi, lesson: -1 }, route: { themeId: route.themeId, pathId: route.pathId } };
  return { view: { ti, pi, lesson: li }, route: { themeId: route.themeId, pathId: route.pathId, lessonId: route.lessonId } };
}


function adaptGarden(data) {
  const terrains = [
    { terrain: "meadow", top: "#8abf70", top2: "#6fa961" },
    { terrain: "forest", top: "#75a672", top2: "#5f9163" },
    { terrain: "orchard", top: "#a1c875", top2: "#85ae60" },
    { terrain: "mesa", top: "#d7a37d", top2: "#bf8565" },
    { terrain: "lavender", top: "#b4b58b", top2: "#9ea379" },
    { terrain: "pond", top: "#87bbad", top2: "#70a996" },
    { terrain: "alpine", top: "#b5c0a6", top2: "#9aab94" },
  ];
  // The diving themes get underwater reef scenery keyed by their content UUID;
  // every other theme keeps the positional rotation above.
  const themeTerrains = {
    "bd957ab9-8aa7-4f8c-970f-c858f4cbec04": { terrain: "coral", top: "#e6d3a3", top2: "#d6bf8c" },
    "e0fecbd7-085e-4f6e-8fdb-afd4f52a3f8b": { terrain: "reef", top: "#d3d8b8", top2: "#bcc39c" },
  };
  return (data.themes || []).map((theme, index) => ({
    ...theme, ...terrains[index % terrains.length], ...themeTerrains[theme.id], blurb: theme.description || "A place to grow your knowledge.",
    paths: (theme.learning_paths || []).map((path) => ({
      ...path, lessonData: path.lessons || [], lessons: (path.lessons || []).map((lesson) => lesson.title),
    })),
  }));
}


export default function LittleGrains() {
  const mount = useRef(null);
  const scene = useRef(null);
  const lastGarden = useRef(null);
  const [garden, setGarden] = useState(null);
  const [completedPaths, setCompletedPaths] = useState([]);
  const celebratedPaths = useRef(new Set());
  const [error, setError] = useState("");
  const [startup, setStartup] = useState({ phase: "waking", attempt: 1 });
  const [wakeRun, setWakeRun] = useState(0);
  const [reader, setReader] = useState(() => {
    const current = parseRoute(window.location.pathname);
    return current.lessonId && current.step ? { lessonId: current.lessonId, step: current.step } : null;
  });
  // "none": opened by a click, the first step pushes one history entry.
  // "pushed": that entry exists; step moves replace it, closing goes back.
  // "landed": arrived on a step URL directly; step moves only replace it.
  const readerHistory = useRef(parseRoute(window.location.pathname).step ? "landed" : "none");
  const readerMeta = useRef(null);
  const gardenData = useRef(null);
  const [catchUp, setCatchUp] = useState(null);
  const [reviewPicker, setReviewPicker] = useState(false);
  const [reviewMinutes, setReviewMinutes] = useState(null);
  // null until /api/auth/me answers. Missing or failed means no flags: both
  // features stay hidden and make no requests.
  const [flags, setFlags] = useState(null);
  const challengeEnabled = Boolean(flags?.includes("challenge_two_users"));
  const leaderboardEnabled = Boolean(flags?.includes("leaderboard_two_users"));
  const [challenge, setChallenge] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [badges, setBadges] = useState(null);
  const [badgesError, setBadgesError] = useState("");
  const [rewardInfo, setRewardInfo] = useState(null);
  const profile = window.matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop";
  // The api awards badges when asked: on first load, after leaving a lesson or
  // quiz and when the badges tab opens. Never per card or answer, never polled.
  const checkBadges = useCallback(() => api("badges/check/", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).then((result) => { setBadges(result); setBadgesError(""); }).catch((err) => setBadgesError(err.message)), []);
  // A path celebrates once its last card is read, and the +100 Drops shows
  // once per learner on any device: the server remembers the shown
  // celebration (display only - the bonus itself is derived from history),
  // this visit's set only guards against repeats within the session.
  const refresh = useCallback(async () => {
    const result = await api("garden/");
    const serverCelebrated = (path) => (result.themes || []).some(theme =>
      (theme.learning_paths || []).some(item => item.id === path.id && item.celebrated));
    const completed = (gardenData.current ? newlyCompletedPaths(gardenData.current, result) : finishedPaths(result))
      .filter(path => !serverCelebrated(path) && !celebratedPaths.current.has(path.id));
    completed.forEach(path => {
      celebratedPaths.current.add(path.id);
      api(`paths/${path.id}/celebrated/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => {});
    });
    if (completed.length) setCompletedPaths(queue => [...queue, ...completed]);
    gardenData.current = result; setGarden(result); return result;
  }, []);

  const navigate = useCallback((next, { replace = false } = {}) => {
    const url = routeUrl(next);
    if (url !== window.location.pathname) window.history[replace ? "replaceState" : "pushState"]({}, "", url);
  }, []);

  const handleViewChange = useCallback((view) => {
    navigate({ themeId: view.themeId, pathId: view.pathId, lessonId: view.lessonId });
  }, [navigate]);

  const openReader = useCallback((lessonId) => {
    readerHistory.current = "none";
    setReader({ lessonId, step: null });
  }, []);

  const handleReaderStep = useCallback((meta, step) => {
    readerMeta.current = meta;
    const next = { themeId: meta.themeId, pathId: meta.pathId, lessonId: meta.lessonId, step };
    if (readerHistory.current === "none") { readerHistory.current = "pushed"; navigate(next); }
    else navigate(next, { replace: true });
  }, [navigate]);

  // Re-reading to the end of the last lesson of an already-finished path
  // replays the celebration without the +100 Drops: that bonus is earned
  // once, by the first finish (garden transition or one-time catch-up).
  const handleLessonEnd = useCallback((lessonId, kind) => {
    if (kind !== "reviewed" || !gardenData.current) return;
    for (const theme of gardenData.current.themes || []) {
      for (const path of theme.learning_paths || []) {
        const lessons = path.lessons || [];
        const last = lessons.reduce((latest, lesson) => (lesson.position > (latest?.position ?? 0) ? lesson : latest), null);
        if (last?.id === lessonId && pathFinished(path)) {
          setCompletedPaths(queue => [...queue, { id: path.id, title: path.title, lessons: path.progress?.lessons_total, reward: false }]);
          return;
        }
      }
    }
  }, []);

  // Garden freshness: the reader no longer refreshes the garden per card or
  // answer (each save response already carries the progress it shows). One
  // refresh when the lesson closes updates the map, the reward counters and
  // fires any earned path celebration. (Thomas, 2026-11-10)
  const wasReading = useRef(false);
  useEffect(() => {
    if (reader) { wasReading.current = true; return; }
    if (wasReading.current) { wasReading.current = false; refresh(); }
  }, [reader, refresh]);

  const closeReader = useCallback(() => {
    if (readerHistory.current === "pushed") { readerHistory.current = "none"; window.history.back(); return; }
    readerHistory.current = "none";
    setReader(null);
    // Landed on a step URL: fold it back to the lesson level, not an error.
    const current = parseRoute(window.location.pathname);
    if (current.step) navigate({ themeId: readerMeta.current?.themeId || current.themeId, pathId: readerMeta.current?.pathId || current.pathId, lessonId: current.lessonId }, { replace: true });
  }, [navigate]);

  // Browser back/forward restores the garden level and reader from the URL.
  useEffect(() => {
    const onPopState = () => {
      const next = parseRoute(window.location.pathname);
      readerHistory.current = next.step ? "landed" : "none";
      setReader(next.lessonId && next.step ? { lessonId: next.lessonId, step: next.step } : null);
      if (gardenData.current && scene.current && !scene.current.failed) {
        const located = locateRoute(gardenData.current, next);
        scene.current.applyView(located.view);
        const valid = routeUrl(next.step ? { ...located.route, step: located.route.lessonId ? next.step : null } : located.route);
        if (valid !== window.location.pathname) window.history.replaceState({}, "", valid);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Leaving a lesson or a Practice quiz, by any route (close, back, finish),
  // is the moment to look for new badges.
  const inSession = Boolean(reader || catchUp || reviewMinutes || challenge);
  const wasInSession = useRef(false);
  useEffect(() => {
    if (wasInSession.current && !inSession) checkBadges();
    wasInSession.current = inSession;
  }, [inSession, checkBadges]);

  useEffect(() => {
    if (!getToken()) { const id = setTimeout(redirectToLogin, 0); return () => clearTimeout(id); }
    let active = true;
    setStartup({ phase: "waking", attempt: 1 });
    (async () => {
      const maxAttempts = healthMaxAttempts();
      const deadline = Date.now() + healthWaitBudget();
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        setStartup({ phase: "waking", attempt });
        let ready = false;
        try { ready = await pingHealth(); } catch { ready = false; }
        if (!active) return;
        if (ready) break;
        if (attempt >= maxAttempts || Date.now() >= deadline) { setStartup({ phase: "exhausted", attempt }); return; }
        await new Promise((resolve) => { setTimeout(resolve, healthRetryDelay(attempt)); });
      }
      if (!active) return;
      setStartup({ phase: "ready", attempt: 0 });
      // Flags load once the api is awake, so a cold start is not read as "no flags".
      fetchFeatureFlags().then((keys) => { if (active) setFlags(keys); });
      refresh().catch((err) => { if (active) setError(err.message); });
      checkBadges();
    })();
    return () => { active = false; };
  }, [refresh, wakeRun]);


  useEffect(() => {
    if (!garden || !flags || !mount.current) return;
    // Restore the garden level from the URL and correct unknown ids (#225).
    const current = parseRoute(window.location.pathname);
    const located = locateRoute(garden, current);
    if (!current.step) { const valid = routeUrl(located.route); if (valid !== window.location.pathname) window.history.replaceState({}, "", valid); }
    const instance = createGarden({ container: mount.current, profile, themes: adaptGarden(garden), rewards: garden.rewards, recentLessons: garden.recent_lessons || [], initialView: located.view, onViewChange: handleViewChange, onOpenLesson: openReader, onRewardInfo: setRewardInfo, onPracticeQuiz: (pathId, pathTitle, lesson = null) => setCatchUp({ pathId, pathTitle, lesson }), onReview: () => setReviewPicker(true), onChallenge: () => setChallenge(true), challengeEnabled, reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    scene.current = instance;
    lastGarden.current = garden;
    return () => { instance.dispose(); scene.current = null; };
  }, [Boolean(garden), Boolean(flags), profile]);

  useEffect(() => {
    if (garden && garden !== lastGarden.current && scene.current && !scene.current.failed) {
      scene.current.updateData(adaptGarden(garden), garden.rewards, garden.recent_lessons || []);
      lastGarden.current = garden;
    }
  }, [garden]);

  useEffect(() => {
    const onEscape = (event) => { if (event.key === "Escape") { if (completedPaths.length && !reader && !catchUp && !reviewMinutes) return; if (showBadges || showStreak) return; if (reader) closeReader(); else if (catchUp) setCatchUp(null); else if (reviewPicker) setReviewPicker(false); else if (reviewMinutes) setReviewMinutes(null); else if (challenge) setChallenge(false); else if (showLeaderboard) setShowLeaderboard(false); else if (rewardInfo) setRewardInfo(null); } };
    window.addEventListener("keydown", onEscape); return () => window.removeEventListener("keydown", onEscape);
  }, [reader, catchUp, reviewPicker, reviewMinutes, challenge, showLeaderboard, showBadges, showStreak, rewardInfo, closeReader, completedPaths]);

  return <main className="little-grains-page"><header className="grains-header"><a className="grains-brand" href="/"><span className="grains-brand-mark">{BRAND_BADGE}</span><span>Little Grains<small>THE LEARNING GARDEN</small></span></a><div className="grains-header-actions"><span className="grains-header-label">Grow a little, every day</span>{leaderboardEnabled && <button className="grains-leaderboard-button" onClick={() => setShowLeaderboard(true)} aria-label="Open leaderboard"><span aria-hidden="true">♛</span><span className="grains-button-text">Leaderboard</span></button>}<StreakPill streak={badges?.streak} onClick={() => { setShowStreak(true); checkBadges(); }} /><BadgeButton newCount={badges?.new_count || 0} onClick={() => { setShowBadges(true); checkBadges(); }} /><AccountMenu /></div></header>
    <section className="grains-stage" aria-label="Learning garden"><div className="grains-garden-mount" ref={mount} />{(startup.phase !== "ready" || ((!garden || !flags) && !error)) && (startup.phase === "exhausted"
        ? <GrainsLoader exhausted onRetry={() => setWakeRun((run) => run + 1)} />
        : startup.phase !== "ready"
          ? <GrainsLoader attempt={startup.attempt} />
          : <GrainsLoader />)}{error && <div className="grains-stage-message" role="alert"><p>{error}</p><button onClick={() => { setError(""); refresh().catch((err) => setError(err.message)); }}>Try again</button></div>}{garden?.themes.length === 0 && <div className="grains-stage-message"><h1>Your garden is ready</h1><p>Lessons will appear here when they are published.</p></div>}{rewardInfo && <RewardInfo currency={rewardInfo} onClose={() => setRewardInfo(null)} />}</section>
    {reader && <LessonReader key={reader.lessonId} lessonId={reader.lessonId} initialStep={reader.step} onClose={closeReader} onStepChange={handleReaderStep} onLessonEnd={(kind) => handleLessonEnd(reader.lessonId, kind)} />}
    {catchUp && <QuizSession fetchUrl={`paths/${catchUp.pathId}/catch-up/${catchUp.lesson ? `?lesson=${catchUp.lesson.id}` : ""}`} kicker={`Practice quiz · ${catchUp.lesson ? `${catchUp.pathTitle} · ${catchUp.lesson.title}` : catchUp.pathTitle}`} label={`Practice quiz - ${catchUp.lesson ? catchUp.lesson.title : catchUp.pathTitle}`} lesson={catchUp.lesson} onClose={() => setCatchUp(null)} onProgress={refresh} />}
    {reviewPicker && <ReviewPicker onPick={(minutes) => { setReviewPicker(false); setReviewMinutes(minutes); }} onClose={() => setReviewPicker(false)} />}
    {reviewMinutes && <QuizSession fetchUrl={`review/?minutes=${reviewMinutes}`} kicker={`Review · ${reviewMinutes} minutes`} heading="REVIEW" onClose={() => setReviewMinutes(null)} onProgress={refresh} />}
    {challengeEnabled && challenge && <ChallengeSession onClose={() => setChallenge(false)} onProgress={refresh} />}
    {!reader && !catchUp && completedPaths.length > 0 && <PathComplete key={completedPaths[0].id} path={completedPaths[0]} onDone={() => setCompletedPaths(queue => queue.slice(1))} />}
    {leaderboardEnabled && showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} onOpenBadges={() => { setShowLeaderboard(false); setShowBadges(true); checkBadges(); }} />}
    {showBadges && <BadgeCollection data={badges} error={badgesError} onClose={() => setShowBadges(false)} />}
    {showStreak && <StreakPanel data={badges} error={badgesError} onClose={() => setShowStreak(false)} />}
  </main>;
}
