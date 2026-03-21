import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function DynamicScene({ code }) {
  const { scene } = useThree();
  const animationRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    // Clear previous scene objects (except lights and camera)
    const objectsToRemove = [];
    scene.traverse((child) => {
      if (child !== scene && 
          !(child instanceof THREE.Light) && 
          !(child instanceof THREE.Camera) &&
          child.parent === scene) {
        objectsToRemove.push(child);
      }
    });
    objectsToRemove.forEach(obj => scene.remove(obj));

    // Execute the user's code
    try {
      // Create a function from the code
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const userFunction = new AsyncFunction(
        'THREE',
        'scene',
        'BoxGeometry',
        'SphereGeometry',
        'CylinderGeometry',
        'PlaneGeometry',
        'TorusGeometry',
        'MeshStandardMaterial',
        'MeshBasicMaterial',
        'Mesh',
        'Group',
        'Vector3',
        'Color',
        `
        ${code}
        if (typeof createScene === 'function') {
          return createScene(scene);
        }
        `
      );

      // Execute with THREE namespace
      const result = userFunction(
        THREE,
        scene,
        THREE.BoxGeometry,
        THREE.SphereGeometry,
        THREE.CylinderGeometry,
        THREE.PlaneGeometry,
        THREE.TorusGeometry,
        THREE.MeshStandardMaterial,
        THREE.MeshBasicMaterial,
        THREE.Mesh,
        THREE.Group,
        THREE.Vector3,
        THREE.Color
      );

      // Store animation function if returned
      if (typeof result === 'function') {
        animationRef.current = result;
      } else if (result && result.then) {
        result.then(animFunc => {
          if (typeof animFunc === 'function') {
            animationRef.current = animFunc;
          }
        });
      }
    } catch (error) {
      console.error('Error executing scene code:', error);
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [code, scene]);

  useFrame((state, delta) => {
    if (animationRef.current) {
      try {
        animationRef.current(delta, state.clock.getElapsedTime());
      } catch (error) {
        console.error('Error in animation:', error);
      }
    }
  });

  return null;
}

function SceneSetup({ sceneId }) {
  const { scene, gl } = useThree();

  useEffect(() => {
    // Export handler
    const handleExport = async (e) => {
      if (e.detail.sceneId !== sceneId) return;
      
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        async (gltf) => {
          try {
            await fetch(`/api/export/${sceneId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ gltfData: gltf }),
            });
            console.log('Scene exported successfully');
            
            // Also download locally
            const blob = new Blob([JSON.stringify(gltf, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${sceneId}.gltf`;
            link.click();
            URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Error exporting scene:', error);
          }
        },
        (error) => {
          console.error('Export error:', error);
        },
        { binary: false }
      );
    };

    // Import handler
    const handleImport = async (e) => {
      try {
        const gltfData = JSON.parse(e.detail.data);
        const loader = new GLTFLoader();
        loader.parse(
          JSON.stringify(gltfData),
          '',
          (gltf) => {
            scene.add(gltf.scene);
            console.log('Model imported successfully');
          },
          (error) => {
            console.error('Import error:', error);
          }
        );
      } catch (error) {
        console.error('Error importing scene:', error);
      }
    };

    window.addEventListener('export-gltf', handleExport);
    window.addEventListener('import-gltf', handleImport);

    return () => {
      window.removeEventListener('export-gltf', handleExport);
      window.removeEventListener('import-gltf', handleImport);
    };
  }, [scene, sceneId, gl]);

  return null;
}

export default function SceneRenderer({ code, sceneId }) {
  const [error, setError] = useState(null);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {error && (
        <div style={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          background: 'rgba(244, 67, 54, 0.9)', 
          padding: '10px', 
          borderRadius: '4px',
          maxWidth: '400px',
          zIndex: 100
        }}>
          {error}
        </div>
      )}
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <SceneSetup sceneId={sceneId} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <DynamicScene code={code} />
          <Grid args={[10, 10]} />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
