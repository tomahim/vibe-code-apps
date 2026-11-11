import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { Markdown } from "../markdown.jsx";
import { stableShuffler } from "../shuffle.js";

// One quiz dialog for both entry points: the per-path Practice quiz and the
// cross-theme Review session. Same mechanism, same look (Thomas, 2026-11-08);
// only the fetch URL, the kicker and the per-question path label differ.
function QuizSession({ fetchUrl, kicker, label = kicker, heading = "PRACTICE QUIZ", lesson = null, onClose, onProgress }) {
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
    api(fetchUrl)
      .then((result) => { if (active) { setData(result); setQueue(result.questions); setTotal(result.questions.length); } })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [fetchUrl]);

  const question = queue[0] || null;
  const typedQuestion = question?.type === "type_answer_question";
  // Shuffled once per question so the order stays stable while it is on screen.
  // Shuffle once per question id: a refetch after answering replaces the
  // question object, and identity-keying reshuffles the options on screen.
  const [shuffleOnce] = useState(() => stableShuffler());
  const questionOptions = useMemo(() => shuffleOnce(question), [question, shuffleOnce]);

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
    <section className="grains-reader" role="dialog" aria-modal="true" aria-label={label}>
      <div className="grains-reader-top"><span className="grains-reader-kicker">{kicker}</span><button className="grains-close" onClick={finish} aria-label="Close quiz">×</button></div>
      {error && <p className="grains-error" role="alert">{error}</p>}
      {!data ? <p className="grains-loading">Gathering your questions…</p> : total === 0 ? <div className="grains-complete"><span aria-hidden="true">✿</span><h3>No questions available yet</h3><p>{lesson ? `Read every card of ${lesson.title} first to practice its questions.` : "Read every card in a lesson to practice its questions."}</p><button className="grains-primary" onClick={finish}>Back to the garden</button></div>
        : !question ? <div className="grains-complete"><span aria-hidden="true">🌱</span><h3>Quiz complete</h3><p>{solved} of {total} answered correctly{left > 0 ? ` · ${left} left to grow` : ""}</p><button className="grains-primary" onClick={finish}>Back to the garden</button></div>
        : <>
          <div className="grains-reader-head"><p>{heading}</p><h2>{queue.length} question{queue.length === 1 ? "" : "s"} to go</h2><span>{solved} answered correctly this round</span></div>
          <div className="grains-progress-track" aria-label={`${solved} of ${total} questions answered correctly`}><span style={{ width: `${total ? (solved / total) * 100 : 0}%` }} /></div>
          <div className="grains-reader-content">
            <div className="grains-question">
              <p className="grains-card-index">{question.learning_path_title ? `${question.learning_path_title} · ` : ""}{question.lesson_title} · {typedQuestion ? "TYPE YOUR ANSWER" : "CHECK YOUR UNDERSTANDING"}</p>
              <h3>{question.prompt}</h3>
              {typedQuestion ? <div className="grains-typed-answer">
                <label htmlFor={`grains-quiz-answer-${question.id}`}>Your answer</label>
                <textarea id={`grains-quiz-answer-${question.id}`} rows={3} maxLength={255} value={choice}
                  onChange={(event) => setChoice(event.target.value)} disabled={!!feedback}
                  autoCapitalize="sentences" autoComplete="off" spellCheck="true" />
                <p>Capitalization and punctuation do not have to match.</p>
              </div> : <div className="grains-options" role="radiogroup" aria-label="Choose an answer">{questionOptions.map((option) => <label key={option.id} className={choice === option.id ? "selected" : ""}><input type="radio" name={`quiz-${question.id}`} value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} disabled={!!feedback} /><span>{option.text}</span></label>)}</div>}
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

export { QuizSession };
