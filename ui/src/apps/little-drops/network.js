// A connectivity toy, deliberately not a hydraulic or water-quality model.
export const networkNodes = [
  { id: 'tower', label: 'Tower', x: 45, y: 85 },
  { id: 'west', label: 'West junction', x: 145, y: 85 },
  { id: 'east', label: 'East junction', x: 270, y: 85 },
  { id: 'house', label: 'Home', x: 355, y: 85 },
  { id: 'loop', label: 'Loop junction', x: 210, y: 185 },
];
export const networkEdges = [
  { id: 'supply', from: 'tower', to: 'west' },
  { id: 'main', from: 'west', to: 'east', valve: true },
  { id: 'home', from: 'east', to: 'house', valve: true },
  { id: 'loop-in', from: 'west', to: 'loop', valve: true },
  { id: 'loop-out', from: 'loop', to: 'east' },
];
export const initialValves = { main: true, home: true, 'loop-in': false };
export function reachableNodes(valves) {
  const reached = new Set(['tower']);
  let changed = true;
  while (changed) {
    changed = false;
    for (const edge of networkEdges) {
      if (edge.valve && !valves[edge.id]) continue;
      if (reached.has(edge.from) && !reached.has(edge.to)) { reached.add(edge.to); changed = true; }
      if (reached.has(edge.to) && !reached.has(edge.from)) { reached.add(edge.from); changed = true; }
    }
  }
  return reached;
}
export function connectedEdges(valves, reached = reachableNodes(valves)) {
  return new Set(networkEdges.filter(e => (!e.valve || valves[e.id]) && reached.has(e.from) && reached.has(e.to)).map(e => e.id));
}
