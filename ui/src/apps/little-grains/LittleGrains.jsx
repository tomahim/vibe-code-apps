import { useCallback, useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { BRAND_BADGE } from "../../config/brand.js";
import { authFetch, clearToken, getToken } from "../../auth.js";
import AccountMenu from "../../components/AccountMenu.jsx";
import { createGarden } from "./garden/garden.js";
import "./garden/garden.css";
import "./little-grains.css";

function redirectToLogin() {
  clearToken();
  window.history.replaceState({}, "", "/login?next=/apps/little-grains");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

async function api(path, options) {
  const response = await authFetch(`/api/learning/${path}`, options);
  if (response.status === 401) { redirectToLogin(); throw new Error("Your session expired."); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
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
  return (data.themes || []).map((theme, index) => ({
    ...theme, ...terrains[index % terrains.length], blurb: theme.description || "A place to grow your knowledge.",
    paths: (theme.learning_paths || []).map((path) => ({
      ...path, lessonData: path.lessons || [], lessons: (path.lessons || []).map((lesson) => lesson.title),
    })),
  }));
}

function Markdown({ source }) {
  const html = DOMPurify.sanitize(marked.parse(source || ""));
  return <div className="grain-markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}

function LessonReader({ lessonId, onClose, onProgress }) {
  const [data, setData] = useState(null);
  const [viewStep, setViewStep] = useState(null);
  const [choice, setChoice] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (preserveStep = false) => {
    const result = await api(`lessons/${lessonId}/`);
    setData(result);
    if (!preserveStep) setViewStep(result.next_step);
    return result;
  }, [lessonId]);

  useEffect(() => {
    let active = true;
    setData(null); setFeedback(null); setChoice(""); setError("");
    api(`lessons/${lessonId}/`).then((result) => { if (active) { setData(result); setViewStep(result.next_step); } })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [lessonId]);

  const card = data?.cards.find((item) => viewStep?.type === "card" && item.id === viewStep.id);
  const question = data?.questions.find((item) => viewStep?.type === "question" && item.id === viewStep.id);
  const totalSteps = (data?.cards.length || 0) + (data?.questions.length || 0);
  const completedSteps = (data?.lesson.progress.cards_completed || 0) + (data?.lesson.progress.checkpoints_correct || 0);

  async function completeCard() {
    if (!card || busy) return;
    setBusy(true); setError("");
    try {
      await api(`cards/${card.id}/complete/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      await load(); await onProgress();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function submitAnswer() {
    if (!question || !choice || busy) return;
    setBusy(true); setError("");
    try {
      const result = await api("question-attempts/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question_id: question.id, answer: choice }) });
      setFeedback(result);
      if (result.correct) { await load(true); await onProgress(); }
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  function continueAfterAnswer() {
    setFeedback(null); setChoice("");
    if (feedback?.correct) setViewStep(data?.next_step || null);
  }

  return <div className="grains-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="grains-reader" role="dialog" aria-modal="true" aria-label={data?.lesson.title || "Lesson"}>
      <div className="grains-reader-top"><span className="grains-reader-kicker">{data?.theme.title || "Little Grains"} / {data?.learning_path.title || "Lesson"}</span><button className="grains-close" onClick={onClose} aria-label="Close lesson">×</button></div>
      {error && <p className="grains-error" role="alert">{error}</p>}
      {!data ? <p className="grains-loading">Opening lesson…</p> : <>
        <div className="grains-reader-head"><p>LESSON {data.lesson.position}</p><h2>{data.lesson.title}</h2><span>{completedSteps} of {totalSteps} steps complete</span></div>
        <div className="grains-progress-track" aria-label={`${completedSteps} of ${totalSteps} steps complete`}><span style={{ width: `${totalSteps ? completedSteps / totalSteps * 100 : 0}%` }} /></div>
        <div className="grains-reader-content">
          {data.lesson.image_url && <img className="grains-lesson-image" src={data.lesson.image_url} alt={data.lesson.image_alt} />}
          {data.lesson.introduction_markdown && <Markdown source={data.lesson.introduction_markdown} />}
          {card && <article className="grains-study-card"><p className="grains-card-index">CARD {card.position} OF {data.cards.length}</p><h3>{card.title}</h3>{card.illustration_url && <img src={card.illustration_url} alt={card.illustration_alt} />}<Markdown source={card.body_markdown} /><button className="grains-primary" disabled={busy} onClick={completeCard}>{busy ? "Saving…" : "I’ve read this card →"}</button></article>}
          {question && <div className="grains-question"><p className="grains-card-index">CHECK YOUR UNDERSTANDING</p><h3>{question.prompt}</h3><div className="grains-options" role="radiogroup" aria-label="Choose an answer">{question.options.map((option) => <label key={option.id} className={choice === option.id ? "selected" : ""}><input type="radio" name={`question-${question.id}`} value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} disabled={!!feedback} /><span>{option.text}</span></label>)}</div>{feedback ? <div className={`grains-feedback ${feedback.correct ? "correct" : "incorrect"}`} role="status"><strong>{feedback.correct ? "That’s right! +1 carrot" : "Not quite. Try again."}</strong><Markdown source={feedback.explanation} /><button className="grains-primary" onClick={continueAfterAnswer}>{feedback.correct ? "Continue →" : "Try another answer"}</button></div> : <button className="grains-primary" disabled={!choice || busy} onClick={submitAnswer}>{busy ? "Checking…" : "Check answer"}</button>}</div>}
          {!viewStep && <div className="grains-complete"><span aria-hidden="true">✿</span><h3>Lesson in bloom</h3><p>All cards read and questions answered. Your garden has grown.</p><button className="grains-primary" onClick={onClose}>Back to the garden</button><div className="grains-revisit"><p>Read again</p>{data.cards.map((item) => <button key={item.id} onClick={() => setViewStep({ type: "revisit", id: item.id })}>{item.title}</button>)}</div></div>}
          {viewStep?.type === "revisit" && <article className="grains-study-card"><button className="grains-text-button" onClick={() => setViewStep(null)}>← Lesson complete</button><h3>{data.cards.find((item) => item.id === viewStep.id)?.title}</h3><Markdown source={data.cards.find((item) => item.id === viewStep.id)?.body_markdown} /></article>}
        </div>
      </>}
    </section>
  </div>;
}

function Leaderboard({ onClose }) {
  const [currency, setCurrency] = useState("drops");
  const [period, setPeriod] = useState("weekly");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true; setData(null); setError("");
    api(`leaderboard/?currency=${currency}&period=${period}`).then((result) => { if (active) setData(result); }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [currency, period]);
  return <div className="grains-modal-backdrop leaderboard-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className="grains-leaderboard" role="dialog" aria-modal="true" aria-label="Leaderboard"><div className="grains-leaderboard-head"><div><p>THE GARDEN GROWS TOGETHER</p><h2>Leaderboard</h2></div><button className="grains-close" onClick={onClose} aria-label="Close leaderboard">×</button></div>
      <div className="grains-segment" aria-label="Ranking type"><button className={currency === "drops" ? "active" : ""} onClick={() => setCurrency("drops")}>💧 Drops</button><button className={currency === "carrots" ? "active" : ""} onClick={() => setCurrency("carrots")}>🥕 Carrots</button></div>
      <div className="grains-period" aria-label="Ranking period">{["weekly", "monthly", "overall"].map((item) => <button key={item} className={period === item ? "active" : ""} onClick={() => setPeriod(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>
      {error && <p className="grains-error" role="alert">{error}</p>}
      {!data && !error && <p className="grains-loading">Gathering the rankings…</p>}
      {data && <><p className="grains-leaderboard-note">{period === "overall" ? "All time" : period === "weekly" ? "Resets every Monday" : "Resets on the 1st"} · UTC</p><ol className="grains-ranking">{data.rows.map((row) => <li key={`${row.rank}-${row.name}`} className={row.is_self ? "self" : ""}><span className="rank">{row.rank}</span><span className="avatar" aria-hidden="true">{row.name.slice(0, 1).toUpperCase()}</span><span className="name">{row.name}{row.is_self && <small>YOU</small>}</span><strong>{row.score}</strong></li>)}</ol>{data.rows.length === 0 && <p className="grains-empty-ranking">The first spot is waiting for you.</p>}<div className="grains-self-rank"><span>Your {currency} rank</span><strong>{data.self?.rank ? `#${data.self.rank} · ${data.self.score} ${currency}` : currency === "drops" ? "Read a card to join" : "Answer a question to join"}</strong></div></>}
    </aside>
  </div>;
}

export default function LittleGrains() {
  const mount = useRef(null);
  const scene = useRef(null);
  const lastGarden = useRef(null);
  const [garden, setGarden] = useState(null);
  const [error, setError] = useState("");
  const [lessonId, setLessonId] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const profile = window.matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop";
  const refresh = useCallback(async () => { const result = await api("garden/"); setGarden(result); return result; }, []);

  useEffect(() => {
    if (!getToken()) { const id = setTimeout(redirectToLogin, 0); return () => clearTimeout(id); }
    let active = true;
    refresh().catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [refresh]);

  useEffect(() => {
    if (!garden || !mount.current) return;
    const instance = createGarden({ container: mount.current, profile, themes: adaptGarden(garden), rewards: garden.rewards, onOpenLesson: setLessonId, reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    scene.current = instance;
    lastGarden.current = garden;
    return () => { instance.dispose(); scene.current = null; };
  }, [Boolean(garden), profile]);

  useEffect(() => {
    if (garden && garden !== lastGarden.current && scene.current && !scene.current.failed) {
      scene.current.updateData(adaptGarden(garden), garden.rewards);
      lastGarden.current = garden;
    }
  }, [garden]);

  useEffect(() => {
    const onEscape = (event) => { if (event.key === "Escape") { if (lessonId) setLessonId(null); else if (showLeaderboard) setShowLeaderboard(false); } };
    window.addEventListener("keydown", onEscape); return () => window.removeEventListener("keydown", onEscape);
  }, [lessonId, showLeaderboard]);

  return <main className="little-grains-page"><header className="grains-header"><a className="grains-brand" href="/"><span className="grains-brand-mark">{BRAND_BADGE}</span><span>Little Grains<small>THE LEARNING GARDEN</small></span></a><div className="grains-header-actions"><span className="grains-header-label">Grow a little, every day</span><button className="grains-leaderboard-button" onClick={() => setShowLeaderboard(true)} aria-label="Open leaderboard"><span aria-hidden="true">♛</span><span className="grains-button-text">Leaderboard</span></button><AccountMenu /></div></header>
    <section className="grains-stage" aria-label="Learning garden"><div className="grains-garden-mount" ref={mount} />{!garden && !error && <div className="grains-stage-message" role="status">Planting your garden…</div>}{error && <div className="grains-stage-message" role="alert"><p>{error}</p><button onClick={() => { setError(""); refresh().catch((err) => setError(err.message)); }}>Try again</button></div>}{garden?.themes.length === 0 && <div className="grains-stage-message"><h1>Your garden is ready</h1><p>Lessons will appear here when they are published.</p></div>}</section>
    {lessonId && <LessonReader key={lessonId} lessonId={lessonId} onClose={() => setLessonId(null)} onProgress={refresh} />}
    {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
  </main>;
}
