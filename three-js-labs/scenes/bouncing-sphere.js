import { SphereGeometry, MeshStandardMaterial, Mesh } from 'three';

export function createScene(scene) {
  // Create a sphere
  const geometry = new SphereGeometry(1, 32, 32);
  const material = new MeshStandardMaterial({ 
    color: 0xff6b6b,
    metalness: 0.5,
    roughness: 0.5
  });
  const sphere = new Mesh(geometry, material);
  scene.add(sphere);
  
  let direction = 1;
  
  // Animation function
  return (delta) => {
    sphere.position.y += delta * direction * 2;
    
    if (sphere.position.y > 3) direction = -1;
    if (sphere.position.y < -1) direction = 1;
    
    sphere.rotation.x += delta;
  };
}
