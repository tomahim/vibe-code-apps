import { useEffect, useState } from "react";
import { api } from "../api.js";
import { Markdown } from "../markdown.jsx";

// Total duels won, one bar per player, plus the number of ties as a separate
// gray bar (Thomas, 2026-11-09). Mirrors the backend rule (CHALLENGE_MIN_WIN,
// also used by the win badges): a win needs at least 3 correct AND strictly
// more than the other player - ties are not wins and never feed the badges.
// A tie is a revealed week where both players finished with the same correct
// score, whatever the score. Only weeks with an unlocked ranking count, so a
// duel still waiting on the other player never counts or leaks anything.
function ChallengeWinsChart({ weeks }) {
  const ranked = weeks.filter((w) => w.ranking);
  if (!ranked.length) return null;
  const tally = {};
  let ties = 0;
  for (const w of ranked) {
    const self = w.ranking.find((r) => r.is_self);
    const other = w.ranking.find((r) => !r.is_self);
    if (!self || !other) continue;
    if (self.correct === other.correct) ties++;
    for (const [name, mine, theirs] of [["You", self, other], [other.name, other, self]]) {
      if (!(name in tally)) tally[name] = 0;
      if (mine.correct >= 3 && mine.correct > theirs.correct) tally[name]++;
    }
  }
  const names = Object.keys(tally);
  if (!names.length) return null;
  const max = Math.max(1, ...Object.values(tally), ties);
  return <div className="grains-challenge-wins" role="img" aria-label="Challenges won in total, one bar per player, plus tied duels">
    <p className="grains-card-index">WINS</p>
    {names.map((name) => <div className="row" key={name}>
      <span className="name">{name}</span>
      <span className="track"><span className="bar" style={{ width: `${(tally[name] / max) * 100}%`, background: name === "You" ? "var(--blue)" : "var(--orange)" }} /></span>
      <b>{tally[name]}</b>
    </div>)}
    {ties > 0 && <div className="row">
      <span className="name">Ties</span>
      <span className="track"><span className="bar" style={{ width: `${(ties / max) * 100}%`, background: "var(--dim)" }} /></span>
      <b>{ties}</b>
    </div>}
  </div>;
}

// Past duels as one line per player (Thomas, 2026-11-09). The signed-in
// learner is the blue line, the other player orange - the same steering as
// the growth charts. The other player's score is plotted only for weeks whose
// ranking is unlocked, so an unfinished duel never leaks it.
function ChallengeHistoryChart({ weeks }) {
  const played = weeks.filter((w) => w.me?.finished);
  if (!played.length) return null;
  const width = 340, height = 170, padL = 26, padR = 10, padT = 8, padB = 24;
  const n = played.length;
  const x = (i) => padL + (n === 1 ? (width - padL - padR) / 2 : (i * (width - padL - padR)) / (n - 1));
  const max = Math.max(1, ...played.map((w) => w.size));
  const y = (v) => padT + (1 - v / max) * (height - padT - padB);
  const otherName = played.map((w) => w.ranking?.find((r) => !r.is_self)?.name).find(Boolean);
  const series = [
    { name: "You", color: "var(--blue)", w: 2.5, values: played.map((w) => w.me.correct) },
    ...(otherName ? [{ name: otherName, color: "var(--orange)", w: 1.5, values: played.map((w) => w.ranking?.find((r) => !r.is_self)?.correct ?? null) }] : []),
  ];
  return <div className="grains-challenge-chart">
    <div className="grains-challenge-chart-legend">{series.map((s) => <span key={s.name}><i style={{ background: s.color }} />{s.name}</span>)}</div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Past challenge weeks, one line per player">
      {[0, 0.5, 1].map((f) => <g key={f}><line className="grid" x1={padL} x2={width - padR} y1={y(max * f)} y2={y(max * f)} /><text className="tick" x={padL - 5} y={y(max * f) + 3} textAnchor="end">{Math.round(max * f)}</text></g>)}
      {played.map((w, i) => <text key={w.week_key} className="tick" x={x(i)} y={height - 6} textAnchor="middle">{w.week_key.replace(/^\d{4}-/, "")}</text>)}
      {series.map((s) => <g key={s.name}>
        {s.values.slice(1).map((v, i) => (v == null || s.values[i] == null) ? null
          : <polyline key={i} points={`${x(i)},${y(s.values[i])} ${x(i + 1)},${y(v)}`} fill="none" stroke={s.color} strokeWidth={s.w} strokeLinecap="round" />)}
        {s.values.map((v, i) => v == null ? null : <circle key={i} cx={x(i)} cy={y(v)} r={s.w + 1} fill={s.color} />)}
      </g>)}
    </svg>
  </div>;
}

