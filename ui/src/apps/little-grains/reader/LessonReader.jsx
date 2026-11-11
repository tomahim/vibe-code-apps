import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api.js";
import { Markdown } from "../markdown.jsx";
import { CardIllustration } from "../CardIllustration.jsx";
import { stableShuffler } from "../shuffle.js";

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

function LessonComplete({ kind, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3400);
    return () => clearTimeout(timer);
  }, [onDone]);
  if (kind === "drops") {
    return <div className="grains-celebration drops" onClick={onDone} role="status">
      <div className="grains-rain" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6].map((i) => <span key={i} style={{ "--i": i }} />)}</div>
      <div className="grains-drop-badge" aria-hidden="true"><span className="grains-drop-ripple" /><span className="grains-drop-ripple two" /><span className="grains-drop-glyph" /></div>
      <p className="grains-celebration-count">+5 drops</p>
      <h3>Lesson finished!</h3>
      <p className="grains-celebration-sub">Every card read - your garden just grew.</p>
    </div>;
  }
  return <div className="grains-celebration reviewed" onClick={onDone} role="status">
    <span className="grains-bloom" aria-hidden="true">✿</span>
    <h3>Lesson reviewed!</h3>
    <p className="grains-celebration-sub">Nice refresher - this one stays in bloom.</p>
  </div>;
}

