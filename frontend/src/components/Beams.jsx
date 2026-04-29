import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import './Beams.css';

function Beam({ index, total }) {
  const meshRef = useRef();
  const xPos = (index - (total - 1) / 2) * 4;

  const geometry = useMemo(() => new THREE.PlaneGeometry(2.5, 12, 1, 32), []);
  
  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color('#ffffff'),
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  }), []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.elapsedTime;
      const offset = index * 0.8;
      const sine = Math.sin(t * 1.2 + offset);
      const opacity = (sine + 1) * 0.25;
      meshRef.current.material.opacity = Math.max(0.15, Math.min(0.5, opacity));
      meshRef.current.scale.y = 0.8 + sine * 0.15;
      meshRef.current.position.z = -1 + sine * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} position={[xPos, 0, 0]} />
  );
}

const Beams = ({ beamNumber = 6, beamWidth = 2.5, lightColor = '#ffffff' }) => {
  return (
    <div className="beams-wrapper">
      <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }} className="beams-container">
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[30, 20]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {Array.from({ length: beamNumber }).map((_, i) => (
          <Beam key={i} index={i} total={beamNumber} />
        ))}
      </Canvas>
    </div>
  );
};

export default Beams;