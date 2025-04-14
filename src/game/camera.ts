import * as THREE from "three";
import { aspectRatio } from "./size.ts";

const camera = new THREE.PerspectiveCamera(75, aspectRatio());
camera.position.z = 3;

export default camera;
