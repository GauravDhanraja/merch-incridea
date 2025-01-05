"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import React, {useEffect, useRef} from "react";
import Hall from "~/components/3D/Hall";
import { Effects } from "~/components/3D/Effects";
import { PerspectiveCamera } from "@react-three/drei";
import Rig from "~/components/3D/Rig";

interface RenderModelProps {
    children?: React.ReactNode;
    className?: string;
}

const AnimatedCamera: React.FC = () => {
    let gyroPresent = false;
    window.addEventListener("devicemotion", function (event) {
      if (
        event.rotationRate.alpha ||
        event.rotationRate.beta ||
        event.rotationRate.gamma
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
            position={[-14, -0.25, 0.9]}
            fov={60}
        />
    );
};

const RenderModel: React.FC<RenderModelProps> = ({ children, className }) => {
  // if (window.innerWidth > 768) {
    return (
      <Canvas gl={{ antialias: false, stencil: false, pixelRatio: 0.3 }}>
        <AnimatedCamera />
        <Hall position={[1, 0, 0]} />
        {/*<ambientLight intensity={1.6} color={"#088551"} />*/}
        <spotLight
          angle={180}
          color={"#088551"}
          position={[-15, 3, 1]}
          intensity={100}
          onUpdate={(self) => {
            self.target.position.set(-10, 0, 0);
            self.target.updateMatrixWorld();
          }}
        />
        <spotLight
          angle={180}
          color={"#088551"}
          position={[-10, 3, 1]}
          intensity={100}
          onUpdate={(self) => {
            self.target.position.set(-10, 0, 0);
            self.target.updateMatrixWorld();
          }}
        />
        <spotLight
          angle={180}
          color={"#088551"}
          position={[-20, 3, 1]}
          intensity={100}
          onUpdate={(self) => {
            self.target.position.set(-10, 0, 0);
            self.target.updateMatrixWorld();
          }}
        />
          {children}
        <Effects />
          {/*<Rig/>*/}
      </Canvas>
    );
};

export default RenderModel;
