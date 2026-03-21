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
    console.log('DynamicScene: executing code');
    
    // Clear previous scene objects (except lights, camera, and Grid)
    const objectsToRemove = [];
    scene.children.forEach((child) => {
      if (!(child instanceof THREE.Light) && 
          !(child instanceof THREE.Camera) &&
          child.type !== 'GridHelper' &&
          !child.isLineSegments) { // Grid uses LineSegments
        objectsToRemove.push(child);
      }
    });
    objectsToRemove.forEach(obj => scene.remove(obj));
    console.log('Cleared objects:', objectsToRemove.length);

    // Execute the user's code
    try {
      // Remove import statements and export keyword
      let codeWithoutImports = code.replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, '');
      codeWithoutImports = codeWithoutImports.replace(/export\s+function/g, 'function');
      
      console.log('Code sample:', codeWithoutImports.substring(0, 100));
      
      // Create a function from the code
      const userFunction = new Function(
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
        ${codeWithoutImports}
        if (typeof createScene === 'function') {
          return createScene(scene);
        } else {
          console.error('createScene function not found in code');
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

      console.log('Scene children after execution:', scene.children.length);
      console.log('Scene children types:', scene.children.map(c => c.type));

      // Store animation function if returned
      if (typeof result === 'function') {
        animationRef.current = result;
        console.log('Animation function stored');
      } else {
        console.log('No animation function returned');
      }
    } catch (error) {
      console.error('Error executing scene code:', error);
      console.error('Stack:', error.stack);
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

function SceneSetup({ sceneId, onThumbnailCapture }) {
  const { scene, gl } = useThree();

  useEffect(() => {
    console.log('SceneSetup mounted, onThumbnailCapture:', !!onThumbnailCapture);
    
    // Capture thumbnail after scene loads
    const captureTimeout = setTimeout(() => {
      console.log('Attempting to capture thumbnail...');
      if (onThumbnailCapture) {
        try {
          const canvas = gl.domElement;
          console.log('Canvas:', canvas);
          const imageData = canvas.toDataURL('image/png');
          console.log('Image data length:', imageData.length);
          onThumbnailCapture(imageData);
        } catch (error) {
          console.error('Error capturing thumbnail:', error);
        }
      } else {
        console.log('No onThumbnailCapture callback provided');
      }
    }, 2000); // Wait 2 seconds for scene to render

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
    const handleImport = (e) => {
      const loader = new GLTFLoader();
      loader.load(
        e.detail.url,
        (gltf) => {
          scene.add(gltf.scene);
          console.log('Model imported successfully');
          URL.revokeObjectURL(e.detail.url);
        },
        undefined,
        (error) => {
          console.error('Import error:', error);
          URL.revokeObjectURL(e.detail.url);
        }
      );
    };

    // Manual capture handler
    const handleManualCapture = (e) => {
      if (e.detail.sceneId !== sceneId) return;
      console.log('Manual thumbnail capture triggered');
      if (onThumbnailCapture) {
        try {
          const canvas = gl.domElement;
          const imageData = canvas.toDataURL('image/png');
          onThumbnailCapture(imageData);
        } catch (error) {
          console.error('Error capturing thumbnail:', error);
        }
      }
    };

    window.addEventListener('export-gltf', handleExport);
    window.addEventListener('import-gltf', handleImport);
    window.addEventListener('capture-thumbnail', handleManualCapture);

    return () => {
      clearTimeout(captureTimeout);
      window.removeEventListener('export-gltf', handleExport);
      window.removeEventListener('import-gltf', handleImport);
      window.removeEventListener('capture-thumbnail', handleManualCapture);
    };
  }, [scene, sceneId, gl, onThumbnailCapture]);

  return null;
}

export default function SceneRenderer({ code, sceneId, captureThumbnail = false }) {
  const [error, setError] = useState(null);
  const [thumbnailCaptured, setThumbnailCaptured] = useState(false);

  const handleThumbnailCapture = async (imageData) => {
    console.log('handleThumbnailCapture called, captureThumbnail:', captureThumbnail, 'thumbnailCaptured:', thumbnailCaptured);
    
    if (thumbnailCaptured) {
      console.log('Thumbnail already captured, skipping');
      return;
    }
    
    try {
      console.log('Saving thumbnail for:', sceneId);
      const response = await fetch(`/api/thumbnails/${sceneId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData }),
      });
      const result = await response.json();
      console.log('Thumbnail saved, result:', result);
      setThumbnailCaptured(true);
    } catch (error) {
      console.error('Error saving thumbnail:', error);
    }
  };

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
          <SceneSetup sceneId={sceneId} onThumbnailCapture={captureThumbnail ? handleThumbnailCapture : null} />
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
