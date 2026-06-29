import { useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { CuboidCollider, type RapierRigidBody, RigidBody } from '@react-three/rapier'
import { useWorld, type WorldComponentProps } from '@runek/core'
import { useRef } from 'react'
import { Euler, Quaternion, Vector3 } from 'three'
import { Sailboat } from '../runek/Sailboat'

export interface HelmProps extends WorldComponentProps {
  /** Top sailing speed, in units/second. */
  speed?: number
  /** Turn rate, in radians/second. */
  turnRate?: number
  /** Chase-camera distance astern and height above the boat, in units. */
  camDistance?: number
  camHeight?: number
  /** Hull length passed to the boat visual, in units. */
  length?: number
  /** Raise the mainsail on the boat visual. */
  sail?: boolean
}

const FORWARD = new Vector3()
const DESIRED_CAM = new Vector3()
const LOOK_AT = new Vector3()
const EULER = new Euler(0, 0, 0, 'YXZ')
const QUAT = new Quaternion()

/**
 * The steerable boat: an app-side vehicle controller that owns a kinematic physics body and
 * renders `Sailboat` (with `physics={false}`) as its hull. Throttle on forward/back, steer on
 * left/right (the world's default keyboard map), and a chase camera rides astern. The boat's
 * collider trips Portal sensors, so sailing into a gate triggers a voyage. The Sailboat stays a
 * pure procedural prop; all the control logic lives here, per the project's traversal layer.
 */
export function Helm({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  seed = 1,
  speed = 14,
  turnRate = 1.1,
  camDistance = 11,
  camHeight = 5.5,
  length = 6,
  sail = true,
}: HelmProps) {
  const { unit } = useWorld()
  const camera = useThree((s) => s.camera)
  const [, getKeys] = useKeyboardControls()

  const body = useRef<RapierRigidBody>(null)
  const pos = useRef(new Vector3(position[0], position[1], position[2]))
  const yaw = useRef(rotation[1])
  const vel = useRef(0)
  const placed = useRef(false)

  useFrame((_, dt) => {
    const rb = body.current
    if (!rb) return
    const delta = Math.min(dt, 0.05) // clamp so a stutter can't fling the boat
    const { forward, backward, leftward, rightward } = getKeys()

    // Steer (bow at local +Z, so heading = (sin yaw, 0, cos yaw)).
    yaw.current += ((leftward ? 1 : 0) - (rightward ? 1 : 0)) * turnRate * delta

    // Throttle toward target speed; reverse is slower, like a real boat.
    const target = forward ? speed : backward ? -speed * 0.4 : 0
    vel.current += (target - vel.current) * Math.min(1, delta * 1.8)

    FORWARD.set(Math.sin(yaw.current), 0, Math.cos(yaw.current))
    pos.current.addScaledVector(FORWARD, vel.current * unit * delta)

    // Drive the kinematic body: it carries the boat visual + collider with it.
    rb.setNextKinematicTranslation(pos.current)
    EULER.set(0, yaw.current, 0)
    rb.setNextKinematicRotation(QUAT.setFromEuler(EULER))

    // Chase camera astern and above, easing in (snap on the first frame).
    DESIRED_CAM.copy(pos.current)
      .addScaledVector(FORWARD, -camDistance * unit)
      .addScaledVector(new Vector3(0, 1, 0), camHeight * unit)
    if (!placed.current) {
      camera.position.copy(DESIRED_CAM)
      placed.current = true
    } else {
      camera.position.lerp(DESIRED_CAM, Math.min(1, delta * 3))
    }
    LOOK_AT.copy(pos.current).addScaledVector(new Vector3(0, 1, 0), 1.5 * unit)
    camera.lookAt(LOOK_AT)
  })

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={position}
      rotation={rotation}
    >
      {/* Collider that trips Portal sensors; sized to the hull, not its detail. */}
      <CuboidCollider args={[length * 0.4 * unit, 0.6 * unit, length * 0.5 * unit]} />
      <Sailboat physics={false} seed={seed} length={length} sail={sail} />
    </RigidBody>
  )
}
