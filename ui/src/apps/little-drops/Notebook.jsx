import { useEffect, useRef, useState } from 'react';
import { stops } from './content.js';
import { notebookMarkdown } from './notebook.js';
export default function Notebook({ discoveries, saved, onOpen, onReset }) {
  const [confirming, setConfirming] = useState(false), [notice, setNotice] = useState('');
  const confirmButton = useRef(null), resetButton = useRef(null);
  useEffect(() => { if (confirming) confirmButton.current?.focus(); }, [confirming]);
  function closeReset() { setConfirming(false); resetButton.current?.focus(); }
  function download() {
    try {
      const blob = new Blob([notebookMarkdown(discoveries)], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');a.href = url;a.download = 'little-drops-notebook.md';document.body.appendChild(a);a.click();a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice('Download requested. Your notebook stays on this device.');
    } catch { setNotice('This browser could not start the download. Your discoveries are still shown below.'); }
  }
  return <section className="ld-notebook" aria-labelledby="ld-notebook-title">
    <div className="ld-notebook-summary"><div><p className="ld-eyebrow">YOUR POCKET NOTEBOOK</p><h2 id="ld-notebook-title" tabIndex="-1">{discoveries.length} of 5 discoveries opened.</h2><p>A little more of the invisible, made visible.</p></div><div className="ld-notebook-drops" aria-hidden="true">{stops.map(s=><span key={s.id} className={discoveries.includes(s.id)?'found':''}>◒</span>)}</div></div>
    <ol className="ld-notebook-entries">{stops.map((s,i) => {
      const found = discoveries.includes(s.id);
      return <li key={s.id} className={found ? 'opened' : ''}><span className="ld-notebook-index">{found ? '✓' : String(i+1).padStart(2,'0')}</span><div><h3>{found ? s.title : s.short}</h3><p>{found ? s.wonder : 'Open this stop to add its discovery.'}</p></div><button onClick={()=>onOpen(i, found)} aria-label={`${found?'Revisit':'Explore'} ${s.short}`}>{found?'Revisit':'Explore'} <span aria-hidden="true">↗</span></button></li>;
    })}</ol>
    <div className="ld-notebook-actions"><button onClick={download} disabled={!discoveries.length}>Download notebook .md ↓</button><button ref={resetButton} disabled={!discoveries.length} onClick={()=>{setNotice('');setConfirming(true);}}>Clear discoveries</button></div>
    {confirming && <div className="ld-notebook-confirm" role="group" aria-label="Confirm clearing discoveries" onKeyDown={e=>{if(e.key==='Escape')closeReset();}}><p>Clear the discoveries opened in this browser? This does not delete any downloaded notebook. You can explore the stops again.</p><button ref={confirmButton} onClick={()=>{onReset();setConfirming(false);setNotice('Discoveries cleared in this browser.');document.getElementById('ld-notebook-title')?.focus();}}>Yes, clear discoveries</button><button onClick={closeReset}>Keep them</button></div>}
    <p className="ld-notebook-save" role="status">{notice && <>{notice} </>}{saved ? 'Saved in this browser only. Clearing site data removes these discoveries. Download a copy to keep it.' : 'Not saved: browser storage is unavailable. Discoveries will last only for this visit. Download a copy before leaving.'}</p>
  </section>;
}
