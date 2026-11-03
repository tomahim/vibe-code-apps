import { useEffect, useRef, useState } from 'react';
import { stops } from './content.js';
import { notebookMarkdown } from './notebook.js';
export default function Notebook({ discoveries, saved, onOpen, onReset }) {
  const [confirming, setConfirming] = useState(false), [notice, setNotice] = useState('');
  const confirmButton = useRef(null), resetButton = useRef(null);
  useEffect(() => { if (confirming) confirmButton.current?.focus(); }, [confirming]);
  function closeReset() { setConfirming(false); resetButton.current?.focus(); }
  function showCopy() { setNotice('copy'); }
  return <section className="ld-notebook" aria-labelledby="ld-notebook-title">
    <div className="ld-notebook-summary"><div><p className="ld-eyebrow">YOUR POCKET NOTEBOOK</p><h2 id="ld-notebook-title" tabIndex="-1">{discoveries.length} of 5 discoveries opened.</h2><p>A little more of the invisible, made visible.</p></div><div className="ld-notebook-drops" aria-hidden="true">{stops.map(s=><span key={s.id} className={discoveries.includes(s.id)?'found':''}>◒</span>)}</div></div>
    <ol className="ld-notebook-entries">{stops.map((s,i) => {
      const found = discoveries.includes(s.id);
      return <li key={s.id} className={found ? 'opened' : ''}><span className="ld-notebook-index">{found ? '✓' : String(i+1).padStart(2,'0')}</span><div><h3>{found ? s.title : s.short}</h3><p>{found ? s.wonder : 'Open this stop to add its discovery.'}</p></div><button onClick={()=>onOpen(i, found)} aria-label={`${found?'Revisit':'Explore'} ${s.short}`}>{found?'Revisit':'Explore'} <span aria-hidden="true">↗</span></button></li>;
    })}</ol>
    <div className="ld-notebook-actions"><button onClick={showCopy} disabled={!discoveries.length}>Show notebook Markdown</button><button ref={resetButton} disabled={!discoveries.length} onClick={()=>{setNotice('');setConfirming(true);}}>Clear discoveries</button></div>
    {confirming && <div className="ld-notebook-confirm" role="group" aria-label="Confirm clearing discoveries" onKeyDown={e=>{if(e.key==='Escape')closeReset();}}><p>Clear the discoveries opened in this browser? This does not delete any copied notebook. You can explore the stops again.</p><button ref={confirmButton} onClick={()=>{onReset();setConfirming(false);setNotice('Discoveries cleared in this browser.');document.getElementById('ld-notebook-title')?.focus();}}>Yes, clear discoveries</button><button onClick={closeReset}>Keep them</button></div>}
    {notice==='copy'&&<label className="ld-notebook-copy">Select and copy your notebook<textarea readOnly rows="12" value={notebookMarkdown(discoveries)} onFocus={e=>e.target.select()}/></label>}
    <p className="ld-notebook-save" role="status">Discoveries last only for this visit. The archive does not use browser storage. Use Show notebook Markdown to copy a record before leaving.</p>
  </section>;
}
