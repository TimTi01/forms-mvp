import { Box, Typography } from '@mui/material'
import { useMemo, Suspense, lazy } from 'react'
import type { Answers } from '../types'
import type { QuestionMeta } from '../data/questionMeta'
import { FACADE_MATERIALS, COUNTERTOP_MATERIALS } from './kitchen3d/materials'
import { resolveCabinetCount } from './kitchen3d/buildLayout'

const KitchenScene = lazy(() => import('./kitchen3d/KitchenScene'))

interface KitchenPreview3DProps {
  answers: Answers
  focus?: QuestionMeta['previewFocus']
  modulesStepPassed?: boolean
  compact?: boolean
}

export default function KitchenPreview3D({ answers, focus, modulesStepPassed, compact }: KitchenPreview3DProps) {
  const length = Number(answers.length) || 3
  const modules = Number(answers.modules) || 10
  const facade = String(answers.facade || 'ldsp')
  const countertop = String(answers.countertop || 'ldsp')

  const displayCount = useMemo(
    () => resolveCabinetCount(length, modules, focus, modulesStepPassed),
    [length, modules, focus, modulesStepPassed],
  )

  const focusLabel = useMemo(() => {
    const labels: Record<string, string> = {
      size: 'Длина',
      layout: 'Планировка',
      facade: 'Фасады',
      countertop: 'Столешница',
      hardware: 'Фурнитура',
      modules: 'Модули',
      extras: 'Нестандарт',
      appliances: 'Техника',
      overview: 'Итоговый вид',
    }
    return focus ? labels[focus] : 'Превью кухни'
  }, [focus])

  return (
    <Box
      sx={{
        position: 'relative',
        height: compact ? 220 : { xs: 240, sm: 300 },
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
        bgcolor: '#e8edf5',
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0 }}>
        <Suspense
          fallback={
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Загрузка 3D…
              </Typography>
            </Box>
          }
        >
          <KitchenScene answers={answers} focus={focus} modulesStepPassed={modulesStepPassed} />
        </Suspense>
      </Box>

      {/* modules count — top right */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          bgcolor: 'primary.main',
          color: 'white',
          px: 2,
          py: 0.6,
          borderRadius: 10,
          boxShadow: '0 2px 12px rgba(37,99,235,0.35)',
          pointerEvents: 'none',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', lineHeight: 1.2 }}>
          Модулей
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {focus === 'modules' ? modules : displayCount}
        </Typography>
      </Box>

      {/* step label */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          px: 1.5,
          py: 0.5,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          pointerEvents: 'none',
        }}
      >
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
        <Typography variant="caption" sx={{ fontWeight: 600 }} color="text.secondary">
          3D · {focusLabel}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          left: 12,
          zIndex: 10,
          bgcolor: 'rgba(0,0,0,0.45)',
          color: 'white',
          px: 1.25,
          py: 0.4,
          borderRadius: 8,
          pointerEvents: 'none',
        }}
      >
        <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
          🖱 Вращайте модель
        </Typography>
      </Box>

      {focus === 'size' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 44,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'rgba(0,0,0,0.55)',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 10,
            fontSize: '0.75rem',
            fontWeight: 600,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {length} м
        </Box>
      )}

      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          display: 'flex',
          gap: 1,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {[
          { color: FACADE_MATERIALS[facade]?.color ?? '#c4a882', label: 'Фасад' },
          { color: COUNTERTOP_MATERIALS[countertop]?.color ?? '#b8a88a', label: 'Столешница' },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'rgba(255,255,255,0.9)',
              px: 1,
              py: 0.25,
              borderRadius: 6,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: 0.5,
                bgcolor: item.color,
                border: '1px solid rgba(0,0,0,0.12)',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
