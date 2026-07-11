import type { QuestionMeta } from '../../data/questionMeta'
import { CABINET } from './materials'

export type LayoutType =
  | 'linear'
  | 'corner'
  | 'galley'
  | 'u_shape'
  | 'island'

export type UnitType = 'base' | 'drawer' | 'sink' | 'wall' | 'glass' | 'tall'

export interface CabinetPlacement {
  id: string
  x: number
  z: number
  rotationY: number
  unitType?: UnitType
  drawerCount?: 2 | 3 | 4
  hasOven?: boolean
  hasHob?: boolean
  isExtra?: boolean
  isIsland?: boolean
  isPeninsula?: boolean
}

export interface ApplianceAnchor {
  x: number
  z: number
  rotationY: number
}

export interface KitchenAppliances {
  stove: ApplianceAnchor | null
  hood: ApplianceAnchor | null
  fridge: ApplianceAnchor | null
}

export interface WallConfig {
  position: [number, number, number]
  size: [number, number, number]
}

export interface KitchenLayout {
  cabinets: CabinetPlacement[]
  appliances3d: KitchenAppliances
  floorWidth: number
  floorDepth: number
  walls: WallConfig[]
  backsplash: { position: [number, number, number]; size: [number, number, number] }
  cameraDistance: number
  orbitTarget: [number, number, number]
}

interface BuildLayoutInput {
  length: number
  modules: number
  layout: string
  appliances: string
  nonStandard: string
  focus?: QuestionMeta['previewFocus']
  modulesStepPassed?: boolean
}

const { width: W, depth: D, gap: G } = CABINET
const PITCH = W + G
const AISLE = 1.05
const WALL_H = 2.8
const WALL_T = 0.08
const DEFAULT_MODULES = 10

/** Внутренняя поверхность задней стены (z = 0) */
const BACK_Z = D / 2
/** Внутренняя поверхность левой стены (x = 0) */
const LEFT_X = D / 2

function normalizeLayout(layout: string): LayoutType {
  if (layout === 'straight' || layout === 'peninsula') return 'linear'
  return layout as LayoutType
}

const MIN_CABINETS = 3
const MAX_CABINETS = 18

export function resolveCabinetCount(
  length: number,
  modules: number,
  focus?: QuestionMeta['previewFocus'],
  modulesStepPassed = false,
): number {
  const byLength = Math.max(MIN_CABINETS, Math.min(MAX_CABINETS, Math.round(length / PITCH)))
  const byModules = Math.max(MIN_CABINETS, Math.min(MAX_CABINETS, Number(modules) || DEFAULT_MODULES))

  if (focus === 'size') return byLength
  if (focus === 'modules') return byModules
  if (!modulesStepPassed) return byLength

  return byModules
}

function moduleCount(
  length: number,
  modules: number,
  focus?: QuestionMeta['previewFocus'],
  modulesStepPassed?: boolean,
): number {
  return resolveCabinetCount(length, modules, focus, modulesStepPassed)
}

function addRow(
  cabinets: CabinetPlacement[],
  startX: number,
  startZ: number,
  count: number,
  rotationY: number,
  prefix: string,
  opts?: { ovenIdx?: number; hobIdx?: number },
) {
  for (let i = 0; i < count; i++) {
    const along = i * PITCH
    let x = startX
    let z = startZ

    if (rotationY === 0 || Math.abs(rotationY - Math.PI) < 0.01) {
      x = startX + along
    } else {
      z = startZ + along
    }

    cabinets.push({
      id: `${prefix}-${i}`,
      x,
      z,
      rotationY,
      unitType: 'base',
      hasOven: opts?.ovenIdx === i,
      hasHob: opts?.hobIdx === i,
    })
  }
}

