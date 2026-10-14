import { readItem, writeItem } from "./helper/storage.ts";

export type Scenery = "city" | "trail";

export interface Hill {
  km: number;
  // Percent; negative is downhill
  grade: number;
}

export interface Level {
  id: string;
  name: string;
  distanceKm: number;
  scenery: Scenery;
  // How much one second of play stands for, relative to the first 5K;
  // longer runs are squeezed more so they don't take ages to play
  timeScale: number;
  intro: string;
  finishTitle: string;
  // A real-world reference for the finish time
  typicalFinish: string;
  pickups: string[];
  setbacks: string[];
  roadIcons: string[];
  // Where a crossing stops the runner while its light is red
  trafficLightsKm?: number[];
  // The course as stretches of hill and flat, in order
  hills?: Hill[];
}

export const LEVELS: Level[] = [
  {
    id: "first-5k",
    name: "First 5K",
    distanceKm: 5,
    scenery: "city",
    timeScale: 1,
    intro:
      "Pick a pace you can keep. If you can still chat, it's the right pace. Go too fast and you'll run out of breath.",
    finishTitle: "You finished your first 5K!",
    typicalFinish: "Most people finish their first 5K in 30 to 40 minutes.",
    pickups: ["Regular Run", "Rest Day", "Good Shoes", "Warm-up", "Social Run"],
    setbacks: ["No Sleep", "No Food", "No Water", "Overdoing It", "Injury"],
    roadIcons: ["banana", "puddle"],
  },
  {
    id: "city-10k",
    name: "City 10K",
    distanceKm: 10,
    scenery: "city",
    timeScale: 1.6,
    intro:
      "Twice as far, through the city. Pick a pace you can hold for an hour. Red lights stop you: ease off when you see one, and use the wait to catch your breath.",
    finishTitle: "You ran a city 10K!",
    typicalFinish: "Most new runners finish a 10K in 60 to 80 minutes.",
    pickups: [
      "Long Run",
      "Turbo Tuesday",
      "Social Run",
      "Water Stop",
      "Regular Run",
    ],
    setbacks: ["Bad Weather", "No Sleep", "No Food", "Overdoing It", "No Run"],
    roadIcons: ["banana", "puddle"],
    trafficLightsKm: [1.5, 3.5, 5.5, 7.5, 9],
  },
  {
    id: "trail-6k",
    name: "Trail 6K",
    distanceKm: 6,
    scenery: "trail",
    timeScale: 1.2,
    intro:
      "Hills and rough ground. Choose an effort, not a pace: the same effort is slower uphill. Walking the steep parts is what trail runners do.",
    finishTitle: "You finished a trail run!",
    typicalFinish:
      "Trail times depend on hills and ground, so compare effort, not pace.",
    pickups: ["Trail Shoes", "Short Steps", "Look Ahead", "Carry Water"],
    setbacks: ["Wrong Shoes", "No Water", "No Sleep", "Injury"],
    roadIcons: ["rocks", "mud"],
    hills: [
      { km: 0.5, grade: 0 },
      { km: 0.6, grade: 6 },
      { km: 0.3, grade: 0 },
      { km: 0.5, grade: -5 },
      { km: 0.4, grade: 0 },
      { km: 0.8, grade: 9 },
      { km: 0.4, grade: 2 },
      { km: 0.6, grade: -7 },
      { km: 0.5, grade: 0 },
      { km: 0.5, grade: 5 },
      { km: 0.4, grade: -4 },
      { km: 0.5, grade: 0 },
    ],
  },
];

const storageKey = "cubs-run:level";
type LevelListener = (level: Level) => void;

const savedIndex = LEVELS.findIndex((level) => level.id === readItem(storageKey));
let selectedIndex = Math.max(0, savedIndex);
const listeners: LevelListener[] = [];

export function getSelectedLevel() {
  return LEVELS[selectedIndex];
}

export function selectLevel(id: string) {
  const index = LEVELS.findIndex((level) => level.id === id);
  if (index < 0 || index === selectedIndex) {
    return;
  }
  selectedIndex = index;
  writeItem(storageKey, id);
  listeners.forEach((listener) => listener(getSelectedLevel()));
}

// +1 is the next level in the list, -1 the previous one
export function shiftLevel(steps: number) {
  const index = Math.max(0, Math.min(LEVELS.length - 1, selectedIndex + steps));
  selectLevel(LEVELS[index].id);
}

export function onLevelChange(listener: LevelListener) {
  listeners.push(listener);
}
