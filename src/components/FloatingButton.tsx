import { Fab } from '@mui/material'
import CalculateIcon from '@mui/icons-material/Calculate'

interface FloatingButtonProps {
  onClick: () => void
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <Fab
      color="primary"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        boxShadow: 4,
      }}
      aria-label="Рассчитать стоимость"
    >
      <CalculateIcon />
    </Fab>
  )
}
