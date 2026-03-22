import { BoxGeometry, PlaneGeometry, SphereGeometry, ConeGeometry, MeshStandardMaterial, Mesh, Group, CylinderGeometry, DirectionalLight, AmbientLight, PointLight, SpotLight } from 'three';

export function createScene(scene) {
  const group = new Group();
  scene.add(group);

  const ambientLight = new AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(50, 50, 25);
  scene.add(directionalLight);

  const pointLight1 = new PointLight(0xffaa00, 0.5, 100);
  pointLight1.position.set(-20, 20, -20);
  scene.add(pointLight1);

  const pointLight2 = new PointLight(0x00aaff, 0.5, 100);
  pointLight2.position.set(20, 20, 20);
  scene.add(pointLight2);

  const ground = new Mesh(
    new PlaneGeometry(100, 100),
    new MeshStandardMaterial({ color: 0x3a3a3a })
  );
  ground.rotation.x = -Math.PI / 2;
  group.add(ground);

  const grassMaterial = new MeshStandardMaterial({ color: 0x228b22 });
  const buildingMaterial = new MeshStandardMaterial({ color: 0x808080 });
  const buildingMaterial2 = new MeshStandardMaterial({ color: 0x696969 });
  const buildingMaterial3 = new MeshStandardMaterial({ color: 0x556b2f });
  const glassMaterial = new MeshStandardMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.7 });
  const glassDarkMaterial = new MeshStandardMaterial({ color: 0x2f4f4f, transparent: true, opacity: 0.8 });
  const roadMaterial = new MeshStandardMaterial({ color: 0x333333 });
  const roadLineMaterial = new MeshStandardMaterial({ color: 0xffff00 });
  const treeTrunkMaterial = new MeshStandardMaterial({ color: 0x8b4513 });
  const treeLeafMaterial = new MeshStandardMaterial({ color: 0x006400 });
  const houseWallMaterial = new MeshStandardMaterial({ color: 0xd2b48c });
  const houseWallMaterial2 = new MeshStandardMaterial({ color: 0xdeb887 });
  const houseWallMaterial3 = new MeshStandardMaterial({ color: 0xf5deb3 });
  const roofMaterial = new MeshStandardMaterial({ color: 0x8b0000 });
  const roofMaterial2 = new MeshStandardMaterial({ color: 0x2f4f4f });
  const carBodyMaterial = new MeshStandardMaterial({ color: 0xff0000 });
  const carBodyMaterial2 = new MeshStandardMaterial({ color: 0x0000ff });
  const carBodyMaterial3 = new MeshStandardMaterial({ color: 0x00ff00 });
  const carBodyMaterial4 = new MeshStandardMaterial({ color: 0xffff00 });
  const carWindowMaterial = new MeshStandardMaterial({ color: 0x333333 });
  const wheelMaterial = new MeshStandardMaterial({ color: 0x111111 });

  const createBuilding = (x, z, width, depth, height, material = buildingMaterial, hasWindows = true, windowMat = glassMaterial) => {
    const building = new Group();
    const base = new Mesh(new BoxGeometry(width, height, depth), material);
    base.position.y = height / 2;
    building.add(base);

    if (hasWindows) {
      const floors = Math.floor(height / 1.5);
      const windowsPerFloor = Math.floor(width / 0.8);
      for (let f = 0; f < floors; f++) {
        for (let w = 0; w < windowsPerFloor; w++) {
          const windowMesh = new Mesh(new BoxGeometry(0.4, 0.5, 0.05), windowMat);
          windowMesh.position.set(-width / 2 + 0.6 + w * 0.8, 1 + f * 1.5, depth / 2 + 0.01);
          building.add(windowMesh);
        }
      }
    }
    building.position.set(x, 0, z);
    return building;
  };

  const createHouse = (x, z, rotation = 0) => {
    const house = new Group();
    const wallColors = [houseWallMaterial, houseWallMaterial2, houseWallMaterial3];
    const roofColors = [roofMaterial, roofMaterial2];
    const wallMat = wallColors[Math.floor(Math.random() * wallColors.length)];
    const roofMat = roofColors[Math.floor(Math.random() * roofColors.length)];

    const walls = new Mesh(new BoxGeometry(4, 3, 5), wallMat);
    walls.position.y = 1.5;
    house.add(walls);

    const roof = new Mesh(new ConeGeometry(3.5, 2.5, 4), roofMat);
    roof.position.y = 4.25;
    roof.rotation.y = Math.PI / 4;
    house.add(roof);

    const door = new Mesh(new BoxGeometry(0.8, 1.5, 0.1), new MeshStandardMaterial({ color: 0x4a3728 }));
    door.position.set(0, 0.75, 2.51);
    house.add(door);

    for (let i = -1; i <= 1; i += 2) {
      const windowMesh = new Mesh(new BoxGeometry(0.6, 0.6, 0.1), glassMaterial);
      windowMesh.position.set(i * 1.2, 2, 2.51);
      house.add(windowMesh);
    }

    house.rotation.y = rotation;
    house.position.set(x, 0, z);
    return house;
  };

  const createTree = (x, z) => {
    const tree = new Group();
    const trunk = new Mesh(new CylinderGeometry(0.3, 0.4, 3, 8), treeTrunkMaterial);
    trunk.position.y = 1.5;
    tree.add(trunk);
    const leaves = new Mesh(new SphereGeometry(1.5, 8, 8), treeLeafMaterial);
    leaves.position.y = 4;
    tree.add(leaves);
    tree.position.set(x, 0, z);
    return tree;
  };

  const createPark = (x, z, width, depth, treeCount = 5) => {
    const park = new Group();
    const grass = new Mesh(new PlaneGeometry(width, depth), grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    park.add(grass);
    for (let i = 0; i < treeCount; i++) {
      const tx = (Math.random() - 0.5) * (width - 2);
      const tz = (Math.random() - 0.5) * (depth - 2);
      park.add(createTree(tx, tz));
    }
    park.position.set(x, 0.01, z);
    return park;
  };

  const createRoad = (x, z, width, length, rotation = 0) => {
    const road = new Group();
    const roadMesh = new Mesh(new PlaneGeometry(width, length), roadMaterial);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.rotation.z = rotation;
    road.add(roadMesh);

    const lineLength = 2;
    const gap = 2;
    const numLines = Math.floor(length / (lineLength + gap));
    for (let i = 0; i < numLines; i++) {
      const line = new Mesh(new PlaneGeometry(0.3, lineLength), roadLineMaterial);
      line.rotation.x = -Math.PI / 2;
      line.rotation.z = rotation;
      const offset = (i - numLines / 2) * (lineLength + gap);
      if (rotation === 0) {
        line.position.set(x, 0.03, z + offset);
      } else {
        line.position.set(x + offset, 0.03, z);
      }
      road.add(line);
    }
    return road;
  };

  const createCar = (x, z, rotation = 0, colorMat = carBodyMaterial) => {
    const car = new Group();
    const body = new Mesh(new BoxGeometry(2, 1, 4), colorMat);
    body.position.y = 0.8;
    car.add(body);
    const cabin = new Mesh(new BoxGeometry(1.6, 0.8, 2), colorMat);
    cabin.position.set(0, 1.7, -0.2);
    car.add(cabin);
    const frontWindow = new Mesh(new BoxGeometry(1.5, 0.6, 0.1), carWindowMaterial);
    frontWindow.position.set(0, 1.7, 0.8);
    car.add(frontWindow);
    const backWindow = new Mesh(new BoxGeometry(1.5, 0.6, 0.1), carWindowMaterial);
    backWindow.position.set(0, 1.7, -1.2);
    car.add(backWindow);

    const wheelPositions = [
      { x: -1, z: 1.2 },
      { x: 1, z: 1.2 },
      { x: -1, z: -1.2 },
      { x: 1, z: -1.2 }
    ];
    wheelPositions.forEach(pos => {
      const wheel = new Mesh(new CylinderGeometry(0.4, 0.4, 0.3, 16), wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos.x, 0.4, pos.z);
      car.add(wheel);
    });

    car.rotation.y = rotation;
    car.position.set(x, 0, z);
    return car;
  };

  // Downtown skyscrapers
  group.add(createBuilding(-10, -10, 5, 5, 25, buildingMaterial2, true, glassMaterial));
  group.add(createBuilding(-10, 5, 4, 4, 18, buildingMaterial, true, glassMaterial));
  group.add(createBuilding(10, -10, 6, 5, 30, buildingMaterial2, true, glassDarkMaterial));
  group.add(createBuilding(10, 6, 4, 4, 15, buildingMaterial3, true, glassMaterial));
  group.add(createBuilding(-3, 12, 5, 4, 22, buildingMaterial, true, glassDarkMaterial));
  group.add(createBuilding(3, -15, 7, 5, 35, buildingMaterial2, true, glassMaterial));
  group.add(createBuilding(-18, 0, 4, 4, 12, buildingMaterial));
  group.add(createBuilding(18, 0, 5, 4, 16, buildingMaterial2));
  group.add(createBuilding(0, 20, 6, 5, 28, buildingMaterial3, true, glassDarkMaterial));
  group.add(createBuilding(-15, -15, 4, 3, 10, buildingMaterial));
  group.add(createBuilding(15, 15, 5, 4, 14, buildingMaterial2));

  // Residential houses
  const housePositions = [
    { x: -14, z: 10, rot: 0 },
    { x: -10, z: 10, rot: 0 },
    { x: -14, z: 16, rot: 0 },
    { x: -10, z: 16, rot: 0 },
    { x: 14, z: 10, rot: Math.PI },
    { x: 18, z: 10, rot: Math.PI },
    { x: 14, z: 16, rot: Math.PI },
    { x: 18, z: 16, rot: Math.PI },
    { x: -14, z: -10, rot: Math.PI / 2 },
    { x: -14, z: -14, rot: Math.PI / 2 },
    { x: -20, z: -10, rot: Math.PI / 2 },
    { x: 14, z: -10, rot: -Math.PI / 2 },
    { x: 14, z: -14, rot: -Math.PI / 2 },
    { x: 20, z: -10, rot: -Math.PI / 2 },
    { x: -24, z: 0, rot: 0 },
    { x: -20, z: 0, rot: 0 },
    { x: 24, z: 0, rot: Math.PI },
    { x: 28, z: 0, rot: Math.PI }
  ];
  housePositions.forEach(pos => group.add(createHouse(pos.x, pos.z, pos.rot)));

  // Parks with trees
  group.add(createPark(-18, 5, 10, 10, 6));
  group.add(createPark(18, 5, 8, 8, 5));
  group.add(createPark(-18, -10, 8, 8, 4));
  group.add(createPark(18, -10, 8, 8, 4));
  group.add(createPark(0, 24, 12, 10, 8));

  // Roads
  group.add(createRoad(0, 0, 8, 80, 0));
  group.add(createRoad(0, 0, 8, 80, Math.PI / 2));
  group.add(createRoad(0, 20, 8, 50, 0));
  group.add(createRoad(0, -20, 8, 50, 0));
  group.add(createRoad(-20, 0, 8, 50, Math.PI / 2));
  group.add(createRoad(20, 0, 8, 50, Math.PI / 2));

  // Cars on roads (parked along roads)
  const carMaterials = [carBodyMaterial, carBodyMaterial2, carBodyMaterial3, carBodyMaterial4];
  for (let i = -6; i <= 6; i += 3) {
    const mat = carMaterials[Math.abs(i / 3) % carMaterials.length];
    group.add(createCar(i, 3, 0, mat));
    group.add(createCar(i, -3, Math.PI, carMaterials[(Math.abs(i / 3) + 1) % carMaterials.length]));
  }
  for (let i = -6; i <= 6; i += 3) {
    const mat = carMaterials[Math.abs(i / 3 + 2) % carMaterials.length];
    group.add(createCar(3, i, Math.PI / 2, mat));
    group.add(createCar(-3, i, -Math.PI / 2, carMaterials[(Math.abs(i / 3) + 3) % carMaterials.length]));
  }

  return (delta) => {
    group.rotation.y += delta * 0.05;
  };
}
