import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Wireframe, Html } from '@react-three/drei';

function Globe({ threats }) {
  const meshRef = useRef(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={meshRef}>
      <Sphere args={[2, 32, 32]}>
        <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.15} />
      </Sphere>
      
      {threats.map((threat, index) => {
        // Randomly place threats on the globe surface
        const phi = Math.acos(-1 + (2 * (index % 10)) / 10);
        const theta = Math.sqrt(10 * Math.PI) * phi;
        const r = 2.05;
        const x = r * Math.cos(theta) * Math.sin(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(phi);

        return (
          <mesh key={index} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#ffb4ab" />
            <Html distanceFactor={10}>
              <div className="bg-[var(--surface-high)]/80 text-[var(--danger)] text-[8px] font-mono px-1 py-0.5 rounded backdrop-blur-md whitespace-nowrap">
                {threat.attack_type.toUpperCase()}
              </div>
            </Html>
          </mesh>
        );
      })}
    </group>
  );
}

export function ThreatRadar({ threats = [] }) {
  return (
    <div className="w-full h-full min-h-[300px] bg-[var(--surface-low)] rounded-xl relative overflow-hidden border border-[var(--border-color)]">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[var(--accent-cyber)] animate-pulse" />
        <span className="font-display text-xs tracking-widest text-[var(--text-main)]">GLOBAL INTERCEPT RADAR</span>
      </div>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Globe threats={threats} />
      </Canvas>
    </div>
  );
}
