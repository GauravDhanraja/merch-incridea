"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { WiggleBone } from "wiggle/spring";

export function TShirt({ playAudio }: { playAudio: boolean }) {
  const { nodes, materials, scene } = useGLTF("/models/tshirt_new.glb");
  const modelRef = useRef();
  const [audioLevel, setAudioLevel] = useState(0);
  const wiggleBones = useRef<WiggleBone[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // React Spring Animations
  const audioSpring = useSpring({
    rotationX: audioLevel * 0.6,
    config: { mass: 1, tension: 120, friction: 2 },
  });

  const [mouseRotation, setMouseRotation] = useState({ x: 0, y: 0 });
  const [gyroRotation, setGyroRotation] = useState({ x: 0, y: 0 });

  // Mouse Movement Handler
  const handleMouseMove = (event: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (event.clientX / innerWidth) * 2 - 1;
    const y = -(event.clientY / innerHeight) * 2 + 1;
    setMouseRotation({ x: y * 0.2, y: x * 0.2 });
  };

  // Device Orientation Handler
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    const beta = (event.beta || 0) * 0.5;
    const gamma = (event.gamma || 0) * 0.5;
    setGyroRotation({ x: beta, y: gamma });
  };

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
      wiggleBone.options.stiffness = 300 + scaledAudioLevel * 1001;
      wiggleBone.options.damping = 20 + scaledAudioLevel * 50;
      wiggleBone.update();
    });
  });

  // Add Wiggle Bones
  useEffect(() => {
    if (!scene || !nodes) return;

    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
      }
    });

    ["Bone"].forEach((rootBone) => {
      if (!nodes[rootBone]) return;

      nodes[rootBone].traverse((bone: any) => {
        if (bone.isBone) {
          const wiggleBone = new WiggleBone(bone, {
            damping: 30,
            stiffness: 30,
          });
          wiggleBones.current.push(wiggleBone);
        }
      });
    });

    return () => {
      if (wiggleBones.current?.length > 0) {
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
      }
    };
  }, [nodes, scene]);

  return (
    <animated.group
      ref={modelRef}
      dispose={null}
      scale={[0.174, 0.174, 0.174]}
      position={[-14, -0.5, -0.5]}
      rotation-x={
        audioSpring.rotationX.get() + mouseRotation.x + gyroRotation.x
      }
      rotation-y={mouseRotation.y + gyroRotation.y}
    >
      <skinnedMesh
        geometry={nodes.Male_TshirtMesh.geometry}
        material={materials.lambert1}
        skeleton={nodes.Male_TshirtMesh.skeleton}
      />
      <primitive object={nodes.Bone} />
    </animated.group>
      <animated.group
          ref={modelRef}
          dispose={null}
          scale={[0.174, 0.174, 0.174]}
          // position={[-14, -0.5, -0.5]}
          position={[0,0,0]}
          rotation-x={
              audioSpring.rotationX.get() + mouseRotation.x + gyroRotation.x
          }
          rotation-y={mouseRotation.y + gyroRotation.y}
      >
        <skinnedMesh
            geometry={nodes.Male_TshirtMesh.geometry}
            material={materials.lambert1}
            skeleton={nodes.Male_TshirtMesh.skeleton}
        />
        <primitive object={nodes.Bone}/>
      </animated.group>
  );
}

useGLTF.preload("/models/tshirt.glb");
