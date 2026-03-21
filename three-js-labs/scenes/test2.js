import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three';

export function createScene(scene) {
  // Create a cube
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({ color: 'red' });
  const cube = new Mesh(geometry, material);
  scene.add(cube);
  
  // Animation function
  return (delta) => {
    cube.rotation.x += delta;
    cube.rotation.y += delta;
  };
}
