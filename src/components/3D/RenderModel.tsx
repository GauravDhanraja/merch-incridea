import { Canvas } from "@react-three/fiber";
import React, { Suspense, useLayoutEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import {
  Bloom, ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import Parallax from "parallax-js";
import type * as THREE from "three";
import Image from "next/image";
import { Color, PointLight, SpotLight } from "three";

interface RenderModelProps {
  children?: React.ReactNode;
  className?: string;
}

const RenderModel: React.FC<RenderModelProps> = ({ children }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const parallaxInstance = useRef<Parallax | null>(null);
  useRef<THREE.Group>(null);
  // Ref for the children group

  useLayoutEffect(() => {
    if (sceneRef.current) {
      parallaxInstance.current = new Parallax(sceneRef.current, {
        relativeInput: true,
        //limitX: true,
        //limitY: true,
        scalarX: 10,
        scalarY: 2,
      });
    }
    return () => {
      parallaxInstance.current?.destroy();
    };
  }, []);

  const light_foreground = new PointLight();
  const light_background = new SpotLight();
  light_foreground.position.set(1, 1, 0);
  light_background.position.set(1, 7, 0);
  light_foreground.intensity = 50;
  light_background.color = new Color().setColorName("green");
  light_background.intensity = 200;

  return (
    <div
      className="flex h-screen w-screen select-none flex-col items-center justify-center overflow-hidden"
      id="scene"
      ref={sceneRef}
    >
      {/* Background layer with parallax effect */}
      <div className="h-[110vh] w-[110vw] scale-[1]" data-depth="0.1">
        <Image
          src="/backdrop.webp"
          alt="Portal"
          width={1920}
          height={1920}
          className="h-full w-full object-cover object-center"
        />
      </div>
      {/* Canvas for 3D content */}
      <div className="z-40 h-screen w-screen" data-depth="0.5">
        <Canvas
          gl={{ antialias: false, stencil: false, pixelRatio: 1, alpha: true }}
          data-depth="0.2"
          onCreated={({ camera, scene }) => {
            camera.add(light_foreground);
            camera.add(light_background);
            scene.add(camera);
          }}
        >
          {/* Lighting setup */}
          {/*<ambientLight color="white" intensity={0.2}/>*/}
          {/*<pointLight*/}
          {/*  // angle={90}*/}
          {/*  color={"white"}*/}
          {/*  position={[0, 1, -5]}*/}
          {/*  intensity={30}*/}
          {/*  // onUpdate={(self) => {*/}
          {/*  //   self.target.position.set(0, 0, 0);*/}
          {/*  //   self.target.updateMatrixWorld();*/}
          {/*  // }}*/}
          {/*/>*/}
          {/*<pointLight intensity={30} position={[-1, -2, 2.5]} />*/}
          {/*<pointLight intensity={30} position={[1, 2, 2.5]} />*/}
          {/*<pointLight intensity={30} position={[1, 2, 2.5]} />*/}
          <Suspense fallback={null}>
            {/*<PerspectiveCamera makeDefault position={[0, 0, 8]} />*/}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minAzimuthAngle={-Math.PI / 4}
              // maxAzimuthAngle={Math.PI / 4}
              minPolarAngle={1}
              maxPolarAngle={Math.PI - Math.PI / 2.5}
            />
            {children}
          </Suspense>
          {/* Postprocessing effects */}
          <EffectComposer enableNormalPass>
            <ChromaticAberration
              radialModulation={false}
              modulationOffset={0}
              opacity={0.2}
            />
            <Bloom mipmapBlur intensity={0.02} />
            <Vignette eskil={false} offset={0.2} darkness={1.2} />
            <Noise opacity={0.06} />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
};

export default RenderModel;
