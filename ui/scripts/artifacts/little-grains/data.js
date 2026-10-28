// Illustrative Little Grains library. Only Language > Early Childhood English mirrors real content;
// every other theme, path, lesson, and all progress numbers are invented for this artifact.
const P = (title, lessons, start, dur) => ({ title, lessons: lessons.split('|'), start, dur });

export const THEMES = [
  { id: 'language', title: 'Language', blurb: 'Words for the people you love.', terrain: 'meadow', top: '#8fbf63', top2: '#7aae55', paths: [
    P('Early Childhood English', 'Comforting a crying baby|Routines and transitions|Affection and encouragement|Bath time|Bedtime stories|Mealtime talk|First steps', 0, 8),
    P('Professional English', 'Introductions|Small talk|Emails that get answers|Meetings|Giving feedback|Negotiating', 1, 9),
    P('Travel English', 'At the airport|Ordering food|Finding the way|Hotel check-in|Asking for help', 3, 7),
    P('English for Parents', 'School runs|Doctor visits|Playground chat|Birthday parties', 7, 6),
    P('Idioms Garden', 'Piece of cake|Under the weather|Break the ice|Hit the books|Spill the beans', 10, 5) ] },
  { id: 'nature', title: 'Nature', blurb: 'Forests, fungi and food webs.', terrain: 'forest', top: '#5f9a5a', top2: '#4f8a52', paths: [
    P('Forest Floor', 'Leaf litter|Mosses and ferns|Mushrooms|Fallen logs|Tiny hunters', 1, 8),
    P('Trees of Europe', 'Oak|Beech|Scots pine|Birch|Chestnut|Rowan', 2, 9),
    P('Birdsong', 'Dawn chorus|Robin|Blackbird|Owl calls', 5, 6),
    P('Soil Life', 'Earthworms|Fungal networks|Compost|Roots', 8, 6) ] },
  { id: 'kitchen', title: 'Kitchen', blurb: 'Grow it, cook it, taste it.', terrain: 'orchard', top: '#9cc46a', top2: '#88b45c', paths: [
    P('Kitchen Garden', 'Sowing carrots|Tomatoes|Herbs on a sill|Pollinators|Harvest day|Seed saving', 0, 10),
    P('Knife Skills', 'The claw grip|Dicing|Julienne|Sharpening', 2, 6),
    P('Bread Basics', 'Flour and water|Kneading|Proofing|Scoring a loaf', 4, 7),
    P('Sauces', 'Roux|Vinaigrette|Tomato base', 9, 5) ] },
  { id: 'geography', title: 'Geography', blurb: 'Mesas, maps and monsoons.', terrain: 'mesa', top: '#d89a6a', top2: '#c98658', paths: [
    P('Deserts of the World', 'Sahara|Atacama|Gobi|Sonoran|Namib', 2, 8),
    P('Reading Maps', 'Scale|Contour lines|Grid references|Projections', 4, 7),
    P('Rivers and Deltas', 'Nile|Mekong|Rhine|Mississippi', 7, 6),
    P('Climate Zones', 'Tropics|Temperate|Polar|Highland', 11, 5) ] },
  { id: 'music', title: 'Music', blurb: 'Rhythm, pitch and play.', terrain: 'lavender', top: '#a9b27c', top2: '#97a46d', paths: [
    P('Rhythm Basics', 'Pulse|Quarter notes|Syncopation|Polyrhythm', 1, 8),
    P('Reading Notation', 'The staff|Clefs|Key signatures|Time signatures|Dynamics', 3, 9),
    P('Ear Training', 'Intervals|Major or minor|Chords by ear', 6, 7) ] },
  { id: 'wellbeing', title: 'Wellbeing', blurb: 'Slow breaths by the water.', terrain: 'pond', top: '#8dbd7c', top2: '#7bad78', paths: [
    P('Sleep Hygiene', 'Light and dark|Wind-down routine|Caffeine|Naps', 2, 7),
    P('Breathing', 'Box breathing|Long exhale|Body scan|Noticing thoughts', 5, 7),
    P('Gentle Movement', 'Morning stretch|Walking|Posture', 8, 6),
    P('Mindful Eating', 'First bite|Hunger cues|Slow meals', 10, 5) ] },
  { id: 'history', title: 'History', blurb: 'Peaks and turning points.', terrain: 'alpine', top: '#9fb89a', top2: '#8ea98d', paths: [
    P('Ancient Worlds', 'Mesopotamia|Egypt|Greece|Rome|Han China', 3, 9),
    P('Medieval Europe', 'Castles|Guilds|Plague|Printing press', 6, 8),
    P('Industrial Age', 'Steam|Railways|Factories|Cities', 9, 6) ] },
];

// Deterministic fake study timeline. Week 0..12 -> progress 0..1 per path.
export function progressAt(week, path) {
  const x = (week - path.start) / path.dur;
  return Math.max(0, Math.min(1, x));
}
