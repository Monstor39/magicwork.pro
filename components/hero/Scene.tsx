"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const ACCENT = new THREE.Color("#6D28D9");
const ACCENT_LIGHT = new THREE.Color("#8B5CF6");
const BLUE = new THREE.Color("#2563EB");

type Pulse = {
  edgeIndex: number;
  t: number;
  speed: number;
  color: THREE.Color;
};

type ClickRef = { x: number; y: number; time: number } | null;

function NeuralCloud({
  count,
  connectRadius,
  clickRef,
}: {
  count: number;
  connectRadius: number;
  clickRef: React.RefObject<ClickRef>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const haloRef = useRef<THREE.InstancedMesh>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const pulsesRef = useRef<THREE.Points>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const { mouse, viewport } = useThree();

  const nodes = useMemo(() => {
    const items: { base: THREE.Vector3; phase: number; speed: number }[] = [];
    for (let i = 0; i < count; i++) {
      const r = 4.2 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      items.push({
        base: new THREE.Vector3(x, y, z),
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.5,
      });
    }
    return items;
  }, [count]);

  const edges = useMemo(() => {
    const list: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i].base.distanceTo(nodes[j].base);
        if (d < connectRadius) list.push([i, j]);
      }
    }
    return list;
  }, [nodes, connectRadius]);

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(edges.length * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [edges.length]);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#5B21B6"),
        transparent: true,
        opacity: 0.32,
      }),
    [],
  );

  const PULSE_CAPACITY = 60;
  const pulseGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(PULSE_CAPACITY * 3), 3),
    );
    geo.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(PULSE_CAPACITY * 3), 3),
    );
    geo.setAttribute("alpha", new THREE.BufferAttribute(new Float32Array(PULSE_CAPACITY), 1));
    geo.setDrawRange(0, 0);
    return geo;
  }, []);

  const pulseMat = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {},
      vertexShader: `
        attribute float alpha;
        attribute vec3 color;
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          vAlpha = alpha;
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 14.0 * (8.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          float core = smoothstep(0.5, 0.0, d);
          float a = core * vAlpha;
          gl_FragColor = vec4(vColor * a, a);
        }
      `,
    });
    return mat;
  }, []);

  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ACCENT_LIGHT,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const haloMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ACCENT_LIGHT,
        transparent: true,
        opacity: 0.18,
      }),
    [],
  );

  const pulsesState = useRef<Pulse[]>([]);
  const lastSpawnRef = useRef(0);

  // pre-allocated scratch for useFrame (sync-init so it's ready before first frame)
  const dummyRef = useRef(new THREE.Object3D());
  const positions = useMemo(() => new Float32Array(nodes.length * 3), [nodes.length]);

  // seed positions[] with base coords so the first lineGeo update doesn't write NaN
  useMemo(() => {
    for (let i = 0; i < nodes.length; i++) {
      positions[i * 3] = nodes[i].base.x;
      positions[i * 3 + 1] = nodes[i].base.y;
      positions[i * 3 + 2] = nodes[i].base.z;
    }
  }, [nodes, positions]);

  useEffect(() => {
    const dummy = dummyRef.current;
    if (!meshRef.current) return;
    nodes.forEach((n, i) => {
      dummy.position.copy(n.base);
      dummy.scale.setScalar(0.05);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      if (haloRef.current) {
        dummy.scale.setScalar(0.12);
        dummy.updateMatrix();
        haloRef.current.setMatrixAt(i, dummy.matrix);
      }
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (haloRef.current) haloRef.current.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.07) * 0.18;
      // anchor scene to the right side so it doesn't fight with the headline copy on the left
      const baseX = viewport.width * 0.18;
      const tx = baseX + (mouse.x * viewport.width) / 40;
      const ty = (mouse.y * viewport.height) / 40;
      groupRef.current.position.x += (tx - groupRef.current.position.x) * 0.05;
      groupRef.current.position.y += (ty - groupRef.current.position.y) * 0.05;
    }

    const mouseWorldX = (mouse.x * viewport.width) / 2;
    const mouseWorldY = (mouse.y * viewport.height) / 2;
    const click = clickRef.current;
    const clickAge = click ? t - click.time : Infinity;
    const clickActive = clickAge < 1.2;

    if (ringRef.current) {
      if (clickActive && click) {
        ringRef.current.position.set(click.x, click.y, 0);
        const k = Math.min(1, clickAge / 1.2);
        const scale = 0.4 + k * 4.2;
        ringRef.current.scale.setScalar(scale);
        ringMat.opacity = (1 - k) * 0.55;
      } else {
        ringMat.opacity = 0;
      }
    }

    const dummy = dummyRef.current;
    const ATTRACT_RADIUS = 3.2;
    const ATTRACT_RADIUS_SQ = ATTRACT_RADIUS * ATTRACT_RADIUS;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const wobble = 0.18;
      let x = n.base.x + Math.sin(t * n.speed + n.phase) * wobble;
      let y = n.base.y + Math.cos(t * n.speed * 0.9 + n.phase) * wobble;
      const z = n.base.z + Math.sin(t * n.speed * 0.7 + n.phase) * wobble;

      const dx = mouseWorldX - x;
      const dy = mouseWorldY - y;
      const dSq = dx * dx + dy * dy;
      let scale = 0.045 + 0.012 * Math.sin(t * 1.2 + n.phase);

      if (dSq < ATTRACT_RADIUS_SQ) {
        const fall = 1 - dSq / ATTRACT_RADIUS_SQ;
        const force = fall * 0.55;
        x += dx * force * 0.18;
        y += dy * force * 0.18;
        scale += fall * 0.04;
      }

      if (clickActive && click) {
        const cdx = click.x - x;
        const cdy = click.y - y;
        const cd = Math.hypot(cdx, cdy);
        const wave = Math.max(0, 1 - Math.abs(cd - clickAge * 4) / 1.4);
        scale += wave * 0.06 * (1 - clickAge / 1.2);
      }

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      if (haloRef.current) {
        dummy.scale.setScalar(scale * 2.6);
        dummy.updateMatrix();
        haloRef.current.setMatrixAt(i, dummy.matrix);
      }
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (haloRef.current) haloRef.current.instanceMatrix.needsUpdate = true;

    const linePos = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    const linePosArr = linePos.array as Float32Array;
    for (let e = 0; e < edges.length; e++) {
      const [a, b] = edges[e];
      linePosArr[e * 6] = positions[a * 3];
      linePosArr[e * 6 + 1] = positions[a * 3 + 1];
      linePosArr[e * 6 + 2] = positions[a * 3 + 2];
      linePosArr[e * 6 + 3] = positions[b * 3];
      linePosArr[e * 6 + 4] = positions[b * 3 + 1];
      linePosArr[e * 6 + 5] = positions[b * 3 + 2];
    }
    linePos.needsUpdate = true;

    const spawnInterval = clickActive ? 0.05 : 0.16;
    if (
      t - lastSpawnRef.current > spawnInterval &&
      pulsesState.current.length < PULSE_CAPACITY &&
      edges.length > 0
    ) {
      lastSpawnRef.current = t;
      const palette = [ACCENT, ACCENT_LIGHT, BLUE];
      pulsesState.current.push({
        edgeIndex: Math.floor(Math.random() * edges.length),
        t: 0,
        speed: 0.6 + Math.random() * 0.7,
        color: palette[Math.floor(Math.random() * palette.length)].clone(),
      });
    }

    const pPos = pulseGeo.getAttribute("position") as THREE.BufferAttribute;
    const pCol = pulseGeo.getAttribute("color") as THREE.BufferAttribute;
    const pAlpha = pulseGeo.getAttribute("alpha") as THREE.BufferAttribute;
    const pPosArr = pPos.array as Float32Array;
    const pColArr = pCol.array as Float32Array;
    const pAlphaArr = pAlpha.array as Float32Array;
    let active = 0;
    for (const pulse of pulsesState.current) {
      pulse.t += pulse.speed * 0.018;
      if (pulse.t >= 1) continue;
      const [a, b] = edges[pulse.edgeIndex];
      const ax = positions[a * 3];
      const ay = positions[a * 3 + 1];
      const az = positions[a * 3 + 2];
      const bx = positions[b * 3];
      const by = positions[b * 3 + 1];
      const bz = positions[b * 3 + 2];
      const x = ax + (bx - ax) * pulse.t;
      const y = ay + (by - ay) * pulse.t;
      const z = az + (bz - az) * pulse.t;
      pPosArr[active * 3] = x;
      pPosArr[active * 3 + 1] = y;
      pPosArr[active * 3 + 2] = z;
      pColArr[active * 3] = pulse.color.r;
      pColArr[active * 3 + 1] = pulse.color.g;
      pColArr[active * 3 + 2] = pulse.color.b;
      pAlphaArr[active] = Math.sin(pulse.t * Math.PI);
      active++;
    }
    pulsesState.current = pulsesState.current.filter((p) => p.t < 1);
    pulseGeo.setDrawRange(0, active);
    pPos.needsUpdate = true;
    pCol.needsUpdate = true;
    pAlpha.needsUpdate = true;
  });

  return (
    <>
      <group ref={groupRef}>
        <instancedMesh ref={haloRef} args={[undefined, undefined, count]} material={haloMat}>
          <sphereGeometry args={[1, 10, 10]} />
        </instancedMesh>
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
          <sphereGeometry args={[1, 14, 14]} />
          <meshBasicMaterial color={ACCENT} />
        </instancedMesh>
        <lineSegments ref={linesRef} geometry={lineGeo} material={lineMat} />
        <points ref={pulsesRef} geometry={pulseGeo} material={pulseMat} />
      </group>
      {/* click ring lives outside the rotating group so it always faces camera (no edge-on "stick") */}
      <mesh ref={ringRef} material={ringMat}>
        <ringGeometry args={[0.45, 0.6, 48]} />
      </mesh>
    </>
  );
}

