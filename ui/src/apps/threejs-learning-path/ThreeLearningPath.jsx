import { useEffect, useRef, useState } from 'react';
import { chapters, lessons, totalMinutes } from './catalog.js';
import { readProgress, writeProgress } from './progress.js';
import CodeEditor from './CodeEditor.jsx';
import { BRAND_NAME } from '../../config/brand.js';
import Preview from './Preview.jsx';
import './learning-path.css';

const ids = lessons.map((lesson) => lesson.id);
const number = (value) => String(value).padStart(2, '0');
function Icon({ name, size = 18, ...props }) {
  const paths = {
    cube: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5"/></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
    back: <path d="M19 12H5m6 6-6-6 6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m9 5 7 7-7 7"/>,
    code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20"/></>,
    play: <path d="m8 4 12 8-12 8V4Z"/>,
    pause: <><path d="M8 5v14M16 5v14"/></>,
    reset: <><path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></>,
    book: <><path d="M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3V4ZM12 6v15"/></>,
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4"/></>,
    close: <path d="m6 6 12 12M6 18 18 6"/>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 8.5a2.5 2.5 0 1 1 4 2c-1 .6-1.5 1-1.5 2.5M12 16v.1"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    external: <><path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.cube}</svg>;
}

function initialProgress() {
  let value;
  try { value = readProgress(localStorage, ids); } catch { value = readProgress({ getItem: () => null }, ids); }
  const hash = window.location.hash.slice(1);
  if (ids.includes(hash)) value.current = hash;
  return value;
}

function Modal({ title, onClose, children, wide = false }) {
  const dialog = useRef(null);
  useEffect(() => { dialog.current.showModal(); }, []);
  return <dialog className={`tl-modal ${wide ? 'tl-modal-wide' : ''}`} ref={dialog} onCancel={onClose} onClick={(event) => { if (event.target === dialog.current) onClose(); }}>
    <div className="tl-modal-title"><h2>{title}</h2><button className="tl-icon-button" aria-label="Close dialog" onClick={onClose}><Icon name="close" /></button></div>
    {children}
  </dialog>;
}

export default function ThreeLearningPath({ onHome }) {
  const [progress, setProgress] = useState(initialProgress);
  const [saved, setSaved] = useState(true);
  const [search, setSearch] = useState('');
  const [openChapters, setOpenChapters] = useState(() => [lessons.find((item) => item.id === progress.current)?.chapterId || chapters[0].id]);
  const [navOpen, setNavOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState('learn');
  const [result, setResult] = useState({ pending: true });
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [runKey, setRunKey] = useState(0);
  const [stats, setStats] = useState({ calls: 0, triangles: 0 });
  const [notice, setNotice] = useState('');
  const [finished, setFinished] = useState(false);
  const preview = useRef(null), viewer = useRef(null), lessonPanel = useRef(null);
  const latestProgress = useRef(progress);
  latestProgress.current = progress;
  const index = ids.indexOf(progress.current);
  const lesson = lessons[index];
  const code = progress.drafts[lesson.id] ?? lesson.code;
  const completed = progress.completed.includes(lesson.id);
  const answer = progress.answers[lesson.id];
  const quizPassed = answer === lesson.quiz.answer;
  const percent = Math.round(progress.completed.length / lessons.length * 100);
  const remainingMinutes = lessons.filter((item) => !progress.completed.includes(item.id)).reduce((sum, item) => sum + item.minutes, 0);

  useEffect(() => {
    const timeout = setTimeout(() => { try { setSaved(writeProgress(localStorage, progress)); } catch { setSaved(false); } }, 250);
    return () => clearTimeout(timeout);
  }, [progress]);
  useEffect(() => {
    const flush = () => { try { writeProgress(localStorage, latestProgress.current); } catch { /* The UI already reports unavailable storage. */ } };
    window.addEventListener('pagehide', flush);
    return () => { window.removeEventListener('pagehide', flush); flush(); };
  }, []);
  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (ids.includes(id)) setProgress((value) => ({ ...value, current: id }));
    };
    addEventListener('hashchange', onHashChange);
    return () => removeEventListener('hashchange', onHashChange);
  }, []);
  useEffect(() => {
    setTab('learn'); setHint(false); setChecked(false); setResult({ pending: true }); setStats({ calls: 0, triangles: 0 }); setPaused(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setOpenChapters((value) => [...new Set([...value, lesson.chapterId])]);
    lessonPanel.current?.scrollTo(0, 0);
    document.title = `${lesson.title} · Three.js learning path`;
  }, [lesson.id]);
  useEffect(() => () => { document.title = BRAND_NAME; }, []);
  useEffect(() => { if (notice) { const timer = setTimeout(() => setNotice(''), 4000); return () => clearTimeout(timer); } }, [notice]);

  function navigate(id) {
    if (!ids.includes(id)) return;
    window.history.replaceState({}, '', `${window.location.pathname}#${id}`);
    setProgress((value) => ({ ...value, current: id }));
    setNavOpen(false); setModal(null); setFinished(false);
  }
  function updateCode(value) {
    setResult({ dirty: true });
    setProgress((current) => ({ ...current, drafts: { ...current.drafts, [lesson.id]: value } }));
  }
  function complete() {
    if (!result.passed || !quizPassed) return;
    setProgress((value) => ({ ...value, completed: [...new Set([...value.completed, lesson.id])] }));
    if (index < lessons.length - 1) { setNotice('Lesson complete. A little further into 3D.'); navigate(ids[index + 1]); }
    else { setFinished(true); setModal('complete'); }
  }
  function exportCode() {
    const header = `// ${lesson.title} — Three.js learning path\n// Three.js r180. Workspace globals: THREE, scene, camera, renderer, controls.\n// Helpers: onFrame(({elapsed, delta}) => {}), onCleanup(fn), useCamera(camera),\n// pointer (Vector2 in NDC), raycaster, onPointer(eventName, fn), GLTFLoader.\n// Create these in your app, then run this code in an async setup function.\n// onFrame runs before renderer.render(scene, activeCamera).\n\n`;
    const url = URL.createObjectURL(new Blob([header, code], { type: 'text/javascript' }));
    const link = document.createElement('a'); link.href = url; link.download = `${lesson.id}.js`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice('Scene code exported.');
  }
  const filtered = chapters.map((chapter) => ({ ...chapter, lessons: chapter.lessons.filter((item) => `${item.title} ${item.concept} ${chapter.title}`.toLowerCase().includes(search.toLowerCase())) })).filter((chapter) => chapter.lessons.length);

  return <main className="tl-app">
    <header className="tl-header">
      <div className="tl-brand"><button className="tl-icon-button tl-mobile-menu" aria-label="Toggle learning path" onClick={() => setNavOpen(!navOpen)}><Icon name="menu" /></button><span className="tl-brand-symbol"><Icon name="cube" size={29} /></span><div><strong>Three.js<span className="tl-brand-dot"> /</span></strong><span className="tl-brand-caption">LEARNING PATH</span></div></div>
      <div className="tl-header-middle"><span className="tl-header-divider"/><span>A little code. A new dimension.</span></div>
      <div className="tl-header-actions"><button className="tl-text-button tl-overview-button" onClick={() => setModal('overview')}><Icon name="book" size={16} /> Course overview</button><span className="tl-save-state" title="Progress and drafts are stored on this device"><span className={saved ? 'tl-dot' : 'tl-dot tl-dot-warning'}/>{saved ? 'Progress saved' : 'Storage unavailable'}</span><button className="tl-home-button" onClick={onHome} title="Back to the app gallery"><Icon name="external" size={14} /><span>All apps</span></button></div>
    </header>

    <div className="tl-layout">
      {navOpen && <button className="tl-nav-scrim" aria-label="Close learning path" onClick={() => setNavOpen(false)} />}
      <aside className={`tl-course-nav ${navOpen ? 'is-open' : ''}`} aria-label="Learning path">
        <div className="tl-path-heading"><span className="tl-kicker">YOUR LEARNING PATH</span><span className="tl-path-count">{chapters.length} chapters</span></div>
        <div className="tl-course-progress"><div><strong>{percent}<small>%</small></strong><span>{progress.completed.length} of {lessons.length} lessons</span></div><div className="tl-progress-track" role="progressbar" aria-label="Course completion" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percent}%` }}/></div><p>{remainingMinutes ? `${remainingMinutes} minutes of discovery ahead` : 'Every lesson, one new dimension.'}</p></div>
        <label className="tl-search"><Icon name="search" size={15}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a lesson…" aria-label="Find a lesson"/>{search && <button aria-label="Clear lesson search" onClick={() => setSearch('')}><Icon name="close" size={13}/></button>}</label>
        <nav className="tl-chapter-list">
          {filtered.map((chapter) => {
            const fullChapter = chapters.find((item) => item.id === chapter.id);
            const done = fullChapter.lessons.filter((item) => progress.completed.includes(item.id)).length;
            const isOpen = search || openChapters.includes(chapter.id);
            return <section className={`tl-chapter ${lesson.chapterId === chapter.id ? 'is-current' : ''}`} key={chapter.id}>
              <button className="tl-chapter-button" aria-expanded={!!isOpen} onClick={() => setOpenChapters((value) => value.includes(chapter.id) ? value.filter((id) => id !== chapter.id) : [...value, chapter.id])}><span className={`tl-chapter-number ${done === fullChapter.lessons.length ? 'is-done' : ''}`}>{done === fullChapter.lessons.length ? <Icon name="check" size={13}/> : number(chapter.order)}</span><span>{chapter.title}<small>{done}/{fullChapter.lessons.length} lessons</small></span><Icon className={isOpen ? 'tl-chevron is-open' : 'tl-chevron'} name="chevron" size={12}/></button>
              {isOpen && <div className="tl-lesson-list">{chapter.lessons.map((item) => <button key={item.id} onClick={() => navigate(item.id)} aria-current={lesson.id === item.id ? 'step' : undefined} className={`tl-lesson-link ${lesson.id === item.id ? 'is-active' : ''} ${progress.completed.includes(item.id) ? 'is-complete' : ''}`}><span className="tl-lesson-marker">{progress.completed.includes(item.id) ? <Icon name="check" size={10}/> : lesson.id === item.id ? <span/> : null}</span><span>{item.title}</span><small>{item.minutes}m</small></button>)}</div>}
            </section>;
          })}
          {!filtered.length && <p className="tl-no-results">No lessons found. Try “camera”, “light”, or “texture”.</p>}
        </nav>
        <div className="tl-nav-footer"><span className="tl-footer-icon"><Icon name="spark" size={17}/></span><p>Small steps.<br/><strong>Extra dimensions.</strong></p><button className="tl-icon-button" aria-label="Open workspace guide" onClick={() => setModal('help')}><Icon name="help" size={16}/></button></div>
      </aside>

      <section className="tl-workspace">
        <header className="tl-lesson-header"><div><p><span>CHAPTER {number(lesson.chapterOrder)}</span><span className="tl-breadcrumb-slash">/</span>{lesson.chapterTitle}</p><h1>{lesson.title}</h1></div><div className="tl-lesson-navigation"><span>{number(index + 1)}<small> / {lessons.length}</small></span><button className="tl-icon-button" disabled={index === 0} onClick={() => navigate(ids[index - 1])} aria-label="Previous lesson"><Icon name="back" size={16}/></button><button className="tl-icon-button" disabled={index === lessons.length - 1} onClick={() => navigate(ids[index + 1])} aria-label="Next lesson"><Icon name="arrow" size={16}/></button></div></header>
        <div className="tl-studio">
          <div className="tl-canvas-column">
            <section className="tl-viewer" ref={viewer} aria-label="Scene viewer">
              <div className="tl-viewer-toolbar"><span><span className={`tl-dot ${paused ? 'is-paused' : ''}`}/>{paused ? 'PAUSED' : 'LIVE PREVIEW'}</span><div><button className="tl-icon-button" title={paused ? 'Resume animation' : 'Pause animation'} aria-label={paused ? 'Resume animation' : 'Pause animation'} onClick={() => setPaused(!paused)}><Icon name={paused ? 'play' : 'pause'} size={14}/></button><button className="tl-icon-button" title="Reset camera" aria-label="Reset camera" onClick={() => preview.current?.resetCamera()}><Icon name="reset" size={14}/></button><button className="tl-icon-button" title="Fullscreen preview" aria-label="Fullscreen preview" onClick={() => { if (document.fullscreenElement) document.exitFullscreen(); else viewer.current?.requestFullscreen?.().catch(() => setNotice('Fullscreen is unavailable in this browser.')); }}><Icon name="expand" size={14}/></button></div></div>
              <Preview ref={preview} lessonId={lesson.id} code={code} check={lesson.check} autoRun={autoRun} runKey={runKey} paused={paused} onResult={setResult} onStats={setStats}/>
              <div className="tl-viewer-bottom"><span>Drag to orbit <i/> Scroll to zoom</span><div className="tl-axes"><span className="axis-y">Y</span><span className="axis-x">X</span><span className="axis-z">Z</span><svg width="45" height="43" viewBox="0 0 45 43" aria-hidden="true"><path d="M23 26V6" stroke="#9fd7b5"/><path d="m23 26 16 8" stroke="#e99eac"/><path d="M23 26 7 35" stroke="#9bb6ff"/><circle cx="23" cy="26" r="2" fill="#b6bfcf"/></svg></div></div>
              {result.pending && <span className="tl-preview-loading">Building your scene…</span>}
            </section>
            <section className="tl-editor-panel" aria-label="Code editor">
              <div className="tl-editor-toolbar"><div className="tl-file-tab"><span>JS</span> scene.js <span className="tl-file-dot"/></div><div className="tl-editor-actions"><label className="tl-auto-run"><input type="checkbox" checked={autoRun} onChange={(event) => setAutoRun(event.target.checked)}/><span/>Auto-run</label><button className="tl-icon-button" aria-label="Export scene code" title="Export scene code" onClick={exportCode}><Icon name="download" size={15}/></button><button className="tl-icon-button" aria-label="Reset lesson code" title="Reset lesson code" onClick={() => setModal('reset')}><Icon name="reset" size={14}/></button><button className="tl-run-button" onClick={() => setRunKey((value) => value + 1)}><Icon name="play" size={11}/>Run<span>⌘ ↵</span></button></div></div>
              <CodeEditor key={lesson.id} value={code} onChange={updateCode} onRun={() => setRunKey((value) => value + 1)}/>
              {result.error && <div className="tl-runtime-error" role="alert"><strong>Let’s fix that.</strong><code>{result.error}</code><button onClick={() => preview.current?.restart()}>Restart preview</button></div>}
              <div className="tl-editor-status"><span className={result.error ? 'has-error' : ''}><span className={`tl-dot ${result.error ? 'tl-dot-error' : result.dirty ? 'is-paused' : ''}`}/>{result.error ? 'Check the error above' : result.pending ? 'Running…' : result.dirty ? autoRun ? 'Updating preview…' : 'Changes waiting · press Run' : 'Scene running'}</span><span>{stats.calls} calls <i/> {stats.triangles.toLocaleString()} triangles <i/> JavaScript</span></div>
            </section>
          </div>

          <aside className="tl-lesson-panel" aria-label="Interactive lesson">
            <div className="tl-panel-tabs" role="tablist" aria-label="Lesson panels"><button role="tab" aria-selected={tab === 'learn'} onClick={() => setTab('learn')}><Icon name="book" size={15}/>Learn</button><button role="tab" aria-selected={tab === 'practice'} onClick={() => setTab('practice')}><Icon name="code" size={15}/>Practice{result.passed && <span className="tl-tab-check"><Icon name="check" size={10}/></span>}</button><span><Icon name="clock" size={12}/>{lesson.minutes} min</span></div>
            <div className="tl-lesson-content" ref={lessonPanel} role="tabpanel">
              {tab === 'learn' ? <>
                <div className="tl-lesson-meta"><span>LESSON {number(index + 1)}</span><span className="tl-level">{lesson.chapterOrder <= 3 ? 'FOUNDATIONS' : lesson.chapterOrder <= 8 ? 'BUILDING SKILLS' : 'GOING FURTHER'}</span></div>
                <h2>{lesson.title}</h2><div className="tl-concept"><Icon name="cube" size={14}/>{lesson.concept}</div>
                <div className="tl-prose">{lesson.body.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
                {index === 0 && <div className="tl-first-note"><Icon name="spark" size={19}/><p><strong>Learn by changing things.</strong>Every lesson is a tiny experiment. Basic JavaScript helps; no 3D experience needed.</p></div>}
              </> : <><div className="tl-lesson-meta"><span>MAKE IT YOURS</span><span className="tl-level">HANDS ON</span></div><h2>Small change.<br/>See the difference.</h2><p className="tl-practice-intro">Edit the code, watch the scene, and put one new idea into practice.</p></>}

              <div className={`tl-exercise ${result.passed ? 'is-passed' : ''}`}><div className="tl-exercise-heading"><span><Icon name={result.passed ? 'check' : 'target'} size={16}/>{result.passed ? 'YOU GOT IT' : 'YOUR TURN'}</span><span>01</span></div><p>{lesson.task}</p><button className="tl-hint-button" aria-expanded={hint} onClick={() => setHint(!hint)}><Icon name="spark" size={13}/>{hint ? 'Hide hint' : 'A little hint'}<Icon name="chevron" size={11}/></button>{hint && <p className="tl-hint-text">{lesson.hint}</p>}</div>
              <button className={`tl-check-button ${result.passed ? 'is-passed' : ''}`} onClick={() => { setChecked(true); setTab('practice'); if (result.dirty || result.error) setRunKey((value) => value + 1); }}>{result.passed ? <><Icon name="check" size={15}/>Scene check passed</> : <><Icon name="play" size={13}/>Check my scene<Icon name="arrow" size={15}/></>}</button>
              {checked && !result.passed && <p className="tl-check-feedback" role="status">{result.error ? 'Fix the code error, then try again.' : result.pending || result.dirty ? 'Checking your scene…' : 'Not quite yet. Follow the exercise above, then try again. Interactive lessons also need a hover or click in the viewer.'}</p>}
              {(tab === 'practice' || result.passed || completed) && <section className="tl-quiz"><p className="tl-kicker">ONE QUICK CHECK</p><h3>{lesson.quiz.question}</h3><div role="radiogroup" aria-label={lesson.quiz.question}>{lesson.quiz.options.map((option, i) => <button key={option} role="radio" aria-checked={answer === i} className={`tl-quiz-option ${answer === i ? i === lesson.quiz.answer ? 'is-correct' : 'is-incorrect' : ''}`} onClick={() => setProgress((value) => ({ ...value, answers: { ...value.answers, [lesson.id]: i } }))}><span>{answer === i && i === lesson.quiz.answer ? <Icon name="check" size={11}/> : String.fromCharCode(65 + i)}</span>{option}</button>)}</div>{answer !== undefined && <p className={`tl-quiz-feedback ${quizPassed ? 'is-correct' : ''}`} role="status">{quizPassed ? lesson.quiz.explanation : 'Take another look at the concept and try again.'}</p>}</section>}
              <div className="tl-lesson-resources"><button onClick={() => setModal('solution')}>Show solution</button><a href={lesson.reference.url} target="_blank" rel="noreferrer">Three.js docs <Icon name="external" size={11}/></a></div>
              <button className="tl-workspace-guide" onClick={() => setModal('help')}><Icon name="help" size={13}/>What does the workspace provide?</button>
            </div>
            <footer className="tl-lesson-footer"><p>{completed ? <><Icon name="check" size={12}/>Lesson completed · revisit anytime</> : <><span className="tl-footer-step">{Number(!!result.passed) + Number(quizPassed)}/2</span>Complete the experiment and quick check</>}</p><button className="tl-complete-button" disabled={!result.passed || !quizPassed} onClick={complete}>{index === lessons.length - 1 ? 'Finish learning path' : 'Complete & continue'}<Icon name="arrow" size={17}/></button></footer>
          </aside>
        </div>
      </section>
    </div>
    {!saved && <div className="tl-storage-warning" role="alert">Your browser could not save progress. Keep this tab open or export your code before leaving.</div>}
    {notice && <div className="tl-toast" role="status"><Icon name="check" size={16}/>{notice}</div>}

    {modal === 'reset' && <Modal title="A fresh canvas?" onClose={() => setModal(null)}><p>Restore this lesson’s starter code. Your completion progress will stay saved.</p><div className="tl-modal-actions"><button className="tl-secondary-button" onClick={() => setModal(null)}>Keep my code</button><button className="tl-primary-button" onClick={() => { updateCode(lesson.code); setRunKey((value) => value + 1); setModal(null); }}>Reset code</button></div></Modal>}
    {modal === 'solution' && <Modal title="One way to solve it" onClose={() => setModal(null)}><p>{lesson.hint} You can load the working code and keep experimenting. For interaction lessons, also perform the hover or click in the viewer.</p><pre className="tl-solution-code">{lesson.solution}</pre><div className="tl-modal-actions"><button className="tl-secondary-button" onClick={() => setModal(null)}>Keep exploring</button><button className="tl-primary-button" onClick={() => { updateCode(lesson.solution); setRunKey((value) => value + 1); setModal(null); setTab('practice'); }}>Load solution</button></div></Modal>}
    {modal === 'help' && <Modal title="Your 3D workspace" onClose={() => setModal(null)}><p>The editor runs plain JavaScript with Three.js r180. It has a little scaffolding so each lesson can focus on one concept.</p><dl className="tl-api-list"><dt>THREE</dt><dd>The full Three.js library.</dd><dt>scene · camera · renderer · controls</dt><dd>A fresh scene, perspective camera, WebGL renderer, and OrbitControls for each run. Lighting is written in your code.</dd><dt>onFrame(callback)</dt><dd>Runs before rendering, with elapsed and delta time in seconds. The workspace resizes the canvas and updates controls.</dd><dt>onCleanup(callback)</dt><dd>Releases extra resources when a run ends. Scene geometry, materials, textures, and controls are cleaned up automatically.</dd><dt>pointer · raycaster · onPointer(type, callback)</dt><dd>Canvas-relative NDC coordinates, a raycaster, and automatically cleaned-up canvas event listeners.</dd><dt>useCamera(camera) · GLTFLoader</dt><dd>Switch the active camera or parse a glTF asset. Top-level await works inside the async lesson setup.</dd></dl><p>⌘/Ctrl + Enter runs the scene. Tab indents; Escape then Tab moves focus out of the editor. Edits auto-run after half a second. The sandbox cannot access your saved progress or load external assets.</p><p>Progress, answers, and code drafts are saved in this browser. They do not sync between devices. Export downloads a JavaScript snippet with the workspace API listed in its header.</p></Modal>}
    {modal === 'overview' && <Modal wide title="One small step into a bigger world." onClose={() => setModal(null)}><p className="tl-overview-intro">{lessons.length} bite-sized experiments. {chapters.length} chapters. About {Math.round(totalMinutes / 60 * 10) / 10} hours, at your own pace.<br/>Start with basic JavaScript. Build your 3D intuition as you go.</p><div className="tl-overview-grid">{chapters.map((chapter) => <button key={chapter.id} onClick={() => navigate(chapter.lessons.find((item) => !progress.completed.includes(item.id))?.id || chapter.lessons[0].id)}><span>{number(chapter.order)}<Icon name="arrow" size={15}/></span><strong>{chapter.title}</strong><p>{chapter.subtitle}</p><small>{chapter.lessons.length} lessons · {chapter.lessons.reduce((sum, item) => sum + item.minutes, 0)} min</small></button>)}</div></Modal>}
    {modal === 'complete' && <Modal title={percent === 100 ? 'A whole new dimension. Yours.' : 'Your little world is complete.'} onClose={() => setModal(null)}><div className="tl-graduation"><Icon name="spark" size={60}/></div><p>{percent === 100 ? `You completed all ${lessons.length} lessons. From your first cube to a world of your own, you have built a practical foundation in Three.js and 3D.` : `You’ve completed ${progress.completed.length} of ${lessons.length} lessons. Your final scene is ready, and the remaining experiments are waiting in the course map.`}</p><div className="tl-modal-actions"><button className="tl-secondary-button" onClick={exportCode}>Export your scene</button><button className="tl-primary-button" onClick={() => setModal('overview')}>{finished && percent === 100 ? 'Explore again' : 'View learning path'}</button></div></Modal>}
  </main>;
}
