"use client";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { clsx } from "clsx";
import { Environment, OrbitControls } from "@react-three/drei";

interface RenderModelProps {
    children: React.ReactNode;
    className?: string;
}

const RenderModel: React.FC<RenderModelProps> = ({ children, className }) => {
    return (
        <Canvas className={clsx("w-screen h-screen -z-10 relative", className)}>
            <Suspense fallback={null}>{children}</Suspense>
            <Environment preset="dawn" />
            <OrbitControls />
        </Canvas>
    );
};

export default RenderModel;