/** На шаге модулей — только нижние ящики разных типов, без навесных */
function diversifyModulesPreview(cabinets: CabinetPlacement[]): CabinetPlacement[] {
  const result: CabinetPlacement[] = []
  let baseIdx = 0

  for (const cab of cabinets) {
    if (cab.isIsland || cab.isPeninsula || cab.isExtra) {
      result.push(cab)
      continue
    }

    const i = baseIdx++
    const variant = i % 4

    if (variant === 0) {
      result.push({ ...cab, unitType: 'base' })
    } else if (variant === 1) {
      result.push({ ...cab, unitType: 'drawer', drawerCount: 2 })
    } else if (variant === 2) {
      result.push({ ...cab, unitType: 'drawer', drawerCount: 3 })
    } else {
      result.push({ ...cab, unitType: 'drawer', drawerCount: 4 })
    }
  }

  return result
}

/** После выбора техники — ящики, мойка, витрина, колонна */
function diversifyCabinetTypes(cabinets: CabinetPlacement[], totalModules: number): CabinetPlacement[] {
  const result: CabinetPlacement[] = []
  let baseIdx = 0

  for (const cab of cabinets) {
    if (cab.isIsland || cab.isPeninsula || cab.isExtra) {
      result.push(cab)
      continue
    }

    const i = baseIdx++
    let unitType: UnitType = 'base'

    if (i % 3 === 1) unitType = 'drawer'
    else if (i % 4 === 2) unitType = 'sink'
    else if (i % 5 === 3) unitType = 'glass'
    else if (totalModules >= 10 && i === Math.max(0, baseIdx - 2)) unitType = 'tall'

    result.push({ ...cab, unitType })

  }

  return result
}

function buildLinear(count: number, hasAppliances: boolean): CabinetPlacement[] {
  const cabinets: CabinetPlacement[] = []
  const totalW = count * PITCH - G
  addRow(cabinets, -totalW / 2 + W / 2, BACK_Z, count, 0, 'linear', {
    ovenIdx: Math.floor(count / 2),
    hobIdx: 1,
  })
  return cabinets
}

/** Г-образная: обе стороны прилегают к стенам (задняя z=0, левая x=0) */
function buildCorner(count: number, hasAppliances: boolean): CabinetPlacement[] {
  const cabinets: CabinetPlacement[] = []
  const longCount = Math.max(2, Math.ceil(count * 0.6))
  const shortCount = Math.max(2, count - longCount + 1)

  // длинная сторона вдоль задней стены от левого угла
  addRow(cabinets, LEFT_X, BACK_Z, longCount, 0, 'corner-long', { hobIdx: 1 })
  // короткая сторона вдоль левой стены от того же угла
  addRow(cabinets, LEFT_X, BACK_Z + W / 2 + G, shortCount, Math.PI / 2, 'corner-short', {
    ovenIdx: Math.floor(shortCount / 2),
  })

  return cabinets
}

function buildGalley(count: number, hasAppliances: boolean): CabinetPlacement[] {
  const cabinets: CabinetPlacement[] = []
  const perRow = Math.max(2, Math.ceil(count / 2))
  const frontZ = BACK_Z + AISLE + D

  addRow(cabinets, LEFT_X, BACK_Z, perRow, 0, 'galley-back', { hobIdx: 1 })
  addRow(cabinets, LEFT_X, frontZ, perRow, Math.PI, 'galley-front', {
    ovenIdx: Math.floor(perRow / 2),
  })

  return cabinets
}

function buildUShape(count: number, hasAppliances: boolean): CabinetPlacement[] {
  const cabinets: CabinetPlacement[] = []
  const backCount = Math.max(2, Math.ceil(count * 0.4))
  const sideCount = Math.max(2, Math.ceil((count - backCount) / 2) + 1)

  const backW = backCount * PITCH - G
  const sideStartZ = BACK_Z + W / 2 + G

  addRow(cabinets, -backW / 2 + W / 2, BACK_Z, backCount, 0, 'u-back', {
    ovenIdx: Math.floor(backCount / 2),
  })
  addRow(cabinets, -backW / 2 - D / 2, sideStartZ, sideCount, Math.PI / 2, 'u-left')
  addRow(cabinets, backW / 2 + D / 2, sideStartZ, sideCount, -Math.PI / 2, 'u-right', {
    hobIdx: 1,
  })

  return cabinets
}

