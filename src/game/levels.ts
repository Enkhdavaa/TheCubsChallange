export interface Level {
  id: string;
  name: string;
  distanceKm: number;
  intro: string;
  finishTitle: string;
  // A real-world reference for the finish time
  typicalFinish: string;
}

export const FIRST_5K: Level = {
  id: "first-5k",
  name: "Your first 5K",
  distanceKm: 5,
  intro:
    "Pick a pace you can keep. If you can still chat, it's the right pace. Go too fast and you'll run out of breath.",
  finishTitle: "You finished your first 5K!",
  typicalFinish: "Most people finish their first 5K in 30 to 40 minutes.",
};

export const currentLevel = FIRST_5K;