// Per-question duel review (Thomas, 2026-11-09): after finishing, my
// right/wrong on each question with the correct answer on my misses; the
// other player's column appears only once the ranking is unlocked, so an
// unfinished duel never leaks their answers.
function ChallengeReview({ data, review, ranking }) {
  if (!review?.length) return null;
  const byId = Object.fromEntries((data.questions || []).map((q) => [q.id, q]));
  const other = ranking?.find((r) => !r.is_self)?.name;
  return <div className="grains-challenge-review">
    <p className="grains-card-index">QUESTION BY QUESTION</p>
    <div className="row head"><span className="prompt" /><b className="mark">You</b>{other && <b className="mark">{other}</b>}</div>
    {review.map((row, i) => {
      const q = byId[row.question_id];
      const correctText = q?.type === "type_answer_question" ? row.correct_answer
        : q?.options?.find((o) => o.id === row.correct_answer)?.text;
      return <div className="row" key={row.question_id}>
        <span className="prompt">{i + 1}. {q?.prompt || "Question"}
          {!row.mine && correctText && <small>Answer: {correctText}</small>}</span>
        <b className={`mark ${row.mine ? "ok" : "ko"}`}>{row.mine ? "✓" : "✗"}</b>
        {row.other != null && <b className={`mark ${row.other ? "ok" : "ko"}`}>{row.other ? "✓" : "✗"}</b>}
      </div>;
    })}
  </div>;
}

