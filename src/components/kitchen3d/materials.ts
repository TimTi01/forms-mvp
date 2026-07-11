export const FACADE_MATERIALS: Record<string, { color: string; roughness: number; metalness: number }> = {
  ldsp: { color: '#c4a882', roughness: 0.75, metalness: 0.05 },
  mdf_paint: { color: '#f2f2f2', roughness: 0.35, metalness: 0.1 },
  mdf_film: { color: '#8b6f47', roughness: 0.55, metalness: 0.05 },
  acrylic: { color: '#2d3436', roughness: 0.15, metalness: 0.35 },
}

export const COUNTERTOP_MATERIALS: Record<string, { color: string; roughness: number; metalness: number }> = {
  ldsp: { color: '#b8a88a', roughness: 0.6, metalness: 0.05 },
  stone: { color: '#e8e6e1', roughness: 0.25, metalness: 0.15 },
  quartz: { color: '#f5f2ed', roughness: 0.1, metalness: 0.25 },
}

export const HANDLE_COLORS: Record<string, string> = {
  basic: '#9ca3af',
  standard: '#6b7280',
  premium: '#c9a227',
}

export const CABINET = {
  width: 0.6,
  height: 0.85,
  depth: 0.58,
  counterHeight: 0.04,
  gap: 0.02,
}
