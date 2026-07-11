import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Container,
  AppBar,
  Toolbar,
  Link,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import CalculatorModal from '../components/CalculatorModal'
import FloatingButton from '../components/FloatingButton'

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false)

  const openCalculator = () => setModalOpen(true)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: 'text.primary' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700} color="primary">
            КухниНаЗаказ
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link component={RouterLink} to="/bitrix" underline="hover" color="text.secondary" variant="body2">
              CRM
            </Link>
            <Link component={RouterLink} to="/scheme" underline="hover" color="text.secondary" variant="body2">
              О продукте
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Banner */}
      <Box
        sx={{
          bgcolor: '#1a1a2e',
          color: 'white',
          py: 1,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          🎉 Бесплатный замер и 3D-проект при заказе до конца месяца
        </Typography>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.03)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 3, opacity: 0.7, display: 'block', mb: 2 }}
          >
            Кухни на заказ
          </Typography>
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{ fontSize: { xs: '2.2rem', md: '3.5rem' }, lineHeight: 1.15, mb: 3 }}
          >
            Узнайте стоимость кухни за 2 минуты
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.85, fontWeight: 400, mb: 4, maxWidth: 560 }}
          >
            Пройдите калькулятор — получите предварительную цену сразу.
            Без ожидания и лишних звонков.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={openCalculator}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: '#e94560',
              '&:hover': { bgcolor: '#d63851' },
            }}
          >
            Рассчитать стоимость
          </Button>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {[
            { title: 'Мгновенный расчёт', desc: 'Цена обновляется после каждого ответа' },
            { title: 'Без ожидания', desc: 'Не нужно ждать звонка менеджера для ориентира' },
            { title: 'Точные параметры', desc: 'Менеджер получает готовую заявку с данными' },
          ].map((f) => (
            <Box key={f.title} sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>{f.title}</Typography>
              <Typography color="text.secondary">{f.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <FloatingButton onClick={openCalculator} />
      <CalculatorModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  )
}
