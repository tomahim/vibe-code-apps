import { useId, useMemo, useState } from 'react';
import { demandCycle, runStorageCycle } from './storage.js';
import { sources } from './content.js';
export default function StorageLab() {
  const [capacity, setCapacity] = useState(12), [pump, setPump] = useState(5), [step, setStep] = useState(0);
  const cycle = useMemo(() => runStorageCycle(capacity, pump), [capacity, pump]);
  const result = step ? cycle[step - 1] : null;
  const level = result ? result.level : capacity / 2;
  const totalShortage = cycle.slice(0, step).reduce((sum, row) => sum + row.shortage, 0);
  const totalOverflow = cycle.slice(0, step).reduce((sum, row) => sum + row.overflow, 0);
  const done = step === demandCycle.length;
  const chartTitle = useId(), chartDesc = useId();
  function configure(setter, value) { setter(value); setStep(0); }
  return <>
    <h2>The city wakes. The tank steps in.</h2>
    <p>A pump adds the same amount each step. The city does not use the same amount. What happens during the morning rush?</p>
    <div className="ld-storage-controls">
      <label htmlFor="ld-capacity">Tank capacity <output>{capacity} units</output></label><input id="ld-capacity" type="range" min="4" max="20" step="2" value={capacity} onChange={e => configure(setCapacity, Number(e.target.value))}/>
      <label htmlFor="ld-pump">Pump inflow per step <output>{pump} units</output></label><input id="ld-pump" type="range" min="0" max="8" step="1" value={pump} onChange={e => configure(setPump, Number(e.target.value))}/>
      <p>Starts half full. Changing a slider restarts the experiment.</p>
    </div>
    <div className="ld-storage-scene"><div className="ld-storage-tank" aria-hidden="true"><div style={{height:`${100*level/capacity}%`}}/><span>{level}<small> / {capacity}</small></span></div><div className="ld-storage-reading"><p className="ld-eyebrow">{result ? result.label.toUpperCase() : 'BEFORE THE FIRST STEP'}</p><strong>{level} <span>units in storage</span></strong><p>{result ? `Pump +${pump} · Delivered −${result.delivered}${result.overflow ? ` · Overflow −${result.overflow}` : ''}` : 'The starting reserve is half the tank capacity.'}</p></div></div>
    <div className="ld-storage-actions"><button className="ld-discover" disabled={done} onClick={() => setStep(s => Math.min(demandCycle.length, s + 1))}>{done ? 'Cycle complete' : `Next: ${demandCycle[step].label}`} <span>{step} / 6 →</span></button><button className="ld-network-reset" onClick={() => setStep(0)}>Restart cycle</button></div>
    <p className={`ld-storage-status ${totalShortage ? 'shortage' : ''}`} role="status">{!step ? 'Ready. Advance one step to see the water balance.' : `Step ${step} of 6. ${totalShortage ? `${totalShortage} ${totalShortage === 1 ? 'unit' : 'units'} of demand unmet so far.` : 'All demand met so far.'} ${totalOverflow ? `${totalOverflow} units overflowed.` : 'No overflow.'}`}</p>
    <div className="ld-storage-chart-key"><span>▰ City demand</span><span>● Water left in tank</span></div>
    <svg className="ld-storage-chart" viewBox="0 0 360 150" role="img" aria-labelledby={`${chartTitle} ${chartDesc}`}>
      <title id={chartTitle}>Fictional demand cycle and storage history</title><desc id={chartDesc}>Six equal steps. Demand is 2, 3, 8, 7, 4 and 3 units. Dots show the water left in storage after each completed step. Exact results appear in the table below.</desc>
      {[0,10,20].map(tick => <g key={tick}><line x1="22" x2="350" y1={125-tick*5} y2={125-tick*5} stroke="#ccd9c6"/><text x="4" y={129-tick*5}>{tick}</text></g>)}
      {cycle.map((row, i) => <g key={row.label}><rect x={35+i*53} y={125-row.demand*5} width="22" height={row.demand*5} rx="3" fill={i<step?'#a1b99b':'#d5dfcc'}/><text x={46+i*53} y="145" textAnchor="middle">{i+1}</text>{i<step&&<circle cx={46+i*53} cy={125-row.level*5} r="5" fill="#226c65" stroke="#fafbf0" strokeWidth="2"/>}</g>)}
      {step>1&&<polyline points={cycle.slice(0,step).map((r,i)=>`${46+i*53},${125-r.level*5}`).join(' ')} stroke="#226c65" fill="none" strokeWidth="2"/>}
    </svg>
    <details className="ld-storage-details"><summary>Show the balance, step by step</summary><p>Next storage = previous storage + pump inflow − delivered water − overflow. Unmet demand = requested − delivered. Water is never created by the tank.</p><div className="ld-storage-table-scroll"><table><caption>Completed steps in this fictional cycle</caption><thead><tr><th scope="col">Step</th><th scope="col">Demand</th><th scope="col">Stored</th><th scope="col">Unmet</th><th scope="col">Overflow</th></tr></thead><tbody>{cycle.slice(0,step).map((r,i)=><tr key={r.label}><th scope="row">{i+1}. {r.label}</th><td>{r.demand}</td><td>{r.level}</td><td>{r.shortage}</td><td>{r.overflow}</td></tr>)}</tbody></table></div></details>
    <div className="ld-storage-presets"><p>Compare two half-full tanks with the same pump:</p><button onClick={()=>{setCapacity(4);setPump(5);setStep(0);}}>Small tank · 4 units</button><button onClick={()=>{setCapacity(12);setPump(5);setStep(0);}}>Larger tank · 12 units</button></div>
    {done&&<p className="ld-storage-conclusion">{totalShortage ? 'This reserve could not cover every shortfall. Try more storage, or compare a different pump setting.' : 'The stored reserve covered the peaks in this particular cycle.'} A bigger tank cannot fix a permanent supply deficit.</p>}
    <p className="ld-model-note">Invented demand and arbitrary water units, not household measurements. Each step has equal duration. A simple volume balance, not a pressure, energy, water-quality or engineering model. Overflow is counted as discarded water. Real systems use controls and operating limits that are not simulated here.</p>
    <a className="ld-source" href={sources.storage.url} target="_blank" rel="noreferrer">Why systems store finished water · EPA ↗</a>
  </>;
}
