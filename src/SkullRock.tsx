// App-side landmark visual: a sea crag weathered into a giant skull — cranium, brow,
// recessed eye sockets, nasal cavity, cheekbones, and a bared upper-jaw grin on a rocky
// pedestal. Like StrawHatFigure this stays in this repo (see plan/reference decisions):
// the skull-island identity is composition, not a generic Runek primitive. Pure procedural
// geometry, Cliff-style position-keyed vertex jitter, primitive colliders (no trimesh).
// The face looks toward local +Z — rotate in the world JSON to aim it.
import { BallCollider, CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { useWorld, type WorldComponentProps } from '@runek/core'
import { useEffect, useMemo } from 'react'
import { CylinderGeometry, IcosahedronGeometry } from 'three'

export interface SkullRockProps extends WorldComponentProps {
  /** Cranium radius, in units; the whole crag stands about 2.5× this tall. */
  size?: number
  /** Bone color of the weathered rock. */
  boneColor?: string
  /** Color inside the sockets, nasal cavity, and tooth gaps. */
  cavityColor?: string
  /** Color of the pedestal crag the skull sits on; defaults to the palette's `stone`. */
  baseColor?: string
}

// Cliff-style deterministic jitter, keyed on vertex position so duplicated
// vertices (seams) move together instead of tearing cracks.
function jitter(seed: number, x: number, y: number, z: number, k: number) {
  let h =
    (seed ^
      Math.imul(Math.round(x * 64), 374761393) ^
      Math.imul(Math.round(y * 64), 668265263) ^
      Math.imul(Math.round(z * 64), 1274126177) ^
      Math.imul(k + 1, 2246822519)) >>>
    0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return (((h ^ (h >>> 16)) >>> 0) / 4294967296) * 2 - 1
}

function roughen(g: IcosahedronGeometry | CylinderGeometry, seed: number, amp: number) {
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    pos.setX(i, x + jitter(seed, x, y, z, 0) * amp)
    pos.setY(i, y + jitter(seed, x, y, z, 1) * amp * 0.6)
    pos.setZ(i, z + jitter(seed, x, y, z, 2) * amp)
  }
  pos.needsUpdate = true
  g.computeVertexNormals()
}

export function SkullRock({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  seed = 1,
  size = 10,
  boneColor = '#cfc7b2',
  cavityColor = '#141210',
  baseColor,
}: SkullRockProps) {
  const { unit, palette } = useWorld()
  const R = size * unit
  const rock = baseColor ?? palette.stone

  // Cranium: a low-poly sphere, slightly narrowed across the temples, weathered by seed.
  const cranium = useMemo(() => {
    const g = new IcosahedronGeometry(R, 1)
    g.scale(0.92, 1, 0.98)
    roughen(g, seed, R * 0.05)
    return g
  }, [R, seed])

  // Pedestal: the neck of crag the skull grew out of, rougher than the bone above.
  const pedestal = useMemo(() => {
    const g = new CylinderGeometry(R * 0.75, R * 1.15, R * 1.05, 9, 2)
    g.translate(0, R * 0.52, 0)
    roughen(g, seed + 7, R * 0.09)
    return g
  }, [R, seed])

  useEffect(
    () => () => {
      cranium.dispose()
      pedestal.dispose()
    },
    [cranium, pedestal],
  )

  const craniumY = R * 1.5
  // Teeth: seven uprights with dark gaps between; per-tooth height jitter for a broken grin.
  const teeth = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        x: (i - 3) * 0.11 * R,
        h: R * (0.2 + 0.06 * jitter(seed, i + 1, 3, 7, 3)),
      })),
    [R, seed],
  )

  return (
    <RigidBody type="fixed" colliders={false} position={position} rotation={rotation}>
      <BallCollider args={[R * 0.95]} position={[0, craniumY, 0]} />
      <CylinderCollider args={[R * 0.52, R * 0.95]} position={[0, R * 0.52, 0]} />
      <CuboidCollider args={[R * 0.5, R * 0.28, R * 0.3]} position={[0, R * 0.92, R * 0.5]} />

      <mesh geometry={pedestal} castShadow receiveShadow>
        <meshStandardMaterial color={rock} roughness={1} flatShading />
      </mesh>
      <mesh geometry={cranium} position={[0, craniumY, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={boneColor} roughness={1} flatShading />
      </mesh>

      {/* brow ridge, overhanging the sockets so they sit in shadow */}
      <mesh position={[0, R * 1.92, R * 0.62]} rotation={[0.18, 0, 0]} castShadow>
        <boxGeometry args={[R * 1.18, R * 0.17, R * 0.34]} />
        <meshStandardMaterial color={boneColor} roughness={1} flatShading />
      </mesh>

      {/* eye sockets: dark drums sunk into the face — the caps read as holes */}
      {[-0.36, 0.36].map((x) => (
        <mesh
          key={`socket${x}`}
          position={[x * R, R * 1.58, R * 0.66]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[R * 0.3, R * 0.3, R * 0.55, 12]} />
          <meshStandardMaterial color={cavityColor} roughness={1} flatShading />
        </mesh>
      ))}

      {/* nasal cavity: a dark wedge, apex up, between and below the sockets */}
      <mesh position={[0, R * 1.26, R * 0.82]} rotation={[0.14, 0, 0]}>
        <coneGeometry args={[R * 0.16, R * 0.36, 3]} />
        <meshStandardMaterial color={cavityColor} roughness={1} flatShading />
      </mesh>

      {/* cheekbones */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={`cheek${x}`} position={[x * R, R * 1.28, R * 0.55]} castShadow>
          <icosahedronGeometry args={[R * 0.2, 0]} />
          <meshStandardMaterial color={boneColor} roughness={1} flatShading />
        </mesh>
      ))}

      {/* upper jaw, jutting forward under the face */}
      <mesh position={[0, R * 0.92, R * 0.5]} castShadow>
        <boxGeometry args={[R * 1.0, R * 0.55, R * 0.6]} />
        <meshStandardMaterial color={boneColor} roughness={1} flatShading />
      </mesh>
      {/* the grin: a dark gum band with bone teeth standing proud of it */}
      <mesh position={[0, R * 0.8, R * 0.56]}>
        <boxGeometry args={[R * 0.9, R * 0.2, R * 0.55]} />
        <meshStandardMaterial color={cavityColor} roughness={1} flatShading />
      </mesh>
      {teeth.map((t) => (
        <mesh key={`tooth${t.x.toFixed(3)}`} position={[t.x, R * 0.8, R * 0.575]} castShadow>
          <boxGeometry args={[R * 0.075, t.h, R * 0.55]} />
          <meshStandardMaterial color={boneColor} roughness={1} flatShading />
        </mesh>
      ))}
    </RigidBody>
  )
}
