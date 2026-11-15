// Fun comparisons for the animated running story.
//
// Every constant below is a rounded, publicly checkable physical or cultural
// fact. The approximation is stated in each card's caption, and every card
// shows its source in the UI (the `source` field), not only in this file.
// Sources (checked 2026-11-14):
// - Earth equatorial circumference 40,075 km — NASA / space.com
//   https://www.space.com/17638-how-big-is-earth.html
// - Mean Earth-Moon distance 384,400 km — NASA https://science.nasa.gov/moon/facts/
// - Marathon distance 42.195 km — World Athletics
// - 2025 Tour de France total distance ~3,339 km
//   https://en.wikipedia.org/wiki/2025_Tour_de_France
// - Paris-Rome geodesic ~1,105 km — great-circle computation
// - Marathon du Mont-Blanc 90K: ~88 km — https://www.montblancmarathon.net
// - Great Wall of China: 21,196 km (2012 official survey)
// - Apollo translunar coast ~3 days one way — NASA Apollo 11 timeline
// - parkrun distance 5 km — parkrun
// - Mount Everest official height 8,848.86 m — Nepal/China 2020 survey
//   https://www.reuters.com/article/idUSKBN28I18U/
// - Kármán line 100 km — FAI definition of the edge of space
// - The Parisian step benchmark comparison was removed: run-only steps vs an
//   all-day step figure read as like-for-like even with a caveat, and the
//   result was confusing. The story now shows a top 5 of biggest step days
//   instead (RunningStory.jsx, from the API's top_step_days).
// - Pizza slice: USDA FoodData Central "Fast Food, Pizza Chain, 14\" pizza,
//   cheese topping, regular crust": 1 slice (1/8 pizza, 107 g) = 285 kcal
//   https://fdc.nal.usda.gov/
// - Meringue nest ~12 g = ~53 kcal (Sainsbury's meringue nests, per nest)
//   https://www.sainsburys.co.uk/groceries/product/sainsburys-meringue-nests-x8-124g
// - Double cream, 2 tablespoons (30 ml) = 140 kcal (Sainsbury's / Tesco labels)
//   https://www.sainsburys.co.uk/groceries/product/sainsburys-double-cream-300ml
// - Garmin activity calories include the resting (BMR) share for the activity
//   time, so they are total kcal, not "extra" kcal
// - Typical EV consumption ~15 kWh/100 km; 1 kcal = 0.001162 kWh

const EARTH_CIRCUMFERENCE_KM = 40075;
const MOON_DISTANCE_KM = 384400;
const MARATHON_KM = 42.195;
const TOUR_DE_FRANCE_KM = 3339;
const PARIS_ROME_KM = 1105;
const MONT_BLANC_90K_KM = 88;
const GREAT_WALL_KM = 21196;
const APOLLO_HOURS_TO_MOON = 72;
const PARKRUN_KM = 5;
const EVEREST_M = 8849;
const KARMAN_LINE_M = 100000;
const WORK_WEEK_HOURS = 40;
const SONG_MINUTES = 3.5;
const FOOTBALL_MATCH_HOURS = 1.5;
const EV_KWH_PER_100KM = 15;
const PIZZA_SLICE_KCAL = 285;
const MERINGUE_NEST_KCAL = 53;
const DOUBLE_CREAM_2_TBSP_KCAL = 140;
const MERINGUE_CREAM_KCAL = MERINGUE_NEST_KCAL + DOUBLE_CREAM_2_TBSP_KCAL;
const KCAL_TO_KWH = 0.001162;

