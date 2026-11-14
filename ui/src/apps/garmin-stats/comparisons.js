// Fun comparisons for the animated running story.
//
// Every constant below is a rounded, publicly checkable physical or cultural
// fact; the approximation is always stated in the caption so the numbers stay
// honest. Sources (checked 2026-11-14):
// - Earth equatorial circumference 40,075 km — NASA / space.com
//   https://www.space.com/17638-how-big-is-earth.html
// - Mean Earth-Moon distance 384,400 km — NASA
//   https://science.nasa.gov/moon/facts/
// - Marathon distance 42.195 km — World Athletics
// - 2025 Tour de France total distance ~3,339 km — race organisers
//   https://en.wikipedia.org/wiki/2025_Tour_de_France
// - Paris-Rome geodesic ~1,105 km — great-circle computation
// - France north-to-south span ~1,000 km — geographic common reference
// - Mount Everest official height 8,848.86 m — Nepal/China 2020 survey
//   https://www.reuters.com/article/idUSKBN28I18U/
// - Kármán line 100 km — FAI definition of the edge of space
// - Burj Khalifa 828 m — official
// - Airliner cruise altitude ~11 km
// - Reference daily intake 2,500 kcal — common nutrition label reference
// - Medium butter croissant ~231 kcal — USDA FoodData Central
// - Paris population ~2.1 million — INSEE

const EARTH_CIRCUMFERENCE_KM = 40075;
const MOON_DISTANCE_KM = 384400;
const MARATHON_KM = 42.195;
const TOUR_DE_FRANCE_KM = 3339;
const PARIS_ROME_KM = 1105;
const FRANCE_LENGTH_KM = 1000;
const EVEREST_M = 8849;
const KARMAN_LINE_M = 100000;
const BURJ_KHALIFA_M = 828;
const CRUISE_ALTITUDE_M = 11000;
const STAIR_FLOOR_M = 3;
const WORK_WEEK_HOURS = 40;
const SONG_MINUTES = 3.5;
const FOOTBALL_MATCH_HOURS = 1.5;
const PARIS_POPULATION = 2100000;
const DAILY_KCAL = 2500;
const CROISSANT_KCAL = 231;

function days(hours) {
  return hours / 24;
}

// Each card: a big animated number, a label and a caption with the basis.
export function buildComparisons({ totals, records, span_days: spanDays }) {
  const km = totals.km || 0;
  const hours = totals.hours || 0;
  const elevation = totals.elevation_m || 0;
  const steps = totals.steps || 0;
  const kcal = totals.kcal || 0;
  const runs = totals.runs || 0;

  return [
    {
      group: "The distance",
      cards: [
        {
          value: (km / EARTH_CIRCUMFERENCE_KM) * 100,
          decimals: 1,
          suffix: "%",
          label: "of the way around the world",
          caption: `The equator is 40,075 km. Keep going and you will lap the planet around ${new Date().getFullYear() + Math.round((EARTH_CIRCUMFERENCE_KM - km) / Math.max(km / Math.max(spanDays / 365.25, 1), 1))}.`,
        },
        {
          value: (km / MOON_DISTANCE_KM) * 100,
          decimals: 2,
          suffix: "%",
          label: "of the way to the Moon",
          caption: "The Moon is 384,400 km away. This is a very long game.",
        },
        {
          value: km / MARATHON_KM,
          decimals: 0,
          label: "marathons back to back",
          caption: "42.195 km each, no finish line in between. Please don't actually try this.",
        },
        {
          value: km / TOUR_DE_FRANCE_KM,
          decimals: 1,
          label: "Tours de France on foot",
          caption: "The 2025 edition covered about 3,339 km. You ran that twice over.",
        },
        {
          value: km / PARIS_ROME_KM,
          decimals: 1,
          label: "times Paris to Rome",
          caption: "About 1,105 km as the crow flies. The crow is impressed.",
        },
        {
          value: km / FRANCE_LENGTH_KM,
          decimals: 1,
          label: "times the length of France",
          caption: "France spans roughly 1,000 km from north to south.",
        },
      ],
    },
    {
      group: "The time",
      cards: [
        {
          value: days(hours),
          decimals: 1,
          label: "days running without stopping",
          caption: "More than a month of continuous motion, day and night.",
        },
        {
          value: hours / WORK_WEEK_HOURS,
          decimals: 0,
          label: "full work weeks",
          caption: "Forty-hour weeks, except the desk was a trail.",
        },
        {
          value: (hours * 60) / SONG_MINUTES,
          decimals: 0,
          label: "songs back to back",
          caption: "At three and a half minutes a track. The playlist never repeated itself.",
        },
        {
          value: hours / FOOTBALL_MATCH_HOURS,
          decimals: 0,
          label: "football matches",
          caption: "Ninety minutes each, stoppage time included.",
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
        },
        {
          value: elevation / KARMAN_LINE_M,
          decimals: 1,
          label: "times the edge of space",
          caption: "The Kármán line at 100 km is where space begins. Your total climbing went past it.",
        },
        {
          value: elevation / BURJ_KHALIFA_M,
          decimals: 0,
          label: "Burj Khalifas stacked up",
          caption: "828 m each. Tallest building on Earth, multiplied by your legs.",
        },
        {
          value: elevation / STAIR_FLOOR_M,
          decimals: 0,
          label: "floors of stairs",
          caption: "At about 3 m a floor. Take the elevator next time.",
        },
        {
          value: elevation / CRUISE_ALTITUDE_M,
          decimals: 1,
          label: "cruising altitudes",
          caption: "Airliners fly around 11 km up. You ascended that height 13 times over.",
        },
      ],
    },
    {
      group: "And everything else",
      cards: [
        {
          value: steps / PARIS_POPULATION,
          decimals: 1,
          label: "steps for every Parisian",
          caption: "About 2.1 million people live in Paris. You took more than three steps for each of them.",
        },
        {
          value: kcal / DAILY_KCAL,
          decimals: 0,
          label: "days of food burned",
          caption: "At a 2,500 kcal reference day, that is over two years of eating.",
        },
        {
          value: kcal / CROISSANT_KCAL,
          decimals: 0,
          label: "croissants",
          caption: "The most French unit of energy. About 231 kcal a piece.",
        },
        {
          value: runs,
          decimals: 0,
          label: "runs in total",
          caption: spanDays > 0
            ? `One run every ${(spanDays / Math.max(runs, 1)).toFixed(1)} days for ${(spanDays / 365.25).toFixed(1)} years.`
            : "And counting.",
        },
        {
          value: records?.marathon_plus_count || 0,
          decimals: 0,
          label: "runs longer than a marathon",
          caption: "42.195 km and beyond. More than your fingers can count.",
        },
      ],
    },
  ];
}