export function Scene() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const clickRef = useRef<ClickRef>(null);

  useEffect(() => {
    setMounted(true);
    const reduceQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQ = window.matchMedia("(max-width: 640px)");
    setReduced(reduceQ.matches);
    setIsMobile(mobileQ.matches);
    const onR = (e: MediaQueryListEvent) => setReduced(e.matches);
    const onM = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    reduceQ.addEventListener("change", onR);
    mobileQ.addEventListener("change", onM);
    return () => {
      reduceQ.removeEventListener("change", onR);
      mobileQ.removeEventListener("change", onM);
    };
  }, []);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const heroEl = document.getElementById("top");
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      if (
        e.clientY < rect.top ||
        e.clientY > rect.bottom ||
        e.clientX < rect.left ||
        e.clientX > rect.right
      )
        return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      const fov = 50;
      const distance = 11;
      const aspect = rect.width / rect.height;
      const heightAtZ0 = 2 * Math.tan((fov * Math.PI) / 360) * distance;
      const widthAtZ0 = heightAtZ0 * aspect;
      clickRef.current = {
        x: nx * (widthAtZ0 / 2),
        y: ny * (heightAtZ0 / 2),
        time: performance.now() / 1000,
      };
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  if (!mounted) return null;

  if (reduced) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_40%,rgba(139,92,246,0.10),transparent_60%)]"
      />
    );
  }

  const count = isMobile ? 50 : 110;
  const radius = isMobile ? 2.2 : 1.8;

  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(139,92,246,0.16),transparent_55%),radial-gradient(circle_at_22%_85%,rgba(37,99,235,0.10),transparent_55%)]"
      />
      <Canvas
        dpr={[1, 1.6]}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 11], fov: 50 }}
      >
        <NeuralCloud count={count} connectRadius={radius} clickRef={clickRef} />
      </Canvas>
      {/* hard wash on the left half so the headline never collides with the graph */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-1/2 sm:right-1/3 bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0.95)_42%,rgba(255,255,255,0.55)_72%,transparent_100%)]" />
      {/* soft global vignette to keep periphery clean */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_45%,transparent_22%,rgba(255,255,255,0.45)_62%,rgba(255,255,255,0.9)_92%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}