function LessonReader({ lessonId, initialStep = null, onClose, onStepChange, onLessonEnd }) {
  const [data, setData] = useState(null);
  const [viewStep, setViewStep] = useState(null);
  const [replay, setReplay] = useState(false);
  const [returnStep, setReturnStep] = useState(null);
  const [choice, setChoice] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Snapshot at open: did the server already consider this lesson complete?
  // Server-owned flag (#465), never recomputed from card timestamps. Drives
  // which celebration plays at the end - the +5 drops bonus is earned exactly
  // once, by the session that finishes reading the cards.
  const fullyReadAtOpen = useRef(null);
  const noteFullyRead = (result) => {
    if (fullyReadAtOpen.current === null) fullyReadAtOpen.current = !!result.lesson?.progress?.completed;
  };

  const load = useCallback(async (preserveStep = false) => {
    const result = await api(`lessons/${lessonId}/`);
    noteFullyRead(result);
    setData(result);
    if (!preserveStep) setViewStep(result.next_step);
    return result;
  }, [lessonId]);

  // The complete/answer POST responses already carry the post-save progress
  // and next_step, computed server-side in the same transaction. Apply them
  // locally instead of re-downloading the whole lesson: on a card read or a
  // correct answer the content of every upcoming step is already on screen's
  // data (only a wrong answer can rotate in an unseen question - handled in
  // continueAfterAnswer). The garden refreshes when the reader closes.
  function applyProgress(result) {
    setData((current) => current ? {
      ...current,
      lesson: { ...current.lesson, progress: result.progress ?? current.lesson.progress },
      cards: result.card_id
        ? current.cards.map((item) => item.id === result.card_id ? { ...item, completed_at: result.completed_at } : item)
        : current.cards,
      questions: result.question_id && result.correct
        ? current.questions.map((item) => item.id === result.question_id ? { ...item, completed: true } : item)
        : current.questions,
    } : current);
  }

  useEffect(() => {
    let active = true;
    setData(null); setReplay(false); setReturnStep(null); setFeedback(null); setChoice(""); setError("");
    api(`lessons/${lessonId}/open/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      .catch(() => {});
    api(`lessons/${lessonId}/`).then((result) => {
      if (!active) return;
      noteFullyRead(result); setData(result); setReplay(fullyReadAtOpen.current);
      // A deep-linked card/question id wins (#225). An already-read card
      // opens read-only; an unknown id falls back to the current step.
      let start = null;
      if (initialStep?.type === "card") {
        const linked = result.cards.find((item) => item.id === initialStep.id);
        if (linked) { start = linked.completed_at ? { type: "revisit", id: linked.id } : { type: "card", id: linked.id }; if (linked.completed_at) setReturnStep(result.next_step); }
      } else if (initialStep?.type === "question") {
        if (result.questions.some((item) => item.id === initialStep.id)) start = { type: "question", id: initialStep.id };
      }
      setViewStep(start || (fullyReadAtOpen.current && result.cards.length ? { type: "card", id: result.cards[0].id } : result.next_step));
    })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
    // initialStep is a mount-time deep link only; step moves stay local.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Keep the URL in sync with the reading step (#225): the parent pushes one
  // history entry when the reader opens, then replaces it from step to step.
  useEffect(() => {
    if (!data || !onStepChange) return;
    const step = !viewStep ? null : viewStep.type === "revisit" ? { type: "card", id: viewStep.id } : viewStep;
    onStepChange({ themeId: data.theme.id, pathId: data.learning_path.id, lessonId }, step);
  }, [data, viewStep, onStepChange, lessonId]);

  // Reaching the end screen (every step done) is the lesson-end moment:
  // report it once, whichever way the reader is left afterwards.
  const endReported = useRef(false);
  useEffect(() => {
    if (!endReported.current && data?.cards.length && viewStep === null) {
      endReported.current = true;
      onLessonEnd?.(fullyReadAtOpen.current ? "reviewed" : "drops");
    }
  }, [data, viewStep, onLessonEnd]);

  // Advancing a step ("I've read this card", "Continue →") swaps the content
  // while the reader stays scrolled at the bottom; bring the new step's top
  // into view instead of making the reader scroll back up (Thomas, 2026-11-10).
  const stepAnchor = useRef(null);
  const scrollToStep = useRef(false);
  useEffect(() => {
    if (!scrollToStep.current) return;
    scrollToStep.current = false;
    const anchor = stepAnchor.current;
    if (!anchor) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    anchor.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [viewStep, feedback]);

  const card = data?.cards.find((item) => viewStep?.type === "card" && item.id === viewStep.id);
  const question = data?.questions.find((item) => viewStep?.type === "question" && item.id === viewStep.id);
  // Shuffled once per question so the order stays stable while it is on screen.
  // Shuffle once per question id: a refetch after answering replaces the
  // question object, and identity-keying reshuffles the options on screen.
  const [shuffleOnce] = useState(() => stableShuffler());
  const questionOptions = useMemo(() => shuffleOnce(question), [question, shuffleOnce]);
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
    if (replay) { scrollToStep.current = true; setViewStep(nextReplayStep(data, viewStep)); return; }
    setBusy(true); setError("");
    try {
      const result = await api(`cards/${card.id}/complete/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      // Reading every card finishes the lesson (+5 drops, earned once), but a
      // checkpoint after the last card is still a lesson step: the server's
      // next_step serves it before the celebration, so the counter reaches the total.
      applyProgress(result);
      scrollToStep.current = true;
      setViewStep(result.next_step);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function submitAnswer() {
    if (!question || !choice.trim() || busy) return;
    setBusy(true); setError("");
    try {
      const result = await api("question-attempts/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question_id: question.id, answer: choice }) });
      setFeedback(result);
      if (result.correct) applyProgress(result);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function continueAfterAnswer() {
    if (busy) return;
    const step = replay
      ? (feedback.correct ? nextReplayStep(data, viewStep) : feedback.next_step)
      : feedback.next_step;
    // A wrong answer can rotate in a replacement question whose prompt and
    // options were never downloaded (only the selected question per checkpoint
    // ships at open). That is the one step that still needs a lesson refetch.
    const rotated = step?.type === "question" && !data.questions.some((item) => item.id === step.id);
    setBusy(true); setError("");
    try {
      if (rotated) await load(true);
      scrollToStep.current = true;
      setViewStep(step);
      setFeedback(null); setChoice("");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  // Focus mode sidebar (desktop only): every card with its read state, and a
  // jump back to any read card (read-only revisit) or to the current step.
  // Cards ahead of the current step stay locked so the lesson order holds.
  const viewedCardId = (card || reviewCard)?.id;
  function jumpToCard(target) {
    if (target.id === viewedCardId) return;
    const isNext = data.next_step?.type === "card" && data.next_step.id === target.id;
    if (target.completed_at) {
      if (viewStep.type !== "revisit") setReturnStep(viewStep);
      setViewStep({ type: "revisit", id: target.id });
    } else if (isNext) {
      setReturnStep(null);
      setViewStep({ type: "card", id: target.id });
    }
  }

  return <div className="grains-modal-backdrop grains-lesson-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="grains-reader grains-lesson-reader" role="dialog" aria-modal="true" aria-label={data?.lesson.title || "Lesson"}>
      <div className="grains-reader-top">
        <strong className="grains-lesson-number">{data ? `Lesson ${data.lesson.position}` : "Little Grains"}</strong>
        {data && <span className="grains-reader-count" aria-label={`${completedSteps} of ${totalSteps} steps complete`}>{completedSteps} / {totalSteps} steps</span>}
        <button className="grains-close" onClick={onClose} aria-label="Close lesson">×</button>
      </div>
      {data && <div className="grains-progress-track" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={totalSteps} aria-valuenow={completedSteps}><span style={{ width: `${totalSteps ? completedSteps / totalSteps * 100 : 0}%` }} /></div>}
      <div className="grains-lesson-body">
      {data && <aside className="grains-lesson-sidebar" aria-label="Cards in this lesson">
        <p className="grains-sidebar-kicker">In this lesson</p>
        <p className="grains-sidebar-progress">{completedSteps} of {totalSteps} steps</p>
        <ol className="grains-sidebar-cards">
          {data.cards.map((item) => {
            const state = item.id === viewedCardId ? "current" : item.completed_at ? "read" : data.next_step?.type === "card" && data.next_step.id === item.id ? "next" : "locked";
            return <li key={item.id}>
              <button type="button" className={`grains-sidebar-card ${state}`} disabled={state === "locked"} aria-current={state === "current" ? "true" : undefined}
                onClick={() => jumpToCard(item)}>
                <span className="grains-sidebar-card-icon" aria-hidden="true">{state === "read" ? "✓" : state === "current" ? "●" : state === "next" ? "→" : "·"}</span>
                <span className="grains-sidebar-card-title">{item.position}. {item.title}</span>
              </button>
            </li>;
          })}
        </ol>
      </aside>}
      <div className="grains-reader-content">
        {error && <p className="grains-error" role="alert">{error}</p>}
        {!data ? <p className="grains-loading">Opening lesson…</p> : <>
          <div className="grains-reader-head">
            <p className="grains-reader-kicker">{data.theme.title} / {data.learning_path.title}</p>
            <h2>{data.lesson.title}</h2>
            {data.lesson.introduction_markdown && <Markdown source={data.lesson.introduction_markdown} />}
          </div>
          {card && <article ref={stepAnchor} className="grains-study-card">{previousCard && <button className="grains-text-button" onClick={openPreviousCard}>← Previous card</button>}<p className="grains-card-index">CARD {card.position} OF {data.cards.length}</p><h3>{card.title}</h3><CardIllustration card={card} /><Markdown source={card.body_markdown} /><button className="grains-primary" disabled={busy} onClick={completeCard}>{busy ? "Saving…" : "I’ve read this card →"}</button></article>}
          {question && <div ref={stepAnchor} className="grains-question">
            {previousCard && <button className="grains-text-button" disabled={!!feedback || busy} onClick={openPreviousCard}>← Previous card</button>}
            <p className="grains-card-index">{typedQuestion ? "TYPE YOUR ANSWER" : "CHECK YOUR UNDERSTANDING"}</p>
            <h3>{question.prompt}</h3>
            {typedQuestion ? <div className="grains-typed-answer">
              <label htmlFor={`grains-answer-${question.id}`}>Your answer</label>
              <textarea id={`grains-answer-${question.id}`} rows={3} maxLength={255} value={choice}
                onChange={(event) => setChoice(event.target.value)} disabled={!!feedback}
                autoCapitalize="sentences" autoComplete="off" spellCheck="true" />
              <p>Capitalization and punctuation do not have to match.</p>
            </div> : <div className="grains-options" role="radiogroup" aria-label="Choose an answer">{questionOptions.map((option) => <label key={option.id} className={choice === option.id ? "selected" : ""}><input type="radio" name={`question-${question.id}`} value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} disabled={!!feedback} /><span>{option.text}</span></label>)}</div>}
            {feedback ? <div className={`grains-feedback ${feedback.correct ? "correct" : "incorrect"}`} role="status">
              <strong>{feedback.correct ? feedback.carrot_earned ? "That’s right! +1 carrot" : "That’s right!" : feedback.next_step?.id !== question.id ? "Not quite. Let’s try another question." : "Not quite. Try again."}</strong>
              {!feedback.correct && feedback.correct_answer && <p className="grains-correct-answer">An accepted answer: <b>{feedback.correct_answer}</b></p>}
              <Markdown source={feedback.explanation} />
              <button className="grains-primary" disabled={busy} onClick={continueAfterAnswer}>{busy ? "Loading…" : feedback.correct ? "Continue →" : feedback.next_step?.id !== question.id ? "Try another question" : "Try again"}</button>
            </div> : <button className="grains-primary" disabled={!choice.trim() || busy} onClick={submitAnswer}>{busy ? "Checking…" : "Check answer"}</button>}
          </div>}
          {!viewStep && <div ref={stepAnchor}>{data.cards.length
            ? <LessonComplete kind={fullyReadAtOpen.current ? "reviewed" : "drops"} onDone={onClose} />
            : <div className="grains-complete"><span aria-hidden="true">✿</span><h3>Lesson in bloom</h3><p>This lesson has no cards yet.</p><button className="grains-primary" onClick={onClose}>Back to the garden</button></div>}</div>}
          {reviewCard && <article ref={stepAnchor} className="grains-study-card"><div className="grains-review-nav">{previousCard && <button className="grains-text-button" onClick={openPreviousCard}>← Previous card</button>}<button className="grains-text-button" onClick={() => { setViewStep(returnStep || data.next_step); setReturnStep(null); }}>Return to next step →</button></div><p className="grains-card-index">CARD {reviewCard.position} OF {data.cards.length} · ALREADY READ</p><h3>{reviewCard.title}</h3><CardIllustration card={reviewCard} /><Markdown source={reviewCard.body_markdown} /></article>}
        </>}
      </div>
      </div>
    </section>
  </div>;
}

export { LessonReader };
