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
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.magFilter = THREE.NearestFilter;

    const imgWidth = texture.image.width;
    const imgHeight = texture.image.height;

    console.log("imgWidth", imgWidth);
    console.log("imgHeight", imgHeight);

    // Camera size in world units
    const viewHeight = camera.top - camera.bottom;
    const viewWidth = camera.right - camera.left;

    console.log("viewWidth", viewWidth);
    console.log("viewHeight", viewHeight);

    // Pixels per world unit (based on height)
    const pixelsPerUnit = imgHeight / viewHeight;
    console.log("pixelsPerUnit", pixelsPerUnit);

    // Texture size in world units
    const imageWidthInUnits = imgWidth / pixelsPerUnit;
    const imageHeightInUnits = imgHeight / pixelsPerUnit;

    console.log("imageWidthInUnits", imageWidthInUnits);
    console.log("imageHeightInUnits", imageHeightInUnits);

    // How many times texture should repeat to fill the screen width
    const repeatX = viewWidth / imageWidthInUnits;
    texture.repeat.set(repeatX, 1);

    console.log("repeatX", repeatX);

    // Geometry should match the texture’s world size
    const geometry = new THREE.PlaneGeometry(
      (imgWidth * repeatX) / pixelsPerUnit,
      imgHeight / pixelsPerUnit
    );

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);

    // Scale the mesh to cover full screen width
    // mesh.scale.x = repeatX;

    // Align it to the bottom
    mesh.position.set(0, -viewHeight / 2 + imageHeightInUnits / 2, -0.2);

    // Optimize
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    scene.add(mesh);
  });
}
