import { BoxGeometry, SphereGeometry, TorusGeometry, MeshStandardMaterial, Mesh, Group, Points, PointsMaterial, BufferGeometry, Float32BufferAttribute, Color } from 'three';

export function createScene(scene) {
  const group = new Group();
  scene.add(group);

  const starCount = 2000;
  const starGeometry = new BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 100;
    starPositions[i + 1] = (Math.random() - 0.5) * 100;
    starPositions[i + 2] = (Math.random() - 0.5) * 100;

    const color = new Color();
    color.setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.8);
    starColors[i] = color.r;
    starColors[i + 1] = color.g;
    starColors[i + 2] = color.b;
  }

  starGeometry.setAttribute('position', new Float32BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new Float32BufferAttribute(starColors, 3));

  const starMaterial = new PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8 });
  const stars = new Points(starGeometry, starMaterial);
  group.add(stars);

  const sun = new Mesh(
    new SphereGeometry(2, 32, 32),
    new MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff6600, emissiveIntensity: 0.5 })
  );
  sun.position.set(8, 2, -10);
  group.add(sun);

  const earth = new Mesh(
    new SphereGeometry(0.8, 32, 32),
    new MeshStandardMaterial({ color: 0x4a90d9, roughness: 0.8 })
  );
  earth.position.set(-3, 1, -5);
  group.add(earth);

  const earthOrbit = new Group();
  earthOrbit.add(earth);
  group.add(earthOrbit);

  const moon = new Mesh(
    new SphereGeometry(0.2, 16, 16),
    new MeshStandardMaterial({ color: 0xaaaaaa, roughness: 1 })
  );
  moon.position.set(1.5, 0, 0);
  const moonOrbit = new Group();
  moonOrbit.add(moon);
  earth.add(moonOrbit);

  const saturn = new Mesh(
    new SphereGeometry(1, 32, 32),
    new MeshStandardMaterial({ color: 0xe8c39e, roughness: 0.7 })
  );
  saturn.position.set(-8, -1, -8);
  group.add(saturn);

  const saturnRing = new Mesh(
    new TorusGeometry(1.5, 0.15, 2, 64),
    new MeshStandardMaterial({ color: 0xd4a574, transparent: true, opacity: 0.7 })
  );
  saturnRing.rotation.x = Math.PI / 3;
  saturn.add(saturnRing);

  const asteroidBelt = new Group();
  for (let i = 0; i < 200; i++) {
    const asteroid = new Mesh(
      new BoxGeometry(0.1, 0.1, 0.1),
      new MeshStandardMaterial({ color: 0x888888 })
    );
    const angle = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 1;
    asteroid.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 0.5, Math.sin(angle) * radius);
    asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    asteroidBelt.add(asteroid);
  }
  group.add(asteroidBelt);

  scene.background = new Color(0x000011);

  return (delta) => {
    stars.rotation.y += delta * 0.02;
    sun.rotation.y += delta * 0.2;
    earthOrbit.rotation.y += delta * 0.5;
    moonOrbit.rotation.y += delta * 3;
    saturn.rotation.y += delta * 0.4;
    saturnRing.rotation.z += delta * 0.1;
    asteroidBelt.rotation.y += delta * 0.3;
    group.rotation.y += delta * 0.05;
  };
}