// The weekly Challenge (Thomas, 2026-11-08): 10 shared questions, 30 seconds
// each with auto-advance, the ranking locked until both players finished.
// Each answer gets immediate right/wrong feedback (Thomas, 2026-11-09).
function ChallengeSession({ onClose, onProgress }) {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState(null);
  const [queue, setQueue] = useState(null); // null: intro screen
  const [choice, setChoice] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [feedback, setFeedback] = useState(null); // the last answer's grading
  const [done, setDone] = useState(null);   // final payload (me + ranking + review)
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([api("challenge/"), api("challenge/history/")])
      .then(([week, past]) => { if (active) { setData(week); setHistory(past.weeks); } })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);

  const question = queue?.[0] || null;

  async function submit(answer) {
    try {
      const result = await api("challenge/answers/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question_id: question.id, answer }) });
      setFeedback(result);
    } catch (err) { setError(err.message); }
  }

  function advance() {
    const rest = queue.slice(1);
    const result = feedback;
    setFeedback(null);
    if (rest.length) { setQueue(rest); setChoice(""); setSecondsLeft(data.seconds_per_question); }
    else { setDone(result); onProgress(); }
  }

  // The 30-second clock: at zero the answer is recorded wrong. The clock
  // pauses on the feedback screen, which moves on with a tap.
  useEffect(() => {
    if (!question || done || feedback) return undefined;
    if (secondsLeft <= 0) { submit(""); return undefined; }
    const tick = setTimeout(() => setSecondsLeft((n) => n - 1), 1000);
    return () => clearTimeout(tick);
  }, [question, secondsLeft, done, feedback]);

  function start() {
    setQueue(data.questions.filter((q) => !q.answered));
    setChoice("");
    setSecondsLeft(data.seconds_per_question);
  }

  return <div className="grains-modal-backdrop">
    <section className="grains-reader" role="dialog" aria-modal="true" aria-label="Weekly challenge">
      <div className="grains-reader-top"><span className="grains-reader-kicker">Weekly Challenge{data ? ` · ${data.week_key}` : ""}</span><button className="grains-close" onClick={onClose} aria-label="Close challenge">×</button></div>
      {error && <p className="grains-error" role="alert">{error}</p>}
      {!data ? <p className="grains-loading">Gathering this week's duel…</p>
        : done ? <div className="grains-complete"><span aria-hidden="true">⚔</span><h3>Challenge complete</h3>
          <p>{done.me.correct} of {data.size} correct</p>
          {done.ranking
            ? <ol className="grains-challenge-ranking">{done.ranking.map((row) => <li key={row.rank} className={row.is_self ? "self" : ""}><b>#{row.rank}</b> {row.name} — {row.correct}/{data.size}</li>)}</ol>
            : <p>The ranking unlocks once both players have finished all {data.size} questions.</p>}
          <ChallengeReview data={data} review={done.review} ranking={done.ranking} />
          <button className="grains-primary" onClick={onClose}>Back to the garden</button></div>
        : question ? <>
          <div className="grains-reader-head"><p>CHALLENGE</p><h2>Question {data.size - queue.length + 1} of {data.size}</h2><span>{secondsLeft} second{secondsLeft === 1 ? "" : "s"} left</span></div>
          <div className="grains-progress-track grains-challenge-timer" aria-label={`${secondsLeft} seconds left`}><span style={{ width: `${(secondsLeft / data.seconds_per_question) * 100}%` }} /></div>
          <div className="grains-reader-content">
            <div className="grains-question">
              <p className="grains-card-index">{question.learning_path_title} · {question.lesson_title}</p>
              <h3>{question.prompt}</h3>
              {question.type === "type_answer_question" ? <div className="grains-typed-answer">
                <label htmlFor="grains-challenge-answer">Your answer</label>
                <textarea id="grains-challenge-answer" rows={3} maxLength={255} value={choice}
                  onChange={(event) => setChoice(event.target.value)} disabled={!!feedback}
                  autoCapitalize="sentences" autoComplete="off" spellCheck="true" />
              </div> : <div className="grains-options" role="radiogroup" aria-label="Choose an answer">{question.options.map((option) => {
                const correctId = feedback ? (feedback.correct ? choice : feedback.correct_answer) : null;
                const isCorrectOption = !!feedback && option.id === correctId;
                const isWrongPick = !!feedback && !feedback.correct && option.id === choice;
                return <label key={option.id} className={[choice === option.id ? "selected" : "", isCorrectOption ? "correct" : "", isWrongPick ? "wrong" : ""].join(" ").trim()}><input type="radio" name={`challenge-${question.id}`} value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} disabled={!!feedback} /><span>{option.text}</span>{isCorrectOption && <b className="mark ok">✓</b>}{isWrongPick && <b className="mark ko">✗</b>}</label>;
              })}</div>}
              {feedback ? <div className={`grains-feedback ${feedback.correct ? "correct" : "incorrect"}`} role="status">
                <strong>{feedback.correct ? feedback.carrot_earned ? "That’s right! +1 carrot" : "That’s right!" : "Not quite."}</strong>
                {!feedback.correct && feedback.correct_answer && question.type === "type_answer_question" && <p className="grains-correct-answer">An accepted answer: <b>{feedback.correct_answer}</b></p>}
                <Markdown source={feedback.explanation} />
                <button className="grains-primary" onClick={advance}>{queue.length > 1 ? "Next question →" : "See the result →"}</button>
              </div> : <button className="grains-primary" disabled={!choice.trim()} onClick={() => submit(choice)}>Lock it in →</button>}
            </div>
          </div></>
        : <div className="grains-reader-content">
          <div className="grains-quest-note">
            <p className="grains-card-index">CHALLENGE · {data.week_key}</p>
            <h2>This week's duel</h2>
            <p>{data.size} questions picked at random from the general-knowledge paths — read or not. {data.seconds_per_question} seconds each, and you see right away if you were right. Same questions for both players.</p>
            {data.me.answered > 0 && <p>You have answered {data.me.answered} of {data.size}.</p>}
            {data.size === 0
              ? <p>No duel questions available this week — check back once new general-knowledge questions arrive.</p>
              : data.me.finished
              ? <div>
                <p>You finished: {data.me.correct} of {data.size} correct.</p>
                {data.ranking
                  ? <ol className="grains-challenge-ranking">{data.ranking.map((row) => <li key={row.rank} className={row.is_self ? "self" : ""}><b>#{row.rank}</b> {row.name} — {row.correct}/{data.size}</li>)}</ol>
                  : <p>The ranking unlocks once both players have finished.</p>}
                <ChallengeReview data={data} review={data.review} ranking={data.ranking} />
              </div>
              : <button className="grains-primary" onClick={start}>{data.me.answered > 0 ? "Continue the challenge" : "Take the challenge"}</button>}
            {history?.length > 0 && <div className="grains-challenge-history"><p className="grains-card-index">PAST WEEKS</p>
              <ChallengeWinsChart weeks={history} />
              <ChallengeHistoryChart weeks={history} />
              {history.some((w) => !w.me?.finished) && <ul>{history.filter((w) => !w.me?.finished).map((week) => <li key={week.week_key}><b>{week.week_key}</b> — you: {week.me.correct}/{week.size} so far, unfinished</li>)}</ul>}
            </div>}
          </div>
        </div>}
    </section>
  </div>;
}

export { ChallengeSession };
