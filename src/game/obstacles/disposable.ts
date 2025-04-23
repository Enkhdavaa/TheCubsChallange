import * as THREE from "three";

export interface IObstacle {
  name: string;
  getBoundingBox(): THREE.Box3;
  getPosition(): THREE.Vector3;
  setPosition(x: number, y: number): void;
  dispose(): void;
}
