import { BoxGeometry, SphereGeometry, TorusGeometry, MeshStandardMaterial, Mesh, Group } from 'three';

export function createScene(scene) {
  // Create a group
  const group = new Group();
  scene.add(group);
  
  // Create different shapes
  const box = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshStandardMaterial({ color: 0xff6b6b })
  );
  box.position.x = -2;
  
  const sphere = new Mesh(
    new SphereGeometry(0.7, 32, 32),
    new MeshStandardMaterial({ color: 0x4ecdc4 })
  );
  sphere.position.x = 0;
  
  const torus = new Mesh(
    new TorusGeometry(0.6, 0.3, 16, 100),
    new MeshStandardMaterial({ color: 0xffe66d })
  );
  torus.position.x = 2;
  
  group.add(box, sphere, torus);
  
  // Animation function
  return (delta) => {
    box.rotation.x += delta;
    box.rotation.y += delta;
    
    sphere.rotation.y += delta;
    
    torus.rotation.x += delta;
    torus.rotation.y += delta * 0.5;
    
    group.rotation.y += delta * 0.3;
  };
}
