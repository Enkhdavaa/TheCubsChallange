import * as THREE from "three";
import add3dTextMesh from "../helper/add3dTextMesh.ts";
import { AddToScene, RemoveFromScene } from "../scene.ts";
import { helvetiker_regular_font } from "../helper/text3dFonts.ts";

export class TextObstacle {
  private textMesh: THREE.Mesh;
  private box: THREE.Box3;
  private boxHelper: THREE.Box3Helper;
  private text: string;

  constructor(
    text: string,
    size: number,
    font: any = helvetiker_regular_font,
    color: number = 0xffff00
  ) {
    this.text = text;
    this.textMesh = add3dTextMesh(text, size, font);
    this.textMesh.position.set(0, 0, 0);
    this.textMesh.visible = true;

    this.box = new THREE.Box3().setFromObject(this.textMesh);
    this.boxHelper = new THREE.Box3Helper(this.box, color);
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

  public getText() {
    return this.text;
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
