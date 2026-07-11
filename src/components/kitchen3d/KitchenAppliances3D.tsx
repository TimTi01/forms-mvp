import type { KitchenAppliances } from './buildLayout'
import { CABINET } from './materials'

interface KitchenAppliances3DProps {
  appliances: KitchenAppliances
  highlighted: boolean
}

const { width: W, height: H, depth: D, counterHeight: CH } = CABINET
const COUNTER_Y = CH / 2 + H + CH

function StoveModel({ x, z, rotationY, highlighted }: { x: number; z: number; rotationY: number; highlighted: boolean }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* панель */}
      <mesh position={[0, COUNTER_Y + 0.02, 0]} castShadow>
        <boxGeometry args={[W * 0.7, 0.025, D * 0.55]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.15} metalness={0.85} />
      </mesh>
      {/* конфорки */}
      {[-0.14, 0.14].map((ox) =>
        [-0.1, 0.1].map((oz) => (
          <mesh key={`${ox}-${oz}`} position={[ox, COUNTER_Y + 0.04, oz]}>
            <cylinderGeometry args={[0.055, 0.055, 0.015, 20]} />
            <meshStandardMaterial
              color="#222"
              emissive={highlighted ? '#ff6b35' : '#331100'}
              emissiveIntensity={highlighted ? 0.6 : 0.15}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
        )),
      )}
      {/* ручки */}
      <mesh position={[0, COUNTER_Y + 0.05, D * 0.22]}>
        <boxGeometry args={[W * 0.5, 0.02, 0.03]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function HoodModel({ x, z, rotationY }: { x: number; z: number; rotationY: number; highlighted: boolean }) {
  const hoodY = COUNTER_Y + 0.55
  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, hoodY, D * 0.12]} castShadow>
        <boxGeometry args={[W * 0.85, 0.035, D * 0.5]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.35} metalness={0.15} />
      </mesh>
    </group>
  )
}

function FridgeModel({ x, z, rotationY, highlighted }: { x: number; z: number; rotationY: number; highlighted: boolean }) {
  const fridgeH = 1.85
  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, fridgeH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W * 0.95, fridgeH, D * 0.95]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.05}
          emissive={highlighted ? '#2563eb' : '#000000'}
          emissiveIntensity={highlighted ? 0.08 : 0}
        />
      </mesh>
      {/* морозилка */}
      <mesh position={[0, fridgeH * 0.78, D * 0.48]}>
        <boxGeometry args={[W * 0.85, fridgeH * 0.35, 0.02]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.3} />
      </mesh>
      {/* холодильник */}
      <mesh position={[0, fridgeH * 0.35, D * 0.48]}>
        <boxGeometry args={[W * 0.85, fridgeH * 0.45, 0.02]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.1} roughness={0.3} />
      </mesh>
      {/* ручка */}
      <mesh position={[W * 0.38, fridgeH * 0.55, D * 0.5]}>
        <boxGeometry args={[0.02, 0.25, 0.04]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} />
      </mesh>
    </group>
  )
}

export default function KitchenAppliances3D({ appliances, highlighted }: KitchenAppliances3DProps) {
  return (
    <>
      {appliances.stove && (
        <StoveModel
          x={appliances.stove.x}
          z={appliances.stove.z}
          rotationY={appliances.stove.rotationY}
          highlighted={highlighted}
        />
      )}
      {appliances.hood && (
        <HoodModel
          x={appliances.hood.x}
          z={appliances.hood.z}
          rotationY={appliances.hood.rotationY}
          highlighted={highlighted}
        />
      )}
      {appliances.fridge && (
        <FridgeModel
          x={appliances.fridge.x}
          z={appliances.fridge.z}
          rotationY={appliances.fridge.rotationY}
          highlighted={highlighted}
        />
      )}
    </>
  )
}
