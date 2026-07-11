import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CABINET, FACADE_MATERIALS, COUNTERTOP_MATERIALS, HANDLE_COLORS } from './materials'
import type { CabinetPlacement } from './buildLayout'

interface CabinetUnitProps {
  placement: CabinetPlacement
  facade: string
  countertop: string
  hardware: string
  highlighted: boolean
  hideBuiltInAppliances?: boolean
}

export default function CabinetUnit({
  placement,
  facade,
  countertop,
  hardware,
  highlighted,
  hideBuiltInAppliances,
}: CabinetUnitProps) {
  const groupRef = useRef<THREE.Group>(null)
  const facadeMat = FACADE_MATERIALS[facade] ?? FACADE_MATERIALS.ldsp
  const counterMat = COUNTERTOP_MATERIALS[countertop] ?? COUNTERTOP_MATERIALS.ldsp
  const handleColor = HANDLE_COLORS[hardware] ?? HANDLE_COLORS.standard
  const unitType = placement.unitType ?? 'base'

  const { width, depth, counterHeight } = CABINET
  const height =
    unitType === 'tall' ? 2.1
    : unitType === 'wall' ? 0.72
    : CABINET.height
  const yOffset = unitType === 'wall' ? 1.02 : 0
  const yBase = counterHeight / 2 + yOffset
  const hasCounter = unitType !== 'wall'
  const drawerRatios =
    unitType === 'drawer'
      ? placement.drawerCount === 2
        ? [0.4, 0.72]
        : placement.drawerCount === 4
          ? [0.22, 0.44, 0.66, 0.86]
          : [0.3, 0.55, 0.78]
      : []

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const target = highlighted ? 1.04 : 1
    groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 6)
  })

  const bodyColor = unitType === 'glass' ? '#b8d4e8' : facadeMat.color
  const bodyOpacity = unitType === 'glass' ? 0.55 : 1

  return (
    <group
      ref={groupRef}
      position={[placement.x, 0, placement.z]}
      rotation={[0, placement.rotationY, 0]}
    >
      {/* corpus */}
      <mesh position={[0, yBase + height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={facadeMat.roughness}
          metalness={unitType === 'glass' ? 0.4 : facadeMat.metalness}
          transparent={unitType === 'glass'}
          opacity={bodyOpacity}
          emissive={highlighted ? '#2563eb' : '#000000'}
          emissiveIntensity={highlighted ? 0.12 : 0}
        />
      </mesh>

      {drawerRatios.map((ratio) => (
        <mesh key={ratio} position={[0, yBase + height * ratio, depth / 2 + 0.012]}>
          <boxGeometry args={[width * 0.8, 0.012, 0.015]} />
          <meshStandardMaterial color="#555" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* sink bowl */}
      {unitType === 'sink' && hasCounter && (
        <mesh position={[0, yBase + CABINET.height + counterHeight + 0.01, 0]}>
          <boxGeometry args={[width * 0.55, 0.06, depth * 0.45]} />
          <meshStandardMaterial color="#a8b4c0" roughness={0.15} metalness={0.7} />
        </mesh>
      )}

      {/* countertop */}
      {hasCounter && (
        <mesh position={[0, yBase + height + counterHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width + 0.03, counterHeight, depth + 0.03]} />
          <meshStandardMaterial
            color={unitType === 'sink' ? counterMat.color : counterMat.color}
            roughness={counterMat.roughness}
            metalness={counterMat.metalness}
            emissive={highlighted ? '#2563eb' : '#000000'}
            emissiveIntensity={highlighted ? 0.08 : 0}
          />
        </mesh>
      )}

      {/* plinth */}
      {unitType !== 'wall' && (
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[width - 0.02, 0.06, depth - 0.02]} />
          <meshStandardMaterial color="#3d3d3d" roughness={0.8} />
        </mesh>
      )}

      {/* handle */}
      <mesh position={[0, yBase + height * 0.55, depth / 2 + 0.015]} castShadow>
        <boxGeometry args={[width * 0.35, 0.018, 0.02]} />
        <meshStandardMaterial
          color={handleColor}
          roughness={hardware === 'premium' ? 0.2 : 0.5}
          metalness={hardware === 'premium' ? 0.85 : 0.4}
        />
      </mesh>

      {/* oven (built-in) */}
      {placement.hasOven && !hideBuiltInAppliances && unitType !== 'wall' && (
        <group position={[0, yBase + height * 0.35, depth / 2 + 0.01]}>
          <mesh>
            <boxGeometry args={[width * 0.7, height * 0.38, 0.04]} />
            <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      )}

      {placement.isExtra && (
        <mesh position={[0, yBase + height / 2, 0]} castShadow>
          <boxGeometry args={[width * 0.7, height, depth * 0.7]} />
          <meshStandardMaterial color={facadeMat.color} wireframe transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  )
}
