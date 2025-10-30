import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useLocation } from "react-router-dom";
import TryButton from "./SplButton";

function ParticleField({ count = 500, pageKey }) {
  const meshRef = useRef();

  const positions = useMemo(() => {
    const posArray = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 20;
      posArray[i + 1] = (Math.random() - 0.5) * 20;
      posArray[i + 2] = Math.random() * 20 - 10;
    }
    return posArray;
  }, [count, pageKey]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array;

      for (let i = 2; i < positions.length; i += 3) {
        positions[i] += delta * 2;

        if (positions[i] > 10) {
          positions[i] = -10 - Math.random() * 5;
          positions[i - 2] = (Math.random() - 0.5) * 10;
          positions[i - 1] = (Math.random() - 0.5) * 10;
        }
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
      }
    };
  }, []);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#3182ce"
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

export default function SpaceBackground() {
  const location = useLocation();

  return (
    <div className="w-full h-screen fixed top-0 left-0 bg-[#e2e8f0] overflow-hidden">
      <div className="absolute top-[600px] bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <TryButton />
      </div>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ParticleField key={location.pathname} pageKey={location.pathname} />
      </Canvas>

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none w-full"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <motion.div
          className="relative inline-block"
          animate={{
            backgroundPosition: ["0% 100%", "0% 0%"]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: "linear-gradient(to top, #3182ce 0%, transparent 50%, #3182ce 100%)",
            backgroundSize: "100% 200%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text"
          }}
        >
          <h1
            className="text-[12vw] font-bold tracking-tight"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px #3182ce",
              textShadow: "0 0 20px rgba(49,130,206,0.3), 0 0 40px rgba(49,130,206,0.2)",
              letterSpacing: "-0.05em",
              lineHeight: "0.9"
            }}
          >
            Code Glance
          </h1>
        </motion.div>
      </motion.div>
      
    </div>
  );
}


