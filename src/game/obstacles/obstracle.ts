import * as THREE from "three";
import { scene } from "../scene.ts";
import { textureLoader } from "../helper/textures.ts";
import { IObstacle } from "./disposable.ts";

export class Obstracle implements IObstacle {
  private size: number;
  private mesh: THREE.Mesh | THREE.Sprite;
  private box: THREE.Box3;
  private boxHelper: THREE.Box3Helper;
  public name: string;

  constructor(name: string, spritePath: string, size: number = 0.5) {
    this.name = name;
    this.size = size;

    const map = textureLoader.load(spritePath);
    map.magFilter = THREE.NearestFilter;

    const material = new THREE.SpriteMaterial({
      map: map,
    });
    this.mesh = new THREE.Sprite(material);
    this.mesh.scale.set(this.size, this.size, 1);

    this.box = new THREE.Box3().setFromObject(this.mesh);

    this.boxHelper = new THREE.Box3Helper(this.box, 0xff0000);
    this.boxHelper.visible = true;
    this.boxHelper.position.copy(this.mesh.position);

    scene.add(this.mesh);
    scene.add(this.boxHelper);
  }
  getPosition() {
    return this.mesh.position;
  }

  setPosition(x: number, y: number): void {
    this.mesh.position.set(x, y, 0);
    this.box.setFromObject(this.mesh);
    this.boxHelper.position.copy(this.mesh.position);
  }

  getBoundingBox() {
    return this.box;
  }

  public dispose() {
    scene.remove(this.mesh);
    scene.remove(this.boxHelper);

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();

    this.boxHelper.geometry.dispose();
    this.boxHelper.material.dispose();
  }
}
