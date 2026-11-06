import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ChessPiece3DProps {
  type: string;
  color: "w" | "b";
  position: [number, number, number];
  onClick?: () => void;
  isSelected?: boolean;
}

/* ─────────────────────────────────────────────
   STAUNTON LATHE PROFILES – High-detail curves
   Each profile is an array of Vector2(radius, height)
   revolved around the Y axis.
─────────────────────────────────────────────*/

const pawnProfile = (): THREE.Vector2[] => [
  // Base
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.38, 0),
  new THREE.Vector2(0.40, 0.02),
  new THREE.Vector2(0.40, 0.06),
  new THREE.Vector2(0.38, 0.08),
  new THREE.Vector2(0.30, 0.10),
  // Base molding
  new THREE.Vector2(0.28, 0.12),
  new THREE.Vector2(0.26, 0.14),
  // Stem taper
  new THREE.Vector2(0.18, 0.20),
  new THREE.Vector2(0.15, 0.35),
  new THREE.Vector2(0.14, 0.50),
  // Collar
  new THREE.Vector2(0.18, 0.55),
  new THREE.Vector2(0.22, 0.58),
  new THREE.Vector2(0.22, 0.61),
  new THREE.Vector2(0.18, 0.64),
  // Neck
  new THREE.Vector2(0.13, 0.70),
  new THREE.Vector2(0.12, 0.76),
  // Ball head
  new THREE.Vector2(0.16, 0.82),
  new THREE.Vector2(0.19, 0.88),
  new THREE.Vector2(0.20, 0.94),
  new THREE.Vector2(0.19, 1.00),
  new THREE.Vector2(0.16, 1.05),
  new THREE.Vector2(0.10, 1.09),
  new THREE.Vector2(0.04, 1.11),
  new THREE.Vector2(0, 1.12),
];

const rookProfile = (): THREE.Vector2[] => [
  // Base
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.42, 0),
  new THREE.Vector2(0.44, 0.02),
  new THREE.Vector2(0.44, 0.07),
  new THREE.Vector2(0.42, 0.09),
  new THREE.Vector2(0.34, 0.11),
  // Base molding
  new THREE.Vector2(0.32, 0.14),
  new THREE.Vector2(0.30, 0.16),
  // Stem
  new THREE.Vector2(0.22, 0.22),
  new THREE.Vector2(0.20, 0.45),
  new THREE.Vector2(0.19, 0.65),
  // Collar
  new THREE.Vector2(0.23, 0.70),
  new THREE.Vector2(0.26, 0.73),
  new THREE.Vector2(0.26, 0.76),
  new THREE.Vector2(0.23, 0.79),
  // Neck
  new THREE.Vector2(0.22, 0.82),
  new THREE.Vector2(0.22, 0.88),
  // Rim flare
  new THREE.Vector2(0.28, 0.92),
  new THREE.Vector2(0.32, 0.95),
  new THREE.Vector2(0.34, 0.98),
  new THREE.Vector2(0.34, 1.08),
  // Top platform inner
  new THREE.Vector2(0.28, 1.08),
  new THREE.Vector2(0.28, 1.04),
  new THREE.Vector2(0, 1.04),
];

const bishopProfile = (): THREE.Vector2[] => [
  // Base
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.40, 0),
  new THREE.Vector2(0.42, 0.02),
  new THREE.Vector2(0.42, 0.07),
  new THREE.Vector2(0.40, 0.09),
  new THREE.Vector2(0.32, 0.11),
  // Base molding
  new THREE.Vector2(0.30, 0.14),
  new THREE.Vector2(0.28, 0.16),
  // Stem
  new THREE.Vector2(0.20, 0.22),
  new THREE.Vector2(0.17, 0.45),
  new THREE.Vector2(0.16, 0.65),
  // Collar
  new THREE.Vector2(0.20, 0.70),
  new THREE.Vector2(0.24, 0.73),
  new THREE.Vector2(0.24, 0.76),
  new THREE.Vector2(0.20, 0.79),
  // Neck
  new THREE.Vector2(0.15, 0.85),
  // Mitre (bishop hat)
  new THREE.Vector2(0.20, 0.92),
  new THREE.Vector2(0.23, 1.00),
  new THREE.Vector2(0.24, 1.08),
  new THREE.Vector2(0.23, 1.16),
  new THREE.Vector2(0.20, 1.24),
  new THREE.Vector2(0.15, 1.30),
  new THREE.Vector2(0.09, 1.35),
  new THREE.Vector2(0.04, 1.37),
  // Tip ball
  new THREE.Vector2(0.06, 1.39),
  new THREE.Vector2(0.07, 1.41),
  new THREE.Vector2(0.06, 1.43),
  new THREE.Vector2(0.03, 1.44),
  new THREE.Vector2(0, 1.45),
];

