import { useCallback, useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { BRAND_BADGE } from "../../config/brand.js";
import { authFetch, clearToken, getToken } from "../../auth.js";
import AccountMenu from "../../components/AccountMenu.jsx";
import { createGarden } from "./garden/garden.js";
import "./garden/garden.css";
import "./little-grains.css";

const REWARD_COPY = {
  drops: {
    title: "How Drops are earned",
    description: "You earn 1 Drop when you first finish a card, 5 more when you have read every card in a lesson, and 100 more when you complete a learning path. Each reward is earned once.",
  },
  carrots: {
    title: "How Carrots are earned",
    description: "You earn 1 Carrot the first time you answer each question correctly, in a lesson or a Practice quiz. Wrong answers and repeated correct answers earn no extra Carrots.",
  },
};

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

function CardIllustration({ card }) {
  if (!card.illustration_url) return null;
  const srcset = (card.illustration_srcset || []).map((variant) => `${variant.url} ${variant.width}w`).join(", ");
  const credit = [card.illustration_credit, card.illustration_license].filter(Boolean).join(", ");
  return <figure className="grains-illustration">
    <img
      src={card.illustration_url}
      srcSet={srcset || undefined}
      sizes="(max-width: 660px) calc(100vw - 88px), 596px"
      width={card.illustration_width || undefined}
      height={card.illustration_height || undefined}
      loading="lazy"
      decoding="async"
      alt={card.illustration_alt || ""}
    />
    {(card.illustration_caption || credit) && <figcaption>
      {card.illustration_caption && <span className="grains-illustration-caption">{card.illustration_caption}</span>}
      {credit && (card.illustration_source_url
        ? <a className="grains-illustration-credit" href={card.illustration_source_url} target="_blank" rel="noopener noreferrer">Photo: {credit}</a>
        : <span className="grains-illustration-credit">Photo: {credit}</span>)}
    </figcaption>}
  </figure>;
}

function Markdown({ source }) {
  const html = DOMPurify.sanitize(marked.parse(source || ""));
  return <div className="grain-markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}

function nextReplayStep(data, step) {
  if (step.type === "card") {
    const card = data.cards.find((item) => item.id === step.id);
    const checkpoint = data.questions.find((item) => item.after_card_position === card?.position);
    if (checkpoint) return { type: "question", id: checkpoint.id };
  }
  const position = step.type === "card"
    ? data.cards.find((item) => item.id === step.id)?.position
    : data.questions.find((item) => item.id === step.id)?.after_card_position;
  const nextCard = data.cards.find((item) => item.position > position);
  return nextCard ? { type: "card", id: nextCard.id } : null;
}

function LessonReader({ lessonId, onClose, onProgress }) {
  const [data, setData] = useState(null);
  const [viewStep, setViewStep] = useState(null);
  const [replay, setReplay] = useState(false);
  const [returnStep, setReturnStep] = useState(null);
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
    setData(null); setReplay(false); setReturnStep(null); setFeedback(null); setChoice(""); setError("");
    api(`lessons/${lessonId}/open/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      .then(onProgress).catch(() => {});
    api(`lessons/${lessonId}/`).then((result) => { if (active) { setData(result); setReplay(result.lesson.progress.completed); setViewStep(result.lesson.progress.completed && result.cards.length ? { type: "card", id: result.cards[0].id } : result.next_step); } })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [lessonId, onProgress]);

  const card = data?.cards.find((item) => viewStep?.type === "card" && item.id === viewStep.id);
  const question = data?.questions.find((item) => viewStep?.type === "question" && item.id === viewStep.id);
  const typedQuestion = question?.type === "type_answer_question";
  const reviewCard = data?.cards.find((item) => viewStep?.type === "revisit" && item.id === viewStep.id);
  const cardIndex = data?.cards.findIndex((item) => item.id === (card || reviewCard)?.id) ?? -1;
  const previousCard = question
    ? data?.cards.find((item) => item.position === question.after_card_position && item.completed_at)
    : cardIndex > 0 && data.cards[cardIndex - 1].completed_at ? data.cards[cardIndex - 1] : null;
  const totalSteps = (data?.cards.length || 0) + (data?.questions.length || 0);
  const completedSteps = (data?.lesson.progress.cards_completed || 0) + (data?.lesson.progress.checkpoints_correct || 0);
  function openPreviousCard() {
    if (!previousCard) return;
    if (viewStep.type !== "revisit") setReturnStep(viewStep);
    setViewStep({ type: "revisit", id: previousCard.id });
  }

  async function completeCard() {
    if (!card || busy) return;
    if (replay) { setViewStep(nextReplayStep(data, viewStep)); return; }
    setBusy(true); setError("");
    try {
      await api(`cards/${card.id}/complete/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      await load(); await onProgress();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function submitAnswer() {
    if (!question || !choice.trim() || busy) return;
    setBusy(true); setError("");
    try {
      const result = await api("question-attempts/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question_id: question.id, answer: choice }) });
      setFeedback(result);
      if (result.correct) { await load(true); if (!replay) await onProgress(); }
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function continueAfterAnswer() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      if (replay) {
        await load(true);
        setViewStep(feedback.correct ? nextReplayStep(data, viewStep) : feedback.next_step);
      } else {
        await load();
      }
      setFeedback(null); setChoice("");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <div className="grains-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="grains-reader" role="dialog" aria-modal="true" aria-label={data?.lesson.title || "Lesson"}>
      <div className="grains-reader-top"><span className="grains-reader-kicker">{data?.theme.title || "Little Grains"} / {data?.learning_path.title || "Lesson"}</span><button className="grains-close" onClick={onClose} aria-label="Close lesson">×</button></div>
      {error && <p className="grains-error" role="alert">{error}</p>}
      {!data ? <p className="grains-loading">Opening lesson…</p> : <>
        <div className="grains-reader-head"><p>LESSON {data.lesson.position}</p><h2>{data.lesson.title}</h2><span>{completedSteps} of {totalSteps} steps complete</span></div>
        <div className="grains-progress-track" aria-label={`${completedSteps} of ${totalSteps} steps complete`}><span style={{ width: `${totalSteps ? completedSteps / totalSteps * 100 : 0}%` }} /></div>
        <div className="grains-reader-content">
          {data.lesson.introduction_markdown && <Markdown source={data.lesson.introduction_markdown} />}
          {card && <article className="grains-study-card">{previousCard && <button className="grains-text-button" onClick={openPreviousCard}>← Previous card</button>}<p className="grains-card-index">CARD {card.position} OF {data.cards.length}</p><h3>{card.title}</h3><CardIllustration card={card} /><Markdown source={card.body_markdown} /><button className="grains-primary" disabled={busy} onClick={completeCard}>{busy ? "Saving…" : "I’ve read this card →"}</button></article>}
          {question && <div className="grains-question">
            {previousCard && <button className="grains-text-button" disabled={!!feedback || busy} onClick={openPreviousCard}>← Previous card</button>}
            <p className="grains-card-index">{typedQuestion ? "TYPE YOUR ANSWER" : "CHECK YOUR UNDERSTANDING"}</p>
            <h3>{question.prompt}</h3>
            {typedQuestion ? <div className="grains-typed-answer">
              <label htmlFor={`grains-answer-${question.id}`}>Your answer</label>
              <textarea id={`grains-answer-${question.id}`} rows={3} maxLength={255} value={choice}
                onChange={(event) => setChoice(event.target.value)} disabled={!!feedback}
                autoCapitalize="sentences" autoComplete="off" spellCheck="true" />
              <p>Capitalization and punctuation do not have to match.</p>
            </div> : <div className="grains-options" role="radiogroup" aria-label="Choose an answer">{question.options.map((option) => <label key={option.id} className={choice === option.id ? "selected" : ""}><input type="radio" name={`question-${question.id}`} value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} disabled={!!feedback} /><span>{option.text}</span></label>)}</div>}
            {feedback ? <div className={`grains-feedback ${feedback.correct ? "correct" : "incorrect"}`} role="status">
              <strong>{feedback.correct ? feedback.carrot_earned ? "That’s right! +1 carrot" : "That’s right!" : feedback.next_step?.id !== question.id ? "Not quite. Let’s try another question." : "Not quite. Try again."}</strong>
              {!feedback.correct && feedback.correct_answer && <p className="grains-correct-answer">An accepted answer: <b>{feedback.correct_answer}</b></p>}
              <Markdown source={feedback.explanation} />
              <button className="grains-primary" disabled={busy} onClick={continueAfterAnswer}>{busy ? "Loading…" : feedback.correct ? "Continue →" : feedback.next_step?.id !== question.id ? "Try another question" : "Try again"}</button>
            </div> : <button className="grains-primary" disabled={!choice.trim() || busy} onClick={submitAnswer}>{busy ? "Checking…" : "Check answer"}</button>}
          </div>}
          {!viewStep && <div className="grains-complete"><span aria-hidden="true">✿</span><h3>Lesson in bloom</h3><p>All cards read and questions answered. Your garden has grown.</p><button className="grains-primary" onClick={onClose}>Back to the garden</button></div>}
          {reviewCard && <article className="grains-study-card"><div className="grains-review-nav">{previousCard && <button className="grains-text-button" onClick={openPreviousCard}>← Previous card</button>}<button className="grains-text-button" onClick={() => { setViewStep(returnStep || data.next_step); setReturnStep(null); }}>Return to next step →</button></div><p className="grains-card-index">CARD {reviewCard.position} OF {data.cards.length} · ALREADY READ</p><h3>{reviewCard.title}</h3><CardIllustration card={reviewCard} /><Markdown source={reviewCard.body_markdown} /></article>}
        </div>
      </>}
    </section>
  </div>;
}

function PracticeQuiz({ pathId, pathTitle, onClose, onProgress }) {
  const [data, setData] = useState(null);
  const [queue, setQueue] = useState([]);
  const [tries, setTries] = useState({});
  const [solved, setSolved] = useState(0);
  const [total, setTotal] = useState(0);
  const [choice, setChoice] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api(`paths/${pathId}/catch-up/`)
      .then((result) => { if (active) { setData(result); setQueue(result.questions); setTotal(result.questions.length); } })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [pathId]);

  const question = queue[0] || null;
  const typedQuestion = question?.type === "type_answer_question";

  async function submitAnswer() {
    if (!question || !choice.trim() || busy) return;
    setBusy(true); setError("");
    try {
      const result = await api("question-attempts/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question_id: question.id, answer: choice }) });
      setFeedback(result);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  function advance() {
    if (!question || !feedback) return;
    const used = (tries[question.id] || 0) + 1;
    setTries((current) => ({ ...current, [question.id]: used }));
    const rest = queue.slice(1);
    if (feedback.correct) { setSolved((n) => n + 1); setQueue(rest); }
    else setQueue(used < 2 ? [...rest, question] : rest); // One re-queue; after two wrong passes it waits for next time.
    setFeedback(null); setChoice("");
  }

  function finish() { onProgress(); onClose(); }

  const left = total - solved;
  return <div className="grains-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) finish(); }}>
    <section className="grains-reader" role="dialog" aria-modal="true" aria-label={`Practice quiz - ${pathTitle}`}>
      <div className="grains-reader-top"><span className="grains-reader-kicker">Practice quiz · {pathTitle}</span><button className="grains-close" onClick={finish} aria-label="Close quiz">×</button></div>
      {error && <p className="grains-error" role="alert">{error}</p>}
      {!data ? <p className="grains-loading">Gathering your questions…</p> : total === 0 ? <div className="grains-complete"><span aria-hidden="true">✿</span><h3>No questions available yet</h3><p>Read every card in a lesson to practice its questions.</p><button className="grains-primary" onClick={finish}>Back to the garden</button></div>
        : !question ? <div className="grains-complete"><span aria-hidden="true">🌱</span><h3>Quiz complete</h3><p>{solved} of {total} answered correctly{left > 0 ? ` · ${left} left to grow` : ""}</p><button className="grains-primary" onClick={finish}>Back to the garden</button></div>
        : <>
          <div className="grains-reader-head"><p>PRACTICE QUIZ</p><h2>{queue.length} question{queue.length === 1 ? "" : "s"} to go</h2><span>{solved} answered correctly this round</span></div>
          <div className="grains-progress-track" aria-label={`${solved} of ${total} questions answered correctly`}><span style={{ width: `${total ? (solved / total) * 100 : 0}%` }} /></div>
          <div className="grains-reader-content">
            <div className="grains-question">
              <p className="grains-card-index">{question.lesson_title} · {typedQuestion ? "TYPE YOUR ANSWER" : "CHECK YOUR UNDERSTANDING"}</p>
              <h3>{question.prompt}</h3>
              {typedQuestion ? <div className="grains-typed-answer">
                <label htmlFor={`grains-quiz-answer-${question.id}`}>Your answer</label>
                <textarea id={`grains-quiz-answer-${question.id}`} rows={3} maxLength={255} value={choice}
                  onChange={(event) => setChoice(event.target.value)} disabled={!!feedback}
                  autoCapitalize="sentences" autoComplete="off" spellCheck="true" />
                <p>Capitalization and punctuation do not have to match.</p>
              </div> : <div className="grains-options" role="radiogroup" aria-label="Choose an answer">{question.options.map((option) => <label key={option.id} className={choice === option.id ? "selected" : ""}><input type="radio" name={`quiz-${question.id}`} value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} disabled={!!feedback} /><span>{option.text}</span></label>)}</div>}
              {feedback ? <div className={`grains-feedback ${feedback.correct ? "correct" : "incorrect"}`} role="status">
                <strong>{feedback.correct ? feedback.carrot_earned ? "That’s right! +1 carrot" : "That’s right!" : (tries[question.id] || 0) >= 1 ? "Not quite. It will wait for the next quiz." : "Not quite. It comes back at the end of this quiz."}</strong>
                {!feedback.correct && feedback.correct_answer && <p className="grains-correct-answer">An accepted answer: <b>{feedback.correct_answer}</b></p>}
                <Markdown source={feedback.explanation} />
                <button className="grains-primary" onClick={advance}>Continue →</button>
              </div> : <button className="grains-primary" disabled={!choice.trim() || busy} onClick={submitAnswer}>{busy ? "Checking…" : "Check answer"}</button>}
            </div>
          </div>
        </>}
    </section>
  </div>;
}

function RewardInfo({ currency, onClose }) {
  const reward = REWARD_COPY[currency];
  return <div className="grains-reward-dismiss" onClick={onClose}>
    <section className="grains-reward-popover" role="dialog" aria-label={reward.title} onClick={(event) => event.stopPropagation()}>
      <div><span aria-hidden="true">{currency === "drops" ? "💧" : "🥕"}</span><h2>{reward.title}</h2><button onClick={onClose} aria-label="Close reward information">×</button></div>
      <p>{reward.description}</p>
    </section>
  </div>;
}


function niceCeil(value) {
  // Even maximum so the 0/mid/max gridlines always land on integers.
  const max = Math.max(2, Math.ceil(value));
  return max % 2 ? max + 1 : max;
}

function EvolutionChart({ chart, currency }) {
  if (!chart || !chart.buckets?.length || !chart.series?.length) return null;
  const width = 360, height = 190, padL = 30, padR = 34, padT = 14, padB = 26;
  const now = Date.now();
  // Never plot the future, and skip leading buckets where nobody had earned
  // anything yet - even if the API still sends the full calendar window.
  let end = chart.buckets.findIndex((b) => Date.parse(b.start) > now);
  if (end === -1) end = chart.buckets.length;
  let first = 0;
  while (first < end - 1 && chart.series.every((s) => !s.points[first])) first++;
  const buckets = chart.buckets.slice(first, end);
  const n = buckets.length;
  const pointsOf = (s) => s.points.slice(first, end);
  const max = niceCeil(Math.max(1, ...chart.series.flatMap((s) => pointsOf(s))));
  const x = (i) => padL + (n === 1 ? (width - padL - padR) / 2 : (i * (width - padL - padR)) / (n - 1));
  const y = (v) => padT + (1 - v / max) * (height - padT - padB);
  // Thomas's steering: the signed-in learner is always the blue line, every
  // other learner a thinner continuous orange one.
  const accent = "var(--blue)";
  const line = (points) => points.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const current = buckets.findIndex((b) => Date.parse(b.start) <= now && now < Date.parse(b.end));
  const self = chart.series.find((s) => s.is_self);
  const others = chart.series.filter((s) => !s.is_self);
  const ordered = [...others, ...(self ? [self] : [])];
  const colorOf = (s) => (s.is_self ? "var(--blue)" : "var(--orange)");
  const periodLabel = chart.period === "weekly" ? "day by day" : chart.period === "monthly" ? "week by week" : "month by month";
  const gridValue = (f) => max * f;
  return <section className="grains-chart">
    <div className="grains-chart-head"><h3>{currency === "drops" ? "💧" : "🥕"} Growth</h3><span>Cumulative · {periodLabel}</span></div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${currency} growth, ${periodLabel}`}>
      <defs><linearGradient id="grains-chart-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={accent} stopOpacity="0.22" /><stop offset="100%" stopColor={accent} stopOpacity="0" />
      </linearGradient></defs>
      {[0, 0.5, 1].map((f) => <g key={f}>
        <line x1={padL} x2={width - padR} y1={y(max * f)} y2={y(max * f)} className="grains-chart-grid" />
        <text x={padL - 6} y={y(max * f) + 3} className="grains-chart-y" textAnchor="end">{gridValue(f)}</text>
      </g>)}
      {current >= 0 && <line x1={x(current)} x2={x(current)} y1={padT} y2={height - padB} className="grains-chart-today" />}
      {self && <polygon className="grains-chart-area" points={`${x(0)},${y(0)} ${line(pointsOf(self))} ${x(n - 1)},${y(0)}`} />}
      {ordered.map((s) => <polyline key={s.name} className="grains-chart-line" style={{ color: colorOf(s) }} points={line(pointsOf(s))} strokeWidth={s.is_self ? 2.6 : 1.4} strokeLinecap="round" fill="none" />)}
      {self && pointsOf(self).map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === n - 1 ? 4 : 2.4} className="grains-chart-dot" style={{ color: accent }} />)}
      {others.map((s) => <circle key={`${s.name}-latest`} cx={x(n - 1)} cy={y(pointsOf(s)[n - 1])} r={2.6} className="grains-chart-dot" style={{ color: colorOf(s) }} />)}
      {self && <text x={x(n - 1) + 7} y={y(pointsOf(self)[n - 1]) + 3} className="grains-chart-total" style={{ color: accent }}>{pointsOf(self)[n - 1]}</text>}
      {buckets.map((b, i) => (n <= 8 || i % Math.ceil(n / 6) === 0 || i === n - 1) && <text key={`${b.label}-${i}`} x={x(i)} y={height - 8} className="grains-chart-x" textAnchor="middle">{b.label}</text>)}
    </svg>
    <ul className="grains-chart-legend">{ordered.map((s) => <li key={s.name}><span aria-hidden="true" style={{ background: colorOf(s) }}></span>{s.name}{s.is_self && <small>YOU</small>}</li>)}</ul>
  </section>;
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
      <p className="grains-reward-description">{REWARD_COPY[currency].description}</p>
      <div className="grains-period" aria-label="Ranking period">{["weekly", "monthly", "overall"].map((item) => <button key={item} className={period === item ? "active" : ""} onClick={() => setPeriod(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>
      {error && <p className="grains-error" role="alert">{error}</p>}
      {!data && !error && <p className="grains-loading">Gathering the rankings…</p>}
      {data && <><p className="grains-leaderboard-note">{period === "overall" ? "All time" : period === "weekly" ? "Resets every Monday" : "Resets on the 1st"} · UTC</p><ol className="grains-ranking">{data.rows.map((row) => <li key={`${row.rank}-${row.name}`} className={row.is_self ? "self" : ""}><span className="rank">{row.rank}</span><span className="avatar" aria-hidden="true">{row.name.slice(0, 1).toUpperCase()}</span><span className="name">{row.name}{row.is_self && <small>YOU</small>}</span><strong>{row.score}</strong></li>)}</ol>{data.rows.length === 0 && <p className="grains-empty-ranking">The first spot is waiting for you.</p>}<EvolutionChart chart={data.chart} currency={data.currency} /><div className="grains-self-rank"><span>Your {currency} rank</span><strong>{data.self?.rank ? `#${data.self.rank} · ${data.self.score} ${currency}` : currency === "drops" ? "Read a card to join" : "Answer a question to join"}</strong></div></>}
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
  const [catchUp, setCatchUp] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [rewardInfo, setRewardInfo] = useState(null);
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
    const instance = createGarden({ container: mount.current, profile, themes: adaptGarden(garden), rewards: garden.rewards, recentLessons: garden.recent_lessons || [], onOpenLesson: setLessonId, onRewardInfo: setRewardInfo, onPracticeQuiz: (pathId, pathTitle) => setCatchUp({ pathId, pathTitle }), reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    scene.current = instance;
    lastGarden.current = garden;
    return () => { instance.dispose(); scene.current = null; };
  }, [Boolean(garden), profile]);

  useEffect(() => {
    if (garden && garden !== lastGarden.current && scene.current && !scene.current.failed) {
      scene.current.updateData(adaptGarden(garden), garden.rewards, garden.recent_lessons || []);
      lastGarden.current = garden;
    }
  }, [garden]);

  useEffect(() => {
    const onEscape = (event) => { if (event.key === "Escape") { if (lessonId) setLessonId(null); else if (catchUp) setCatchUp(null); else if (showLeaderboard) setShowLeaderboard(false); else if (rewardInfo) setRewardInfo(null); } };
    window.addEventListener("keydown", onEscape); return () => window.removeEventListener("keydown", onEscape);
  }, [lessonId, catchUp, showLeaderboard, rewardInfo]);

  return <main className="little-grains-page"><header className="grains-header"><a className="grains-brand" href="/"><span className="grains-brand-mark">{BRAND_BADGE}</span><span>Little Grains<small>THE LEARNING GARDEN</small></span></a><div className="grains-header-actions"><span className="grains-header-label">Grow a little, every day</span><button className="grains-leaderboard-button" onClick={() => setShowLeaderboard(true)} aria-label="Open leaderboard"><span aria-hidden="true">♛</span><span className="grains-button-text">Leaderboard</span></button><AccountMenu /></div></header>
    <section className="grains-stage" aria-label="Learning garden"><div className="grains-garden-mount" ref={mount} />{!garden && !error && <div className="grains-stage-message" role="status">Planting your garden…</div>}{error && <div className="grains-stage-message" role="alert"><p>{error}</p><button onClick={() => { setError(""); refresh().catch((err) => setError(err.message)); }}>Try again</button></div>}{garden?.themes.length === 0 && <div className="grains-stage-message"><h1>Your garden is ready</h1><p>Lessons will appear here when they are published.</p></div>}{rewardInfo && <RewardInfo currency={rewardInfo} onClose={() => setRewardInfo(null)} />}</section>
    {lessonId && <LessonReader key={lessonId} lessonId={lessonId} onClose={() => setLessonId(null)} onProgress={refresh} />}
    {catchUp && <PracticeQuiz pathId={catchUp.pathId} pathTitle={catchUp.pathTitle} onClose={() => setCatchUp(null)} onProgress={refresh} />}
    {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
  </main>;
}
