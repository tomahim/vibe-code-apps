import { BoxGeometry, PlaneGeometry, SphereGeometry, CylinderGeometry, MeshStandardMaterial, Mesh, Group, AmbientLight, DirectionalLight, PointLight } from 'three';

export function createScene(scene) {
  const group = new Group();
  scene.add(group);

  const ambientLight = new AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const topLight = new DirectionalLight(0xffffff, 0.8);
  topLight.position.set(0, 10, 0);
  scene.add(topLight);

  const blueLight = new PointLight(0x00aaff, 0.5, 20);
  blueLight.position.set(0, 2, 0);
  scene.add(blueLight);

  const waterMaterial = new MeshStandardMaterial({
    color: 0x006994,
    transparent: true,
    opacity: 0.3,
    side: 2
  });

  const glassMaterial = new MeshStandardMaterial({
    color: 0xadd8e6,
    transparent: true,
    opacity: 0.2,
    side: 2
  });

  const sandMaterial = new MeshStandardMaterial({ color: 0xc2b280 });
  const gravelMaterial = new MeshStandardMaterial({ color: 0x696969 });
  const plantMaterial = new MeshStandardMaterial({ color: 0x228b22 });
  const rockMaterial = new MeshStandardMaterial({ color: 0x4a4a4a });

  const tankWidth = 10;
  const tankHeight = 6;
  const tankDepth = 5;

  const tank = new Group();

  const bottom = new Mesh(new BoxGeometry(tankWidth, 0.3, tankDepth), glassMaterial);
  bottom.position.y = -tankHeight / 2;
  tank.add(bottom);

  const sand = new Mesh(new PlaneGeometry(tankWidth - 0.5, tankDepth - 0.5), sandMaterial);
  sand.rotation.x = -Math.PI / 2;
  sand.position.y = -tankHeight / 2 + 0.2;
  tank.add(sand);

  const back = new Mesh(new BoxGeometry(tankWidth, tankHeight, 0.1), glassMaterial);
  back.position.z = -tankDepth / 2;
  back.position.y = 0;
  tank.add(back);

  const left = new Mesh(new BoxGeometry(0.1, tankHeight, tankDepth), glassMaterial);
  left.position.x = -tankWidth / 2;
  left.position.y = 0;
  tank.add(left);

  const right = new Mesh(new BoxGeometry(0.1, tankHeight, tankDepth), glassMaterial);
  right.position.x = tankWidth / 2;
  right.position.y = 0;
  tank.add(right);

  const front = new Mesh(new BoxGeometry(tankWidth, tankHeight, 0.1), glassMaterial);
  front.position.z = tankDepth / 2;
  front.position.y = 0;
  tank.add(front);

  const water = new Mesh(new BoxGeometry(tankWidth - 0.2, tankHeight - 1, tankDepth - 0.2), waterMaterial);
  water.position.y = 0.5;
  tank.add(water);

  for (let i = 0; i < 8; i++) {
    const gravel = new Mesh(
      new SphereGeometry(0.2 + Math.random() * 0.2, 8, 8),
      gravelMaterial
    );
    gravel.scale.y = 0.5;
    gravel.position.set(
      (Math.random() - 0.5) * (tankWidth - 2),
      -tankHeight / 2 + 0.3,
      (Math.random() - 0.5) * (tankDepth - 2)
    );
    tank.add(gravel);
  }

  const rockPositions = [
    { x: 3, z: -1.5, s: 1.2 },
    { x: -3.5, z: 1, s: 0.8 },
    { x: 2, z: 1.8, s: 0.6 }
  ];
  rockPositions.forEach(pos => {
    const rock = new Mesh(
      new SphereGeometry(pos.s, 8, 8),
      rockMaterial
    );
    rock.scale.set(1, 0.7, 1);
    rock.position.set(pos.x, -tankHeight / 2 + pos.s * 0.5, pos.z);
    tank.add(rock);
  });

  const createSeaweed = (x, z) => {
    const seaweed = new Group();
    const segments = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < segments; i++) {
      const height = 1.5 + Math.random();
      const leaf = new Mesh(
        new BoxGeometry(0.15, height, 0.05),
        plantMaterial
      );
      leaf.position.y = -tankHeight / 2 + 0.3 + i * 0.5;
      leaf.position.x = (Math.random() - 0.5) * 0.3;
      leaf.rotation.z = (Math.random() - 0.5) * 0.3;
      seaweed.add(leaf);
    }
    seaweed.position.set(x, 0, z);
    return seaweed;
  };

  tank.add(createSeaweed(-2, -1));
  tank.add(createSeaweed(-2.5, -1.5));
  tank.add(createSeaweed(2.5, 1));
  tank.add(createSeaweed(3, 0.5));

  group.add(tank);

  const fish = new Group();
  const fishBodyMaterial = new MeshStandardMaterial({ color: 0xff3333 });
  const fishEyeMaterial = new MeshStandardMaterial({ color: 0x000000 });

  const body = new Mesh(
    new SphereGeometry(0.4, 16, 16),
    fishBodyMaterial
  );
  body.scale.set(1.2, 0.8, 0.6);
  fish.add(body);

  const tail = new Mesh(
    new BoxGeometry(0.1, 0.4, 0.3),
    fishBodyMaterial
  );
  tail.position.x = -0.45;
  tail.rotation.z = 0.2;
  fish.add(tail);

  const head = new Mesh(
    new SphereGeometry(0.25, 16, 16),
    fishBodyMaterial
  );
  head.scale.set(0.8, 0.7, 0.6);
  head.position.x = 0.4;
  fish.add(head);

  const eyeLeft = new Mesh(
    new SphereGeometry(0.08, 8, 8),
    fishEyeMaterial
  );
  eyeLeft.position.set(0.5, 0.1, 0.15);
  fish.add(eyeLeft);

  const eyeRight = eyeLeft.clone();
  eyeRight.position.z = -0.15;
  fish.add(eyeRight);

  const finTop = new Mesh(
    new BoxGeometry(0.25, 0.1, 0.2),
    fishBodyMaterial
  );
  finTop.position.set(0, 0.35, 0);
  fish.add(finTop);

  const finBottom = finTop.clone();
  finBottom.position.y = -0.25;
  fish.add(finBottom);

  fish.position.set(0, 0, 0);
  group.add(fish);

  return (delta) => {
    group.rotation.y += delta * 0.1;

    fish.position.x += delta * 1.5;
    if (fish.position.x > tankWidth / 2 - 1) {
      fish.position.x = tankWidth / 2 - 1;
    }

    fish.rotation.y = Math.sin(fish.position.x * 2) * 0.3;
  };
}