function buildIslandBase(count: number, hasAppliances: boolean): CabinetPlacement[] {
  return buildLinear(count, hasAppliances)
}

function addIsland(
  cabinets: CabinetPlacement[],
  islandCount: number,
  hasFull: boolean,
  prefix: string,
) {
  const islandW = islandCount * PITCH - G
  const islandZ = BACK_Z + D + AISLE + 0.3
  for (let i = 0; i < islandCount; i++) {
    cabinets.push({
      id: `${prefix}-${i}`,
      x: -islandW / 2 + W / 2 + i * PITCH,
      z: islandZ,
      rotationY: 0,
      unitType: 'base',
      isIsland: prefix === 'island',
      isPeninsula: prefix === 'peninsula',
      hasHob: hasFull && i === Math.floor(islandCount / 2),
    })
  }
}

function buildIsland(count: number, hasAppliances: boolean, hasFull: boolean): CabinetPlacement[] {
  const cabinets = buildIslandBase(count, hasAppliances)
  addIsland(cabinets, 3, hasFull, 'island')
  return cabinets
}
function computeBounds(cabinets: CabinetPlacement[]) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
  for (const c of cabinets) {
    if (c.unitType === 'wall') continue
    const hw = W / 2 + 0.1
    const hd = D / 2 + 0.1
    minX = Math.min(minX, c.x - hw)
    maxX = Math.max(maxX, c.x + hw)
    minZ = Math.min(minZ, c.z - hd)
    maxZ = Math.max(maxZ, c.z + hd)
  }
  return { minX, maxX, minZ, maxZ, cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2 }
}

function buildWalls(layout: LayoutType, cabinets: CabinetPlacement[]): WallConfig[] {
  const base = cabinets.filter((c) => c.unitType !== 'wall' && !c.isIsland && !c.isPeninsula)
  const walls: WallConfig[] = []

  if (layout === 'corner') {
    const long = base.filter((c) => c.id.startsWith('corner-long'))
    const short = base.filter((c) => c.id.startsWith('corner-short'))

    if (long.length) {
      const maxX = Math.max(...long.map((c) => c.x)) + W / 2
      walls.push({
        position: [maxX / 2, WALL_H / 2, -WALL_T / 2],
        size: [maxX, WALL_H, WALL_T],
      })
    }

    if (short.length) {
      const maxZ = Math.max(...short.map((c) => c.z)) + W / 2
      walls.push({
        position: [-WALL_T / 2, WALL_H / 2, maxZ / 2],
        size: [WALL_T, WALL_H, maxZ],
      })
    }

    return walls
  }

  if (layout === 'u_shape') {
    const back = base.filter((c) => c.id.startsWith('u-back'))
    const left = base.filter((c) => c.id.startsWith('u-left'))
    const right = base.filter((c) => c.id.startsWith('u-right'))

    if (back.length) {
      const xs = back.map((c) => c.x)
      const minX = Math.min(...xs) - W / 2
      const maxX = Math.max(...xs) + W / 2
      walls.push({
        position: [(minX + maxX) / 2, WALL_H / 2, -WALL_T / 2],
        size: [maxX - minX, WALL_H, WALL_T],
      })

      if (left.length) {
        // задняя грань бокового ряда: центр − depth/2 (rotation π/2)
        const leftWallX = left[0].x - D / 2 - WALL_T / 2
        const maxZ = Math.max(...left.map((c) => c.z)) + W / 2
        walls.push({
          position: [leftWallX, WALL_H / 2, maxZ / 2],
          size: [WALL_T, WALL_H, maxZ],
        })
      }

      if (right.length) {
        // задняя грань правого ряда: центр + depth/2 (rotation −π/2)
        const rightWallX = right[0].x + D / 2 + WALL_T / 2
        const maxZ = Math.max(...right.map((c) => c.z)) + W / 2
        walls.push({
          position: [rightWallX, WALL_H / 2, maxZ / 2],
          size: [WALL_T, WALL_H, maxZ],
        })
      }
    }

    return walls
  }

  // линейная, двухрядная, с островом — только задняя стена
  const alongBack = base.filter(
    (c) => Math.abs(c.rotationY) < 0.01 && !c.id.startsWith('galley-front'),
  )
  const row = alongBack.length ? alongBack : base
  const xs = row.map((c) => c.x)
  const minX = Math.min(...xs) - W / 2
  const maxX = Math.max(...xs) + W / 2
  walls.push({
    position: [(minX + maxX) / 2, WALL_H / 2, -WALL_T / 2],
    size: [Math.max(maxX - minX, 1.5), WALL_H, WALL_T],
  })

  return walls
}

