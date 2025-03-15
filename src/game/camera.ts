import * as THREE from "three";
import sizes from "./size.ts";

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

export default camera;