const queenProfile = (): THREE.Vector2[] => [
  // Base
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.44, 0),
  new THREE.Vector2(0.46, 0.02),
  new THREE.Vector2(0.46, 0.08),
  new THREE.Vector2(0.44, 0.10),
  new THREE.Vector2(0.36, 0.12),
  // Base molding
  new THREE.Vector2(0.34, 0.15),
  new THREE.Vector2(0.32, 0.17),
  // Stem
  new THREE.Vector2(0.22, 0.24),
  new THREE.Vector2(0.19, 0.50),
  new THREE.Vector2(0.18, 0.72),
  // Collar
  new THREE.Vector2(0.22, 0.77),
  new THREE.Vector2(0.26, 0.80),
  new THREE.Vector2(0.26, 0.83),
  new THREE.Vector2(0.22, 0.86),
  // Neck
  new THREE.Vector2(0.17, 0.92),
  // Crown body
  new THREE.Vector2(0.24, 1.00),
  new THREE.Vector2(0.30, 1.08),
  new THREE.Vector2(0.33, 1.16),
  new THREE.Vector2(0.32, 1.22),
  new THREE.Vector2(0.28, 1.28),
  new THREE.Vector2(0.22, 1.32),
  new THREE.Vector2(0.16, 1.35),
  new THREE.Vector2(0.10, 1.36),
  // Crown ball
  new THREE.Vector2(0.07, 1.38),
  new THREE.Vector2(0.09, 1.41),
  new THREE.Vector2(0.09, 1.44),
  new THREE.Vector2(0.07, 1.46),
  new THREE.Vector2(0.04, 1.47),
  new THREE.Vector2(0, 1.48),
];

const kingProfile = (): THREE.Vector2[] => [
  // Base
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.46, 0),
  new THREE.Vector2(0.48, 0.02),
  new THREE.Vector2(0.48, 0.09),
  new THREE.Vector2(0.46, 0.11),
  new THREE.Vector2(0.38, 0.13),
  // Base molding
  new THREE.Vector2(0.36, 0.16),
  new THREE.Vector2(0.34, 0.18),
  // Stem
  new THREE.Vector2(0.24, 0.26),
  new THREE.Vector2(0.20, 0.55),
  new THREE.Vector2(0.19, 0.78),
  // Collar
  new THREE.Vector2(0.24, 0.83),
  new THREE.Vector2(0.28, 0.86),
  new THREE.Vector2(0.28, 0.89),
  new THREE.Vector2(0.24, 0.92),
  // Neck
  new THREE.Vector2(0.18, 0.98),
  // Crown body
  new THREE.Vector2(0.26, 1.06),
  new THREE.Vector2(0.30, 1.14),
  new THREE.Vector2(0.32, 1.22),
  new THREE.Vector2(0.30, 1.30),
  new THREE.Vector2(0.26, 1.36),
  new THREE.Vector2(0.20, 1.40),
  new THREE.Vector2(0.15, 1.42),
  // Crown platform
  new THREE.Vector2(0.16, 1.44),
  new THREE.Vector2(0.18, 1.46),
  new THREE.Vector2(0.18, 1.48),
  new THREE.Vector2(0.14, 1.50),
  // Cross stem
  new THREE.Vector2(0.04, 1.52),
  new THREE.Vector2(0.04, 1.62),
  new THREE.Vector2(0, 1.62),
];

const profiles: Record<string, () => THREE.Vector2[]> = {
  p: pawnProfile,
  r: rookProfile,
  b: bishopProfile,
  q: queenProfile,
  k: kingProfile,
};

