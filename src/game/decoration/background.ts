import * as THREE from "three";
import scene from "../scene.ts";

export const LoadBackground = () => {
  const planeGeometry = new THREE.PlaneGeometry(2, 2, 100, 100);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, -0.5, -1); // Position the plane behind the camera
  plane.scale.set(3.5, 0.5, 1); // Scale the plane to make it larger
  scene.add(plane);
};
