import { useEffect, useState } from 'react';
import StorageLab from './StorageLab.jsx';
import NetworkLab from './NetworkLab.jsx';
import CityScene from './CityScene.jsx';
import { stops, sources, treatmentSteps, pressureKpa, readDiscoveries, saveDiscoveries } from './content.js';
import './little-drops.css';

function localStorageSafe() { try { return window.localStorage; } catch { return null; } }
export default function LittleDrops({ onHome }) {
  const [selected,setSelected]=useState(0),[cutaway,setCutaway]=useState(false),[playing,setPlaying]=useState(false);
  const [height,setHeight]=useState(25),[experiment,setExperiment]=useState('pressure'),[stage,setStage]=useState(0);
  const [discoveries,setDiscoveries]=useState(()=>readDiscoveries(localStorageSafe()));
  const [revealed,setRevealed]=useState(false),[answer,setAnswer]=useState(null);
  const stop=stops[selected],treatment=treatmentSteps[stage];
  useEffect(()=>{document.title='Little Drops · The hidden life of a city';return()=>{document.title='Genious apps';};},[]);
  useEffect(()=>{setRevealed(false);setAnswer(null);if(selected===3)setCutaway(true);},[selected]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setSelected(current => { if (current >= stops.length - 1) return current; return current + 1; });
    }, 3700);
    return () => window.clearInterval(timer);
  }, [playing]);
  useEffect(() => { if (selected === stops.length - 1) setPlaying(false); }, [selected]);
  function discover(){const next=[...new Set([...discoveries,stop.id])];setDiscoveries(next);saveDiscoveries(localStorageSafe(),next);setRevealed(true);}
  function choose(i){setSelected(i);setPlaying(false);}
  return <main className="ld-app">
    <header className="ld-header"><button onClick={onHome} className="ld-back" aria-label="Back to gallery">← <span>Gallery</span></button><a href="/apps/little-drops" className="ld-brand"><span className="ld-brand-drop">◒</span> little drops<span className="ld-beta">FIELD NOTES 001</span></a><span className="ld-local">No account. Just curiosity.</span></header>
    <section className="ld-intro"><div><p className="ld-eyebrow">THE HIDDEN LIFE OF A CITY</p><h1>Follow something <em>small.</em><br/>Discover something big.</h1><p>A drop of water. An entire city behind it.<br className="ld-mobile-br"/> Take a look beneath the everyday.</p></div><div className="ld-edition"><span>01</span><p>RESERVOIR<br/>TO YOUR TAP</p><i>One ordinary miracle.</i></div></section>
    <section className="ld-world" aria-label="Water journey">
      <div className="ld-world-bar"><span><i className="ld-live-dot"/> A DROP'S JOURNEY</span><button className={cutaway?'ld-toggle active':'ld-toggle'} aria-pressed={cutaway} onClick={()=>setCutaway(v=>!v)}>{cutaway?'◉ Street peeled back':'◎ Peel back the street'}</button></div>
      <CityScene selected={selected} cutaway={cutaway} height={height} onSelect={choose}/>
      <div className="ld-route-controls"><button className="ld-play" onClick={()=>{if(!playing&&selected===4)setSelected(0);setPlaying(v=>!v);}} aria-label={playing?'Pause journey':'Play journey'}>{playing?'Ⅱ':'▶'} <span>{playing?'Pause':'Follow the drop'}</span></button><p>Tap a stop. Change the story.</p><span>{String(selected+1).padStart(2,'0')} / 05</span></div>
      <nav className="ld-stops" aria-label="Journey stops">{stops.map((s,i)=><button key={s.id} aria-current={selected===i?'step':undefined} onClick={()=>choose(i)}><span className="ld-stop-number">{discoveries.includes(s.id)?'✓':String(i+1).padStart(2,'0')}</span><span>{s.short}</span></button>)}</nav>
    </section>
    <div className="ld-below"><article className="ld-story" aria-live="polite"><p className="ld-eyebrow">{stop.kicker}</p><h2>{stop.title}</h2><p className="ld-story-text">{stop.text}</p><div className="ld-wonder"><span>?</span><p>{stop.wonder}</p></div><button className="ld-discover" onClick={discover}>{revealed?'Discovery opened':'Look a little closer'} <span>↗</span></button>{revealed&&<div className="ld-detail"><p>{stop.detail}</p><a href={sources[stop.source].url} target="_blank" rel="noreferrer">{sources[stop.source].label} ↗</a></div>}<div className="ld-story-nav"><button disabled={selected===0} onClick={()=>choose(selected-1)}>← Previous</button><button disabled={selected===4} onClick={()=>choose(selected+1)}>Next stop →</button></div></article>
    <section className="ld-lab" aria-labelledby="ld-lab-heading"><div className="ld-lab-head"><p className="ld-eyebrow">THE TINKERING TABLE</p><span>Try it yourself ↙</span></div><div className="ld-tabs" role="group" aria-label="Choose experiment"><button aria-pressed={experiment==='pressure'} onClick={()=>setExperiment('pressure')}>Height & pressure</button><button aria-pressed={experiment==='treatment'} onClick={()=>setExperiment('treatment')}>Inside treatment</button><button aria-pressed={experiment==='network'} onClick={()=>{setExperiment('network');setCutaway(true);}}>Valves & routes</button><button aria-pressed={experiment==='storage'} onClick={()=>setExperiment('storage')}>Storage & demand</button></div>
    {experiment==='storage'?<StorageLab/>:experiment==='network'?<NetworkLab/>:experiment==='pressure'?<><h2 id="ld-lab-heading">What if the tower were taller?</h2><p>Raise the water surface above the tap. Watch the ideal pressure change.</p><div className="ld-pressure-art"><div className="ld-gauge"><div style={{height:`${height/50*100}%`}}/><span>{height} m</span></div><div className="ld-pipe-drawing"/><div className="ld-pressure-value"><strong>{Math.round(pressureKpa(height))}</strong><span>kPa · ideal gauge pressure</span></div></div><label className="ld-slider-label" htmlFor="ld-height">Water surface above tap <output>{height} m</output></label><input id="ld-height" type="range" min="0" max="50" step="1" value={height} onChange={e=>setHeight(Number(e.target.value))}/><div className="ld-scale"><span>Same height</span><span>50 m above</span></div><p className="ld-model-note">A still-water model: P = ρgh, using ρ = 1,000 kg/m³ and g = 9.81 m/s². No friction, pumps or flowing-water losses. Not a plumbing design tool.</p><details><summary>Make a prediction</summary><p>Double the height above the same tap. What happens to the ideal pressure?</p><div className="ld-answers">{['It doubles','It stays the same'].map(a=><button key={a} onClick={()=>setAnswer(a)}>{a}</button>)}</div>{answer&&<p role="status">{answer==='It doubles'?'Yes. Pressure is proportional to height in this model.':'Try again: each extra metre adds the same amount of ideal pressure.'}</p>}</details><a className="ld-source" href={sources.pressure.url} target="_blank" rel="noreferrer">The physics, explained by OpenStax ↗</a></>:
    <><h2 id="ld-lab-heading">A filter does not work alone.</h2><p>Walk through a common treatment sequence. Each stage has a different job.</p><div className={`ld-treatment stage-${stage}`} aria-hidden="true">{Array.from({length:treatment.dots},(_,i)=><i key={i} style={{left:`${8+(i*29)%85}%`,top:`${stage===1?68+(i%3)*6:10+(i*17)%70}%`,width:treatment.size,height:treatment.size}}/>)}<span>{stage===3?'✦':'≈'}</span></div><div className="ld-treatment-steps">{treatmentSteps.map((s,i)=><button key={s.title} aria-pressed={stage===i} onClick={()=>setStage(i)}>{i+1}. {s.title}</button>)}</div><p aria-live="polite">{treatment.text}</p><p className="ld-model-note">Conceptual illustration. Dots represent particles, not a measured contaminant count. Real treatment depends on the source water. Do not use this as instructions to make water safe.</p><a className="ld-source" href={sources.treatment.url} target="_blank" rel="noreferrer">Read the treatment sequence at CDC ↗</a></>}
    </section></div>
    <section className="ld-notebook"><div><p className="ld-eyebrow">YOUR POCKET NOTEBOOK</p><h2>{discoveries.length} of 5 discoveries opened.</h2><p>A little more of the invisible, made visible.</p></div><div className="ld-notebook-drops" aria-label={`${discoveries.length} discoveries opened`}>{stops.map(s=><span key={s.id} className={discoveries.includes(s.id)?'found':''}>◒</span>)}</div></section>
    <footer className="ld-footer"><p>Little Drops · A playground for everyday wonders.</p><p>Independent. Front-end only. Discoveries saved on this device.</p><details><summary>Sources & model limits</summary><p>This fictional city illustrates one possible public water-supply journey, not a particular place. It is not a water-safety test. The explanations below were checked on 30 October 2026.</p>{Object.values(sources).map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}</details></footer>
  </main>;
}
