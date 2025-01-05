"use client";
import { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { WiggleBone } from "wiggle/spring";

export function TShirt({ playAudio }: { playAudio: boolean }) {
  const { nodes, materials, scene } = useGLTF("/models/tshirt_new.glb");
  const modelRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
    rotationY: mousePosition.x * 0.7,
    config: { mass: 1, tension: 120, friction: 7 },
  });

  // Mouse Movement Handler
  const handleMouseMove = (event: MouseEvent) => {
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

    const boneNames = [
      "Bone", // Root Bone
      "Bone001", // Child of Bone
      "Bone002", // Child of Bone001
      "Bone005", // Child of Bone002
      "Bone006", // Child of Bone005
      "Bone003", // Child of Bone002
      "Bone004", // Child of Bone003
    ];

    const visited = new Set(); // Track visited bones to avoid duplicates

    boneNames.forEach((boneName) => {
      const bone = nodes[boneName];
      if (!bone || visited.has(bone)) return;

      visited.add(bone);

      if (bone.isBone) {
        const wiggleBone = new WiggleBone(bone, {
          damping: 30,
          stiffness: 30,
        });
        wiggleBones.current.push(wiggleBone);
      }
    });

    return () => {
      if (wiggleBones.current.length > 0) {
        // Start cleanup from bottom-most bones
        wiggleBones.current.reverse().forEach((wiggleBone: WiggleBone) => {
          try {
            if (wiggleBone) {
              // Reset wiggle effect safely
              wiggleBone.reset?.();

              // Ensure the bone's parent exists before attempting removal
              if (wiggleBone.bone?.parent) {
                const parent = wiggleBone.bone.parent;

                // Remove the bone from its parent
                parent.remove(wiggleBone.bone);
              }

              // Dispose the wiggle bone safely
              if (typeof wiggleBone.dispose === "function") {
                wiggleBone.dispose();
              }
            }
          } catch (error) {
            console.error("Error during wiggle bone disposal:", error);
          }
        });

        // Clear the array after cleanup
        wiggleBones.current = [];
      }
    };
  }, [nodes, scene]);

  return (
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
