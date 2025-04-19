import * as THREE from "three";

const backgroundScene = new THREE.Scene();
const backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
backgroundScene.add(backgroundCamera);

export const bgScene = backgroundScene;
export const bgCamera = backgroundCamera;
