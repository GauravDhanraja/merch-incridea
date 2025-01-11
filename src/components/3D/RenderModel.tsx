/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import Hall from "~/components/3D/Hall";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
    Bloom, DepthOfField,
    EffectComposer,
    Noise,
    Vignette,
} from "@react-three/postprocessing";

interface RenderModelProps {
    children?: React.ReactNode;
    className?: string;
}

const ParallaxEffect: React.FC = () => {
    const [mouse, setMouse] = useState([0, 0]); // Store mouse position
    const [gyro, setGyro] = useState<[number, number] | null>(null); // Store gyroscope data
    const cameraRef = useRef<any>(null);
    const dampingFactor = 0.1; // Adjust this to control the smoothness (lower = smoother)

    const handleMouseMove = (event: MouseEvent) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1; // Normalize mouse X position
        const y = -(event.clientY / window.innerHeight) * 2 + 1; // Normalize mouse Y position
        setMouse([x, y]);
    };

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha && event.beta) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const x = (event.gamma / 500); // Apply gyroscope X-axis data
            const y = (event.beta / 500) * -1; // Apply gyroscope Y-axis data
            setGyro([x, y]);
        }
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        if (typeof DeviceOrientationEvent !== "undefined") {
            window.addEventListener("deviceorientation", handleDeviceOrientation);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (typeof DeviceOrientationEvent !== "undefined") {
                window.removeEventListener("deviceorientation", handleDeviceOrientation);
            }
        };
    }, []);

    useFrame(() => {
        if (cameraRef.current) {
            // If gyro data is available, use it to update the camera position
            if (gyro) {
                // Apply damping by lerping towards the target gyro position
                cameraRef.current.position.x += (gyro[0] * 0.5 - cameraRef.current.position.x) * dampingFactor; // Gyro X-axis
                cameraRef.current.position.y += ((gyro[1] + 1) * 0.5 - cameraRef.current.position.y) * dampingFactor; // Gyro Y-axis
            } else {
                // Fallback to pointer-based parallax effect if no gyro data
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                cameraRef.current.position.x += (mouse[0] * 0.05 - cameraRef.current.position.x) * dampingFactor; // Mouse X-axis
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                cameraRef.current.position.y += ((mouse[1] + 8) * 0.05 - cameraRef.current.position.y) * dampingFactor; // Mouse Y-axis
            }
        }
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0.4, 1]} fov={70} />;
};


const RenderModel: React.FC<RenderModelProps> = ({ children }) => {
    return (
        <Canvas gl={{ antialias: true, stencil: false, pixelRatio: 1 }}>
            <ParallaxEffect />
            <Hall position={[15.4, 0.4, 0]} />
            <spotLight
                angle={90}
                color={"rgb(8,133,81)"}
                position={[3, 3, -1.5]}
                intensity={100}
                onUpdate={(self) => {
                    self.target.position.set(0, 0, 0);
                    self.target.updateMatrixWorld();
                }}
            />
            <spotLight
                angle={90}
                color={"rgb(8,133,81)"}
                position={[-1, 3, -2]}
                intensity={100}
                onUpdate={(self) => {
                    self.target.position.set(0, 0, 0);
                    self.target.updateMatrixWorld();
                }}
            />
            <spotLight
                angle={90}
                color={"rgb(8,133,81)"}
                position={[-6, 3, -1.5]}
                intensity={100}
                onUpdate={(self) => {
                    self.target.position.set(0, 0, 0);
                    self.target.updateMatrixWorld();
                }}
            />
            <spotLight
                angle={180}
                color={"rgb(253,253,253)"}
                position={[0, 1.1, 1]}
                intensity={7}
                penumbra={100}
                onUpdate={(self) => {
                    self.target.position.set(0, 0, 0);
                    self.target.updateMatrixWorld();
                }}
            />
            <Suspense fallback={null}>{children}</Suspense>
            <EffectComposer enableNormalPass>
                <Bloom
                    // luminanceThreshold={10}
                    mipmapBlur
                    // luminanceSmoothing={100}
                    intensity={0.02}
                />
                <Vignette eskil={false} offset={0.2} darkness={1.2} />
                <Noise opacity={0.02} />
            </EffectComposer>
        </Canvas>
    );
};

export default RenderModel;
