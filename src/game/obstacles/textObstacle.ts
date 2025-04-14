import * as THREE from "three";
import add3dTextMesh from "../helper/add3dTextMesh.ts";
import { AddToScene, RemoveFromScene } from "../scene.ts";

export class TextObstacle {
  private textMesh: THREE.Mesh;
  private box: THREE.Box3;
  private boxHelper: THREE.Box3Helper;

  constructor(text: string, size: number) {
    this.textMesh = add3dTextMesh(text, size);
    this.textMesh.position.set(0, 0, 0);
    this.textMesh.visible = true;

    this.box = new THREE.Box3().setFromObject(this.textMesh);
    this.boxHelper = new THREE.Box3Helper(this.box, 0xffff00);
    this.boxHelper.visible = true;
    this.boxHelper.position.copy(this.textMesh.position);

    AddToScene(this.textMesh);
    AddToScene(this.boxHelper);
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

  public dispose() {
    RemoveFromScene(this.textMesh);
    RemoveFromScene(this.boxHelper);

    this.textMesh.geometry.dispose();
    this.textMesh.material.dispose();

    this.boxHelper.geometry.dispose();
    this.boxHelper.material.dispose();
  }
}