function buildBacksplash(layout: LayoutType, cabinets: CabinetPlacement[]) {
  const base = cabinets.filter((c) => c.unitType !== 'wall' && !c.isIsland)

  if (layout === 'u_shape') {
    const back = base.filter((c) => c.id.startsWith('u-back'))
    const xs = back.map((c) => c.x)
    const minX = Math.min(...xs) - W / 2
    const maxX = Math.max(...xs) + W / 2
    return {
      position: [(minX + maxX) / 2, 0.95, WALL_T / 2 + 0.01] as [number, number, number],
      size: [maxX - minX, 0.55, 0.02] as [number, number, number],
    }
  }

  if (layout === 'corner') {
    const long = base.filter((c) => c.id.startsWith('corner-long'))
    const xs = long.map((c) => c.x)
    const minX = Math.min(...xs) - W / 2
    const maxX = Math.max(...xs) + W / 2
    return {
      position: [(minX + maxX) / 2, 0.95, WALL_T / 2 + 0.01] as [number, number, number],
      size: [maxX - minX, 0.55, 0.02] as [number, number, number],
    }
  }

  const row = base.filter((c) => Math.abs(c.rotationY) < 0.01 && !c.id.startsWith('galley-front'))
  const target = row.length ? row : base
  const xs = target.map((c) => c.x)
  const minX = Math.min(...xs) - W / 2
  const maxX = Math.max(...xs) + W / 2
  return {
    position: [(minX + maxX) / 2, 0.95, WALL_T / 2 + 0.01] as [number, number, number],
    size: [maxX - minX, 0.55, 0.02] as [number, number, number],
  }
}

function placeFridgeAnchor(
  baseCabs: CabinetPlacement[],
  layout: LayoutType,
): ApplianceAnchor | null {
  const last = baseCabs[baseCabs.length - 1]
  if (!last) return null

  const offset = layout === 'corner' ? PITCH : PITCH * 0.5
  const fx = last.rotationY === 0 ? last.x + offset : last.x
  const fz = last.rotationY === 0 ? last.z : last.z + offset
  return { x: fx, z: fz, rotationY: last.rotationY }
}

function resolveApplianceAnchors(
  cabinets: CabinetPlacement[],
  appliances: string,
  layout: LayoutType,
  focus?: QuestionMeta['previewFocus'],
  modulesStepPassed = false,
): KitchenAppliances {
  const empty: KitchenAppliances = { stove: null, hood: null, fridge: null }

  const baseCabs = cabinets.filter(
    (c) => !c.isIsland && !c.isPeninsula && c.unitType !== 'wall' && !c.isExtra,
  )

  const hobCab = baseCabs.find((c) => c.hasHob) ?? baseCabs[1] ?? baseCabs[0]
  if (!hobCab) return empty

  const modulesPreviewActive =
    focus === 'modules' || (modulesStepPassed && appliances === 'none')

  if (modulesPreviewActive) {
    return {
      stove: null,
      hood: { x: hobCab.x, z: hobCab.z, rotationY: hobCab.rotationY },
      fridge: placeFridgeAnchor(baseCabs, layout),
    }
  }

  if (appliances === 'none') return empty

  const stove: ApplianceAnchor = { x: hobCab.x, z: hobCab.z, rotationY: hobCab.rotationY }
  const hood: ApplianceAnchor = { x: hobCab.x, z: hobCab.z, rotationY: hobCab.rotationY }

  let fridge: ApplianceAnchor | null = null
  if (appliances === 'full') {
    fridge = placeFridgeAnchor(baseCabs, layout)
  }

  return { stove, hood, fridge }
}

