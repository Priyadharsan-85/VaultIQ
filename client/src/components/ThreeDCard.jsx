import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';

const CardMesh = () => {
  const mesh = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = Math.cos(t / 4) / 8;
    mesh.current.rotation.y = Math.sin(t / 4) / 8;
    mesh.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
  });

  return (
    <mesh ref={mesh} scale={[3.4, 2, 0.1]}>
      <boxGeometry />
      <MeshDistortMaterial
        color="#c8a84b"
        speed={2}
        distort={0.2}
        radius={1}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
};

const ThreeDCard = () => {
  return (
    <div className="h-64 w-full cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#c8a84b" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <CardMesh />
        </Float>
      </Canvas>
    </div>
  );
};

export default ThreeDCard;
