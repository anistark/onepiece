// App-side avatar visual: a stylized low-poly boy in a straw hat, red vest, and blue
// shorts — an evocative silhouette, not an anime-accurate likeness (see plan/reference
// decisions #5). Pure procedural geometry sized to the Player capsule envelope
// (~1.3 units tall, centered at the capsule origin); no physics of its own.

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

export function StrawHatFigure({
  vestColor = '#d33a2f',
  shortsColor = '#3f5fb0',
  hatColor = '#e6c775',
  bandColor = '#c22a20',
  skinColor = '#e8b98c',
  hairColor = '#1c1c1c',
}: StrawHatFigureProps) {
  return (
    <group>
      {/* sandals */}
      {[-0.09, 0.09].map((x) => (
        <mesh key={`sandal${x}`} position={[x, -0.62, 0.02]} castShadow>
          <boxGeometry args={[0.12, 0.05, 0.22]} />
          <meshStandardMaterial color="#7a4f2a" roughness={0.9} />
        </mesh>
      ))}
      {/* legs */}
      {[-0.09, 0.09].map((x) => (
        <mesh key={`leg${x}`} position={[x, -0.47, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.05, 0.28, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
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
      {/* bare arms */}
      {[-0.2, 0.2].map((x) => (
        <mesh key={`arm${x}`} position={[x, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.045, 0.34, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
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