/* ─────────────────────────────────────────────
   KNIGHT – Separate geometries rendered as JSX
─────────────────────────────────────────────*/

const knightBaseProfile = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.42, 0),
  new THREE.Vector2(0.44, 0.02),
  new THREE.Vector2(0.44, 0.07),
  new THREE.Vector2(0.42, 0.09),
  new THREE.Vector2(0.30, 0.12),
  new THREE.Vector2(0.28, 0.14),
  new THREE.Vector2(0.25, 0.16),
  new THREE.Vector2(0.22, 0.18),
  new THREE.Vector2(0, 0.18),
];

const createKnightHeadShape = (): THREE.Shape => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.18);
  // Back of neck
  shape.bezierCurveTo(0.08, 0.24, 0.16, 0.36, 0.18, 0.50);
  shape.bezierCurveTo(0.19, 0.62, 0.17, 0.74, 0.14, 0.84);
  // Mane crest
  shape.bezierCurveTo(0.10, 0.94, 0.05, 1.04, 0.00, 1.12);
  shape.bezierCurveTo(-0.04, 1.18, -0.10, 1.22, -0.14, 1.24);
  // Forehead
  shape.bezierCurveTo(-0.18, 1.24, -0.22, 1.20, -0.26, 1.14);
  // Eye area
  shape.bezierCurveTo(-0.29, 1.08, -0.30, 1.00, -0.32, 0.92);
  // Nose bridge
  shape.bezierCurveTo(-0.34, 0.82, -0.37, 0.72, -0.39, 0.64);
  // Muzzle
  shape.bezierCurveTo(-0.40, 0.58, -0.40, 0.52, -0.38, 0.48);
  // Nostril/chin
  shape.bezierCurveTo(-0.35, 0.44, -0.30, 0.40, -0.24, 0.36);
  // Jaw
  shape.bezierCurveTo(-0.18, 0.32, -0.12, 0.26, -0.06, 0.22);
  // Throat back to start
  shape.bezierCurveTo(-0.02, 0.20, 0.00, 0.18, 0, 0.18);
  return shape;
};

const knightExtrudeSettings: THREE.ExtrudeGeometryOptions = {
  depth: 0.36,
  bevelEnabled: true,
  bevelThickness: 0.07,
  bevelSize: 0.06,
  bevelSegments: 6,
  curveSegments: 20,
};

const createEarShape = (): THREE.Shape => {
  const ear = new THREE.Shape();
  ear.moveTo(0, 0);
  ear.bezierCurveTo(0.02, 0.06, 0.04, 0.14, 0.01, 0.18);
  ear.bezierCurveTo(-0.01, 0.14, -0.02, 0.06, 0, 0);
  return ear;
};

const earExtrudeSettings: THREE.ExtrudeGeometryOptions = {
  depth: 0.04,
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.01,
  bevelSegments: 2,
};

