import * as THREE from "three";

interface CreateRepeatingImageOptions {
  imagePath: string;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;
}

export function createRepeatingImage({
  imagePath,
  camera,
  scene,
}: CreateRepeatingImageOptions): void {
  const loader = new THREE.TextureLoader();

  loader.load(imagePath, (texture: THREE.Texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const viewWidth = camera.right - camera.left;
    const viewHeight = camera.top - camera.bottom;

    // Geometry should match the texture’s world size
    const geometry = new THREE.PlaneGeometry(viewWidth, viewHeight / 2);
    texture.repeat.set(2, 1);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      camera.right + camera.left + 2,
      camera.top + camera.bottom + 1,
      -0.1
    );

    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    scene.add(mesh);
  });
}
