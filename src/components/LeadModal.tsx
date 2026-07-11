import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PhoneIcon from '@mui/icons-material/Phone'
import { getQuestionLabel, questions } from '../data/questions'
import type { Lead } from '../types'

interface LeadModalProps {
  lead: Lead | null
  open: boolean
  onClose: () => void
}

export default function LeadModal({ lead, open, onClose }: LeadModalProps) {
  if (!lead) return null

  const handleCall = () => {
    alert(`Звонок на ${lead.phone}...\n(имитация телефонии Bitrix24)`)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Карточка лида
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">Контакт</Typography>
            <Typography variant="h6">{lead.name}</Typography>
            <Typography color="text.secondary">{lead.phone}</Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<PhoneIcon />}
            onClick={handleCall}
            sx={{ alignSelf: 'flex-start' }}
          >
            Позвонить
          </Button>

          <Divider />

          <Box>
            <Typography variant="overline" color="text.secondary">Стоимость</Typography>
            <Typography variant="h5" color="primary.main" fontWeight={700}>
              {lead.priceRange}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ≈ {lead.totalPrice.toLocaleString('ru-RU')} ₽
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" color="text.secondary">Параметры кухни</Typography>
            {Object.entries(lead.answers).map(([key, value]) => {
              const q = questions.find((item) => item.id === key)
              return (
                <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">{q?.title ?? key}</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {getQuestionLabel(key, value)}
                  </Typography>
                </Box>
              )
            })}
          </Box>

          <Typography variant="caption" color="text.secondary">
            Создан: {new Date(lead.createdAt).toLocaleString('ru-RU')}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  )
}
