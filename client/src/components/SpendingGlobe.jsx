import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, PerspectiveCamera, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';
import { motion } from 'framer-motion';

const Beacon = ({ lat, lng, amount, merchantName }) => {
  const meshRef = useRef();
  
  // Convert lat/lng to 3D coordinates on a sphere of radius 2
  const position = useMemo(() => {
    const radius = 2.05;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return [
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    ];
  }, [lat, lng]);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 3) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#c8a84b" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.4, 8]} />
        <meshBasicMaterial color="#c8a84b" transparent opacity={0.5} />
      </mesh>
      <Html distanceFactor={10}>
        <div className="pointer-events-none whitespace-nowrap bg-darkBg/80 backdrop-blur-md border border-gold/20 px-2 py-1 rounded text-[8px] font-black text-white shadow-2xl">
          {merchantName} <span className="text-gold">₹{Math.abs(amount)}</span>
        </div>
      </Html>
    </group>
  );
};

const Globe = ({ data }) => {
  const globeRef = useRef();

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Main Globe Body */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#0a0a0f" 
          metalness={0.9} 
          roughness={0.1} 
          emissive="#c8a84b"
          emissiveIntensity={0.05}
        />
      </Sphere>
      
      {/* Grid Overlay */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
      </Sphere>

      {/* Spending Beacons */}
      {data.map((tx) => (
        <Beacon key={tx.id} {...tx} />
      ))}
    </group>
  );
};

const SpendingGlobe = ({ minimal = false }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/geo-spending`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch geo spending:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] relative overflow-hidden rounded-3xl">
      {!minimal && (
        <div className="absolute top-8 left-8 z-10">
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">Global Node Distribution</span>
          <h3 className="text-xl font-black text-white tracking-tighter">Geographical <span className="text-gold/50">Footprint</span></h3>
        </div>
      )}
      
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, minimal ? 5.5 : 6]} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#c8a84b" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Globe data={data} />
        </Float>
      </Canvas>

      {!minimal && (
        <div className="absolute bottom-8 right-8 flex gap-4 pointer-events-none">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
            <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1">Active Clusters</p>
            <p className="text-white font-black text-sm">{data.length} Regions</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingGlobe;
