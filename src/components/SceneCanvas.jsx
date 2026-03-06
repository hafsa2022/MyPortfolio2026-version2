import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

const isTouchDevice =
  typeof window !== "undefined" &&
  typeof matchMedia !== "undefined" &&
  matchMedia("(pointer: coarse)").matches;

const SceneCanvas = ({
  children,
  camera = { position: [0, 0, 15], fov: 45 },
  shadows = false,
  frameloop,
  className,
}) => {
  const dpr = useMemo(() => {
    if (isTouchDevice) return [1, 1.5];
    return [1, 2];
  }, []);

  return (
    <Canvas
      className={className}
      shadows={shadows}
      dpr={dpr}
      frameloop={frameloop}
      camera={camera}
      gl={{
        antialias: !isTouchDevice,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: true,
      }}
      onCreated={({ gl, scene }) => {
        gl.outputEncoding = THREE.sRGBEncoding;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        // three r0.182 still supports this flag
        // @ts-ignore
        gl.physicallyCorrectLights = true;
        scene.background = null;
      }}
      onContextLost={(e) => {
        e.preventDefault();
        // eslint-disable-next-line no-console
        console.warn("WebGL context lost");
      }}
      onContextRestored={() => {
        // eslint-disable-next-line no-console
        console.warn("WebGL context restored");
      }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      {children}
      <Preload all />
    </Canvas>
  );
};

export default SceneCanvas;

