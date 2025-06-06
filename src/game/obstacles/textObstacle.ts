import * as THREE from "three";
import add3dTextMesh from "../helper/add3dTextMesh.ts";
import { scene } from "../scene.ts";
import { IObstacle } from "./interfaces.ts";
import { getTextObstaclePosition } from "../positions.ts";

export class TextObstacle implements IObstacle {
  private textMesh: THREE.Mesh;
  private box: THREE.Box3;
  private boxHelper: THREE.Box3Helper;
  public name: string;
  public speed: number = 0.01;

  constructor(
    text: string,
    size: number,
    font: THREE.Font,
    matcap: THREE.MeshMatcapMaterial,
    color: number = 0xffff00
  ) {
    this.name = text;
    this.textMesh = add3dTextMesh(text, size, font, matcap);
    const position = getTextObstaclePosition();
    this.textMesh.position.set(position.x, position.y, 0);
    this.textMesh.visible = true;

    this.box = new THREE.Box3().setFromObject(this.textMesh);
    this.boxHelper = new THREE.Box3Helper(this.box, color);
    this.boxHelper.visible = true;
    this.boxHelper.position.copy(this.textMesh.position);

    scene.add(this.textMesh);
    scene.add(this.boxHelper);
  }

  public setPosition(x: number, y: number) {
    this.textMesh.position.set(x, y, 0);
    this.box.setFromObject(this.textMesh);
    this.boxHelper.position.copy(this.textMesh.position);
  }

  public getPosition() {
    return this.textMesh.position;
  }

  public getBoundingBox() {
    return this.box;
  }

  public dispose(): void {
    scene.remove(this.textMesh);
    scene.remove(this.boxHelper);

    this.textMesh.geometry.dispose();
    this.textMesh.material.dispose();

    this.boxHelper.geometry.dispose();
    this.boxHelper.material.dispose();
  }
}
