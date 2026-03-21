import { SphereGeometry, CylinderGeometry, BoxGeometry, TorusGeometry, MeshStandardMaterial, Mesh, Group } from 'three';

export function createScene(scene) {
  const elephant = new Group();
  
  const skinMaterial = new MeshStandardMaterial({ 
    color: 0x8b7d6b,
    roughness: 0.95,
    metalness: 0.0
  });
  const darkSkinMaterial = new MeshStandardMaterial({ 
    color: 0x6b5d4f,
    roughness: 0.98,
    metalness: 0.0
  });
  const pinkMaterial = new MeshStandardMaterial({ 
    color: 0xdda0a0,
    roughness: 0.8
  });
  
  // Body - elongated barrel shape
  const bodyMain = new Mesh(
    new SphereGeometry(1.2, 32, 32),
    skinMaterial
  );
  bodyMain.scale.set(0.85, 0.7, 1.3);
  bodyMain.position.set(0, 1.3, 0);
  elephant.add(bodyMain);
  
  // Shoulder hump
  const shoulder = new Mesh(
    new SphereGeometry(0.7, 24, 24),
    skinMaterial
  );
  shoulder.scale.set(1.1, 0.9, 0.8);
  shoulder.position.set(0, 1.7, 0.7);
  elephant.add(shoulder);
  
  // Hip area
  const hip = new Mesh(
    new SphereGeometry(0.8, 24, 24),
    skinMaterial
  );
  hip.scale.set(1.0, 0.85, 0.9);
  hip.position.set(0, 1.4, -0.9);
  elephant.add(hip);
  
  // Back ridge
  const backRidge = new Mesh(
    new BoxGeometry(0.9, 0.3, 1.8),
    skinMaterial
  );
  backRidge.position.set(0, 1.95, 0);
  backRidge.rotation.x = -0.1;
  elephant.add(backRidge);
  
  // Belly sag
  const belly = new Mesh(
    new SphereGeometry(0.6, 24, 24),
    skinMaterial
  );
  belly.scale.set(1.2, 0.6, 1.5);
  belly.position.set(0, 0.85, 0);
  elephant.add(belly);
  
  // Neck/throat
  const neck = new Mesh(
    new CylinderGeometry(0.45, 0.55, 0.6, 16),
    skinMaterial
  );
  neck.position.set(0, 1.6, 1.3);
  neck.rotation.x = -0.3;
  elephant.add(neck);
  
  // Head - more rectangular and massive
  const headMain = new Mesh(
    new BoxGeometry(0.85, 0.9, 1.1),
    skinMaterial
  );
  headMain.position.set(0, 1.8, 1.6);
  elephant.add(headMain);
  
  // Forehead dome (prominent)
  const forehead = new Mesh(
    new SphereGeometry(0.5, 24, 24),
    skinMaterial
  );
  forehead.scale.set(1.0, 1.1, 0.7);
  forehead.position.set(0, 2.15, 1.5);
  elephant.add(forehead);
  
  // Cheekbones
  const cheekLeft = new Mesh(
    new SphereGeometry(0.35, 16, 16),
    skinMaterial
  );
  cheekLeft.position.set(-0.38, 1.6, 1.7);
  elephant.add(cheekLeft);
  
  const cheekRight = cheekLeft.clone();
  cheekRight.position.set(0.38, 1.6, 1.7);
  elephant.add(cheekRight);
  
  // Jaw/chin
  const jaw = new Mesh(
    new BoxGeometry(0.7, 0.4, 0.6),
    skinMaterial
  );
  jaw.position.set(0, 1.35, 1.85);
  elephant.add(jaw);
  
  // Large ears - African elephant style
  const earGroup1 = new Group();
  
  // Outer ear
  const earOuter = new Mesh(
    new SphereGeometry(0.75, 24, 24),
    skinMaterial
  );
  earOuter.scale.set(0.08, 1.3, 1.1);
  
  // Inner ear (pink)
  const earInner = new Mesh(
    new SphereGeometry(0.6, 20, 20),
    pinkMaterial
  );
  earInner.scale.set(0.06, 1.0, 0.85);
  earInner.position.set(0.02, 0, 0.05);
  
  earGroup1.add(earOuter);
  earGroup1.add(earInner);
  earGroup1.position.set(-0.75, 1.9, 1.2);
  earGroup1.rotation.y = -0.4;
  earGroup1.rotation.z = 0.2;
  elephant.add(earGroup1);
  
  const earGroup2 = earGroup1.clone();
  earGroup2.position.set(0.75, 1.9, 1.2);
  earGroup2.rotation.y = 0.4;
  earGroup2.rotation.z = -0.2;
  elephant.add(earGroup2);
  
  // Trunk - highly detailed, curved
  const trunkSegments = [];
  const trunkBaseRadius = 0.22;
  
  for (let i = 0; i < 10; i++) {
    const radius = trunkBaseRadius - i * 0.018;
    const segment = new Mesh(
      new CylinderGeometry(radius, radius - 0.01, 0.22, 16),
      i % 2 === 0 ? skinMaterial : darkSkinMaterial
    );
    
    const angle = i * 0.18;
    const curveX = Math.sin(i * 0.3) * 0.05;
    const yPos = 1.2 - i * 0.18;
    const zPos = 1.8 + i * 0.25 + Math.cos(i * 0.5) * 0.1;
    
    segment.position.set(curveX, yPos, zPos);
    segment.rotation.x = 0.4 + i * 0.12;
    segment.rotation.z = Math.sin(i * 0.4) * 0.1;
    
    elephant.add(segment);
    trunkSegments.push(segment);
  }
  
  // Trunk tip with nostrils
  const trunkTip = new Mesh(
    new SphereGeometry(0.14, 16, 16),
    darkSkinMaterial
  );
  trunkTip.scale.set(1, 0.7, 1);
  trunkTip.position.set(0, 0.05, 4.2);
  elephant.add(trunkTip);
  
  // Nostrils
  const nostrilLeft = new Mesh(
    new SphereGeometry(0.05, 8, 8),
    new MeshStandardMaterial({ color: 0x1a1a1a })
  );
  nostrilLeft.position.set(-0.07, 0.05, 4.28);
  elephant.add(nostrilLeft);
  
  const nostrilRight = nostrilLeft.clone();
  nostrilRight.position.set(0.07, 0.05, 4.28);
  elephant.add(nostrilRight);
  
  // Trunk wrinkles (rings)
  for (let i = 1; i < 8; i++) {
    const ring = new Mesh(
      new TorusGeometry(0.2 - i * 0.015, 0.015, 8, 16),
      darkSkinMaterial
    );
    const yPos = 1.1 - i * 0.18;
    const zPos = 1.95 + i * 0.25;
    ring.position.set(0, yPos, zPos);
    ring.rotation.x = Math.PI / 2 + 0.4 + i * 0.12;
    elephant.add(ring);
  }
  
  // Small tusks
  const tuskMaterial = new MeshStandardMaterial({ 
    color: 0xfff8e7, 
    roughness: 0.2,
    metalness: 0.1
  });
  
  const tuskLeft = new Mesh(
    new CylinderGeometry(0.045, 0.025, 0.35, 12),
    tuskMaterial
  );
  tuskLeft.position.set(-0.2, 1.35, 2.05);
  tuskLeft.rotation.x = -0.5;
  tuskLeft.rotation.z = -0.15;
  elephant.add(tuskLeft);
  
  const tuskRight = tuskLeft.clone();
  tuskRight.position.set(0.2, 1.35, 2.05);
  tuskRight.rotation.z = 0.15;
  elephant.add(tuskRight);
  
  // Eyes - small and wise
  const eyeSocketLeft = new Mesh(
    new SphereGeometry(0.12, 12, 12),
    darkSkinMaterial
  );
  eyeSocketLeft.position.set(-0.32, 1.9, 1.95);
  elephant.add(eyeSocketLeft);
  
  const eyeWhiteLeft = new Mesh(
    new SphereGeometry(0.09, 12, 12),
    new MeshStandardMaterial({ color: 0xf5f0e8 })
  );
  eyeWhiteLeft.position.set(-0.32, 1.9, 2.0);
  elephant.add(eyeWhiteLeft);
  
  const eyeLeft = new Mesh(
    new SphereGeometry(0.06, 12, 12),
    new MeshStandardMaterial({ color: 0x2d1f1a })
  );
  eyeLeft.position.set(-0.32, 1.9, 2.05);
  elephant.add(eyeLeft);
  
  const eyeSocketRight = eyeSocketLeft.clone();
  eyeSocketRight.position.set(0.32, 1.9, 1.95);
  elephant.add(eyeSocketRight);
  
  const eyeWhiteRight = eyeWhiteLeft.clone();
  eyeWhiteRight.position.set(0.32, 1.9, 2.0);
  elephant.add(eyeWhiteRight);
  
  const eyeRight = eyeLeft.clone();
  eyeRight.position.set(0.32, 1.9, 2.05);
  elephant.add(eyeRight);
  
  // Eyelashes
  for (let i = 0; i < 3; i++) {
    const lashLeft = new Mesh(
      new CylinderGeometry(0.01, 0.005, 0.08, 4),
      new MeshStandardMaterial({ color: 0x3d3020 })
    );
    lashLeft.position.set(-0.32 + (i - 1) * 0.03, 2.0, 2.05);
    lashLeft.rotation.x = -0.3;
    elephant.add(lashLeft);
    
    const lashRight = lashLeft.clone();
    lashRight.position.set(0.32 + (i - 1) * 0.03, 2.0, 2.05);
    elephant.add(lashRight);
  }
  
  // Legs - thick and columnar
  const legFrontLeft = new Mesh(
    new CylinderGeometry(0.28, 0.25, 1.2, 16),
    skinMaterial
  );
  legFrontLeft.position.set(-0.45, 0.6, 0.7);
  elephant.add(legFrontLeft);
  
  const legFrontRight = legFrontLeft.clone();
  legFrontRight.position.set(0.45, 0.6, 0.7);
  elephant.add(legFrontRight);
  
  const legBackLeft = new Mesh(
    new CylinderGeometry(0.32, 0.28, 1.2, 16),
    skinMaterial
  );
  legBackLeft.position.set(-0.5, 0.6, -0.7);
  elephant.add(legBackLeft);
  
  const legBackRight = legBackLeft.clone();
  legBackRight.position.set(0.5, 0.6, -0.7);
  elephant.add(legBackRight);
  
  // Knee bumps
  const kneeFrontLeft = new Mesh(
    new SphereGeometry(0.2, 12, 12),
    skinMaterial
  );
  kneeFrontLeft.position.set(-0.45, 0.8, 0.65);
  elephant.add(kneeFrontLeft);
  
  const kneeFrontRight = kneeFrontLeft.clone();
  kneeFrontRight.position.set(0.45, 0.8, 0.65);
  elephant.add(kneeFrontRight);
  
  const kneeBackLeft = new Mesh(
    new SphereGeometry(0.22, 12, 12),
    skinMaterial
  );
  kneeBackLeft.position.set(-0.5, 0.9, -0.75);
  elephant.add(kneeBackLeft);
  
  const kneeBackRight = kneeBackLeft.clone();
  kneeBackRight.position.set(0.5, 0.9, -0.75);
  elephant.add(kneeBackRight);
  
  // Feet - flat and padded
  const footMaterial = new MeshStandardMaterial({
    color: 0x5a4f42,
    roughness: 1.0
  });
  
  const footFrontLeft = new Mesh(
    new CylinderGeometry(0.32, 0.36, 0.15, 16),
    footMaterial
  );
  footFrontLeft.position.set(-0.45, 0.08, 0.7);
  elephant.add(footFrontLeft);
  
  const footFrontRight = footFrontLeft.clone();
  footFrontRight.position.set(0.45, 0.08, 0.7);
  elephant.add(footFrontRight);
  
  const footBackLeft = new Mesh(
    new CylinderGeometry(0.35, 0.38, 0.15, 16),
    footMaterial
  );
  footBackLeft.position.set(-0.5, 0.08, -0.7);
  elephant.add(footBackLeft);
  
  const footBackRight = footBackLeft.clone();
  footBackRight.position.set(0.5, 0.08, -0.7);
  elephant.add(footBackRight);
  
  // Toenails
  for (let i = 0; i < 3; i++) {
    const toenailMaterial = new MeshStandardMaterial({ 
      color: 0x7a6f5f,
      roughness: 0.7
    });
    
    const toenail = new Mesh(
      new BoxGeometry(0.1, 0.08, 0.08),
      toenailMaterial
    );
    toenail.position.set(-0.45 + (i - 1) * 0.12, 0.02, 0.9);
    elephant.add(toenail);
    
    const toenail2 = toenail.clone();
    toenail2.position.set(0.45 + (i - 1) * 0.12, 0.02, 0.9);
    elephant.add(toenail2);
    
    const toenail3 = toenail.clone();
    toenail3.position.set(-0.5 + (i - 1) * 0.12, 0.02, -0.5);
    elephant.add(toenail3);
    
    const toenail4 = toenail.clone();
    toenail4.position.set(0.5 + (i - 1) * 0.12, 0.02, -0.5);
    elephant.add(toenail4);
  }
  
  // Tail - long and thin with tuft
  const tailBase = new Mesh(
    new CylinderGeometry(0.08, 0.06, 0.6, 12),
    darkSkinMaterial
  );
  tailBase.position.set(0, 1.2, -1.2);
  tailBase.rotation.x = 0.5;
  elephant.add(tailBase);
  
  const tailMid = new Mesh(
    new CylinderGeometry(0.06, 0.04, 0.5, 12),
    darkSkinMaterial
  );
  tailMid.position.set(0, 0.8, -1.5);
  tailMid.rotation.x = 0.7;
  elephant.add(tailMid);
  
  // Hair tuft at tail end
  const tailHairGroup = new Group();
  for (let i = 0; i < 8; i++) {
    const hair = new Mesh(
      new CylinderGeometry(0.012, 0.008, 0.3, 6),
      new MeshStandardMaterial({ color: 0x3d3020 })
    );
    const angle = (i / 8) * Math.PI * 2;
    hair.position.set(Math.cos(angle) * 0.05, -0.15, Math.sin(angle) * 0.05);
    hair.rotation.x = 0.3;
    hair.rotation.z = Math.cos(angle) * 0.4;
    tailHairGroup.add(hair);
  }
  tailHairGroup.position.set(0, 0.5, -1.7);
  elephant.add(tailHairGroup);
  
  scene.add(elephant);
  
  const legs = [legFrontLeft, legFrontRight, legBackLeft, legBackRight];
  let time = 0;
  
  return (delta) => {
    time += delta * 9;
    
    // Natural running gait
    const stride = 0.55;
    legFrontLeft.rotation.x = Math.sin(time) * stride;
    legFrontRight.rotation.x = Math.sin(time + Math.PI) * stride;
    legBackLeft.rotation.x = Math.sin(time + Math.PI * 0.5) * stride * 0.8;
    legBackRight.rotation.x = Math.sin(time + Math.PI * 1.5) * stride * 0.8;
    
    // Body movement
    const bounce = Math.abs(Math.sin(time * 2)) * 0.06;
    bodyMain.position.y = 1.3 + bounce;
    shoulder.position.y = 1.7 + bounce;
    hip.position.y = 1.4 + bounce;
    backRidge.position.y = 1.95 + bounce;
    
    // Ears flapping dramatically
    earGroup1.rotation.z = 0.2 + Math.sin(time * 2.5) * 0.25;
    earGroup2.rotation.z = -0.2 - Math.sin(time * 2.5) * 0.25;
    
    // Trunk swaying naturally
    for (let i = 0; i < trunkSegments.length; i++) {
      const wave = Math.sin(time * 0.8 + i * 0.6);
      trunkSegments[i].position.x = Math.sin(i * 0.3) * 0.05 + wave * 0.12;
      trunkSegments[i].rotation.y = wave * 0.15;
    }
    trunkTip.position.x = Math.sin(time * 0.8 + 5) * 0.15;
    
    // Tail swishing
    tailBase.rotation.y = Math.sin(time * 1.2) * 0.4;
    tailMid.rotation.y = Math.sin(time * 1.2 + 0.5) * 0.5;
    tailHairGroup.rotation.y = Math.sin(time * 1.2 + 1) * 0.6;
    
    // Head slight bob
    headMain.position.y = 1.8 + bounce * 0.5;
    headMain.rotation.x = Math.sin(time * 0.5) * 0.05;
    
    // Forward movement
    elephant.position.z += delta * 3.5;
    if (elephant.position.z > 10) {
      elephant.position.z = -10;
    }
  };
}