import * as THREE from "three";
import { scene } from "../../scene.ts";
import { getAspectRatio } from "../../size.ts";
import add3DTextMesh from "../../helper/add3dTextMesh.ts";
import { helvetiker_regular_font } from "../../helper/text3dFonts.ts";

export class Bar {
  private maxBarValue: number;
  private currentBarValue: number;

  private background;
  private foreground;
  private group: THREE.Group;
  private barWidth: number = 0.5;
  private barHeight: number = 0.08;

  private offsetX: number = 0;
  private offsetY: number = 0.5;
  private offsetZ: number = 0;
  private aspectRatio;

  constructor(text: string, color: number) {
    this.aspectRatio = getAspectRatio();
    this.setOffset(0, 0.35, 0);

    this.maxBarValue = 100;
    this.currentBarValue = 100;

    this.background = this.createPlaneMesh(new THREE.Color(0x222222));
    this.foreground = this.createPlaneMesh(new THREE.Color(0x00ff00));
    this.foreground.position.z = 0.01; // Slightly in front

    const textMesh = this.createTextMesh(text, color);

    this.group = new THREE.Group();
    this.group.add(this.background);
    this.group.add(this.foreground);
    this.group.add(textMesh);

    scene.add(this.group);
  }

  private createTextMesh(text: string, color: number): THREE.Mesh {
    const material = new THREE.MeshBasicMaterial({ color: color });
    const mesh = add3DTextMesh(
      text,
      0.05,
      helvetiker_regular_font,
      material,
      0.02,
      6,
      0
    );
    return mesh;
  }

  private createPlaneMesh(color: THREE.Color): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(this.barWidth, this.barHeight);
    const material = new THREE.MeshBasicMaterial({ color: color });
    return new THREE.Mesh(geometry, material);
  }

  public setOffset(x: number, y: number, z: number) {
    this.offsetX = x * this.aspectRatio;
    this.offsetY = y * this.aspectRatio;
    this.offsetZ = z * this.aspectRatio;
  }

  public setPosition(position: THREE.Vector3) {
    const positionCopy = position.clone();
    positionCopy.x += this.offsetX;
    positionCopy.y += this.offsetY;
    positionCopy.z += this.offsetZ;
    this.group.position.copy(positionCopy);
  }

  public setBar(value: number) {
    this.currentBarValue = Math.max(0, Math.min(this.maxBarValue, value));

    const percentage = this.currentBarValue / this.maxBarValue;

    this.foreground.scale.x = percentage;
    this.foreground.position.x = (-this.barWidth * (1 - percentage)) / 2; // Align left
  }

  public getCurrentBarValue(): number {
    return this.currentBarValue;
  }
}
