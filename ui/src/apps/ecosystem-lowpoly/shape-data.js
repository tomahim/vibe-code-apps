// Illustrative twenty-theme Little Grains library for the shape comparison, following the
// twenty-theme design catalog. Only Languages > Early Childhood English borrows real lesson
// titles; every other theme, path, lesson and all progress numbers are invented for this artifact.
// Terrains reuse the seven fresh-land scenery mixes of the public sample garden.
const P = (title, lessons, start, dur) => ({ title, lessons: lessons.split('|'), start, dur });

export const THEMES = [
  { id: 'nature', title: 'Nature', blurb: 'Forests, fungi and food webs.', terrain: 'forest', top: '#5f9a5a', top2: '#4f8a52', paths: [
    P('Forest Floor', 'Leaf litter|Mosses and ferns|Mushrooms|Fallen logs|Tiny hunters', 1, 8),
    P('Trees of Europe', 'Oak|Beech|Scots pine|Birch|Chestnut|Rowan', 2, 9),
    P('Birdsong', 'Dawn chorus|Robin|Blackbird|Owl calls', 5, 6),
    P('Soil Life', 'Earthworms|Fungal networks|Compost|Roots', 8, 6),
    P('Wildlife Watching', 'Tracks|Nests|Night visitors|Through the seasons', 11, 5) ] },
  { id: 'biology', title: 'Biology & Life', blurb: 'Rainforests, cells and slow change.', terrain: 'forest', top: '#4f9e6b', top2: '#418c5a', paths: [
    P('Rainforest Layers', 'Emergent giants|Canopy highways|Understory shade|The dark floor', 0, 8),
    P('Cells at Work', 'Membranes|Mitochondria|Photosynthesis|Division', 3, 7),
    P('Evolution', 'Variation|Selection|Speciation|Deep time', 6, 7),
    P('Symbiosis', 'Pollinators|Mycorrhizae|Cleaner fish|Gut microbes', 10, 5) ] },
  { id: 'ocean', title: 'Ocean', blurb: 'Tides, reefs and the deep blue.', terrain: 'pond', top: '#74b0ba', top2: '#62a0ab', paths: [
    P('Coral Reefs', 'Reef builders|Fish of the lagoon|Sharks and rays|The reef at night', 1, 8),
    P('The Deep Sea', 'Twilight zone|Hydrothermal vents|Giant squid|Bioluminescence', 4, 8),
    P('Tides and Currents', 'Moon pull|Gyres|Upwelling|El Niño', 7, 6),
    P('Coastal Life', 'Rock pools|Mangroves|Dune plants', 11, 5) ] },
  { id: 'climate', title: 'Climate & Environment', blurb: 'Ice, air and a warming planet.', terrain: 'alpine', top: '#9fc3cc', top2: '#8db2bd', paths: [
    P('Frozen Worlds', 'Glaciers|Sea ice|Permafrost|Ice cores', 0, 8),
    P('Weather Systems', 'Air masses|Fronts|Storms|Jet streams', 2, 7),
    P('Carbon Cycle', 'Sinks and sources|Oceans breathe|Forests store|Fossil carbon', 6, 8),
    P('Habitats Under Pressure', 'Coral bleaching|Range shifts|Extremes|Restoration', 10, 5) ] },
  { id: 'space', title: 'Space & Astronomy', blurb: 'Desert skies, planets and distant suns.', terrain: 'mesa', top: '#b39bb5', top2: '#a189a4', paths: [
    P('The Solar System', 'Rocky planets|Gas giants|Moons|Asteroids', 1, 8),
    P('Stargazing', 'Constellations|Reading the night sky|Planets to spot', 3, 6),
    P('Telescopes', 'Lenses and mirrors|Radio eyes|Space observatories', 6, 7),
    P('Galaxies', 'The Milky Way|Spirals and ellipticals|Dark matter', 10, 5) ] },
  { id: 'geology', title: 'Geology & Earth', blurb: 'Strata, faults and fossils.', terrain: 'mesa', top: '#d89a6a', top2: '#c98658', paths: [
    P('Reading Rocks', 'Igneous|Sedimentary|Metamorphic|The rock cycle', 0, 8),
    P('Canyons and Mesas', 'Erosion|Strata|Slot canyons|Hoodoos', 3, 7),
    P('Fossils', 'How fossils form|Ammonites|Dinosaurs|Trace fossils', 6, 7),
    P('Plate Tectonics', 'Drift|Subduction|Earthquakes|Volcanoes', 9, 6) ] },
  { id: 'physics', title: 'Physics & Energy', blurb: 'Forces, fields and flowing heat.', terrain: 'mesa', top: '#c97b5f', top2: '#b56a4f', paths: [
    P('Energy Basics', 'Kinetic and potential|Conservation|Power', 1, 7),
    P('Heat and Steam', 'Conduction|Convection|Geothermal', 3, 7),
    P('Electricity', 'Circuits|Fields|Motors|Grids', 6, 8),
    P('Light', 'Waves|Spectra|Lenses', 10, 5) ] },
  { id: 'chemistry', title: 'Chemistry', blurb: 'Crystals, reactions and the table of elements.', terrain: 'alpine', top: '#a89ec4', top2: '#968cb3', paths: [
    P('Atoms and Bonds', 'Elements|Ionic and covalent|Molecules', 1, 8),
    P('Crystals', 'Lattices|Growing crystals|Gemstones|Quartz', 3, 7),
    P('Reactions', 'Acids and bases|Oxidation|Catalysts', 7, 7) ] },
  { id: 'sport', title: 'Sport', blurb: 'Trails, summits and match days.', terrain: 'alpine', top: '#a8bd8f', top2: '#96ac7e', paths: [
    P('Mountain Sports', 'Trail running|Climbing|Ski touring|Safety', 1, 8),
    P('Training Basics', 'Endurance|Strength|Recovery|Fueling', 4, 7),
    P('Team Sports', 'Formations|Set pieces|Reading the game', 7, 6),
    P('Legendary Races', 'Tour climbs|Marathons|Ocean crossings', 10, 5),
    P('Racket Skills', 'Serve|Rally|Net play|Match craft', 12, 4) ] },
  { id: 'health', title: 'Health & Body', blurb: 'Sleep, movement and steady habits.', terrain: 'meadow', top: '#9cbf7a', top2: '#8aae69', paths: [
    P('Sleep Hygiene', 'Light and dark|Wind-down routine|Caffeine|Naps', 0, 7),
    P('Gentle Movement', 'Morning stretch|Walking|Posture', 3, 6),
    P('Nutrition Basics', 'Plates|Protein|Fiber|Hydration', 6, 7),
    P('Listening to Your Body', 'Rest days|Signals|Check-ups', 10, 5) ] },
  { id: 'mind', title: 'Mind & Psychology', blurb: 'Attention, memory and calm.', terrain: 'pond', top: '#a3b899', top2: '#92a788', paths: [
    P('Breathing', 'Box breathing|Long exhale|Body scan', 1, 6),
    P('How Memory Works', 'Encoding|Forgetting|Spaced practice', 3, 7),
    P('Attention', 'Distraction|Deep work|Flow', 6, 7),
    P('Emotions', 'Naming feelings|Stress response|Reappraisal', 9, 6) ] },
  { id: 'cooking', title: 'Cooking & Food', blurb: 'Grow it, cook it, taste it.', terrain: 'orchard', top: '#b0a45f', top2: '#9d9350', paths: [
    P('Kitchen Garden', 'Sowing carrots|Tomatoes|Herbs on a sill|Harvest day', 0, 9),
    P('Bread Basics', 'Flour and water|Kneading|Proofing|Scoring a loaf', 3, 7),
    P('Knife Skills', 'The claw grip|Dicing|Julienne|Sharpening', 6, 6),
    P('Sauces', 'Roux|Vinaigrette|Tomato base', 9, 5),
    P('Fermentation', 'Yogurt|Kimchi|Sourdough', 12, 4) ] },
  { id: 'languages', title: 'Languages', blurb: 'Words for the people you love.', terrain: 'meadow', top: '#8fbf63', top2: '#7aae55', paths: [
    P('Early Childhood English', 'Comforting a crying baby|Routines and transitions|Bath time|Bedtime stories', 0, 8),
    P('Professional English', 'Introductions|Small talk|Emails that get answers|Meetings', 3, 8),
    P('Travel English', 'At the airport|Ordering food|Finding the way', 7, 6),
    P('Idioms Garden', 'Piece of cake|Under the weather|Break the ice|Spill the beans', 10, 5) ] },
  { id: 'art', title: 'Art & Design', blurb: 'Color, composition and seeing.', terrain: 'lavender', top: '#c4a86f', top2: '#b2965e', paths: [
    P('Color Theory', 'Hue and value|Complements|Warm and cool', 1, 7),
    P('Composition', 'Rule of thirds|Leading lines|Negative space', 4, 7),
    P('Drawing Basics', 'Gesture|Proportion|Light and shadow', 7, 6),
    P('Looking at Art', 'Cave walls|Renaissance|Impressionism|Today', 10, 6) ] },
  { id: 'music', title: 'Music', blurb: 'Rhythm, pitch and play.', terrain: 'lavender', top: '#a9b27c', top2: '#97a46d', paths: [
    P('Rhythm Basics', 'Pulse|Quarter notes|Syncopation|Polyrhythm', 1, 8),
    P('Reading Notation', 'The staff|Clefs|Key signatures|Dynamics', 4, 8),
    P('Ear Training', 'Intervals|Major or minor|Chords by ear', 8, 6) ] },
  { id: 'history', title: 'History', blurb: 'Peaks and turning points.', terrain: 'alpine', top: '#b5a685', top2: '#a39473', paths: [
    P('Ancient Worlds', 'Mesopotamia|Egypt|Greece|Rome', 1, 8),
    P('Medieval Europe', 'Castles|Guilds|Plague|Printing press', 4, 8),
    P('Industrial Age', 'Steam|Railways|Factories|Cities', 7, 7),
    P('Twentieth Century', 'World wars|Cold war|Decolonization', 10, 6) ] },
  { id: 'technology', title: 'Technology & AI', blurb: 'Networks, code and learning machines.', terrain: 'pond', top: '#7dada4', top2: '#6b9b93', paths: [
    P('How the Internet Works', 'Packets|Routers|Protocols|Data centers', 0, 8),
    P('Machine Learning', 'Data|Training|Inference|Limits', 3, 8),
    P('Cybersecurity', 'Passwords|Phishing|Encryption', 7, 6),
    P('Computing History', 'Vacuum tubes|Transistors|Personal computers', 10, 5) ] },
  { id: 'engineering', title: 'Engineering & Invention', blurb: 'Bridges, machines and clever fixes.', terrain: 'mesa', top: '#93a1a8', top2: '#82919a', paths: [
    P('Bridges', 'Beams|Arches|Suspension|Failure lessons', 1, 8),
    P('Machines', 'Levers|Gears|Engines|Robots', 4, 8),
    P('Inventions That Stuck', 'Printing|Electric light|Radio|The chip', 8, 7) ] },
  { id: 'mathematics', title: 'Mathematics', blurb: 'Patterns, proofs and terraces of ideas.', terrain: 'meadow', top: '#a4c76a', top2: '#93b55b', paths: [
    P('Numbers', 'Primes|Fractions|Zero|Infinity', 1, 8),
    P('Geometry', 'Triangles|Circles|Symmetry|Tilings', 4, 8),
    P('Chance', 'Probability|Averages|Surprising paradoxes', 7, 7),
    P('Graphs and Networks', 'Nodes and edges|Trees|Shortest paths', 10, 6) ] },
  { id: 'economics', title: 'Economics & Money', blurb: 'Harvests, trade and what things cost.', terrain: 'orchard', top: '#cbb26a', top2: '#b8a05a', paths: [
    P('Money Basics', 'Coins and notes|Banks|Interest', 1, 7),
    P('Markets', 'Supply and demand|Prices|Trade', 4, 8),
    P('Booms and Busts', 'Bubbles|Crashes|Recoveries', 8, 7),
    P('Personal Finance', 'Budgets|Saving|Compound growth', 11, 5) ] },
];

// Deterministic fake study timeline. Week 0..16 -> progress 0..1 per path.
export function progressAt(week, path) {
  const x = (week - path.start) / path.dur;
  return Math.max(0, Math.min(1, x));
}
