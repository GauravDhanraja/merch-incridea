// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { useGLTF } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { useAtom } from "jotai";
// import { wiggleAtom } from "~/app/testing3d/page";
// import { WiggleBone } from "wiggle/spring";

// export function FridgeMagnet(props) {
//   const { nodes, materials, scene } = useGLTF("/models/fridge_magnet.glb");
//   const modelRef = useRef();

//   // useFrame(({ camera }) => {
//   //   console.log("Camera position:", camera.position);
//   // });

//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   // Mouse movement handler
//   const handleMouseMove = (event) => {
//     const { innerWidth, innerHeight } = window;
//     setMousePosition({
//       x: (event.clientX / innerWidth) * 2 - 1, // Normalized X coordinate
//       y: -(event.clientY / innerHeight) * 2 + 1, // Normalized Y coordinate
//     });
//   };

//   useEffect(() => {
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   useFrame(() => {
//     if (modelRef.current) {
//       // Rotate model based on mouse position
//       modelRef.current.rotation.y = mousePosition.x * Math.PI * 0.2; // Horizontal rotation
//       modelRef.current.rotation.x = mousePosition.y * Math.PI * 0.2; // Vertical tilt
//     }
//   });

//   const [wiggle] = useAtom(wiggleAtom);
//   const wiggleBones = useRef([]);

//   useEffect(() => {
//     scene.traverse((node) => {
//       if (node.isMesh) {
//         node.castShadow = true;
//       }
//     });
//   }, [scene]);

//   useEffect(() => {
//     wiggleBones.current.length = 0;

//     if (!wiggle) {
//       return;
//     }

//     ["Bone"].forEach((rootBone) => {
//       if (!nodes[rootBone]) {
//         return;
//       }
//       nodes[rootBone].traverse((bone) => {
//         if (bone.isBone) {
//           const wiggleBone = new WiggleBone(bone, {
//             damping: 30,
//             stiffness: 300,
//           });
//           wiggleBones.current.push(wiggleBone);
//         }
//       });
//     });

//     return () => {
//       wiggleBones.current.forEach((wiggleBone) => {
//         wiggleBone.reset();
//         wiggleBone.dispose();
//       });
//     };
//   }, [nodes, wiggle]);

//   useFrame(() => {
//     wiggleBones.current.forEach((wiggleBone) => {
//       wiggleBone.update();
//     });
//   });

//   return (
//     <group
//       {...props}
//       dispose={null}
//       ref={modelRef}
//       scale={[1, 1, 1]}
//       position={[0, -1, -1]}
//       rotation={[0, 0, -0.67]}
//     >
//       <group position={[2.564, 0, 0]} rotation={[0, 0, 0.909]}>
//         <skinnedMesh
//           geometry={nodes.Cube.geometry}
//           material={materials["Material.001"]}
//           skeleton={nodes.Cube.skeleton}
//         />
//         <primitive object={nodes.Bone} />
//       </group>
//     </group>
//   );
// }

// useGLTF.preload("/models/fridge_magnet.glb");
