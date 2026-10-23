import { useEffect, useRef, useState } from 'react';
import { rust } from '@codemirror/lang-rust';
import { EditorView } from '@codemirror/view';
import CodeEditor from '../../components/CodeEditor.jsx';
import { chapters, lessons } from './catalog.js';
import { checkRun, diagnosticLocation, exercisesFor, prepareRun } from './checks.js';
import { runRust } from './runner.js';
import './rust-learning-path.css';

const language = rust();
const symbols = ['{', '}', '(', ')', '[', ']', '&', ';', ':', '<', '>', "'", '"'];
const hashLesson = () => lessons.findIndex((lesson) => `#${lesson.id}` === window.location.hash);

export default function RustLearningPath({ onHome }) {
  const [index, setIndex] = useState(() => Math.max(0, hashLesson()));
  const [step, setStep] = useState(0);
  const [drafts, setDrafts] = useState({});
  const [passed, setPassed] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const activeRun = useRef(null), editor = useRef(null);
  const lesson = lessons[index];
  const exercises = exercisesFor(lesson), exercise = exercises[step];
  const key = `${lesson.id}:${step}`;
  const code = drafts[key] ?? exercise.code;
  const isComplete = (item) => exercisesFor(item).every((_, n) => passed[`${item.id}:${n}`]);
  const completeCount = lessons.filter(isComplete).length;

  function invalidate() {
    activeRun.current?.abort(); activeRun.current = null;
    setRunning(false); setResult(null); setError('');
  }
  function selectLesson(next) {
    invalidate(); setIndex(next); setStep(0); setHint(false); setSolution(false);
    window.history.replaceState({}, '', `#${lessons[next].id}`);
  }
  useEffect(() => {
    const onHash = () => { const next = hashLesson(); if (next >= 0) selectLesson(next); };
    window.addEventListener('hashchange', onHash);
    return () => { window.removeEventListener('hashchange', onHash); activeRun.current?.abort(); };
  }, []);
  function edit(value) {
    invalidate();
    setDrafts((previous) => ({ ...previous, [key]: value }));
    setPassed((previous) => ({ ...previous, [key]: false }));
  }
  async function run() {
    if (activeRun.current) return;
    const controller = new AbortController(); activeRun.current = controller;
    setRunning(true); setError(''); setResult(null);
    setPassed((previous) => ({ ...previous, [key]: false }));
    try {
      const output = await runRust({ ...prepareRun(exercise, code), signal: controller.signal });
      if (activeRun.current !== controller) return;
      const success = checkRun(exercise.check, output, code);
      setResult({ ...output, passed: success });
      setPassed((previous) => ({ ...previous, [key]: success }));
    } catch (failure) {
      if (activeRun.current === controller) setError(failure.message);
    } finally {
      if (activeRun.current === controller) { activeRun.current = null; setRunning(false); }
    }
  }
  function jump(location) {
    const view = editor.current;
    if (!view || location.line < 1 || location.line > view.state.doc.lines) return;
    const line = view.state.doc.line(location.line);
    const position = Math.min(line.to, line.from + location.column - 1);
    view.dispatch({ selection: { anchor: position }, effects: EditorView.scrollIntoView(position, { y: 'center' }) });
    view.focus();
  }
  function insertSymbol(symbol) {
    const view = editor.current;
    if (!view) return;
    view.dispatch(view.state.replaceSelection(symbol)); view.focus();
  }
  function next() {
    if (step < exercises.length - 1) {
      invalidate(); setStep(step + 1); setHint(false); setSolution(false);
    } else if (index < lessons.length - 1) selectLesson(index + 1);
  }

  return <main className="rust-app">
    <header className="rust-header">
      <button className="rust-home" onClick={onHome} aria-label="Back to app gallery">← <span>The tool shed</span></button>
      <a className="rust-brand" href="/apps/rust-learning-path"><span aria-hidden="true">🦀</span> Rust workshop <small>LEARNING PATH</small></a>
      <span className="rust-edition">Rust 2021 <span>· stable</span></span>
    </header>
    <div className="rust-layout">
      <aside className="rust-map" aria-label="Course map">
        <p className="rust-eyebrow">A LITTLE EVERY DAY</p>
        <h2>Think in Rust.</h2>
        <p className="rust-map-intro">Small steps. Real code.<br />A different way to build.</p>
        <div className="rust-progress"><span>{completeCount} / {lessons.length} lessons</span><span>{Math.round(completeCount / lessons.length * 100)}%</span></div>
        <progress aria-label="Course progress" value={completeCount} max={lessons.length} />
        <nav>{chapters.map((chapter) => <section key={chapter.id}>
          <h3><span>0{chapter.order}</span> {chapter.title}</h3>
          {lessons.filter((item) => item.chapterId === chapter.id).map((item) => <button key={item.id} onClick={() => selectLesson(lessons.indexOf(item))} aria-current={item.id === lesson.id ? 'step' : undefined}>
            <span className="rust-lesson-dot" aria-hidden="true">{isComplete(item) ? '✓' : '○'}</span><span>{item.title}<small>{item.minutes} min{item.diagnostic ? ' · 2 exercises' : ''}{isComplete(item) ? ' · complete' : ''}</small></span>
          </button>)}
        </section>)}</nav>
        <div className="rust-map-note"><span aria-hidden="true">↳</span> A four-lesson introduction for people who already code. Progress lasts for this visit.</div>
      </aside>
      <div className="rust-workspace">
        <section className="rust-lesson" aria-labelledby="lesson-title">
          <div className="rust-breadcrumb">{lesson.chapterTitle}<span>/</span>LESSON {String(index + 1).padStart(2, '0')}<span>·</span>{lesson.minutes} MIN</div>
          <h1 id="lesson-title">{lesson.title}</h1>
          <p className="rust-concept">{lesson.concept}</p>
          <div className="rust-body">{lesson.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <div className="rust-task"><span className="rust-task-icon" aria-hidden="true">↗</span><div><h2>Your turn{exercises.length > 1 ? ` · ${step === 0 ? '1. Read the error' : '2. Repair the move'}` : ''}</h2><p>{exercise.task}</p></div></div>
          <div className="rust-help"><button onClick={() => setHint(!hint)} aria-expanded={hint}>{hint ? 'Hide hint' : 'A little hint'}</button><a href={lesson.reference.url} target="_blank" rel="noreferrer">{lesson.reference.label}</a></div>
          {hint && <p className="rust-hint">{exercise.hint}</p>}
        </section>
        <div className="rust-lab">
          <section className="rust-editor-panel" aria-label="Code workspace">
            <div className="rust-panel-heading"><span><span className="rust-file-dot" /> main.rs</span><span>RUST</span></div>
            <div className="rust-symbols" aria-label="Rust symbols">{symbols.map((symbol) => <button key={symbol} aria-label={`Insert ${symbol}`} onMouseDown={(event) => event.preventDefault()} onClick={() => insertSymbol(symbol)}>{symbol}</button>)}</div>
            <CodeEditor key={key} value={code} onChange={edit} onRun={run} language={language} label="Lesson Rust editor" className="rust-code-editor" onReady={(view) => { editor.current = view; }} />
            <div className="rust-editor-tools"><button onClick={() => edit(exercise.code)}>Reset code</button><button onClick={() => setSolution(!solution)} aria-expanded={solution}>{solution ? 'Hide solution' : 'Show solution'}</button><span>{code.split('\n').length} lines</span></div>
            {solution && <div className="rust-solution"><pre>{exercise.solution}</pre><button onClick={() => { edit(exercise.solution); setSolution(false); }}>Load solution</button></div>}
          </section>
          <section className="rust-console" aria-label="Output console" aria-busy={running}>
            <div className="rust-panel-heading"><span>Output</span><span>{exercise.check.type === 'tests' ? 'CARGO TEST' : 'CARGO RUN'}</span></div>
            <div className="rust-output" aria-live="polite">
              {running ? <div className="rust-empty"><span className="rust-pulse">◌</span><h3>Asking the compiler…</h3><p>Most runs take a few seconds.</p></div> : error ? <div role="alert" className="rust-error">{error}</div> : result ? <>
                {result.stderr && <div className="rust-stderr"><h3>Compiler</h3><pre>{result.stderr.split('\n').map((line, n) => { const location = diagnosticLocation(line, code.split('\n').length); return <span key={n}>{location ? <button className="rust-diagnostic" onClick={() => jump(location)} aria-label={`Jump to line ${location.line}, column ${location.column}`}>{line}</button> : line}{'\n'}</span>; })}</pre></div>}
                {result.stdout && <div><h3>{exercise.check.type === 'tests' ? 'Tests' : 'Program output'}</h3><pre>{result.stdout}</pre></div>}
                {!result.stdout && !result.stderr && <p>No output.</p>}
              </> : <div className="rust-empty"><span aria-hidden="true">›_</span><h3>A conversation with the compiler.</h3><p>Edit your code, then press Run.<br />Your output will appear here.</p></div>}
            </div>
            {result && <div role="status" className={`rust-verdict ${result.passed ? 'is-pass' : 'is-fail'}`}><strong>{result.passed ? '✓ Check passed' : '↻ Not quite yet'}</strong><p>{result.passed ? (exercise.check.type === 'compile_error' ? 'You found E0382. Now let’s repair the move.' : 'Your code meets the exercise check.') : (!result.success ? 'Read the compiler output, adjust your code, and run again.' : exercise.check.type === 'stdout' ? `Expected output: ${JSON.stringify(exercise.check.expected.trim())}.${exercise.check.requires ? ' Use the concept in the task, too.' : ''}` : 'Make every exercise test pass, then try again.')}</p></div>}
          </section>
        </div>
        <div className="rust-runbar"><span>{running ? 'Compiling & checking…' : 'Make a change. See what happens.'}<small>Code runs on the public Rust Playground.</small></span><button className="rust-run" onClick={run} disabled={running}>{running ? 'Running…' : '▶ Run code'}<kbd>⌘ / Ctrl ↵</kbd></button></div>
        <footer className="rust-lesson-footer"><button disabled={index === 0 && step === 0} onClick={() => { if (step > 0) { invalidate(); setStep(step - 1); setHint(false); setSolution(false); } else selectLesson(index - 1); }}>← Previous</button><span>{completeCount === lessons.length ? 'All four lessons complete. Keep building!' : 'One concept at a time.'}</span><button disabled={!passed[key] || (index === lessons.length - 1 && step === exercises.length - 1)} onClick={next}>{step < exercises.length - 1 ? 'Repair the move →' : 'Next lesson →'}</button></footer>
      </div>
    </div>
  </main>;
}
