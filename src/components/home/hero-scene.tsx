"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MARK_C_PATH, MARK_STAR_PATH, MARK_VIEWBOX } from "@/lib/logo-paths";

export type HeroMotion = { intro: number; scroll: number };

/** Extrude the traced logo into two meshes that share the C's centre. */
function useMarkGeometry() {
  return useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}"><path d="${MARK_C_PATH}"/><path d="${MARK_STAR_PATH}"/></svg>`;
    const { paths } = new SVGLoader().parse(svg);
    const extrude = (path: (typeof paths)[number], depth: number, bevel: number) =>
      new THREE.ExtrudeGeometry(path.toShapes(), {
        depth,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel * 0.7,
        bevelSegments: 8,
        curveSegments: 10,
      });

    const c = extrude(paths[0], 64, 12);
    const star = extrude(paths[1], 44, 10);

    c.computeBoundingBox();
    star.computeBoundingBox();
    const cCenter = c.boundingBox!.getCenter(new THREE.Vector3());
    const starCenter = star.boundingBox!.getCenter(new THREE.Vector3());
    c.translate(-cCenter.x, -cCenter.y, -cCenter.z);
    star.translate(-starCenter.x, -starCenter.y, -starCenter.z);

    const starOffset = new THREE.Vector3(starCenter.x - cCenter.x, starCenter.y - cCenter.y, 26);
    return { c, star, starOffset };
  }, []);
}

function Mark({ motion, reduced }: { motion: MutableRefObject<HeroMotion>; reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const star = useRef<THREE.Mesh>(null);
  const { c, star: starGeo, starOffset } = useMarkGeometry();

  useFrame((state, delta) => {
    const g = root.current;
    const t = tilt.current;
    if (!g || !t || !star.current) return;
    const { intro, scroll } = motion.current;
    const time = state.clock.elapsedTime;

    // Fit the mark to the canvas: narrower canvases get a smaller logo.
    const fit = Math.min(1, state.viewport.width / 6.2) * 0.0092;
    const s = fit * (0.35 + 0.65 * intro) * (1 - scroll * 0.35);
    g.scale.set(s, -s, s);
    g.position.y = scroll * 1.8 + (reduced ? 0 : Math.sin(time * 0.8) * 0.08);
    g.rotation.y = (1 - intro) * -Math.PI * 1.2 + scroll * Math.PI * 0.9;

    // Pointer tilt, eased so it trails the cursor.
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;
    t.rotation.y = THREE.MathUtils.damp(t.rotation.y, px * 0.45 + Math.sin(time * 0.35) * 0.18, 3, delta);
    t.rotation.x = THREE.MathUtils.damp(t.rotation.x, py * 0.3, 3, delta);

    star.current.rotation.y = reduced ? 0 : time * 0.9;
  });

  return (
    <group ref={root}>
      <group ref={tilt}>
        <mesh geometry={c} castShadow>
          <meshPhysicalMaterial
            // Navy-tinted chrome: echoes the brand C and keeps white type legible on top.
            color="#5d6399"
            metalness={1}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.35}
          />
        </mesh>
        <mesh ref={star} geometry={starGeo} position={starOffset}>
          <meshStandardMaterial
            color="#5a4fff"
            emissive="#5a4fff"
            emissiveIntensity={2.6}
            metalness={0.35}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#070b1a"]} />
      <group rotation={[-Math.PI / 3, 0, 1]}>
        <Lightformer form="circle" intensity={5} position={[0, 5, -9]} scale={8} />
        <Lightformer form="rect" intensity={3} position={[-5, 1, -1]} scale={[10, 2, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" color="#4b3fff" intensity={12} position={[5, -1, -1]} scale={[12, 3, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" color="#948dff" intensity={6} position={[-3, -4, 4]} scale={4} />
        <Lightformer form="rect" intensity={2} position={[0, -6, 2]} scale={[20, 1, 1]} rotation-x={Math.PI / 2} />
      </group>
    </Environment>
  );
}

export default function HeroScene({ motion }: { motion: MutableRefObject<HeroMotion> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  // Client-only component (loaded with ssr: false), so reading matchMedia here is safe.
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    // Stop rendering once the hero is off screen.
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={visible ? (reduced ? "demand" : "always") : "never"}
        aria-hidden="true"
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[4, 6, 6]} intensity={1.2} />
        <pointLight position={[0, 0, 2]} intensity={6} color="#4b3fff" distance={6} />
        <Mark motion={motion} reduced={reduced} />
        {!reduced && <Sparkles count={70} scale={[9, 6, 4]} size={2.6} speed={0.35} color="#b4aeff" opacity={0.85} />}
        <Studio />
      </Canvas>
    </div>
  );
}
