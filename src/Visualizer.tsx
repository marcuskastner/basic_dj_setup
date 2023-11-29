import React from "react";
import { useFrame } from "@react-three/fiber";
import { Color } from "three";
import { MeshLineGeometry } from "meshline";
import { AudioAnalyzer } from "./lib/audio-analyzer";
import { extendMeshLine } from "./lib/meshline";
import { normalizeBetween, radians } from "./lib/math";

extendMeshLine();

type Props = {
  analyzer: AudioAnalyzer;
  lineWidth?: number;
  segments?: number;
  radius?: number;
  height?: number;
};

export default function Visualizer({
  analyzer,
  lineWidth = 0.02,
  segments = 100,
  radius = 2,
  height = 1,
}: Props) {
  const lineRef = React.useRef<MeshLineGeometry>(null!);

  useFrame(() => {
    if (!analyzer) return;
    const fft = analyzer.getFFT();
    const points: number[] = [];
    for (let i = 0; i <= segments; i++) {
      const val = normalizeBetween(fft[i < segments ? i : 0], 0, 255) * height;
      const angle = i * (360 / segments);
      const theta = radians(angle);
      const x = (radius + val) * Math.cos(theta);
      const y = -(radius + val) * Math.sin(theta);
      points.push(x, y, 0);
    }
    lineRef.current?.setPoints(points);
  });

  return (
    <mesh>
      <meshLineGeometry ref={lineRef} attach="geometry" />
      <meshLineMaterial
        attach="material"
        lineWidth={lineWidth}
        color={new Color("#C36DFF")}
      />
    </mesh>
  );
}
