import { ObstacleKind } from "./interfaces.ts";

// Kept in sync with the legend badges in game.css
export const OBSTACLE_COLORS: Record<
  ObstacleKind,
  { background: string; border: string }
> = {
  pickup: { background: "#2b8a3e", border: "#1b5e2a" },
  hazard: { background: "#c92a2a", border: "#7d1414" },
};