/* ─────────────────────────────────────────────
   KING CROSS – Additional geometry on top
─────────────────────────────────────────────*/
const createKingCross = (): THREE.BufferGeometry => {
  const vBar = new THREE.BoxGeometry(0.04, 0.18, 0.04);
  const hBar = new THREE.BoxGeometry(0.14, 0.04, 0.04);

  // Merge manually
  const positions: number[] = [];
  const normals: number[] = [];

  // Vertical bar - positioned at top
  vBar.translate(0, 1.7, 0);
  hBar.translate(0, 1.74, 0);

  for (const geom of [vBar, hBar]) {
    const pos = geom.getAttribute('position');
    const norm = geom.getAttribute('normal');
    for (let i = 0; i < pos.count; i++) {
      positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      normals.push(norm.getX(i), norm.getY(i), norm.getZ(i));
    }
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

  return merged;
};

/* ─────────────────────────────────────────────
   COMPONENT
─────────────────────────────────────────────*/

const ChessPiece3D: React.FC<ChessPiece3DProps> = ({
  type,
  color,
  position,
  onClick,
  isSelected,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  /* ───────── Materials ───────── */
  const material = useMemo(() => {
    const isWhite = color === "w";
    return new THREE.MeshPhysicalMaterial({
      color: isWhite ? "#e8d5b0" : "#1c1410",
      roughness: isWhite ? 0.45 : 0.3,
      metalness: 0.02,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      reflectivity: 0.4,
      sheen: isWhite ? 0.1 : 0.2,
      sheenColor: isWhite ? new THREE.Color("#fff5e0") : new THREE.Color("#3a2a1a"),
    });
  }, [color]);

  /* ───────── Lathe Geometry (all except knight) ───────── */
  const latheGeometry = useMemo(() => {
    if (type === "n") return null;
    const profileFn = profiles[type] || pawnProfile;
    const geom = new THREE.LatheGeometry(profileFn(), 128);
    geom.computeVertexNormals();
    return geom;
  }, [type]);

  /* ───────── Knight Geometries ───────── */
  const knightBase = useMemo(() => {
    if (type !== "n") return null;
    return new THREE.LatheGeometry(knightBaseProfile, 64);
  }, [type]);

  const knightHead = useMemo(() => {
    if (type !== "n") return null;
    const geom = new THREE.ExtrudeGeometry(createKnightHeadShape(), knightExtrudeSettings);
    geom.translate(0.14, 0, -0.18);
    geom.computeVertexNormals();
    return geom;
  }, [type]);

  const knightEarL = useMemo(() => {
    if (type !== "n") return null;
    const geom = new THREE.ExtrudeGeometry(createEarShape(), earExtrudeSettings);
    geom.translate(-0.04, 1.20, -0.08);
    return geom;
  }, [type]);

  const knightEarR = useMemo(() => {
    if (type !== "n") return null;
    const geom = new THREE.ExtrudeGeometry(createEarShape(), earExtrudeSettings);
    geom.translate(-0.04, 1.20, 0.20);
    return geom;
  }, [type]);

  /* ───────── King Cross ───────── */
  const kingCrossGeometry = useMemo(() => {
    if (type !== "k") return null;
    return createKingCross();
  }, [type]);

  /* ───────── Rook Crenellations ───────── */
  const rookBattlements = useMemo(() => {
    if (type !== "r") return null;
    const crenels: Array<[number, number, number]> = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      if (i % 2 === 0) continue; // gaps
      const angle = (i / count) * Math.PI * 2;
      crenels.push([
        Math.cos(angle) * 0.31,
        1.08,
        Math.sin(angle) * 0.31,
      ]);
    }
    return crenels;
  }, [type]);

  /* ───────── Animation ───────── */
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      position[0],
      delta * 8
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      position[2],
      delta * 8
    );
    const targetY = isSelected ? 0.25 : position[1];
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      delta * 8
    );
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[0.7, 0.7, 0.7]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Lathe pieces (pawn, rook, bishop, queen, king body) */}
      {type !== "n" && latheGeometry && (
        <mesh geometry={latheGeometry} material={material} castShadow receiveShadow />
      )}

      {/* King cross */}
      {type === "k" && kingCrossGeometry && (
        <mesh geometry={kingCrossGeometry} material={material} castShadow />
      )}

      {/* Rook battlements */}
      {rookBattlements &&
        rookBattlements.map((pos, i) => (
          <mesh key={i} position={pos} material={material} castShadow>
            <boxGeometry args={[0.10, 0.12, 0.10]} />
          </mesh>
        ))}

      {/* Knight - rendered as separate meshes */}
      {type === "n" && knightBase && (
        <mesh geometry={knightBase} material={material} castShadow receiveShadow />
      )}
      {type === "n" && knightHead && (
        <mesh geometry={knightHead} material={material} castShadow receiveShadow />
      )}
      {type === "n" && knightEarL && (
        <mesh geometry={knightEarL} material={material} castShadow />
      )}
      {type === "n" && knightEarR && (
        <mesh geometry={knightEarR} material={material} castShadow />
      )}

      {/* Selection glow ring */}
      {isSelected && (
        <>
          <pointLight
            position={[0, 1.2, 0]}
            intensity={0.6}
            distance={2.5}
            color="#ffd700"
          />
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.42, 0.48, 32]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
};

export default ChessPiece3D;
