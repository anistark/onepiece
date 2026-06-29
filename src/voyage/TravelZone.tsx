import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useWorld, type WorldComponentProps } from '@runek/core'
import { clearPrompt, type PromptKind, setPrompt } from './store'

export interface TravelZoneProps extends WorldComponentProps {
  /** World file this zone travels to, e.g. `/east-blue.world.json`. */
  to: string
  /** Action caption shown to the player, e.g. "Set sail" or "Go ashore". */
  label: string
  /** Boarding a boat ('board') or stepping ashore at a port ('ashore'). */
  kind?: PromptKind
  /** Trigger box size `[x, y, z]` in units; it rises from `position` upward. */
  size?: [number, number, number]
}

// rapier body types: 0 Dynamic, 1 Fixed, 2 KinematicPosition, 3 KinematicVelocity.
const FIXED = 1
// DEFAULT (15) for the on-foot player (dynamic) OR KINEMATIC_FIXED (8704) for the boat (kinematic).
const TRIGGER_TYPES = 15 | 8704

/**
 * An invisible trigger that surfaces a contextual action while the player or boat is inside it.
 * This is how One Piece travels — no portals: a zone around a docked boat offers "Set sail", a
 * zone at a port approach offers "Go ashore". Entering publishes the prompt to the voyage store;
 * leaving clears it. The app shell renders the button and runs the voyage.
 */
export function TravelZone({
  to,
  label,
  kind = 'board',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [5, 4, 5],
}: TravelZoneProps) {
  const { unit } = useWorld()
  const hx = (size[0] / 2) * unit
  const hy = (size[1] / 2) * unit
  const hz = (size[2] / 2) * unit

  return (
    <RigidBody type="fixed" colliders={false} position={position} rotation={rotation}>
      <CuboidCollider
        sensor
        activeCollisionTypes={TRIGGER_TYPES}
        args={[hx, hy, hz]}
        position={[0, hy, 0]}
        onIntersectionEnter={({ other }) => {
          if (other.rigidBody && other.rigidBody.bodyType() !== FIXED) setPrompt({ label, to, kind })
        }}
        onIntersectionExit={({ other }) => {
          if (other.rigidBody && other.rigidBody.bodyType() !== FIXED) clearPrompt(to)
        }}
      />
    </RigidBody>
  )
}
