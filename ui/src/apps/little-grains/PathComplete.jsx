import { useEffect, useRef } from "react";
import "./path-complete.css";

export function PathComplete({ path, onDone }) {
  const done = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    done.current?.focus({ preventScroll: true });
    return () => { if (previous?.isConnected) previous.focus(); };
  }, []);
  return <div className="grains-path-backdrop">
    <section className="grains-path-complete" role="dialog" aria-modal="true" aria-labelledby="grains-path-title" aria-describedby="grains-path-description"
      onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); onDone(); } if (event.key === "Tab") { event.preventDefault(); done.current?.focus({ preventScroll: true }); } }}>
      <div className="grains-path-burst" aria-hidden="true">{Array.from({ length: 32 }, (_, i) => <i key={i} style={{ "--i": i, "--x": `${(i * 37) % 100}%`, "--drift": `${((i * 53) % 180) - 90}px`, "--turn": `${i * 47}deg` }} />)}</div>
      <p className="grains-path-kicker">A LITTLE EVERY DAY. LOOK HOW FAR YOU GREW.</p>
      <div className="grains-path-tree" aria-hidden="true">
        <span className="grains-path-halo" />
        <svg viewBox="0 0 280 250" fill="none">
          <ellipse cx="140" cy="222" rx="96" ry="17" fill="#d9dfbc" />
          <path d="M55 221L140 239L225 221L225 233L140 250L55 233Z" fill="#b79b72" />
          <path d="M55 221L140 204L225 221L140 239Z" fill="#89a66c" />
          <g className="grains-path-trunk"><path d="M133 219L136 117H146L151 219Z" fill="#9b6c46" /><path d="M142 173L110 142M143 151L171 122" stroke="#9b6c46" strokeWidth="9" strokeLinecap="round" /></g>
          <g className="grains-path-crown"><circle cx="105" cy="115" r="43" fill="#719753" /><circle cx="176" cy="109" r="45" fill="#81a75d" /><circle cx="141" cy="76" r="49" fill="#96b871" /><circle cx="143" cy="120" r="44" fill="#89ac63" /><circle cx="122" cy="66" r="18" fill="#afcb86" opacity=".65" />
          {[ [105,100], [165,78], [176,127], [130,136], [139,91] ].map(([x,y], i) => <g key={i} className="grains-path-flower" style={{ "--flower": i }}><path d={`M${x} ${y-8}Q${x+11} ${y-13} ${x+8} ${y}Q${x+14} ${y+10} ${x+1} ${y+8}Q${x-10} ${y+15} ${x-8} ${y+2}Q${x-15} ${y-8} ${x} ${y-8}`} fill="#f8e7b6" /><circle cx={x} cy={y} r="4" fill="#d5a855" /></g>)}</g>
        </svg>
        <span className="grains-path-spark one">✦</span><span className="grains-path-spark two">✦</span><span className="grains-path-spark three">✦</span>
      </div>
      <p className="grains-path-eyebrow">LEARNING PATH COMPLETE</p>
      <h2 id="grains-path-title">Your knowledge<br />is in full bloom.</h2>
      <p className="grains-path-name">{path.title}</p>
      <p id="grains-path-description">Every card read. Every lesson in bloom.<br />A whole new part of your garden, grown.</p>
      {path.reward !== false
        ? <div className="grains-path-reward"><span className="grains-path-drop" aria-hidden="true" /><strong>+100 <small>Drops</small></strong><span className="grains-path-reward-note">Path completion bonus</span></div>
        : <p className="grains-path-replay-note">Revisited and still in bloom - the +100 Drops bonus was collected on the first finish.</p>}
      <button ref={done} className="grains-primary" onClick={onDone}>Back to my garden <span aria-hidden="true">↗</span></button>
    </section>
  </div>;
}
