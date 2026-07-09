// App-side avatar visual: a stylized low-poly boy in a straw hat, red vest, and blue
// shorts — an evocative silhouette, not an anime-accurate likeness (see plan/reference
// decisions #5). Pure procedural geometry sized to the Player capsule envelope
// (~1.3 units tall, centered at the capsule origin); no physics of its own.
//
// Animation: an idle/walk/run gait driven off the same keyboard intent `ecctrl` reads
// (drei `useKeyboardControls`), so limbs swing when the player moves and pump faster when
// running — no dependency on `ecctrl` internals or the character rigidbody. Kept
// self-contained so the gait layer can later be lifted into a runek avatar component.

import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

export interface StrawHatFigureProps {
  /** Vest color. */
  vestColor?: string
  /** Shorts color. */
  shortsColor?: string
  /** Hat straw color. */
  hatColor?: string
  /** Hat band color. */
  bandColor?: string
  /** Skin color. */
  skinColor?: string
  /** Hair color. */
  hairColor?: string
}

// Limb pivots (hips/shoulders), so a leg/arm swings from its joint rather than its center.
const HIP_Y = -0.33
const SHOULDER_Y = 0.25
const HIP_X = 0.09
const SHOULDER_X = 0.2

// Gait tuning.
const WALK_OMEGA = 9 // stride angular frequency (rad/s)
const RUN_OMEGA = 15
const WALK_AMP = 0.55 // peak leg swing (rad)
const RUN_AMP = 0.95
const ARM_RATIO = 0.75 // arms swing a bit less than legs
const RESPONSE = 12 // how fast the gait eases in/out (higher = snappier)

export function StrawHatFigure({
  vestColor = '#d33a2f',
  shortsColor = '#3f5fb0',
  hatColor = '#e6c775',
  bandColor = '#c22a20',
  skinColor = '#e8b98c',
  hairColor = '#1c1c1c',
}: StrawHatFigureProps) {
  const root = useRef<Group>(null)
  const legL = useRef<Group>(null)
  const legR = useRef<Group>(null)
  const armL = useRef<Group>(null)
  const armR = useRef<Group>(null)

  const [, getKeys] = useKeyboardControls()

  // Smoothed gait state, persisted across frames.
  const phase = useRef(0)
  const moving = useRef(0) // 0 idle → 1 walking
  const running = useRef(0) // 0 walk → 1 run

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05) // clamp to survive tab-out hitches
    const k = 1 - Math.exp(-RESPONSE * delta)

    const keys = getKeys()
    const wantsMove = keys.forward || keys.backward || keys.leftward || keys.rightward
    moving.current += ((wantsMove ? 1 : 0) - moving.current) * k
    running.current += ((wantsMove && keys.run ? 1 : 0) - running.current) * k

    const omega = WALK_OMEGA + (RUN_OMEGA - WALK_OMEGA) * running.current
    phase.current += delta * omega * moving.current

    const legAmp = moving.current * (WALK_AMP + (RUN_AMP - WALK_AMP) * running.current)
    const armAmp = legAmp * ARM_RATIO
    const swing = Math.sin(phase.current)

    if (legL.current) legL.current.rotation.x = swing * legAmp
    if (legR.current) legR.current.rotation.x = -swing * legAmp
    // Arms counter-swing to the legs.
    if (armL.current) armL.current.rotation.x = -swing * armAmp
    if (armR.current) armR.current.rotation.x = swing * armAmp

    if (root.current) {
      // Vertical bounce on each footfall + a lean into a run.
      const bounce = Math.abs(swing) * 0.05 * moving.current
      root.current.position.y = bounce
      root.current.rotation.x = -0.16 * running.current
    }
  })

  return (
    <group ref={root}>
      {/* legs (+ sandals) as hip-pivoted swing groups */}
      {[-1, 1].map((s) => (
        <group key={`leg${s}`} ref={s < 0 ? legL : legR} position={[HIP_X * s, HIP_Y, 0]}>
          <mesh position={[0, -0.29, 0.02]} castShadow>
            <boxGeometry args={[0.12, 0.05, 0.22]} />
            <meshStandardMaterial color="#7a4f2a" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.14, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.05, 0.28, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.8} />
          </mesh>
        </group>
      ))}
      {/* rolled-up shorts: slimmer than the vest and overlapping up inside it, so no two
          parallel faces sit close enough to z-fight */}
      <mesh position={[0, -0.21, 0]} castShadow>
        <boxGeometry args={[0.29, 0.25, 0.19]} />
        <meshStandardMaterial color={shortsColor} roughness={0.9} />
      </mesh>
      {[-0.09, 0.09].map((x) => (
        <mesh key={`cuff${x}`} position={[x, -0.36, 0]} castShadow>
          <cylinderGeometry args={[0.066, 0.066, 0.06, 10]} />
          <meshStandardMaterial color={shortsColor} roughness={0.9} />
        </mesh>
      ))}
      {/* sleeveless vest */}
      <mesh position={[0, 0.09, 0]} castShadow>
        <boxGeometry args={[0.32, 0.36, 0.2]} />
        <meshStandardMaterial color={vestColor} roughness={0.85} />
      </mesh>
      {/* bare arms as shoulder-pivoted swing groups */}
      {[-1, 1].map((s) => (
        <group
          key={`arm${s}`}
          ref={s < 0 ? armL : armR}
          position={[SHOULDER_X * s, SHOULDER_Y, 0]}
        >
          <mesh position={[0, -0.17, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.045, 0.34, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.8} />
          </mesh>
        </group>
      ))}
      {/* head */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.16, 14, 10]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>
      {/* hair fringe under the hat */}
      <mesh position={[0, 0.47, -0.01]} scale={[1.03, 0.72, 1.03]} castShadow>
        <sphereGeometry args={[0.165, 14, 10]} />
        <meshStandardMaterial color={hairColor} roughness={0.95} />
      </mesh>
      {/* straw hat: brim, crown, dome, band */}
      <mesh position={[0, 0.565, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.36, 0.025, 18]} />
        <meshStandardMaterial color={hatColor} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.185, 0.1, 14]} />
        <meshStandardMaterial color={hatColor} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0, 0.67, 0]} scale={[1, 0.55, 1]} castShadow>
        <sphereGeometry args={[0.16, 14, 8]} />
        <meshStandardMaterial color={hatColor} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0, 0.598, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.045, 14]} />
        <meshStandardMaterial color={bandColor} roughness={0.9} />
      </mesh>
    </group>
  )
}