export function buildKitchenLayout(input: BuildLayoutInput): KitchenLayout {
  const layout = normalizeLayout(input.layout)
  const count = moduleCount(input.length, input.modules, input.focus, input.modulesStepPassed)
  const hasAppliances = input.appliances !== 'none'
  const hasFull = input.appliances === 'full'
  const hasExtras = input.nonStandard !== 'none'
  const modulesPreviewActive =
    input.focus === 'modules' ||
    (Boolean(input.modulesStepPassed) && input.appliances === 'none')
  const shouldDiversify = modulesPreviewActive || input.modulesStepPassed

  let cabinets: CabinetPlacement[]

  switch (layout) {
    case 'corner':
      cabinets = buildCorner(count, hasAppliances)
      break
    case 'galley':
      cabinets = buildGalley(count, hasAppliances)
      break
    case 'u_shape':
      cabinets = buildUShape(count, hasAppliances)
      break
    case 'island':
      cabinets = buildIsland(count, hasAppliances, hasFull)
      break
    default:
      cabinets = buildLinear(count, hasAppliances)
  }

  if (hasExtras && layout === 'linear') {
    const last = cabinets[cabinets.length - 1]
    cabinets.push({
      id: 'extra',
      x: last.x + PITCH * 0.8,
      z: last.z,
      rotationY: 0,
      unitType: 'glass',
      isExtra: true,
    })
  }

  if (modulesPreviewActive) {
    cabinets = diversifyModulesPreview(cabinets)
  } else if (shouldDiversify) {
    cabinets = diversifyCabinetTypes(cabinets, count)
  }

  const appliances3d = resolveApplianceAnchors(
    cabinets,
    input.appliances,
    layout,
    input.focus,
    input.modulesStepPassed,
  )

  const bounds = computeBounds(cabinets)
  const pad = 0.8
  const floorWidth = bounds.maxX - bounds.minX + pad * 2
  const floorDepth = bounds.maxZ - bounds.minZ + pad * 2

  const cameraDistance: Record<LayoutType, number> = {
    linear: 4.5,
    corner: 5.2,
    galley: 5.8,
    u_shape: 6.0,
    island: 5.5,
  }

  return {
    cabinets,
    appliances3d,
    floorWidth,
    floorDepth,
    walls: buildWalls(layout, cabinets),
    backsplash: buildBacksplash(layout, cabinets),
    cameraDistance: cameraDistance[layout] + input.length * 0.12,
    orbitTarget: [bounds.cx, 0.5, bounds.cz],
  }
}

export function shouldHighlightCabinet(
  focus: QuestionMeta['previewFocus'] | undefined,
  cabinet: CabinetPlacement,
): boolean {
  if (!focus) return false
  switch (focus) {
    case 'facade':
    case 'modules':
      return !cabinet.isExtra && !cabinet.isIsland && !cabinet.isPeninsula
    case 'countertop':
      return true
    case 'hardware':
      return !cabinet.isExtra
    case 'layout':
      return true
    case 'appliances':
      return !!(cabinet.hasOven || cabinet.hasHob)
    case 'extras':
      return !!cabinet.isExtra
    case 'size':
      return !cabinet.isIsland && !cabinet.isPeninsula && !cabinet.isExtra
    default:
      return false
  }
}
