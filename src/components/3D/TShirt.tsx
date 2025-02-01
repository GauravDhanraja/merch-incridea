/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
//@ts-expect-error blah
import { WiggleBone } from "wiggle/spring";

export function TShirt({ playAudio }: { playAudio: boolean }) {
  const { nodes, materials, scene } = useGLTF("/models/tshirt.glb");
  const modelRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [audioLevel, setAudioLevel] = useState(0);
  const wiggleBones = useRef<WiggleBone[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    setDirection((prev) => -prev);
  }, [audioLevel]);

  const audioSpring = useSpring({
    rotationX: direction * audioLevel * 0.8,
    rotationY: direction * audioLevel * 2,
    config: { mass: 1, tension: 50, friction: 5 }, // Smooth transition
  });

  const mouseSpring = useSpring({
    rotationX: mousePosition.y * 0.01,
    rotationY: mousePosition.x * 1,
    config: { mass: 1, tension: 120, friction: 40 },
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
      audioContext.close().catch(console.error);
    };
  }, []);

  // Control Audio Playback
  useEffect(() => {
    if (audioElementRef.current) {
      if (playAudio) {
        audioElementRef.current.play().catch(console.error);
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
      wiggleBone.options.damping = 20 + scaledAudioLevel * 10;
      wiggleBone.update();
    });
  });

  // Add Wiggle Bones
  useEffect(() => {
    if (!scene || !nodes) return;

    const boneNames = [
      //"Root",
      "Bone002",
      "Bone003",
      "Bone004",
      "Bone005",
      "Bone006",
      "Bone007",
      "Bone008",
      "Bone009",
      "Bone010",
      "Bone011",
      "Bone012",
      "Bone013",
      "Bone014",
      "Bone015",
    ];

    const visited = new Set(); // Track visited bones to avoid duplicates

    boneNames.forEach((boneName) => {
      const bone = nodes[boneName];
      if (!bone || visited.has(bone)) return;

      visited.add(bone);

      //@ts-expect-error blah
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
      //@ts-expect-error blah
      ref={modelRef}
      dispose={null}
      scale={[0.7, 0.7, 0.7]}
      position={[0, -2, 0]}
      rotation-x={mouseSpring.rotationX.to(
        (mouseX) => audioSpring.rotationX.get() + mouseX,
      )}
      rotation-y={mouseSpring.rotationY.to(
        (mouseY) => audioSpring.rotationY.get() + mouseY,
      )}
    >
      <skinnedMesh
        //@ts-expect-error blah
        geometry={nodes.BROCKCREATIVE_SHIRT.geometry}
        material={materials["1"]}
        //@ts-expect-error blah
        skeleton={nodes.BROCKCREATIVE_SHIRT.skeleton}
      />

      {nodes.Bone && <primitive object={nodes.Bone} />}
    </animated.group>
  );
}

useGLTF.preload("/models/tshirt.glb");
