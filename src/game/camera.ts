import * as THREE from "three";
import { getAspectRatio } from "./size.ts";

const camera = new THREE.PerspectiveCamera(75, getAspectRatio());
camera.position.z = 3;

export default camera;
