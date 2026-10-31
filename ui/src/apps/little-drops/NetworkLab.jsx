import { useId, useState } from 'react';
import { networkNodes, networkEdges, initialValves, reachableNodes, connectedEdges } from './network.js';
import { sources } from './content.js';
const valveLabels = { main: 'Main street', home: 'Home connection', 'loop-in': 'Side street' };
export default function NetworkLab() {
  const [valves, setValves] = useState({ ...initialValves });
  const [challenge, setChallenge] = useState(false);
  const reached = reachableNodes(valves), connected = connectedEdges(valves, reached);
  const supplied = reached.has('house'), solved = challenge && !valves.main && supplied;
  const titleId = useId(), descId = useId();
  function toggle(id) { setValves(v => ({ ...v, [id]: !v[id] })); }
  return <>
    <h2 id="ld-lab-heading">One closed valve. Another way around?</h2>
    <p>Open and close connections in a tiny network. Can you keep a route to the home when Main street is closed?</p>
    <div className="ld-network-key"><span>━ Connected to tower</span><span>┄ Not connected</span><span>× Closed valve</span></div>
    <svg className="ld-network-map" viewBox="0 0 400 235" role="img" aria-labelledby={`${titleId} ${descId}`}>
      <title id={titleId}>A tower, a home and two possible routes</title>
      <desc id={descId}>Main street connects the west and east junctions directly. Side street goes through a lower loop. A separate home connection leads from the east junction to the home. The buttons below control each valve. {supplied ? 'The home currently has an open route to the tower.' : 'The home currently has no open route to the tower.'}</desc>
      {networkEdges.map(edge => {
        const a = networkNodes.find(n => n.id === edge.from), b = networkNodes.find(n => n.id === edge.to);
        const open = !edge.valve || valves[edge.id];
        const x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
        return <g key={edge.id} className={connected.has(edge.id) ? 'ld-net-connected' : 'ld-net-off'}>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="ld-net-pipe" />
          {edge.valve && <g className={open ? 'ld-net-valve open' : 'ld-net-valve closed'}><circle cx={x} cy={y} r="10"/><path d={open ? `M${x-4},${y}h8` : `M${x-4},${y-4}l8,8m-8,0l8,-8`}/></g>}
        </g>;
      })}
      {networkNodes.map(node => <g key={node.id} className={reached.has(node.id) ? 'ld-net-node connected' : 'ld-net-node'}><circle cx={node.x} cy={node.y} r={node.id === 'tower' || node.id === 'house' ? 17 : 6}/>{node.id === 'tower' && <path d={`M${node.x-7},${node.y-6}h14v8h-14zm2,8v9m10,-9v9`}/>} {node.id === 'house' && <path d={`M${node.x-8},${node.y}l8,-8l8,8m-14,-2v10h12v-10`}/>}<text x={node.x} y={node.y + (node.id === 'loop' ? 24 : -27)} textAnchor="middle">{node.label}</text></g>)}
    </svg>
    <div className="ld-valves" role="group" aria-label="Network valves">{Object.keys(initialValves).map(id => <button key={id} aria-pressed={valves[id]} aria-label={`${valveLabels[id]} valve`} onClick={() => toggle(id)}><span className="ld-valve-icon" aria-hidden="true">{valves[id] ? '−' : '×'}</span><span>{valveLabels[id]}<small>{valves[id] ? 'Open' : 'Closed'}</small></span></button>)}</div>
    <p className={`ld-network-status ${supplied ? 'connected' : ''}`} role="status">{supplied ? '✓ Home connected: an open route reaches the tower.' : '× Home disconnected: no open route reaches the tower.'}</p>
    <div className="ld-network-challenge"><button className="ld-discover" onClick={() => { setChallenge(true); setValves({ main: false, home: true, 'loop-in': false }); }}>Try a street closure <span>↗</span></button>{challenge && <p role="status">{solved ? 'Route found. The side street connects the home while Main street stays closed.' : 'Challenge: leave Main street closed and find a route to the home.'}</p>}<button className="ld-network-reset" onClick={() => { setValves({ ...initialValves }); setChallenge(false); }}>Reset valves</button></div>
    <p className="ld-model-note">Connectivity only: an open route is not proof of enough pressure, flow or safe water. No pipe resistance, demand, pumps or water quality are calculated. This is a fictional puzzle, not advice for operating a real network.</p>
    <a className="ld-source" href={sources.network.url} target="_blank" rel="noreferrer">How real distribution networks work · EPA ↗</a>
  </>;
}
