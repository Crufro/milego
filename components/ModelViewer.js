"use client";

import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';


function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  scene.scale.set(100, 100, 100); // Scale up the model
  return <primitive object={scene} />;
}

function CameraLogger() {
  const { camera } = useThree();
  const logCameraPosition = () => {
//    console.log('Camera Position:', camera.position);
  };
  
  React.useEffect(() => {
    window.addEventListener('click', logCameraPosition);
    return () => {
      window.removeEventListener('click', logCameraPosition);
    };
  }, [logCameraPosition]);

  return null; // This component doesn't render anything
}

export default function ModelViewer({ modelPath }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [-2.8663459651944434, 2.5529396238069477, 4.375762584101485], fov: 40 }}>
        <OrbitControls
          target={[0, 1.8, 0]}
          enableDamping
          dampingFactor={0.1}
        />
        <ambientLight intensity={1} />
        <spotLight position={[10, 15, 10]} angle={0.3} intensity={1.5} penumbra={1} />
        {modelPath && <Model modelPath={modelPath} />}
        {/* Use Environment for lighting only, not as a background */}
        <Environment preset="sunset" />
//       <CameraLogger /> {/* Added CameraLogger component */}
      </Canvas>
    </div>
  );
}