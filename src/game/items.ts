import { ObstacleKind } from "./obstacles/interfaces.ts";

// What each item teaches. A tip shows the first time an item comes up in a run

// Good habits: green badges you jump to grab
const PICKUP_TIPS: Record<string, string> = {
  "Regular Run": "A few short runs a week beat one big one.",
  "Social Run": "Running with a group keeps you going.",
  "Long Run": "One slow, longer run a week builds endurance.",
  "Turbo Tuesday": "One faster session a week is plenty.",
  "Rest Day": "Your body gets stronger while it rests.",
  "Good Shoes": "Shoes that feel comfortable are the right ones.",
  "Warm-up": "Walk or jog gently for a few minutes first.",
  "Water Stop": "Sip water on runs longer than an hour.",
  "Trail Shoes": "Grippy soles help on mud and rocks.",
  "Short Steps": "Short, quick steps on hills and rough ground.",
  "Look Ahead": "Scan a few steps ahead to pick your line.",
  "Carry Water": "Trails have no shops. Bring water on longer runs.",
};

// Setbacks: red badges you jump over
const SETBACK_TIPS: Record<string, string> = {
  "No Sleep": "Sleep is when your body recovers.",
  "No Food": "A light snack an hour or two before helps.",
  "No Water": "Drink during the day, not only before a run.",
  "Overdoing It": "Add distance slowly to avoid injury.",
  "Injury": "Pain that changes how you run means rest.",
  "Bad Weather": "Dress in layers and slow down when it's slippery.",
  "No Run": "Keeping a routine matters more than any one run.",
  "Wrong Shoes": "Road shoes slip on mud. Grippy soles help.",
};

// Picture hazards on the ground, by sprite name
const ROAD_ICONS: Record<string, { label: string; tip: string }> = {
  banana: {
    label: "Banana peel",
    tip: "Watch the ground ahead. Eat the banana, skip the peel!",
  },
  puddle: { label: "Puddle", tip: "Puddles can hide holes. Step around them." },
  mud: { label: "Mud", tip: "In mud, take short steps and stay upright." },
  rocks: { label: "Rocks", tip: "Lift your feet and land lightly on rocks." },
};

export function getItemTip(name: string, kind: ObstacleKind) {
  const icon = ROAD_ICONS[name];
  if (icon) {
    return icon;
  }
  const tips = kind === "pickup" ? PICKUP_TIPS : SETBACK_TIPS;
  return { label: name, tip: tips[name] ?? "" };
}
