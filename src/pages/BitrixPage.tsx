import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import KanbanBoard from '../components/KanbanBoard'

export default function BitrixPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#eef0f5' }}>
      <AppBar position="static" elevation={1} sx={{ bgcolor: '#2fc6f6' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
            CRM — Воронка продаж
          </Typography>
          <Button component={RouterLink} to="/" color="inherit" size="small">
            Лендинг
          </Button>
          <Button component={RouterLink} to="/scheme" color="inherit" size="small">
            О продукте
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ПКМ на карточке — переместить лид в другую колонку. Клик — открыть карточку.
        </Typography>
        <KanbanBoard />
      </Box>
    </Box>
  )
}
