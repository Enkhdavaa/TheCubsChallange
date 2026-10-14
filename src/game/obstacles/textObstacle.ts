import { getBadgeTexture } from "../helper/badgeTexture.ts";
import { GROUND_Y, PICKUP_LANE_BOTTOM_Y } from "../positions.ts";
import { ObstacleKind } from "./interfaces.ts";
import { OBSTACLE_COLORS } from "./obstacleColors.ts";
import { SpriteObstacle } from "./spriteObstacle.ts";

const PICKUP_HEIGHT = 0.6;
const HAZARD_HEIGHT = 0.5;

// A word on a colored badge: pickups float, hazards stand on the road
export class TextObstacle extends SpriteObstacle {
  constructor(text: string, kind: ObstacleKind, startX: number) {
    const { background, border } = OBSTACLE_COLORS[kind];
    const { texture, aspect } = getBadgeTexture(text, background, border);
    const isPickup = kind === "pickup";
    const height = isPickup ? PICKUP_HEIGHT : HAZARD_HEIGHT;

    super({
      name: text,
      kind,
      texture,
      width: height * aspect,
      height,
      startX,
      bottomY: isPickup ? PICKUP_LANE_BOTTOM_Y : GROUND_Y,
      // Grabbing is generous, getting hit is not
      hitboxScale: isPickup ? { x: 1, y: 1 } : { x: 0.85, y: 0.8 },
    });
  }
}
