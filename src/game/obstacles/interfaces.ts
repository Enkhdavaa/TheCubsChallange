import * as THREE from "three";

// Pickups float at jump height and speed the runner up;
// hazards sit on the road and slow the runner down
export type ObstacleKind = "pickup" | "hazard";

export interface IObstacle {
  name: string;
  kind: ObstacleKind;
  getBoundingBox(): THREE.Box3;
  getPosition(): THREE.Vector3;
  setPosition(x: number, y: number): void;
  dispose(): void;
}
