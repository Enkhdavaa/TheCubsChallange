import * as THREE from "three";
import { AddToScene } from "../../scene.ts";
import { getAspectRatio } from "../../size.ts";

export class Bar {
  private maxBarValue: number;
  private currentBarValue: number;

  private background;
  private foreground;
  private group: THREE.Group;
  private barWidth: number = 0.5;

  private offsetX: number = 0;
  private offsetY: number = 0.5;
  private offsetZ: number = 0;
  private aspectRatio;

  constructor() {
    this.aspectRatio = getAspectRatio();
    this.setOffset(0, 0.35, 0);

    this.maxBarValue = 100;
    this.currentBarValue = 100;

    const backgroundGeometry = new THREE.PlaneGeometry(this.barWidth, 0.1);
    const backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });

    this.background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);

    const healthGeometry = new THREE.PlaneGeometry(this.barWidth, 0.1);
    const healthMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    this.foreground = new THREE.Mesh(healthGeometry, healthMaterial);
    this.foreground.position.z = 0.01; // Slightly in front

    this.group = new THREE.Group();
    this.group.add(this.background);
    this.group.add(this.foreground);

    AddToScene(this.group);
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
