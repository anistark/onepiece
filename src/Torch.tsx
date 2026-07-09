// App-side prop: a standing fire torch — a wooden stake with a wrapped head and a live
// flame (Campfire's two-cone flame + flickering warm light, scaled down). Built here for
// the pirate-port dressing; generic enough to be an upstream Runek candidate once the
// design settles. Decorative: no collider.
import { useFrame } from '@react-three/fiber'
import { useWorld, type WorldComponentProps } from '@runek/core'
import { useRef } from 'react'
import type { Group, PointLight } from 'three'

export interface TorchProps extends WorldComponentProps {
  /** Stake height to the flame head, in units. */
  height?: number
  /** Stake color; defaults to the world palette's `wood`. */
  poleColor?: string
  flameColor?: string
  /** Peak light intensity. */
  intensity?: number
}

export function Torch({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  seed = 1,
  height = 2.4,
  poleColor,
  flameColor = '#ff7a1a',
  intensity = 6,
}: TorchProps) {
  const { unit, palette } = useWorld()
  const wood = poleColor ?? palette.wood
  const H = height * unit
  const flameRef = useRef<Group>(null)
  const lightRef = useRef<PointLight>(null)
  const phase = (seed % 17) * 0.7

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase
    const n = Math.sin(t * 12) * 0.5 + Math.sin(t * 21 + 1) * 0.3 + Math.sin(t * 8 + 2) * 0.2
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + n * 0.22
      flameRef.current.position.x = n * 0.015 * unit
    }
    if (lightRef.current) lightRef.current.intensity = intensity * (1 + n * 0.3)
  })

  return (
    <group position={position} rotation={rotation}>
      {/* stake */}
      <mesh position={[0, H / 2, 0]} castShadow>
        <cylinderGeometry args={[0.045 * unit, 0.06 * unit, H, 7]} />
        <meshStandardMaterial color={wood} roughness={0.9} />
      </mesh>
      {/* wrapped head */}
      <mesh position={[0, H, 0]} castShadow>
        <cylinderGeometry args={[0.1 * unit, 0.08 * unit, 0.24 * unit, 8]} />
        <meshStandardMaterial color="#3a2c1c" roughness={1} />
      </mesh>

      <group ref={flameRef} position={[0, H + 0.12 * unit, 0]}>
        <mesh position={[0, 0.2 * unit, 0]}>
          <coneGeometry args={[0.12 * unit, 0.44 * unit, 8]} />
          <meshBasicMaterial color={flameColor} transparent opacity={0.85} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.16 * unit, 0]}>
          <coneGeometry args={[0.065 * unit, 0.3 * unit, 8]} />
          <meshBasicMaterial color="#ffd84d" transparent opacity={0.9} toneMapped={false} />
        </mesh>
      </group>

      <pointLight
        ref={lightRef}
        position={[0, H + 0.3 * unit, 0]}
        color="#ff9a3c"
        intensity={intensity}
        distance={9 * unit}
        decay={2}
      />
    </group>
  )
}
