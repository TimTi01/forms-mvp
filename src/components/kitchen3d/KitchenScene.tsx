import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, PerspectiveCamera } from '@react-three/drei'
import type { Answers } from '../../types'
import type { QuestionMeta } from '../../data/questionMeta'
import { buildKitchenLayout, shouldHighlightCabinet } from './buildLayout'
import CabinetUnit from './CabinetUnit'
import KitchenAppliances3D from './KitchenAppliances3D'

interface KitchenSceneContentProps {
  answers: Answers
  focus?: QuestionMeta['previewFocus']
  modulesStepPassed?: boolean
}

function KitchenSceneContent({ answers, focus, modulesStepPassed }: KitchenSceneContentProps) {
  const length = Number(answers.length) || 3
  const modules = Number(answers.modules) || 10
  const layout = String(answers.layout || 'linear')
  const facade = String(answers.facade || 'ldsp')
  const countertop = String(answers.countertop || 'ldsp')
  const hardware = String(answers.hardware || 'standard')
  const appliances = String(answers.appliances || 'none')
  const nonStandard = String(answers.nonStandard || 'none')
  const modulesPreviewActive =
    focus === 'modules' || (Boolean(modulesStepPassed) && appliances === 'none')
  const showAppliances3d =
    modulesPreviewActive || appliances === 'basic' || appliances === 'full'
  const hideBuiltInAppliances = showAppliances3d

  const kitchenLayout = useMemo(
    () => buildKitchenLayout({ length, modules, layout, appliances, nonStandard, focus, modulesStepPassed }),
    [length, modules, layout, appliances, nonStandard, focus, modulesStepPassed],
  )

  const [tx, ty, tz] = kitchenLayout.orbitTarget

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[tx + 3.2, 2.6, tz + kitchenLayout.cameraDistance]}
        fov={42}
      />
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={3}
        maxDistance={12}
        target={[tx, ty, tz]}
        enableDamping
        dampingFactor={0.05}
      />

      <ambientLight intensity={0.45} />
      <directionalLight
        position={[tx + 5, 8, tz + 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[tx - 3, 4, tz - 2]} intensity={0.35} />
      <pointLight position={[tx, 3, tz + 2]} intensity={0.25} color="#fff8f0" />

      <Environment preset="apartment" />

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[tx, 0, tz]} receiveShadow>
        <planeGeometry args={[kitchenLayout.floorWidth, kitchenLayout.floorDepth]} />
        <meshStandardMaterial color="#d1d9e6" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* walls */}
      {kitchenLayout.walls.map((wall, i) => (
        <mesh key={i} position={wall.position} receiveShadow>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial color={i === 0 ? '#eef1f6' : '#e8ecf2'} roughness={0.9} />
        </mesh>
      ))}

      {/* backsplash */}
      <mesh position={kitchenLayout.backsplash.position}>
        <boxGeometry args={kitchenLayout.backsplash.size} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* cabinets */}
      {kitchenLayout.cabinets.map((cabinet) => (
        <CabinetUnit
          key={cabinet.id}
          placement={cabinet}
          facade={facade}
          countertop={countertop}
          hardware={hardware}
          highlighted={shouldHighlightCabinet(focus, cabinet)}
          hideBuiltInAppliances={hideBuiltInAppliances}
        />
      ))}

      {showAppliances3d && (
        <KitchenAppliances3D
          appliances={kitchenLayout.appliances3d}
          highlighted={focus === 'appliances'}
        />
      )}

      <ContactShadows
        position={[tx, 0.01, tz]}
        opacity={0.45}
        scale={14}
        blur={2.5}
        far={5}
      />
    </>
  )
}

interface KitchenSceneProps {
  answers: Answers
  focus?: QuestionMeta['previewFocus']
  modulesStepPassed?: boolean
}

export default function KitchenScene({ answers, focus, modulesStepPassed }: KitchenSceneProps) {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <KitchenSceneContent answers={answers} focus={focus} modulesStepPassed={modulesStepPassed} />
      </Suspense>
    </Canvas>
  )
}
