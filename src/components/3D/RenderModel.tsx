/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef } from "react";
import Hall from "~/components/3D/Hall";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

interface RenderModelProps {
  children?: React.ReactNode;
  className?: string;
}

const AnimatedCamera: React.FC = () => {
  let gyroPresent = false;
  window.addEventListener("devicemotion", function (event) {
    if (
      event.rotationRate?.alpha ||
      event.rotationRate?.beta ||
      event.rotationRate?.gamma
    )
      gyroPresent = true;
  });

  const cameraRef = useRef<any>(null); // Reference for the camera
  const rotationRef = useRef({ alpha: 0, beta: 0, gamma: 0 }); // Store gyroscope values

  // Use the DeviceOrientation API
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Get gyroscope data (alpha, beta, gamma)
      const { alpha, beta, gamma } = event;

      if (alpha !== null && beta !== null && gamma !== null) {
        rotationRef.current = { alpha, beta, gamma };
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Update the camera's rotation based on gyroscope data
  useFrame((state) => {
    if (cameraRef.current) {
      const { alpha, beta, gamma } = rotationRef.current;

      // Convert gyroscope data to radians and adjust sensitivity
      if (gyroPresent) {
        cameraRef.current.rotation.x = (beta * Math.PI) / 1000; // Up-down movement
        cameraRef.current.rotation.y = (-gamma * Math.PI) / 1000; // Left-right movement
      } else {
        cameraRef.current.rotation.y = (state.pointer.x * Math.PI) / 20; // Adjust the multiplier for sensitivity
        cameraRef.current.rotation.x = (state.pointer.y * Math.PI) / 10; // Adjust the multiplier for sensitivity
      }
      // cameraRef.current.rotation.z = (alpha * Math.PI) / 1000; // Roll (optional, usually not needed)
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0.4, 1]}
      fov={70}
    />
  );
};

const RenderModel: React.FC<RenderModelProps> = ({ children, className }) => {
  // if (window.innerWidth > 768) {
  return (
    <Canvas gl={{ antialias: false, stencil: false, pixelRatio: 0.3 }}>
      <AnimatedCamera />
      <Hall position={[15.4, 0.4, 0]} />
      {/*<ambientLight intensity={} />*/}
      <spotLight
        angle={180}
        color={"rgba(8,133,81,0.63)"}
        position={[3, 3, 1]}
        intensity={100}
        onUpdate={(self) => {
          self.target.position.set(0, 0, 0);
          self.target.updateMatrixWorld();
        }}
      />
      <spotLight
        angle={180}
        color={"rgba(8,133,81,0.69)"}
        position={[-1, 3, 1]}
        intensity={100}
        onUpdate={(self) => {
          self.target.position.set(0, 0, 0);
          self.target.updateMatrixWorld();
        }}
      />
      <spotLight
        angle={180}
        color={"rgba(8,133,81,0.6)"}
        position={[-6, 3, 1]}
        intensity={100}
        onUpdate={(self) => {
          self.target.position.set(0, 0, 0);
          self.target.updateMatrixWorld();
        }}
      />
      <Suspense fallback={null}>{children}</Suspense>
      <EffectComposer enableNormalPass>
        <Bloom
          luminanceThreshold={0.5}
          mipmapBlur
          luminanceSmoothing={10}
          intensity={0.04}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>
      {/*<OrbitControls />*/}
    </Canvas>
  );
};

export default RenderModel;
