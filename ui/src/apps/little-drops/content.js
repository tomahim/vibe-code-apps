export const sources = {
  storage: { label: 'EPA · Water availability and variability', url: 'https://www.epa.gov/system/files/documents/2021-11/water-availabity-guidance_508_final11921.pdf' },
  network: { label: 'EPA · Drinking water distribution systems', url: 'https://www.epa.gov/dwreginfo/drinking-water-distribution-system-tools-and-resources' },
  treatment: { label: 'CDC · How water treatment works', url: 'https://www.cdc.gov/drinking-water/about/how-water-treatment-works.html' },
  supply: { label: 'USGS · How water reaches our homes', url: 'https://www.usgs.gov/water-science-school/science/water-qa-how-water-supplied-our-homes' },
  pressure: { label: 'OpenStax · Pressure with depth', url: 'https://openstax.org/books/college-physics-2e/pages/11-4-variation-of-pressure-with-depth-in-a-fluid' },
};
export const stops = [
  { id: 'source', title: 'A city takes a sip', short: 'The source', kicker: '01 / COLLECT', text: 'A reservoir, river or underground well can supply a public water system. Our little city starts at a reservoir. The water still needs treatment before it reaches a tap.', wonder: 'Clear water is not the same as drinking water.', detail: 'Different sources contain different mixtures of particles, germs and chemicals. Treatment is chosen for the source, rather than being exactly the same in every city.', source: 'treatment', position: [-5, 0.9, 0] },
  { id: 'treatment', title: 'Small things, caught', short: 'Treatment', kicker: '02 / CLEAN', text: 'At a treatment plant, tiny particles can be encouraged to clump together, settle out and then pass through filters. Disinfection targets germs. Each step does a different job.', wonder: 'A filter is one part of a team.', detail: 'A common sequence is coagulation, flocculation, sedimentation, filtration and disinfection. Utilities adapt the process to their water. This illustration combines the first two steps into one tank.', source: 'treatment', position: [-2.2, 0.65, 0] },
  { id: 'tower', title: 'Give gravity a job', short: 'The tower', kicker: '03 / STORE', text: 'Pumps can lift water into an elevated tank. Gravity then helps move it through pipes to homes. A tower is one way to supply a city, not a feature of every water system.', wonder: 'Why put something so heavy up high?', detail: 'The difference in height between the water surface and a tap creates pressure. Raise the water and the ideal pressure at that same tap increases. Try the height experiment below.', source: 'supply', position: [0.6, 2.9, -0.8] },
  { id: 'pipes', title: 'The street has a basement', short: 'Below ground', kicker: '04 / DELIVER', text: 'The quiet part of the journey happens in pipes. Water travels from the supply system toward the places that use it. Peel back our street to see the route hidden under the surface.', wonder: 'A whole network, beneath your feet.', detail: 'This is one simplified route, not a map of a real city. Actual networks branch, use valves and may have multiple pressure zones. Our glowing dots show direction, not measured flow speed.', source: 'supply', position: [2.7, -0.55, 1] },
  { id: 'tap', title: 'An ordinary little miracle', short: 'Your tap', kicker: '05 / ARRIVE', text: 'Turn a tap and the journey becomes visible again. The reservoir, treatment plant, storage and pipe network are all part of the work behind that everyday moment.', wonder: 'Now try changing what happens upstream.', detail: 'Explore the tower experiment or replay the route. Your discoveries stay in this browser only. Little Drops does not connect to a utility or assess whether real water is safe to drink.', source: 'supply', position: [5, 1.1, 0.4] },
];
export const treatmentSteps = [
  { title: 'Clump', text: 'Coagulation helps tiny particles bind together. Gentle mixing, called flocculation, forms larger clumps.', dots: 30, size: 6 },
  { title: 'Settle', text: 'The heavier clumps settle to the bottom, separating solids from the water above.', dots: 14, size: 10 },
  { title: 'Filter', text: 'The water passes through filter materials that remove particles and germs. Different filters remove different things.', dots: 5, size: 4 },
  { title: 'Disinfect', text: 'Disinfection kills remaining germs. Chemical disinfectants can also help protect water as it moves through pipes.', dots: 0, size: 4 },
];
export function pressureKpa(height) { return Math.max(0, Number(height) || 0) * 9.81; }
const key = 'little-drops:v1:discoveries';
export function readDiscoveries(storage) {
  try { const v = JSON.parse(storage.getItem(key)); return Array.isArray(v) ? [...new Set(v.filter(id => stops.some(s => s.id === id)))] : []; } catch { return []; }
}
export function saveDiscoveries(storage, values) { try { storage.setItem(key, JSON.stringify(values)); } catch { /* Private mode or full storage: the visit still works. */ } }
