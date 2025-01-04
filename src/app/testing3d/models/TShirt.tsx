"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { WiggleBone } from "wiggle/spring";

export function TShirt({ playAudio }: { playAudio: boolean }) {
  const { nodes, materials, scene } = useGLTF("/models/tshirt.glb");
  const modelRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [deviceOrientation, setDeviceOrientation] = useState({
    beta: 0,
    gamma: 0,
  });
  const [audioLevel, setAudioLevel] = useState(0);
  const wiggleBones = useRef<WiggleBone[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // React Spring Animations
  const audioSpring = useSpring({
    rotationX: audioLevel * 0.6,
    config: { mass: 1, tension: 120, friction: 2 },
  });
  const mouseSpring = useSpring({
    rotationX: mousePosition.y * 0.2,
    rotationY: mousePosition.x * 0.2,
    config: { mass: 1, tension: 120, friction: 7 },
  });
  const gyroSpring = useSpring({
    rotationX: deviceOrientation.beta * 0.5,
    rotationY: deviceOrientation.gamma * 0.5,
    config: { mass: 1, tension: 120, friction: 5 },
  });

  // Mouse Movement Handler
  const handleMouseMove = (event: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    setMousePosition({
      x: (event.clientX / innerWidth) * 2 - 1,
      y: -(event.clientY / innerHeight) * 2 + 1,
    });
  };

  // Device Orientation Handler
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    const y = (event.beta || 0) * 0.5;
    const z = (event.gamma || 0) * 0.5;
    setDeviceOrientation({ beta: y, gamma: z });
  };

  // Attach Event Listeners
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("deviceorientation", handleDeviceOrientation);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  // Audio Setup and Processing
  useEffect(() => {
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const audioElement = new Audio("/music/anthem.mp3");
    audioElement.loop = true;
    audioElementRef.current = audioElement;

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const updateAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg =
        dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      setAudioLevel(avg / 255);
      requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();

    return () => {
      audioElement.pause();
      audioContext.close();
    };
  }, []);

  // Control Audio Playback
  useEffect(() => {
    if (audioElementRef.current) {
      if (playAudio) {
        audioElementRef.current.play();
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [playAudio]);

  // Update Wiggle Bones with Audio Level
  useFrame(() => {
    const scaledAudioLevel = Math.pow(audioLevel, 2);
    wiggleBones.current.forEach((wiggleBone) => {
      wiggleBone.options.stiffness = 300 + scaledAudioLevel * 1000;
      wiggleBone.options.damping = 20 + scaledAudioLevel * 50;
      wiggleBone.update();
    });
  });

  // Add Wiggle Bones
  useEffect(() => {
    if (!scene || !nodes) return;

    // Ensure this runs only once unless scene/nodes change
    const shadowedNodes = new Set(); // To avoid redundant updates

    // Apply shadow-casting only once per mesh
    scene.traverse((node) => {
      if (node.isMesh && !shadowedNodes.has(node)) {
        node.castShadow = true;
        shadowedNodes.add(node);
      }
    });

    // Apply WiggleBone only to the "Root" and its child bones
    const rootBoneName = "Root"; // Assuming your armature's root bone is named "Root"
    if (nodes[rootBoneName]) {
      nodes[rootBoneName].traverse((bone: any) => {
        if (
          bone.isBone &&
          !wiggleBones.current.some((wb) => wb.bone === bone)
        ) {
          const wiggleBone = new WiggleBone(bone, {
            damping: 30,
            stiffness: 30,
          });
          wiggleBones.current.push(wiggleBone);
        }
      });
    }

    // Cleanup: Dispose of WiggleBones and reset them safely
    return () => {
      wiggleBones.current.forEach((wiggleBone: WiggleBone) => {
        if (
          wiggleBone &&
          typeof wiggleBone.dispose === "function" &&
          wiggleBone.parent // Ensure the parent exists before calling dispose
        ) {
          wiggleBone.reset?.(); // Safely call reset if available
          wiggleBone.dispose();
        }
      });
      wiggleBones.current = []; // Clear the array to avoid dangling references
    };
  }, [nodes, scene]);

  return (
    <animated.group
      ref={modelRef}
      dispose={null}
      scale={[2, 2, 2]}
      position={[0, -2, 0]}
      rotation-x={
        audioSpring.rotationX.get() +
        mouseSpring.rotationX.get() +
        gyroSpring.rotationX.get()
      }
      rotation-y={mouseSpring.rotationY.get() + gyroSpring.rotationY.get()}
    >
      <skinnedMesh
        geometry={nodes.Object_2.geometry}
        material={materials["22_GOREPORT_1_20_30"]}
        skeleton={nodes.Object_2.skeleton}
      />
      <primitive object={nodes.Bone} />
    </animated.group>
  );
}

useGLTF.preload("/models/tshirt.glb");
