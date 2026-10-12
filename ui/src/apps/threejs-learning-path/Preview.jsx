import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

const Preview = forwardRef(function Preview({ code, check, lessonId, autoRun, runKey, paused, onResult, onStats }, ref) {
  const iframe = useRef(null);
  const revision = useRef(0);
  const previousRun = useRef({});
  const callbacks = useRef({ onResult, onStats });
  const latest = useRef({ code, check, paused });
  const [ready, setReady] = useState(false);
  const [generation, setGeneration] = useState(0);
  callbacks.current = { onResult, onStats };
  latest.current = { code, check, paused };
  const token = useMemo(() => crypto.randomUUID(), [generation]);
  const srcDoc = useMemo(() => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' ${location.origin}; style-src 'unsafe-inline'; img-src data: blob:; connect-src data: blob:;"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#10141f}canvas{display:block;touch-action:none}</style></head><body><script>window.__LESSON_TOKEN__=${JSON.stringify(token)};<\/script><script src="${location.origin}${import.meta.env.BASE_URL}threejs-runtime.js"><\/script></body></html>`, [token]);
  const send = (message) => iframe.current?.contentWindow?.postMessage({ token, ...message }, '*');
  const execute = (nextRevision) => {
    callbacks.current.onResult({ pending: true });
    send({ type: 'run', ...latest.current, revision: nextRevision });
    send({ type: 'pause', paused: latest.current.paused });
  };
  useImperativeHandle(ref, () => ({
    resetCamera: () => send({ type: 'reset-camera' }),
    restart: () => { setReady(false); setGeneration((value) => value + 1); },
  }));
  useEffect(() => {
    const receive = (event) => {
      if (event.source !== iframe.current?.contentWindow || event.data?.token !== token) return;
      if (event.data.type === 'ready') setReady(true);
      if (event.data.type === 'fatal') callbacks.current.onResult({ error: event.data.error });
      if (event.data.revision !== revision.current) return;
      if (event.data.type === 'result') callbacks.current.onResult(event.data);
      if (event.data.type === 'stats') callbacks.current.onStats(event.data);
    };
    window.addEventListener('message', receive);
    const timeout = setTimeout(() => { if (!iframe.current?.dataset.ready) callbacks.current.onResult({ error: 'The preview could not start. Check your connection and use Restart preview.' }); }, 15000);
    return () => { window.removeEventListener('message', receive); clearTimeout(timeout); };
  }, [token]);
  useEffect(() => {
    const nextRevision = ++revision.current;
    if (!ready) { callbacks.current.onResult({ pending: true }); return; }
    const previous = previousRun.current;
    const immediate = previous.lessonId !== lessonId || previous.runKey !== runKey || previous.token !== token;
    previousRun.current = { lessonId, runKey, token };
    if (immediate) { execute(nextRevision); return; }
    callbacks.current.onResult({ dirty: true });
    if (!autoRun) return;
    const timeout = setTimeout(() => execute(nextRevision), 500);
    return () => clearTimeout(timeout);
  }, [ready, lessonId, runKey, code, check, autoRun, token]);
  useEffect(() => { if (ready) send({ type: 'pause', paused }); }, [paused, ready]);
  return <iframe ref={iframe} data-ready={ready ? 'true' : undefined} className="tl-preview-frame" title="Interactive Three.js scene" sandbox="allow-scripts" srcDoc={srcDoc} />;
});

export default Preview;
