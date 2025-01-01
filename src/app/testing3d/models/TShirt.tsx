"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { WiggleBone } from "wiggle/spring";

export function TShirt(props) {
  const { nodes, materials, scene } = useGLTF("/models/tshirt.glb");
  const modelRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [audioLevel, setAudioLevel] = useState(0);
  const wiggleBones = useRef([]);

  const audioSpring = useSpring({
    rotationX: audioLevel * 0.5,
    config: { mass: 1, tension: 120, friction: 4 },
  });

  const mouseSpring = useSpring({
    rotationX: mousePosition.y * 0.2,
    rotationY: mousePosition.x * 0.2,
    config: { mass: 1, tension: 120, friction: 7 },
  });

  const handleMouseMove = (event) => {
    const { innerWidth, innerHeight } = window;
    setMousePosition({
      x: (event.clientX / innerWidth) * 2 - 1,
      y: -(event.clientY / innerHeight) * 2 + 1,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // audio processing
  useEffect(() => {
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const audioElement = new Audio("/music/anthem.mp3");
    audioElement.loop = true;

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioElement.play();

    const updateAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      setAudioLevel(avg / 255);
      requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();

    return () => {
      audioElement.pause();
      audioContext.close();
    };
  }, []);

  useFrame(() => {
    wiggleBones.current.forEach((wiggleBone) => {
      const scaledAudioLevel = Math.pow(audioLevel, 2);
      wiggleBone.options.stiffness = 300 + scaledAudioLevel * 1000;
      wiggleBone.options.damping = 20 + scaledAudioLevel * 50;
      wiggleBone.update();
    });
  });

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    ["Bone"].forEach((rootBone) => {
      if (!nodes[rootBone]) return;

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
  }, [nodes]);

  return (
    <animated.group
      {...props}
      dispose={null}
      ref={modelRef}
      scale={[2, 2, 2]}
      position={[0, -2, 0]}
      rotation-x={audioSpring.rotationX.to(audioX => audioX + mouseSpring.rotationX.get())}
      rotation-y={mouseSpring.rotationY}
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