// viz kinds: "ring" (fraction of a circle), "route" (A→B bar, fraction may
// exceed 1 and then shows a xN badge), "space" (Earth→target vertical route),
// "peaks" (stacked mountains), "grid" (one dot per unit), "none" (number only).
export function buildComparisons({ totals, records, span_days: spanDays }) {
  const km = totals.km || 0;
  const hours = totals.hours || 0;
  const elevation = totals.elevation_m || 0;
  const kcal = totals.kcal || 0;
  const runs = totals.runs || 0;
  const yearsSpan = spanDays / 365.25;
  const kmPerYear = yearsSpan > 0 ? km / yearsSpan : km;

  return [
    {
      group: "The distance",
      cards: [
        {
          value: (km / EARTH_CIRCUMFERENCE_KM) * 100,
          decimals: 1,
          suffix: "%",
          label: "of the way around the world",
          caption: `The equator is 40,075 km. At your current pace you lap the planet around ${new Date().getFullYear() + Math.round((EARTH_CIRCUMFERENCE_KM - km) / Math.max(kmPerYear, 1))}.`,
          source: "NASA",
          viz: { kind: "ring", fraction: km / EARTH_CIRCUMFERENCE_KM, icon: "🌍" },
        },
        {
          value: (km / MOON_DISTANCE_KM) * 100,
          decimals: 2,
          suffix: "%",
          label: "of the way to the Moon",
          caption: "The Moon is 384,400 km away. This is a very long game.",
          source: "NASA",
          viz: { kind: "space", fraction: km / MOON_DISTANCE_KM, icon: "🌕" },
        },
        {
          value: km / MARATHON_KM,
          decimals: 0,
          label: "marathons back to back",
          caption: "42.195 km each, no finish line in between. Please don't actually try this.",
          source: "World Athletics",
          viz: { kind: "route", fraction: 1, times: km / MARATHON_KM, from: "Start", to: "42.195 km", icon: "🏁" },
        },
        {
          value: km / TOUR_DE_FRANCE_KM,
          decimals: 1,
          label: "Tours de France on foot",
          caption: "The 2025 edition covered about 3,339 km. You ran that distance twice over.",
          source: "Tour de France 2025",
          viz: { kind: "route", fraction: 1, times: km / TOUR_DE_FRANCE_KM, from: "Grand Départ", to: "Paris", icon: "🚴" },
        },
        {
          value: km / PARIS_ROME_KM,
          decimals: 1,
          label: "times Paris to Rome",
          caption: "About 1,105 km as the crow flies. The crow is impressed.",
          source: "Great-circle distance",
          viz: { kind: "route", fraction: 1, times: km / PARIS_ROME_KM, from: "Paris", to: "Rome", icon: "🕊️" },
        },
        {
          value: km / MONT_BLANC_90K_KM,
          decimals: 0,
          label: "Marathon du Mont-Blanc 90K",
          caption: "Your next big race is about 88 km. You have already run it dozens of times over.",
          source: "montblancmarathon.net",
          viz: { kind: "peaks", count: Math.min(Math.round(km / MONT_BLANC_90K_KM), 20), icon: "⛰️" },
        },
        {
          value: (km / GREAT_WALL_KM) * 100,
          decimals: 0,
          suffix: "%",
          label: "of the Great Wall of China",
          caption: "The full wall system measured 21,196 km in the official 2012 survey. A third of it, on foot.",
          source: "2012 official survey",
          viz: { kind: "route", fraction: km / GREAT_WALL_KM, from: "Jiayuguan", to: "Shanhaiguan", icon: "🏯" },
        },
      ],
    },
    {
      group: "The time",
      cards: [
        {
          value: hours / 24,
          decimals: 1,
          label: "days running without stopping",
          caption: "More than a month of continuous motion, day and night.",
          source: "Your total recorded time ÷ 24 h",
          viz: { kind: "grid", count: Math.min(Math.round(hours / 24), 36), icon: "daynight" },
        },
        {
          value: hours / WORK_WEEK_HOURS,
          decimals: 0,
          label: "full work weeks",
          caption: "Forty-hour weeks, except the desk was a trail.",
          source: "Your total recorded time ÷ 40 h",
          viz: { kind: "grid", count: Math.min(Math.round(hours / WORK_WEEK_HOURS), 25), icon: "calendar" },
        },
        {
          value: (hours * 60) / SONG_MINUTES,
          decimals: 0,
          label: "songs back to back",
          caption: "At three and a half minutes a track. The playlist never repeated itself.",
          source: "Avg. track length ~3.5 min",
          viz: { kind: "none" },
        },
        {
          value: hours / FOOTBALL_MATCH_HOURS,
          decimals: 0,
          label: "football matches",
          caption: "Ninety minutes each, stoppage time included.",
          source: "90 min per match",
          viz: { kind: "none" },
        },
        {
          value: hours / APOLLO_HOURS_TO_MOON,
          decimals: 1,
          label: "Apollo trips to the Moon",
          caption: "Apollo needed about three days to reach the Moon. You spent that time running, 11 times over.",
          source: "NASA Apollo 11 timeline",
          viz: { kind: "space", fraction: 1, times: hours / APOLLO_HOURS_TO_MOON, icon: "🚀" },
        },
      ],
    },
    {
      group: "The runs",
      cards: [
        {
          value: records?.marathon_plus_count || 0,
          decimals: 0,
          label: "runs longer than a marathon",
          caption: "42.195 km and beyond. More than your fingers can count.",
          source: "Your activity distances",
          viz: { kind: "grid", count: Math.min(records?.marathon_plus_count || 0, 24), icon: "medal" },
        },
        {
          value: spanDays > 0 && runs > 0 ? spanDays / runs : 0,
          decimals: 1,
          label: "days between two runs, on average",
          caption: spanDays > 0 ? `One run every ${(spanDays / Math.max(runs, 1)).toFixed(1)} days for ${(spanDays / 365.25).toFixed(1)} years.` : "And counting.",
          source: "Your first-to-last run span",
          viz: { kind: "none" },
        },
        {
          value: runs > 0 ? km / runs / PARKRUN_KM : 0,
          decimals: 1,
          label: "parkruns per average run",
          caption: "A parkrun is 5 km. Your typical run is two and a half of them.",
          source: "parkrun",
          viz: { kind: "route", fraction: 1, times: runs > 0 ? km / runs / PARKRUN_KM : 0, from: "Start", to: "5 km", icon: "🌳" },
        },
      ],
    },
    {
      group: "The climbs",
      cards: [
        {
          value: elevation / EVEREST_M,
          decimals: 1,
          label: "times Mount Everest",
          caption: "Everest tops out at 8,849 m. You climbed that over 17 times, spread over the years.",
          source: "Nepal–China 2020 survey",
          viz: { kind: "peaks", count: Math.min(Math.round(elevation / EVEREST_M), 20), icon: "⛰️" },
        },
        {
          value: elevation / KARMAN_LINE_M,
          decimals: 1,
          label: "times the edge of space",
          caption: "The Kármán line at 100 km is where space begins. Your total climbing went past it.",
          source: "FAI",
          viz: { kind: "space", fraction: Math.min(elevation / KARMAN_LINE_M, 1), times: elevation / KARMAN_LINE_M, icon: "✨" },
        },
      ],
    },
    {
      group: "And everything else",
      cards: [
        {
          value: kcal / PIZZA_SLICE_KCAL,
          decimals: 0,
          label: "pizza slices, burned off",
          caption: "One slice = 1/8 of a 14-inch cheese pizza (107 g, 285 kcal). Garmin's calorie figure for an activity includes the resting burn over that time, so this is a fun scale, not a diet plan.",
          source: "USDA FoodData Central; kcal as recorded by Garmin",
          viz: { kind: "none" },
        },
        {
          value: kcal / MERINGUE_CREAM_KCAL,
          decimals: 0,
          label: "meringues with double cream",
          caption: "One meringue nest (12 g, 53 kcal) plus 2 tablespoons of double cream (30 ml, 140 kcal) = about 193 kcal each. Rough store-label values; a home-made dessert will differ.",
          source: "Sainsbury's / Tesco nutrition labels; kcal as recorded by Garmin",
          viz: { kind: "none" },
        },
        {
          value: (kcal * KCAL_TO_KWH) / EV_KWH_PER_100KM * 100,
          decimals: 0,
          suffix: " km",
          label: "in an electric car, on your burned energy alone",
          caption: "Your running burned the energy a typical EV (15 kWh/100 km) needs to drive this far — no charging stop.",
          source: "1 kcal = 0.001162 kWh; EV ~15 kWh/100 km",
          viz: { kind: "route", fraction: 1, times: 1, from: "Full battery", to: "Empty", icon: "🔋" },
        },
      ],
    },
  ];
}
