import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useWorld, type WorldComponentProps } from '@runek/core'
import { useRef } from 'react'
import type { Group, MeshStandardMaterial } from 'three'
import { Sign } from '../runek/Sign'
import { requestVoyage } from './store'

export interface PortalProps extends WorldComponentProps {
  /** Destination world file to travel to, e.g. `/east-blue.world.json`. */
  to: string
  /** Floating caption above the gate (the place you'll arrive). */
  label?: string
  /** Ring radius, in units. */
  radius?: number
  /** Glow / ring color; defaults to the world palette's `accent`. */
  color?: string
}

// Rapier body types: 0 Dynamic, 1 Fixed, 2 KinematicPosition, 3 KinematicVelocity.
// Trigger only for things that move (the player capsule = dynamic, the boat = kinematic);
// ignore Fixed bodies (terrain, dock, props) so the gate never fires against the ground
// it stands on — which would otherwise teleport on load.
const FIXED = 1

// rapier `ActiveCollisionTypes`: DEFAULT (15) covers a dynamic body vs anything — enough for the
// on-foot player capsule, but NOT for the kinematic boat against this fixed sensor. OR in
// KINEMATIC_FIXED (8704) so the gate also fires under sail. (@react-three/rapier doesn't re-export
// the enum and rapier3d-compat isn't a hoisted dep, so the values are inlined.)
const SENSOR_COLLISION_TYPES = 15 | 8704

/**
 * An in-world travel gate: a glowing ring that, when the player or the boat passes
 * through it, asks the app to sail to another world. The visual is procedural and
 * IP-neutral (a candidate to upstream to Runek as a generic `Portal`); the `to`
 * destination + voyage wiring is this app's traversal glue.
 */
export function Portal({
  to,
  label,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  radius = 2.2,
  color,
}: PortalProps) {
  const { unit, palette } = useWorld()
  const ink = color ?? palette.accent
  const R = radius * unit

  const ring = useRef<Group>(null)
  const ringMat = useRef<MeshStandardMaterial>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring.current) ring.current.rotation.y = t * 0.6
    if (ringMat.current) ringMat.current.emissiveIntensity = 1.4 + Math.sin(t * 2) * 0.5
  })

  return (
    <RigidBody type="fixed" colliders={false} position={position} rotation={rotation}>
      {/* A generous sensor box around the gate — deep enough on the approach axis that a
          fast boat can't tunnel through between frames. Only non-fixed bodies trip it. */}
      <CuboidCollider
        sensor
        activeCollisionTypes={SENSOR_COLLISION_TYPES}
        args={[R * 1.1, R + 0.6 * unit, Math.max(R, 1.6 * unit)]}
        position={[0, R, 0]}
        onIntersectionEnter={({ other }) => {
          if (other.rigidBody && other.rigidBody.bodyType() !== FIXED) requestVoyage(to)
        }}
      />

      {/* Spinning glow ring, standing on the surface and facing the approach (local ±Z). */}
      <group ref={ring} position={[0, R, 0]}>
        <mesh castShadow>
          <torusGeometry args={[R, 0.12 * R, 14, 56]} />
          <meshStandardMaterial
            ref={ringMat}
            color={ink}
            emissive={ink}
            emissiveIntensity={1.4}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Soft beam rising from the ring, a no-bloom glow marker visible from afar. */}
      <mesh position={[0, R * 1.4, 0]}>
        <cylinderGeometry args={[R * 0.82, R * 0.82, R * 2.8, 24, 1, true]} />
        <meshBasicMaterial color={ink} transparent opacity={0.12} depthWrite={false} />
      </mesh>

      {label && (
        <Sign position={[0, R * 2 + 0.9 * unit, 0]} size={0.7} color={ink} glow>
          {label}
        </Sign>
      )}
    </RigidBody>
  )
}
