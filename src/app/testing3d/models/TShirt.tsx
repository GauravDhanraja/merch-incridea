"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { wiggleAtom } from "~/app/testing3d/page";
import { WiggleBone } from "wiggle/spring";

export function TShirt(props) {
    const { nodes, materials, scene } = useGLTF("/models/tshirt.glb");
    const modelRef = useRef();

    // useFrame(({ camera }) => {
    //   console.log("Camera position:", camera.position);
    // });

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Mouse movement handler
    const handleMouseMove = (event) => {
        const { innerWidth, innerHeight } = window;
        setMousePosition({
            x: (event.clientX / innerWidth) * 2 - 1, // Normalized X coordinate
            y: -(event.clientY / innerHeight) * 2 + 1, // Normalized Y coordinate
        });
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useFrame(() => {
        if (modelRef.current) {
            // Rotate model based on mouse position
            modelRef.current.rotation.y = mousePosition.x * Math.PI * 0.2; // Horizontal rotation
            modelRef.current.rotation.x = mousePosition.y * Math.PI * 0.2; // Vertical tilt
        }
    });

    const [wiggle] = useAtom(wiggleAtom);
    const wiggleBones = useRef([]);

    useEffect(() => {
        scene.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
    }, [scene]);

    useEffect(() => {
        wiggleBones.current.length = 0;

        if (!wiggle) {
            return;
        }

        ["Bone"].forEach((rootBone) => {
            if (!nodes[rootBone]) {
                return;
            }
            nodes[rootBone].traverse((bone) => {
                if (bone.isBone) {
                    const wiggleBone = new WiggleBone(bone, {
                        damping: 30,
                        stiffness: 300,
                    });
                    wiggleBones.current.push(wiggleBone);
                }
            });
        });

        return () => {
            wiggleBones.current.forEach((wiggleBone) => {
                wiggleBone.reset();
                wiggleBone.dispose();
            });
        };
    }, [nodes, wiggle]);

    useFrame(() => {
        wiggleBones.current.forEach((wiggleBone) => {
            wiggleBone.update();
        });
    });

    return (
        <group {...props} dispose={null} ref={modelRef} scale={[2,2,2]} position={[0,-2,0]}>
            <skinnedMesh
                geometry={nodes.Object_2.geometry}
                material={materials['22_GOREPORT_1_20_30']}
                skeleton={nodes.Object_2.skeleton}
            />
            <primitive object={nodes.Bone}/>
        </group>
    );
}

useGLTF.preload("/models/tshirt.glb");
